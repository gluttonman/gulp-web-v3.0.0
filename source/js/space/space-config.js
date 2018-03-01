/**
 * 是否开启GZIP压缩
 */
var gzipFlag = 0; //0 不适用gzip  1 使用gzip
var gzipJson;
var interactionGzipJson;

//统计分析服务地址
var statisticUrl = "http://10.10.6.252:8180/BDA";

/**
 * 教研和博客
 */
//教研地址, 教研统计http://10.10.6.62/newjy/base/web/jyCount.do?org_id=101, 教研统计详情http://10.10.6.62/newjy/count.jsp
var teachingResearchUrl = "http://115.28.233.30:7721/newjy/";
//博客地址
var blogUrl = "http://115.28.233.30:7721/newBlog";
//发表博文
var  publishBlogArticleUrl = blogUrl + "/bk/bkArticle/bkArticleEditModel.do";
//读取博文
var getBlogArticleUrl = blogUrl + "/bk/bkArticle/blogList.do"; 
//我的博文--更多...
var myBlog_tomore = blogUrl + "/base/user/visitBlog.do";
//博文历史
var myBlog_history = blogUrl + "/bk/bkArticle/historyList.do";
//精华博文--更多
var good_Tblog_url = blogUrl + "/bk/index/bkAllArticle.do?recommend_flag=1";
var good_Sblog_url = blogUrl + "/bk/index/bkAllArticleByStudent.do?recommend_flag=1";

/**
 * 管理软件
 */
//办公通知url
var worknotice_url = "http://192.168.100.242:6601/EMIIS_WS/webServer/rs/querydata/yun/2013-3-21";
var worknotice_url2 = "http://221.194.113.163:6601/dsoa/index.action?liferaySystem=business_bg,notice_searchGET.action,sn:";
//教师评价和学生评价方案数据
var pj_tea = "http://10.10.6.81:8080/EMIIS_WS/webServer/rs/querydata/kongjian/2013-3-21/pj_tea/where%201=1/1";
var pj_stu = "http://10.10.6.81:8080/EMIIS_WS/webServer/rs/querydata/kongjian/2013-3-21/pj_stu/where%201=1/1";
//教师评价和学生评价方案预览地址
var pj_stu_pre = "http://10.10.6.103:6601/system_manager_ssh/index.action?liferaySystem=business_xspj,studentPlan_lookDetail.action,txid:";//6E24D5F2-90C0-4400-B983-7175F57DF2FF
var pj_tea_pre = "http://10.10.6.103:6601/system_manager_ssh/index.action?liferaySystem=business_jspj,teacherPlan_lookDetail.action,txid:";//BAD1C6F8-7E89-44E8-9B35-6003B1361847
//各系统定位:学生评价：4,教师评价：7,办公平台：11,教务管理：9,后勤管理：18,教师管理：6
var manageSystem = "http://10.10.6.103:6601/system_manager_ssh/index.action?systemid=";

/**
 * 机构空间配置
 */
var orgSpaceFlag = 1; //是否开放机构空间,开放后右上角有下拉菜单，默认1开放，0屏蔽
var bbsFlag = 1; //是否开放论坛，默认1开放，0屏蔽
var creditFlag = 1; //是否开放积分，默认1开放，0屏蔽
//个人空间退出地址，如果开放机构空间则退出到机构空间，否则退出到集成页
var personalLogoutAddr = "/html/space/main/main_org.html"; //"/html/ypt/index_hc.html"
//默认访问机构，及机构级别
var defaultOrgId = "300529";
var defaultOrgIid = "103";
//默认区管
var defaultOrgAdmin = 30163;

/**
 * 统一认证配置
 */
//是否接入统一认证标志，0不接入，1接入，不接入sso时可以将相关变量关闭
var sso_flag = 0;
var casurlpath="";
var yyurlpath="";
var isLoginAddr="";
var getLoginInfoAddr ="";
var ajaxLoginAddr = "";
var ssoLogoutAddr = "";
if(pt_type == 1){
    var app_url_path_img = "down/App/";
}else{
    var app_url_path_img = "thumb/App/";
}
//应用系统集成
var system_integration_list = [
	{"sysName":"百度", "sysAddr":"http://www.baidu.com", "sysIcon": "../../../images/space/EDUSOA.png"},
	{"sysName":"百度", "sysAddr":"http://www.baidu.com", "sysIcon": "../../../images/space/EDUSOA.png"},
	{"sysName":"百度", "sysAddr":"http://www.baidu.com", "sysIcon": "../../../images/space/EDUSOA.png"},
	{"sysName":"百度", "sysAddr":"http://www.baidu.com", "sysIcon": "../../../images/space/EDUSOA.png"}
];
$(function(){
    var data_ = {};
    try{
    	data_ = getGolbalValueByKeys("common.sso,common.org.id,common.org.level,common.sso.url,common.sso.ypt");
    }catch(e){
    	data_ = {};
    }
    if(typeof(data_) == "undefined"){
        data_ = {};
    }
    if(!isEmpty(data_['common.sso'])){
        sso_flag = data_['common.sso'];
    }
    if(!isEmpty(data_['common.org.id'])){
        defaultOrgId = data_['common.org.id'];
    }
    if(!isEmpty(data_['common.org.level'])){
        defaultOrgIid = data_['common.org.level'];
    }
    if(!isEmpty(data_['common.sso.url'])){
        casurlpath = data_['common.sso.url'];
    }
    if(!isEmpty(data_['common.sso.ypt'])){
        yyurlpath = data_['common.sso.ypt'];
    }
    isLoginAddr = casurlpath + "/ajaxIsLogin"
    getLoginInfoAddr =yyurlpath + "/dsideal_yy/html/ypt/getLoginInfo.jsp";
    ajaxLoginAddr = casurlpath + "/ajaxLogin";
    ssoLogoutAddr = casurlpath + "/logout";

    /*history.replaceState({
        time: new Date().getTime()
    }, "", location.href);*/
    //location.href.split("dsideal_yy")[0] + "dsideal_yy/html/space/main/main.html?id="+person_id+"&identity_id"+identity_id
    window.onpopstate = function () {
        var currentState = window.history.state;
        //console.log(currentState);
        if(currentState && currentState.initObj){
            window[currentState.initObj].start();
        }else{
            window.location.reload();
        }
    };

});

function singlePageMethod(dom){
    $.getScript($(dom).attr("data-url"), function () {
        history.pushState({
            time: new Date().getTime(),
            initObj : $(dom).attr("data-method"),
            id:$(dom).attr("data-id"),
            iid: $(dom).attr("data-iid")
        }, "", location.href.split("dsideal_yy")[0] + "dsideal_yy" + $(dom).attr("data-path"));
        //history.pushState({initObj : $(dom).attr("data-method")}, '', "#");
        window[$(dom).attr("data-method")].start();
        $("#navul_space li").removeClass("active");
        $(dom).parent().addClass("active");
    });
}


