/**
 * Created by thtf on 2016/10/31.
 */
'use strict'
const path = require("path")
const Config = require("./config.js")

let __instance = (function(){
    let instance = null
    return (newInstance)=>{
        if (newInstance) instance =  newInstance;
        return instance
    }
})()
/*gulp任务相关的数据提供类*/
class Task {
    constructor(config) {
        if(__instance()){
            return __instance()
        }
        this.Config = config || Config
        __instance(this)
    }

    fetchFilePathObject(config, dir){
        let dirs = dir.split(path.sep)
        if(dirs.length==1){
           return {
               pathObject: config,
               pathName : dir
           }
        }else if(dirs.length==2){
            return {
                pathObject: config[dirs[0]],
                pathName : dirs[1]
            }
        }else {
            let pathSource = config[dirs[0]]
            let key = dirs[dirs.length-1]
            for(let i=1;i<dirs.length-1;i++){
                pathSource = pathSource[dirs[i]]
            }
            return {
                pathObject: pathSource,
                pathName : key
            }
        }
    }

    htmlSourcesFiles(fileName, isAll=false){
        let all = arguments[arguments.length-1]
        let notIncludeHtml ="!" + path.normalize(this.Config.HTML_SOURCE_PATH + "/common/*")
        if(all){
            if(arguments.length>1 && arguments[0]){
                return [path.normalize(this.Config.HTML_SOURCE_PATH+ "/"+fileName+"/**/*.tpl.html"), notIncludeHtml]
            }else{
                return [path.normalize(this.Config.HTML_SOURCE_PATH+"/**/*.tpl.html"),notIncludeHtml]
            }

        }else{
            if(!fileName){
                throw new Error("fileName is not empty")
                return
            }
            return this.Config.HTML_SOURCE_PATH + path.sep + path.normalize(fileName.replace(".html",".tpl.html"))
        }
    }

    jsSourceFiles(dir) {
        return this.Config.getJsSourceFiles(dir)
    }

    cssSourceFiles(dir) {
        return this.Config.getCssSourceFiles(dir)
    }

    jsTargetPath(dir){
        let targetFile = this.Config.getJsTargetFilePath(dir)
        return targetFile.substring(0, targetFile.lastIndexOf(path.sep)+1)
    }

    cssTargetPath(dir){
        let targetFile = this.Config.getCssTargetFilePath(dir)
        return targetFile.substring(0, targetFile.lastIndexOf(path.sep)+1)
    }

    htmlTargetPath(dir){
        if(dir){
            let d = dir.replace(/\/?\w*\.html/,"")
            return path.normalize(this.Config.HTML_TARGET_PATH + "/"+d+"/" )
        }else{
            return path.normalize(this.Config.HTML_TARGET_PATH + path.sep)
        }

    }

    jsMinName(dir){
        let targetFile = this.Config.getJsTargetFilePath(dir)
        return targetFile.substring(targetFile.lastIndexOf(path.sep)+1, targetFile.length)
    }

    cssMinName(dir){
        let targetFile = this.Config.getCssTargetFilePath(dir)
        return targetFile.substring(targetFile.lastIndexOf(path.sep)+1, targetFile.length)
    }
}


module.exports = Task

