var wz_id = 0,
	share = null,
	share_ids = 0,
	checkboxids = "",
	expand_id = 0,
	creditFlag = 1, //是否开放积分，默认1开放，0屏蔽
	service_type = 0,
	service_id = 0,
	param_stage_id = 0,
	param_subject_id = 0,
	hj_id = 1,
	callBack = null,
	myue;
$(function(){
	if(undefined != $.cookie("person_id") && "null" != $.cookie("person_id") && $.cookie("identity_id") == 5){
		callBack = GetQueryString("callBack");
		wz_id = GetQueryString("id")!="undefined" ? parseInt(GetQueryString("id")) : 0;
		expand_id = GetQueryString("expand_id")!="undefined"? parseInt(GetQueryString("expand_id")) :0 ;
		if(null != GetQueryString("service_type") && GetQueryString("service_id")){
			service_type = GetQueryString("service_type");
			service_id = GetQueryString("service_id");
		}else{
			share = $("#myshare").sharerange({type:2});
		}
		if(null != GetQueryString("hj_id")){
			hj_id = GetQueryString("hj_id");
		}
		
		var stage_id = $.cookie("background_stage_id");
		var subject_id = $.cookie("background_subject_id");
		param_stage_id = GetQueryString("stage_id") == null ? 0 : GetQueryString("stage_id");
		param_subject_id = GetQueryString("subject_id") == null ? 0 : GetQueryString("subject_id");
		if(param_stage_id > 0 && param_subject_id > 0){
			stage_id = param_stage_id;
			subject_id = param_subject_id;
		}
		initSelectStageSubject(stage_id,subject_id);
		getPersonSortList(function(){//加载个人分类
			getOrgSortList(function(){//加载默认分类
				if(wz_id > 0){//显示文章主体内容
					initBusiness(wz_id);
				}else{
					initUEditor("");
				}
			});
		});
	}
});

function initBusiness(id){
	if(id > 0){
		/*加载文章
		*/
		$.ajax({
			type:"post",
			async: false,
			data:{
				"id" : id,
				"expand_id" : expand_id
			},
			dataType: 'json',
			url:url_path_html+"/yx/article/findWZbyId?r="+Math.random(),
			success:function(wz_data){
				//标题
				$("#wz_title").val(wz_data.title);
				
				//获取学段学科
				$("#sel_stage").val(wz_data.stage_id);
				getSubjectList(wz_data.stage_id);
				$("#sel_subject").val(wz_data.subject_id);
				//文章类型
				$("#per_sort").val(wz_data.person_category_id);
				$("#org_sort").val(wz_data.org_category_id);
				
				//内容
				myue = UE.getEditor('editor', {
			    	toolbars: [
			    	tool_arr    //默认显示的工具栏，在base-config.js文件中定义
			    	],
			    	initialFrameWidth:600,    //编辑器宽度
			    	initialFrameHeight:350    //编辑器高度
		    	}); 
				//对编辑器的操作最好在编辑器ready之后再做
				myue.ready(function() {
					myue.setContent(wz_data.content);
				});
				
			}
		});
	}
}

function initUEditor(content){
	//ue文本编辑器
	$("#editor").html(content);
	myue = UE.getEditor('editor', {
    	toolbars:[
    		tool_arr    //默认显示的工具栏，在base-config.js文件中定义
    	],
    	initialFrameWidth:600,    //编辑器宽度
    	initialFrameHeight:330    //编辑器高度
	});
}


function cannel(){
	if("undefined" != typeof(parent.tb_remove)){
		parent.tb_remove();
	}
}


