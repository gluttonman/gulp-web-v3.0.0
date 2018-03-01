/**
 * Created by Lijun on 2016/12/27.
 */

const SpaceMapping = require("../space-mapping")


class Score extends SpaceMapping{
    constructor(){
        super()
    }

    commonOwnJs(min = false){
        if(min){
            let spacePage = this.Config.getJsTargetFilePath("space/tools/spacePage")
            return Array.of(spacePage)
        }else{
            let spacePage = this.Config.getJsSourceFiles("space/tools/spacePage")
            return Array.of(spacePage)
        }
    }

    commonOwnCss(min = false){
        if (min) {
            let thickbox = this.Config.getCssTargetFilePath("thickbox/thickbox.css")
            let fancybox = this.Config.getCssTargetFilePath("jquery/jquery.fancybox")
            let common = this.Config.getCssTargetFilePath("dsWidget/common")
            return Array.of(thickbox, fancybox, common)
        } else {
            let thickbox = this.Config.getCssSourceFiles("thickbox/thickbox.css")
            let fancybox = this.Config.getCssSourceFiles("jquery/jquery.fancybox")
            let common = this.Config.getCssSourceFiles("dsWidget/common")
            return Array.of(thickbox, fancybox, common)
        }
    }
    uniqueCss(min = false){
        if(min){
            let groupMember = this.Config.getCssTargetFilePath("space/main/group_member")
            return Array.of(groupMember)
        }else{
            let groupMember = this.Config.getCssSourceFiles("space/main/group_member")
            return Array.of(groupMember)
        }
    }
}


module.exports = Score