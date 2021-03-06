﻿window.onload = function() {
	getGroupInfo();
    getGroupMembers(1);

};

//解码
function base64Encode(oldStr){
	var newStr = Base64.decode(oldStr);
	return newStr;
}

function getGroupInfo(){
	var innerHtml = {};
	var group_info_ = group_data;
    innerHtml = group_info_;
    innerHtml['getGroupPhoto'] = getGroupPhoto;
    innerHtml['GROUP_ID'] =org_id;
    innerHtml['is_super'] = is_super;
    innerHtml['is_admin'] = is_admin;
    innerHtml['is_member'] = is_member;
    innerHtml['is_login'] = is_login;
    innerHtml['is_exist'] = is_exist;
    var html = template('group_info_inner', innerHtml);
    $("#group_info").html(html);
}

function getGroupInitInfo(){
    $.ajax({
        type: "GET",
        async: false,
        data: {"random_num": creatRandomNum(),
            "groupId": org_id
        },
        url: url_path_action_login + "/group/queryGroupById",
        dataType: "json",
        success: function (data) {
            if(data.success == false){
                art.dialog.alert("指定ID的群组不存在");
                return false;
            }else if($.cookie("person_id") && data.CREATOR_ID == $.cookie("person_id") && $.cookie("identity_id") && data.IDENTITY_ID == $.cookie("identity_id")) {
                is_admin = 1;
                is_super = 1;
            }else{
                for(var i = 0;i < data.list_person.length;i++){
                    if($.cookie("person_id") && data.list_person[i].person_id == $.cookie("person_id") && $.cookie("identity_id") && data.list_person[i].identity_id == $.cookie("identity_id")) {
                        is_admin = 1;
                    }
                }
            }
            group_info_ = data;
        },
        error:function(){
            //art.dialog.alert("查询群组失败");
            //return false;
        }
    });
    if($.cookie("person_id")) {
        is_login = 1;
        $.ajax({
            type: "GET",
            async: false,
            data: {"random_num": creatRandomNum(),
                "person_id": $.cookie("person_id"),
                "identity_id": $.cookie("identity_id"),
                "group_id": org_id
            },
            url: url_path_action_login + "/group/isExist",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    is_member = 1;
                }else{
                    is_exist = data.STATE_ID
                }
            }
        });
    }
}

