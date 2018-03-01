/**
 * Created by thtf on 2016/10/27.
 */
const gulp = require("gulp")
const concat = require("gulp-concat")
const rename = require("gulp-rename")
const UglifyJs = require("uglify-js")
const minifier = require("gulp-uglify/minifier")
const Task = require("./libs/task")
const path = require("path")
const through2 = require("through2")
const exec = require("child_process").exec

gulp.task("test-uglify-js", function () {
    return gulp.src("1.js").pipe(minifier({ie8:true},UglifyJs)).pipe(gulp.dest("js"))
})

/*
 * 压缩单独的js文件
 * TestCommand : gulp uglify-js --path jh/jhAdd.js
 * 操作本页面独有的js文件,不执行合并操作
 *
 * */
gulp.task("uglify-js", function (finish) {
    const argv = require("yargs")
        .require("dir")
        .argv;
    let dir = path.normalize(argv.dir)
    let task = new Task()
    let sourceJs = task.jsSourceFiles(dir, false)
    let targetPath = task.jsTargetPath(dir)
    let minName = task.jsMinName(dir)
    console.info("sourceJs>>>>>>", sourceJs, "targetPath>>>>>>", targetPath, "minName>>>>>>", minName)
    return gulp.src(sourceJs)
        .pipe(concat("all.js"))
        .pipe(minifier({ie8:true},UglifyJs))
        .pipe(rename(minName))
        .pipe(gulp.dest(targetPath))
})

/**
 * 执行Config.JSconfig中的所有js文件的压缩
 */
gulp.task("uglify-jsconfig", function () {
    let task = new Task()
    let jsConfig = task.Config.JsConfig
    for (let jsFileName in jsConfig) {
        console.info(jsConfig[jsFileName])
        exec("gulp uglify-js --dir " + jsFileName)
    }
})


/*压缩所有js文件*/
gulp.task("uglify-js-all", function () {
    let task = new Task()
    let notIncludeFile = "!"+task.Config.JS_SOURCE_PATH + path.sep + "**" + path.sep + "*.min.js"
    let sourceFiles = task.Config.JS_SOURCE_PATH + path.sep + "**" + path.sep + "*.js"
    let targetFilePath = task.Config.JS_TARGET_PATH
    return gulp.src(Array.of(sourceFiles, notIncludeFile))
        .pipe(through2.obj(function (file, encode, callback) {
            let result = UglifyJs.minify(file, {ie8: true})
            file.content = result.code
            callback(null, file)
        })).pipe(rename(function (fileNameObj) {
            fileNameObj.extname = ".min.js"
        })).pipe(gulp.dest(targetFilePath))
})