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
            const dsWidget = "ds-widget"
            const ueditor = "ueditor"
            const kityPlugin = "kityformula-plugin"
            let jqueryUiWidget = this.Config.getJsSourceFiles(`${dsWidget}/jquery-ui-widget`)
            let duiSearch = this.Config.getJsSourceFiles(`${dsWidget}/dui-search`)
            let duiInput = this.Config.getJsSourceFiles(`${dsWidget}/dui-input`)
            let ueidtorConfig = this.Config.getJsSourceFiles(`${ueditor}/ueditor.config`)
            let ueidtroAll = this.Config.getJsSourceFiles(`${ueditor}/ueditor.all`)
            let addKityFormulaDialog = this.Config.getJsSourceFiles(`${kityPlugin}/addKityFormulaDialog`)
            let getKfContent = this.Config.getJsSourceFiles(`${kityPlugin}/getKfContent`)
            let defaultFilterFix = this.Config.getJsSourceFiles(`${kityPlugin}/defaultFilterFix`)
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
            let thickBox = this.Config.getCssSourceFiles("thickbox")
            let fancyBox = this.Config.getCssSourceFiles("fancybox")
            let dsWidgetCommon = this.Config.getCssSourceFiles("dsWidget/common")
            return Array.of(thickBox, fancyBox, dsWidgetCommon)
        }
    }

    uniqueCss(min=false){
        if(min){
            let articleCss = this.Config.getTargetFilePath(this.SpaceCssConfig, "space_article_pages")
            return Array.of(articleCss)
        }else{
            let articleCss = this.Config.getCssSourceFiles("space_article_pages")
            return Array.of(articleCss)
        }
    }
}

module.exports = JYArticle