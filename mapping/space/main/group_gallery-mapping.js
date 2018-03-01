/**
 *
 * Created by Lijun on 2016/12/24.
 */
const SpaceMapping = require("../space-mapping")

class Gallery extends SpaceMapping{
    constructor(){
        super()

    }


    extraThirdJs(min = false){
        if(min){
            let lazyload = this.Config.getJsTargetFilePath("jquery/jquery.lazyload")
            let fancyBox = this.Config.getJsTargetFilePath("jquery/jquery.fancybox")
            let plupload = this.Config.getJsTargetFilePath("ds-widget/plupload-parent-common")
            let uiWidget = this.Config.getJsTargetFilePath("ds-widget/jquery-ui-widget")
            let duiTextarea = this.Config.getJsTargetFilePath("ds-widget/dui-textarea")
            let duiInput = this.Config.getJsTargetFilePath("ds-widget/dui-input")
            return Array.of(lazyload, fancyBox, plupload, uiWidget, duiTextarea, duiInput)
        }else{
            let lazyload = this.Config.getJsSourceFiles("jquery/jquery.lazyload")
            let fancyBox = this.Config.getJsSourceFiles("jquery/jquery.fancybox")
            let plupload = this.Config.getJsSourceFiles("ds-widget/plupload-parent-common")
            let uiWidget = this.Config.getJsSourceFiles("ds-widget/jquery-ui-widget")
            let duiTextarea = this.Config.getJsSourceFiles("ds-widget/dui-textarea")
            let duiInput = this.Config.getJsSourceFiles("ds-widget/dui-input")
            return Array.of(lazyload, fancyBox, plupload, uiWidget, duiTextarea, duiInput)
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
}


module.exports = Gallery