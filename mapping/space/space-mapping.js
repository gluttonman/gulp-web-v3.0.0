/**
 * Created by Lijun on 2016/12/21.
 */

const Mapping = require("../../index.js").Mapping

class SpaceMapping extends Mapping{
    constructor(){
        super()
        this.JsConfig = this.Config.JsConfig
        this.CssConfig = this.Config.CssConfig
        this.SpaceCssConfig = this.CssConfig["space"]
        this.SpaceJsConfig = this.JsConfig["space"]
    }

    extraThirdJs(min = false){
        let zTree
        if(min){
            zTree = this.Config.getJsTargetFilePath("jquery/jquery.ztree.core-3.5")
        }else{
            zTree = this.Config.getJsSourceFiles("jquery/jquery.ztree.core-3.5")
        }
        return Array.of(zTree)
    }

    commonOwnJs(min = false){
        let ownJs = []
        let spaceBaseJs = this.Config.JsConfig["space"]["base"]
        if(min){
            ownJs.push(spaceBaseJs["target"])
        }else{
            let sourceJs = spaceBaseJs["source"]
            ownJs = Object.keys(sourceJs).map((jsFile)=>{
                return sourceJs[jsFile]
            })

        }
        return ownJs
    }
    /*
    * 返回工作室需要的共用的第三方css
    * */
    commonThirdCss(min = false){
        if(min){
            let skins = this.Config.getCssTargetFilePath("skins")
            let loadSpaceCommon = this.Config.getCssTargetFilePath("space/loadSpaceCommon")
            let zTree = this.Config.getCssTargetFilePath("jquery/zTreeStyle")
            return Array.of(skins, loadSpaceCommon, zTree)
        }else {
            let skins = this.Config.getCssSourceFiles("skins")
            let loadSpaceCommon = this.Config.getCssSourceFiles("space/loadSpaceCommon")
            let zTree = this.Config.getCssSourceFiles("jquery/zTreeStyle")
            return Array.of(skins, loadSpaceCommon, zTree)
        }
    }
}


module.exports = SpaceMapping