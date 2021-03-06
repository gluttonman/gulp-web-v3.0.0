﻿var person_id,identity_id,page_number = 1,business_type="2",
    page_size = 20,
    total_page = 1,
    cur_category = "",
    total_row,
    is_admin = 0,
    is_super = 0,
    is_member = 0,
    is_login = 0,
    is_exist = 0;

var allViewPhoneData=[];
var Gallery={};
window.onload = function(){
    if((GetQueryString("orgid")!=null)&&(GetQueryString("iid")!=null)){
        person_id = GetQueryString("orgid");
        identity_id = GetQueryString("iid");
    }else{
        art.dialog.alert("未检测到访问的群组信息！");
        return false;
    }
    if(person_id == $.cookie("person_id") && identity_id == $.cookie("identity_id")){
        visit_to = 3;
    }else if($.cookie("person_id")){
        visit_to = 2;
    }else{
        visit_to = 1;
    }

    /* 页面初始化模板*/
    var innerHtml={};
    innerHtml['is_admin']=is_admin;
    innerHtml['is_member']=is_member;
    $("#mainblog").html(template('mainblog_inner', innerHtml));

    if(cur_category!=null && cur_category!=""){
        $(".batch-op .batch-move").show();
        $(".batch-op .batch-remove").show();
        $(".batch-op .checkbox").show();
    }else {
        $(".batch-op .batch-move").hide();
        $(".batch-op .batch-remove").hide();
        $(".batch-op .checkbox").hide();
    }

    getGalleryCategory(function(){//先加载相册分类
        getGalleryStatistics();//加载相册统计，通过统计设置分类总数
    });

    getMyGallery(page_number, page_size, "replace");

    /*相片预览弹出层*/
    var fancybox = $(".fancybox").fancybox({
        maxWidth:1200,
        minWidth:600,
        beforeLoad : function (){
                this.width = 1200;
                this.height = 600;
                return true;
        },
        afterShow: function() {
            $(".fancybox-next").hide();
            $(".fancybox-prev").hide();
            $(this.content)[0].contentWindow.loadImage();
        }

    });
    Gallery={
        "getGalleryStatistics" : getGalleryStatistics,
        "getGalleryCategory" : getGalleryCategory,
        "getMyGallery" : getMyGallery,
        "getParamValue":function(param){
            switch(param){
                case "person_id":
                    return person_id;
                    break;
                case "identity_id":
                    return identity_id;
                    break;
                case "page_number":
                    return page_number;
                    break;
                case "page_size":
                    return page_size;
                    break;
                case "business_type":
                    return business_type;
                    break;
                case "total_page":
                    return total_page;
                    break;
                case "total_row":
                    return total_row;
                    break;
                case "cur_category":
                    return cur_category;
                    break;
                case "allViewPhoneData":
                    return allViewPhoneData;
                    break;
                case "visit_to":
                    return visit_to;
                    break;
            }
        }
    };
};

/*获取相册统计*/
function getGalleryStatistics(){
    var innerHtml = {};
    $.ajax({
        type: "GET",
        async: true,
        data: {
            random_num : creatRandomNum(),
            "person_id": person_id,
            "identity_id":identity_id
        },
        url: url_path_action_login + "/space/gallery/get_stat_num",
        dataType: "json",
        success: function (data) {
            innerHtml['data'] = data;
            var html = template('galleryStatistics_inner', innerHtml);
            $("#galleryStatistics").html(html);
            $("#allCategory").html("（"+data.pic_num+"）")
        },
        error: function(){
            var data = {}
            data.success = false;
            innerHtml['data'] = data;
            var html = template('galleryStatistics_inner', innerHtml);
            $("#galleryStatistics").html(html);
            //设置分类总数
            $("#allCategory").html("(0)")
        }
    });

}
/*获取相册*/
function getGalleryCategory(callback){
    var innerHtml = {};
    $.ajax({
        type : "GET",
        async : true,
        data:{
            random_num : creatRandomNum(),
            "person_id": person_id,
            "identity_id":identity_id,
            "business_type":business_type
        },
        url : url_path_action_login + "/space/gallery/get_galleryfolder",
        dataType: "json",
        success: function (data) {
            innerHtml['data'] = data;
            var html = template('galleryCategory_inner', innerHtml);
            $("#galleryCategory").html(html);
			var gallery_name = GetQueryString("gallery_name");
			if(null != gallery_name){
				gallery_name = Base64.decode(gallery_name);
				$("#galleryCategory li a").each(function(){
					if($(this).attr("title") == gallery_name){
						$(this).parent().removeClass("active");
						$(this).parent().addClass("active");
						CalleryClick();
					}
				});
			}else{
				$("#galleryCategory li").removeClass("active");
				$("#category_"+cur_category).addClass("active");
			}
            
            bindCategoryClick();
            if(callback){
                callback()
            }
        },
        error: function(){
            var data = {}
            data.success = false;
            innerHtml['data'] = data;
            var html = template('galleryCategory_inner', innerHtml);
            $("#galleryCategory").html(html);
        }
    });
}

