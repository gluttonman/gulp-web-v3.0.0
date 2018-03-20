var struc, moke_id;
$(function () {
    moke_id = GetQueryString("id");

    if (!(org_id && moke_id)) {
        art.dialog.alert("非法请求地址!");
        return false;
    }

    $(".fancybox").fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        afterShow: function () {
            var td = $(".fancybox")[this.index];
            var resource_title2 = $(td).attr("title");
            //resource_title2 = resource_title2.replace("'","‘");
            var resultStr = '<div class="fancybox-title fancybox-title-outside-wrap-tool">' + resource_title2 + '</div>';
            $(resultStr).appendTo(this.wrap);
        }
    });

    loadMainNav();
    getDetail();
});

/*加载标签模板*/
function loadMainNav() {
    var html = template("mainGroupNavInner", {});
    $("#groupMain").html(html);
}


var detail = null;
function getDetail() {
    $.ajax({
        async: false,
        url: url_path_html + "/yx/moke/getMokeById?random_num=" + Math.random(),
        type: "post",
        data: {
            "moke_id": moke_id
        },
        dataType: "json",
        success: function (data) {
            if (data.success) {
                detail = data;
                $("#mk_title").text(data.title);
                $("#mk_person_name").text(data.person_name);
                $("#mk_stage_subject").text(data.stage_name + data.subject_name);
                $("#zhuanjia_name").text(group_data.CREATOR_NAME);
                initStatus(data.status);
            }
        }
    });

}

function initStatus(status) {
    if (status == 1) {
        initKeli(1);
        if (is_admin == 1) {
            $("#fujianBtn_1").show();
            $("#yijianBtn_1").show();
            $("#comment_1").removeAttr("disabled");
            $("#zxzhdiao_1").show();
        }
        if ($.cookie("person_id") == detail.person_id) {
            $("#changeBtn_1").show();
            $("#zxzhdiao_1").show();
        }
    } else if (status == 2) {
        initKeli(1);
        initKeli(2);
        $("#fujianBtn_1").hide();
        $("#yijianBtn_1").hide();
        $("#changeBtn_1").hide();
        if (is_admin == 1) {
            $("#fujianBtn_2").show();
            $("#yijianBtn_2").show();
            $("#comment_2").removeAttr("disabled");
            $("#zxzhdiao_2").show();
        }
        if ($.cookie("person_id") == detail.person_id) {
            $("#changeBtn_2").show();
            $("#zxzhdiao_2").show();
        }
    } else if (status == 3) {
        initKeli(1);
        initKeli(2);
        initKeli(3);
        $("#fujianBtn_1").hide();
        $("#yijianBtn_1").hide();
        $("#changeBtn_1").hide();
        $("#fujianBtn_2").hide();
        $("#yijianBtn_2").hide();
        $("#changeBtn_2").hide();
        if (is_admin == 1) {
            $("#fujianBtn_3").show();
            $("#yijianBtn_3").show();
            $("#comment_3").removeAttr("disabled");
            $("#changeBtn_3").show();
            $("#zxzhdiao_3").show();
        }
        if ($.cookie("person_id") == detail.person_id) {
            $("#zxzhdiao_3").show();
        }
    } else if (status == 4) {
        initKeli(1);
        initKeli(2);
        initKeli(3);
        //完成课例不能在点击完成
        $("#changeBtn_3").attr("disabled","disabled");
    }
}

function initKeli(type, status) {
    var html = template("tab_template", {type: type});
    $("#tab_" + type).html(html);
    initResource(type);
    getZhidaoyijian(type);


}

function initResource(type, change) {
    if (type == 1) {
        showResourceList(1);
        showResourceList(2);
        showResourceList(3);
        showResourceList(4);
        showResourceList(5);
    } else if (type == 2) {
        showResourceList(6, change);
        showResourceList(7, change);
        showResourceList(8, change);
        showResourceList(9, change);
        showResourceList(10, change);
    } else if (type == 3) {
        showResourceList(11, change);
        showResourceList(12, change);
        showResourceList(13, change);
        showResourceList(14, change);
        showResourceList(15, change);
        showResourceList(16, change);
        showResourceList(17, change);
    }
}

