/**
 * Created by Lijun on 2016/12/27.
 */
const SpaceMapping = require("../space-mapping")

class Weike extends SpaceMapping {
    constructor() {
        super()
    }

    extraThirdJs(min = false){
        if(min){
            let widget = this.Config.getJsTargetFilePath("ds-widget/jquery-ui-widget")
            let search = this.Config.getJsTargetFilePath("ds-widget/dui-search")
            return Array.of(widget, search)
        }else{
            let widget = this.Config.getJsSourceFiles("ds-widget/jquery-ui-widget")
            let search = this.Config.getJsSourceFiles("ds-widget/dui-search")
            return Array.of(widget, search)
        }
    }
    commonOwnJs(min = false) {
        if (min) {
            let newConfig = this.Config.getJsTargetFilePath("base/newConfig")
            return Array.of(newConfig)
        } else {
            let newConfig = this.Config.getJsSourceFiles("base/newConfig")
            return Array.of(newConfig)
        }
    }

    uniqueJs(min = false){
        if(min){
            let spacePage = this.Config.getJsTargetFilePath("space/tools/spacePage")
            let  weike = this.Config.getJsTargetFilePath("space/main/group_weike")
            return Array.of(spacePage, weike)
        }else{
            let spacePage = this.Config.getJsSourceFiles("space/tools/spacePage")
            let  weike = this.Config.getJsSourceFiles("space/main/group_weike")
            return Array.of(spacePage, weike)
        }
    }

    extraThirdCss(min = false){
        if(min){
            let uiCommon = this.Config.getCssTargetFilePath("dsWidget/common")
            return Array.of(uiCommon)
        }else{
            let uiCommon = this.Config.getCssSourceFiles("dsWidget/common")
            return Array.of(uiCommon)
        }

    }
    uniqueCss(min = false) {
        if (min) {
            let mainGroup = this.Config.getCssTargetFilePath("space/main_group")
            let weike = this.Config.getCssTargetFilePath("space/main/group_weike")
            return Array.of(mainGroup, weike)
        } else {
            let mainGroup = this.Config.getCssSourceFiles("space/main_group")
            let weike = this.Config.getCssSourceFiles("space/main/group_weike")
            return Array.of(mainGroup, weike)
        }
    }
}

module.exports = Weike