function doLogout(){
	if(sso_flag == 0){
		doLogoutLocal();
	}else{
		doLogoutSso();
	}
}

//todo退出登录,退到哪里？上一级门户?
function doLogoutLocal(){
	$.ajax({
		type : "GET",
		async : false,
		url : url_path_action_login + "/login/doLogout",
		dataType: "json",
		success : function(data) {
            /*if(identity_id < 100) {
                top.location = url_path_html + personalLogoutAddr;
            }else{*/
                window.location.reload();
            /*}*/
		}
	});
}

//sso退出,退到哪里？上一级门户?
function doLogoutSso(){
	$.ajax({
		type : "GET",
		async : false,
		url : url_path_action_login + "/login/doLogout",
		dataType: "json",
		success : function(data) {
            window.location.href= ssoLogoutAddr + "?service=" + window.location.href;
		}
	});
}

function isEmpty(str){
	return typeof(str) == "undefined" || str == null || str.length == 0;
}

//返回顶部
function a(x,y){
	$('#tbox').css('right',(x) + 'px');
	$('#tbox').css('bottom',y + 'px');
}
function b(){
	h = $(window).height();
	t = $(document).scrollTop();
	if(t > h){
		$('#gotop').fadeIn('slow');
	}else{
		$('#gotop').fadeOut('slow');
	}
}

//解码
function base64Encode(oldStr){
	var newStr = Base64.decode(oldStr);
	return newStr;
}

//请求图片压缩地址
function getSpaceUserPhoto(fileid,msg){
	if(isEmpty(fileid) || fileid.indexOf("person.png")>0){
		return "../../../images/space/person.png";
	}
	var Material_path = fileid.substring(0,2);
	if(!!!msg){
		msg = "";
	}
	var img_url = STATIC_IMAGE_PRE + url_path_img + Material_path + "/" + fileid + msg;
	return img_url;
}

function getSpaceOrgPhoto(fileid,msg){
	if(isEmpty(fileid)){
		return "../../../images/space/school.png";
	}
	var Material_path = fileid.substring(0,2);
	if(!!!msg){
		msg = "";
	}
	var img_url = STATIC_IMAGE_PRE + url_path_img + Material_path + "/" + fileid + msg;
	return img_url;
}

//访问个人空间
function toUserSpaceUrl(person_id,identity_id){
	var newUrl = url_path_html + "/html/space/main/main.html?id=" + person_id + "&identity_id=" + identity_id;
	window.open(newUrl);
}
//访问机构空间
function toOrgSpaceUrl(person_id,identity_id){
	var newUrl = "";
	if(identity_id == 105){
		newUrl = url_path_html + "/html/space/main/class.html?orgid=" + person_id + "&iid=" + identity_id;
	}else if(identity_id == 106){
		newUrl = url_path_html + "/html/space/main/group.html?orgid=" + person_id + "&iid=" + identity_id;
	}else{
		newUrl = url_path_html + "/html/space/main/main_org.html?orgid=" + person_id + "&iid=" + identity_id;
	}
	window.open(newUrl);
}
//生成1开头的6位随机数
function creatRandomNum_space() {
	var random_num_space = 0;

    random_num_space += Math.floor(Math.random()*100000)+100000; 

    return random_num_space;
}
//ts值更新
function updataTs(){
    if(gzipFlag == 1) {
        $.ajax({
            type: "POST",
            async: false,
            data: {"random_num": creatRandomNum(),
                "person_id": person_id,
                "identity_id": identity_id
            },
            url: url_path_action_login + "/space/update_baktools/updatets",
            dataType: "json",
            success: function (data) {

            }
        });
    }
}
//ts值更新
function updataInteractionTs(){
    if(gzipFlag == 1) {
        $.ajax({
            type: "POST",
            async: false,
            data: {"random_num": creatRandomNum(),
                "person_id": person_id,
                "identity_id": identity_id
            },
            url: url_path_action_login + "/space/update_interaction/updatets",
            dataType: "json",
            success: function (data) {

            }
        });
    }
}
function loadScripts(urls, flag, callback) {

	if($("link[href='"+urls[flag]+"']").length > 0 || $("script[src='"+urls[flag]+"']").length > 0){
		if(urls.length  == flag + 1){
            var script = $("link[href='"+urls[flag]+"']")[0] || $("script[src='"+urls[flag]+"']")[0];
            if($(script).attr("loadType") == 1){
                callback();
            }else{
                if (script.readyState) { // IE
                    $(script).bind("readystatechange",function() {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            callback();
                        }
                    });
                } else { // Others: Firefox, Safari, Chrome, and Opera
                    $(script).bind("load",function(){
                        callback();
                    });
                }
            }
		}else{
			loadScripts(urls, flag + 1, callback);
		}
	}else{
		var script;
		if(urls[flag].indexOf(".css") > -1){
			script = document.createElement("link");
			script.type = "text/css";
			script.rel = "stylesheet";
			if(urls[flag].indexOf(".print.css") > -1){
				script.media = "print";
			}
		}else if(urls[flag].indexOf(".js") > -1){
			script = document.createElement("script");
			script.type = "text/javascript";
		}
		if (script.readyState) { // IE
			script.onreadystatechange = function() {
				if (script.readyState == "loaded" || script.readyState == "complete") {
                    $(script).attr("loadType",1);
					if(urls.length - 1 > flag){
						loadScripts(urls, flag + 1, callback);
					}else{
						callback();
					}
				}
			};
		} else { // Others: Firefox, Safari, Chrome, and Opera
			script.onload = function() {
                $(script).attr("loadType",1);
				if(urls.length - 1 > flag){
					loadScripts(urls, flag + 1, callback);
				}else{
					callback();
				}
			};
		}
		if(urls[flag].indexOf(".css") > -1){
			script.href = urls[flag];
		}else if(urls[flag].indexOf(".js") > -1){
			script.src = urls[flag];
		}
		
		document.body.appendChild(script);
        $(script).attr("loadType",0);
	}
} 