function showResourceList(type, change) {
    var url = url_path_html + "/space/ypt/getResourceAll?t=" + Math.random();
    $.ajax({
        url: url,
        type: 'post',
        data: {
            res_type: 51,
            pageNumber: 1,
            pageSize: 100,
            rtype: 0,
            beike_type: type,
            view: moke_id,
            sort_num: 2
        },
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                if (null != data.list && data.list.length > 0) {
                    data = addServerUrlToJson(data);
                    upDataToJson(data, 1);
                    beforeRender(data);
                    if (change && null != $.cookie("person_id") && $.cookie("person_id") == detail.person_id) {
                        data.is_mine = 1;
                    } else {
                        data.is_mine = 0;
                    }
                    data.reType = type;
                    data.toJSONString = toJsonString;
                    var html = template.render('resource_list_template', data);
                    $("#resource_list_" + type).html(html);
                } else {
                    $("#resource_list_" + type).parent("li.boxli").hide()
                }
            }
        }
    });
}
function toJsonString(json) {
    return Base64.encode(JSON.stringify(json))
}
/*重命名后刷新列表*/
function changeBack(type) {
    setTimeout(function () {
        showResourceList(type, true);
    }, 3000);
}


function getZhidaoyijian(type) {
    var type_id = "yx_comment_51_" + moke_id + "_" + type;
    $.ajax({
        type: "GET",
        async: true,
        data: {
            "random_num": creatRandomNum(),
            "pageNumber": 1,
            "pageSize": pageSize,
            "sort": 1,
            "type_id": type_id,
            "message_type": 2
        },
        url: url_path_html + "/bbs/topic/view",
        dataType: "json",
        success: function (data) {
            if (data.success) {
                if (data.reply_list.length > 0) {
                    $("#comment_" + type).val(data.reply_list[0].content);
                }
            }
        }
    });
}

function saveZhidaoyijian(type) {
    var type_id = "yx_comment_51_" + moke_id + "_" + type;
    var content = $("#comment_" + type).val();
    $.ajax({
        type: "post",
        async: false,
        data: {
            "person_id": $.cookie("person_id"),
            "person_name": $.cookie("person_name"),
            "identity_id": $.cookie("identity_id"),
            "context": content,
            "message_type": 2,
            "type_id": type_id,
            "parent_id": ""
        },
        url: url_path_html + "/ypt/bbs/message/save",
        dataType: "json",
        success: function (data) {
            dialogClose("已提交成功！", 2, 200);
            $("#yijianBtn_"+type).attr("disabled","disabled")
            $("#comment_"+type).attr("disabled","disabled")
        }
    });
}

function uploadResource(type_id) {
    var appType_id = 0;
    if (type_id == 1) {
        appType_id = 2;
    } else if (type_id == 2) {
        appType_id = 3;
    } else if (type_id == 3) {
        appType_id = 13;
    } else {
        appType_id = 17;
    }

    hj_type = type_id;
    var url = url_path_html + "/yx/html/resource/uploadYxResource.html";
    url += "?service_type=" + 51;
    url += "&service_id=" + moke_id;
    url += "&hj_id=" + type_id;
    url += "&res_type=" + 14;
    url += "&stage_id=" + detail.stage_id;
    url += "&subject_id=" + detail.subject_id;
    url += "&scheme_id=" + detail.scheme_id;
    url += "&structure_id=" + detail.structure_id;
    url += "&appType_id=" + appType_id;
    url += "&TB_iframe=true";
    url += "&height=" + 450;
    url += "&width=" + 720;
    tb_show("上传资源", url, "thickbox");
}


