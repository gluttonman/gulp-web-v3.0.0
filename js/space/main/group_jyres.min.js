var searchGroupInput,tree_value = 0,hide_flag = true;
window.onload = function(){
    loadMainNav();
    refreshPage(1);
    
    $(".fancybox").fancybox({
        maxWidth:1200,
        afterShow: function() {
            $(".fancybox-next").css("right","-10px");
            $(".fancybox-prev").css("left","-10px");
            var thisbox  =  $(this);
            var ads = $(this.wrap).css("z-index","99").parent().css("z-index","98");
            var type = thisbox[0].type;
            if($.cookie("person_id") && $.cookie("identity_id")){
				var href = thisbox[0].href;
				if(href.indexOf("paper_preview.html?paper_id") != -1){
					$(".fancybox-next").css("right","15px");
					$(".fancybox-prev").css("left","15px");
					var down_path = $(thisbox[0].element).siblings(".down_path").html();

					var div_str_begin = '<div class="fancybox-title fancybox-title-outside-wrap-tool">';
					var div_str_over = '</div>';
					var a_str_download = down_path;
					$(div_str_begin+a_str_download+div_str_over).appendTo(this.wrap);
				}else if(href.indexOf("../../ypt/weike/wk_detail.html")==-1
					&& href.indexOf("/dsideal_yy/html/ypt/common/preview_flash2D.html")==-1
					){
					var format1 = thisbox[0].title_a.split(".")[(thisbox[0].title_a.split(".").length-1)].split("【")[0];
					var fileid1 = href.split("file_id=")[1].substr(0,36);
					var title1 = thisbox[0].title_a.split("【")[0];
					var down_path = $(thisbox[0].element).siblings(".down_path").html();
					var review_path = $(thisbox[0].element).siblings(".review_path").html();
					var div_str_begin = '<div class="fancybox-title fancybox-title-outside-wrap-tool">';
					var div_str_over = '</div>';
					$(div_str_begin+down_path+review_path+div_str_over).appendTo(this.wrap);
				}
            }
        }
    });
};

function tb_remove() {
    $("#TB_imageOff").unbind("click");
    $("#TB_closeWindowButton").unbind("click");
    $("#TB_window").fadeOut("fast",function(){ $('#TB_iframeContent').remove();$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
    $("#TB_load").remove();

    document.onkeydown = "";
    document.onkeyup = "";
    refreshPage(1);
    return false;
}

function refreshPage(page_number){
    getStatList(function(){
        getFolderList(function(){
            loadGroupResourceListTemplate(page_number);
        });
    });


}


/*加载标签模板*/
var getMystatus = 0;
function loadMainNav(){
    var html = template("mainGroupNavInner",{});
    $("#groupMain").html(html);

    $('#mainGroupNav a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if($(this).attr("href") == "#groupResource"){
            getMystatus = 0;
        }else if($(this).attr("href") == "#groupMyResource"){
            getMystatus = 1;
        }
        loadGroupResourceListTemplate(1);
    });
    $('#mainGroupNav a:first').tab('show');
    getSortHtml();

}

function getSortHtml(){
    var innerHtml = {"list":[],"is_login":is_login,"is_member":is_member,"is_admin":is_admin};
    /*资源*/
    var html = template("resourceSortInner",innerHtml);
    $("#groupResource").html(html);
    var html = template("resourceTableTitalInner",innerHtml);
    $("#groupResourceListDiv").html(html);
    searchGroupInput = null;
    $("div[id $= 'search_input']").empty();
    searchGroupInput = $("#search_input").search({
        btnclass:"btn btn-warning",
        tips:"请输入关键字",
        onsearch:function(){
            loadGroupResourceListTemplate(1);
        }
    });
    $(".bannerLeft .resourceBtns > li > a").click(function(){
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
        loadGroupResourceListTemplate(1);
    });

    $("#groupResource").on("click","th[ressortth]",function(){
        var this_ = $(this);
        $(this_).siblings("th[ressortth]").attr("reschecked","false")
        $(this_).attr("reschecked","true");
        if($(this_).find("i").attr("class") == "glyphicon glyphicon-arrow-down"){
            $(this_).find("i").attr("class","glyphicon glyphicon-arrow-up");
        }else{
            $(this_).find("i").attr("class","glyphicon glyphicon-arrow-down");
        }
        loadGroupResourceListTemplate(1);
    });
}

