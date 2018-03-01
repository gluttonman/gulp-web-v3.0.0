var share = null;
var file_filter = {"disc":"*","content":"doc,docx,txt,xls,xlsx,ppt,pptx,swf,mid,wav,mp3,zip,rar,jpg,gif,png,jpeg,exe,wmv,avi,flv,mp4,asf,rmvb"};
var dialog_save;
var callBack;///
var team_id = 0;/////////
var service_type = 0;////
var service_id = 0;//////////
var hj_id = 0;/////
var hj_name = "无";////
var share_ids = "";
var checkboxids = "";
var release_status = 1;///
var file_type = 0;////1.视频 2.文本
var param_stage_id = 0;
var param_subject_id = 0;
var param_scheme_id = 0;
var param_structure_id = 0;
var param_appType_id = 0;
var res_type = 1;
var file_num = 10;

$(function(){
	if(null == $.cookie("person_id")){
		return;
	}
	if(null != GetQueryString("service_type")){
		service_type = GetQueryString("service_type");
		if(null != GetQueryString("service_id")){
			service_id = GetQueryString("service_id");
		}
		if(null != GetQueryString("hj_id")){
			hj_id = GetQueryString("hj_id");
		}
		if(null != GetQueryString("hj_name")){
			hj_name = GetQueryString("hj_name");
		}
	}
	if(null != GetQueryString("file_num")){
		file_num = GetQueryString("file_num");
	}
	if(null != GetQueryString("res_type")){
		res_type = GetQueryString("res_type");
	}
	
	if(null != GetQueryString("callBack")){
		callBack = GetQueryString("callBack");
	}
	if(null != GetQueryString("file_type")){
		file_type = GetQueryString("file_type");
	}
	if(file_type == 1){
		$("#file_type").html('文件类型：wmv,asf,flv,mp4,rmvb');
		file_filter = {"disc":"*","content":"wmv,avi,flv,mp4,asf,rmvb"};
	}else if(file_type == 2){
		$("#file_type").html('文件类型：doc,docx,txt,xls,xlsx,ppt,pptx');
		file_filter = {"disc":"*","content":"doc,docx,txt,xls,xlsx,ppt,pptx"};
	}else if(file_type == 3){
		$("#file_type").html('文件类型：jpg,gif,png,jpeg');
		file_filter = {"disc":"*","content":"jpg,gif,png,jpeg"};
	}else if(file_type == 4){
		$("#file_type").html('文件类型：doc,docx,ppt,pptx');
		file_filter = {"disc":"*","content":"doc,docx,ppt,pptx"};
	}else if(file_type == 5){
		$("#file_type").html('文件类型：doc,docx,txt,xls,xlsx,ppt,pptx,swf,mid,wav,mp3,zip,rar,jpg,gif,png,bmp,jpeg,exe');
		file_filter = {"disc":"*","content":"doc,docx,txt,xls,xlsx,ppt,pptx,swf,mid,wav,mp3,zip,rar,jpg,gif,png,bmp,jpeg,exe"};
	}
	
	if(null != GetQueryString("team_id")){
		team_id = GetQueryString("team_id");
	}
	if(null != GetQueryString("release_status")){
		release_status = GetQueryString("release_status");
	}
	
	if(team_id > 0){
		share_ids = team_id;
		checkboxids = "share_self," + team_id;
	}else{
		if(service_type > 0 && service_id > 0){
			
		}else{
			share = $("#myshare").sharerange();
		}
	}
	
	//加载上传组件
	plupload(file_num,-1,"200mb");
	$(".plupload_header_text").html("（ 提示：如尚未安装文件传输助手，<a onclick='downExe()' style='text-decoration:underline;color:red'>点此下载</a>）");
	param_scheme_id = GetQueryString("scheme_id") == null ? 0 : GetQueryString("scheme_id");
	param_structure_id = GetQueryString("structure_id") == null ? 0 : GetQueryString("structure_id");
	
	if(param_scheme_id > 0 && param_structure_id > 0){
		$("#sel_stage_subject").parent().hide();
		param_appType_id = GetQueryString("appType_id") == null ? 2 : GetQueryString("appType_id");
	}else{
		var stage_id = $.cookie("background_stage_id");
		var subject_id = $.cookie("background_subject_id");
		param_stage_id = GetQueryString("stage_id") == null ? 0 : GetQueryString("stage_id");
		param_subject_id = GetQueryString("subject_id") == null ? 0 : GetQueryString("subject_id");
		if(param_stage_id > 0 && param_subject_id > 0){
			stage_id = param_stage_id;
			subject_id = param_subject_id;
		}
		xd_subject_type = 1;
		initSelectStageSubject(stage_id,subject_id);
		
		//加载目录树
		initStructure();
		//加载章节
		changeScheme();
				
		//加载应用类型
		initAppType();
		
		initEvent();
	}
});

