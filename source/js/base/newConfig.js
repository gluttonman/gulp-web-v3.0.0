﻿//icomet相关 start
var icomet_path = "http://www.zgjsyxw.com";
var v_subUrl = icomet_path + "/front/poll";
var v_signUrl = icomet_path + "/icomet/sign";
//var v_channel = $.cookie('background_person_id');
//icomet相关 end

var action_path_html;
function initAction_path_html(){
	//初始化action
	var pathName = document.location.pathname;
	var i_a = pathName.lastIndexOf("/");
	var i_b = pathName.lastIndexOf(".html");
	action_path_html =  pathName.substring(i_a + 1,i_b);
}
initAction_path_html();
initHdStatusParam();

function initHdStatusParam(){
	//获取活动状态
	template.helper("getHdStatus", function(start_time,end_time){
		var date = new Date();
		var start_date = new Date(start_time.replace(/-/g,"/"));
		var end_date = new Date(end_time.replace(/-/g,"/"));
		var status = '';
		if(date.getTime() < start_date.getTime()){
			status = "<span style='color:green'>[未开始]</span>";
		}else if(date.getTime() > end_date.getTime()){
			status = "[已结束]";
		}else{
			status = "<span style='color:red'>[进行中]</span>";
		}
		return status;
	});
}
/**
 * @param dataFormat
 * @param url
 */
function dataRender(dataFormat,url,div_name,script_name,type,callBack){
	$.ajax({
		async:true,
		url : url,
		type : type,
		data : dataFormat,
		dataType : 'json',
		success : function(data){
			renderByData(script_name,div_name,data);
			if(undefined != callBack){
				callBack(data);
			}
		}
	});
}
//同步渲染
function dataRenderSync(dataFormat, url, div_name, script_name, type, callBack) {
	$.ajax({
		async: false,
		url: url,
		type: type,
		data: dataFormat,
		dataType: 'json',
		success: function(data) {
			renderByData(script_name, div_name, data);
			if (undefined != callBack) {
				callBack(data);
			}
		}
	});
}
function renderByData(script_name,content_name,data){
	var html = template(script_name, data);
	$("#" + content_name).html(html);
}

//分页处理
function go2Page(pageNumber, totalPage){
	page = Number(pageNumber);
	total = Number(totalPage);
	if(page > total || page < 1){
		return;
	}
	renderData(pageNumber);
}
function checkPage(text,maxPage){
	var pageNumber=Number(text.value);
	var totalPage=Number(maxPage);
	if(pageNumber > totalPage){
		text.value = totalPage;
	}else if(pageNumber<1){
		text.value=1;
	}
	return true;
}
/**
 * 查看分页跳转验证
 */
function checkNum(text){
	var reg = /^[1-9][0-9]{0,100}$/;
	if(reg.test(text.value)){
		if(text.value==0){
			text.value =1;
			return true;
		}else{
			return true;
		}
	}else{
		text.value="";
		return false;
	}
}
/**
 * 日期对象转换为指定格式的字符串
 * @param f 日期格式，格式定义如下 yyyy-MM-dd HH:mm:ss
 */
function dateToStr(date,formatStr){
	date = arguments[0] || new Date();
	formatStr = arguments[1] || "yyyy-MM-dd HH:mm";
	var str = formatStr;
	var Week = ['日','一','二','三','四','五','六'];
	str=str.replace(/yyyy|YYYY/,date.getFullYear());
	str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
	str=str.replace(/MM/,date.getMonth()>=9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));
	str=str.replace(/M/g,date.getMonth());
	str=str.replace(/w|W/g,Week[date.getDay()]);
	str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
	str=str.replace(/d|D/g,date.getDate());
	str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
	str=str.replace(/h|H/g,date.getHours());
	str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
	str=str.replace(/m/g,date.getMinutes());
	str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
	str=str.replace(/s|S/g,date.getSeconds());
	return str;
}
function dateAddHour(date,num){
	var m = num * 3600 * 1000;
	m = m + date.getTime();
	return new Date(m);
}

//获得门户org_id
function getHoleOrgId(){
	var org_id = 99999;
	var jss = document.getElementsByTagName('script');
	for (var i = 0;i < jss.length; i++){
		var j = jss[i];
		if(j.src.indexOf("?id=") > 0){
			org_id = j.src.split("?id=")[1];
			break;
		}
	}
	return org_id;
}