function getGroupMembers(page){
	var innerHtml = {};
    $.ajax({
        type: "GET",
        async: false,
        data: {"random_num": creatRandomNum(),
            "groupId":org_id,
            "nodeId": org_id,
            "rangeType": 3,
            "orgType": -1,
            "stage_id": -1,
            "subject_id": -1,
            "keyword":"",
            "member_type":-1,
            "pageNumber":page,
            "pageSize":10
        },
        url: url_path_action_login + "/space/group/getMemberByparams",
        dataType: "json",
        success: function (data) {
            if(data.success){
                innerHtml = data;
                innerHtml['GROUP_ID'] =org_id;
                innerHtml['is_super'] = is_super;
                innerHtml['is_admin'] = is_admin;
                innerHtml['is_member'] = is_member;
                innerHtml['is_login'] = is_login;
                if($.cookie("person_id")){
                    innerHtml['person_id'] = $.cookie("person_id");
                    innerHtml['identity_id'] = $.cookie("identity_id");
                }
                innerHtml['cheNum'] = group_data['IS_CHECK_COUNT'];
                if(is_super == 1){
                    innerHtml['member_type'] = 0;
                }else if(is_admin == 1){
                    innerHtml['member_type'] = 1;
                }else{
                    innerHtml['member_type'] = 2;
                }
                innerHtml['getSpaceUserPhoto'] = getSpaceUserPhoto;
            }else{

            }
        },error:function(){

        }
    });

	var html = template('group_member_inner', innerHtml);
    $("#group_member").html(html);
    $("#manageTablePage").spacePage({
        pageSize:innerHtml.pageSize,
        pageNumber:innerHtml.pageNumber,
        totalPage:innerHtml.totalPage,
        totalRow:innerHtml.totalRow,
        callBack:getGroupMembers
    });
}
/*群组图片*/
function getGroupPhoto(fileid,msg){
    if(!!!fileid || fileid.indexOf("group/default.png")>0){
        return "../../../images/head_icon/group/default.png";
    }
    var Material_path = fileid.substring(0,2);
    if(!!!msg){
        msg = "";
    }
    var img_url = STATIC_IMAGE_PRE + url_path_img + Material_path + "/" + fileid + msg;
    return img_url;
}
/*申请入群*/
function applicationToGroup(ele,id,name){
    var textarea;
    art.dialog({
        title: '请输入验证信息',
        content: "<div id='shenqingTextareDiv'></div>",
        width: 300,
        height: 150,
        lock:true,
        resize: false,
        fixed:true,
        padding:"10px",
        init:function(){
            textarea = $("#shenqingTextareDiv").textarea({
                index:3,
                width:"260",
                height:"100",
                word_length:50
            });
            textarea.textarea("initContent","我是"+ $.cookie("person_name"));
        },
        close:function(){
            getGroupInitInfo();
            getGroupInfo();
        }
    },function(){
        var dia_ = art.dialog({
            title:"提示",
            height:50,
            lock:true,
            resize: false,
            fixed:true
        });
        if(textarea.textarea("value").length == 0){
            dia_.content("请输入验证信息").time(2);
            return false;
        }
        $.ajax({
            type: "GET",
            async: false,
            data: {"random_num": creatRandomNum(),
                "groupId":id,
                "checkContent": textarea.textarea("value")
            },
            url: url_path_action + "/group/requestJoinGroup",
            dataType: "json",
            success: function (data) {
                if(data.success){
                    dia_.content("申请已发送，正在审核中").time(2);
                    var options = {
                        business_type:116,
                        relatived_id:id,
                        operation_content:$.cookie("person_name") + '申请加入群组：' + name + '。'
                    };
                    creditWriteToQueue(options);
                }else{
                    dia_.content("请求异常");
                }
            },error:function(){
                dia_.content("请求异常");
            }
        });
    },function(){

    });
}
/*创建群组*/
var uploadDialog;
function createGroupDialog(type,id,url){
    var data1 = {};
    if(type == 1){
        data1['name'] = $("#group_info").find(".groupName").html();
        data1['url'] = (url);
        data1['desc'] = $("#group_info").find(".groupDesc").html();
        data1['getGroupPhoto'] = getGroupPhoto;
		//学科学段
        data1['stage_id'] = $("#group_info").find("#stage_id").val();
        data1['subject_id'] = $("#group_info").find("#subject_id").val();
    }else{
        data1['name'] = "";
        data1['url'] = ("../../../images/head_icon/group/default.png");
        data1['desc'] = "";
        data1['getGroupPhoto'] = getGroupPhoto;
    }
    var html = template("addGroupDialog",data1);
    var inputName,textarea;
    uploadDialog = art.dialog({
        title: type == 0?'创建群组':'修改群组信息',
        content: html,
        width: 450,
        lock:true,
        resize: false,
        fixed:true,
        zIndex:1000,
        padding:"20px 25px 0",
        init:function(){
            inputName = $("#addGroupNameInput").input({
                index:1,
                placeholder:"请输入群组名称",
                maxCount:30,
                showType:1,
                width:275,
                onCheck:function(){
                    var val = inputName.input("value");
                    if(val == ""){
                        inputName.input("setTips","群组名不能为空")
                    };
                }
            });
            textarea = $("#addGroupDescTextarea").textarea({
                index:3,
                width:"275px",
                height:"70px",
                word_length:300
            });

            if(type == 1){
                inputName.input("setVal",data1['name']);
                textarea.textarea("initContent",data1['desc']);
            }
            inputName.input("check");

        },
        close:function(){
            inputName.input("destroy");
            textarea.textarea("destroy");
            uploadDialog = null;
            //刷新个人信息
            getGroupInfo();
        }
    },function(){

        var group_name = inputName.input("value");
        var group_desc = textarea.textarea("value");
        group_desc = group_desc.trim();
        var parent_type = -1;
        var parent_id = -1;
        var group_type = $("input[name='queryType']:checked").val();
        var use_range = 1;
        var plat_type = 1;
        var plat_id = 0;


        group_name= group_name.replace(/\s+$/gi,'');

        if(group_name.length <= 0){
            art.dialog({
                title: "提示",
                content: "请输入群组名称",
                width: 200,
                lock:true,
                time:1.5,
                resize: false,
                fixed:true,
                cancel:false});
            return false;
        }

        if(type == 0) {
            var avater_url = Base64.encode($('#avatar_url').val());
            $.ajax({
                url: url_path_action + "/group/saveGroup?random_num=" + creatRandomNum(),
                async: false,
                type: "POST",
                data: {"group_name": group_name, "group_desc": group_desc, "avater_url": avater_url, "parent_type": parent_type, "parent_id": parent_id, "group_type": group_type, "use_range": use_range, "plat_type": plat_type, "plat_id": plat_id},
                dataType: "json",
                success: function (data) {
                    if (data.success == true) {
                        dialogClose(data.info, 2, 200, '');
                    } else {
                        if (data.info == "notlogin") {
                            top.location = url_path_action + "/";
                        } else {
                            //showAlert({content: data.info, time:2});
                            dialogClose(data.info, 2, 200, 'getGroupInitInfo();loadSpaceCommon();getGroupInfo();');

                        }
                    }
                }
            });
        }else{
            var avater_url = $('#avatar_url').val();
            $.ajax({
                url: url_path_action + "/group/updateGroup?random_num=" + creatRandomNum(),
                async: false,
                type: "POST",
                data: {"group_name": group_name,
                    "group_desc": group_desc,
                    "avater_url": avater_url,
                    "id":id,
                    "stage_id" : data1['stage_id'],
                    "subject_id" : data1['subject_id']
                },
                dataType: "json",
                success: function (data) {
                    if (data.success == true) {
                        dialogClose(data.info, 2, 200, 'getGroupInitInfo();getGroupInfo();');
                    } else {
                        if (data.info == "notlogin") {
                            top.location = url_path_action + "/";
                        } else {
                            //showAlert({content: data.info, time:2});
                            dialogClose(data.info, 2, 200, '');

                        }
                    }
                }
            });
        }
    },function(){

    });
}
function selectAvatar(){
    //uploadDialog.hide();
    tb_show("上传群组头像","../../../html/space/common/uploadGroup.html?type=1&TB_iframe=true&height=340&width=700","thickbox");
}
function tb_remove(){
    $("#TB_imageOff").unbind("click");
    $("#TB_closeWindowButton").unbind("click");
        $('#TB_iframeContent').remove();
        $('#TB_window,#TB_overlay,#TB_HideSelect').remove();
    $("#TB_load").remove();

    //$('#TB_window,#TB_overlay').remove();
    return false;
}
/*添加成员*/
/*添加结束后调用查询人员方法  管理成员初始化也要调用查询人员方法*/
var addGroupMembersDialog = null;
var addGroupMembersKeyword;
//获取分类下的人员数据
function getSelectPersonByOrg(page,groupId){
    var iid = $("#addGroupMemberDiv .btn_ul > li[class='active']").attr("selIdentityId");
    var bySelf = $("#selMemberBySelf").attr("checked");
    var unit_id = 0;
    if(bySelf && $("#selMemberBySelf").val() != 0){
        unit_id = $("#selMemberBySelf").val();
    }else{
        unit_id = defaultOrgId;
    }
    var innerHtml = {};
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),
            "unit_id":unit_id,
            "identity_id":$.cookie("identity_id"),
            "identity_ids":iid,
            "person_id":$.cookie("person_id"),
            "searchTerm":(Base64.encode(addGroupMembersKeyword.search("value"))),
            "pageNumber":page,
            "pageSize":10,
            "group_id":groupId
        },
        url : url_path_action_login + "/group/queryGroupPersonsByKeyAndOrg",
        dataType: "json",
        success : function(data) {
            if(data.success){
                innerHtml = data;
                innerHtml['groupId'] = groupId;
            }else{
                innerHtml['rows'] = [];
            }
        },
        error : function(){
            innerHtml['rows'] = [];
        }
    });
    var html = template("addGroupMemberTem",innerHtml);
    $("#addGroupMemberTable").html(html);
    $("#addGroupMemberCheckAll").click(function(){
        if($(this).attr("checked")) {
            $(".addGroupMemberCheckbox").attr("checked", true);
            $(".addGroupMemberCheckbox[disabled]").attr("checked", false);
        }else{
            $(".addGroupMemberCheckbox").attr("checked", false);
        }
    });
    $("#addGroupMemberPage").spacePage({
        pageSize:10,
        pageNumber:innerHtml.page,
        totalPage:innerHtml.total,
        totalRow:innerHtml.records,
        callBack:function(page){
            getSelectPersonByOrg(page,groupId);
        }
    });
}
//加入群组
function addPersonToGroup(groupId,type,dom){
    var list = [];
    var page = 1;
    if(type == 0){
        list = [{
            "person_id":$(dom).closest("tr").find(".pid").val(),
            "identity_id":$(dom).closest("tr").find(".iid").val(),
            "bureau_id":$(dom).closest("tr").find(".orgid").val(),
            "person_name":$(dom).closest("tr").find(".name").html()
        }];
        page = $(dom).closest("tr").find(".page_num").val();
    }else{
        $(".addGroupMemberCheckbox:checked").each(function(){
            var rows_ = {
                "person_id":$(this).closest("tr").find(".pid").val(),
                "identity_id":$(this).closest("tr").find(".iid").val(),
                "bureau_id":$(this).closest("tr").find(".orgid").val(),
                "person_name":$(dom).closest("tr").find(".name").html()
            };
            page = $(this).closest("tr").find(".page_num ").val();
            list.push(rows_);
        });
        if(list.length == 0){
            art.dialog({
                title:"提示",
                height:50,
                lock:true,
                resize: false,
                fixed:true,
                content:"请选择要添加的人员",
                time:1
            });
            return false;
        }
    }
    var flag = false;
    $.ajax({
        type: "GET",
        async: false,
        data: {"random_num": creatRandomNum(),
            "groupId":groupId,
            "pids": JSON.stringify(list)
        },
        url: url_path_action + "/group/addMember",
        dataType: "json",
        success: function (data) {
            if(data.success){
                flag = true;
                $(list).each(function(){
                    var options = {
                        business_type:119,
                        relatived_id:groupId,
                        r_person_id:this.person_id,
                        r_identity_id:this.identity_id,
                        operation_content:$.cookie("person_name") + '邀请' + this.person_name + '进入群组：'+ org_info_.org_name +'。',
                        e_relatived_id:""
                    };
                    creditWriteToQueue(options);
                });
            }else{
                flag = false;
            }
        },error:function(){
            flag = false;
        }
    });
    art.dialog({
        title:"提示",
        height:50,
        lock:true,
        resize: false,
        fixed:true,
        content: (flag?"添加成功":"添加失败"),
        time:1,
        close:function(){
            getSelectPersonByOrg(page,groupId);
        }
    });

}
/*成员审核*/
var checkRequestDialog = null;
function checkRequest(page,id){
    checkRequestDialog = art.dialog.open('../../../../html/space/common/request_check.html?id='+id+'&name='+name, {
        title: '成员审核',
        height: 514,
        width: 900,
        lock:true,
        fixed: true,
        close:function(){
            //getGroupMembers(page);
            getGroupInitInfo();
            getGroupInfo();
            getGroupMembers(page);
        }
    });
}
/*删除群组成员+退出群组*/
function manageGroupMemberRemove(my_memberType,memberId, memberType,memberName, rowIndex,pageNumber,id,member_type,person_id,identity_id){
    var title;
    var html;
    var quriOrRemoveType;
    var title1 = "确定将成员"+"'"+memberName+"'"+"移除群组吗？";
    var title2 = "确定退出该群组吗？";
    var html1 = "移除成功，正在刷新人员列表";
    var html2 = "退出成功，正在刷新";
    var quriOrRemoveType1=1;  //移除成员
    var quriOrRemoveType2=2;  //退出群组
    if(my_memberType == 0){
        title = title1;
        html = html1;
        quriOrRemoveType=quriOrRemoveType1;
    }else if(my_memberType == 1&&memberType ==1){
        title = title2;
        html = html2;
        quriOrRemoveType=quriOrRemoveType2;
    }else if(my_memberType == 1&&memberType ==2){
        title = title1;
        html = html1;
        quriOrRemoveType=quriOrRemoveType1;
    }else if(my_memberType == 2){
        title = title2;
        html = html2;
        quriOrRemoveType=quriOrRemoveType2;
    }
    //htmlallvar=html;
    //dialogOkCancel(title,'300','quitGroupajax('+memberId+','+memberType+','+quriOrRemoveType+');','');

    art.dialog.confirm(title, function () {

        $.ajax({
            url: url_path_action + "/group/quitGroup?random_num=" + creatRandomNum(),
            method:"POST",
            async: false,
            data:{"memberId": memberId, "memberType": memberType, "groupId": id},
            dataType : "json",
            success: function(data, textStatus, JXHttp){
                if(data.success) {
                    if (rowIndex == 0) {
                        if (pageNumber > 1) {
                            pageNumber = pageNumber - 1;
                        }
                    }

                    if(quriOrRemoveType == 2){
                        var options = {
                            business_type:124,
                            relatived_id:id,
                            operation_content:$.cookie("person_name") + '退出群组' + name + '。',
                            e_relatived_id:""
                        };
                        creditWriteToQueue(options);
                        window.location.reload();
                    }else{
                        var options = {
                            business_type:120,
                            relatived_id:id,
                            r_person_id:person_id,
                            r_identity_id:identity_id,
                            operation_content:$.cookie("person_name") + '将'+ memberName +'移除群组' + name + '。',
                            e_relatived_id:""
                        };
                        creditWriteToQueue(options);
                        getGroupInitInfo();
                        getGroupInfo();
                        getGroupMembers(pageNumber);
                    }

                }else{
                    if(data.info == "notlogin"){
                        top.location = url_path_action + "/";
                    }else{
                        //alert(data.info);
                        dialogOk(data.info,300,'');
                    }
                }
            }
        });
    }, function () {

    });

}