//右上角下拉菜单，教师显示省、市、区、校空间，学生显示校、班级空间
function toWhereMenu(){
	if(visit_to == 3){
		var html = "";
		if(orgSpaceFlag == 1){
			var org100 = "",org101 = "",org102 = "",org103 = "",org104 = "",org105 = "";
			$.ajax({
				type : "GET",
				async : false,
				data:{"random_num":creatRandomNum(),
					"person_id":$.cookie("person_id"),
					"identity_id":$.cookie("identity_id")
					},
				url : url_path_action_login + "/space/common/getSpaceMenu",
				dataType: "json",
				success : function(data) {
					if(data.success){
						for(var i = 0;i < data.org_list.length;i++){
							if(data.org_list[i].org_level == 100 && 100 >= defaultOrgIid){
								org100 += '<li><a href="../../space/main/main_org.html?orgid=' + data.org_list[i].org_id + '&iid=100" target=_blank>' + data.org_list[i].org_name + '</a></li>';
							}else if(data.org_list[i].org_level == 101 && 101 >= defaultOrgIid){
								org101 += '<li><a href="../../space/main/main_org.html?orgid=' + data.org_list[i].org_id + '&iid=101" target=_blank>' + data.org_list[i].org_name + (data.org_list[i].flag == 0?"教育局":"") + '</a></li>';
							}else if(data.org_list[i].org_level == 102 && 102 >= defaultOrgIid){
								org102 += '<li><a href="../../space/main/main_org.html?orgid=' + data.org_list[i].org_id + '&iid=102" target=_blank>' + data.org_list[i].org_name + (data.org_list[i].flag == 0?"教育局":"") + '</a></li>';
							}else if(data.org_list[i].org_level == 103 && 103 >= defaultOrgIid){
								org103 += '<li><a href="../../space/main/main_org.html?orgid=' + data.org_list[i].org_id + '&iid=103" target=_blank>' + data.org_list[i].org_name + (data.org_list[i].flag == 0?"教育局":"") + '</a></li>';
							}else if(data.org_list[i].org_level == 104 && 104 >= defaultOrgIid){
								org104 += '<li><a href="../../space/main/main_org.html?orgid=' + data.org_list[i].org_id + '&iid=104" target=_blank>' + data.org_list[i].org_name + '</a></li>';
							}else if(data.org_list[i].org_level == 105 && 105 >= defaultOrgIid){
								org105 += '<li><a href="../../space/main/class.html?orgid=' + data.org_list[i].org_id + '&iid=105" target=_blank>' + data.org_list[i].org_name + '</a></li>';
							}
						}
					}
				}
			});
			html += (org100.length == 0?"":org100 + "<li role='separator' class='divider'></li>")
					+ (org101.length == 0?"":org101 + "<li role='separator' class='divider'></li>")
					+ (org102.length == 0?"":org102 + "<li role='separator' class='divider'></li>")
					+ (org103.length == 0?"":org103 + "<li role='separator' class='divider'></li>")
					+ (org104.length == 0?"":org104 + "<li role='separator' class='divider'></li>")
					+ (org105.length == 0?"":org105 + "<li role='separator' class='divider'></li>");
		}
		//1.2.3所属群组
		/**
		$.ajax({
			type : "GET",
			async : false,
			data:{"random_num":creatRandomNum(),"person_id":$.cookie("person_id"),"identity_id":$.cookie("identity_id"),"type":1},
			url : url_path_action_login + "/group/queryMyGroupByPersonId",//所属群组
			dataType: "json",
			success : function(data) {
				if(data.success && data.success != "false"){
					for(var i = 0;i < data.groups.length;i++){
						html += '<li><a href="../../space/main/group.html?orgid=' + data.groups[i].groupId + '&iid=106" target=_blank >' + data.groups[i].groupName + '空间</a></li>';
					}
				}
			}
		});*/
		
		html += '<li><a href="../../space/main/main.html" target=_blank >我的空间</a></li>';
		html += "<li role='separator' class='divider'></li>";
        if($.cookie("ydrz") != 1) {
            html += '<li><a href="javascript:doLogout();">退出</a></li>';
        }
		$("#toWhereMenu").append(html);
	}
}

//添加模块菜单树初始化
function loadTopTreeNode(iid){
	var has_portlet = [];
	if(iid == "100" || iid == "101" || iid == "102" || iid == "103"){
		has_portlet = 
			[{
	        "常用工具":[
						{"id":"org_selfInfo","name":"空间简介","repetition":0},
						{"id":"org_news","name":"通知公告","repetition":0},
						{"id":"org_goodSchool","name":"优秀学校","repetition":0},
						{"id":"org_goodClass","name":"优秀班级","repetition":0},
						{"id":"org_goodTeacher","name":"优秀教师","repetition":0},
						{"id":"org_goodStudent","name":"优秀学生","repetition":0},
						{"id":"org_count","name":"空间统计","repetition":0},
						{"id":"messageBoard","name":"留言板","repetition":0},
						{"id":"myVisitor","name":"访客记录","repetition":0},
						{"id":"toplink","name":"快捷链接","repetition":1},
						{"id":"photos","name":"相册","repetition":1},
						{"id":"video","name":"视频与动画","repetition":1},
						{"id":"music","name":"音乐播放器","repetition":0},
						//{"id":"weather","name":"天气预报","repetition":0},
						{"id":"dictionary","name":"字典","repetition":0},
						{"id":"websearch","name":"网络搜索","repetition":0}
						//{"id":"teachingCount","name":"教研活动统计","repetition":0}
				     ]}
			 		 
			 ];
	}else if(iid == "104"){
		has_portlet = 
			[{
	        "常用工具":[
						{"id":"org_selfInfo","name":"学校简介","repetition":0},
						{"id":"org_news","name":"通知公告","repetition":0},
						{"id":"org_goodClass","name":"优秀班级","repetition":0},
						{"id":"org_goodTeacher","name":"优秀教师","repetition":0},
						{"id":"org_goodStudent","name":"优秀学生","repetition":0},
						{"id":"messageBoard","name":"留言板","repetition":0},
						{"id":"myVisitor","name":"访客记录","repetition":0},
						{"id":"toplink","name":"快捷链接","repetition":1},
						{"id":"photos","name":"相册","repetition":1},
						{"id":"video","name":"视频与动画","repetition":1},
						{"id":"music","name":"音乐播放器","repetition":0},
						//{"id":"weather","name":"天气预报","repetition":0},
						{"id":"dictionary","name":"字典","repetition":0},
						{"id":"websearch","name":"网络搜索","repetition":0}
				     ]}
			 		 
			 ];
	}else if(iid == "105"){
		has_portlet = 
			[{
			"学习工具":[
			        	{"id":"classHomework","name":"班级作业","repetition":0},
			        	{"id":"classWk","name":"班级微课","repetition":0}
			          ],
	        "常用工具":[
						{"id":"org_selfInfo","name":"班级简介","repetition":0},
						{"id":"org_news","name":"通知公告","repetition":0},
						{"id":"brotherClass","name":"兄弟班级","repetition":0},
						{"id":"classMember","name":"班级成员","repetition":0},
						{"id":"timetable","name":"课程表","repetition":0},
						{"id":"toplink","name":"快捷链接","repetition":1},
						{"id":"photos","name":"相册","repetition":1},
						{"id":"video","name":"视频与动画","repetition":1},
						{"id":"activeShare","name":"活动分享","repetition":0},
						{"id":"messageBoard","name":"留言板","repetition":0},
						{"id":"music","name":"音乐播放器","repetition":0},
						//{"id":"weather","name":"天气预报","repetition":0},
						{"id":"dictionary","name":"字典","repetition":0},
						{"id":"websearch","name":"网络搜索","repetition":0}
				     ]}
			 		 
			 ];
	}else if(iid == "106"){
		has_portlet = 
			[{
	        "常用工具":[
						{"id":"org_selfInfo","name":"群组简介","repetition":0},
						{"id":"org_news","name":"通知公告","repetition":0},
						{"id":"groupMember","name":"群组成员","repetition":0},
						{"id":"toplink","name":"快捷链接","repetition":1},
						{"id":"photos","name":"相册","repetition":1},
						{"id":"video","name":"视频与动画","repetition":1},
						{"id":"messageBoard","name":"留言板","repetition":0},
						{"id":"myVisitor","name":"访客记录","repetition":0},
						{"id":"music","name":"音乐播放器","repetition":0},
						//{"id":"weather","name":"天气预报","repetition":0},
						{"id":"dictionary","name":"字典","repetition":0},
						{"id":"websearch","name":"网络搜索","repetition":0}
				     ]}
			 		 
			 ];
	}else if(iid == "107"){
		has_portlet =
            [{
            	"常用工具":[
                        {"id":"org_selfInfo","name":"工作室简介","repetition":0},
                        {"id":"org_news","name":"通知公告","repetition":0},
                        {"id":"groupMember","name":"工作室成员","repetition":0},
                        {"id":"toplink","name":"快捷链接","repetition":1},
                        {"id":"photos","name":"相册","repetition":1},
                        {"id":"video","name":"视频与动画","repetition":1},
                        {"id":"messageBoard","name":"留言板","repetition":0},
                        {"id":"myVisitor","name":"访客记录","repetition":0},
                        {"id":"music","name":"音乐播放器","repetition":0},
                        //{"id":"weather","name":"天气预报","repetition":0},
                        {"id":"dictionary","name":"字典","repetition":0},
                        {"id":"websearch","name":"网络搜索","repetition":0}
				     ]}
			 		 
			 ];
    }
	return has_portlet;
}