var hj_type = 1;
function tb_remove() {
    $("#TB_imageOff").unbind("click");
    $("#TB_closeWindowButton").unbind("click");
    $("#TB_window").fadeOut("200", function () {
        $('#TB_iframeContent').remove();
        $('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();
    });
    $("#TB_load").remove();

    document.onkeydown = "";
    document.onkeyup = "";
    showResourceList(hj_type);
    return false;
}

function changeResource(type) {
    type = type + 1;
    if (type == 4) {
        submitMoke(4);
    } else {
        var str = '<div><button class="btn btn-default btn-sm" onclick="followInitial(' + type + ', this)">延用</button></div><div id="otherInfoPannel" style="width:400px">';
        str += '<div class="form-group">';
        str += '<span>教学设计(必填)<span style="color:red">*</span>：</span>';
        str += '<button class="btn btn-primary btn-sm ml10" onclick="uploadResource(' + (type == 2 ? 6 : 11) + ')" type="button">上传</button>';
        str += '<div id="resource_list_' + (type == 2 ? 6 : 11) + '"></div>';
        str += '</div>';
        str += '<div class="form-group">';
        str += '<span>教学课件(必填)<span style="color:red">*</span>：</span>';
        str += '<button class="btn btn-primary btn-sm ml10" onclick="uploadResource(' + (type == 2 ? 7 : 12) + ')" type="button">上传</button>';
        str += '<div id="resource_list_' + (type == 2 ? 7 : 12) + '"></div>';
        str += '</div>';
        str += '<div class="form-group">';
        str += '<span>教学素材：</span>';
        str += '<button class="btn btn-primary btn-sm ml10" onclick="uploadResource(' + (type == 2 ? 8 : 13) + ')" type="button">上传</button>';
        str += '<div id="resource_list_' + (type == 2 ? 8 : 13) + '"></div>';
        str += '</div>';
        str += '<div class="form-group">';
        if (type == 3) {
            str += '<span>课堂实录(必填)<span style="color:red">*</span>：</span>';
        } else {
            str += '<span>课堂实录：</span>';
        }

        str += '<button class="btn btn-primary btn-sm ml10" onclick="uploadResource(' + (type == 2 ? 9 : 14) + ')" type="button">上传</button>';
        str += '<div id="resource_list_' + (type == 2 ? 9 : 14) + '"></div>';
        str += '</div>';
        if (type == 3) {
            str += '<div class="form-group">';
            str += '<span>教学反思<span style="color:red">*</span>：</span>';
            str += '<button class="btn btn-primary btn-sm ml10" onclick="uploadResource(16)" type="button">上传</button>';
            str += '<div id="resource_list_16"></div>';
            str += '</div>';
            str += '<div class="form-group">';
            str += '<span>设计思路：</span>';
            str += '<button class="btn btn-primary btn-sm ml10" onclick="uploadResource(17)" type="button">上传</button>';
            str += '<div id="resource_list_17"></div>';
            str += '</div>';
        }
        str += '</div>';

        art.dialog({
            height: 300,
            width: 400,
            zIndex: 10,
            fixed: true,
            title: '修改课例',
            lock: true,
            content: str,
            init: function () {
                initResource(type, true);
            },
            button: [{
                name: '保存',
                callback: function () {
                    dialogClose("保存成功！", 2, 200);
                    return true;
                },
                focus: true
            }, {
                name: '保存并提交',
                callback: function () {
                    var success = checkResource(type);
                    if (success) {
                        success = submitMoke(type);
                    }
                    return success;
                }
            }]
        });
    }
}

function followInitial(type, btn) {
    $(btn).attr("disabled", true)
    var offset = type == 2 ? 1 : 6
    var wrapper = $("#collapse" + (type - 1))
    var modifyWrapper = $("#otherInfoPannel")
    var designObject = wrapper.find("#resource_list_" + (offset++)).find(".fj-overflow") //初始设计对象
    var modifyDesignElements = modifyWrapper.find("#resource_list_" + (offset + 4)).find(".fj-overflow")//修改设计对象，正常是差5个，因为本身自增1加4
    var designText = ""
    for (var i = 0; i < designObject.length; i++) {
        var initialDesignResource = dealSelectedResourceData($(designObject[i]).attr("id"))
        if (isInModifyResource(initialDesignResource["resource_id_int"], modifyDesignElements)) {//如果资源已在修改列表中， 则该资源不可选
            designText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(designObject[i]).attr("id") + '" checked="checked" disabled="disabled" type="checkbox" name="design" value="' + designObject[i].innerText + '">' + designObject[i].innerText +
                '</label>' +
                '</div>'
        } else {
            designText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(designObject[i]).attr("id") + '" type="checkbox" name="design" value="' + designObject[i].innerText + '">' + designObject[i].innerText +
                '</label>' +
                '</div>'
        }

    }
    var courseware = wrapper.find("#resource_list_" + (offset++)).find(".fj-overflow")
    var modifyCourseWareElements = modifyWrapper.find("#resource_list_" + (offset + 4)).find(".fj-overflow")
    var coursewareText = ""
    for (var i = 0; i < courseware.length; i++) {
        var initialCoursewareResource = dealSelectedResourceData($(courseware).attr("id"))
        if (isInModifyResource(initialCoursewareResource["resource_id_int"], modifyCourseWareElements)) {
            coursewareText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(courseware[i]).attr("id") + '" checked="checked" disabled="disabled" type="checkbox" name="courseware" value="' + courseware[i].innerText + '">' + courseware[i].innerText +
                '</label>' +
                '</div>'
        } else {
            coursewareText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(courseware[i]).attr("id") + '" type="checkbox" name="courseware" value="' + courseware[i].innerText + '">' + courseware[i].innerText +
                '</label>' +
                '</div>'
        }

    }
    var resourceObject = wrapper.find("#resource_list_" + (offset++)).find(".fj-overflow")
    var modifyResourceElements = modifyWrapper.find("#resource_list_" + (offset + 4)).find(".fj-overflow")
    var resourceText = ""
    for (var i = 0; i < resourceObject.length; i++) {
        var initialResource = dealSelectedResourceData($(resourceObject).attr("id"))
        if (isInModifyResource(initialResource["resource_id_int"]), modifyResourceElements) {
            resourceText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(resourceObject[i]).attr("id") + '" type="checkbox" checked="checked" disabled="disabled" name="resource" value="' + resourceObject[i].innerText + '">' + resourceObject[i].innerText +
                '</label>' +
                '</div>'
        } else {
            resourceText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(resourceObject[i]).attr("id") + '" type="checkbox" name="resource" value="' + resourceObject[i].innerText + '">' + resourceObject[i].innerText +
                '</label>' +
                '</div>'
        }

    }
    var videoObject = wrapper.find("#resource_list_" + (offset++)).find(".fj-overflow")
    var modifyVideoElements = modifyWrapper.find("#resource_list_" + (offset + 4)).find(".fj-overflow")
    var videoText = ""
    for (var i = 0; i < videoObject.length; i++) {
        var initialVideoResource = dealSelectedResourceData($(videoObject).attr("id"))
        if (isInModifyResource(initialVideoResource["resource_id_int"], modifyVideoElements)) {
            videoText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(videoObject[i]).attr("id") + '" type="checkbox" checked="checked" disabled="disabled" name="video" value="' + videoObject[i].innerText + '">' + videoObject[i].innerText +
                '</label>' +
                '</div>'
        } else {
            videoText += '<div class="checkbox follow-text">' +
                '<label>' +
                '<input id="' + $(videoObject[i]).attr("id") + '" type="checkbox" name="video" value="' + videoObject[i].innerText + '">' + videoObject[i].innerText +
                '</label>' +
                '</div>'
        }

    }
    var str = '"add\"a\"sd"' + '"sdasdfasd"'
    var resourceList = '<div class="checkbox" onclick="selectCheckbox(this)" >' +
        '<label>' +
        '<input  type="checkbox" name="all" value="">全选' +
        '</label>' +
        '</div>' +
        '<ul class="follow-wrapper" id="follow-resource-list"><li class="boxli">' +
        '<div class="checkbox" onclick="selectCheckbox(this)"><label><input type="checkbox" name="design"  value=""/>教学设计：</label></div><div id="resource_follow_' + (offset++) + '">' + designText + '</div>' +
        '<div class="clear"></div>' +
        '</li>' +
        '<li class="boxli">' +
        '<div class="checkbox" onclick="selectCheckbox(this)"><label><input type="checkbox" name="courseware" value=""/>教学课件：</label></div><div id="resource_follow_' + (offset++) + '">' + coursewareText + '</div>' +
        '<div class="clear"></div>' +
        '</li>' +
        '<li class="boxli">' +
        '<div class="checkbox" onclick="selectCheckbox(this)"><label><input type="checkbox" name="resource" value=""/>教学素材：</label></div><div id="resource_follow_' + (offset++) + '">' + resourceText + '</div>' +
        '<div class="clear"></div>' +
        '</li>' +
        '</li>' +
        '<li class="boxli">' +
        '<div class="checkbox" onclick="selectCheckbox(this)"><label><input type="checkbox" name="video"  value=""/>课堂实录：</label></div><div id="resource_follow_' + (offset++) + '">' + videoText + '</div>' +
        '<div class="clear"></div>' +
        '</li>'
    '</ul>'
    art.dialog({
        height: 350,
        width: 450,
        zIndex: 20,
        fixed: true,
        title: '延用资源列表',
        lock: true,
        content: resourceList,
        init: function () {
            // initFollowResource(type,true);
            //重新设置zIndex
            var $dialog = $(".aui_state_lock")
            var indexArr = []
            for (var i = 0; i < $dialog.length; i++) {
                indexArr.push($($dialog[i]).css("z-index"))
            }
            var maxIndex = Math.max.apply(null, indexArr)
            $(".aui_state_focus").zIndex(maxIndex + 5)
        },
        close: function () {
            $(this).remove()
            $(btn).attr("disabled", false)
        },
        button: [{
            name: '确定',
            callback: function () {

                var selectedResourceObject = showSelectedFollowResource(type);
                if (selectedResourceObject.getSelectedFollowResource().length == 0) {//没有选择返回
                    $(btn).attr("disabled", false)
                    $(this).remove()
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: url_path_html + "/yx/moke/addFollowResource",
                    dataType: "json",
                    data: {"ResourceData": JSON.stringify(selectedResourceObject.getSelectedFollowResource())},
                    success: function(res){
                        if (res.success) {
                            selectedResourceObject.appendSelectedFollowResource(res.data)
                            dialogClose("保存成功！", 2, 200);
                            $(this).remove()
                            $(btn).attr("disabled", false)
                            return true;
                        } else {
                            dialogClose("保存失败！", 2, 200);
                            $(btn).attr("disabled", false)
                            return false;
                        }
                    }
                })
            },
            focus: true
        }]
    });
}
/*处理回显资源，并将选择的沿用资源返回到数据库保存*/
function showSelectedFollowResource(type) {
    var designList = $("#follow-resource-list").find("input[name='design']")
    var coursewareList = $("#follow-resource-list").find("input[name='courseware']")
    var resourceList = $("#follow-resource-list").find("input[name='resource']")
    var videoList = $("#follow-resource-list").find("input[name='video']")
    var designData = []//resource_list_template 模板渲染需要的输
    var selectedFollowResource = []//返回选择的沿用资源保存数据库
    for (var i = 0; i < designList.length; i++) {
        if ($(designList[i]).attr("disabled") != "disabled" && $(designList[i]).attr("checked") && $(designList[i]).val()) {//选择的checkbox有值，并且disabled不等于disabled,checked=true
            designData.push(dealSelectedResourceData($(designList[i]).attr("id"), selectedFollowResource))
        }
    }
    var courseData = []
    for (var i = 0; i < coursewareList.length; i++) {
        if ($(coursewareList[i]).attr("disabled") != "disabled" && $(coursewareList[i]).attr("checked") && $(coursewareList[i]).val()) {
            courseData.push(dealSelectedResourceData($(coursewareList[i]).attr("id"), selectedFollowResource))
        }
    }
    var resourceData = []
    for (var i = 0; i < resourceList.length; i++) {
        if ($(resourceList[i]).attr("disabled") != "disabled" && $(resourceList[i]).attr("checked") && $(resourceList[i]).val()) {
            resourceData.push(dealSelectedResourceData($(resourceList[i]).attr("id"), selectedFollowResource))
        }
    }
    var videoData = []
    for (var i = 0; i < videoList.length; i++) {
        if ($(videoList[i]).attr("disabled") != "disabled" && $(videoList[i]).attr("checked") && $(videoList[i]).val()) {
            videoData.push(dealSelectedResourceData($(videoList[i]).attr("id"), selectedFollowResource))
        }
    }
    return {
        getSelectedFollowResource: function () {
            return selectedFollowResource
        },
        appendSelectedFollowResource: function (rtnData) {//根据数据库返回的新的ID值来回显
            var showWrapper = $("#otherInfoPannel")
            var showOffset = type == 2 ? 6 : 11
            //渲染design
            var i = 0
            for (i = 0; i < designData.length; i++) {
                designData[i]["iid"] = rtnData[designData[i]["resource_id_int"] + "_" + designData[i]["reType"]]
            }
            var selectDesignText = template.render("resource_list_template", {
                list: designData,
                "is_mine": 1,
                "toJSONString": toJsonString
            })
            var designWrapper = $(showWrapper).find("#resource_list_" + (showOffset++))
            $(designWrapper).append(selectDesignText)
            //渲染course
            for (i = 0; i < courseData.length; i++) {
                courseData[i]["iid"] = rtnData[courseData[i]["resource_id_int"] + "_" + courseData[i]["reType"]]
            }

            var selectCourseWareText = template("resource_list_template", {
                list: courseData,
                "is_mine": 1,
                "toJSONString": toJsonString
            })
            var courseWrapper = $(showWrapper).find("#resource_list_" + (showOffset++))
            $(courseWrapper).append(selectCourseWareText)
            //渲染resource
            for (i = 0; i < resourceData.length; i++) {
                resourceData[i]["iid"] = rtnData[resourceData[i]["resource_id_int"] + "_" + resourceData[i]["reType"]]
            }

            var selectResourceText = template("resource_list_template", {
                list: resourceData,
                "is_mine": 1,
                "toJSONString": toJsonString
            })
            var resourceWrapper = $(showWrapper).find("#resource_list_" + (showOffset++))
            $(resourceWrapper).append(selectResourceText)
            //渲染video
            for (i = 0; i < videoData.length; i++) {
                videoData[i]["iid"] = rtnData[videoData[i]["resource_id_int"] + "_" + videoData[i]["reType"]]
            }
            var selectVideoText = template("resource_list_template", {
                list: videoData,
                "is_mine": 1,
                "toJSONString": toJsonString
            })
            var videoWrapper = $(showWrapper).find("#resource_list_" + (showOffset++))
            $(videoWrapper).append(selectVideoText)
        },

    }
}