/*设置 取消管理员*/
function setManageAdmin(PERSON_NAME, MEMBER_ID, MEMBER_TYPE,pageNumber,id,member_type,person_id,identity_id)
{
    var str = "确定设置成员'"+PERSON_NAME+"'为"+(MEMBER_TYPE==1?"群管理员":"普通成员")+"吗？";
    //dialogOkCancel(str,'300','setMemberajax('+MEMBER_ID+','+MEMBER_TYPE+');','');
    art.dialog.confirm(str, function (){
        $.ajax({
            url: url_path_action + "/group/setMemberType?random_num=" + creatRandomNum(),
            method:"POST",
            async: false,
            data:{"memberId": MEMBER_ID, "memberType": MEMBER_TYPE},
            dataType : "json",
            success: function(data, textStatus, JXHttp){
                if(data.success == true){
                    //alert("设置成功！");
                    //showAlert({content:"设置成功", time:2 });
                    dialogClose('设置成功',1,200,'');
                    //goPage(global_pageNumber);
                    getGroupMembers(pageNumber);
                }else{
                    if(data.info == "notlogin"){
                        top.location = url_path_action + "/";
                    }else{
                        //alert(data.info);
                        dialogOk(data.info,300,'')
                    }
                }
            }
        });
    },function(){});
}



function addMember(){
    //添加成员弹出层
    var url = url_path_html + "/yx/html/manage/team/add_mem.html?"
    url += "?callBack=activeResource_call_back";
    url += "&groupid=2";//16活动 15专题
    url += "&service_id=" + org_id;
    url += "&TB_iframe=true";
    url += "&height=" + 489;
    url += "&width=" + 745;
    url += "$callback="
    tb_show("添加小组成员", url, "thickbox");
    $('#TB_iframeContent').css({"width":"745px",'margin-top':'0px','border-radius':'0px'});
    $('#TB_title').css({"background-color":"#5bc0de","border-bottom":"1px solid #777","width":"745px"});
    $('#TB_ajaxWindowTitle').css('color','#fff');
    $('#TB_closeWindowButton').css({"opacity":"1",'color':'#fff'});
}

function goPage(){
    getGroupMembers(1)
}

