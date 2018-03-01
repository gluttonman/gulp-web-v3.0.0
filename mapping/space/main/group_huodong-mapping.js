/**
 * Created by Lijun on 2016/12/24.
 */
/**
 *
 * Created by Lijun on 2016/12/24.
 */
const SpaceMapping = require("../space-mapping")
const path = require("path")
class Huodong extends SpaceMapping{
    constructor(){
        super()

    }


    extraThirdJs(min = false){
        if(min){
            let uiWidget = this.Config.getJsTargetFilePath("ds-widget/jquery-ui-widget")
            let duiSearch = this.Config.getJsTargetFilePath("ds-widget/dui-search")
            let ueditorConfig = this.Config.getJsTargetFilePath("ueditor/ueditor.config")
            let ueditorAll = this.Config.getJsTargetFilePath("ueditor/ueditor.all")
            let addKityFormulaDialog = this.Config.getJsTargetFilePath("ueditor/kityformula-plugin/addKityFormulaDialog")
            let getKfContent = this.Config.getJsTargetFilePath("ueditor/kityformula-plugin/getKfContent")
            let defaultFilterFix = this.Config.getJsTargetFilePath("ueditor/kityformula-plugin/defaultFilterFix")

            return Array.of(uiWidget, duiSearch, ueditorConfig, ueditorAll, addKityFormulaDialog, getKfContent, defaultFilterFix)
        }else{
            let uiWidget = this.Config.getJsSourceFiles("ds-widget/jquery-ui-widget")
            let duiSearch = this.Config.getJsSourceFiles("ds-widget/dui-search")
            let ueditorConfig = this.Config.getJsSourceFiles("ueditor/ueditor.config")
            let ueditorAll = this.Config.getJsSourceFiles("ueditor/ueditor.all")
            let addKityFormulaDialog = this.Config.getJsSourceFiles("ueditor/kityformula-plugin/addKityFormulaDialog")
            let getKfContent = this.Config.getJsSourceFiles("ueditor/kityformula-plugin/getKfContent")
            let defaultFilterFix = this.Config.getJsSourceFiles("ueditor/kityformula-plugin/defaultFilterFix")
            return Array.of(uiWidget, duiSearch, ueditorConfig, ueditorAll, addKityFormulaDialog, getKfContent, defaultFilterFix)
        }
    }

    extraThirdCss(min = false){
        if(min){
            let thickBox = this.Config.getCssTargetFilePath("thickbox")
            let fancyBox = this.Config.getCssTargetFilePath("fancybox")
            let dsWidgetCommon = this.Config.getCssTargetFilePath("dsWidget/common")
            return Array.of(thickBox, fancyBox, dsWidgetCommon)
        }else{
            let thickBox = this.Config.getCssSourceFiles("thickbox")
            let fancyBox = this.Config.getCssSourceFiles("fancybox")
            let dsWidgetCommon = this.Config.getCssSourceFiles("dsWidget/common")
            return Array.of(thickBox, fancyBox, dsWidgetCommon)
        }
    }

    uniqueCss(min = false){
        if(min){
            let articlePage = this.Config.getCssTargetFilePath("space/space_article_pages")
            let huodongCss = path.normalize(this.Config.CSS_TARGET_PATH + "/space/main/group_huodong.min.css")
            return Array.of(articlePage, huodongCss)
        }else{
            let articlePage = this.Config.getCssSourceFiles("space/space_article_pages")
            let huodongCss = path.normalize(this.Config.CSS_SOURCE_PATH + "/space/main/group_huodong.css")
            return Array.of(articlePage, huodongCss)
        }
    }
}


module.exports = Huodong