/*处理获取到的资源数据*/
function dealSelectedResourceData(idStr, selectedFollowResource) {
    var idData = idStr.split("_")
    var idStrDecode = Base64.decode(idData[0])
    var resType = parseInt(idData[1]) + 5
    var resourceData = JSON.parse(idStrDecode)
    resourceData["reType"] = resType
    if (selectedFollowResource) {
        selectedFollowResource.push({
            "service_type": "51",
            "service_id": moke_id,
            "resource_id_int": resourceData["resource_id_int"],
            "bk_type": resType
        })
    }
    return resourceData
}

/*资源沿用，选择框点击选择全部资源*/
function selectCheckbox(obj) {
    var parent = $(obj).find("input[type='checkbox']")
    var checkFlag = $(parent).attr("checked")
    var name = $(parent).attr("name")
    if ("all" == name) {
        var inputElements = $("#follow-resource-list").find("input[type='checkbox']").not("input[disabled='disabled']")
        if (checkFlag) {
            $(inputElements).attr("checked", true)
        } else {
            $(inputElements).removeAttr("checked")
        }
    } else {
        var inputElements = $("#follow-resource-list").find("input[name='" + name + "']").not("input[disabled='disabled']")
        if (checkFlag) {
            $(inputElements).attr("checked", true)
        } else {
            $(inputElements).removeAttr("checked")
        }
    }

}
/*选择延用时， 判断修改资源中是否有初始资源*/
function isInModifyResource(initialId, modifyResourceEle) {
    for (var i = 0; i < modifyResourceEle.length; i++) {
        var modifyResourceObject = dealSelectedResourceData($(modifyResourceEle[i]).attr("id"))
        if (modifyResourceObject["resource_id_int"] == initialId) {
            return true
        }
    }
    return false
}