function bindCategoryClick(){
    $("#galleryCategory li").click(function(){
        $("#galleryCategory li").removeClass("active");
        $(this).addClass("active");
		CalleryClick();
    });
}

function CalleryClick(){
	page_number = 1;
	getMyGallery(page_number,page_size,"replace");
	$(":checkbox").attr('checked',false);
	cur_category = $("#galleryCategory li.active input").val();
	if(cur_category!=null && cur_category!=""){
		$(".batch-op .batch-move").show();
		$(".batch-op .batch-remove").show();
		$(".batch-op .checkbox").show();
	}else {
		$(".batch-op .batch-move").hide();
		$(".batch-op .batch-remove").hide();
		$(".batch-op .checkbox").hide();
	}
}

/*相册管理*/
var dia;
function galleryCategoryManage(){
    getGalleryCategoryForManage();
    dia=art.dialog({
        content:$('#galleryCategoryManageDialog').html(),
        width: 700,
        //height: 400,
        lock:true,
        icon: null,
        title: '相册管理',
        //style:'succeed noClose',
        close:function(){
            //TODO 添加相册之后回显
            getGalleryCategory(function(){//先加载相册分类
                getGalleryStatistics();//加载相册统计，通过统计设置分类总数
            });

        },
        ok: true
    });

}
/*获取相册*/
function getGalleryCategoryForManage(){
    $("#galleryCategoryManageDialog table tbody").empty();
    $.ajax({
        type : "GET",
        async : false,
        data:{
            random_num : creatRandomNum(),
            "person_id": person_id,
            "identity_id":identity_id,
            "business_type":business_type
        },
        url : url_path_action_login + "/space/gallery/get_galleryfolder",
        dataType: "json",
        success : function(data) {
            if(data.success){
                var innerHTML = {};
                innerHTML['data'] = data;
                var html = template('galleryCategoryManage_inner', innerHTML);
                $("#galleryCategoryManageDialog table tbody").html(html);
            }
        },
        error : function(){
            var data = {}
            data.success = false;
            var innerHtml = {};
            innerHtml['data'] = data;
            var html = template('galleryCategoryManage_inner', innerHtml);
            $("#galleryCategoryManageDialog table tbody").html(html);
        }
    });
}

