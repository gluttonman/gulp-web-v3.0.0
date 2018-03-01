/**
 * Created by Lijun on 2017/1/6.
 */

'use strict'
require("require-dir")("./tasks",{recurse: false})

exports.WebConfig = require("./tasks/libs/config.js")

exports.Mapping = require("./tasks/libs/mapping.js")