//初始化局、校、班、群组、个人空间模块
function initAllLayout(type){

    var set_layout_info = {};
    if(type == 1){
        if(identity_id == 5){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["person_selfInfo","photos"],
                            ["beikeHouse","my_resource_info","myBlogArticle","myFriends","messageBoard"],
                            ["newOrgBlogArticle","hotOrgBlogArticle","myVisitor"]
                        ]}]};
        }else if(identity_id == 6){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["person_selfInfo","timetable"],
                            ["studyHouse","homework","myBlogArticle","messageBoard"],
                            ["newOrgBlogArticle","hotOrgBlogArticle","myFriends","myVisitor"]
                        ]}]};
        }else if(identity_id == 7){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["person_selfInfo","timetable"],
                            ["homework_par","photos","messageBoard"],
                            ["myFriends","myVisitor"]
                        ]}]};
        }
    }else{
        if(orgidentity_id == "100"){
            set_layout_info = {"nowLayout":1,layouts : [
                {"layout":"1","portlets":[
                    [],
                    [],
                    []
                ]}]};
        }else if(orgidentity_id == "101" || orgidentity_id == "102" || orgidentity_id == "103"){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["org_count","org_news"],
                            ["newOrgBlogArticle","hotOrgBlogArticle"],
                            ["org_goodTeacher","org_goodStudent"]
                        ]}]};
        }else if(orgidentity_id == "104"){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["org_selfInfo","org_news"],
                            ["newOrgBlogArticle","hotOrgBlogArticle"],
                            ["org_goodTeacher","org_goodStudent"]
                        ]}]};
        }else if(orgidentity_id == "105"){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["org_selfInfo","org_news","timetable"],
                            ["photos","messageBoard"],
                            ["classMember","brotherClass"]
                        ]}]};
        }else if(orgidentity_id == "106"){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["org_selfInfo","org_news"],
                            ["photos","messageBoard"],
                            ["groupMember"]
                        ]}]};
        }else if(orgidentity_id == "107"){
            set_layout_info = {"nowLayout":1,layouts : [
                    {"layout":"1","portlets":[
                            ["org_selfInfo","org_news"],
                            ["photos","messageBoard"],
                            ["groupMember"]
                        ]}]};
        }
    }

    var layout_ = set_layout_info.nowLayout;
    All_Layout_.nowLayout = layout_;
    $(set_layout_info.layouts[0].portlets).each(function(i){
        var that_ = this;
        //console.log(that_);
        $(that_).each(function(){
            //console.log(this+"");
            var thisInfo= this;
            $.ajaxSettings.async = false;
            $.get("../../../js/space/portlets/"+thisInfo+"_main.js",function(){
                //console.log(thisInfo);
                var init = window[thisInfo + "_initInfo"]();
                var re_postfix = creatRandomNum_space();
                var info = init[thisInfo + '_initinfo'];
                var setting = init[thisInfo + '_initset'];
                info.re_postfix = re_postfix;
                All_Layout_.layouts[layout_-1].portlets[i].push(info);
                All_Layout_.ALL_Setting[thisInfo+re_postfix] = setting;
            });
            $.ajaxSettings.async = true;
        });

    });




}


/*
 * 显示全部好友申请
 * 黄记纲
 * 2015/04/02
 * */
function openAllshenqing(){
	
	art.dialog(
			{
				content:$('#getAllshenqingMsgDiv').html(),
				width: 400,
				height: 400,
				lock:true,
				icon: null,
				title: '好友申请信息',
				//style:'succeed noClose',
				close:function(){
					$("#getAllshenqingMsg").html("");
					perMsg_check_updata = true;
					getFriendsMsg();
				},
				init:function(){
					perMsg_check_updata = false;
					getAllFriendsMsg();
				}
			}
			
	);
}
function getAllFriendsMsg(){
    ["getFriendNotices_inner"].loadTemplates("../../../html/space/tpl/common/",function(){
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "person_id":$.cookie("person_id"),
                "identity_id":$.cookie("identity_id")
            },
            url : url_path_action + "/friend/getApplyFriend",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['applys'] = data.applys;
                    innerHTML['type'] = 2;

                    var html = template('getFriendNotices_inner', innerHTML);
                    $("#getAllshenqingMsg").html(html);
                }else{
                    art.dialog.alert(data.info);
                }
            },
            error : function(){
                art.dialog.alert("请求异常！");
            }
        });
    });

}
//是否刷新数据
var perMsg_check_updata = true;
/*
 * 接受或拒绝好友申请
 * 黄记纲
 * 2015/04/02
 */