//type 0:add  1:update
function editSortManage(type,dom,id){
    var html_ = "<div id='editSortDiv' style='width:400px;'>" +
        "<table width='100%' class='table table-info'>" +
        "<tbody><tr>" +
        "<td scope='row' width='72'>相册名称<br/>&nbsp;</td>" +
        "<td colspan='3'><div id='editSortTitle'></div>" +
        "</tr></tbody>" +
        "</table>" +
        "</div>";
    var editSortTitleInput = null;
    art.dialog({
        title: (type==0?"增加相册":"修改相册"),
        content: html_,
        fixed: true,
        lock: true,
        width:400,
        init:function(){
            editSortTitleInput = $("#editSortTitle").input({
                index:3,
                placeholder:"请输入相册名称",
                maxCount:20,
                showType:1,
                width:275,
                onCheck:function(){
                    var val = editSortTitleInput.input("value");
                    if(val == ""){
                        editSortTitleInput.input("setTips","相册名称不能为空")
                    };
                }
            });

            if(type == 1){
                editSortTitleInput.input("setVal",$(dom).closest("tr").find(".title").html());
            }
            $("#editSortTitle").val($.trim($("#editSortTitle").val()).substring(0,20));
            $("#editSortHid").text(20-$("#editSortTitle").val().length);
            $("#editSortTitle").bind("keyup",function(){
                $("#editSortTitle").val($.trim($("#editSortTitle").val()).substring(0,20));
                $("#editSortHid").text(20-$("#editSortTitle").val().length);
            }).bind("paste",function(){
                $("#editSortTitle").val($.trim($("#editSortTitle").val()).substring(0,20));
                $("#editSortHid").text(20-$("#editSortTitle").val().length);
            });
        }
    },function(){
        var sorttitle = editSortTitleInput.input("value");
        if(sorttitle.length == 0){
            art.dialog.alert("请输入相册名称！");
            return false;
        }else if(sorttitle.length>20){
            art.dialog.alert("相册名称过长！");
            return false;
        }

        if(type == 0) {
            $.ajax({
                type : "POST",
                async : false,
                data:{
                    "person_id": person_id,
                    "identity_id":identity_id,
                    "folder_name":sorttitle,
                    "business_type":business_type,
                    "is_private":"0"
                },
                url : url_path_action + "/space/gallery/create_galleryfolder",
                dataType: "json",
                success : function(data) {
                    if(data.success){
                        dialogClose("保存成功！",2,150,"");
                        getGalleryCategoryForManage();
                        dia.content($('#galleryCategoryManageDialog').html());
                        getGalleryCategory();
                    }else{
                        dialogClose("保存失败！",2,150,"");
                    }
                },
                error : function(){
                    dialogClose("保存失败！",2,150,"");
                }
            });

        }else{
            $.ajax({
                type : "POST",
                async : false,
                data:{
                    "folder_name": sorttitle,
                    "folder_id": id
                },
                url : url_path_action + "/space/gallery/edit_galleryfolder",
                dataType: "json",
                success : function(data) {
                    if(data.success){
                        dialogClose("修改成功！",2,150,"");
                        getGalleryCategoryForManage();
                        dia.content($('#galleryCategoryManageDialog').html());
                        getGalleryCategory();
                    }else{
                        dialogClose("修改失败！",2,150,"");
                    }
                },
                error : function(){
                    dialogClose("修改失败！",2,150,"");
                }
            });

        }
    },function(){

    });
}
function delSortManage(dom,id){
    art.dialog({
        title: "删除相册",
        content: "确定删除\""+$(dom).closest("tr").find(".title").html()+"\"这个相册吗?",
        fixed: true,
        lock: true,
        icon: 'question'
    },function(){
        $.ajax({
            type : "POST",
            async : false,
            data:{
                "folder_id": id,
                "person_id": person_id,
                "identity_id": identity_id,
                "business_type": business_type
            },
            url : url_path_action + "/space/gallery/delete_galleryfolder",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    dialogClose("删除成功！",2,150,"");
                    getGalleryCategoryForManage();
                    dia.content($('#galleryCategoryManageDialog').html());
                    getGalleryCategory();
                }else{
                    art.dialog.alert("删除失败！"+data.info);
                }
            },
            error : function(){
                art.dialog.alert("删除失败！"+data.info);
            }
        });
    },function(){

    });
}
/*获取相册相片*/
function getMyGallery(pageNumber, pageSize, replaceOrAppend){
    var innerHtml = {};
    $.ajax({
        type: "GET",
        async: true,
        data: {
            random_num : creatRandomNum(),
            "folder_id": $("#galleryCategory li.active input").val(),
            "business_type": business_type,
            "identity_id": identity_id,
            "person_id": person_id,
            "page_num": pageNumber,
            "page_size": pageSize,
            "l_person_id":$.cookie("person_id"),
            "l_identity_id":$.cookie("identity_id")
        },
        url: url_path_action_login + "/space/gallery/get_picture",
        dataType: "json",
        success: function (data) {
            if(data.success){
                innerHtml['data'] = data;
                innerHtml['getSrc']=getSrc;
                innerHtml['getDownload']=getDownload;
                innerHtml['cur_category']=cur_category;
                innerHtml['page_number']=pageNumber;
                innerHtml['is_admin']=is_admin;
                var html = template('myGallery_inner', innerHtml);
                if(replaceOrAppend == "replace"){
                    allViewPhoneData = data.picture_list;
                    $("#myGallery").html(html);
                }else{
                    allViewPhoneData = allViewPhoneData.concat(data.picture_list);
                    $("#myGallery").append(html);
                }
                $("img.lazy"+pageNumber).lazyload({effect: "fadeIn"});
                $(".bk-main-r .gallery-more p").removeClass("hide");
                $(".bk-main-r .gallery-more img").addClass("hide");
                bindLi();
                if(data.page_num >= data.total_page){
                    bindLoadMore(false, data.total_row);
                }else{
                    bindLoadMore(true, data.total_row);
                }
                page_number = data.page_num;
                page_size = data.page_size;
                total_page = data.total_page;
                total_row = data.total_row;
            }
        },
        error: function(){
            var data = {}
            data.success = false;
            innerHtml['data'] = data;
            var html = template('myGallery_inner', innerHtml);
            $("#myGallery").html(html);
        }
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
function getSrc(file_id){
    var Material_path = file_id.substring(0,2);
    var img_url = STATIC_IMAGE_PRE + url_path_img + Material_path + "/" + file_id + "@200w_200h_100Q_1x.png";
    return img_url;
}
function bindLi(){
    if(is_admin==1){
        $("#myGallery li.gallery-item").unbind("mouseenter").bind("mouseenter",function(){
            $(this).find(".picture-op-wrap .photo-op-tip").removeClass("hide");
        }).unbind("mouseleave").bind("mouseleave",function(){
            $(this).find(".picture-op-wrap .photo-op-tip").addClass("hide");
            $(this).find(".picture-op-wrap .photo-op-list").addClass("hide");
        });
        $("#myGallery li.gallery-item .photo-op-tip").unbind("click").bind("click",function(){
            $(this).parent(".picture-op-wrap").find(".photo-op-list").toggleClass("hide")
        });
    }
    $("#myGallery input[name='pictureCheckbox']").unbind("click").bind("click",function(){
        if($(this).attr("checked")){
            $(this).parents("li.gallery-item").addClass("checked");
        }else{
            $(this).parents("li.gallery-item").removeClass("checked")
        }
    });
}

function bindLoadMore(moreFlag, total_row){
    $(window).off("scroll", bindScroll);
    $(".gallery-more").unbind("click");
    if(moreFlag){
        $(".bk-main-r .gallery-more p").html("加载更多");
        $(".gallery-more").bind("click", function(){
            scrollSetTimeout();
        });
        $(window).scroll(bindScroll);
    }else{
        if(total_row == 0){
            $(".bk-main-r .gallery-more p").html("暂无照片");
        }else{
            $(".bk-main-r .gallery-more p").html("没有照片了");
        }
    }
}
function bindScroll(){
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if (scrollTop + windowHeight == scrollHeight) {
        scrollSetTimeout();
    }
}
function scrollSetTimeout(){
    page_number++;
    $(".bk-main-r .gallery-more p").addClass("hide");
    $(".bk-main-r .gallery-more img").removeClass("hide");
    getMyGallery(page_number, page_size, "append");
}
/*添加评论弹出框*/
var comment_dialog;
var messageCommentAddOrEditMsg;
function comment(picture_id){
    if(!!!$.cookie("person_id")){
        art.dialog.alert("对不起，请登录后评论");
        return false;
    }
    comment_dialog = art.dialog(
        {
            content:"<div class='comment' id='messageCommentAddOrEditMsg'>" +
            "</div>",
            width: 350,
            lock:true,
            icon: null,
            title: "发表评论",
            //style:'succeed noClose',
            init:function(){
                messageCommentAddOrEditMsg = $("#messageCommentAddOrEditMsg").textarea({
                    index:1,
                    word_length:200
                });
            },
            close:function(){

            }
        }
        ,
        function(){
            var val = messageCommentAddOrEditMsg.textarea("value");
            if (val.length > 100 ||val.length == 0) {
                art.dialog.alert("请输入1-100个字");
                return false;
            }
            $.ajax({
                type : "POST",
                async : false,
                data:{"random_num":creatRandomNum(),
                    "person_id": $.cookie("person_id"),
                    "person_name": $.cookie("person_name"),
                    "identity_id": $.cookie("identity_id"),
                    "context": val,
                    "message_type": 5,
                    "type_id": "spaceGallCom"+picture_id+person_id+identity_id,
                    "parent_id": ""
                },
                url : url_path_action + "/bbs/message/save",
                dataType: "json",
                success : function(data) {
                    if(data.success){
                        $.ajax({
                            type : "POST",
                            async : false,
                            data:{"business_type":business_type,
                                "picture_id": picture_id,
                                "person_id": person_id,
                                "identity_id": identity_id
                            },
                            url : url_path_action + "/space/gallery/add_picture_comment_num",
                            dataType: "json",
                            success : function(data) {
                                if(data.success){
                                    dialogClose("评论成功！",2,150,"");
                                }else{
                                    dialogClose("评论失败！",2,150,"");
                                }
                            },
                            error : function(){
                                dialogClose("评论失败！",2,150,"");
                            }
                        });
                    }else{
                        dialogClose("评论失败！",2,150,"");
                    }
                },
                error : function(){
                    dialogClose("评论失败！",2,150,"");
                }
            });
        },
        function(){

        }
    );
}
function addPraise(pictureId,dom){
    if(!!!$.cookie("person_id")){
        art.dialog.alert("对不起，请登录后点赞");
        return false;
    }
    $.ajax({
        type : "POST",
        async : false,
        data:{
            "business_id":pictureId,
            "business_type": 2,
            "person_id": $.cookie("person_id"),
            "identity_id": $.cookie("identity_id")
        },
        url : url_path_action + "/space/praise/add_praise_info",
        dataType: "json",
        success : function(data) {
            if(data.success){
                dialogClose("点赞成功！",2,150,"");
                $(dom).removeClass("addPraise").addClass("cancelPraise");
                $(dom).removeAttr("onclick");
                reloadPicturePraise(pictureId,$(dom).closest("li.gallery-item"));
            }else{
                dialogClose("点赞失败！",2,150,"");
            }
        },
        error : function(){
            dialogClose("点赞失败！",2,150,"");
        }
    });
}
function cancelPraise(pictureId,dom){
    if(!!!$.cookie("person_id")){
        art.dialog.alert("对不起，请登录后取消点赞");
        return false;
    }
    $.ajax({
        type : "POST",
        async : false,
        data:{
            "business_id":pictureId,
            "business_type": 2,
            "person_id": $.cookie("person_id"),
            "identity_id": $.cookie("identity_id")
        },
        url : url_path_action + "/space/praise/cancel_praise_info",
        dataType: "json",
        success : function(data) {
            if(data.success){
                dialogClose("取消点赞成功！",2,200,"");
                $(dom).removeClass("cancelPraise").addClass("addPraise");
                $(dom).attr("onclick","addPraise("+pictureId+",this)");
                reloadPicturePraise(pictureId,$(dom).closest("li.gallery-item"));
            }else{
                dialogClose("取消点赞失败！",2,200,"");
            }
        },
        error : function(){
            dialogClose("取消点赞失败！",2,200,"");
        }
    });
}
function addDownLoadNum(pictureId){
    $.ajax({
        type : "POST",
        async : false,
        data:{"business_type":business_type,
            "picture_id": pictureId,
            "person_id": person_id,
            "identity_id": identity_id
        },
        url : url_path_action_login + "/space/gallery/add_picture_download_num",
        dataType: "json",
        success : function(data) {
        },
        error : function(){
        }
    });
}
function addBrowseNum(pictureId){
    $.ajax({
        type : "POST",
        async : false,
        data:{"business_type":business_type,
            "picture_id": pictureId,
            "person_id": person_id,
            "identity_id": identity_id
        },
        url : url_path_action_login + "/space/gallery/add_picture_browse_num",
        dataType: "json",
        success : function(data) {
        },
        error : function(){
        }
    });
}
function reloadPictureLi(id,dom){
    $.ajax({
        type : "GET",
        async : false,
        data:{
            random_num : creatRandomNum(),
            "relation_id": id,
            "business_type": business_type
        },
        url : url_path_action_login + "/space/gallery/get_picturebyid",
        dataType: "json",
        success : function(data) {
            dom.find(".name font").html(data.picture_name);
            dom.find("a.name").attr("title",data.picture_name);
            dom.find(".statistics .download").attr("title","下载数"+data.download_num).html(data.download_num);
            dom.find(".statistics .comment").attr("title","评论数"+data.comment_num).html(data.comment_num);
            dom.find(".statistics .preview").attr("title","预览数"+data.browse_num).html(data.browse_num);
        },
        error : function(){
        }
    });
}
function reloadPicturePraise(id,dom){
    $.ajax({
        type : "GET",
        async : false,
        data:{
            random_num : creatRandomNum(),
            "business_id": id,
            "business_type": 2
        },
        url : url_path_action_login + "/space/praise/get_praisecount_byid",
        dataType: "json",
        success : function(data) {
            dom.find(".statistics .praise").attr("title","点赞数"+data.total).html(data.total);
        },
        error : function(){
        }
    });
}


/**
 * 打开编辑相片弹出.
 * */
function editPhoto(id,dom){
    $(this).parents(".picture-op-wrap").find(".photo-op-list").addClass("hide")
    var dialog = art.dialog({
        content: '<div class="row" style="margin:0px;width: 500px;line-height: 34px;">'+
        '<div class="col-md-2">照片名称：</div>'+
        '<div class="col-md-10"><input name="" class="form-control" id="photo_name" type="text" value="'+$(dom).closest("li.gallery-item").find(".gallery-detail .name font").text()+'"/>'+
        '</div></div>',
        fixed: true,
        id: 'Fm7',
        okVal: '确定',
        title: '修改照片名称',
        ok: function () {
            var photo_name = $.trim(document.getElementById('photo_name').value);
            var title_char_num = 0;
            for (var i = 0; i < photo_name.length; i++) {
                if ( photo_name[i].match(/[^\x00-\xff]/ig) != null)
                    title_char_num += 1;
                else
                    title_char_num += 1;
            }
            if(title_char_num==0 || title_char_num > 100){
                art.dialog.alert("请输入1-100个字！");
                return false;
            }
            $.ajax({
                type : "POST",
                url : url_path_action + "/space/gallery/edit_picture",
                async : false,
                dataType : "json",
                data:{relation_id:id,picture_name:photo_name},
                success : function(data){
                    if(data.success){
                        reloadPictureLi(id,$(dom).closest("li.gallery-item"));
                    }else{
                        art.dialog.alert(data.info);
                    }
                }
            });
        },
        cancel: true
    });

}
/**
 * 移动相片.
 * */
function movePhotoToFolder(type,relation_id,from_folder_id){
    if(type == 1){
        var c_list = $(".pictureCheckbox:checked");
        var listlength = c_list.length;
        if(listlength == 0){
            dialogOk("请选择照片",200,'');
            return false;
        }
        c_list.each(function(i){
            var obj = jQuery.parseJSON($(c_list[i]).val());
            relation_id += (i==0?""+obj.relation_id:","+obj.relation_id);
            from_folder_id = obj.folder_id;
        });
    }

    var selecthtmlStr = getGallery(from_folder_id);
    if(!selecthtmlStr){
        art.dialog.alert("未发现其他相册！");
    }else {
        var dialog = art.dialog({
            content: '<div class="row" style="margin:0px;width: 500px;line-height: 34px;">' +
            '<div class="col-md-2">移动到：</div>' +
            '<div class="col-md-10">' + selecthtmlStr +
            '</div></div>',
            fixed: true,
            id: 'Fm7',
            okVal: '确定',
            title: '移动照片',
            ok: function () {
                var to_folder_id = $("#galleryid").val();
                $.ajax({
                    type: "POST",
                    url: url_path_action + "/space/gallery/move_pictures",
                    async: false,
                    dataType: "json",
                    data: {
                        relation_ids: relation_id,
                        from_folder_id: from_folder_id,
                        to_folder_id: to_folder_id,
                        business_type: business_type
                    },
                    success: function (data) {
                        if (data.success) {
                            dialogClose("操作成功！", 2, 200, '');
                            getGalleryStatistics();
                            getGalleryCategory();
                            window.scrollTo(0, 0);
                            getMyGallery('1', page_size, "replace");
                            if (type == 1) {
                                $(":checkbox").attr('checked', false);
                            }
                        } else {
                            dialogOk(data.info, 300, '');
                        }
                    }
                });
            },
            cancel: true
        });
    }
}

function getGallery(from_folder_id){
    var galleryHtmlStart = "<select id='galleryid' class='form-control'>";
    var galleryHtml = "";
    $.ajax({
        type : "GET",
        url : url_path_action_login + "/space/gallery/get_galleryfolder?person_id="+person_id+"&identity_id="+identity_id+"&random_num="+creatRandomNum()+"&business_type="+business_type,
        async : false,
        dataType : "json",
        success : function(data){
            if(data.success){
                var size = 0;
                if((size=data.folder_list.length)>0){
                    for(var i=0;i<size;i++){
                        if(from_folder_id != data.folder_list[i].id){
                            galleryHtml=galleryHtml+"<option value='"+data.folder_list[i].id+"'>"+data.folder_list[i].folder_name+"</option>"
                        }
                    }
                }
            }else{
                art.dialog.alert(data.info);
            }
        }
    });
    if(galleryHtml == ""){
        return false;
    }else{
        var galleryHtmlEnd = "</select>";
        return galleryHtmlStart+galleryHtml+galleryHtmlEnd;
    }
}

/**
 * 删除照片
 *
 * */
function removePhoto(type,relation_id,folder_id){
    var listlength = 0;
    if(type == 1){
        var c_list = $(".pictureCheckbox:checked");
        listlength = c_list.length;
        if(listlength == 0){
            dialogOk("请选择照片",200,'');
            return false;
        }
        c_list.each(function(i){
            var obj = jQuery.parseJSON($(c_list[i]).val());
            relation_id += (i==0?""+obj.relation_id:","+obj.relation_id);
            folder_id = obj.folder_id;
        });
    }else{
        listlength = 1;
    }

    art.dialog.confirm((listlength == 1?"确定要删除该照片吗?":"确定要删除这些照片吗?"), function () {
        $.ajax({
            type : "POST",
            url : url_path_action + "/space/gallery/delete_picture",
            async : false,
            dataType : "json",
            data:{
                relation_ids:relation_id,
                folder_id:folder_id,
                "person_id": person_id,
                "identity_id": identity_id,
                "business_type": business_type
            },
            success : function(data){
                if(data.success){
                    dialogClose("操作成功！",2,200,'');
                    getGalleryStatistics();
                    getGalleryCategory();
                    window.scrollTo(0,0);
                    getMyGallery('1', page_size, "replace");
                    if(type == 1){
                        $(":checkbox").attr('checked',false);
                    }
                }else{
                    dialogOk(data.info,300,'');
                }
            }
        });
    }, function () {

    });
}

/*批量处理全选功能*/
function checkAll(dom){
    if($(dom).attr("checked")){
        $("#myGallery input[name='pictureCheckbox']").attr("checked",true);
        $("#myGallery .gallery-item").addClass("checked")
    }else{
        $("input[name='pictureCheckbox']").attr("checked",false);
        $("#myGallery .gallery-item").removeClass("checked")
    }
}

/*上传图片点击事件*/
function doupload(){
	tb_show("上传照片","upload_photo.html?folderid="+ cur_category+"&id="+person_id+"&identity_id="+identity_id+"&business_type="+business_type+"&is_admin="+is_admin+"&TB_iframe=true&height=380&width=700","thickbox");
}
function tb_remove_after(){
    getGalleryCategory(function(){//先加载相册分类
        getGalleryStatistics();//加载相册统计，通过统计设置分类总数
    });
	$(":checkbox").attr('checked',false);
	getMyGallery(1, page_size, "replace");
}