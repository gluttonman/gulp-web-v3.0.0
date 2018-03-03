/**
 * Created by thtf on 2016/10/27.
 */
'use strict'
const gulp = require("gulp")
const concat = require("gulp-concat")
const inject = require("gulp-inject")
const cleanCSS = require("gulp-clean-css")
const rename = require("gulp-rename")
const Task = require("./libs/task")
const path = require("path")
const through2 = require("through2")
const exec = require("child_process").exec
/*
 * TestCommand : gulp uglify-css --path jh
 *
 *
 * */
gulp.task("uglify-css", function (finish) {
    const argv = require("yargs")
        .require("dir")
        .argv;
    let dir = path.normalize(argv.dir)
    let task = new Task()
    let cssFiles = task.cssSourceFiles(dir)
    let targetDir = task.cssTargetPath(dir)
    let minName = task.cssMinName(dir)
    console.info("CssFiles >>>", cssFiles, "TargetDir>>>>>>", targetDir, "MinName>>>>>>", minName)
    return gulp.src(cssFiles)
        .pipe(concat("all.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename(minName))
        .pipe(gulp.dest(targetDir));
})


/**
 * 执行Config.CssConfig中的所有css文件的压缩
 */
gulp.task("uglify-css-config", function () {
    let task = new Task()
    let cssConfig = task.Config.CssConfig
    for (let cssFileName in cssConfig) {
        console.info(cssConfig[cssFileName])
        exec("gulp uglify-css --dir " + cssFileName)
    }
})



/*压缩所有js文件*/
gulp.task("uglify-css-all", function () {
    let task = new Task()
    let notIncludeFile = "!"+task.Config.CSS_SOURCE_PATH + path.sep + "**" + path.sep + "*.min.css"
    let sourceFiles = task.Config.CSS_SOURCE_PATH + path.sep + "**" + path.sep + "*.css"
    let targetFilePath = task.Config.CSS_TARGET_PATH
    return gulp.src(Array.of(sourceFiles, notIncludeFile))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename(function (fileNameObj) {
            fileNameObj.extname = ".min.css"
        })).pipe(gulp.dest(targetFilePath))
})