/**
 * 用上传助手上传大文件
 */
function uploadBigFile(){
		
	var person_id = $.cookie("person_id");
	var person_name = $.cookie("person_name");
	var identity_id = $.cookie("identity_id");
	var token = $.cookie("token");
	var code = NewGuid();
	if(share != null){
    	share_ids = share.sharerange("getRangeSel",1);//共享范围ID
    	checkboxids = share.sharerange("getRangeSel",2);//共享标签ID
    }
    
    var share_type = 0;
    if(share_ids != ""){
        share_type = 1;
    }
    
	var json_param = {
		"filter":[file_filter],
		"uploadOrDownload": true,                  //是上传还是下载,true为上传,false为下载
		"confirmUploadInfo": _action_path + url_path_action_login + "/wkds/clientSetUploadInfo",
		"paramJson": {
			"service_type":service_type,
			"service_id":service_id,
			"res_type":res_type,
			"bk_type":hj_id,
			"bk_type_name":hj_name,
			"share_type" : share_type,
			"share_ids" : share_ids,//org
			"checkboxids" : checkboxids,//group
			"release_status" : release_status,
			"media_type" : param_appType_id > 0 ? param_appType_id : $("#radio_apptype_div input:checked").val(),
			"scheme_id" : param_scheme_id > 0 ? param_scheme_id : scheme_id,
			"structure_ids" : param_structure_id > 0 ? param_structure_id : getStrucValue().struc_id,
			"subject_id" :	$("#sel_subject").val(),
			"addResCode": code,
			"icomet_url":"http://127.0.0.1/dsideal_yy/icometCommon/push"
		},					
		"cookieJson": {
			"person_name": person_name,
			"identity_id": identity_id,
			"person_id": person_id,
			"token":token
		},
		//"upload":_action_path + url_path_action_login + "/uploadres/uploadCallback",
		"upload":_action_path + url_path_action_login + "/yx/resource/uploadCallback",
		"secTranster":_action_path + url_path_action_login+"/resource/getFileIdByMD5?resource_md5="
	};
	
	//云版
	if(pt_type == 1){	
		json_param["ossCloudOrSftp"] = true;
		json_param["ossInfoUrl"] = _action_path + url_path_action_login + "/uploadres/getOssInfo";
		json_param["ossServer"] = url_path_down;
	}else if(pt_type == 2){
	//局版
		json_param["ossCloudOrSftp"] = false;
		json_param["confirmUploadInfo"] = _action_path + url_path_action_login + "/uploadres/uploadFileFtp";
		json_param["sftpInfoUrl"] = _action_path + url_path_action_login + "/uploadres/uploadFileFtp";
	}
	
	var json_param_str = Base64.encode(JSON.stringify(json_param));	
	
	try{
		window.location.href = "dsud://"+json_param_str;
	}catch(e){
		e.returnValue = false;
		$.cookie("new_reload","1", {path:"/"});
		window.location.reload(); 
	}
}
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

//上传文件扩展名检查demo，返回0代表检查不通过，非0代表通过
function checkFileExtension(extension){
	
	extension = extension.toLowerCase();
	
	if(file_type == 1){
		if(extension == "wmv"
				|| extension == "asf"
				|| extension == "flv"
				|| extension == "mp4"
				|| extension == "rmvb"){
			return 1;
		}else{
			return 0;
		}
	}else if(file_type == 2){
		if(extension == "txt"
				|| extension == "doc"
				|| extension == "docx"
				|| extension == "xls"
				|| extension == "xlsx"
				|| extension == "ppt"
				|| extension == "pptx"){
			return 1;
		}else{
			return 0;
		}
	}else if(file_type == 3){
		if(extension == "jpg"
				|| extension == "gif"
				|| extension == "png"
				|| extension == "jpeg"){
			return 1;
		}else{
			return 0;
		}
	}else if(file_type == 4){
		if(extension == "doc"
			|| extension == "docx"
			|| extension == "ppt"
			|| extension == "pptx"){
			return 1;
		}else{
			return 0;
		}
	}else if(file_type == 5){
		if(extension == "doc"
			|| extension == "docx"
			|| extension == "txt"
			|| extension == "xls"
			|| extension == "xlsx"
			|| extension == "ppt"
			|| extension == "pptx"
			|| extension == "swf"
			|| extension == "mid"
			|| extension == "wav"
			|| extension == "mp3"
			|| extension == "zip"
			|| extension == "rar"
			|| extension == "jpg"
			|| extension == "gif"
			|| extension == "png"
			|| extension == "bmp"
			|| extension == "jpeg"
			|| extension == "exe"){
			return 1;
		}else{
			return 0;
		}
	}else{
		if(extension == "doc" 
			|| extension == "docx"
			|| extension == "txt"
			|| extension == "xls"
			|| extension == "xlsx"
			|| extension == "ppt"
			|| extension == "pptx"
			|| extension == "swf"
			|| extension == "mid"
			|| extension == "wav"
			|| extension == "mp3"
			|| extension == "zip"
			|| extension == "rar"
			|| extension == "jpg"
			|| extension == "gif"
			|| extension == "png"
			|| extension == "bmp"
			|| extension == "jpeg"
			|| extension == "exe"
			|| extension == "wmv"
			|| extension == "asf"
			|| extension == "flv"
			|| extension == "mp4"
			|| extension == "avi"
			|| extension == "rmvb"){
			return 1;
		}else{
			return 0;
		}
	}
}

