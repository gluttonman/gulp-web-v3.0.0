﻿var Blog = function(){
	var person_id,
	identity_id,
	is_self_login = false,
	blogSearch,
	page_number = 1, 
	page_size = 10,
	total_page = 1,
	cur_page_number = 1,
	cur_category = "",
	seq = 0,
	blogSearchMessage,
	us_type = 1;//1update 2save
    var offArticleArea = true;//文章发布范围，海沧设置为false
	
	function getArticleStatistics(){
	    var innerHtml = {};
	    $.ajax({
	        type: "GET",
	        async: true,
	        data: {
	            "random_num": creatRandomNum(),
	            "org_person_id": person_id,
	            "identity_id": identity_id,
	            "business_type": 1
	        },
	        url: url_path_action_login + "/blog/getBlogInfo",
	        dataType: "json",
	        success: function (data) {
	        	innerHtml['data'] = data;
	            var html = template('articleStatistics_inner', innerHtml);
	            $("#articleStatistics").html(html);
	        },
	        error: function(){
	        	var data = {}
	        	data.success = false;
	        	innerHtml['data'] = data;
	            var html = template('articleStatistics_inner', innerHtml);
	            $("#articleStatistics").html(html);
	        }
	    });
	}
	
	function getArticleCategory(){
	    var innerHtml = {};
	    $.ajax({
	        type : "GET",
	        async : true,
	        data:{
	            "random_num":creatRandomNum(),
	            "person_id": person_id,
	            "identity_id":identity_id,
	            "business_type": 1,
	            "business_id": person_id,
	            "business_iid": identity_id,
	            "level":2
	        },
	        url : url_path_action_login + "/blog/getCategory",
	        dataType: "json",
	        success: function (data) {
	        	innerHtml['data'] = data;
	            var html = template('articleCategory_inner', innerHtml);
	            $("#articleCategory").html(html);
	            bindCategoryClick();
	            
	            $("#articleCategory li").removeClass("active");
	            $("#category_"+cur_category).addClass("active");
	        },
	        error: function(){
	        	var data = {}
	        	data.success = false;
	        	innerHtml['data'] = data;
	            var html = template('articleCategory_inner', innerHtml);
	            $("#articleCategory").html(html);
	        }
	    });
	}
	
	function bindCategoryClick(){
		$("#articleCategory li").click(function(){
	        $("#articleCategory li").removeClass("active");
	        $(this).addClass("active");
	        blogSearch.search("clear");
	        cur_category = $("#articleCategory li.active input").val();
	        getMyArticle(1,10,"replace");
	    });
	}
	
	function refreshCategory(cur_c){
        $("#articleCategory li").removeClass("active");
        $("#category_"+cur_c).addClass("active");
        blogSearch.search("clear");
        cur_category = $("#articleCategory li.active input").val();
        getMyArticle(1,10,"replace");
	}
	
	function getArticleCategoryForManage(){
		$("#articleCategoryManageDialog table tbody").empty();
		$.ajax({
			type : "GET",
			async : false,
			data:{"random_num":creatRandomNum(),
				"person_id":$.cookie("person_id"),
				"identity_id":$.cookie("identity_id"),
	            "business_type": 1,
	            "business_id": $.cookie("person_id"),
	            "business_iid": $.cookie("identity_id"),
	            "level": 2			
			},
			url : url_path_action + "/blog/getCategory",
			dataType: "json",
			success : function(data) {
				if(data.success){
					var innerHTML = {};
					innerHTML['data'] = data;
					var html = template('articleCategoryManage_inner', innerHTML);
					$("#articleCategoryManageDialog table tbody").html(html);
	                //这里计算seq最大值
	                for(var i = 0;i<data.list.length;i++){
	                    seq = data.list[i].sequence>seq?data.list[i].sequence:seq;
	                }
				}
			},
			error : function(){
				var data = {}
	        	data.success = false;
	        	innerHtml['data'] = data;
	            var html = template('articleCategoryManage_inner', innerHtml);
	            $("#articleCategoryManageDialog table tbody").html(html);
			}
		});
	}
	var dia;
	function articleCategoryManage(fromPublish){
		getArticleCategoryForManage();
		dia=art.dialog({
	        content:$('#articleCategoryManageDialog').html(),
	        width: 700,
	        //height: 400,
	        lock:true,
	        icon: null,
	        title: '分类管理',
	        //style:'succeed noClose',
	        close:function(){
	        	if(fromPublish == 2){
	        		getPersonSortList();
	        	}
	        },
			ok: true
	    });
		
	}
	
	//type 0:add  1:update
	function editSortManage(type,dom,id){
	    var html_ = "<div id='editSortDiv' style='width:400px;'>" +
	            "<table width='100%' class='table table-info'>" +
	                "<tbody><tr>" +
	                    "<td scope='row' width='72'>分类名称<br/>&nbsp;</td>" +
	                    "<td colspan='3'><div id='editSortTitle'></div>" +
	                "</tr></tbody>" +
	            "</table>" +
	            "</div>";
	    var editSortTitleInput = null;
	    art.dialog({
	        title: (type==0?"增加分类":"修改分类"),
	        content: html_,
	        fixed: true,
	        lock: true,
	        width:400,
	        init:function(){
	            editSortTitleInput = $("#editSortTitle").input({
	                index:3,
	                placeholder:"请输入分类名称",
	                maxCount:20,
	                showType:1,
	                width:275,
	                onCheck:function(){
	                    var val = editSortTitleInput.input("value");
	                    if(val == ""){
	                        editSortTitleInput.input("setTips","分类名称不能为空")
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
	            art.dialog.alert("请输入分类名称！");
	            return false;
	        }else if(sorttitle.length>20){
	            art.dialog.alert("分类名称过长！");
	            return false;
	        }
	
	        if(type == 0) {
	            $.ajax({
	                type : "POST",
	                async : false,
	                data:{
	                    "random_num":creatRandomNum(),
	                    "name": sorttitle,
	                    "sequence": seq + 1,
	                    "person_id": $.cookie("person_id"),
	                    "identity_id":$.cookie("identity_id"),
	                    "business_type":1,
	                    "business_id":$.cookie("person_id"),
	                    "business_iid":$.cookie("identity_id"),
	                    "level":2,
	                    "person_name": $.cookie("person_name")
	                },
	                url : url_path_action + "/blog/savePersonCategory",
	                dataType: "json",
	                success : function(data) {
	                    if(data.success){
	                        dialogClose("保存成功！",2,150,"");
	                        seq += 1;
	                        getArticleCategoryForManage();
	        				dia.content($('#articleCategoryManageDialog').html());
	        				getArticleCategory();
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
	                    "random_num":creatRandomNum(),
	                    "name": sorttitle,
	                    "id": id
	                },
	                url : url_path_action + "/blog/updatePersonCategory",
	                dataType: "json",
	                success : function(data) {
	                    if(data.success){
	                        dialogClose("修改成功！",2,150,"");
	                        getArticleCategoryForManage();
	        				dia.content($('#articleCategoryManageDialog').html());
	        				getArticleCategory();
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
	        title: "删除分类",
	        content: "确定删除\""+$(dom).closest("tr").find(".title").html()+"\"这个分类吗?",
	        fixed: true,
	        lock: true,
	        icon: 'question'
	    },function(){
	        $.ajax({
	            type : "POST",
	            async : false,
	            data:{
	                "random_num":creatRandomNum(),
	                "ids": id
	            },
	            url : url_path_action + "/blog/deletPersonCategoryByIds",
	            dataType: "json",
	            success : function(data) {
	                if(data.success){
	                    dialogClose("删除成功！",2,150,"");
	                    getArticleCategoryForManage();
	    				dia.content($('#articleCategoryManageDialog').html());
	    				getArticleCategory();
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
	//0 up 1 down
	function moveSortManage(dom,type){
	    var thisElem = $(dom).closest("tr");
	    var flag = false;
	    if((type == 0 && thisElem.index() > 0)||(type == 1 && thisElem.index() < thisElem.siblings().length)){
	        flag = true;
	    }
	
	    if(flag){
	        var c_json = [];
	        if(type == 0){
	            var acid = thisElem.find(".cid").val();
	            var acseq = thisElem.find(".cseq").val();
	            var bcid = thisElem.prev().find(".cid").val();
	            var bcseq = thisElem.prev().find(".cseq").val();
	            c_json = [{"category_id":acid,"sequence":bcseq},
	                {"category_id":bcid,"sequence":acseq}];
	        }else{
	            var acid = thisElem.find(".cid").val();
	            var acseq = thisElem.find(".cseq").val();
	            var bcid = thisElem.next().find(".cid").val();
	            var bcseq = thisElem.next().find(".cseq").val();
	            c_json = [{"category_id":acid,"sequence":bcseq},
	                {"category_id":bcid,"sequence":acseq}];
	        }
	
	        //处理ajax
	        $.ajax({
	            type : "POST",
	            async : false,
	            data:{
	                "random_num":creatRandomNum(),
	                "category": JSON.stringify(c_json),
	                "org_person_id": $.cookie("person_id"),
	                "identity_id": $.cookie("identity_id")
	            },
	            url : url_path_action + "/blog/updateCategoryOrder",
	            dataType: "json",
	            success : function(data) {
	                if(data.success){
	                    dialogClose("操作成功！",2,150,"");
	                    getArticleCategoryForManage();
	    				dia.content($('#articleCategoryManageDialog').html());
	    				getArticleCategory();
	                }else{
	                    dialogClose("操作失败！",2,150,"");
	                }
	            },
	            error : function(){
	                dialogClose("操作失败！",2,150,"");
	            }
	        });
	    }
	}
	
	function getNewArticle(){
	    var innerHtml = {};
	    $.ajax({
	        type: "GET",
	        async: true,
	        data: {
	            "random_num": creatRandomNum(),
	            "search_type": 3,
	            "identity_id": identity_id,
	            "person_id": person_id,
	            "pagenum": 1,
	            "pagesize": 6,
	            "business_type": 1
	        },
	        url: url_path_action_login + "/blog/search",
	        dataType: "json",
	        success: function (data) {
	        	innerHtml['data'] = data;
	            var html = template('newArticle_inner', innerHtml);
	            $("#newArticle").html(html);
	            if(data.success && data.list.length>0){
	            	$("#newArticle").addClass("news-bg");
	            }else{
	            	$("#newArticle").removeClass("news-bg");
	            }
	        },
	        error: function(){
	        	var data = {}
	        	data.success = false;
	        	innerHtml['data'] = data;
	            var html = template('newArticle_inner', innerHtml);
	            $("#newArticle").html(html);
	        }
	    });	
	}
	
	
	function getMyArticle(page_number, page_size, replaceOrAppend){
		var searchVal = blogSearch.search("value");
	    if(searchVal.length > 0){
	        searchVal = Base64.encode(searchVal);
	    }
	    var innerHtml = {};
	    var cur_category_id = $("#articleCategory li.active input").val();
	    var ajaxData = {
	        "random_num": creatRandomNum(),
	        "search_type": "title",
	        "search_key": searchVal,
	        "identity_id": identity_id,
	        "person_id": person_id,
	        "pagenum": page_number,
	        "pagesize": page_size,
	        "business_type": 1,
	        "category_id": cur_category_id,
	        "l_person_id":$.cookie("person_id"),
	        "l_identity_id":$.cookie("identity_id")
	
	    };
	    if(cur_category_id=='category_reprint'){
	        ajaxData["reprint"]= true;
	        ajaxData["category_id"]= '';
	    }
	    $.ajax({
	        type: "GET",
	        async: true,
	        data: ajaxData,
	        url: url_path_action_login + "/blog/search",
	        dataType: "json",
	        success: function (data) {
	        	data.is_self_login = is_self_login;
	        	innerHtml['data'] = data;
	        	innerHtml['cur_person_id'] = $.cookie("person_id");
	        	innerHtml['checkIsSpaceImg'] = checkIsSpaceImg;
                innerHtml['base64Encode'] = function(msg){
                    return Base64.encode(msg);
                };
	            var html = template('myArticle_inner', innerHtml);
	            if(replaceOrAppend == "replace"){
		            $("#myArticle").html(html);
	            }else{
		            $("#myArticle").append(html);
	            }
	            if(data.page_number >= data.total_page){
		            bindLoadMore(false, data.page_number, data.page_size, data.total_row);
	            }else{
		            bindLoadMore(true, data.page_number, data.page_size, data.total_row);
	            }
	            cur_page_number = data.page_number;
	            total_page = data.total_page;
	        },
	        error: function(){
	        	var data = {}
	        	data.success = false;
	        	innerHtml['data'] = data;
	            var html = template('newArticle_inner', innerHtml);
	            $("#newArticle").html(html);
	        }
	    });
	}
	function getPraiseList(){
	    $("#main ").on("click","div.autor .getPraise", function () {
	        var $praiseList = $(this).closest("div.autor").find(".praiseList");
	        var id= $(this).data("id");
	        var innerHtml = {};
	        if($praiseList.hasClass("none")){
	            $.ajax({
	                type: "GET",
	                async: true,
	                data: {
	                    "random_num": creatRandomNum(),
	                    "business_id": id,
	                    "business_type": 1,
	                    "page_num":1,
	                    "page_size":9999
	
	                },
	                url: url_path_action_login + "/space/praise/get_praiseinfo_list",
	                dataType: "json",
	                success: function (data) {
	                    innerHtml["data"] = data;
	                    var html = template('praiseList_inner', innerHtml);
	                    $praiseList.find(".praiseListUl").html(html);
	                    $praiseList.removeClass("none");
	                },
	                error: function(){
	                    var data = {}
	                    data.success = false;
	                    innerHtml['data'] = data;
	                    var html = template('praiseList_inner', innerHtml);
	                    $praiseList.find(".praiseListUl").html(html);
	                }
	            });
	        }else{
	            $praiseList.addClass("none");
	        }
	    });
	    $ (document).on ('click',function (e)
	    {
	        e = e || window.event;
	        if (e.target != $ ('#main div.autor .praiseList')[0])
	        {
	            $ ('#main div.autor .praiseList').addClass("none");
	        }
	    });
	}
	function bindLoadMore(moreFlag, page_number, page_size, total_row){
		$(".article_more").unbind("click");
		if(moreFlag){
			$(".article_more").html("加载更多");
			$(".article_more").bind("click", function(){
				loadMore(page_number, page_size);
			});
		}else{
			if(total_row == 0){
				$(".article_more").html("暂无文章");
			}else{
				$(".article_more").html("没有文章了");
			}
		}
	}
	
	function loadMore(page_number, page_size){
		getMyArticle(+page_number+1, page_size, "append");
	}
	
	function deleteArticle(article_id, title,category_id,expand_id){
		art.dialog.confirm("确定要删除文章\""+Base64.decode(title)+"\"吗？", function () {
	        $.ajax({
	            type: "POST",
	            async: false,
	            data: {
	                "random_num": creatRandomNum(),
	                "ids": '[{"id":'+article_id+',"category_id":'+category_id+',"expand_id":'+expand_id+'}]'
	            },
	            url: url_path_action + "/blog/deleteArticle",
	            dataType: "json",
	            success: function (data) {
	                if(data.success){
	                    art.dialog({
	                        icon: 'succeed',
	                        fixed: true,
	                        lock: true,
	                        content: "删除成功！正在刷新文章...",
	                        cancel: false,
	                        time: 3,
	                        close: function(){
	                        	getMyArticle(1, cur_page_number*page_size, "replace");
	                            getArticleStatistics();
	                            getArticleCategory();
	                            getNewArticle();
	                        }
	                    });
	                }else{
	                    art.dialog.alert("删除失败！",function(){
	                        
	                    }).time(1);
	                }
	            },
	            error: function () {
	                art.dialog.alert("删除失败！",function(){
	                    
	                }).time(1);
	            }
	        });
	    }, function () {
	
	    });
	}
	
	//发表文章
	function addArticles(type, article_id, expand_id){
		us_type = type;
		if(type==1 && article_id != ""){
	        $("#article_id").val(article_id);
	    }
	    var html = "<div id='addArticles'>"+
	        "<div class='row' style='margin:0 0 10px 0; width: 1000px;'>"+
	        "<div class='col-md-1'>文章标题：</div>"+
	        "<div class='col-md-11'>"+
	        "<div id='post_title'></div>"+
	        "</div>"+
	        "</div>"+
	        "<div class='row' style='margin:0 0 10px 0; width: 1000px;line-height: 34px;'>"+
	        "<div class='col-md-1'>个人分类：</div>"+
	        "<div class='col-md-3'>"+
	        "<select class='form-control' id='per_sort'></select>"+
	        "</div>"+
	        "<div class='col-md-1'><a href='javascript:void(0);' onclick='Blog.articleCategoryManage(2);' class='category_btn'>[管理]</a></div>"+
	        "<div class='col-md-1'>专栏分类：</div>"+
	        "<div class='col-md-3'>"+
	        "<select class='form-control' id='org_sort'></select>"+
	        "</div>"+
	        "</div>"+
            ((type==1 && article_id != "")?"":getArticleArea()) +
	        "<div class='row' style='margin:0px; width: 1000px;line-height: 34px;'>"+
	        "<div class='col-md-1'>文章内容：</div>"+
	        "<div class='col-md-11'>"+
	        "<script id='editor' type='text/plain'></script>"+
	        "</div>"+
	        "</div>"+
	        "</div>";
	    var ue;
	    window.postTitleInput = null;
		var thisdia = art.dialog({
			content : html,
			width : 1000,
			height : 600,
			lock : true,
			icon : null,
			title : '发表文章',
			//resize: true,
			init : function() {
	            postTitleInput = $("#post_title").input({
	                index:4,
	                placeholder:"请输入文章标题",
	                maxCount:40,
	                showType:2,
	                width:500,
	                onCheck:function(){
	                    var val = postTitleInput.input("value");
	                    if(val == ""){
	                        postTitleInput.input("setTips","文章标题不能为空")
	                    };
	                }
	            });
				getPersonSortList();
				getOrgSortList();
				$("#post_title").focus();
	            ue = UE.getEditor('editor', {
	                toolbars: [
	                    //tool_arr    //默认显示的工具栏，在base-config.js文件中定义
                        ['undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough','|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                        'link', 'unlink','simpleupload','attachment']
	                ],
	                initialFrameWidth:900,    //编辑器宽度
	                initialFrameHeight:500,    //编辑器高度
	                zIndex:11111
	            });
	            if(type==1){
	                ue.ready(function(){
	                    ue.setContent(getArticleInfo(article_id, expand_id));
	                    $("#post_title").val($.trim($("#post_title").val()).substring(0,40));
	                    $("#post_hid").text(40-$("#post_title").val().length);
	                });
	            }
	            $("#post_title").bind("keyup",function(){
	                $("#post_title").val($.trim($("#post_title").val()).substring(0,40));
	                $("#post_hid").text(40-$("#post_title").val().length);
	            }).bind("paste",function(){
	                $("#post_title").val($.trim($("#post_title").val()).substring(0,40));
	                $("#post_hid").text(40-$("#post_title").val().length);
	            });
                $("#addArticles .dropdown-menu").on("click", ".art_area_item", function(e) {
                    e.stopPropagation();
                });
			},
			//style:'succeed noClose',
			close : function() {
	            ue.destroy();
			}
		}, function() {

			//输入校验
			var post_title =  postTitleInput.input("value");
			if (post_title == 0 || post_title.length > 40) {
				art.dialog.alert("文章标题请输入1-40个字符！");
				return false;
			}
	        //个人分类
	        var per_sort = $("#per_sort").val();
	        if(per_sort == 0 || !!!per_sort){
	            dialogOk("请选择个人分类！",300,"");
	            return false;
	        }
	        //机构分类
	        var org_sort = $("#org_sort").val();
	        if(org_sort == 0 || !!!org_sort){
	            org_sort = "";
	        }
	
	        //文章内容
	        var content = ue.getContent();
	        if(!ue.hasContents()){
	            art.dialog.alert("请填写文章内容！");
	            return false;
	        }
	        ue.getKfContent(function(content) {
                //简介
                var overviewText = ue.getContentTxt().substring(0,100);
                //if(!(overviewText.length > 0)){
                //        art.dialog.alert("请填写文章内容！");
                //       return false;
                //}
                //第一张图
                var firstImg = "";
                var root = UE.htmlparser(content, true);
                var imgs_ = new Array();
                var imgs_list = root.getNodesByTagName('img');
                for (var i = 0;i<imgs_list.length; i++){
                    imgs_[i] = imgs_list[i].getAttr( 'src');
                    if(i==0){
                        firstImg = imgs_list[i].getAttr( 'src');
                    }
                }

	            var checkDialog = art.dialog({
	                icon: 'succeed',
	                fixed: true,
	                lock: true,
	                content: "正在保存...",
	                title: "提示",
	                ok: false,
	                cancel: false,
	                close:function(){
	                    getMyArticle(1, page_size, "replace");
	                    getArticleStatistics();
	                    getArticleCategory();
	                    getNewArticle();
	                }
	            });
	            $.ajax({
	                type: "POST",
	                async: false,
	                data: {
	                    "random_num": creatRandomNum(),
	                    "person_category_id": per_sort,
	                    "overview": overviewText,
	                    "title": post_title,
	                    "thumb_id": firstImg,
	                    "thumb_ids": JSON.stringify(imgs_),
	                    "content": content,
	                    //"blog_id":blog_id,
	                    "person_id": $.cookie("person_id"),
	                    "person_name": $.cookie("person_name"),
	                    "identity_id": $.cookie("identity_id"),
	                    "org_category_id": org_sort,
	                    "province_id": person_info_['sheng_id'],
	                    "city_id": person_info_['shi_id'],
	                    "district_id": person_info_['qu_id'],
	                    "school_id": person_info_['xiao_id'],
	                    "business_type": 1,
	                    "id": (!!article_id ? article_id : "")
	                },
	                url: url_path_action + "/blog/" + (type == 1 ? "updateArticle" : "saveArticle"),
	                dataType: "json",
	                success: function (data) {
	                    if (data.success) {
                            if(type==1 && article_id != ""){
                                //setArticleArea(article_id,"update_release_article");
                            }else{
                                setArticleArea(data.id,"release_article");
                            }
	                        checkDialog.content("保存成功！正在刷新文章...");
	                        checkDialog.time(2);
	                        //积分处理
	                        if (type != 1) {
	                            creditWriteToQueue(107, data.id, '', '', $.cookie("person_name") + '发表了文章' + post_title + '。',data.expand_id);
	                        }
	                        thisdia.close();
	                    } else {
	                        checkDialog.content("保存文章信息出错！");
	                        checkDialog.time(1);
	                    }
	                },
	                error: function () {
	                    checkDialog.content("保存文章信息出错！");
	                    checkDialog.time(1);
	                }
	            });
	        });
	        return false;
		}, function() {
	
		});
	}
	
	function getPersonSortList(){
	    var innerHtml = {};
	    $.ajax({
	        type : "GET",
	        async : false,
	        data:{
	            "random_num":creatRandomNum(),
	            "person_id": $.cookie("person_id"),
	            "identity_id":$.cookie("identity_id"),
	            "business_type": 1,
	            "business_id": $.cookie("person_id"),
	            "business_iid": $.cookie("identity_id"),
	            "level":2
	        },
	        url : url_path_action + "/blog/getCategory",
	        dataType: "json",
	        success : function(data) {
	            if(data.success){
	                innerHtml["list"] = data.list;
	            }else{
	                innerHtml["list"] = [];
	            }
	        },
	        error : function(){
	            innerHtml["list"] = [];
	        }
	    });
	    var html = template('fenleiListInner', innerHtml);
	    $("#per_sort").html(html);
	    if(us_type == 2 && cur_category != ""){
	    	$("#per_sort").val(cur_category);
	    }
	}
	
	function getOrgSortList(){
	    var innerHtml = {};
	    $.ajax({
	        type : "GET",
	        async : false,
	        data:{
	            "random_num":creatRandomNum(),
	            "business_type": 1,
	            "business_id": 1,
	            "level":1,
	            "identity_id": $.cookie("identity_id")
	        },
	        url : url_path_action + "/blog/getCategory",
	        dataType: "json",
	        success : function(data) {
	            if(data.success){
	                innerHtml["list"] = data.list;
	            }else{
	                innerHtml["list"] = [];
	            }
	        },
	        error : function(){
	            innerHtml["list"] = [];
	        }
	    });
	    var html = template('orgFenleiListInner', innerHtml);
	    $("#org_sort").html(html);
	}
	
	function getArticleInfo(article_id, expand_id){
		var html = "",
			aurl = url_path_action_login + "/blog/getArticleById",
			data = {
		            "random_num": creatRandomNum(),
		            "id": article_id,
		            "expand_id": expand_id
		        };
		if(btype == 2){
			aurl = url_path_action_login + "/blog_expand/get_article_expand";
			data = {
		            "random_num": creatRandomNum(),
		            "id": article_id,
		            "expand_id": expand_id,
		            "business_type": 2,
		            "business_id": bid,
		            "business_iid": biid
				};
		}
	    $.ajax({
	        type: "GET",
	        async: false,
	        data: data,
	        url: aurl,
	        dataType: "json",
	        success: function (data) {
	            if(data.success){
	                $("#per_sort").val(data.person_category_id);
	                if(!!data.org_category_id){
	                    $("#org_sort").val(data.org_category_id);
	                }
	                html = data.content;
	                postTitleInput.input("setVal",data.title);
	            }else{
	                //art.dialog.alert("获取文章信息出错");
	                html = "";
	            }
	        },
	        error: function () {
	            //art.dialog.alert("获取文章信息出错");
	            html = "";
	        }
	    });
	    return html;
	}
	
	function getArticleById(article_id, expand_id){
	    var innerHtml = {},
		aurl = url_path_action_login + "/blog/getArticleById",
		data = {
	            "random_num": creatRandomNum(),
	            "id": article_id,
	            "expand_id": expand_id
	        };
		if(btype == 2){
			aurl = url_path_action_login + "/blog_expand/get_article_expand";
			data = {
		            "random_num": creatRandomNum(),
		            "id": article_id,
		            "expand_id": expand_id,
		            "business_type": 2,
		            "business_id": bid,
		            "business_iid": biid
				};
		}
	    $.ajax({
	        type: "GET",
	        async: false,
	        data: data,
	        url: aurl,
	        dataType: "json",
	        success: function (data) {
	            if(data.success){
	            	if(data.is_del != "1"){
	            		var schtml = template('static_comment_inner', {});
	            	    $("#static_comment").html(schtml);
	                    messageBoard_getMsg(startPageSize);
	                    $.ajax({
	                    	type : "POST",
	                    	async : true,
	                    	data:{"random_num":creatRandomNum(),
	                    		"article_id": article_id,
	                    		"person_id":data.person_id,
	                    		"identity_id":data.identity_id
	                    	},
	                    	url : url_path_action_login + "/blog/addBrowseNum",
	                    	dataType: "json",
	                    	success : function(data) {
	                    		if(data.success){
	                    			
	                    		}else{
	                    			
	                    		}
	                    	}
	                    });
	            	}
	                if($.cookie("person_id")!=null){
	                    $.ajax({
	                        type : "GET",
	                        async : false,
	                        data:{
	                            random_num : creatRandomNum(),
	                            "business_id": article_id,
	                            "business_type":1,
	                            "person_id": $.cookie("person_id"),
	                            "identity_id":$.cookie("identity_id")
	                        },
	                        url : url_path_action + "/space/praise/isexists_praise",
	                        dataType: "json",
	                        success : function(data1) {
	                            if(data1.success){
	                                innerHtml['is_exists_praise'] = data1.is_exists_praise;
	                            }else{
	                                innerHtml['is_exists_praise'] = false;
	                            }
	                        },
	                        error : function(){
	                            innerHtml['is_exists_praise'] = false;
	                        }
	                    });
	                }else {
	                    innerHtml['is_exists_praise'] = false;
	                }
	                $.ajax({
	                    type : "GET",
	                    async : false,
	                    data:{
	                        random_num : creatRandomNum(),
	                        "business_id": article_id,
	                        "business_type":1,
	                        "person_id": $.cookie("person_id"),
	                        "identity_id":$.cookie("identity_id")
	                    },
	                    url : url_path_action_login + "/space/praise/get_praisecount_byid",
	                    dataType: "json",
	                    success : function(data2) {
	                        if(data2.success){
	                            innerHtml['praiseTotal'] = data2.total;
	                            innerHtml['is_exists_praise'] = data2.is_exists_praise;
	                        }else{
	                            innerHtml['praiseTotal'] = 0;
	                            innerHtml['is_exists_praise'] = false;
	                        }
	                    },
	                    error : function(){
	                        innerHtml['praiseTotal'] = 0;
	                        innerHtml['is_exists_praise'] = false;
	                    }
	                });
	                innerHtml['data'] = data;
	            }else{
	                innerHtml['data'] = data;
	                innerHtml['data']['content'] = "";
	            }
	        },
	        error: function () {
	            innerHtml['data'] = {"success":false,"content":""};
	        }
	    });
	    var html = template('articleDetail_inner', innerHtml);
	    $("#articleDetail").html(html);
	    uParse('#ac',
	            {
	                'highlightJsUrl':'third-party/SyntaxHighlighter/shCore.js',
	                'highlightCssUrl':'third-party/SyntaxHighlighter/shCoreDefault.css'
	            });
	    
	    var conWidth = $("#articleDetail").width();
	    $($("#articleDetail img")).each(function(i){
	        $("#articleDetail img").eq(i).load(function(){
	            if($("#articleDetail img").eq(i).width()>conWidth){
	                $("#articleDetail img").eq(i).width(conWidth);
	            }
	        });
	    });
	    
	}
	
	function messageBoard_getMoreMsg(){
	    autoPageSize += startPageSize;
	    messageBoard_getMsg(autoPageSize);
	}
	//获取评论信息
	function messageBoard_getMsg(pageSize){
	    $.ajax({
	        type : "GET",
	        async : true,
	        data:{"random_num":creatRandomNum(),
	            "pageNumber": 1,
	            "pageSize": pageSize,
	            "sort": 1,
	            "type_id": "person_blog_article_"+article_id,
	            "message_type": 2
	        },
	        url : url_path_action_login + "/bbs/topic/view",
	        dataType: "json",
	        success : function(data) {
	            if(data.success){
	                var innerHTML = {};
	                innerHTML['success'] = true;
	                innerHTML['data'] = data;
	                var visit_to = 0;
	                if($.cookie("person_id")){
                        var pid = person_id || window.person_id;
                        var iid = identity_id || window.identity_id;
	                    if($.cookie("person_id") == pid && $.cookie("identity_id") == iid){
	                        visit_to = 1;
	                    }
	                    innerHTML['loginid'] = $.cookie("person_id");
	                    innerHTML['loginiid'] = $.cookie("identity_id");
	                }else {
	                    innerHTML['loginid'] = "";
	                    innerHTML['loginiid'] = "";
	                }
	                innerHTML['visit_to'] = visit_to;
	                innerHTML['filterXSS'] = filterXSS;
	                innerHTML['getSpaceUserPhoto'] = getSpaceUserPhoto;
	                autoPageSize = pageSize;
	                var html = template('blogCommentInner', innerHTML);
	                $("#blogComment").html(html);
	                //document.getElementById("portlet_innerHtml_"+id_info).innerHTML = html;
	            }else{
	                var innerHTML = {};
	                innerHTML['success'] = false;
	                var html = template('blogCommentInner', innerHTML);
	                $("blogComment").html(html);
	            }
	        },
	        error : function(){
	            var innerHTML = {};
	            innerHTML['success'] = false;
	            var html = template('blogCommentInner', innerHTML);
	            $("#blogComment").html(html);
	        }
	    });
	}
	var messageBoard_dialog;
	function messageBoard_addDialog(d,pid,pagesize,person_id,identity_id,person_name){
	    if(!!!$.cookie("person_id")){
	        art.dialog.alert("对不起，请登录后评论！");
	        return false;
	    }
	
	    messageBoard_dialog = art.dialog(
	            {
	                content:"<div id='postMessageDiv1'></div>",
	                width: 350,
	                height: 150,
	                lock:true,
	                icon: null,
	                title: '回复评论',
	                //style:'succeed noClose',
	                init:function(){
	                    mytextarea1 = $("#postMessageDiv1").textarea({
	                        index:1,
	                        word_length:1000,
	                        width:"320px",
	                        height:"130px"
	                    });
	                    $("#postMessageDiv1").parent().attr("style","padding: 10px 15px 5px 15px !important;");
	                },
	                close:function(){
	
	                }
	            },function(){
	                return messageBoard_addMSG(1,pid,pagesize,person_id,identity_id,person_name)
	            },function(){
	
	            });
	}
	//添加评论    0 liuyan   1 pinglun
	function messageBoard_addMSG(d,pid,pagesize,person_id,identity_id,person_name){
	
	    if(!!!$.cookie("person_id")){
	        art.dialog.alert("对不起，请登录后评论！");
	        return false;
	    }
	
	    var val = "";
	    if(d == 0){
	        val = mytextarea.textarea("value");
	    }else{
	        val = mytextarea1.textarea("value");
	    }
	
	    if (val.length > 1000 ||val.length == 0) {
	        art.dialog.alert("请输入1-1000个字符");
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
	            "message_type": 2,
	            "type_id": "person_blog_article_"+article_id,
	            "parent_id": (d==0?"":pid)
	        },
	        url : url_path_action + "/bbs/message/save",
	        dataType: "json",
	        success : function(data) {
	            if(data.success){
	            	//个人文章评论数加1，积分只加一次
	                $.ajax({
	                    type : "POST",
	                    async : false,
	                    data:{"random_num":creatRandomNum(),
	                        "article_id": article_id,
	                        "person_id":$.cookie("person_id"),
	                        "identity_id":$.cookie("identity_id")
	                    },
	                    url : url_path_action_login + "/blog/addCommentNum",
	                    dataType: "json",
	                    success : function(data) {
	                        if(data.success){
	                            art.dialog(
	                                    {
	                                    	icon: 'succeed',
	                                        fixed: true,
	                                        lock: true,
	                                        content: "保存成功！正在刷新评论...",
	                                        title: "提示",
	                                        ok: false,
	                                        style:'succeed noClose',
	                                        time:2,
	                                        cancel:false,
	                                        close:function(){
	                                            messageBoard_getMsg(autoPageSize);
	                                            mytextarea.textarea("clear");
	                                        },
	                                        init:function(){
	                                            if(d == 0) {
	                                                //积分处理
	                                                creditWriteToQueue(108, '', person_id, identity_id, $.cookie("person_name") + "评论了" + person_name + "的文章。");
	                                            }
	                                        }
	                                    });
	                        }else{
	
	                        }
	                    },
	                    error : function(){
	
	                    }
	                });
	            }else{
	
	            }
	        },
	        error : function(){
	
	        }
	    });
	
	}
	
	//删除留言
	function messageBoard_deletePost(pageSize,topic_id,postid){
	    if(!!!$.cookie("person_id")){
	        art.dialog.alert("对不起，请登录继续操作！");
	        return false;
	    }
	    art.dialog.confirm("确定删除该评论内容？", function () {
	        $.ajax({
	            type : "GET",
	            async : false,
	            data: {"random_num": creatRandomNum(),
	                "topic_id": topic_id,
	                "post_id": postid
	            },
	            url : url_path_action + "/bbs/post/delete",
	            dataType: "json",
	            success : function(data) {
	                if(data.success){
	                	$.ajax({
	                        type : "POST",
	                        async : true,
	                        data:{"random_num":creatRandomNum(),
	                            "article_id": article_id,
	                            "person_id":$.cookie("person_id"),
	                            "identity_id":$.cookie("identity_id")
	                        },
	                        url : url_path_action + "/blog/subCommentNum",
	                        dataType: "json",
	                        success : function(data) {
	                        }
	                    });
	                    art.dialog({
			            	icon: 'succeed',
			                fixed: true,
			                lock: true,
			                content: "删除成功！正在刷新评论...",
			                title: "提示",
			                ok: false,
			                okVal:'确定',
			                style:'succeed noClose',
			                time:2,
			                cancel:false,
			                close:function(){
			                    messageBoard_getMsg(pageSize);
			                }
	                    });
	                }else{
	                    //
	                    art.dialog.alert(data.info.data);
	                }
	            },
	            error : function(){
	                art.dialog.alert("请求异常！");
	            }
	        });
	    }, function () {
	
	    });
	}
	function addPraise(id,dom){
	    if(!!!$.cookie("person_id")){
	        art.dialog.alert("对不起，请登录后点赞");
	        return false;
	    }
	    $.ajax({
	        type : "POST",
	        async : false,
	        data:{
	            "business_id":id,
	            "business_type": 1,
	            "person_id": $.cookie("person_id"),
	            "identity_id": $.cookie("identity_id")
	        },
	        url : url_path_action + "/space/praise/add_praise_info",
	        dataType: "json",
	        success : function(data) {
	            if(data.success){
	                dialogClose("点赞成功！",2,150,"");
	                $(dom).removeClass("addPraise").addClass("cancelPraise");
	                $(dom).html("已赞");
	                $(dom).removeAttr("onclick");
	                reloadPraise(id,$(dom))
	            }else{
	                dialogClose("点赞失败！",2,150,"");
	            }
	        },
	        error : function(){
	            dialogClose("点赞失败！",2,150,"");
	        }
	    });
	}
	function cancelPraise(id,dom){
	    if(!!!$.cookie("person_id")){
	        art.dialog.alert("对不起，请登录后取消点赞");
	        return false;
	    }
	    $.ajax({
	        type : "POST",
	        async : false,
	        data:{
	            "business_id":id,
	            "business_type": 1,
	            "person_id": $.cookie("person_id"),
	            "identity_id": $.cookie("identity_id")
	        },
	        url : url_path_action + "/space/praise/cancel_praise_info",
	        dataType: "json",
	        success : function(data) {
	            if(data.success){
	                dialogClose("取消点赞成功！",2,200,"");
	                $(dom).removeClass("cancelPraise").addClass("addPraise");
	                $(dom).attr("onclick","addPraise("+id+",this,1)");
	                reloadPraise(id,$(dom))
	            }else{
	                dialogClose("取消点赞失败！",2,200,"");
	            }
	        },
	        error : function(){
	            dialogClose("取消点赞失败！",2,200,"");
	        }
	    });
	}
	function reloadPraise(id,dom){
	    $.ajax({
	        type : "GET",
	        async : false,
	        data:{
	            random_num : creatRandomNum(),
	            "business_id": id,
	            "business_type": 1
	        },
	        url : url_path_action_login + "/space/praise/get_praisecount_byid",
	        dataType: "json",
	        success : function(data) {
	            dom.closest(".autor").find("a.getPraise").html(data.total);
	        },
	        error : function(){
	        }
	    });
	}
	
	function setBlogTop(expand_id){
	    $.ajax({
	        type: "POST",
	        async: false,
	        data: {
	            "random_num": creatRandomNum(),
	            "expand_id": expand_id
	        },
	        url: url_path_action + "/blog_expand/set_article_expand_top",
	        dataType: "json",
	        success: function (data) {
	            if(data.success){
	                art.dialog({
	                    icon: 'succeed',
	                    fixed: true,
	                    lock: true,
	                    content: "置顶成功！正在刷新文章...",
	                    cancel: false,
	                    time: 3,
	                    close: function(){
	                        getMyArticle(1, cur_page_number*page_size, "replace");
	                    }
	                });
	            }else{
	                dialogClose("置顶失败！",2,200,"");
	            }
	        },
	        error: function () {
	            dialogClose("置顶失败！",2,200,"");
	        }
	    });
	}
	function cancelBlogTop(expand_id){
	    $.ajax({
	        type: "POST",
	        async: false,
	        data: {
	            "random_num": creatRandomNum(),
	            "expand_id": expand_id
	        },
	        url: url_path_action + "/blog_expand/cancel_article_expand_top",
	        dataType: "json",
	        success: function (data) {
	            if(data.success){
	                art.dialog({
	                    icon: 'succeed',
	                    fixed: true,
	                    lock: true,
	                    content: "取消置顶成功！正在刷新文章...",
	                    cancel: false,
	                    time: 3,
	                    close: function(){
	                        getMyArticle(1, cur_page_number*page_size, "replace");
	                    }
	                });
	            }else{
	                dialogClose("取消置顶失败！",2,200,"");
	            }
	        },
	        error: function () {
	            dialogClose("取消置顶失败！",2,200,"");
	        }
	    });
	}
	function cancelReprintArticle(expand_id){
	    art.dialog.confirm("确定取消转载该文章？", function () {
	        $.ajax({
	            type : "POST",
	            async : false,
	            data: {"random_num": creatRandomNum(),
	                "expand_id": expand_id
	            },
	            url : url_path_action + "/blog_expand/cancel_reprint_article",
	            dataType: "json",
	            success : function(data) {
	                if(data.success){
	                    art.dialog({
	                        icon: 'succeed',
	                        fixed: true,
	                        lock: true,
	                        content: "取消转载成功！正在刷新评论...",
	                        title: "提示",
	                        ok: false,
	                        okVal:'确定',
	                        style:'succeed noClose',
	                        time:2,
	                        cancel:false,
	                        close:function(){
	                            getMyArticle(1, cur_page_number*page_size, "replace");
	                        }
	                    });
	                }else{
	                    //
	                    art.dialog.alert("取消转载失败！");
	                }
	            },
	            error : function(){
	                art.dialog.alert("请求异常！");
	            }
	        });
	    }, function () {
	
	    });
	}
	
	function start(){
		$.get("../tpl/main/main_blog_tpl.html", function(data){
			//1.替换main div内容
			$("#main").html(data);
			//2.加载css，然后回调
			loadScripts(new Array("../../../css/space/space_article_pages.css"), 0, function(){
				if((GetQueryString("id")!=null)&&(GetQueryString("identity_id")!=null)){
					person_id = GetQueryString("id");
					identity_id = GetQueryString("identity_id");
				}else if($.cookie("person_id")!=null){
					person_id = $.cookie("person_id");
					identity_id = $.cookie("identity_id");
				}else{
					top.location = url_path_html + personalLogoutAddr;
					return false;
				}
				
			    var mbhtml = template('mainblog_inner', {});
			    $("#mainblog").html(mbhtml);
			    
			    blogSearch = $("#blogSearchDiv").search({
			        maxinput:15,
			        inputclass:"bk_search_input",
			        btnclass:"btn seabtn",
			        inputwidth : "281px",
			        onsearch:function(){
			            //执行搜索
			            //var key = keyword.search("value");
			            getMyArticle(1,10,"replace");
			        }
			    });
			    
			    if((!!$.cookie("person_id") && $.cookie("person_id")==person_id) && (!!$.cookie("identity_id") && $.cookie("identity_id")==identity_id)){
			    	is_self_login = true;
			    }
			    getArticleStatistics();
			    getArticleCategory();
			    getMyArticle(page_number, page_size, "replace");
				getPraiseList();

			    if(is_self_login){
			    	$(".category_btn").show();
			        $(".fb_btn").show();
			    }else{
			    	$(".category_btn").hide();
			        $(".fb_btn").hide();
			    }

			});
		});
	}
	function getArticleArea(){
        if(offArticleArea){
            return "";
        }
        var innerHtml = {};
        $.ajax({
            type : "GET",
            async : false,
            data: {"random_num": creatRandomNum(),
                "person_id": $.cookie("person_id"),
                "identity_id": $.cookie("identity_id")
            },
            url : url_path_action_login + "/blog_expand/get_class_bypersonid",
            dataType: "json",
            success : function(data) {
                //innerHtml["classInfo"] = data;
                if(data.success){
                    innerHtml["classInfo"] = data;
                }else{
                    innerHtml["classInfo"] ={list:[]};
                    //art.dialog.alert("读取班级信息失败！");
                }
            },
            error : function(){
                innerHtml["classInfo"] ={list:[]};
                //art.dialog.alert("读取班级信息异常！");
            }
        });
        $.ajax({
            type : "GET",
            async : false,
            data: {"random_num": creatRandomNum(),
                "person_id": $.cookie("person_id"),
                "identity_id": $.cookie("identity_id")
            },
            url : url_path_action_login + "/blog_expand/get_group_bypersonid",
            dataType: "json",
            success : function(data) {
                //innerHtml["groupInfo"] = data;
                if(data.success){
                    innerHtml["groupInfo"] = data;
                }else{
                    innerHtml["groupInfo"] ={list:[]};
                    //art.dialog.alert("读取群组信息失败！");
                }
            },
            error : function(){
                innerHtml["groupInfo"] ={list:[]};
                //art.dialog.alert("读取群组信息异常！");
            }
        });
        //console.log(JSON.stringify(innerHtml["groupInfo"].list.length));

        innerHtml["org_list"] = [];

        if(defaultOrgIid <= 101){
            innerHtml["org_list"].push({id:person_info_.sheng_id,name:"本省",type:101})
        }
        if(defaultOrgIid <= 102){
            innerHtml["org_list"].push({id:person_info_.shi_id,name:"本市",type:102})
        }
        if(defaultOrgIid <= 103){
            innerHtml["org_list"].push({id:person_info_.qu_id,name:"本区",type:103})
        }
        if(defaultOrgIid <= 104){
            innerHtml["org_list"].push({id:person_info_.xiao_id,name:"本校",type:104})
        }

        var html = template("articleAreaInner",innerHtml);
        return html;
    }

    function setArticleArea(article_id,release_type){
        if(offArticleArea){
            return "";
        }
        var org_list = [];
        $("#articleAreaForm").find("input[name='org_list_checkbox']:checked").each(function(){
            org_list.push({org_id:$(this).val(),org_type:$(this).attr("data-iid")});
        });
        var class_list = [];
        $("#articleAreaForm").find(".art_area_item.class_list input[name='classItem-id']:checked").each(function(){
            class_list.push({org_id:$(this).val(),category_id:$(this).closest(".class_list").find("select[name='category']").val()});
        });
        var group_list = [];
        $("#articleAreaForm").find(".art_area_item.group_list input[name='groupItem-id']:checked").each(function(){
            group_list.push({org_id:$(this).val(),category_id:$(this).closest(".group_list").find("select[name='category']").val()});
        });
        //console.log({org_list:org_list,class_list:class_list,group_list:group_list});
        var data = {org_list:org_list,class_list:class_list,group_list:group_list};
        $.ajax({
            type : "POST",
            async : false,
            data: {"random_num": creatRandomNum(),
                "article_id": article_id,
                "data":JSON.stringify(data)
            },
            url : url_path_action + "/blog_expand/" + release_type,
            dataType: "json",
            success : function(data) {

            },
            error : function(){

            }
        });
    }

	var outer = {
		start: start,
		cancelReprintArticle: cancelReprintArticle,
		cancelBlogTop: cancelBlogTop,
		setBlogTop: setBlogTop,
		//reloadPraise: reloadPraise,
		//cancelPraise: cancelPraise,
		//addPraise: addPraise,
		messageBoard_deletePost: messageBoard_deletePost,
		messageBoard_addMSG: messageBoard_addMSG,
		messageBoard_addDialog: messageBoard_addDialog,
		messageBoard_getMsg: messageBoard_getMsg,
		messageBoard_getMoreMsg: messageBoard_getMoreMsg,
		getArticleById: getArticleById,
		//getArticleInfo: getArticleInfo,
		//getOrgSortList: getOrgSortList,
		//getPersonSortList: getPersonSortList,
		addArticles: addArticles,
		deleteArticle: deleteArticle,
		//loadMore: loadMore,
		//bindLoadMore: bindLoadMore,
		getPraiseList: getPraiseList,
		refreshCategory: refreshCategory,
		//getMyArticle: getMyArticle,
		//getNewArticle: getNewArticle,
		moveSortManage: moveSortManage,
		delSortManage: delSortManage,
		editSortManage: editSortManage,
		articleCategoryManage: articleCategoryManage
		//getArticleCategoryForManage: getArticleCategoryForManage,
		//bindCategoryClick: bindCategoryClick,
		//getArticleCategory: getArticleCategory,
		//getArticleStatistics: getArticleStatistics
	}
	
	return outer;
	
}();