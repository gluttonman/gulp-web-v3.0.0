/**
 * Created by thtf on 2016/10/27.
 */
'use strict'
const path = require("path")
class Config{
    constructor(source){
        throw new Error("Config.class is not new")
        return null
    }
}
//相对路径
let relativePath = Config.RELATIVE_PATH = process.cwd() + path.sep
//源文件目录位置
Config.SOURCEDIR = relativePath + "source"
Config.HTML_SOURCE_PATH =  Config.SOURCEDIR + path.sep + "html"
Config.HTML_TARGET_PATH =  relativePath +  "html"
Config.JS_SOURCE_PATH = Config.SOURCEDIR + path.sep + "js"
Config.JS_TARGET_PATH = relativePath +  "js"
Config.CSS_SOURCE_PATH = Config.SOURCEDIR + path.sep + "css"
Config.CSS_TARGET_PATH = relativePath +  "css"
//配置第三方共用的js，css文件
Config.thirdJsKeys = ["jquery","bootstrap"]
Config.thirdCssKeys = ["bootstrap"]

//配置自己开发的，共用的js，css文件
Config.ownJsKeys = ["base"]
Config.ownCssKeys = []

//返回target js文件或者source文件公用方法

Config.getJsTargetFilePath = function(dir){
    return this.getTargetFilePath(this.JsConfig, dir)
}

Config.getCssTargetFilePath = function(dir){
    return this.getTargetFilePath(this.CssConfig, dir)
}
Config.getTargetFilePath = function (config, filename) {
    if(!filename){
        throw new Error("filename is not null")
        return ""
    }
    let filePath = filename
    if(filePath.endsWith(".js") || filePath.endsWith(".css")){
        filePath = filename.substring(0, filename.lastIndexOf("."))
    }

    let dirs = path.normalize(filePath).split(path.sep)
    let fileConfig = config
    let singleFile = undefined
    dirs.forEach((item, index)=>{
        if(!fileConfig || !Object.keys(fileConfig).includes(item)){
            singleFile =  Object.is(config,this.JsConfig)?this.fetchJsSingleFile(filePath, true):this.fetchCssSingleFile(filePath, true)
        }
        fileConfig = fileConfig[item]
    })
    if(singleFile){
        return singleFile
    }
    let sourceFileToTarget = (sourceFileConfig)=>{
        if(!sourceFileConfig || !Object.keys(sourceFileConfig).includes("source") || typeof sourceFileConfig["source"] != "string"){
            console.warn("Config中["+filePath+"]['source'] is not string")
            return Object.is(config,this.JsConfig)?this.fetchJsSingleFile(filePath, true):this.fetchCssSingleFile(filePath, true)
        }
        let sourceFile = sourceFileConfig["source"]
        return Object.is(config, this.JsConfig)?sourceFile.replace(".js",".min.js").replace("source"+path.sep,""):sourceFile.replace(".css",".min.css").replace("source"+path.sep,"")
    }
    return fileConfig && fileConfig["target"]?fileConfig["target"]:sourceFileToTarget(fileConfig)
}


Config.getJsSourceFiles = function(dir){
    return this.getSourceFiles(this.JsConfig, dir)
}

Config.getCssSourceFiles = function(dir){
    return this.getSourceFiles(this.CssConfig, dir)
}

Config.getSourceFiles = function(config, filename){
    if(!filename){
        throw new Error("dir is not null")
        return ""
    }
    let filePath = filename
    if(filePath.endsWith(".js") || filePath.endsWith(".css")){
        filePath = filename.substring(0, filename.lastIndexOf("."))
    }

    let dirs = path.normalize(filePath).split(path.sep)
    let fileConfig = config
    let singleFile
    dirs.forEach((item, index)=>{
        //判断是不是当前需要注入的文件名称，如果是则加载这个页面独有的js，如果不是则不加载。bug jquery/jquery.ztree.core如果没有的时候会加载jquery的源文件
        if(!fileConfig || !Object.keys(fileConfig).includes(item)){
            let argvs = process.argv
            let inFileName = argvs[argvs.indexOf("--dir")+1]
            let inFilePath = inFileName.substring(0,inFileName.lastIndexOf("."))
            if(inFilePath.endsWith(item)){
                singleFile = Object.is(config,this.JsConfig)?this.fetchJsSingleFile(filename, false):this.fetchCssSingleFile(filename, false)
            }
        }
        //当fileConfig中不包含这个文件的配置，则直接加载文件路径
        fileConfig = fileConfig && Object.keys(fileConfig).includes(item)?fileConfig[item]:null
    })

    if(singleFile){//返回页面独有的js文件
        return singleFile
    }
    let dealSourceFileToArray = ()=>{
        if(fileConfig && Object.keys(fileConfig).includes("source")){//包含source字段，肯定是个对象，遍历对象返回value数组
            return Object.keys(fileConfig["source"]).map(function(key){
                return fileConfig["source"][key]
            })
        }else{
            //fileConfig为null时，加载文件目录
            return Object.is(config, this.JsConfig)?this.fetchJsSingleFile(filename,false):this.fetchCssSingleFile(filename, false)
        }

    }
    return fileConfig && fileConfig["source"] &&  typeof fileConfig["source"] == 'string'?fileConfig["source"]:dealSourceFileToArray()
}


Config.fetchJsFilesPath = function (files, min = false){
    let commonJS = []
    files.forEach((key,item)=>{
        if(min){
            commonJS.push(this.getJsTargetFilePath(key))
        }else{
            let sourceFiles = this.getJsSourceFiles(key)
            typeof sourceFiles == "string" ? commonJS.push(sourceFiles) : commonJS=commonJS.concat(sourceFiles)
        }
    })
    return commonJS
}


Config.fetchCssFilesPath = function (files, min = false){
    let commonCss = []
    files.forEach((key,item)=>{
        if(min){
            commonCss.push(this.getCssTargetFilePath(key))
        }else{
            let sourceFiles = this.getCssSourceFiles(key)
            typeof sourceFiles == "string" ? commonCss.push(sourceFiles) : commonCss=commonCss.concat(sourceFiles)
        }
    })
    return commonCss
}

Config.fetchJsSingleFile = function(filePath, min= false){
    if(!filePath.endsWith(".js")){
        filePath +=".js"
    }
    if(min){
        return path.normalize(this.JS_TARGET_PATH + path.sep +  filePath.replace(".js", ".min.js"))
    }else{
        return path.normalize(this.JS_SOURCE_PATH + path.sep + filePath)
    }
}

Config.fetchCssSingleFile = function(filePath, min = false){
    if(!filePath.endsWith(".css")){
        filePath +=".css"
    }
    if(min){
        return path.normalize(this.CSS_TARGET_PATH + path.sep +  filePath.replace(".css", ".min.css"))
    }else{
        return path.normalize(this.CSS_SOURCE_PATH + path.sep + filePath)
    }
}

//注入js css路径文件
let JsConfig = Config.JsConfig = {}

Config.addJsConfig = function(obj){
    Object.assign(JsConfig, obj)
}


Config.addJsConfigByKey = function(key, value){
    JsConfig[key] = value
}

let CssConfig = Config.CssConfig = {}

Config.addCssConfig = function(obj){
    Object.assign(CssConfig, obj)
}

Config.addCssConfigByKey = function(key, value){
    CssConfig[key] = value
}
module.exports = Config