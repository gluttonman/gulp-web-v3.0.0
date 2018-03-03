/**
 * Created by thtf on 2016/10/27.
 */
'use strict'
const GulpWeb = require("./index.js")
const path = require("path")


let WebConfig = GulpWeb.WebConfig

//key的名字就是文件夹的名字
//key的名字就是文件夹的名字
let JsConfig = {
    jquery :{
        target : path.normalize(WebConfig.JS_TARGET_PATH + "/jquery/jquery.min.js"),//如果没有此配置，就默认到项目根目录的jquery/jquery-1.12.4.min.js,
        source:{
            jquery : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery-1.7.2.js"),
            cookie : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery.cookie.js")
        },
        "jquery.lazyload":{
            source : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery.lazyload.js")
        },
        "jquery.fancybox" : {
            source:path.normalize(WebConfig.JS_SOURCE_PATH +"/jquery/jquery.fancybox.js")
        },
        "jquery.portletlazyload" : {
            source : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery.portletlazyload.js")
        },
        "jquery.iview" :{
            source : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery.iview.js")
        },
        "jquery.ztree.all-3.5":{
            source : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery.ztree.all-3.5.js")
        },
        "jquery.ztree.excheck-3.5":{
            source : path.normalize(WebConfig.JS_SOURCE_PATH + "/jquery/jquery.ztree.excheck-3.5.js")
        }
    },
    base :{
        target : path.normalize(WebConfig.JS_TARGET_PATH + "/base/base.min.js"),
        source : {
            template: path.normalize(WebConfig.JS_SOURCE_PATH +"/base/template.js"),
            base64 : path.normalize(WebConfig.JS_SOURCE_PATH + "/base/base64.js"),
            artDialog : path.normalize(WebConfig.JS_SOURCE_PATH + "/base/artDialog.js"),
            thickbox : path.normalize(WebConfig.JS_SOURCE_PATH + "/base/thickbox.js"),
            iframeTools : path.normalize(WebConfig.JS_SOURCE_PATH + "/base/iframeTools.js"),
            baseConfig : path.normalize(WebConfig.JS_SOURCE_PATH + "/base/base-config.js"),
            newConfig : path.normalize(WebConfig.JS_SOURCE_PATH + "/base/newConfig.js")
        }
    },
    "ueditor" : {
        "kityformula-plugin" : {
            "addKityFormulaDialog":{
                source: path.normalize(WebConfig.JS_SOURCE_PATH + "/ueditor/kityformula-plugin/addKityFormulaDialog.js")
            },
            "getKfContent":{
                source : path.normalize(WebConfig.JS_SOURCE_PATH + "/ueditor/kityformula-plugin/getKfContent.js")
            },
            "defaultFilterFix": {
                source : path.normalize(WebConfig.JS_SOURCE_PATH + "/ueditor/kityformula-plugin/defaultFilterFix.js")
            }
        }
    },
    space : {
        base : {
            target : path.normalize(WebConfig.JS_TARGET_PATH + "/space/spaceBase.min.js"),
            source : {
                xss : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/xss.js"),
                org_common : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/main/org_common.js"),
                loadTemplates : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/tools/loadTemplates.js"),
                spaceConfig : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/space-config.js"),
                mainLogin : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/main_login.js"),
                loadSpaceCommon : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/loadSpaceCommon.js")
            }
        },

        tools : {
            spacePage : {
                source : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/tools/spacePage.js")
            },
            moment : {
                source : path.normalize(WebConfig.JS_SOURCE_PATH + "/space/tools/moment.js")
            }
        }
    }
}


let CssConfig = {
    "bootstrap" :{
        target : path.normalize(WebConfig.CSS_TARGET_PATH + "/bootstrap/bootstrap.min.css"),//如果没有此配置，就默认到项目根目录的jquery/jquery-1.12.4.min.js,
        source:{
            "bootstrap" : path.normalize(WebConfig.CSS_SOURCE_PATH + "/bootstrap/bootstrap.css"),
            "bootstrap-theme" : path.normalize(WebConfig.CSS_SOURCE_PATH + "/bootstrap/bootstrap-theme.css")
        },
    }
}


WebConfig.addJsConfig(JsConfig)

WebConfig.addCssConfig(CssConfig)