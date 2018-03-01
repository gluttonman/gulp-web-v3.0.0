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