function dealwithApplyFriend(d,id,person_id,identity_id){
	if(d==1){
		
		art.dialog(
			    {
			        content:"<div id='addFriendDialog'>" +
			        		"<div class='addFriendDialog_t'>"+
								"<div class='l'>"+
									"<img src='' />"+
								"</div>"+
								"<div class='r'>"+
									"<div class='t textEllipsis' title=''></div>"+
									"<div class='c textEllipsis' title=''></div>"+
								"</div>"+
							"</div>" +
							"<div class='addFriendDialog_b'><div class='form-group' style=''><label for='addFriendDialog_fz'>分组：</label>" +
							"<select class='form-control' id='addFriendDialog_fz'></select><button style='width:80px;' type='button' class='btn btn-link' onclick='addGroup_addfriend();'>新建分组</button>" +
							"</div>"+
							"</div>"+
			        	"</div>",
			        width: 350,
			        height: 200,
			        lock:true,
			        icon: null,
			        title: '添加好友',
			        //style:'succeed noClose',
			        init:function(){
			        	
			        	$.ajax({
			        		type : "GET",
			        		async : false,
			        		data:{"random_num":creatRandomNum(),
			        			"person_id":person_id,
			        			"identity_id":identity_id},
			        		url : url_path_action_login + "/person/getPersonInfo",
			        		dataType: "json",
			        		success : function(data) {
			        			if(data.success){
			        				$("#addFriendDialog .r .t").html(data.table_List.person_name).attr("title",data.table_List.person_name);
			        				$("#addFriendDialog .r .c").html(data.table_List.school_name).attr("title",data.table_List.school_name);
			        			}else{
			        				art.dialog.alert(data.info);
			        			}
			        		},
			        		error : function(){
			        			
			        		}
			        	});
			        	
			        	$.ajax({
			        		type : "GET",
			        		async : false,
			        		data:{"random_num":creatRandomNum(),
			        			"a_id":person_id,
			        			"a_identity_id":identity_id,
			        			"a_type":"personbaseinfo"},
			        		url : url_path_action_login + "/space/getAJson",
			        		dataType: "json",
			        		success : function(data) {
			        			var img_url;
			        			if(data.success){
			        				if(data.a_json.space_avatar_fileid){
			        					var Material_path = data.a_json.space_avatar_fileid.substring(0,2);
			        					img_url = STATIC_IMAGE_PRE + url_path_img + Material_path + "/" + data.a_json.space_avatar_fileid + "@95w_95h_100Q_1x.png";
			        				}else{
			        					img_url = "../../../images/space/person.png";
			        				}
			        			}else{
			        				img_url = "../../../images/space/person.png";
			        			}
			        			$("#addFriendDialog .l img").attr("src",img_url);
			        		},
			        		error : function(){
			        			$("#addFriendDialog .l img").attr("src","../../../images/space/person.png");
			        		}
			        	});
			        	
			        	$.ajax({
			        		type : "GET",
			        		async : false,
			        		data:{"random_num":creatRandomNum(),
			        			"person_id":$.cookie("person_id"),
			        			"identity_id":$.cookie("identity_id")},
			        		url : url_path_action + "/friend/getGroups",
			        		dataType: "json",
			        		success : function(data) {
			        			if(data.success){
			        				for(var i=0;i<data.groups.length;i++){
			        					$("#addFriendDialog_fz").append("<option value='"+data.groups[i].group_id+"'>"+data.groups[i].group_name+"</option>");
			        				}
			        			}else{
			        				art.dialog.alert(data.info);
			        			}
			        		},
			        		error : function(){
			        			
			        		}
			        	});
			        },
			        close:function(){
			        	
			        }
			    },
			function(){
			    	$.ajax({
						type : "GET",
						async : false,
						data:{"random_num":creatRandomNum(),
							"apply_id":id,
							"deal_flag":d,
			    			"group_id":$("#addFriendDialog_fz").val()
							},
						url : url_path_action + "/friend/dealwithApplyFriend",
						dataType: "json",
						success : function(data) {
							if(data.success){
								art.dialog.alert(d==1?"已成功添加好友":"已拒绝好友请求！");
							}else{
								art.dialog.alert(data.info);
							}
							if(perMsg_check_updata){
								getFriendsMsg();
							}else{
								getAllFriendsMsg();
							}
						},
						error : function(){
							
						}
					});
			},
			function(){
				
			}
		);
	}else{
		$.ajax({
			type : "GET",
			async : false,
			data:{"random_num":creatRandomNum(),
				"apply_id":id,
				"deal_flag":d
				},
			url : url_path_action + "/friend/dealwithApplyFriend",
			dataType: "json",
			success : function(data) {
				if(data.success){
					art.dialog.alert(d==1?"已成功添加好友":"已拒绝好友请求！");
				}else{
					art.dialog.alert(data.info);
				}
				if(perMsg_check_updata){
					getFriendsMsg();
				}else{
					getAllFriendsMsg();
				}
			},
			error : function(){
				
			}
		});
	}
}
/*
 * 添加好友时添加分组
 * 黄记纲
 * 2015/04/01
 */
function addGroup_addfriend(){
	
	//var html="";
	
	art.dialog(
			{
				content:"<div id='addGroup'><input type='text' class='form-control' id='addGroupName' placeholder='请输入分组名称'/></div>",
				width: 300,
				height: 100,
				lock:true,
				icon: null,
				title: '添加分组',
				//style:'succeed noClose',
				close:function(){
					$("#addGroup input").val("");
				}
			},
			function(){
				
				var che_ = $.trim($("#addGroup input").val());
				var title_char_num = 0;
				for (var i = 0; i < che_.length; i++) { 
					if (che_[i].match(/[^\x00-\xff]/ig) != null) 
						title_char_num += 2; 
					else 
						title_char_num += 1; 
				}
				if(title_char_num==0 || title_char_num > 10){
					art.dialog.alert("请输入1-10个字符*1汉字=2字符！");
					return false;
				}
				$.ajax({
					type : "GET",
					async : false,
					data:{"random_num":creatRandomNum(),
						"person_id":$.cookie("person_id"),
						"identity_id":$.cookie("identity_id"),
						"sequence":$("#addFriendDialog_fz option").length+1,
						"group_name":che_
					},
					url : url_path_action + "/friend/addGroup",
					dataType: "json",
					success : function(data) {
						if(data.success){
							$("#addFriendDialog_fz").append("<option value='"+data.group_id+"' selected='selected'>"+data.group_name+"</option>");
							dialogClose("操作成功",1,200,'');
						}else{
							art.dialog.alert(data.info);
						}
					},
					error : function(){
						
					}
				});
				
				
			},
			function(){
				
			}
			
	);
	
}