/**获取学段学科 start*/
var xd_subject_list = null;
var xd_subject_type = 0;
function getSel_stage_subject(obj_id){
	if($("#" + obj_id).length > 0){
		if(xd_subject_type == 0){
			$("#" + obj_id).html('<span>学段学科：</span><select class="form-control" id="sel_stage" style="width:100px;"><option value="0">全部</option></select>&nbsp;&nbsp;<select class="form-control" id="sel_subject" style="width:100px;"><option value="0">全部</option></select>');
		}else{
			$("#" + obj_id).html('<span>学段学科：</span><select class="form-control" id="sel_stage" style="width:100px;"></select>&nbsp;&nbsp;<select class="form-control" id="sel_subject" style="width:100px;"></select>');
		}
	}
	$.ajax({
		async : false,
		url : url_path_html + "/resource/getStageSubject?random_num=" + Math.random(),
		type : "post",
		dataType : "json",
		success : function(data){
			if(data.success){
				xd_subject_list = data.xd_subject_list;
				getStageList();
			}
		}
	});
}

function getStageList(){
	if(xd_subject_list.length > 0){
		for(var i=0;i<xd_subject_list.length;i++){
			$("#sel_stage").append('<option value="' + xd_subject_list[i].xd_id + '">' + xd_subject_list[i].xd_name + '</option>');
		}
		$(document).on("change","#sel_stage",function(){
			getSubjectList();
		});
	}
}

function getSubjectList(){
	var stage_id = $("#sel_stage").val();
	if(xd_subject_type == 0){
		$("#sel_subject").html('<option value="0">全部</option>');
	}else{
		$("#sel_subject").html('');
	}
	if(stage_id > 0){
		var subject_list = null;
		for(var i = 0; i < xd_subject_list.length;i++){
			if(xd_subject_list[i].xd_id == stage_id){
				subject_list = xd_subject_list[i].subject_list;
				break;
			}
		}
		if(null != subject_list && subject_list.length > 0){
			for(var i = 0; i < subject_list.length;i++){
				if(subject_list[i].subject_id != 65 && subject_list[i].subject_id != 70 && subject_list[i].subject_id != 71 && subject_list[i].subject_id != 64 && subject_list[i].subject_id != 68 && subject_list[i].subject_id != 69){
					$("#sel_subject").append('<option value="' + subject_list[i].subject_id + '">' + subject_list[i].subject_name + '</option>');
				}
			}
		}
	}
}

function initSelectStageSubject(stage_id,subject_id){
	if(null == stage_id){
		stage_id = 0;
	}
	if(null == subject_id){
		subject_id = 0;
	}
	//初始化学科学段下拉选
	getSel_stage_subject("sel_stage_subject");
	if(stage_id > 0){
		$("#sel_stage").val(stage_id);
	}
	getSubjectList();
	if(subject_id > 0){
		$("#sel_subject").val(subject_id);
	}
}

function initStageSubject(data){
	for(var i=0;i<data.list.length;i++){
		var same_xd_list = null;
		for(var j=0;j<xd_subject_list.length;j++){
			if(data.list[i].stage_id == xd_subject_list[j].xd_id){
				same_xd_list = xd_subject_list[j];
				break;
			}
		}
		if(same_xd_list != null){
			data.list[i].stage_name = same_xd_list.xd_name;
			for(var k=0;k<same_xd_list.subject_list.length;k++){
				if(data.list[i].subject_id == same_xd_list.subject_list[k].subject_id){
					data.list[i].subject_name = same_xd_list.subject_list[k].subject_name;
					break;
				}
			}
		}else{
			data.list[i].stage_name = "";
			data.list[i].subject_name = "全部";
		}
	}
}


/**获取学段学科 end*/


