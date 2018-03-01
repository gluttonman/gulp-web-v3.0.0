/**
 * Created by Lijun on 2016/12/27.
 */

const SpaceMapping = require("../space-mapping")

class JyRes extends SpaceMapping{
    constructor(){
        super()
    }

    extraThirdJs(min = false){
        if(min){
            let zTree = this.Config.getJsTargetFilePath("jquery/jquery-ztree-all-3.5")
            let fancybox = this.Config.getJsTargetFilePath("jquery/jquery.fancybox")
            let uiWidget = this.Config.getJsTargetFilePath("ds-widget/jquery-ui-widget")
            let uiSearch = this.Config.getJsTargetFilePath("ds-widget/dui-search")
            let pageConfig = this.Config.getJsTargetFilePath("space/tools/spacePage")
            return Array.of(zTree, fancybox, uiWidget, uiSearch, pageConfig)
        }else{
            let zTree = this.Config.getJsSourceFiles("jquery/jquery-ztree-all-3.5")
            let fancybox = this.Config.getJsSourceFiles("jquery/jquery.fancybox")
            let uiWidget = this.Config.getJsSourceFiles("ds-widget/jquery-ui-widget")
            let uiSearch = this.Config.getJsSourceFiles("ds-widget/dui-search")
            let pageConfig = this.Config.getJsSourceFiles("space/tools/spacePage")
            return Array.of(zTree, fancybox, uiWidget, uiSearch, pageConfig)
        }
    }

    extraThirdCss(min = false){
        if(min){
            let ztreeStyle = this.Config.getCssTargetFilePath("jquery/zTreeStyle")
            let uiCommon = this.Config.getCssTargetFilePath("dsWidget/common")
            let mainGroup = this.Config.getCssTargetFilePath("space/main_group")
            return Array.of(ztreeStyle, uiCommon, mainGroup)
        }else{
            let ztreeStyle = this.Config.getCssSourceFiles("jquery/zTreeStyle")
            let uiCommon = this.Config.getCssSourceFiles("dsWidget/common")
            let mainGroup = this.Config.getCssSourceFiles("space/main_group")
            return Array.of(ztreeStyle, uiCommon, mainGroup)
        }
    }
}


module.exports = JyRes