function submitMoke(status) {
    var b = false;
    $.ajax({
        type: "post",
        async: false,
        data: {
            status: status,
            moke_id: moke_id
        },
        url: url_path_html + "/yx/moke/submitStatusMokeTeam?t=" + Math.random(),
        dataType: "json",
        success: function (data) {
            if (data.success) {
                dialogClose("提交成功！", 2, 200);
                initStatus(status);
                b = true;
                //提交磨课进行消息推送
                getGroupMessage(function(group){
                    if(group.success){
                        var messageData = {
                            person_id : $.cookie("person_id"),
                            identity_id : $.cookie("identity_id"),
                            platform_type : 1,
                            business_type : 301,
                            relatived_id : detail.moke_id,
                            e_relatived_id : "",
                            r_person_id : group.CREATE_ID,
                            r_identity_id : group.IDENTITY_ID,
                            operation_content : $.cookie("person_name")+"更新了磨课内容",
                            norepeat_ts : new Date().getTime()
                        }
                        $.ajax({
                            type : "post",
                            url : url_path_html + "/credit/writeToQueue",
                            data :messageData,
                            dataType : "json",
                            success : function(res){
                                console.info("添加消息队列",res)
                            }
                        })
                    }
                })
            }
        }
    });
    return b;
}

function getGroupMessage(callback){
    $.ajax({
        type : "post",
        url : url_path_html + "/group/queryGroupById?random_num=" + Math.random(),
        data : {
            groupId: detail.team_id,
        },
        dataType: 'json',
        success: function(res){
            callback(res)
        }
    })
}