//获取好友申请消息
function getFriendsMsg(){
    ["getFriendNotices_inner"].loadTemplates("../../../html/space/tpl/common/",function(){
        $.ajax({
            type : "GET",
            async : true,
            data:{"random_num":creatRandomNum(),
                "person_id":$.cookie("person_id"),
                "identity_id":$.cookie("identity_id")
            },
            url : url_path_action + "/friend/getApplyFriend",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['applys'] = data.applys;
                    innerHTML['type'] = 1;
                    $("#message_num").text(data.applys.length);
                    var html = template('getFriendNotices_inner', innerHTML);
                    $("#getFriendNotices").html(html);
                }else{
                    art.dialog.alert(data.info);
                }
            },
            error : function(){
                art.dialog.alert("请求异常！");
            }
        });
    });

}

//选择下载方式
function showDownload(info_id,resource_id_int,resource_title,resource_format,down_path,app_down_path,type,bk_type){
    resource_title = Base64.encode(resource_title);
    var bk_="";
    if(type == 2){
        bk_= "&bk_type="+ bk_type;
    }
    tb_show("文件下载",url_path_html + "/html/ypt/common/download.html?resource_title="+resource_title+"&resource_format="+resource_format+
        "&app_down_path="+app_down_path+"&type="+ type + bk_ +"&resource_id_int="+ resource_id_int +
        "&id="+ info_id + "&down_path="+ down_path +"&TB_iframe=true&height=120&width=450","thickbox");
}
/**
 * 积分处理
 * business_type,relatived_id,r_person_id,r_identity_id,operation_content,e_relatived_id
 */
function creditWriteToQueue(options){
    if(creditFlag == 0){
        return false;
    }
    var person_id = "";
    var identity_id = "";
    if($.cookie("person_id")){
        person_id = $.cookie("person_id");
        identity_id = $.cookie("identity_id")
    }else{
        return false;
    }

    var defaultSetting = {
        person_id:person_id,
        identity_id:identity_id,
        platform_type:1,
        ip_addr:"",
        operation_system:"",
        browser:"",
        business_type:"",
        relatived_id:"",
        e_relatived_id:"",
        r_person_id:"",
        r_identity_id:"",
        r_province_id:"",
        r_city_id:"",
        r_district_id:"",
        r_school_id:"",
        r_class_id:"",
        operation_content:""
    };

    if(!!!options.business_type){
        options = {
            business_type:arguments[0],
            relatived_id:arguments[1],
            r_person_id:arguments[2],
            r_identity_id:arguments[3],
            operation_content:arguments[4],
            e_relatived_id:arguments[5]
        };
    }

    $.extend(defaultSetting, options);
    if($.cookie("person_id") == options.r_person_id){
        return false;
    }
    $.ajax({
        type : "POST",
        async : true,
        data:{"random_num":creatRandomNum(),
            person_id:defaultSetting.person_id,
            identity_id:defaultSetting.identity_id,
            platform_type:defaultSetting.platform_type,
            ip_addr:defaultSetting.ip_addr,
            operation_system:defaultSetting.operation_system,
            browser:defaultSetting.browser,
            business_type:defaultSetting.business_type,
            relatived_id:defaultSetting.relatived_id,
            e_relatived_id:defaultSetting.e_relatived_id,
            r_person_id:defaultSetting.r_person_id,
            r_identity_id:defaultSetting.r_identity_id,
            r_province_id:defaultSetting.r_province_id,
            r_city_id:defaultSetting.r_city_id,
            r_district_id:defaultSetting.r_district_id,
            r_school_id:defaultSetting.r_school_id,
            r_class_id:defaultSetting.r_class_id,
            operation_content:defaultSetting.operation_content
        },
        url : url_path_action_login + "/credit/writeToQueue",
        dataType: "json",
        success : function(data) {

        },
        error : function(){

        }
    });
}
/*加载定位*/
function showPortletLocation(){
    ["portletLocationInner"].loadTemplates("../../../html/space/tpl/common/",function(){
        var allInfo = {};
        allInfo['portlets'] = data_portlet.portlets;
        allInfo['setting'] = ALL_Setting;
        allInfo['base64Decode'] = base64Encode;

        var html = template('portletLocationInner', allInfo);
        $("#main").append(html);
    });

}
/*定位操作*/
function portletLocationGoTo(id){
    var top = $("#"+id).position().top;
    window.scrollTo(0,top-200);
    //$("#"+id).slideUp("normal",function(){}).slideDown("normal",function(){});
    $("#"+id).animate({opacity: 0.2}, "normal").animate({opacity: 1}, "normal");
}

function html_decode(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br\/>/g, "\n");
    return s;
}

function checkIsSpaceImg(url,msg){
    var test = /([a-z0-9A-Z]){8}-([a-z0-9A-Z]){4}-([a-z0-9A-Z]){4}-([a-z0-9A-Z]){4}-([a-z0-9A-Z]){12}.([a-zA-Z])+/;
    var re = new RegExp(test);
    if(re.test(url)){
        if(!!!msg){msg="";}
        url = url.match(test)[0];
        return STATIC_IMAGE_PRE + url_path_img + url.substring(0,2) + "/" + url + msg;
    }else{
        return url;
    }
}

//清除空格
function trimStr(oldStr) {
    return $.trim(oldStr);
}

//截取字符串 取前d个字符串
//d -->
function subStr(oldStr, d) {
    return oldStr.substr(0, d);
}
//消息展示

function getSpaceDictionaryMessage(data){
    var html_ = "";
    switch (data.business_type)
    {
        case "113":
            html_+= "<div><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>申请添加您为好友。</div><p class='text-center'>";
            if(data.deal_status == 0){
                html_ += "<input type='button' value='同意' class='bg1 applyFriendBtn' apply_type='1' data-id='"+data.id+"' apply_id='"+data.relatived_id+"' p_name='"+data.person_name+"' person_id='"+data.person_id+"' identity_id='"+data.identity_id+"'/>&nbsp;" +
                    "<input type='button' value='拒绝' class='bg2 applyFriendBtn' apply_type='2' data-id='"+data.id+"' apply_id='"+data.relatived_id+"' p_name='"+data.person_name+"' person_id='"+data.person_id+"' identity_id='"+data.identity_id+"'/>";
            }else{
                html_ += "消息已处理";
            }
            html_+= "</p><p>"+ data.create_time +"</p>";
            break;
        case "114":
            html_= "<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>同意了您的好友申请。</span><p>"+ data.create_time +"</p>";
            break;
        case "115":
            html_= "<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>拒绝了您的好友申请。</span><p>"+ data.create_time +"</p>";
            break;
        case "116":
            html_= "<div><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>申请加入群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a>。</div><p>";
            /*if(data.deal_status == 0){
                html_ += "<input type='button' value='同意' class='bg1 ' />&nbsp;" +
                    "<input type='button' value='拒绝' class='bg2 ' />";
            }else{
                html_ += "消息已处理";
            }*/
            html_+= "</p><p>"+ data.create_time +"</p>";
            break;
        case "117":
            html_= "<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>同意您加入群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a>。</span><p>"+ data.create_time +"</p>";
            break;
        case "118":
            html_= "<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>拒绝您加入群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a>。</span><p>"+ data.create_time +"</p>";
            break;
        case "119":
            html_= "<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>已将您加入群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a>。</span><p>"+ data.create_time +"</p>";
            break;
        case "120":
            html_= "<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>已将您移除群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a>。</span><p>"+ data.create_time +"</p>";
            break;
        case "121":
            html_="<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>已将您设置为群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a> 的管理员。</span><p>"+ data.create_time +"</p>";
            break;
        case "122":
            html_="<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>已将您取消了群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a> 的管理员。</span><p>"+ data.create_time +"</p>";
            break;
        case "123":
            html_="<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>已将群组："+data.relative.group_name+" 解散。</span><p>"+ data.create_time +"</p>";
            break;
        case "124":
            html_="<span><a href='/dsideal_yy/html/space/main/main.html?id="+data.person_id+"&identity_id="+data.identity_id+"' target='_blank'>" + data.person_name + "</a>已经退出了群组：<a href='/dsideal_yy/html/space/main/group.html?orgid="+data.relative.group_id+"&iid=106' target='_blank'>"+data.relative.group_name+"</a>。</span><p>"+ data.create_time +"</p>";
            break;
    }
    return html_;
}