/*加载群组资源列表*/
function loadGroupResourceListTemplate(page){
    var keyword = searchGroupInput.search("value");
    keyword = keyword?keyword:"";
    keyword = Base64.encode(keyword);
    var sortType = $("th[ressortth][reschecked='true']").attr("ressortth");
    sortType?sortType:1;
    var sortNum = 2;
    if($("th[ressortth][reschecked='true']").find("i").hasClass("glyphicon-arrow-up")){
        sortNum = 1;
    }else{
        sortNum = 2;
    }
    var innerhtml = {};



    var paramData = {
        "random_num":creatRandomNum(),
        "res_type": 1,
        "keyword":keyword,
        "pageSize": 10,
        "pageNumber": page,
        "view":org_id,
        "sort_type":sortType,
        "beike_type" : current_folder_id,
        "sort_num":sortNum
    };
    if(getMystatus == 1){
        paramData.person_id = $.cookie("person_id");
    }
    $.ajax({
        type : "GET",
        async : false,
        data : paramData,
        url : url_path_html + "/yx/resource/getServiceResourceList",
        dataType: "json",
        success : function(data) {
            if(data.success){
                my_resource_info_upDataToJson(data);
                innerhtml = data;
                innerhtml.is_login = is_login;
                innerhtml.is_member = is_member;
                innerhtml.is_admin = is_admin;
            }else{
                innerhtml = {"list":[]};
            }
        },
        error : function (){
            innerhtml = {"list":[]};
            //my_resource_info_change_wh(0,0,$("#"+id_info),0);
        }
    });

    setFolder(innerhtml);

    var html = template("resourceListInner",innerhtml);
    $("#groupResourceListTbody").html(html);

    $("#resourcePage").spacePage({
        pageSize:innerhtml.pageSize,
        pageNumber:innerhtml.pageNumber,
        totalPage:innerhtml.totalPage,
        totalRow:innerhtml.totalRow,
        callBack:loadGroupResourceListTemplate
    });
}

function removeMemberToFolder(resource_id,resource_title){
    beforeUploadResource(3,resource_id,resource_title);
}

function my_resource_info_upDataToJson(json_tem) {
    var path_m = url_path_down + "down/Material/";
    var list = new Array();
    $.each(json_tem.list,function(i,n){
        var r_format = n.resource_format;
        var file_id = n.file_id;
        var _class = "";
        var _title = n.resource_title + '.' + r_format;
        var _href = "";
        var resource_page = n.resource_page;

        var f_json =
        {
            "file_ext":r_format,
            "file_id":file_id,
            "file_title":n.resource_title,
            "file_page":resource_page,
            "_width":0,
            "_height":0,
            "p_status":n.preview_status,
            "p_type":1
        };
        //返回预览所需参数
        var p_json = dealPreviewFun(f_json);
        _class = p_json._class;
        _href = p_json._href;
        if(n.resource_type != 1){
            _href += "&ht=true";
        }

        //===============处理下载方式=============
        //参数：（file_id，file_ext，for_urlencoder_url，for_iso_url，url_code）
        var _json =
        {
            "file_id":file_id,
            "file_ext":r_format,
            "for_urlencoder_url":n.for_urlencoder_url,
            "for_iso_url":n.for_iso_url,
            "url_code":n.url_code
        };
        var _down_path = dealDownpathFun(_json);
        json_tem.list[i]["down_path"] = _down_path;

        if(_down_path != ""){
            _down_path = Base64.encode(_down_path);
        }
        json_tem.list[i]["click_b_down"] = "showDownload('"+n.iid+"'," + n.resource_id_int + ",'"+n.resource_title+"','"+r_format+"','"+_down_path+"','" + n.for_iso_url + "',1,0);";

        var Material_path = n.thumb_id.substring(0,2);
        json_tem.list[i]["thumb_url"] = url_path_down + "down/Thumbs/" + Material_path + "/" + n.thumb_id;

        var _time = n.create_time;
        json_tem.list[i]["create_time"] = _time.substring(0,10);
        json_tem.list[i]["class_b"] = _class;
        json_tem.list[i]["title"] = _title;
        json_tem.list[i]["href"] = _href;
    });

}


function removeMemberSubmit(mid, fid, callback) {
    if (!mid) {
        callback(false, "请选择要分组的资源");
        return
    }
    if (!fid) {
        callback(false, "请选择分组");
    }

    $.ajax({
        type: "POST",
        url: url_path_html + "/yx/folder/removeResourceToFolder",
        data: {
            "business_id":org_id,
            "business_type": 1,
            "bk_type": fid,
            "res_info_id": mid
        },
        dataType: "json",
        success: function(res) {
            dialogClose("操作成功,正在刷新页面,请稍后...",3,300);
            setTimeout(function(){
                refreshPage(1);
            },3000);
        }
    });

}

