/**
 * Created by xus on 2017/1/7.
 */
var business_type = 0;
var	business_id = 0;
var moke_id = 0;
var callBack = null;
$(document).ready(function(){
    if(undefined != $.cookie("person_id") && "null" != $.cookie("person_id") && $.cookie("identity_id") == 5){
    	if(null != GetQueryString("business_type") && null != GetQueryString("business_id")){
    		business_type = GetQueryString("business_type"); 
			business_id = GetQueryString("business_id"); 
    	}
    	if(null != GetQueryString("callBack")){
    		callBack = GetQueryString("callBack");
    	}
        //这时发布id
        if(null != GetQueryString("id")){
        	moke_id = GetQueryString("id");
        }
        
      //加载目录树
    	initStructure();
        if(moke_id > 0){
        	initBusiness();
        }else{
			var stage_id = $.cookie("background_stage_id");
			var subject_id = $.cookie("background_subject_id");
			if(null != GetQueryString("stage_id")){
				stage_id = GetQueryString("stage_id");
			}
			if(null != GetQueryString("subject_id")){
				subject_id = GetQueryString("subject_id");
			}
			//初始化学段学科
			xd_subject_type = 1;
			initSelectStageSubject(stage_id,subject_id);
			//加载章节
			changeScheme();
			$.ajax({
				async : true,
				type : "POST",
				data : {},
				dataType : 'json',
				url: url_path_html + "/yx/moke/queryStageSubject?t=" + new Date().getTime(),
				success : function(res){
					if(res.list){
                        var data = res.list
                        $("#sel_stage").val(data.stage_id);
                        $("#sel_subject").val(data.subject_id);
                        $("#scheme_id").val(data.scheme_id);
					}
				}
			})
        }
        initEvent();
    }else{
        alert("未登录");
    }
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
}

function initBusiness(){
    var url = url_path_html + "/yx/moke/getMokeById?t=" + new Date().getTime();
    $.ajax({
        async:true,
        url: url,
        data: {moke_id : moke_id},
        type:'post',
        dataType: 'json',
        success: function(data){
            $("#moke_title").val(data.title);
            $("#sel_stage").val(data.stage_id);
            $("#sel_subject").val(data.subject_id);
            initSelectStageSubject(data.stage_id,data.subject_id);
            changeScheme(data.scheme_id);
            structure_id = data.structure_id;
            mokeSubmitFinish();
        }
    });
}

function mokeSubmit(type){
	var stage_id = $("#sel_stage").val();
    var stage_name = $("#sel_stage option:selected").html();
    var subject_id = $("#sel_subject").val();
    var subject_name = $("#sel_subject option:selected").html();
    var title = $.trim($("#moke_title").val());
    if(null != struc){
    	structure_id = getStrucValue().struc_id;
    }
    if(null == title || "" == $.trim(title)){
        art.dialog.alert("标题不能为空！");
        return false;
    }

    var dataFormat = {
        "moke_id" : moke_id,//发布id
        "stage_id" : stage_id,
        "stage_name" : stage_name,
        "subject_id" : subject_id,
        "subject_name" : subject_name,
        "scheme_id" : scheme_id,
        "structure_id" : structure_id,
        "title" : title,
        "business_type" :business_type,
        "business_id" :business_id
    };
	var url = url_path_html+"/yx/moke/addMoke?t=" + Math.random();
	if(moke_id > 0){
		url = url_path_html+"/yx/moke/editMoke?t=" + Math.random();
    }
	
  	$.ajax({
	   async:true,
	   url: url,
	   type:'post',
	   data : dataFormat,
	   dataType: 'json',
	   success: function(data){
		   if(data.success){
			   dialogClose("保存成功！",2,200);
			   if(moke_id > 0){
				   if(type == 1){
					   saveCannel();
					   return;
				   }
			   }else{
				   moke_id = data.id;
				   mokeSubmitFinish();
			   }
		   }
	   }
	});
}

function allSubmit(){
	if($("#resource_list_1 table tbody tr").length == 0){
		dialogOk('请上传教学设计！',300,'');
		return;
	}
	if($("#resource_list_2 table tbody tr").length == 0){
		dialogOk('请上传教学课件！',300,'');
		return;
	}
	 $.ajax({
         async:true,
         url: url_path_html + "/yx/moke/shenqingMoke?t=" + Math.random(),
         type : 'post',
         data : {moke_id:moke_id},
         dataType: 'json',
         success: function(data){
             if(data.success){
                 dialogClose("申请成功！",2,200);
                 saveCannel();
             }else{
                 dialogClose("系统繁忙，请稍后再试！",2,200,'');
             }
         }
     });
}

function mokeSubmitFinish(){
	$("#mokeSubmit").hide();
	$("#otherInfoPannel").addClass("active");
	listOthers();
}
//已保存磨课信息,显示其他信息
function listOthers(){
	showResourceList(1);
	showResourceList(2);
	showResourceList(3);
	showResourceList(4);
}

function cannel(){
	if("undefined" != typeof(parent.tb_remove)){
		parent.tb_remove();
	}
}

function saveCannel(){
	setTimeout(function(){
        if(null != callBack){
			var str = 'parent.' + callBack + '()';
			eval(str);
		 }
        cannel();
    },2000);
}

function uploadFile(type_id){
	var appType_id = 2;
	if(type_id == 1){
		appType_id = 2;
	}else if(type_id == 2){
		appType_id = 3;
	}else if(type_id == 3){
		appType_id = 13;
	}else if(type_id == 4){
		appType_id = 17;
	}
	
	hj_type = type_id;
	var url = url_path_html + "/yx/html/resource/uploadYxResource.html";
	url += "?service_type=" + 51;
	url += "&service_id=" + moke_id;
	url += "&hj_id=" + type_id;
	url += "&stage_id=" + $("#sel_stage").val();
	url += "&subject_id=" + $("#sel_subject").val();
	url += "&scheme_id=" + scheme_id;
	url += "&structure_id=" + structure_id;
	url += "&appType_id=" + appType_id;
	url += "&res_type=" + 14;
	url += "&TB_iframe=true";
	url += "&height=" + 450;
	url += "&width=" + 720;
	tb_show("上传资源",url, "thickbox");
}

var hj_type = 1;
function tb_remove(){
	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("200",function(){ $('#TB_iframeContent').remove();$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();

	document.onkeydown = "";
	document.onkeyup = "";	
	showResourceList(hj_type);
	return false;
}

function showResourceList(type_id){
	var url = url_path_html+"/space/ypt/getResourceAll?t=" + Math.random();
  	$.ajax({
	   url: url,
	   type:'post',
	   data : {
		   res_type : 51,
		   pageNumber : 1,
		   pageSize : 100,
		   rtype : 0,
		   beike_type : type_id,
		   view : moke_id,
		   sort_num : 2
	   },
	   dataType: 'json',
	   success: function(data){
		   if(data.success){
				if(null != data.list){
					  data = addServerUrlToJson(data);
					  //upDataToJson(data,1);
					  beforeRender(data);
					  data.type = type_id;
					  var html = template.render('resource_list_template', data);
					  $("#resource_list_" + type_id).html(html);
				}
		   }
	   }
	});
}

function changeBack(type){
	setTimeout(function(){
		showResourceList(type);
	},3000);
}