/**
 * Created by Lijun on 2016/12/16.
 */



const BaseMapping = require("../index.js").Mapping
const path = require("path")
class IndexMapping extends BaseMapping{
    constructor(){
        super()
    }

    extraThirdJs(min = false){
        if(min){
            let jqueryTree = this.Config.JS_TARGET_PATH + path.normalize("/jquery/jquery.ztree.all-3.5.min.js")
            let singleJs = this.Config.getJsTargetFilePath(path.normalize("single/single.js"))
            return Array.of(jqueryTree,singleJs)
        }else{
            let jqueryTree = this.Config.JS_SOURCE_PATH + path.normalize("/jquery/jquery.ztree.all-3.5.js")
            let singleJs = this.Config.getJsSourceFiles(path.normalize("single/single.js"))
            return Array.of(jqueryTree,singleJs)
        }
    }

    extraThirdCss(min = false){

    }
}


module.exports = IndexMapping