//上传当前文件成功回调函数（保存数据），保存数据成功返回true，失败返回false
function uploadFileInfo(file,upload_file_id){
	
	var file_name = file.name;  //文件名
    var file_size = file.size;
    var file_size_str = "";
    if(file_size < 1000){
    	file_size_str = file_size + " B";
    }else if(file_size >= 1000 && file_size < 1000000){
    	file_size_str = (file_size/1000).toFixed(2) + " KB";
    }else if(file_size >= 1000000 && file_size < 1000000000){
    	file_size_str = file_size/1000000 + " MB";
    }else if(file_size >= 1000000000){
    	file_size_str = file_size/1000000000 + " GB";
    }
    //var Material_path = v_guid.substring(0,2);
	//获得文件的扩展名
	var j = file_name.lastIndexOf(".");
	var extension = file_name.substring(j+1);
	extension = extension.toLowerCase();
	file_name = file_name.substring(0,file_name.lastIndexOf("."));
	
	art.dialog({
		content: "正在保存资源信息...",
		width: 240,
		title: "提示",
		close:function(){
			return true;
		},
		init: function (){
			dialog_save = this;
		}
	});
	  
	var m3u8_status = 0;//根据扩展名判断m3u8状态值
    if(extension=="wmv"||extension=="mp4"||extension=="avi"||extension=="flv"){
        m3u8_status = 1;
    }
    
    if(share != null){
    	share_ids = share.sharerange("getRangeSel",1);//共享范围ID
    	checkboxids = share.sharerange("getRangeSel",2);//共享标签ID
    }
    
    var share_type = 0;
    if(share_ids != ""){
        share_type = 1;
    }
    
 	$.ajax({
	    type:"POST",
		async: false,
		dataType:"json",
		data : {
			"service_type":service_type,
			"service_id":service_id,
			"res_type":res_type,
			"release_status":release_status,
			"file_name":file_name,
			"extension":extension,
			"bk_type":hj_id,
			"bk_type_name":hj_name,
			"share_type" : share_type,
			"share_ids" : share_ids,//org
			"checkboxids" : checkboxids,//group
			"file_id":upload_file_id,
			"resource_size": file_size_str,
			"resource_size_int": file_size,
			"m3u8_status":m3u8_status,
			"media_type" : param_appType_id > 0 ? param_appType_id : $("#radio_apptype_div input:checked").val(),
			"person_id" : $.cookie("person_id"),
			"scheme_id" : param_scheme_id > 0 ? param_scheme_id : scheme_id,
			"structure_ids" : param_structure_id > 0 ? param_structure_id : getStrucValue().struc_id,
			"subject_id" :	$("#sel_subject").val(),
			"tempGuid" : upload_file_id
			
		},
		url : url_path_html + "/yx/resource/uploadResource?random_num=" + creatRandomNum(),
		//url : url_path_html + "/ypt/uploadres/oss_upload_resource?random_num=" + creatRandomNum(),
		success:function(data){
			if(data.success){
				setUploadCount(file_size,extension,1);
				setTimeout(function(){
					dialog_save.close();
					if(null != callBack){
						var str = 'parent.' + callBack + '()';
						eval(str);
					}
				},3000);
			}
		}
 	});
	
	return true;
}

