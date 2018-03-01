/**
 *
 * Created by Lijun on 2016/12/23.
 */

const Mapping = require("../space-mapping.js")
const path = require("path")

class JYArticle extends Mapping{
    constructor(){
        super()
    }

    extraThirdJs(min = false){
        if(min){
            let jqueryUiWidget = this.Config.getTargetFilePath(this.JsConfig, "ds-widget/jquery-ui-widget")
            let duiSearch = this.Config.getTargetFilePath(this.JsConfig, "ds-widget/dui-search")
            let duiInput = this.Config.getTargetFilePath(this.JsConfig, "ds-widget/dui-input")
            let ueidtorConfig = this.Config.getTargetFilePath(this.JsConfig, "ueditor/ueditor.config")
            let ueidtroAll = this.Config.getTargetFilePath(this.JsConfig, "ueditor/ueditor.all")
            let addKityFormulaDialog = this.Config.getTargetFilePath(this.JsConfig, "ueditor/kityformula-plugin/addKityFormulaDialog")
            let getKfContent = this.Config.getTargetFilePath(this.JsConfig, "ueditor/kityformula-plugin/getKfContent")
            let defaultFilterFix = this.Config.getTargetFilePath(this.JsConfig, "ueditor/kityformula-plugin/defaultFilterFix")
            return Array.of(jqueryUiWidget, duiSearch, duiInput,ueidtorConfig, ueidtroAll, addKityFormulaDialog,getKfContent,defaultFilterFix)
        }else{
            let dsWidgetJs = this.JsConfig["ds-widget"]
            let ueditor = this.JsConfig["ueditor"]
            let kityPlugin = ueditor["kityformula-plugin"]
            let jqueryUiWidget = dsWidgetJs["jquery-ui-widget"]["source"]
            let duiSearch = dsWidgetJs["dui-search"]["source"]
            let duiInput = dsWidgetJs["dui-input"]["source"]
            let ueidtorConfig = ueditor["ueditor.config"]["source"]
            let ueidtroAll = ueditor["ueditor.all"]["source"]
            let addKityFormulaDialog = kityPlugin["addKityFormulaDialog"]["source"]
            let getKfContent = kityPlugin["getKfContent"]["source"]
            let defaultFilterFix = kityPlugin["defaultFilterFix"]["source"]
            return Array.of(jqueryUiWidget, duiSearch,duiInput, ueidtorConfig, ueidtroAll, addKityFormulaDialog, getKfContent, defaultFilterFix)
        }
    }
    extraThirdCss(min = false){
        if(min){
            let thickBox = this.Config.getTargetFilePath(this.CssConfig, "thickbox")
            let fancyBox = this.Config.getTargetFilePath(this.CssConfig, "fancybox")
            let dsWidgetCommon = this.Config.getTargetFilePath(this.CssConfig, "dsWidget/common")
            return Array.of(thickBox, fancyBox, dsWidgetCommon)
        }else{
            let thickBox = this.CssConfig["thickbox"]["source"]
            let fancyBox = this.CssConfig["fancybox"]["source"]
            let dsWidgetCommon = this.CssConfig["dsWidget"]["common"]["source"]
            return Array.of(thickBox, fancyBox, dsWidgetCommon)
        }
    }

    uniqueCss(min=false){
        if(min){
            let articleCss = this.Config.getTargetFilePath(this.SpaceCssConfig, "space_article_pages")
            return Array.of(articleCss)
        }else{
            let articleCss = this.Config.getCssSourceFiles(this.SpaceCssConfig, "space_article_pages")
            return Array.of(articleCss)
        }
    }
}

module.exports = JYArticle