function checkResource(type) {
    if (type == 2) {
        if ($("#resource_list_6 div").length == 0) {
            dialogClose("未上传教学设计！", 2, 200);
            return false;
        }
        if ($("#resource_list_7 div").length == 0) {
            dialogClose("未上传教学课件！", 2, 200);
            return false;
        }
    } else if (type == 3) {
        if ($("#resource_list_11 div").length == 0) {
            dialogClose("未上传教学设计！", 2, 200);
            return false;
        }
        if ($("#resource_list_12 div").length == 0) {
            dialogClose("未上传教学课件！", 2, 200);
            return false;
        }
        if ($("#resource_list_16 div").length == 0) {
            dialogClose("未上传教学反思！", 2, 200);
            return false;
        }
        if ($("#resource_list_14 div").length == 0) {
            dialogClose("未上传课堂实录！", 2, 200);
            return false;
        }
    }
    return true;
}

function openMeeting() {

    if (undefined != $.cookie("person_id") && "null" != $.cookie("person_id") && $.cookie("identity_id") == 5) {
        var meetingType = 0;
        if ($.cookie("person_id") == group_data.CREATOR_ID) {
            //主备人进入会议
            meetingType = 1;
        } else if ($.cookie("person_id") == detail.person_id) {
            meetingType = 2;
        }
    }
    var data = {
        hd_confid: detail.moke_confid,
        con_pass: detail.con_pass,
        show_name: $.cookie("person_name"),
        moke_use: 1
    };
    if (meetingType == 0) {
        initMeetingByPass();
        return;
    } else if (meetingType == 1) {
        data.main_pass = 0;
    }
    intoMeeting(data);

}

