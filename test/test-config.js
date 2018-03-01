/**
 * Created by Lijun on 2016/12/16.
 */


const Config = require("../tasks/libs/config")

describe("Config", function(){
    describe("#getTargetFilePath", function () {
        it("it will return a string or array", function () {
            console.info(Config.getJsTargetFilePath("base"))
            console.info(Config.getJsTargetFilePath("jquery"))
        })
    })
    describe("#getSourceFilePath", function () {
        it("it will return a string or array", function () {
            console.info(Config.getJsSourceFilePath("base"))
            console.info(Config.getJsSourceFilePath("jquery"))
        })
    })

    describe("#console process.cwd", function () {
        it("it will console process.cwd", function () {
            console.info()
        })
    })
})