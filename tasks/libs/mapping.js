/**
 * Created by Lijun on 2016/12/15.
 */


const BaseConfig = require("./config")
const fs = require("fs")
const path = require("path")
class Mapping {
    constructor(config) {
        this.Config = config || BaseConfig
    }

    commonThirdJs(filePath, min = false) {
        let thirdJs = this.Config.fetchJsFilesPath(this.Config.thirdJsKeys, min)
        return thirdJs.concat(this.getSubInjectFiles(filePath, "commonThirdJs", min))
    }

    extraThirdJs(filePath, min = false) {
        return this.getSubInjectFiles(filePath, "extraThirdJs", min)
    }

    commonOwnJs(filePath, min = false) {
        let ownJs = this.Config.fetchJsFilesPath(this.Config.ownJsKeys, min)
        return ownJs.concat(this.getSubInjectFiles(filePath, "commonOwnJs", min))
    }

    uniqueJs(filePath, min = false) {
        let subMappingName = this.getSubMappingPath(filePath)
        if (fs.existsSync(subMappingName)) {
            let SubMapping = require(subMappingName)
            let subMapping = new SubMapping()
            let hasOwnFunction = Object.getOwnPropertyDescriptor(SubMapping.prototype, "uniqueJs")
            return hasOwnFunction ? subMapping.uniqueJs(min) : this.Config.fetchJsSingleFile(filePath, min)
        } else {
            return this.Config.fetchJsSingleFile(filePath, min)
        }

    }

    commonThirdCss(filePath, min = false) {
        let thirdCss = this.Config.fetchCssFilesPath(this.Config.thirdCssKeys, min)
        return thirdCss.concat(this.getSubInjectFiles(filePath, "commonThirdCss", min))
    }

    extraThirdCss(filePath, min = false) {
        return this.getSubInjectFiles(filePath, "extraThirdCss", min)
    }

    commonOwnCss(filePath, min = false) {
        let ownCss = this.Config.fetchCssFilesPath(this.Config.ownCssKeys, min)
        return ownCss.concat(this.getSubInjectFiles(filePath, "commonOwnCss", min))
    }

    uniqueCss(filePath, min = false) {
        let subMappingName = this.getSubMappingPath(filePath)
        if (fs.existsSync(subMappingName)) {
            let SubMapping = require(subMappingName)
            let subMapping = new SubMapping()
            let hasOwnFunction = Object.getOwnPropertyDescriptor(SubMapping.prototype, "uniqueCss")
            return hasOwnFunction ? subMapping.uniqueCss(min) : this.Config.fetchCssSingleFile(filePath, min)
        } else {
            return this.Config.fetchCssSingleFile(filePath, min)
        }
    }

    getSubMappingPath(filePath) {
        let fileName = filePath.substring(0, filePath.lastIndexOf("."))
        return path.normalize(process.cwd() + "/mapping/" + fileName + "-mapping.js")
    }

    getSubInjectFiles(htmlPath, propertyKey, min = false) {
        if (htmlPath.indexOf(path.sep) != -1) {//判断传第过来的路径 有没有“/”， 没有就是首页下面的
            let paths = htmlPath.split(path.sep)
            let fileName = paths.pop().replace(/.html|.js|.css/,"")
            let filePath = ""
            let files = []
            paths.forEach(function (item, index) {
                filePath += item + "/"
                let subMappingName = ""
                if (index == (paths.length - 1)) {
                    subMappingName = path.normalize(process.cwd() + "/mapping/" + filePath + fileName + "-mapping.js")
                } else {
                    subMappingName = path.normalize(process.cwd() + "/mapping/" + filePath + item + "-mapping.js")
                }
                if (fs.existsSync(subMappingName)) {
                    let SubMapping = require(subMappingName)
                    let subMapping = new SubMapping()
                    let hasOwnFunction = Object.getOwnPropertyDescriptor(SubMapping.prototype, propertyKey)
                    if (hasOwnFunction) {
                        files = files.concat(subMapping[propertyKey](min))
                    }
                }
            })
            return files
        } else {
            let subMappingName = this.getSubMappingPath(htmlPath)
            let files = []
            if (fs.existsSync(subMappingName)) {
                let SubMapping = require(subMappingName)
                let subMapping = new SubMapping()
                let hasOwnFunction = Object.getOwnPropertyDescriptor(SubMapping.prototype, propertyKey)
                if (hasOwnFunction) {
                    files = files.concat(subMapping[propertyKey](min))
                }
            }
            return files
        }
    }
}


module.exports = Mapping