function initMeetingByPass(data) {
    art.dialog({
        content: '<div style="text-align:center"><input id="con_pass_btn"/></div>',
        width: 340,
        title: "非组内成员，请输入密码进入视频讨论",
        close: function () {
            return true;
        },
        ok: function () {
            if ($.trim($("#con_pass_btn").val()) == "") {
                dialogOk("活动密码不能为空");
                $("#con_pass_btn").val("");
                return false;
            }
            if ($("#con_pass_btn").val() == detail.con_pass) {
                var data = {
                    hd_confid: detail.hd_confid,
                    con_pass: detail.con_pass,
                    show_name: $.cookie("person_name")
                };
                intoMeeting(data);
                return true;
            } else {
                dialogOk("密码输入错误");
                return false;
            }

            return true;
        }
    });
}
var ddialog = null;
function intoMeeting(dataFormat) {
    dataFormat.hd_id = detail.obj_info_id;
    dataFormat.hd_name = detail.title;
    $.ajax({
        url: url_path_html + "/yx/hd/getJoinMeetingInfo",
        type: "POST",
        async: false,
        data: dataFormat,
        dataType: "json",
        success: function (data) {
            if (data.success) {
                var m_url = url_path_html + '/yx/html/hd/joinMeeting.html';
                m_url += "?conf=" + Base64.encode(data.conf);
                m_url += "&url=" + data.url;
                ddialog = art.dialog.open(m_url, {
                    id: "closeDialog5s",
                    title: '进入活动，请稍后...',
                    width: 400,
                    zIndex: 9999,
                    lock: true
                });
            }
        }
    });
}