function setUploadCount(size,extention,type_id){
	var stage_id = param_stage_id > 0 ? param_stage_id : $("#sel_stage").val();
	var subject_id = param_subject_id > 0 ? param_subject_id : $("#sel_subject").val();
	var	mtype = extention;
	if(type_id != 3){
		mtype = patchExtention(extention);
		mtype = mtype.substring(0,1);
	}
	var wrids = -1;
	$.ajax({
         type : "GET",
         async : false,
         dataType:"json",
         url : url_path_action + "/tongji/tj_upload?stage_id="+stage_id+"&subject_id="+subject_id+"&size="+size+"&type_id="+type_id+"&mtype="+mtype+"&random_num="+creatRandomNum()+"&wrids="+wrids,
         success : function(data) {

     	}
 	});
}

function  patchExtention(extention){
	extention=extention.toLowerCase();
	
	var map=getMap();
	map.put("jpg","2:图片");   
	map.put("png","2:图片");     
	map.put("jpeg","2:图片");    
	map.put("gif","2:图片");  
	map.put("bmp","2:图片");  
	map.put("eps","2:图片");  
	map.put("jpeg","2:图片"); 
	map.put("jpe","2:图片");  
	map.put("pcx","2:图片");  
	map.put("raw","2:图片");  
	map.put("pict","2:图片"); 
	map.put("pxr","2:图片");  
	map.put("sct","2:图片");  
	map.put("tiff","2:图片"); 
	map.put("targa","2:图片");
	map.put("psd","2:图片");
	map.put("doc","3:文档");  
	map.put("docx","3:文档"); 
	map.put("txt","3:文档");  
	map.put("xls","3:文档"); 
	map.put("xlsx","3:文档"); 
	map.put("ppt","3:文档");  
	map.put("pptx","3:文档"); 
	map.put("pdf","3:文档");  
	map.put("docm","3:文档"); 
	map.put("dotm","3:文档"); 
	map.put("dotx","3:文档"); 
	map.put("dot","3:文档");  
	map.put("xps","3:文档");  
	map.put("mht","3:文档");  
	map.put("nhtml","3:文档");
	map.put("htm","3:文档");  
	map.put("html","3:文档"); 
	map.put("rtf","3:文档");  
	map.put("xml","3:文档");  
	map.put("odt","3:文档");  
	map.put("wtf","3:文档");  
	map.put("xlsm","3:文档"); 
	map.put("xlsb","3:文档"); 
	map.put("xltx","3:文档"); 
	map.put("prn","3:文档");  
	map.put("dif","3:文档");  
	map.put("slk","3:文档");  
	map.put("xlam","3:文档"); 
	map.put("xps","3:文档");  
	map.put("ods","3:文档");  
	map.put("pptm","3:文档"); 
	map.put("ppa","3:文档");  
	map.put("odp","3:文档");  
	map.put("pps","3:文档");  
	map.put("mp4","4:视频");  
	map.put("mpeg","4:视频"); 
	map.put("mpg","4:视频");  
	map.put("3gp","4:视频");  
	map.put("flv","4:视频");  
	map.put("mkv","4:视频");  
	map.put("wmv","4:视频");  
	map.put("saf","4:视频");  
	map.put("avi","4:视频");  
	map.put("rm","4:视频");   
	map.put("flash","4:视频");
	map.put("mid","4:视频");  
	map.put("swf","4:视频"); 
	map.put("rmvb","4:视频");
	map.put("asf","4:视频");
	map.put("mov","4:视频");
	
	map.put("mp3","5:音乐");  
	map.put("wma","5:音乐");  
	map.put("wav","5:音乐");  
	map.put("mod","5:音乐");  
	map.put("ra","5:音乐");   
	map.put("ram","5:音乐");  
	map.put("cd","5:音乐");   
	map.put("md","5:音乐");   
	map.put("ogg","5:音乐");  
	map.put("ape","5:音乐");  
	map.put("flac","5:音乐"); 
	
	map.put("undefined","6:其他");

	var  mapvalue=map.get(extention);
	var exp=undefined;
	if(mapvalue == exp){
		
		mapvalue=map.get("undefined");
	}
	//alert(mapvalue);
	return  mapvalue;
}

//数组匹配上传文件的媒体类型
function getMap() {//初始化map_,给map_对象增加方法，使map_像Map
      var map_ = new Object();
      map_.put = function(key, value) {
          map_[key+'_'] = value;
      };
      map_.get = function(key) {
          return map_[key+'_'];
      };
       map_.remove = function(key) {
           delete map_[key+'_'];
       };
       map_.keyset = function() {
           var ret = "";
           for(var p in map_) {
               if(typeof p == 'string' && p.substring(p.length-1) == "_") {
                   ret += ",";
                   ret += p.substring(0,p.length-1);
               }
           }
           if(ret == "") {
               return ret.split(",");
           } else {
               return ret.substring(1).split(",");
           }
       };
       return map_;
}