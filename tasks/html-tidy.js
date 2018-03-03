/**
 * Created by thtf on 2016/10/27.
 *
 * Html页面注入js和css页面，
 * 在使用之前需要先将用到的js和css进行压缩和合并处理，html页面整理是不对js和css页面进行合并和压缩处理
 *
 *
 * mapping中的base-mapping.js文件中的commonJs方法返回的js列表，是直接和页面中独有的js文件一起合并压缩的
 *
 *
 */
'use strict'

const gulp = require("gulp")
const concat = require("gulp-concat")
const inject = require("gulp-inject")
const cleanCSS = require("gulp-clean-css")
const rename = require("gulp-rename")
const htmlMin = require("gulp-htmlmin")
const through2 = require("through2")
const contentIncluder = require("gulp-content-includer")
const fs = require("fs")
const path = require("path")

const Task = require("./libs/task")
const Mapping = require("./libs/mapping")
/*
 * TestCommand: gulp tpl --html index.html  || gulp tpl --html jh/jh.html || gulp tpl --html jh/jh.html --min
 *
 * */

const INCLUDE_REG = /<!\-\-\s*include\s*"([^"]+)"\s*\-\->/g
gulp.task("tpl", function (finish) {
    const argv = require("yargs")
        .boolean(["min"])
        .require("dir")
        .argv;
    console.info("gulp tpl is running !")
    let task = new Task()
    let dir  = path.normalize(argv.dir)
    let sourceHtml = task.htmlSourcesFiles(dir, false)
    let targetPath = task.htmlTargetPath(dir)
    gulp.src(sourceHtml)
        .pipe(contentIncluder({
            includerReg: INCLUDE_REG
        }))
        .pipe(rename(function(path){
            path.basename = path.basename.replace(".tpl","")
        }))
        .pipe(gulp.dest(targetPath))
        .pipe(inject(gulp.src(injectFiles(dir, argv.min)), {relative: true}))
        .pipe(gulp.dest(targetPath))
})


gulp.task("tpl-all", function (finish) {
    const argv = require("yargs")
        .boolean(["min", "relative"])
        .argv;
    let dir = argv.dir
    let relative = !argv.relative
    let task = new Task()
    let htmlFiles = task.htmlSourcesFiles(dir,true)
    let htmlTargetPath = task.htmlTargetPath(dir)
    gulp.src(htmlFiles)
        .pipe(contentIncluder({
            includerReg: INCLUDE_REG
        }))
        .pipe(inject(gulp.src([task.Config.JS_SOURCE_PATH + "/index.js", task.Config.CSS_SOURCE_PATH + "/index.css"]), {//至少需要有一个js文件读入，这个文件其实没有实际意义
            transform: function (filePath, file, index, length, targetFile) {
                let relativePath = dir?path.normalize(dir + "/" + targetFile.relative):path.normalize(targetFile.relative)
                relativePath = relativePath.replace(".tpl","")
                let files = injectFiles(relativePath, argv.min)//获取需要向html注入的js、css文件列表
                let compareStuff = file.relative.substring(file.relative.lastIndexOf("."), file.relative.length)
                let fileStr = ""
                files.forEach(function (file, index) {
                    let stuff = file.substring(file.lastIndexOf("."),file.length)
                    if(stuff != compareStuff){
                        return true
                    }
                    if(!fs.existsSync(file)){
                        return true;
                    }
                    if (relative) {
                        file = file.replace("./", "").replace(process.cwd(),"");
                        for (let i = 1,pathLen = deepPath(relativePath); i < pathLen; i++) {
                            file = "../" + file
                        }
                    } else {
                        file = file.replace(".", "")//生成绝对路径
                    }
                    if(compareStuff == ".js"){
                        fileStr += inject.transform.html.js(path.normalize(file).replace(/\\/g,"/")) + "\n"
                    }else{
                        fileStr += inject.transform.html.css(path.normalize(file).replace(/\\/g,"/")) +"\n"
                    }

                })
                return fileStr
            },
            relative: true
        }))
        .pipe(rename(function(path){
            path.basename = path.basename.replace(".tpl","")
        }))
        .pipe(gulp.dest(htmlTargetPath))
})

function deepPath(relativePath) {
    //let path = relativePath.replace("\\", "/")
    let filePath = relativePath.startsWith(path.sep) ? relativePath : path.sep + relativePath
    return filePath.split(path.sep).length

}
function injectFiles(htmlPath, isMin) {
    return injectJsFiles(htmlPath, isMin).concat(injectCssFiles(htmlPath, isMin))

}
function injectJsFiles(htmlPath, isMin) {
    let htmlName = htmlPath.substring(htmlPath.lastIndexOf("/") + 1, htmlPath.lastIndexOf("."))
    let mapping = new Mapping()
    let jsFiles = []
    /*加载共有的第三方js插件*/
    jsFiles = jsFiles.concat(mapping.commonThirdJs(path.normalize(htmlPath), isMin))
    /*加载页面中独有的第三方js文件*/
    jsFiles = jsFiles.concat(mapping.extraThirdJs(path.normalize(htmlPath), isMin))
    /*加载页面共有的自己开发插件*/
    jsFiles = jsFiles.concat(mapping.commonOwnJs(path.normalize(htmlPath), isMin))
    /*加载页面独有的js文件*/
    jsFiles = jsFiles.concat(mapping.uniqueJs(path.normalize(htmlPath.replace(".html",".js")), isMin))
    //去除空
    jsFiles = jsFiles.filter(function(file){
        return file
    })
    console.info(jsFiles)
    return jsFiles
}

function injectCssFiles(htmlPath, isMin) {
    let htmlName = htmlPath.substring(htmlPath.lastIndexOf("/") + 1, htmlPath.indexOf("."))
    let mapping = new Mapping()
    let CssFile = []
    /*加载共有的第三方css插件*/
    CssFile = CssFile.concat(mapping.commonThirdCss(path.normalize(htmlPath), isMin))
    /*加载页面中独有的第三方css文件*/
    CssFile = CssFile.concat(mapping.extraThirdCss(path.normalize(htmlPath), isMin))
    /*加载页面中共有的自己开发的css文件*/
    CssFile = CssFile.concat(mapping.commonOwnCss(path.normalize(htmlPath), isMin))
    /*加载页面中独有的css文件*/
    CssFile = CssFile.concat(mapping.uniqueCss(path.normalize(htmlPath.replace(".html",".css")),isMin))
    CssFile = CssFile.filter(function(file){
        return file
    })
    console.info(CssFile)
    return CssFile
}


function generateTag(files, tag, targetFile) {
    let fileStr = ""
    files.forEach(function (file, index) {
        let relativePath = file.relative
        let stuff = relativePath.substring(relativePath.lastIndexOf("."), relativePath.length)
        console.info(stuff)
        if (stuff != tag) {
            return true
        }
        if (relative) {
            file = file.replace("./", "")
            for (let i = 1; i < deepPath(targetFile.relative); i++) {
                file = "../" + file
            }
        } else {
            file = file.replace(".", "")//生成绝对路径
        }
        if (tag == ".js") {
            fileStr += inject.transform.html.js(file) + "\n"
        } else {
            fileStr += inject.transform.html.css(file) + "\n"
        }

    })
    return fileStr

}