function beforeUploadResource(type,resource_id,resource_title){
    var html = template("category_member_inner", { "FolderList": FolderList });
    var rmDialog = art.dialog({
        content: html,
        title: resource_title == null ? '请先选择分类' : "修改"+resource_title+"的分类",
        height: 110,
        width: 350,
        lock: true,
        fixed: true,
        close: function() {},
        button: [{
            name: '确定',
            callback: function() {
                var fid = $("#category_memeber_select").val();
                if(type == 1){
                    addResource(fid);
                }else{
                    removeMemberSubmit(resource_id, fid, function(status, message) {
                        if (status) {
                            rmDialog.close();
                        } else {
                            dialogClose(message, 2, 150, "");
                        }
                    });
                }
            }
        }, {
            name: '取消',
            callback: function() {

            }
        }]
    });
}

/*统计js*/
function getStatList(callback){
    $.ajax({
        type:"POST",
        url: url_path_action_login + "/yx/stat/getServiceStat",
        data:{
            business_type:1,
            business_id : org_id,
            service_id : 1
        },
        success: function(res){
            var html = template("resource_stat_inner",res.data);
            $("#resource_stat").html(html);
            if(callback){
                callback()
            }
        },
        error: function(){},
        dataType: 'json'
    });

}


/*分类管理js*/
var current_folder_id = 0;
var FolderList;

/*加载文件列表*/

function getFolderList(callback){
    $.ajax({
        type: "POST",
        async: false,
        url: url_path_action_login + "/yx/folder/queryFolders",
        data: {
            business_type: 1,
            person_id: org_id,
            identity_id: orgidentity_id,
            folder_type: 3
        },
        success: function(res) {
            FolderList = res;
            if (res.success) {
                showFolderListAtIndex(res.data, callback);
            }

        },
        error: function() {},
        dataType: 'json'
    });
}

function setFolder(data){
    for(var i=0;i<data.list.length;i++){
        data.list[i].folderName = "默认分类";
        for(var j=0;j<FolderList.data.length;j++){
            if(data.list[i].beike_type == FolderList.data[j].id){
                data.list[i].folderName = FolderList.data[j].folder_name;
            }
        }
    }
}

function showFolderListAtIndex(folderData, callback) {
    var html = template("forld_category_inner", { folders: folderData , current_folder_id: current_folder_id,is_member:is_member});
    $("#forld_category").html(html);
    $("#category_0").find("span").html("（"+$("#resourceTotal").html()+"）");
    if(callback){
        callback()
    }
}
/*弹出文件夹管理窗口*/
function folderCategoryManage() {
    getFolderCategory();
    dia = art.dialog({
        content: $('#folderCategoryManageDialog').html(),
        width: 480,
        // height: 400,
        lock: true,
        icon: null,
        title: '分类管理',
        // style:'succeed noClose',
        close: function() {
            //TODO 关闭添加文件夹之后，如果有添加文件夹，需要更新主页列表
            showFolderListAtIndex(FolderList.data)
        }
    });
}
/*填充文件夹列表*/
function getFolderCategory() {
    $("#folderCategoryManageDialog table tbody").empty();
    var html = template('folderCategoryManage_inner', { "FolderList": FolderList });
    $("#folderCategoryManageDialog table tbody").html(html);
}

