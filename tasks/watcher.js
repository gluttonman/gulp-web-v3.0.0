/**
 * Created by Lijun on 2016/11/16.
 */


const gulp = require("gulp")
const Task = require("./libs/task")
const exec = require("child_process").exec
const dateFormat = require("dateformat")
gulp.task("watcher", function (finish) {
    const argv = require("yargs")
        .boolean(["min"])
        .argv;
    let task = new Task()
    let htmlPath = (task.Config.HTML_SOURCE_PATH+ "/**/*.tpl.html").replace("./","");
    let notWatherHtml = (task.Config.ROOT + "/common/**/*.tpl.html").replace("./","")
    let jsPath = (task.Config.JS_SOURCE_PATH +"/**/*.js").replace("./","")

    let ueditor = ("!"+task.Config.JS_SOURCE_PATH +"/ueditor/ueditor.all.js")
    let jwplayer = ("!"+task.Config.JS_SOURCE_PATH +"/red5player/jwplayer.js")
    let duiInput = ("!"+task.Config.JS_SOURCE_PATH +"/ds-widget/dui-input.js")
    let artDialog = ("!"+task.Config.JS_SOURCE_PATH +"/base/artDialog.js")
    let cssPath = (task.Config.CSS_SOURCE_PATH + "/**/*.css").replace("./","")
    let watcher = gulp.watch([htmlPath,jsPath,notWatherHtml,ueditor,jwplayer,duiInput,artDialog, cssPath])
    watcher.on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            if(event.type == 'deleted'){
                return
            }
            let path = event.path
            if (path.indexOf("html") > 0) {
                if(path.indexOf("common")>0){
                    console.info(dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss"),path, argv.min)
                    if(argv.min){
                        exec("gulp tpl-all --min")
                    }else{
                        exec("gulp tpl-all")
                    }

                }else{
                    //TODO 此处暂时将.tpl处理掉,待后续有时间修改
                    let relativePath = path.substring(path.indexOf("html")+5,path.length).replace(".tpl","")
                    console.info(dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss"),relativePath, argv.min)
                    if(argv.min){
                        exec("gulp tpl --dir "+ relativePath + " --min")
                    }else{
                        exec("gulp tpl --dir "+ relativePath)
                    }
                }

            } else if(path.indexOf("js")>0){
                let relativePath = path.substring(path.indexOf("js")+3,path.length)
                console.info(dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss"),relativePath)
                exec("gulp uglify-js --dir " + relativePath)
            } else if(path.indexOf("css")>0){
                let relativePath = path.substring(path.indexOf("css")+4,path.length)
                console.info(dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss"),relativePath)
                exec("gulp uglify-css --dir " + relativePath)
            } else {
                console.info("未找到文件类型")
            }
        })
})

