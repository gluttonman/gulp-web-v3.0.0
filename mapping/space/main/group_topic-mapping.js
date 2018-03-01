/**
 * Created by Lijun on 2016/12/26.
 */


const SpaceMapping = require("../space-mapping")
class Topic extends SpaceMapping{
    constructor(){
        super()
    }

    extraThirdJs(min = false){
        if(min){
            let spacePage = this.Config.getJsTargetFilePath("space/tools/spacePage")
            let moment = this.Config.getJsTargetFilePath("space/tools/moment")
            let loadTemplates = this.Config.getJsTargetFilePath("space/tools")
            return Array.of(spacePage, moment, loadTemplates)
        }else{
            let spacePage = this.Config.getJsSourceFiles("space/tools/spacePage")
            let moment = this.Config.getJsSourceFiles("space/tools/moment")
            let loadTemplates = this.Config.getJsSourceFiles("space/tools")
            return Array.of(spacePage, moment).concat(loadTemplates)
        }
    }
}


module.exports = Topic