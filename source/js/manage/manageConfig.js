/**
 * 切换自动推荐或手动推荐
 * @param selectTag 自动推荐是0,手动推荐是1、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
 */
function switchAutoOrManual(serviceName,selectTag,methodCallBack){
	
	var autoOrManual = $(selectTag).val();
	
	var url = url_path_html+"/yx/jyManage/switchAutoOrManual?t=" + Math.random();
	
	$.ajax({
		   async:false,
		   url: url,
		   type : 'post',
		   data : {
			   "serviceName" : serviceName,
			   "org_id" : $.cookie("background_bureau_id"),
			   "autoOrManual" : autoOrManual	
			   },
		   dataType: 'json',
		   success: function(data){
			   eval(methodCallBack);
			   if(data.status == "SUCCESS"){
				   
			   }
		   }
	});	
}
/**
 * 查询一下这个业务现在的推荐方式 
 */
function queryAutoOrManual(serviceName){
	
	var retVal = null;
	
	var url = url_path_html+"/yx/jyManage/queryAutoOrManual?t=" + Math.random();
	
	$.ajax({
		async:false,
		url: url,
		type : 'post',
		data : {
			"serviceName" : serviceName,
			"org_id" : $.cookie("background_bureau_id")	
		},
		dataType: 'json',
		success: function(data){
			retVal = data
		}
	});
	
	return retVal;
}

/**
 * 设置教研推荐,对资源、活动、专题项... 
 * id是publish_id
 * is_tuijian 推荐1，取消推荐0
 * callBackMethod回调方法
 */
function setPublishIsTuijian(id,is_tuijian ,callBackMethod){
	
	var url = url_path_html+"/yx/publish/setPublishIsTuijian?t=" + Math.random();
	
	$.ajax({
		async:false,
		url: url,
		type : 'post',
		data : {
			id : id,
			is_tuijian : is_tuijian	
		},
		dataType: 'json',
		success: function(data){
			dialogClose("操作成功！",3,200,callBackMethod);
		}
	});
	
}


function getUnitList(){
    tb_show("选择审核单位",url_path_html + "/yx/html/resource/sel_check_unit.html?unit_id=" + $.cookie("background_yx_manage_org_id") + "&selId=" + unit_id + "&TB_iframe=true&height=400&width=360","thickbox");
}

/**
 * 切换审核结构
 * @param org_id
 * @param org_name
 */
var unit_id = 0,unit_name = "";
function changeOrg(org_id,org_name){
    unit_id	= org_id;
    unit_name = org_name;

    $("#check_unit").text("审核机构：【"+unit_name+"】");
	
    if (unit_id > 400000){ //如果为学校，则隐藏【下级待审核】
        $("#sel_type option[value='20']").css("display", "none");
    }else{
        $("#sel_type option[value='20']").css("display", "block");
    }
}

function playHelp(fileName){
	var dialog = art.dialog({
		width: 643,
      		height: 423,
	    title: '使用帮助',
	    content: '<div id="videoContent"></div>',
	    init : function(){
	    	var player = jwplayer("videoContent").setup({
	       		autostart: true,
	       		flashplayer: "../../js/red5player/player.swf",
	       		width: 643,
	       		height: 423,
	    		file: "../../video/"+fileName
	    	});
	    	
			player.onComplete(function(){
				dialog.close();
				playHelp(fileName);
            });
	    }
	});
}