//type 0:add 1:update
function editFolderManage(type, dom, fid) {
    var html_ = "<div id='editSortDiv' style='width:400px;'>" + "<table width='100%' class='table table-info'>" + "<tbody><tr>" + "<td scope='row' width='72'>分类名称<br/>&nbsp;</td>" + "<td colspan='3'><div id='editSortTitle'></div>" + "</tr></tbody>" + "</table>" + "</div>";
    var editSortTitleInput = null;
    art.dialog({
        title: (type == 0 ? "增加分类" : "修改分类"),
        content: html_,
        fixed: true,
        lock: true,
        width: 400,
        init: function() {
            editSortTitleInput = $("#editSortTitle").input({
                index: 3,
                placeholder: "请输入分类名称",
                maxCount: 20,
                showType: 1,
                width: 275,
                onCheck: function() {
                    var val = editSortTitleInput.input("value");
                    if (val == "") {
                        editSortTitleInput.input("setTips", "分类名称不能为空")
                    };
                }
            });

            if (type == 1) {
                editSortTitleInput.input("setVal", $(dom).closest("tr").find(
                    ".title").html());
            }
            $("#editSortTitle").val(
                $.trim($("#editSortTitle").val()).substring(0, 20));
            $("#editSortHid").text(20 - $("#editSortTitle").val().length);
            $("#editSortTitle").bind(
                "keyup",
                function() {
                    $("#editSortTitle").val(
                        $.trim($("#editSortTitle").val()).substring(0,
                            20));
                    $("#editSortHid").text(
                        20 - $("#editSortTitle").val().length);
                }).bind(
                "paste",
                function() {
                    $("#editSortTitle").val(
                        $.trim($("#editSortTitle").val()).substring(0,
                            20));
                    $("#editSortHid").text(
                        20 - $("#editSortTitle").val().length);
                });
        }
    }, function() {
        var sorttitle = editSortTitleInput.input("value");
        if (sorttitle.length == 0) {
            art.dialog.alert("请输入分类名称！");
            return false;
        } else if (sorttitle.length > 20) {
            art.dialog.alert("分类名称过长！");
            return false;
        }

        if (type == 0) {
            $.ajax({
                type: "POST",
                async: false,
                data: {
                    "person_id": org_id,
                    "identity_id": orgidentity_id,
                    "folder_name": sorttitle,
                    "business_type": 1,
                    "is_private": 0,
                    "folder_type": 3,
                },
                url: url_path_action_login + "/yx/folder/addFolder",
                dataType: "json",
                success: function(res) {
                    if (res.success) {
                        //添加文件夹之后，回显在列表
                        FolderList.data.push({ "id": res.data, "folder_name": sorttitle, "pcount": 0 })
                        dialogClose("保存成功！", 2, 150, "");
                        getFolderCategory();
                        dia.content($('#folderCategoryManageDialog').html());
                    } else {
                        dialogClose("保存失败！", 2, 150, "");
                    }
                },
                error: function() {
                    dialogClose("保存失败！", 2, 150, "");
                }
            });

        } else {
            $.ajax({
                type: "POST",
                async: false,
                data: {
                    "person_id": org_id,
                    "identity_id": orgidentity_id,
                    "folder_name": sorttitle,
                    "fid": fid
                },
                url: url_path_action_login + "/yx/folder/editFolder",
                dataType: "json",
                success: function(data) {
                    if (data.success) {
                        //修改完文件夹之后，更新FolderList
                        for (var i = 0; i < FolderList.data.length; i++) {
                            if (FolderList.data[i].id == fid) {
                                FolderList.data[i].folder_name = sorttitle
                            }
                        }
                        dialogClose("修改成功！", 2, 150, "");
                        //修改文件夹名之后，回显
                        getFolderCategory();
                        dia.content($('#folderCategoryManageDialog').html());
                    } else {
                        dialogClose(data.info, 2, 150, "");
                    }
                },
                error: function() {
                    dialogClose("修改失败！", 2, 150, "");
                }
            });

        }
    }, function() {
        //TODO 关闭修改窗口或者添加窗户后的动作
    });
}



function delFolderManage(dom, fid){
    art.dialog({
        title: "删除分类",
        content: "确定删除\"" + $(dom).closest("tr").find(".title").html() + "\"这个分类吗?",
        fixed: true,
        lock: true,
        icon: 'question'
    }, function() {
        $.ajax({
            type: "POST",
            async: false,
            data: {
                "fid": fid,
                "business_id": org_id,
                "business_type": 1,
                "folder_type": 3
            },
            url: url_path_action_login + "/yx/folder/deleteFolder",
            dataType: "json",
            success: function(data) {
                if (data.success) {
                    for (var i = 0; i < FolderList.data.length; i++) {
                        if (FolderList.data[i].id == fid) {
                            FolderList.data.splice(i, 1)
                        }
                    }
                    dialogClose("删除成功！", 2, 150, "");
                    getFolderCategory();
                    dia.content($('#folderCategoryManageDialog').html());
                    setTimeout(function(){
                        loadGroupResourceListTemplate(1);
                    },3000);
                } else {
                    art.dialog.alert("删除失败！" + data.info);
                }
            },
            error: function() {
                art.dialog.alert("删除失败！" + data.info);
            }
        });
    }, function() {

    });
}

function removeMemberSubmit(mid, fid,struc_id, callback) {
    if (!mid) {
        callback(false, "请选择要分组的资源");
        return
    }
    if (!fid) {
        callback(false, "请选择分组");
    }

    $.ajax({
        type: "POST",
        url: url_path_html + "/yx/folder/removeResourceToFolder",
        data: {
            "business_id":org_id,
            "business_type": 1,
            "bk_type": fid,
            "my_structure_id": struc_id,
            "res_info_id": mid
        },
        dataType: "json",
        success: function(res) {
            dialogClose("操作成功,正在刷新页面,请稍后...",3,300);
            setTimeout(function(){
                refreshPage(1);
            },3000);
        }
    });

}

/*根据点击的分类展示右侧列表*/
function categoryMembersByFolder(folderID) {
    current_folder_id = folderID;
    $("#category_"+folderID).addClass("active").siblings().removeClass("active");
    loadGroupResourceListTemplate(1);
}

function addResource(bk_id){
    var url = url_path_html + "/yx/html/resource/uploadYxResource.html";
    url += "?service_type=" + 1;
    url += "&service_id=" + org_id;
    url += "&hj_id=" + bk_id;
    url += "&file_type=5";
    url += "&res_type=" + 1;
    url += "&TB_iframe=true";
    url += "&height=" + 450;
    url += "&width=" + 720;
    tb_show("上传资源",url, "thickbox");
}

