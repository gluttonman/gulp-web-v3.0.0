/**
 * Created by Lijun on 2016/12/16.
 */



const Mapping = require("../tasks/libs/mapping")


describe("Mapping",function(){
    describe("#commonThirdJs()", function(){
        it("it will be return array!but, in array dont include array", function(){
            let mapping = new Mapping()
            let array = mapping.commonThirdJs()
            console.info(array)
        })
        it("it will be return min !but, in array dont include array", function(){
            let mapping = new Mapping()
            let array = mapping.commonThirdJs(true)
            console.info(array)
        })
    })
    describe("#commonOwnJs", function(){
        it("it will return ownjs!",function(){
            let mapping = new Mapping()
            let array = mapping.commonOwnJs()
            console.info(array)
        })
        it("it will return ownjs and min!",function(){
            let mapping = new Mapping()
            let array = mapping.commonOwnJs(true)
            console.info(array)
        })
    })


    describe("#extraThirdJs", function(){
        it("it will return extra js file", function(){
            let mapping = new Mapping()
            let array = mapping.extraThirdJs("index", false)
            console.info(array)
        })
    })
})