function getPersonInfo(){
	$.ajax({
		url:url_path_html + "/person/getPersonInfo?random_num=" + Math.random(),
		async: false,
		type: "POST",
		data: {
			person_id :  $.cookie("person_id"),
			identity_id : $.cookie("identity_id")
		},
		dataType: "json",
		success: function(data){
			if(data.success){
				
				$.cookie("background_person_id", $.cookie("person_id"), {path:"/"});
				$.cookie("background_person_name", $.cookie("person_name"), {path:"/"});
				$.cookie("background_identity_id", $.cookie("identity_id"), {path:"/"});
				$.cookie("background_token", $.cookie("token"), {path:"/"});
				$.cookie("background_bureau_id", data.table_List.bureau_id, {path:"/"});
				$.cookie("background_bureau_name", data.table_List.bureau_name, {path:"/"});
				$.cookie("background_bureau_type", data.table_List.bureau_type, {path:"/"});
				$.cookie("background_province_id", data.table_List.province_id, {path:"/"});
				$.cookie("background_city_id", data.table_List.city_id, {path:"/"});
				$.cookie("background_district_id", data.table_List.district_id, {path:"/"});
				$.cookie("background_school_id", data.table_List.school_id, {path:"/"});

				//学段学科名
				var subject_name = data.table_List.stage_name + data.table_List.subject_name;
				subject_name = subject_name == 0 ? '全部学科' : subject_name;
				$.cookie("background_stage_subject_name",subject_name, {path:"/"});
				
				if(null != data.table_List.roles && data.table_List.roles.length > 0){
					var role_str = "";
					for(var i=0;i<data.table_List.roles.length;i++){
						role_str = role_str + data.table_List.roles[i].role_code.toUpperCase() + ",";
						role_str = role_str + data.table_List.roles[i].role_id + ",";
						role_str = role_str + data.table_List.roles[i].role_name + ";";
					}
					if(role_str.indexOf(";") > 0){
						role_str = role_str.substring(0, role_str.length - 1);
					}
					$.cookie("background_role_str", role_str, {path:"/"});
					
					if(role_str.indexOf("YX,")>-1){
						$.cookie("background_role_code", "YX", {path:"/"});
						$.cookie("background_yx_manage_org_id", "99999", {path:"/"});
						$.cookie("background_yx_manage_org_name", "研修网", {path:"/"});
						$.cookie("background_yx_manage_org_type", 100, {path:"/"});
					}else if(role_str.indexOf("YX_PROV_ADMIN,")>-1){
						if(undefined != data.table_List.province_id && data.table_List.province_id > 0){
							$.cookie("background_role_code", "YX_PROV_ADMIN", {path:"/"});
							$.cookie("background_yx_manage_org_id", data.table_List.province_id, {path:"/"});
							$.cookie("background_yx_manage_org_name", data.table_List.province_name, {path:"/"});
							$.cookie("background_yx_manage_org_type", 101, {path:"/"});
						}
					}else if(role_str.indexOf("YX_CITY_ADMIN")>-1){
						if(undefined != data.table_List.city_id && data.table_List.city_id > 0){
							$.cookie("background_role_code", "YX_CITY_ADMIN", {path:"/"});
							$.cookie("background_yx_manage_org_id", data.table_List.city_id, {path:"/"});
							$.cookie("background_yx_manage_org_name", data.table_List.city_name, {path:"/"});
							$.cookie("background_yx_manage_org_type", 102, {path:"/"});
						}
					}else if(role_str.indexOf("YX_AREA_ADMIN")>-1){
						if(undefined != data.table_List.district_id && data.table_List.district_id > 0){
							$.cookie("background_role_code", "YX_AREA_ADMIN", {path:"/"});
							$.cookie("background_yx_manage_org_id", data.table_List.district_id, {path:"/"});
							$.cookie("background_yx_manage_org_name", data.table_List.district_name, {path:"/"});
							$.cookie("background_yx_manage_org_type", 103, {path:"/"});
						}
					}else if(role_str.indexOf("YX_SCHOOL_ADMIN")>-1){
						if (data.table_List.bureau_id == data.table_List.school_id){
							$.cookie("background_role_code", "YX_SCHOOL_ADMIN", {path:"/"});
							$.cookie("background_yx_manage_org_id", data.table_List.bureau_id, {path:"/"});
							$.cookie("background_yx_manage_org_name", data.table_List.bureau_name, {path:"/"});
							$.cookie("background_yx_manage_org_type", 104, {path:"/"});
						}
					}
				}
				getTeacherInfo();
			}
		}
	});
}

function getTeacherInfo(){
	$.ajax({
		url:url_path_html + "/management/per/getTeacherInfo?random_num=" + Math.random(),
		async: false,
		type: "POST",
		data: {
			teacher_id :  $.cookie("person_id")
		},
		dataType: "json",
		success: function(data)
		{
			if(data.success){
				$.cookie("background_stage_id", data.table_list.columns.STAGE_ID, {path:"/"});
				$.cookie("background_subject_id", data.table_list.columns.SUBJECT_ID, {path:"/"});
				$.cookie("background_xb_name", data.table_list.columns.XB_NAME, {path:"/"});
			}
		}
	});
}


function checkLogin(){
	//头像路径
	$.cookie("avatar_url", getYptPersonTx(), {path:"/"});
	getPersonInfo();
	changeLogin();
}

function doLogout(toPage){
	var url = url_path_html + "/login/doLogout?type=2&t=" + Math.random();
	$.ajax({
		url:url,
		type:"get",
		async: false,
		success:function(data){
			if(null != toPage){
				window.location = toPage;
			}else{
				changeLogout();
			}
		}
	});
}

//头像
function getYptPersonTx(){
	var retVal = "";
	$.ajax({
		async: false, 
		method : "POST",
        url : url_path_html + "/space/common/getAvatar?random_num="+Math.random(),                
        data:{
        	"person_id":$.cookie("person_id"),
        	"identity_id":$.cookie("identity_id")
        },
		dataType:"json",
        success: function(data)
        {
            if(data.success){
               var file_id = data.avatar_file_id;
			   
			   var _two = file_id.substring(0,2);
			   img_path = url_path_html + "/html/thumb/Material/" + _two + "/" + file_id; 
			   retVal = img_path;
			   
            }
        }
    });
	
	return retVal;
}

