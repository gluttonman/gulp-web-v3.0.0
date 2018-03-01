$(function(){
	if(null == $.cookie("person_id")){
		return;
	}
	//初始化学段学科
	initSelectStageSubject(0,0);
	//加载目录树
	initStructure();
	//加载章节
	changeScheme();
	
	initEvent();
	//加载媒体类型
	initMediaType();
	//加载应用类型
	initAppType();
	
	toPage(1);
});

function initEvent(){
	$(document).on("change","#sel_stage",function(){
		changeScheme();
	});
	$(document).on("change","#sel_subject",function(){
		changeScheme();
	});
	$(document).on("change","#scheme_id",function(){
		scheme_id = $(this).val();
		changeStructure();
	});
	$(document).on("click","#media_ul ul a",function(){
		toPage(1);
	});
	$(document).on("click","#app_ul ul a",function(){
		toPage(1);
	});
	$(".fancybox").fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        afterShow: function() {	
            var rec = resArray[this.index];
			var resource_title2 = rec.resource_title;
			resource_title2 = resource_title2.replace("'","‘");
			var resultStr = '<div class="fancybox-title fancybox-title-outside-wrap-tool">' + resource_title2 + '</div>';
			$(resultStr).appendTo(this.wrap);	
        }
    });
}

//切换类型
function changeMediaType(obj,type_id) {
	$(".media_ul li").siblings().find("a").removeClass("active")
	$(obj).addClass("active")
	media_type_id = type_id;
	toPage(1);
}

//切换应用类型
function changeAppType(sort_id,type_id){
    var type_arr = $(".apptype_ul").children("li");
    for (var i = 0; i < type_arr.length; i++) {
        if (sort_id != i) {
            $(".apptype_ul li").children(":eq(" + i + ")").removeClass("active");
        }
        if (sort_id == i) {
            $(".apptype_ul li").children(":eq(" + i + ")").addClass("active");
        }
    };
    app_type_id = type_id;
    toPage(1);
}

$(document).on("click","#use_help",function(){
	playHelp("33.mp4");
});


function toPage(page_number){
	var struc_id = -1;
	if(undefined != getStrucValue().struc_id){
		struc_id = getStrucValue().struc_id;
	}
	//转成数字
	page_number=parseInt(page_number);
	
	if(page_number <= 0){
        page_number = 1;
    }
	
	var total_page = $("#totalPage").val();
    if(total_page == undefined){
      total_page = 1;
    }else if(total_page == 0){
      total_page = 1;
    }
  	//转成数字
	total_page = parseInt(total_page);
    
    //最上面tab类型
    var bk_type = $("#bk_type").val();
    var keyword = $("#business_title").val();
    if(keyword != ""){
    	keyword = Base64.encode(keyword);
    }
	if(page_number <= total_page){
		var paramData = {
				"res_type"  : 1,//资源
				"bType" : 6,//6我上传的  7我共享的 ...
				"rtype" : media_type_id,//媒体类型
				"nid" : struc_id,//章节id
				"is_root" : 0,//1为版本根节点 0为子节点
				"cnode" : 1,//是否包含子节点 1包含 0不包含
				"sort_type" : 1,//排序 1按时间 3按下载次数 7星级 8收藏次数
				"sort_num" : 2,//2倒序 1正序 
				"pageSize" : 10,
				"pageNumber" : page_number,
				"scheme_id" : scheme_id,//版本id
				"app_type_id" : app_type_id,//应用类型id
				"stage_id" : $("#sel_stage").val(),
				"subject_id" : $("#sel_subject").val(),
				"keyword" : keyword//搜索关键字 base64加密
		};
		var str = url_path_html + "/yx/resource/getMyResourceList?t="+Math.random();
		$.ajax({
			url:str,
			type:"get",
			async: false,
			data : paramData,
			dataType : "json",
			success:function(data){
				if(data.success == true){
					beforeRender(data);
					render_resourcePage(data,"resource");
					
					if(undefined != g_BatchOper){
						g_CheckBox.reInit();
						if(g_BatchOper.isBatchOper){
							g_BatchOper.isBatchOper = !g_BatchOper.isBatchOper;
							event_toggleBatchModel();
						}
					}
				}
			}
		});
	}
}

function uploadFile(){
	var url = url_path_html + "/yx/html/resource/uploadYxResource.html";
		url += "?callBack=call_back";
		url += "&TB_iframe=true";
		url += "&height=" + 465;
		url += "&width=" + 720;
	tb_show("上传资源",url, "thickbox");
}

function call_back(){
	
}

/**
 * 用上传助手上传大文件
 */
function uploadBigFile(){
	var url = url_path_html + "/yx/html/resource/uploadYxBigResource.html";
	url += "?callBack=call_back";
	url += "&TB_iframe=true";
	url += "&height=" + 350;
	url += "&width=" + 720;
	tb_show("上传资源",url, "thickbox");	
}

function tb_remove(){
	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("200",function(){ $('#TB_iframeContent').remove();$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();

	document.onkeydown = "";
	document.onkeyup = "";	
	toPage(1);
	return false;
}

function changeBack(page_number){
	setTimeout(function(){
		toPage(page_number);
	},3000);
}
