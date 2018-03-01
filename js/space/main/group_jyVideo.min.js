var searchGroupInput;
window.onload = function(){
    loadMainNav();
   
    if(is_member == 1){
    	$("#resource_add").show();
    } 
    $(".fancybox").fancybox({
        maxWidth:1200,
        afterShow: function() {
            $(".fancybox-next").css("right","-10px");
            $(".fancybox-prev").css("left","-10px");
            var thisbox  =  $(this);
            var ads = $(this.wrap).css("z-index","99").parent().css("z-index","98");
            var type = thisbox[0].type;
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
    });
};

function tb_remove() {
    $("#TB_imageOff").unbind("click");
    $("#TB_closeWindowButton").unbind("click");
    $("#TB_window").fadeOut("fast",function(){ $('#TB_iframeContent').remove();$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
    $("#TB_load").remove();

    document.onkeydown = "";
    document.onkeyup = "";
    var page = 1;

    getFolderList(function(){
        getStatList();
    });
    loadGroupVideoListTemplate(page);
    return false;
}
/*加载标签模板*/
function loadMainNav(){
    var html = template("mainGroupNavInner",{});
    $("#groupMain").html(html);
    

    getFolderList(function(){
        getStatList();
    });
    
    $('#mainGroupNav a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $(".groupResContent").children("div").empty();
        getSortHtml($(this).attr("href"));
    });
    $('#mainGroupNav a:first').trigger("click");
}

function getSortHtml(id){
    var innerHtml = {"list":[],"is_login":is_login,"is_member":is_member,"is_admin":is_admin};
    /*资源*/
        var html = template("resourceSortInner",innerHtml);
        $("#groupResource").html(html);
        searchGroupInput = null;
        $("div[id $= 'search_input']").empty();
        searchGroupInput = $("#search_input").search({
            btnclass:"btn btn-warning",
            tips:"请输入关键字",
            onsearch:function(){
                loadGroupVideoListTemplate(1);
            }
        });
        $(".bannerLeft .resourceBtns > li > a").click(function(){
            $(this).parent().siblings().removeClass("active");
            $(this).parent().addClass("active");
            loadGroupVideoListTemplate(1);
        });

        $(".resourceTypeRadios input[name='typeRadios']").click(function(){
            var page_ = $("#resourcePage button[class='btn btn-primary btn-sm']").text();
            page_ = (page_ > 0?page_:1);
            $(".resourceTypeRadios input[name='typeRadios']").removeAttr("checked");
            $(this).attr("checked",true);
            if($(this).attr("value") == 1){
                var html = template("resourceTableTitalInner",{});
                $("#groupResourceListDiv").html(html);
            }
            loadGroupVideoListTemplate(page_);
        });

        $(".resourceTypeRadios input[name='typeRadios']").eq(0).trigger("click");

        $("#groupResource").on("click","th[ressortth]",function(){
            var this_ = $(this);
            $(this_).siblings("th[ressortth]").attr("reschecked","false")
            $(this_).attr("reschecked","true");
            if($(this_).find("i").attr("class") == "glyphicon glyphicon-arrow-down"){
                $(this_).find("i").attr("class","glyphicon glyphicon-arrow-up");
            }else{
                $(this_).find("i").attr("class","glyphicon glyphicon-arrow-down");
            }
            loadGroupVideoListTemplate(1);
        });
}

/*加载群组资源列表*/
function loadGroupVideoListTemplate(page){
	
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
    
    $.ajax({
        type: "GET",
        async: false,
        data : {
            "random_num":creatRandomNum(),
            "res_type": 1,
            "type_ids": 0,
            "keyword":keyword,
            "pageSize": 12,
            "rtype":2,
            "pageNumber": page,
            "view":org_id,
            "sort_type":sortType,
            "beike_type" : current_folder_id,
            "sort_num":sortNum
        },
        url: url_path_html + "/yx/resource/getServiceResourceList",
        dataType: "json",
        success: function (data) {
            if(data.success){
            	my_resource_info_upDataToJson(data);
            	
            	innerhtml['data'] = data;
            	innerhtml['getThumb']=getThumb;
            	innerhtml['getDownload']=getDownload;
            	innerhtml['cur_category']="";
            	innerhtml['page_number']=page;
                
                innerhtml['is_login'] = is_login;
                innerhtml['is_member'] = is_member;
                innerhtml['is_admin'] = is_admin;
                
                var html = template("resourceThumbListInner",innerhtml);
                //$("#groupResourceListDiv").html(html);
               
                //allViewPhoneData = data.video_list;
                $("#myVideo").html(html);
                //$("img.lazy"+page).lazyload({effect: "fadeIn"});
                $(".bk-main-r .gallery-more p").removeClass("hide");
                $(".bk-main-r .gallery-more img").addClass("hide");
                bindLi();
            }
        }
    });
	    
    //setFolder(innerhtml);
    
    var check_type = $(".resourceTypeRadios input[name='typeRadios'][checked]").val();
    if(check_type == 1){
        var html = template("resourceListInner",innerhtml);
        $("#groupResourceListTbody").html(html);
    }else{
        var html = template("resourceThumbListInner",innerhtml);
        $("#groupResourceListDiv").html(html);
        $("#groupResourceListDiv .res_thumb_div img").mouseover(function(e){
            var this_,this_height,this_width;
            this_ = $("#"+$(this).attr("res_id"));
            //console.log($(this_).css("display"));
            if($(this_).css("display") == "none") {
                $(".res_info_div").hide();
                $(this_).show();
                this_height = $(this_).height();
                this_width = $(this_).width();
                $(this_).css({
                    top: e.pageY - this_height,
                    left: (e.pageX + this_width > $(window).width() ? e.pageX - this_width : e.pageX)
                });
            }
        }).mouseout(function(){
            $(".res_info_div").hide();
        });
        $("#groupResourceListDiv .res_info_div").mouseover(function(){
            $(this).show();
        }).mouseout(function() {
            $(this).hide();
        });
    }
    $("#resourcePage").spacePage({
        pageSize:innerhtml.pageSize,
        pageNumber:innerhtml.pageNumber,
        totalPage:innerhtml.totalPage,
        totalRow:innerhtml.totalRow,
        callBack:loadGroupVideoListTemplate
    });
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

/*统计js*/
function getStatList(){
    $.ajax({
        type:"POST",
        url: url_path_action_login + "/yx/stat/getServiceStat",
        data:{
            business_type:1,
            business_id : org_id,
            service_id : 2
        },
        success: function(res){
             var html = template("resource_stat_inner",res.data);
             $("#resource_stat").html(html);
            //设置全部分类的总数
            $("#allCategory").html("（"+res.data.total+"）")
        },
        error: function(){},
        dataType: 'json'
    });
   
}


/*分类管理js*/
var current_folder_id = 0;
var FolderList ;
/*加载文件列表*/

function getFolderList(callback){
    $.ajax({
       type: "POST",
       async: false,
       url: url_path_html + "/yx/folder/queryFolders",
       data: {
           business_type: 1,
           person_id: org_id,
           identity_id: orgidentity_id,
           folder_type: 4
       },
       success: function(res) {
           FolderList = res;
           if (res.success) {
               showFolderListAtIndex(res.data);
           }
           if(callback){
               callback();
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

function showFolderListAtIndex(folderData) {
   var html = template("forld_category_inner", { folders: folderData , current_folder_id: current_folder_id});
   $("#forld_category").html(html);

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
           getFolderList(function(){
               getStatList();
           });
       },
       ok: true
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
                   "folder_type": 4,
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
                               FolderList.data[i].folder_name = sorttitle;
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
               "folder_type": 4
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
                	   loadGroupVideoListTemplate(1);
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


function removeMemberToFolder(mid) {
   var html = template("category_member_inner", { "FolderList": FolderList });
   var rmDialog = art.dialog({
       content: html,
       title: '移动视频',
       height: 110,
       width: 300,
       lock: true,
       padding: "0px 25px",
       fixed: true,
       init: function() {
           // 初始化身份选项卡
       },
       close: function() {},
       button: [{
           name: '确定',
           callback: function() {
               var fid = $("#category_memeber_select").val();
               if (!fid) {
                   dialogClose("请选择分组", 2, 150, "");
                   return;
               }
               removeMemberSubmit(mid, fid, function(status, message) {
                   if (status) {
                       rmDialog.close()
                   } else {
                       dialogClose(message, 2, 150, "")
                   }
               })
           }
       }, {
           name: '取消',
           callback: function() {

           }
       }]
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
       url: url_path_html + "/yx/folder/removeMemberToFolder",
       data: {
           "business_id":org_id,
           "business_type": 1,
           "bk_type": fid,
           "res_info_id": mid,
           "is_publish":true
       },
       dataType: "json",
       success: function(res) {
    	   dialogClose("操作成功,正在刷新页面,请稍后...",3,300);
    	   setTimeout(function(){
	           getFolderList();
	           loadGroupVideoListTemplate(1);
	           callback(res.success, res.info);
    	   },3000);
       }
   });

}

/*根据点击的分类展示右侧列表*/
function categoryMembersByFolder(folderID) {
   current_folder_id = folderID;
   $("#category_"+folderID).addClass("active").siblings().removeClass("active");
   loadGroupVideoListTemplate(1);
}

/*
 * to分类管理
 */
function toCategoryManageTree() {
    
	var url = url_path_html + "/yx/html/resource/categoryManageTree4Workroom.html?group_id=" + orgid;

	var dialog = art.dialog.open(url, {
		id : "toCategoryManageTree",
		lock : true,
		title : '',
		width : "80%",
		height : "60%",
		close : function() {
	
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
function addResource(fid){
	var url = url_path_html + "/yx/html/resource/uploadYxResource.html";
	url += "?service_type=" + 1;
	url += "&service_id=" + org_id;
	url += "&hj_id=" + fid;
	url += "&res_type=" + 1;
	url += "&file_type=" + 1;
	url += "&TB_iframe=true";
	url += "&height=" + 450;
	url += "&width=" + 720;
	tb_show("上传资源",url, "thickbox");
}

function addBigResource(){
	var url = url_path_html + "/yx/html/resource/uploadYxBigResource.html";
	url += "?service_type=" + 1;
	url += "&service_id=" + org_id;
	url += "&hj_id=" + current_folder_id;
	url += "&res_type=" + 1;
	url += "&file_type=" + 1;
	url += "&TB_iframe=true";
	url += "&height=" + 450;
	url += "&width=" + 720;
	tb_show("上传资源",url, "thickbox");
}


function toChangeResourceName(resource_id_int,resource_title,func){

    var url = url_path_html + "/yx/html/resource/changeResourceName.html?resource_id_int=" + resource_id_int +"&resource_title="+Base64.encode(resource_title);

    var dialog = art.dialog.open(url, {
        id : "toChangeResourceName",
        lock : true,
        title : '修改资源名称',
        width : 400,
        height : 150,
        ok : function() {
            var iframe = this.iframe.contentWindow;
            if (iframe.changeResourceName(resource_id_int)) {//保存数据成功
                dialogClose("修改成功!",3,200);
                if(undefined != func){
                    var jscode = new Function(func)();
                }
            }
        }
    });
}


function removeResource(res_info_id){
	art.dialog.confirm("确定要删除该条资源么?",function(){
		$.ajax({
			type: "POST",
			url: url_path_html + "/yx/resource/delServiceResource?t=" + Math.random(),
			data: {
				"ids": res_info_id
			},
			dataType: "json",
			success: function(res) {
				if(res.success){
					dialogClose("删除成功,正在刷新页面,请稍后...",3,300);
					setTimeout(function(){
						getStatList();
						getFolderList();
						loadGroupVideoListTemplate(1);
					},3000);
				}
			}
		});
	});
}

function getDownload(file_id,r_format,for_urlencoder_url,for_iso_url,picture_name){

    var _json =
    {
        "file_id":file_id,
        "file_ext":r_format,
        "for_urlencoder_url":for_urlencoder_url,
        "for_iso_url":for_iso_url,
        "url_code":encodeURI(picture_name)
    };
    var _down_path = dealDownpathFun(_json);

    return _down_path;
}

function getThumb(file_id){
    var Material_path = file_id.substring(0,2);
    var img_url =  url_path_down + "down/Thumbs/" + Material_path + "/" + file_id + ".thumb";
    return img_url;
}

function bindLi(){
    if(is_admin==1){
        $("#myVideo li.gallery-item").unbind("mouseenter").bind("mouseenter",function(){
            $(this).find(".picture-op-wrap .photo-op-tip").removeClass("hide");
        }).unbind("mouseleave").bind("mouseleave",function(){
            $(this).find(".picture-op-wrap .photo-op-tip").addClass("hide");
            $(this).find(".picture-op-wrap .photo-op-list").addClass("hide");
        });
        $("#myVideo li.gallery-item .photo-op-tip").unbind("click").bind("click",function(){
            $(this).parent(".picture-op-wrap").find(".photo-op-list").toggleClass("hide");
        });
    }
    $("#myVideo input[name='pictureCheckbox']").unbind("click").bind("click",function(){
        if($(this).attr("checked")){
            $(this).parents("li.gallery-item").addClass("checked");
        }else{
            $(this).parents("li.gallery-item").removeClass("checked");
        }
    });
}

function removeVideo(res_info_id,pageNumber){
	art.dialog.confirm("确定要删除该条资源么?",function(){
		$.ajax({
			type: "POST",
			url: url_path_html + "/yx/resource/delServiceResource?t=" + Math.random(),
			data: {
				"ids": res_info_id
			},
			dataType: "json",
			success: function(res) {
				if(res.success){
					dialogClose("删除成功,正在刷新页面,请稍后...",3,300);
					setTimeout(function(){
						getStatList();
						getFolderList();
						loadGroupVideoListTemplate(pageNumber);
					},3000);
				}
			}
		});
	});
}