function spaceNavConfig(){
    return {
        iid5:[
            {
                crm_id:"",
                file_name:"main",
                url:"/html/space/main/main.html",
                name:"首页",
                login:false,
                extend_info:"",
                method:"SpaceMain",
                method_url:'../../../js/space/main/person_common.js',
                list:[]
            },{
                crm_id:"kj_bk",
                file_name:"main_prepare",
                url:"/html/ypt/prepare/main_prepare.html",
                name:"备课",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_zy",
                file_name:"main_res",
                url:"/html/ypt/main/main.html",
                name:"资源",
                login:true,
                extend_info:"&system_id=1",
                list:[]
            },{
                crm_id:"kj_dx",
                file_name:"learn_task_list",
                url:"/html/yxx_new/learn_task_space/learn_task_list.html",
                name:"导学",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_zye",
                file_name:"homework_list",
                url:"/html/yxx_new/homework_space/homework_list.html",
                name:"作业",
                login:true,
                extend_info:"",
                list:[{
                    url:"/html/yxx_new/tea_htzy_space/main_tea_htzy.html",
                    name:"话题作业",
                    extend_info:""
                }]
            },{
                crm_id:"kj_cy",
                file_name:"exercise_list",
                url:"/html/yxx_new/tea_exercise/exercise_list.html",
                name:"测验",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_tb",
                file_name:"wrong_q",
                url:"/html/yxx_new/wrong_question_space/wrong_q.html",
                name:"题本",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_bg",
                file_name:"office_main",
                url:"/html/office/main/office_main.html",
                name:"办公",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_wz",
                file_name:"main_blog",
                url:"/html/space/main/main_blog.html",
                name:"文章",
                login:false,
                method:"Blog",
                method_url:'../../../js/space/main/main_blog.js',
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_xc",
                file_name:"main_gallery",
                url:"/html/space/main/main_gallery.html",
                name:"相册",
                login:false,
                method:"Gallery",
                method_url:'../../../js/space/main/main_gallery.js',
                extend_info:"",
                list:[{
                    url:"/html/space/main/main_video.html",
                    name:"视频",
                    method:"Video",
                    method_url:'../../../js/space/main/main_video.js',
                    extend_info:""
                }]
            },{
                crm_id:"kj_txl",
                file_name:"main_friends",
                url:"/html/space/main/main_friends.html",
                name:"通讯录",
                login:false,
                method:"Friends",
                method_url:'../../../js/space/main/main_friends.js',
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_dt",
                file_name:"main_feed",
                url:"/html/space/main/main_feed.html",
                name:"动态",
                login:true,
                method:"Feed",
                method_url:'../../../js/space/main/main_feed.js',
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_wjdc",
                file_name:"main_survey",
                url:"/html/space/psec/main_survey.html",
                name:"问卷调查",
                login:true,
                extend_info:"",
                list:[]
            }
            /*,{
                crm_id:"kj_yjhkt",
                file_name:"main_classroom_assessment",
                url:"/html/space/psec/main_classroom_assessment.html",
                name:"一句话课堂",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_scj",
                file_name:"main_collection",
                url:"/html/space/psec/main_collection.html",
                name:"收藏夹",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_yy",
                file_name:"main_application",
                url:"/html/space/psec/main_application.html",
                name:"应用",
                login:true,
                extend_info:"",
                list:[]
            }*/
        ],
        iid6:[
            {
                crm_id:"",
                file_name:"main",
                url:"/html/space/main/main.html",
                name:"首页",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_dx",
                file_name:"main_stu_daoxue",
                url:"/html/yxx_new/stu_learn_task_space/main_stu_daoxue.html",
                name:"导学",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_zye",
                file_name:"main_stu_zuoye",
                url:"/html/yxx_new/stu_homework_space/main_stu_zuoye.html",
                name:"作业",
                login:true,
                extend_info:"&zy_type=1",
                list:[{
                    url:"/html/yxx_new/stu_htzy_space/main_stu_htzy.html",
                    name:"话题作业",
                    extend_info:""
                }]
            },{
                crm_id:"kj_lx",
                file_name:"exercise_list",
                url:"/html/yxx_new/stu_exercise/exercise_list.html",
                name:"练习",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_cy",
                file_name:"main_stu_zuoye1",
                url:"/html/yxx_new/stu_homework_space/main_stu_zuoye1.html",
                name:"测验",
                login:true,
                extend_info:"&zy_type=4",
                list:[]
            },{
                crm_id:"kj_tb",
                file_name:"main_stu_tiben",
                url:"/html/yxx_new/stu_tiben_space/main_stu_tiben.html",
                name:"题本",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_wz",
                file_name:"main_blog",
                url:"/html/space/main/main_blog.html",
                name:"文章",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_xc",
                file_name:"main_gallery",
                url:"/html/space/main/main_gallery.html",
                name:"相册",
                login:false,
                extend_info:"",
                list:[{
                    url:"/html/space/main/main_video.html",
                    name:"视频",
                    method:"Video",
                    method_url:'../../../js/space/main/main_video.js',
                    extend_info:""
                }]
            },{
                crm_id:"kj_txl",
                file_name:"main_friends",
                url:"/html/space/main/main_friends.html",
                name:"通讯录",
                login:false,
                method:"Friends",
                method_url:'../../../js/space/main/main_friends.js',
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_dt",
                file_name:"main_feed",
                url:"/html/space/main/main_feed.html",
                name:"动态",
                login:true,
                method:"Feed",
                method_url:'../../../js/space/main/main_feed.js',
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_yjhkt",
                file_name:"main_classroom_assessment",
                url:"/html/space/psec/main_classroom_assessment.html",
                name:"一句话课堂",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_czda",
                file_name:"main_track_record",
                url:"/html/space/psec/main_track_record.html",
                name:"成长档案",
                login:true,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_wjdc",
                file_name:"main_survey",
                url:"/html/space/psec/main_survey.html",
                name:"问卷调查",
                login:true,
                extend_info:"",
                list:[]
            }
        ],
        iid7:[
            {
                crm_id:"",
                file_name:"main",
                url:"/html/space/main/main.html",
                name:"首页",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_wz",
                file_name:"main_blog",
                url:"/html/space/main/main_blog.html",
                name:"文章",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_xc",
                file_name:"main_gallery",
                url:"/html/space/main/main_gallery.html",
                name:"相册",
                login:false,
                extend_info:"",
                list:[{
                    url:"/html/space/main/main_video.html",
                    name:"视频",
                    method:"Video",
                    method_url:'../../../js/space/main/main_video.js',
                    extend_info:""
                }]
            },{
                crm_id:"kj_txl",
                file_name:"main_friends",
                url:"/html/space/main/main_friends.html",
                name:"通讯录",
                login:false,
                method:"Friends",
                method_url:'../../../js/space/main/main_friends.js',
                extend_info:"",
                list:[]
            },{
                crm_id:"kj_wjdc",
                file_name:"main_survey",
                url:"/html/space/psec/main_survey.html",
                name:"问卷调查",
                login:true,
                extend_info:"",
                list:[]
            }
        ],iid105:[
            {
                crm_id:"",
                file_name:"class",
                url:"/html/space/main/class.html",
                name:"首页",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"class_blog",
                url:"/html/space/main/class_blog.html",
                name:"文章",
                login:true,
                extend_info:"&zy_type=1",
                list:[]
            },{
                crm_id:"",
                file_name:"class_gallery",
                url:"/html/space/main/class_gallery.html",
                name:"相册",
                login:true,
                extend_info:"",
                list:[{
                    url:"/html/space/main/class_video.html",
                    name:"视频",
                    extend_info:""
                }]
            },{
                crm_id:"",
                file_name:"main_feed",
                url:"/html/space/main/main_feed.html",
                name:"班级动态",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"class_notice",
                url:"/html/space/osec/class_notice.html",
                name:"班级公告",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"class_news",
                url:"/html/space/osec/class_news.html",
                name:"班级资讯",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"class_mien",
                url:"/html/space/osec/class_mien.html",
                name:"班级风采",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"class_track_record",
                url:"/html/space/osec/class_track_record.html",
                name:"成长档案",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"class_member",
                url:"/html/space/osec/class_member.html",
                name:"班级成员",
                login:false,
                extend_info:"",
                list:[]
            }
        ],
        iid106:[
            {
                crm_id:"",
                file_name:"group",
                url:"/html/space/main/group.html",
                name:"首页",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_res",
                url:"/html/space/main/group_res.html",
                name:"资源",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_blog",
                url:"/html/space/main/group_blog.html",
                name:"文章",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_gallery",
                url:"/html/space/main/group_gallery.html",
                name:"相册",
                login:false,
                extend_info:"",
                list:[{
                    url:"/html/space/main/group_video.html",
                    name:"视频",
                    extend_info:""
                }]
            },{
                crm_id:"",
                file_name:"main_feed",
                url:"/html/space/main/main_feed.html",
                name:"动态",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_news",
                url:"/html/space/osec/group_news.html",
                name:"资讯",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_member",
                url:"/html/space/main/group_member.html",
                name:"基本信息",
                login:false,
                extend_info:"",
                list:[]
            }
        ],
        iid107:[
            {
                crm_id:"",
                file_name:"group",
                url:"/html/space/main/group.html",
                name:"首页",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_jynews",
                url:"/html/space/main/group_jynews.html",
                name:"资讯",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_jyarticle",
                url:"/html/space/main/group_jyarticle.html",
                name:"文章",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_gallery",
                url:"/html/space/main/group_gallery.html",
                name:"相册",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_jyVideo",
                url:"/html/space/main/group_jyVideo.html",
                name:"视频",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_huodong",
                url:"/html/space/main/group_huodong.html",
                name:"活动",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_weike",
                url:"/html/space/main/group_weike.html",
                name:"磨课",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_jyres",
                url:"/html/space/main/group_jyres.html",
                name:"资源",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_jytl",
                url:"/html/space/main/group_jytl.html",
                name:"讨论",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_member",
                url:"/html/space/main/group_member.html",
                name:"基本信息",
                login:false,
                extend_info:"",
                list:[]
            },{
                crm_id:"",
                file_name:"group_yx_score_sort",
                url:"/html/space/main/group_yx_score_sort.html",
                name:"积分排名",
                login:false,
                extend_info:"",
                list:[]
            }
        ]
    };
}
/**
 * 显示全部
 * 参数：type（1--资源 2--试卷 4--备课 5--微课 6--云盘 7--作业）;deal_type（功能：1--显示全部 2--上传）
 * 2014-12-16
 * 姜莹莹
 */