function articleSubmit(){
	//无需验证的参数
	var stage_id = $("#sel_stage").val();
	var subject_id = $("#sel_subject").val();
	var type_id = $("#wz_type").val();
	var type_name = $("#wz_type option:selected").html();
	//以下为需要验证的参数
	var wz_title = $("#wz_title").val();
	if(null == wz_title || "" == $.trim(wz_title)){
		dialogOk('文章标题不能为空！',300,'');
		return false;
	}
	var wz_content = "";
	//文本编辑器中有图片时，得有这个才能把力图片路径传上去
	myue.getKfContent(function(contentStr){
		wz_content = contentStr;
	});
	
	if(null == wz_content || "" == $.trim(wz_content)){
		dialogOk('文章内容不能为空！',300,'');
		return false;
	}else if($.trim(wz_content).length>100000){
		dialogOk('文章内容过长！',300,'');
		return false;
	}
	
	if(share != null){
    	share_ids = $('input[name="share_range_org"]:checked').val();
    	
    	$("input[name='share_range_gourp']:checkbox").each(function(){ 
			if($(this).attr("checked")){
				checkboxids += $(this).val()+",";
			}
		});
    	if(checkboxids != ""){
    		checkboxids = checkboxids.substring(0,checkboxids.length-1);
    	}
    }
	
	var firstImg = "";
    var root = UE.htmlparser(wz_content, true);
    var imgs_ = new Array();
    var imgs_list = root.getNodesByTagName('img');
    for (var i = 0;i<imgs_list.length; i++){
        imgs_[i] = imgs_list[i].getAttr( 'src');
        if(i==0){
            firstImg = imgs_list[i].getAttr( 'src');
        }
    }
	var overviewText = myue.getContentTxt().substring(0,100);
	var url = url_path_html+"/yx/article/addArticle?math=" + Math.random();
	if(wz_id > 0){
		url = url_path_html+"/yx/article/editArticle?math=" + Math.random();
	}
	
  	$.ajax({
	   async:true,
	   url: url,
	   type:'post',
	   data : {
			"business_type" : 1,
			"stage_id" : $("#sel_stage").val(),
			"stage_name" : $("#sel_stage option:selected").text(),
			"subject_id" : $("#sel_subject").val(),
			"subject_name" : $("#sel_subject option:selected").text(),
			"person_category_id" : $("#per_sort").val(),
			"person_id" : $.cookie("person_id"),
			"person_name" : $.cookie("person_name"),
			"identity_id" : $.cookie("identity_id"),
			"province_id" : $.cookie("background_province_id"),
			"city_id" : $.cookie("background_city_id"),
			"district_id" : $.cookie("background_district_id"),
			"school_id" : $.cookie("background_school_id"),
			"content" : wz_content,
			"id" : wz_id,
			"org_category_id" : $("#org_sort").val(),
			"title" : wz_title,
			"overview" : overviewText,
			"thumb_id" : firstImg,	
			"thumb_ids" : JSON.stringify(imgs_),
			"service_type" : service_type,
			"service_id" : service_id,
			"hj_id" : hj_id,
			"share_ids" : share_ids,
			"checkboxids" : checkboxids,
			"random_num" : Math.random(),
		},
	   dataType: 'json',
	   success: function(data){
		   if(data.success){
			   dialogClose(wz_id == 0 ? "添加成功！" : "修改成功！",3,200,'');
			 //积分处理
               if (wz_id == 0) {
                   creditWriteToQueue(107, data.id, "", "", $.cookie("person_name") + "发表了文章" + wz_title + "。",data.expand_id);
               }
               setTimeout(function(){
            	   if(callBack != null){
            		   var fun = "parent." + callBack + "()";
            		   eval(fun);
            	   }
            	   cannel();
               },3000);
		   }else{
			   dialogClose("系统繁忙！",3,200,'');
		   }
	   }
	});
	     
}

/**
 * 积分处理
 */
function creditWriteToQueue(business_type,relatived_id,r_person_id,r_identity_id,operation_content){
    if(creditFlag == 0){
        return false;
    }
    var person_id = "";
    var identity_id = "";
    if($.cookie("person_id")){
        person_id = $.cookie("person_id");
        identity_id = $.cookie("identity_id");
    }else{
        return false;
    }
    if($.cookie("person_id") == r_person_id){
        return false;
    }
    $.ajax({
        type : "POST",
        async : true,
        data:{"random_num":creatRandomNum(),
            "person_id":person_id,
            "identity_id":identity_id,
            "platform_type":1,
            "ip_addr":"",
            "operation_system":"",
            "browser":"",
            "business_type":business_type,
            "relatived_id":relatived_id,
            "r_person_id":r_person_id,
            "r_identity_id":r_identity_id,
            "operation_content":operation_content
        },
        url : url_path_action_login + "/credit/writeToQueue",
        dataType: "json",
        success : function(data) {

        },
        error : function(){

        }
    });
}