function showYpt(type, deal_type) {
    if (type == 1) {
        $.cookie("res_yunormy", 2, {path: "/"});
        $.cookie("menu_value_cookie", 1, {path: "/"});
    } else if (type == 2) {
        $.cookie("juan_yunormy", 2, {path: "/"});
        $.cookie("menu_value_cookie", 2, {path: "/"});
    } else if (type == 4) {
        $.cookie("bk_yunormy", 2, {path: "/"});
        $.cookie("menu_value_cookie", 10, {path: "/"});
    } else if (type == 5) {
        $.cookie("wk_yunormy", 2, {path: "/"});
        $.cookie("menu_value_cookie", 12, {path: "/"});
    } else if (type == 6) {
        $.cookie("menu_value_cookie", 11, {path: "/"});
    } else if (type == 7) {
        $.cookie("menu_value_cookie", 13, {path: "/"});
    }
    window.open("../../ypt/main/main.html");
    //开平
    /**var t = "../../ypt/main/main.html";
     if(type == 1){
    	t = "../../ypt/main/main.html?system_id=14&&module=1";
    }else if(type == 2){
    	t = "../../ypt/main/main.html?system_id=14&&module=3";
    }else if(type == 4){
    	t = "../../ypt/main/main.html?system_id=14&&module=4";
    }else if(type == 5){
    	t = "../../ypt/main/main.html?system_id=14&&module=5";
    }else if(type == 6){
        $.cookie("menu_value_cookie",11,{path:"/"});
    }else if(type == 7){
        $.cookie("menu_value_cookie",13,{path:"/"});
    }
     window.open(t);*/
}

function showYpt_Stu(type) {
    window.open("../../yxx/main/main.html?system_id=" + type);
}