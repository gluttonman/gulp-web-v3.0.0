var data_portlet ={};
//maindiv的上左定位信息
var portlets_div_top = 0;
var portlets_div_left = 0;
//对齐网格的大小
var gridN = 5;
//head 高度
var head_height = 35;
var main_width = 1200;
//列表行高
var row_height = 37;

//非自由布局下，正在移动模块
var layout0_ismove = false;

//那个div触发了改变高度的事件
var change_height_div = null;

//布局信息临时存放
var All_Theme_ = {};
var All_Layout_ = {};
var ALL_Position = {};
var ALL_Setting = {};
//机构基本信息
var org_info_ = {};
var add_move_mouse = false;
var move_to_add_portlet = false;
var move_to_add_portlet_info;

var stopbubble = false;
//匿名访问==1/访问他人==2/自己空间==3
var visit_to = 1;
//公有页面0or私有页面1
var openPage = 1;
var org_id = 0;//群组id
var orgidentity_id = 0;//群组类型 106
var group_data = null;//群组信息
//人员信息
var person_id = 0;
var identity_id = 0;

//当前登录人是否本机构管理，0不是，1是
var is_admin = 0;
var is_super = 0;
var is_member = 0;
var is_exist = 0;
var is_login = 0;
//个人基本信息
var person_info_ = {};
//flash准备状态
var dataReady = false;
//是否处于空间模块编辑
var is_spaceportletEdit = true;
//当前是首页还是二级页    0-首页   1-二级页
var isSecOrMain = 0;

$(function(){
    org_id = GetQueryString("orgid");
    orgidentity_id = GetQueryString("iid");
    var team_exist = isOrgAdmin();
    if(!team_exist){
    	art.dialog.alert("指定ID的群组不存在");
    	return;
    }
    getIsMember();
    //确定访问哪个机构
    //1.登录状态
    if($.cookie("person_id") && $.cookie("identity_id")){
    	is_login = 1;
        if(!!org_id && !!orgidentity_id){
            //判断是否本机构管理员
            //1.2 orgid和orgidentity_id无值，则赋值，教师默认访问区，学生默认访问班级空间
        }else{
            org_id = defaultOrgId;
            orgidentity_id = defaultOrgIid;
        }
        if(orgidentity_id != 105 && orgidentity_id != 106) {
            $.ajax({
                type: "GET",
                async: false,
                data: {
                    "random_num": creatRandomNum(),
                    "person_id": $.cookie("person_id"),
                    "identity_id": $.cookie("identity_id")
                },
                //url : url_path_action_login + "/space/getSpacePersonInfo",
                url: url_path_action_login + "/person/getPersonInfo",
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        person_info_['sheng_id'] = data.table_List.province_id;
                        person_info_['sheng_name'] = data.table_List.province_name;
                        person_info_['shi_id'] = data.table_List.city_id;
                        person_info_['shi_name'] = data.table_List.city_name;
                        person_info_['qu_id'] = data.table_List.district_id;
                        person_info_['qu_name'] = data.table_List.district_name;
                        if (data.table_List.bureau_type == 2) {
                            person_info_['xiao_id'] = data.table_List.bureau_id;
                            person_info_['xiao_name'] = data.table_List.bureau_name;
                        }
                        personlogin_name = data.table_List.login_name;
                        person_name = data.table_List.person_name;
                        if ($.cookie("identity_id") == 6 || $.cookie("identity_id") == 7) {
                            person_info_['class_id'] = data.table_List.class_id;
                            person_info_['class_name'] = data.table_List.class_name;
                        }
                    }
                }
            });
        }
        //2.非登录状态
    }else{
        //2.1 orgid和orgidentity_id有值
        if(!!org_id && !!orgidentity_id){
            visit_to = 1;
            //openPage = 0;
            //2.2 orgid和orgidentity_id无值
        }else{
            org_id = defaultOrgId;
            orgidentity_id = defaultOrgIid;
            visit_to = 1;
            //openPage = 0;
        }
    }
    
    $("#space_common").loadSpaceCommon({
        id: org_id,
        identity_id: orgidentity_id,
        is_admin: is_admin
    });
});

function getIsMember(){
	if(undefined != $.cookie("person_id") && null != $.cookie("person_id")){
    	$.ajax({
	        type: "GET",
	        async: false,
	        data: {"random_num": Math.random(),
	            "person_id": $.cookie("person_id"),
	            "identity_id": $.cookie("identity_id"),
	            "group_id": org_id
	        },
	        url: url_path_action_login + "/group/isExist",
	        dataType: "json",
	        success: function (data) {
	            if(data.success){
	            	is_member = 1;
	            }else{
	            	is_exist = data.STATE_ID;
	            }
	        }
	    });
    }
}

function goToBbs(){
    window.open("../../../html/social/luntan/main.html?orgid=" + org_id + "&iid=" + orgidentity_id);
}
function set_space_topnav(){
    if(visit_to == 3){

        if(openPage == 0){
            $("#org_logo_img").attr("src",org_info_.org_logo_fileid);
            $("#org_name_span").text(Base64.decode(org_info_.org_name));
            //$("#space_head").css("visibility","hidden");
            $("#space_head").hide();
            $("#space_head6").hide();
            $(".coor").css("cursor","auto");
            $(".portlet_header").css("cursor","auto");
            $(".portlet_header .space_h2_bg").children("div").hide();
        }else{
            $("#person_name").html($.cookie("person_name")+"&nbsp;&nbsp;<span class=\"caret\"></span>");
            $("#org_logo_img").attr("src",org_info_.org_logo_fileid);
            $("#org_name_span").text(Base64.decode(org_info_.org_name));
            $("#space_head").show();
            $("#space_head6").show();
            load_add_tree();

            $("#add_portlets_ul").click(function(){
                return false;
            });

        }

    }else{
        $("#space_head").hide();
        $("#space_head6").hide();
        if(orgidentity_id < 105) {
            $("#org_logo_img").attr("src", org_info_.org_logo_fileid);
        }
        $("#org_name_span").text(Base64.decode(org_info_.org_name));
        $(".coor").css("cursor","auto");
        $(".portlet_header").css("cursor","auto");
        $(".portlet_header .space_h2_bg").children("div").hide();
    }
}
//初始化样式
function initCss(){
    //不同宽度对应的不同样式
    if($(window).width() < 1200){
        $(".space_top").css("width","1200px");
        $("#space_head").css("width","1200px");
        $("#space_head>div").css("width","1200px");
        $("#space_head>div").css("display","block");
    }else{
        $(".space_top").css("width","100%");
        $("#space_head").css("width","100%");
        $("#space_head >div").css("width","100%");
        $("#space_head >div").css("display","block");
    }
    portlets_div_top = $("#portlets_div").offset().top;
    portlets_div_left = $("#portlets_div").offset().left;
    $("#add_portlets_ul").css("max-height",$(window).height()-60);
    $("#toWhereMenu").css("max-height",$(window).height()-60);
    $(window).resize(function(){
        $("#add_portlets_ul").css("max-height",$(window).height()-60);
        $("#toWhereMenu").css("max-height",$(window).height()-60);
        a(10,10);//#tbox的div距浏览器底部和页面右侧的距离
        if($(window).width() < 1200){
            $(".space_top").css("width","1200px");
            $("#space_head").css("width","1200px");
            $("#space_head>div").css("width","1200px");
            $("#space_head>div").css("display","block");
        }else{
            $(".space_top").css("width","100%");
            $("#space_head").css("width","100%");
            $("#space_head>div").css("width","100%");
            $("#space_head>div").css("display","block");
        }

        portlets_div_top = $("#portlets_div").offset().top;
        portlets_div_left = $("#portlets_div").offset().left;
        if(is_spaceportletEdit){
            if(data_portlet.layout == "12"){
                var portlets = data_portlet.portlets;
                $(portlets).each(function(index){
                    $(portlets[index]).each(function(i){
                        $("#" + portlets[index][i].id + portlets[index][i].re_postfix).css(
                            {"top":parseInt(portlets_div_top)+parseInt(portlets[index][i].position.top),
                                "left":parseInt(portlets_div_left)+parseInt(portlets[index][i].position.left)}
                        );
                    });
                    check_info();
                });
            }
        }

    });
    //轮播图
    if($(window).width() < 1024){
        $(".space_banner").css("width","1003px");
        $(".space_banner .oneByOne1").css("width","1003px");
        $(".space_banner #onebyone_slider .oneByOne_item").css("width","1003px");
        $(".space_banner .arrowButton .prevArrow").removeClass("prevArrow");
        $(".space_banner .arrowButton .nextArrow").removeClass("nextArrow");
    }else{
        $(".space_banner").css("width","100%");
        $(".space_banner .oneByOne1").css("width","100%");
        $(".space_banner #onebyone_slider .oneByOne_item").css("width","100%");
        $(".space_banner .arrowButton div").first().addClass("prevArrow");
        $(".space_banner .arrowButton div").last().addClass("nextArrow");
    }
    $(window).resize(function(){
        if($(window).width() < 1024){
            $(".space_banner").css("width","1003px");
            $(".space_banner .oneByOne1").css("width","1003px");
            $(".space_banner #onebyone_slider .oneByOne_item").css("width","1003px");
            $(".space_banner .arrowButton .prevArrow").removeClass("prevArrow");
            $(".space_banner .arrowButton .nextArrow").removeClass("nextArrow");
        }else{
            $(".space_banner").css("width","100%");
            $(".space_banner .oneByOne1").css("width","100%");
            $(".space_banner #onebyone_slider .oneByOne_item").css("width","100%");
            $(".space_banner .arrowButton div").first().addClass("prevArrow");
            $(".space_banner .arrowButton div").last().addClass("nextArrow");
        }
    });
}

//初始化机构信息、轮播图
function initOrgBaseInfo(){
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),"a_id":org_id,"a_identity_id":orgidentity_id,"a_type": "orgbaseinfo"},
        url : url_path_action_login + "/space/getAJson",
        dataType: "json",
        success : function(data) {
            var this_html_ = "";
            if(data.success){
                if(!isEmpty(data.a_json.org_logo_fileid)){
                    data.a_json.org_logo_fileid = STATIC_IMAGE_PRE + url_path_img + data.a_json.org_logo_fileid.substring(0,2) +"/"+ data.a_json.org_logo_fileid+"@77w_77h_100Q_1x.png";//@77w_77h_100Q_1x.jpg
                }
                if(!isEmpty(data.a_json.list)){
                    var list_ = data.a_json.list;
                    for(var i = 0; i< list_.length ;i++){
                        if(list_[i] != ""){
                            this_html_+="<div class='oneByOne_item'><div class='oneByOne_cont' style='margin-top:0px;background:url("+STATIC_IMAGE_PRE + url_path_img + list_[i].substring(0,2) + "/" + list_[i] + "@1680w_310h_100Q_1x.png"+") center no-repeat;'></div></div>";
                        }
                    }
                }
                org_info_ = data.a_json;
            }

            if(isEmpty(org_info_['org_name'])){
                if(orgidentity_id == "100"){
                    org_info_['org_name'] = Base64.encode("教育部空间");
                }else if(orgidentity_id == "101"){
                    org_info_['org_name'] = Base64.encode("省教育局空间");
                }else if(orgidentity_id == "102"){
                    org_info_['org_name'] = Base64.encode("市教育局空间");
                }else if(orgidentity_id == "103"){
                    org_info_['org_name'] = Base64.encode("区教育局空间");
                }else if(orgidentity_id == "104"){
                    org_info_['org_name'] = Base64.encode("学校空间");
                }
            }

            if(this_html_ == ""){
                this_html_ =
                    "<div class='oneByOne_item'><div class='oneByOne_cont' style='margin-top:0px;background:url(../../../images/space/1.png) center no-repeat;'></div></div>"+
                    "<div class='oneByOne_item'><div class='oneByOne_cont' style='margin-top:0px;background:url(../../../images/space/2.png) center no-repeat;'></div></div>"+
                    "<div class='oneByOne_item'><div class='oneByOne_cont' style='margin-top:0px;background:url(../../../images/space/3.png) center no-repeat;'></div></div>";
            }
            $("#onebyone_slider").html(this_html_);

            if(isEmpty(org_info_['org_logo_fileid'])){
                $("#org_logo_img").hide();
            }

            if(isEmpty(org_info_['org_description_text'])){
                org_info_['org_description_text'] = Base64.encode("");
            }

        }
    });
}

function gotoPerson(){
	window.open("main.html?id="+$.cookie("person_id")+"&identity_id="+$.cookie("identity_id"));
}

//判断是否本机构管理员
function isOrgAdmin(){
	var b = false;
    $.ajax({
        type: "GET",
        async: false,
        data: {"random_num": creatRandomNum(),
            "groupId": org_id
        },
        url: url_path_action_login + "/group/queryGroupById",
        dataType: "json",
        success: function (data) {
            if(data.success){
            	group_data = data;
            	if(data.CREATOR_ID == $.cookie("person_id") && data.IDENTITY_ID == $.cookie("identity_id")) {
                    visit_to = 3;
                    is_admin = 1;
                    is_super = 1;
                    org_info_['org_description_text'] = (data.GROUP_DESC?data.GROUP_DESC:"");
                }else{
                    visit_to = 2;
                    for(var i = 0;i < data.list_person.length;i++){
                        if($.cookie("person_id") && data.list_person[i].person_id == $.cookie("person_id") && $.cookie("identity_id") && data.list_person[i].identity_id == $.cookie("identity_id")) {
                            visit_to = 3;
                            is_admin = 1;
                        }
                    }
                    org_info_['org_description_text'] = (data.GROUP_DESC?data.GROUP_DESC:"");
                }
            	b = true;
            }
        }
    });
    return b;
}

//todo，初始化个人信息，需要优化
function initPersonInfo(){
    if(visit_to == 3){
        var temp_person_id = $.cookie("person_id");
        var temp_identity_id = $.cookie("identity_id");
        //初始化空间名称、头像、签名
        /**$.ajax({
			type : "GET",
			async : false,
			data:{"random_num":creatRandomNum(),"a_id":temp_person_id,"a_identity_id":temp_identity_id,"a_type": "personbaseinfo"},
			url : url_path_action_login + "/space/getAJson",
			dataType: "json",
			success : function(data) {
				if(data.success){
					isEmpty(data.a_json.space_name) ? (isEmpty(person_name) ? person_info_['space_name'] = Base64.encode("个人空间") : person_info_['space_name'] = Base64.encode(person_name + "的空间")) : person_info_['space_name'] = data.a_json.space_name;
					if(!isEmpty(data.a_json.space_signature)){
						person_info_['space_signature'] = data.a_json.space_signature;
					}else{
						person_info_['space_signature'] = Base64.encode("");
					}
					if(!isEmpty(data.a_json.space_avatar_fileid)){
						data.a_json.space_avatar_fileid = STATIC_IMAGE_PRE + url_path_img + data.a_json.space_avatar_fileid.substring(0,2) + "/"+data.a_json.space_avatar_fileid+"@77w_77h_100Q_1x.png";
         person_info_['space_avatar_fileid'] = data.a_json.space_avatar_fileid;
         }else{
						person_info_['space_avatar_fileid'] = "../../../images/space/person.png";
					}
         }else{
					if(visit_to == 3){
						person_info_['space_name'] = Base64.encode($.cookie("person_name"));
						person_info_['space_signature'] = Base64.encode("");
						person_info_['space_avatar_fileid'] = "../../../images/space/person.png";
					}else{
						if(!!!person_name || person_name == ""){
							person_info_['space_name'] = Base64.encode("个人空间");
						}else{
							person_info_['space_name'] = Base64.encode(person_name);
						}
						person_info_['space_signature'] = Base64.encode("");
						person_info_['space_avatar_fileid'] = "../../../images/space/person.png";
					}
				}
         }
         });*/

            //初始化个人省、市、区、校、班信息
        $.ajax({
            type : "GET",
            async : false,
            data : {
                "random_num" : creatRandomNum(),
                "person_id" : temp_person_id,
                "identity_id" : temp_identity_id
            },
            //url : url_path_action_login + "/space/getSpacePersonInfo",
            url : url_path_action_login + "/person/getPersonInfo",
            dataType : "json",
            success : function(data) {
                if(data.success){
                    person_info_['sheng_id'] = data.table_List.province_id;
                    person_info_['sheng_name'] = data.table_List.province_name;
                    person_info_['shi_id'] = data.table_List.city_id;
                    person_info_['shi_name'] = data.table_List.city_name;
                    person_info_['qu_id'] = data.table_List.district_id;
                    person_info_['qu_name'] = data.table_List.district_name;
                    if(data.table_List.bureau_type == 2){
                        person_info_['xiao_id'] = data.table_List.bureau_id;
                        person_info_['xiao_name'] = data.table_List.bureau_name;
                    }
                    personlogin_name = data.table_List.login_name;
                    person_name = data.table_List.person_name;
                    if(identity_id == 6){
                        person_info_['class_id'] = data.table_List.class_id;
                        person_info_['class_name'] = data.table_List.class_name;
                    }
                }
            }
        });
    }
}


function close_add_portlet_div(){
    $("#dropdown_addportlet").toggleClass("open");
}

function click_to_add_portlet(event, treeId, treeNode, clickFlag){

    if(!!!(treeNode.portletID =="") && !!treeNode.pId){
        if(!!!click_add_portlet(treeNode.portletID,treeNode.repetition)){
            return false;
        }
        orgadd_portlet_action(treeNode.portletID,1,false);
        if(treeNode.repetition == 0){
            var zTree = $.fn.zTree.getZTreeObj("tree_portletslist"),
                nodes = zTree.getSelectedNodes();
            zTree.setting.view.fontCss["color"] = "#a5a5a5";
            zTree.updateNode(nodes[0]);
        }
    }else{

    }
}

//改变模板渲染--渲染结束后绑定拖动事件（如果是公共页面可以取消绑定事件）
//黄记纲
//2014/11/27
function change_iframe(d){
    ["layout"].loadTemplates("../../../html/space/tpl/common/",function(){
        var portlets_html;
        if(data_portlet.layout == "12"){
            portlets_html = template('layout_12', data_portlet);
        }else{
            while(data_portlet.layout == "1" && data_portlet.portlets.length < 3){
                data_portlet.portlets.push([]);
            }
            portlets_html = template('layout_'+parseInt(data_portlet.layout), data_portlet);
            $(".portlet").css("width","100%");
        }
        document.getElementById('portlets_div').innerHTML = portlets_html;

        //异步加载信息
        bind_function();

        var portlets = data_portlet.portlets;
        //这个是绑定拖动事件  如果公共页面选择不执行
        each_bind_function(document);

        $(portlets).each(function(index){

            $(portlets[index]).each(function(i){
                if((visit_to ==3)&&(openPage == 1)){
                    bind_mouse_down($("#" + portlets[index][i].id  + portlets[index][i].re_postfix));
                }
                //getInnerHTML(portlets[index][i].id,(portlets[index][i].id+portlets[index][i].re_postfix),4);
            });
        });

        if(d == 1){
            check_info_test();
        }
        $(".portlet").portletlazyload();
        
        set_space_topnav();
    });
}

//加载添加树
function load_add_tree(){
    var has_portlet =[];
    has_portlet = loadTopTreeNode(orgidentity_id);
    /*has_portlet =
     [{
     //"互动工具":[
     //{"id":"myBlogArticle","name":"我的博文","repetition":0},
     //{"id":"myBlogArticleHistory","name":"最近浏览博文","repetition":0},
     //{"id":"goodBlogArticle","name":"精彩博文","repetition":0}
     //{"id":"myFriends","name":"我的好友","repetition":0}
     //{"id":"","name":"问题求助","repetition":0},
     //{"id":"","name":"论坛","repetition":0},
     //{"id":"","name":"心灵驿站","repetition":0},
     //{"id":"","name":"留言板","repetition":0},
     //{"id":"","name":"好友动态","repetition":0}
     //],
     "常用工具":[
     //{"id":"person_selfInfo","name":"个人信息","repetition":0},
     //{"id":"","name":"通知公告","repetition":0},//inform_notice
     {"id":"org_selfInfo","name":"空间简介","repetition":0},
     {"id":"org_news","name":"通知公告","repetition":0},
     {"id":"org_goodSchool","name":"优秀学校","repetition":0},
     {"id":"org_goodClass","name":"优秀班级","repetition":0},
     {"id":"org_goodTeacher","name":"优秀教师","repetition":0},
     {"id":"org_goodStudent","name":"优秀学生","repetition":0},
     {"id":"org_count","name":"空间统计","repetition":0},
     {"id":"toplink","name":"快捷链接","repetition":1},
     {"id":"photos","name":"相册","repetition":1},
     {"id":"video","name":"视频与Flash","repetition":1}
     //{"id":"music","name":"音乐播放器","repetition":0},
     //{"id":"weather","name":"天气预报","repetition":0},
     //{"id":"dictionary","name":"字典","repetition":0},
     //{"id":"websearch","name":"网络搜索","repetition":0}//websearch
     //{"id":"timetable","name":"课程表","repetition":0},
     //{"id":"schedule","name":"日程","repetition":0},
     //{"id":"","name":"书架","repetition":0},
     //{"id":"","name":"在线调查","repetition":0},
     //{"id":"voteOnline","name":"在线投票","repetition":1},
     //{"id":"worknotice","name":"办公通知","repetition":0}
     ]}

     ];

     if(orgidentity_id == "104"){
     has_portlet =
     [{
     //"互动工具":[
     //{"id":"myBlogArticle","name":"我的博文","repetition":0},
     //{"id":"myBlogArticleHistory","name":"最近浏览博文","repetition":0},
     //{"id":"goodBlogArticle","name":"精彩博文","repetition":0}
     //{"id":"myFriends","name":"我的好友","repetition":0}
     //{"id":"","name":"问题求助","repetition":0},
     //{"id":"","name":"论坛","repetition":0},
     //{"id":"","name":"心灵驿站","repetition":0},
     //{"id":"","name":"留言板","repetition":0},
     //{"id":"","name":"好友动态","repetition":0}
     // ],
     "常用工具":[
     //{"id":"person_selfInfo","name":"个人信息","repetition":0},
     //{"id":"","name":"通知公告","repetition":0},//inform_notice
     {"id":"org_selfInfo","name":"学校简介","repetition":0},
     {"id":"org_news","name":"通知公告","repetition":0},
     //{"id":"org_goodSchool","name":"优秀学校","repetition":0},
     {"id":"org_goodClass","name":"优秀班级","repetition":0},
     {"id":"org_goodTeacher","name":"优秀教师","repetition":0},
     {"id":"org_goodStudent","name":"优秀学生","repetition":0},
     {"id":"toplink","name":"快捷链接","repetition":1},
     {"id":"photos","name":"相册","repetition":1},
     {"id":"video","name":"视频与Flash","repetition":1}
     //{"id":"music","name":"音乐播放器","repetition":0},
     //{"id":"weather","name":"天气预报","repetition":0},
     //{"id":"dictionary","name":"字典","repetition":0},
     //{"id":"websearch","name":"网络搜索","repetition":0}//websearch
     //{"id":"timetable","name":"课程表","repetition":0},
     //{"id":"schedule","name":"日程","repetition":0},
     //{"id":"","name":"书架","repetition":0},
     //{"id":"","name":"在线调查","repetition":0},
     //{"id":"voteOnline","name":"在线投票","repetition":1},
     //{"id":"worknotice","name":"办公通知","repetition":0}
     ]}

     ];
     }else if(orgidentity_id == "105"){
     has_portlet =
     [{
     //"互动工具":[
     //{"id":"myBlogArticle","name":"我的博文","repetition":0},
     //{"id":"myBlogArticleHistory","name":"最近浏览博文","repetition":0},
     //{"id":"goodBlogArticle","name":"精彩博文","repetition":0}
     //{"id":"myFriends","name":"我的好友","repetition":0}
     //{"id":"","name":"问题求助","repetition":0},
     //{"id":"","name":"论坛","repetition":0},
     //{"id":"","name":"心灵驿站","repetition":0},
     //{"id":"","name":"留言板","repetition":0},
     //{"id":"","name":"好友动态","repetition":0}
     // ],
     "常用工具":[
     //{"id":"person_selfInfo","name":"个人信息","repetition":0},
     //{"id":"","name":"通知公告","repetition":0},//inform_notice
     {"id":"org_selfInfo","name":"班级简介","repetition":0},
     {"id":"org_news","name":"通知公告","repetition":0},
     //{"id":"org_goodSchool","name":"优秀学校","repetition":0},
     //{"id":"org_goodClass","name":"优秀班级","repetition":0},
     //{"id":"org_goodTeacher","name":"优秀教师","repetition":0},
     //{"id":"org_goodStudent","name":"优秀学生","repetition":0},
     {"id":"toplink","name":"快捷链接","repetition":1},
     {"id":"photos","name":"相册","repetition":1},
     {"id":"video","name":"视频与Flash","repetition":1},
     {"id":"messageBoard","name":"留言板","repetition":0}
     //{"id":"music","name":"音乐播放器","repetition":0},
     //{"id":"weather","name":"天气预报","repetition":0},
     //{"id":"dictionary","name":"字典","repetition":0},
     //{"id":"websearch","name":"网络搜索","repetition":0}//websearch
     //{"id":"timetable","name":"课程表","repetition":0},
     //{"id":"schedule","name":"日程","repetition":0},
     //{"id":"","name":"书架","repetition":0},
     //{"id":"","name":"在线调查","repetition":0},
     //{"id":"voteOnline","name":"在线投票","repetition":1},
     //{"id":"worknotice","name":"办公通知","repetition":0}
     ]}

     ];
     }*/

    var key_i = 0;
    var zNodes =[];
    var znode_ = 1;
    for(var key in has_portlet[0]){

        var pid_ ={};
        pid_["id"] = 100+key_i;
        pid_["pId"] = 0;
        pid_["name"] = key;
        pid_["open"] = true;
        pid_['font']={};
        zNodes.push(pid_);
        $(has_portlet[0][''+key]).each(function (i){

            var cid_ ={};
            cid_["id"] = (key_i+1)*1000+znode_;
            cid_["pId"] = 100+key_i;
            cid_["name"] = has_portlet[0][''+key][i]["name"];
            cid_["portletID"] = has_portlet[0][''+key][i]["id"];
            cid_["repetition"] = has_portlet[0][''+key][i]["repetition"];
            pid_['font']={};
            zNodes.push(cid_);
            znode_++;
        });

        key_i++;
    }

    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: click_to_add_portlet
        },view: {
            fontCss: clickdropdown_add_portlet,
            selectedMulti: false
        }

    };
    $.fn.zTree.init($("#tree_portletslist"), setting, zNodes);
}
//检测添加模块下拉菜单中的唯一项
//黄记纲
//2014/11/27
function clickdropdown_add_portlet(treeId, node){
    var this_portlets = data_portlet.portlets;
    var check_ = {};
    if( node.portletID == "" ){
        check_ = {color:"#a5a5a5"};
    }else if(node.repetition == 0){
        $(this_portlets).each(function(index){
            $(this_portlets[index]).each(function(i){
                if((node.portletID === this_portlets[index][i].id)){
                    //alert(node.portletID + "**" + this_portlets[index][i].id);
                    check_ = {color:"#a5a5a5"};
                    return false;
                }
            });
        });
    }
    return check_;
//	$("#add_portlets_ul li").each(function(){
//		var dom = $(this);
//		var check_ = false;
//		//0--不可重复
//		if(dom.find(".repetition").val() == "0"){
//			
//			$(this_portlets).each(function(index){
//				$(this_portlets[index]).each(function(i){
//					//alert(this_portlets[index][i].id == dom.children(".this_portlet_id").val());
//					if(this_portlets[index][i].id ==dom.find(".this_portlet_id").val() ){
//						//dom.addClass("disabled");
//						check_ = true;
//						
//					}
//				});
//			});
//		}
//	});
}

function click_add_portlet(this_portlet_id,repetition){
    var this_portlets = data_portlet.portlets;

    var check_ = true;

    //0--不可重复
    if(repetition == 0){

        $(this_portlets).each(function(index){
            $(this_portlets[index]).each(function(i){
                //alert(this_portlets[index][i].id == dom.children(".this_portlet_id").val());
                if(this_portlets[index][i].id ==this_portlet_id){
                    //dom.addClass("disabled");
                    check_ = false;

                }
            });
        });

    }
    return check_;

}

//检测布局是否是当前布局   是--取消点击事件
//黄记纲
//2014/11/27
function check_layout_document(){
    //判断是否是二级页  是的话不弹出下拉列表
    if(isSecOrMain == 1){
        art.dialog.alert("当前页面禁止调整布局！");
        $("#change_layout_ul").siblings("a").addClass("disabled");
    }else{
        $("#change_layout_ul").siblings("a").removeClass("disabled");
    }
    var this_layout = data_portlet.layout;
    $("#change_layout_ul li").each(function(){
        var dom = $(this);
        //alert(dom.find("input").val()+"**"+this_layout);
        if(dom.find("input").val()==this_layout){
            dom.addClass("disabled");
            //$("#change_layout_ul").children(".ischeck").attr("checked",false);
            dom.find(".ischeck").attr("checked","checked");
        }else{
            dom.removeClass("disabled");
            dom.find(".ischeck").attr("checked",false);
        }

    });
}
//检测布局是否是当前主题风格   是--取消点击事件
//黄记纲
//2015/1/5
function check_theme_document(){
    var this_theme = All_Theme_.theme;


    $("#change_theme_ul li").each(function(){
        var dom = $(this);
        //alert(dom.find("input").val()+"**"+this_theme);
        if(dom.find("input").val()==this_theme){
            dom.addClass("disabled");
            //$("#change_layout_ul").children(".ischeck").attr("checked",false);
            dom.find(".ischeck").attr("checked","checked");
        }else{
            dom.removeClass("disabled");
            dom.find(".ischeck").attr("checked",false);
        }

    });
}

//检测各模块所在位置的json串是否发生改变，更新模块位置信息
//黄记纲
//2014/11/27
function check_info(){


    var x, y, w, h;

    var all_divs_list = $(".portlet");
    //alert(1);
    $(all_divs_list).each(function(i){
        if($(all_divs_list[i]).find(".portlet_content").css("display") != "none"){

            x = parseInt($(all_divs_list[i]).offset().left)-parseInt(portlets_div_left);
            y = parseInt($(all_divs_list[i]).offset().top)-parseInt(portlets_div_top);
            w = parseInt($(all_divs_list[i]).css("width"));
            h = parseInt($(all_divs_list[i]).css("height"))-parseInt($(this).children(".portlet_header").height());

            $(this).children(".position_t").val(y);
            $(this).children(".position_l").val(x);
            $(this).children(".position_w").val(w);
            $(this).children(".position_h").val(h);
        }

    });


    if(data_portlet.layout == "12"){
        var all_portlets = $("#portlets_div").children(".portlet");
        var data_list =[];
        var col = [];
        all_portlets.each(function(){
            //$(all_divs).each(function(){
            var vol_p ={};
            vol_p.id = $(this).children(".hid_id").val();
            //alert($(this).children(".hid_id").val());
            //vol_p.repetition = parseInt($(this).children(".hid_repetition").val());
            vol_p.re_postfix = parseInt($(this).children(".hid_re_postfix").val());
            vol_p.name = $(this).children(".hid_name").val();
            var position = {};
            position.top = parseInt($(this).children(".position_t").val());
            position.left = parseInt($(this).children(".position_l").val());
            position.width = parseInt($(this).children(".position_w").val());
            position.height = parseInt($(this).children(".position_h").val());
            position.min_w = parseInt($(this).children(".position_min_w").val());
            position.min_h = parseInt($(this).children(".position_min_h").val());
            position.max_w = parseInt($(this).children(".position_max_w").val());
            position.max_h = parseInt($(this).children(".position_max_h").val());

            vol_p['position']=position;

            //alert(vol_p.id+"*" + vol_p.repetition+"**"+vol_p.re_postfix+"**"+vol_p.name+"**"+vol_p.page);

            col.push(vol_p);

        });
        data_list.push(col);
        data_portlet.portlets=data_list;
        //alert(JSON.stringify(data_portlet))
    }else{
        var v_list = $(".column");
        var data_list =[];
        v_list.each(function(){

            var col = [];

            var p_list = $(this).children(".portlet");
            //.children(".hid_id").val();
            if($(p_list).length == 0){
                $(this).height(5);
            }
            p_list.each(function(){
                var vol_p ={};
                vol_p.id = $(this).children(".hid_id").val();
                //alert($(this).children(".hid_id").val());
                //vol_p.repetition = parseInt($(this).children(".hid_repetition").val());
                vol_p.re_postfix = parseInt($(this).children(".hid_re_postfix").val());
                vol_p.name = $(this).children(".hid_name").val();
                var position = {};
                position.top = parseInt($(this).children(".position_t").val());
                position.left = parseInt($(this).children(".position_l").val());
                position.width = parseInt($(this).children(".position_w").val());
                position.height = parseInt($(this).children(".position_h").val());
                position.min_w = parseInt($(this).children(".position_min_w").val());
                position.min_h = parseInt($(this).children(".position_min_h").val());
                position.max_w = parseInt($(this).children(".position_max_w").val());
                position.max_h = parseInt($(this).children(".position_max_h").val());

                vol_p['position']=position;

                //alert(vol_p.id+"*" + vol_p.repetition+"**"+vol_p.re_postfix+"**"+vol_p.name+"**"+vol_p.page);

                col.push(vol_p);
            });

            data_list.push(col);
        });
        if(JSON.stringify(data_list) != JSON.stringify(data_portlet.portlets)){
            //alert(JSON.stringify(data_list)+"***"+JSON.stringify(data_portlet.portlets));
            data_portlet.portlets=data_list;
        }
    }
    for(var i = 0 ; i < All_Layout_.layouts.length ; i++){
        if(All_Layout_.layouts[i].layout == data_portlet.layout){
            All_Layout_.layouts[i] = data_portlet;
        }
    }
    //alert(JSON.stringify(self.parent.data_portlet));
}
//检测指定布局信息下有多少个模块
//黄记纲
//2014/11/27
function Check_layout_portletNum(layout){

    var sum = 0;
    var layout_portlets = layout.portlets;
    $(layout_portlets).each(function(i){
        var ps_ = layout_portlets[i];
        $(ps_).each(function(){
            sum++;
        });
    });
    return sum;
}

//切换布局
//黄记纲
//2014/11/27
function changeLayout(layout_id){
    //var old_layout = data_portlet.layout;

    if(layout_id == data_portlet.layout){
        return;
    }

    var id_ = parseInt(layout_id);

    if(Check_layout_portletNum(All_Layout_.layouts[id_-1]) == 0){
        Math_put_portlet(All_Layout_.layouts[id_-1]);
    }else{
        data_portlet = All_Layout_.layouts[id_-1];
    }
    All_Layout_.nowLayout = layout_id;

    change_iframe(1);

}

//取出所有的portlet  然后平分到每个列中
//黄记纲
//2014/11/27
function Math_put_portlet(layout_){
    var old_portlets = data_portlet.portlets;
    var layout_col_num = layout_.portlets.length;
    var ps_ = new Array();
    //alert(layout_col_num);
    $(old_portlets).each(function(i){
        for(var j=0;j<old_portlets[i].length;j++){
            //alert(JSON.stringify(old_portlets[i][j]));
            ps_.push(old_portlets[i][j]);
        }
    });

    for(var i = 0; i < ps_.length; i++){
        for(var j = 0 ; j < layout_col_num ; j++){
            if(i%layout_col_num == j){
                layout_.portlets[j].push(ps_[i]);
                continue;
            }
        }
    }
    data_portlet = layout_;
    //alert(JSON.stringify(layout_));

}

//添加模块时检测其他布局，给其他非空布局也添加
//黄记纲
//2014/11/27
function add_to_other_layout(page_info){

    //其他的布局添加
    var bro_p ={"bro_p_position":"","bro_id":""};

    if(data_portlet.layout == "12"){
        bro_p.bro_p_position = "0";
    }else{

        var bro_portlets =$("#"+page_info.id + page_info.re_postfix).siblings(".portlet");
        //alert($(bro_portlets).length);
        //找到兄弟节点
        if($(bro_portlets).length > 0){
            //alert($("#"+page_info.id + page_info.re_postfix).prev().attr("id"));
            if($("#"+page_info.id + page_info.re_postfix).prev() !=null){
                bro_p.bro_p_position = "prev";
                bro_p.bro_id = $("#"+page_info.id + page_info.re_postfix).prev().attr("id");
            }else if($("#"+page_info.id + page_info.re_postfix).next() !=null){
                bro_p.bro_p_position = "next";
                bro_p.bro_id = $("#"+page_info.id + page_info.re_postfix).next().attr("id");
            }
        }else{
            bro_p.bro_p_position = "0";
        }
    }
    //alert(JSON.stringify(bro_p));
    //其他布局添加
    var als_ = All_Layout_.layouts;
    //获取每个布局
    $(als_).each(function(i){
        var this_layout_c = als_[i].portlets;
        //获取布局下的列信息

        //判断布局是否没有模块 如果没有  跳过
        var re_ = false;
        $(this_layout_c).each(function(j){
            if(this_layout_c[j].length > 0){
                re_ = true;
                return false;
            }
        });
        //||如果是当前布局
        if(!re_ || als_[i].layout == data_portlet.layout){
            return true;
        }
        //判断结束

        if(als_[i].layout == "12" && data_portlet.layout != "12"){
            //var all_12_ps = als_[i].portlets[0];
            //调用
            var info = put_portletTOLayout12(page_info.position.width,page_info.position.height,als_[i].portlets[0]);
            page_info.position.left = info[0];
            page_info.position.top = info[1];
            this_layout_c[0].splice(als_[i].portlets[0].length , 0 , page_info);
            //alert(JSON.stringify(this_layout_c));
        }else{

            // = 0 的时候就是放在一个空的列里   如果=0  那么找一个模块最少的列  否则按照规则放入
            if(bro_p.bro_p_position == "0"){
                var this_col =this_layout_c[0];
                $(this_layout_c).each(function(j){
                    if(this_layout_c[j].length < this_col.length){
                        this_col = this_layout_c[j];
                    }
                });
                //alert(JSON.stringify(this_col));
                this_col.splice(this_col.length , 0 , page_info);
            }else{
                $(this_layout_c).each(function(j){
                    var this_layout_p = this_layout_c[j];
                    //遍历列里的portlet
                    $(this_layout_p).each(function(k){

                        if((this_layout_p[k].id + this_layout_p[k].re_postfix) == bro_p.bro_id){

                            if(bro_p.bro_p_position == "prev"){
                                this_layout_p.splice(k+1 , 0 , page_info);
                            }else{
                                this_layout_p.splice(k , 0 , page_info);
                            }

                        }

                    });
                });
            }
        }
    });

}
//向自由布局中添加模块--添加时计算模块位置，自动寻找空白位置
//width、height -- 要添加的模块的宽高，all_12_ps -- 自由布局的所有模块信息
//黄记纲
//2014/11/27
function put_portletTOLayout12(width,height,all_12_ps){

    var page_width = width;
    var page_height = height+head_height;

    var autocheck = true;
    var this_t = 0;
    var this_l = 0;
    if(all_12_ps.length == 0){
        return [0,0];
    }else{
        //先循环增加高度，
        for(var i = 0 ; autocheck ; (i = (i + 10))){
            //循环增加left
            for(var w = 0;(w <= (main_width - page_width)) && autocheck;(w = (w + 10))){

                //alert(JSON.stringify(all_12_ps));
                //$(all_12_ps).each(function(k){
                for(var k = 0; k < all_12_ps.length ; k++){
                    var this_p_left = all_12_ps[k].position.left;
                    var this_p_top = all_12_ps[k].position.top;
                    var this_p_width = all_12_ps[k].position.width;
                    var this_p_height = all_12_ps[k].position.height+head_height;
                    //判断两个div顶点是否在另一个div中
                    var leftTop = this_p_left >= w && this_p_left <= w+page_width && this_p_top >= i && this_p_top <= i+page_height,
                        rightTop = this_p_left+this_p_width >= w && this_p_left+this_p_width <= w+page_width && this_p_top >= i && this_p_top <= i+page_height,
                        leftBottom = this_p_left >= w && this_p_left <= w+page_width && this_p_top+this_p_height >= i && this_p_top+this_p_height <= i+page_height,
                        rightBottom = this_p_left+this_p_width >= w && this_p_left+this_p_width <= w+page_width && this_p_top+this_p_height >= i && this_p_top+this_p_height <= i+page_height;

                    if(leftTop || rightTop || leftBottom || rightBottom){
                        break;
                    }

                    var leftTop_ = w >= this_p_left && w <= this_p_left+this_p_width && i >= this_p_top && i <= this_p_top+this_p_height,
                        rightTop_ = w+page_width >= this_p_left && w+page_width <= this_p_left+this_p_width && i >= this_p_top && i <= this_p_top+this_p_height,
                        leftBottom_ = w >= this_p_left && w <= this_p_left+this_p_width && i+page_height >= this_p_top && i+page_height <= this_p_top+this_p_height,
                        rightBottom_ = w+page_width >= this_p_left && w+page_width <= this_p_left+this_p_width && i+page_height >= this_p_top && i+page_height <= this_p_top+this_p_height;

                    if(leftTop_ || rightTop_ || leftBottom_ || rightBottom_){
                        break;
                    }

                    if(k == all_12_ps.length -1){
                        this_t = i;
                        this_l = w;

                        autocheck = false;
                    }
                }//);


            }

        }
    }
    //查找位置结束

    return [this_l,this_t];
}

//测试使用
//黄记纲
//2014/11/27
function check_info_test(d){
    //document.getElementById("portlets_frame").contentWindow.change_all_height();
    //check_info();
    //var all_info = All_Layout_;
    var portlets = data_portlet.portlets;
    var all_setting_ ={};
    $(portlets).each(function(index){
        $(portlets[index]).each(function(i){

            all_setting_[''+(portlets[index][i].id+portlets[index][i].re_postfix)] = ALL_Setting[''+(portlets[index][i].id+portlets[index][i].re_postfix)];
        });
    });

    All_Layout_['ALL_Setting'] = all_setting_;
    //--------------------
    if(d == 1){

        $.ajax({
            type : "POST",
            async : false,
            data:{"random_num":creatRandomNum(),"theme_json":JSON.stringify(All_Theme_),"person_id":org_id,"identity_id":orgidentity_id},
            url : url_path_action + "/space/setSpaceThemeInfo",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    //alert("保存成功");
                }else{
                    art.dialog.alert("保存异常,刷新页面后重试！");
                }
            }
        });
    }else{
        $.ajax({
            type : "POST",
            async : false,
            data:{"random_num":creatRandomNum(),"json":JSON.stringify(All_Layout_),"person_id":org_id,"identity_id":orgidentity_id},
            url : url_path_action + "/space/setSpaceInfo",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    //alert("保存成功");
                }else{
                    art.dialog.alert("保存异常,刷新页面后重试！");
                }
            }
        });
    }

}

//使移动距离网格化
//黄记纲
//2014/11/27
function StandardToGridN(n){
    return Math.round(n/gridN)*gridN;
}

//控制模块收缩
//黄记纲
//2014/11/27
function click_toggle(dom,d,event){

    if(d == 1){
        $(dom).closest(".portlet_header").find(".toggle_hide").hide();
        $(dom).closest(".portlet_header").find(".toggle_show").show();
        $(dom).closest(".portlet").find(".portlet_content").hide();
        $(dom).closest(".portlet").height($(dom).closest(".portlet").find(".portlet_header").height());
    }else if(d == 2){
        $(dom).closest(".portlet_header").find(".toggle_hide").show();
        $(dom).closest(".portlet_header").find(".toggle_show").hide();
        $(dom).closest(".portlet").find(".portlet_content").show();
        $(dom).closest(".portlet").height($(dom).closest(".portlet").find(".portlet_header").height()+$(dom).closest(".portlet").find(".portlet_content").height());
    }
}

//所有模块大小初始化，并开始绑定拖动事件
//黄记纲
//2014/11/27
function bind_function(){
    //取出所有的模块信息放在一个json串中
    var portlets =[];
    if(data_portlet.layout == "12"){
        portlets = data_portlet.portlets[0];
    }else{
        var portlets_ =[];
        var col_list = data_portlet.portlets;
        $(col_list).each(function(i){
            var p_c_list = col_list[i];
            $(p_c_list).each(function(j){
                portlets_.push(p_c_list[j]);
            });
        });
        portlets = portlets_;
    }
    //alert(JSON.stringify(portlets));
    //按模块进行加载
    $(portlets).each(function(i){
        //alert(portlets_frame_height);
        //判断
        if(data_portlet.layout == "12"){
            $("#" + portlets[i].id + portlets[i].re_postfix).css(
                {"top":parseInt(portlets_div_top)+parseInt(portlets[i].position.top),
                    "left":parseInt(portlets_div_left)+parseInt(portlets[i].position.left),
                    "width":StandardToGridN(parseInt(portlets[i].position.width))//,"height":portlets[i].position.height
                }
            );
            //alert(portlets_div_left+lparseInt(portlets[i].position.left));
        }
        //$("#portlet_content_"+portlets[i].id).width(portlets[i].position.width);//"height":portlets[i].position.height}
        $("#portlet_content_" + portlets[i].id  + portlets[i].re_postfix).height(StandardToGridN(parseInt(portlets[i].position.height)));//"height":portlets[i].position.height}
        //all_divs.push($("#" + portlets[i].id + portlets[i].re_postfix));
        //alert(portlets[i].position.width+"**"+portlets[i].position.height);
        //alert(JSON.stringify(portlets[i]));
    });

    check_info();
}

//拖动时找到指定的div 并把虚拟框定位到指定div的前后
//黄记纲
//2014/11/27
function SetTarget(px, py)
{
    var x, y, w, h;
    //alert(px+"*"+py);
    var all_divs_list = $(".portlet_fix");
    $(all_divs_list).each(function(i){
        x = parseInt($(all_divs_list[i]).offset().left);
        y = parseInt($(all_divs_list[i]).offset().top);
        w = parseInt($(all_divs_list[i]).css("width"));
        h = parseInt($(all_divs_list[i]).css("height"));
        //alert(x+"*"+x+w+"*"+y+"*"+y+h);
        if ( px>=x && px<=x+w && py>=y-50 &&py<=y+h/2+head_height)
        {
            var move_for_div = $(all_divs_list[i]).attr("id");
            $(".dummy_portlet").remove();
            $("#"+move_for_div).before("<div class=\"dummy_portlet\"><div>");
            return;
        }else if(px>=x && px<=x+w && py>=y+head_height+h/2 &&py<=y+h+head_height+50){
            var move_for_div = $(all_divs_list[i]).attr("id");
            $(".dummy_portlet").remove();
            $("#"+move_for_div).after("<div class=\"dummy_portlet\"><div>");
            return;
        }

    });

    var all_column_div = $(".column");
    var null_col_divs  = new Array();
    $(all_column_div).each(function(i){
        //alert($(all_column_div[i]).has("div").length);
        if(!$(all_column_div[i]).has("div").length){
            $(all_column_div[i]).height(150);
            null_col_divs.push($(all_column_div[i]));
        }
    });
    $(null_col_divs).each(function(i){

        x = parseInt($(null_col_divs[i]).offset().left);
        y = parseInt($(null_col_divs[i]).offset().top);
        w = parseInt($(null_col_divs[i]).css("width"));
        h = parseInt($(null_col_divs[i]).css("height"));
        //alert(x+"*"+(x+w)+"*"+y+"*"+(y+h));

        if ( px>=x && px<=x+w && py>=y &&py<=y+h)
        {
            //alert(x+"*"+(x+w)+"*"+y+"*"+(y+h));
            var move_for_div = $(null_col_divs[i]).attr("id");
            $(".dummy_portlet").remove();
            $("#"+move_for_div).append("<div class=\"dummy_portlet\"><div>");
            return;
        }
    });

}
//给元素绑定鼠标移动事件和鼠标抬起事件
//黄记纲
//2014/11/27
function each_bind_function(dom){

    $(dom).mousemove(function(e) {
        if(move_to_add_portlet){
            var ev = e || event;
            ev.cancelBubble=true;
            ev.returnValue = false;
            $.extend(document, {'move': true, 'move_target': $("#"+move_to_add_portlet_info.id + move_to_add_portlet_info.re_postfix)});
        }
        if (!!this.move) {
            //禁止鼠标拖动选取文字
            if(document.selection){//IE ,Opera
                if(document.selection.empty)
                    document.selection.empty();//IE
                else{//Opera
                    document.selection = null;
                }
            }else if(window.getSelection){//FF,Safari
                window.getSelection().removeAllRanges();
            }
            stopbubble = true;
            var posix = !document.move_target ? {'x': 0, 'y': 0} : document.move_target.posix,
                callback = document.call_down || function() {
                    //main_width:模块可移动的宽度      $(this.move_target).width():模块宽度    2:模块左右边框宽度和
                    //移动后的位置
                    if(data_portlet.layout != "12"){

                        $(this.move_target).width("400px");

                        $(this.move_target).removeClass("portlet_fix");
                        if(!layout0_ismove){
                            $(this.move_target).after("<div class=\"dummy_portlet\"><div>");
                        }

                        $(this.move_target).addClass("move_portlet_n0");

                        $(this.move_target).closest(".column").after($(this.move_target));
                        layout0_ismove = true;
                        //定位从
                        SetTarget(e.pageX,e.pageY);

                    }

                    if(!(!!posix)){
                        posix = {"x":100,"y":15};
                    }
                    var top_ = StandardToGridN(Math.max(portlets_div_top, e.pageY - posix.y));
                    if(data_portlet.layout == "12"){
                        var left_ = StandardToGridN(Math.min((Math.max(portlets_div_left, e.pageX - posix.x)-5),(main_width+portlets_div_left-$(this.move_target).width()-10)));
                        $(this.move_target).css({
                            'top': top_,
                            'left':left_
                        });
                    }else{
                        $(this.move_target).css({
                            'top': top_,
                            'left':(e.pageX - 150)
                        });
                    }
                    //alert((top_-portlets_div_top)+"*"+(left_-portlets_div_left));
                    if(e.clientY <= 50 && $(document).scrollTop()>0){
                        $(document).scrollTop(($(document).scrollTop()-30)>=0?$(document).scrollTop()-30:0);
                    }else if(e.clientY >= ($(window).height()-50)){
                        $(document).scrollTop(($(document).scrollTop()+30));
                    }
                };

            callback.call(this, e, posix);

            //CheckHeight(1);

        }
    }).mouseup(function(e) {
        if (!!this.move) {
            var callback = document.call_up || function(){

                var this_portlet = $(this.move_target).closest(".portlet");
                var x = this_portlet.width();
                var y = this_portlet.height()-$(this.move_target).children(".portlet_header").height();

                var func_change_wh = this_portlet.find(".hid_id").val() + "_change_wh";

                if(layout0_ismove){
                    //alert($(this.move_target).width());

                    $(".dummy_portlet").after($(this.move_target));
                    $(".dummy_portlet").remove();

                    $(this.move_target).closest(".column").height("auto");
                    $(this.move_target).width("100%");

                    $(this.move_target).addClass("portlet_fix");
                    $(this.move_target).removeClass("move_portlet_n0");
                    //改变大小  1--非自由布局拖动  2--所有布局改变模块宽高
                    check_info();
                    window[func_change_wh](x,y,this_portlet,1);

                    layout0_ismove = false;
                }

                //alert($(this.move_target).width());


                //如果改变高度或宽度后可以触发的事件
                if(change_height_div != null){
                    load_portlet_content(change_height_div);
                    //改变大小
                    check_info();
                    window[func_change_wh](x,y,this_portlet,2);

                    change_height_div = null;
                }

            };
            callback.call(this, e);
            $.extend(this, {
                'move': false,
                'move_target': null,
                'call_down': false,
                'call_up': false
            });
            if(move_to_add_portlet){
                add_to_other_layout(move_to_add_portlet_info);
                move_to_add_portlet = false;
                move_to_add_portlet_info = null;
            }
            if(stopbubble){
                check_info();
                check_info_test(2);
                stopbubble = false;
            }
        }
        //alert(stopbubble);
    });

}

//给元素绑定鼠标按下事件
//黄记纲
//2014/11/27
function bind_mouse_down(dom){

    var $box = $(dom).mousedown(function(e) {
        var offset = $(this).offset();
        this.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
        if(((e.pageY - offset.top) < head_height)&&((e.pageX - offset.left) < ($(this).width()-70))){
            $.extend(document, {'move': true, 'move_target': this});
        }
        if(data_portlet.layout == "12"){
            //改变div层级关系
            $(this).parent().append($(this));
        }
        //check_info();
    }).on('mousedown', '.coor', function(e) {

        var posix = {
            'w': $box.width(),
            'h': $box.height(),
            'x': e.pageX,
            'y': e.pageY
        };
        var move_num_ = 0;
        if(posix.x>$($box).offset().left+posix.w-10){
            //右侧
            move_num_ += 1;
        }
        if(posix.y>$($box).offset().top+posix.h-10){
            //下侧
            move_num_ += 2;
        }

        $.extend(document, {'move': true,'move_target': this, 'call_down': function(e) {
            var width_= StandardToGridN(Math.max(parseInt($($box).children(".position_min_w").val()), e.pageX - posix.x + posix.w));
            var height_ = StandardToGridN(Math.max(parseInt($($box).children(".position_min_h").val())+$($box).children(".portlet_header").height(), e.pageY - posix.y + posix.h));

            if(height_ > (parseInt($($box).children(".position_max_h").val())+ $($box).children(".portlet_header").height())){
                height_ = parseInt($($box).children(".position_max_h").val())+ $($box).children(".portlet_header").height();
            }

            if(data_portlet.layout == "12"){

                if(move_num_ == 1){
                    $box.css({
                        'width': Math.min(Math.min(width_,main_width + portlets_div_left - $($box).offset().left),parseInt($($box).children(".position_max_w").val()))
                    });
                }else if(move_num_ == 2){
                    $box.css({
                        //'height': height_
                    });
                }else if(move_num_ == 3){

                    $box.css({
                        'width': Math.min(Math.min(width_,main_width + portlets_div_left - $($box).offset().left),parseInt($($box).children(".position_max_w").val()))
                        //'height': height_
                    });
                }

            }else{
                $box.css({
                    //'height': height_
                });
            }

            $($box).children(".portlet_content").children(".coor_h").height(height_-$($box).children(".portlet_header").height());
            $($box).children(".position_w").val(width_);
            $($box).children(".position_h").val(height_-$($box).children(".portlet_header").height());
            $($box).children(".portlet_content").height(height_-$($box).children(".portlet_header").height());
            change_height_div = $($box);
            check_info();
        }});
        return false;
    });

}
//点击模块设置调用
//黄记纲
//2014/11/27
function set_portlet_info(dom,event){
    var id_ = $(dom).closest(".portlet").find(".hid_id").val();
    var id_info_ = $(dom).closest(".portlet").find(".hid_id").val()+$(dom).closest(".portlet").find(".hid_re_postfix").val();
    $("#set_portlet_id").val(id_);
    $("#set_portlet_infoid").val(id_info_);

//	var h_height = ($( window ).height())*0.621;
//	var w_width = 600;
//	
//	if( h_height < STATIC_MSG_HEIGHT ){
//		tb_show("设置","../common/set_portlet_info.html?h="+STATIC_MSG_HEIGHT+"&TB_iframe=true&height=" + STATIC_MSG_HEIGHT +"&width=" + w_width +"","thickbox");    			    	
//	}else{
//		tb_show("设置","../common/set_portlet_info.html?h="+h_height+"&TB_iframe=true&height=" + h_height +"&width=" + w_width +"","thickbox");    			
//		//tb_show("设置","../common/set_portlet_info.html?h="+h_height+"&TB_iframe=true&height=" + h_height +"&width=" + w_width +"","thickbox");    			
//	}
    var this_dialog;
    if(($(dom).closest(".portlet").find(".hid_id").val() == "video")
        ||($(dom).closest(".portlet").find(".hid_id").val()=="music")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "photos")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "my_beike_info")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "my_paper_info")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "my_questions_info")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "my_resource_info")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "toplink")
        ||($(dom).closest(".portlet").find(".hid_id").val() == "my_weike_info")){
        this_dialog=art.dialog.open('../common/set_portlet_info.html', {
            id:'set_port',
            title: '设置',
            height: 400,
            width: 700,
            //zIndex:9990,
            lock:true,
            fixed: true,
            button:[
                {
                    name:'确定',callback:function(){
                    var iframe = this.iframe.contentWindow;
                    if(!iframe.save_setting()){
                        return false;
                    }
                }
                },
                {
                    name:'关闭',callback:function(){

                }
                }
            ],
            close:function(){
                var need_refresh_ = parseInt($("#hid_com_ischange").val()) + parseInt($("#hid_self_ischange").val());
                if(need_refresh_>0)
                    getInnerHTML($("#set_portlet_id").val(),$("#set_portlet_infoid").val(),need_refresh_);

                if(parseInt($("#hid_swf_ischange").val()) == 1){
                    swf_resources_reload(id_ , id_info_);
                }
                $("#hid_com_ischange").val(0);
                $("#hid_self_ischange").val(0);
                $("#hid_swf_ischange").val(0);
            }
        });
    }else{
        this_dialog=art.dialog.open('../common/set_portlet_info.html', {
            id:'set_port',
            title: '设置',
//			height: 420,
            width: 700,
            //zIndex:9990,
            lock:true,
            fixed: true,
            button:[
                {
                    name:'确定',callback:function(){
                    var iframe = this.iframe.contentWindow;
                    if(!iframe.save_setting()){
                        return false;
                    }
                }
                },
                {
                    name:'关闭',callback:function(){

                }
                }
            ],
            close:function(){
                var need_refresh_ = parseInt($("#hid_com_ischange").val()) + parseInt($("#hid_self_ischange").val());
                if(need_refresh_>0)
                    getInnerHTML($("#set_portlet_id").val(),$("#set_portlet_infoid").val(),need_refresh_);

                if(parseInt($("#hid_swf_ischange").val()) == 1){
                    swf_resources_reload(id_ , id_info_);
                }
                $("#hid_com_ischange").val(0);
                $("#hid_self_ischange").val(0);
                $("#hid_swf_ischange").val(0);
            }
        });
    }

    //window.frames["TB_iframeContent"].location.reload(true);
//	art.dialog(
//		    {
//		        content:document.getElementById("set_portlet_info"),
//		        width: 400,
//		        lock:true,
//		        zIndex:9999,
//		        title: '设置',
//		        okVal:'确定',
//		        init: function () {
//		        	document.getElementById("set_portlet_info").contentWindow.load_();
//		        },
//		        style:'succeed noClose',
//			    ok:function(){
//			    	document.getElementById("set_portlet_info").contentWindow.save_setting();
//			    },
//			    button:[
//			         {
//			        	 name:'取消'
//			         }
//			    ]
//		   });
}

//改变模块的高度后改变其他布局（非自由布局）的对应相同宽度模块的高度-也可添加其他改变高度所触发的事件
//黄记纲
//2014/11/27
function load_portlet_content(dom){
    if(data_portlet.layout != "12"){

        var als_ = All_Layout_.layouts;
        //获取每个布局
        //其他布局
        for(var i = 0 ; i < als_.length ; i++){
            if(data_portlet.layout == "12"){
                break;
            }
            if((als_[i].layout == data_portlet.layout)){
                continue;
            }
            var break_for = false;
            var this_layout_c = als_[i].portlets;
            for(var j = 0 ; j < this_layout_c.length ; j++){
                if(break_for){
                    break;
                }
                var this_layout_p = this_layout_c[j];
                for(var k = 0 ; k < this_layout_p.length ; k++){
                    if(((this_layout_p[k].id + this_layout_p[k].re_postfix) == $(dom).attr("id")) && (this_layout_p[k].position.width == $(dom).width())){
                        this_layout_p[k].position.height = $(dom).height() - $(dom).children(".portlet_header").height();
                        break_for = true;
                        break;
                    }
                }
            }
        }
    }
}


//阻止事件冒泡
function stopBubble(e) {
    if(e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        window.event.cancelBubble = true;
    }
    return false;
}

function changeTheme(theme_name){
    if(theme_name == All_Theme_.theme){
        return;
    }

    $("body").attr("class",theme_name + " org_space");
    All_Theme_["theme"] = theme_name;
    check_info_test(1);
}

function getLoginInfo(login_name){
    var login_Info = {};
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),"login_name":login_name},
        url : url_path_action_login + "/person/getPersonBylogin",
        dataType: "json",
        success : function(data) {
            login_Info = data;
        }
    });
    return login_Info;
}

function view_to_openPage(){
    var newUrl = url_path_html + "/html/space/main/main_org.html?to_open=0&orgid="+org_id+"&iid="+orgidentity_id;
    window.open(newUrl);
}
function openMyWorkRoom(){
    if($.cookie("identity_id") == 5){
        var newUrl = url_path_html + "/html/ypt/main/main.html";
        window.open(newUrl);
    }else if($.cookie("identity_id") == 6){
        var newUrl = url_path_html + "/html/yxx/main/main.html";
        window.open(newUrl);
    }
}

function getUserForMe(){

    tb_show("与我相关","../common/myGLUser.html?h="+STATIC_MSG_HEIGHT+"&TB_iframe=true&height=" + STATIC_MSG_HEIGHT +"&width=" + STATIC_MSG_HEIGHT*1.684 +"","thickbox");

}


//flash相关
//2015/1/6
//黄记纲
//var flexPlayer;

//var data = '["http://dsideal-yy.oss-cn-qingdao.aliyuncs.com/1.jpg",' +
//'"http://dsideal-yy.oss-cn-qingdao.aliyuncs.com/Desert.jpg",' +
//'"http://dsideal-yy.oss-cn-qingdao.aliyuncs.com/2222.bmp",' +
//'"http://dsideal-yy.oss-cn-qingdao.aliyuncs.com/a.jpg"]';
function initSwfComplete(id,mediaType)
{
    if(mediaType == 1){
//		flexPlayer.setResource_js(data);
        //alert(id);
        photos_initSwf(id);
    }else if(mediaType == 2){
        music_initSwf(id);
    }else if(mediaType == 3){
        video_initSwf(id);
    }
}
function hasReady()
{
    return dataReady;
}
function thisFlex(movieName)
{
    var isIE;
    if (!!window.ActiveXObject || "ActiveXObject" in window)
    {
        isIE = true;
    }
    else{
        isIE=false;
    }

    var e=document.getElementById(movieName);
    if(isIE)
    {
        return e;
    }else{
        var tar = $("embed[name='"+ movieName +"']")[0];
        return tar;
    }
}//end thisFlex 

/*
 * 计算字符串占用字符数   1汉字=2字符
 * 黄记纲
 * 2015/3/2
 * */
function checkStrLength(str){
    var title_char_num = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i].match(/[^\x00-\xff]/ig) != null)
            title_char_num += 2;
        else
            title_char_num += 1;
    }
    return title_char_num;
}
/*
 * 
 * 获取用户登录名
 * hjg
 * 2015/3/7
 * */
function getUserLoginName(identity_id,person_id){
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),
            "identity_id":identity_id,
            "person_id":person_id
        },
        url : url_path_action_login + "/person/getLoginNameById",
        dataType: "json",
        success : function(data) {
            if(data.success){
                personlogin_name = data.login_name;
            }
        }
    });
}

//加载主题
function main_space_loadTheme(){
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),"person_id":org_id,"identity_id":orgidentity_id},
        url : url_path_action_login + "/space/getSpaceThemeInfo",
        dataType: "json",
        success : function(data) {
            //All_Theme_ = data;
            if(data.success){
                All_Theme_ = data.theme_json;
            }else{
                All_Theme_ = {"theme":"teacher"};
                if(visit_to == 3){
                    $.ajax({
                        type : "POST",
                        async : false,
                        data:{"random_num":creatRandomNum(),"theme_json":JSON.stringify(All_Theme_),"person_id":org_id,"identity_id":orgidentity_id},
                        url : url_path_action + "/space/setSpaceThemeInfo",
                        dataType: "json",
                        success : function(data) {
                            if(data.success){
                                //All_Theme_ = {"theme":"teacher","nowLayout":3};
                            }else{
                                art.dialog.alert(data.info);
                            }
                        }
                    });
                }

            }
        }
    });
}

/*
 * 加载空间模块
 * */
function main_space_load(){
    if(($("#portlets_div").hasClass("sec_div"))){
        $("#portlets_div").removeClass("sec_div");
    }
    $("#banner_login_div").show();
    portlets_div_top = $("#portlets_div").offset().top;
    portlets_div_left = $("#portlets_div").offset().left;
    isSecOrMain = 0;
    var infoFlag = false;
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),"person_id":org_id,"identity_id":orgidentity_id},
        url : url_path_action_login + "/space/getSpaceInfo",
        dataType: "json",
        success : function(data) {
            if(data.success){
                All_Layout_ = data.result;
                infoFlag = true;
            }
        }
    });
    if(infoFlag == false){
        return false;
    }
    //All_Theme_ = {"theme":"student","nowLayout":3};
    if(!!!(All_Layout_.layouts) || !!!(All_Layout_) || All_Layout_ == {}){
        updataTs();
        All_Layout_ = {"nowLayout":"2","layouts":
            [
                {"layout":"1","portlets":[[],[],[]]},
                {"layout":"2","portlets":[[],[]]},
                {"layout":"3","portlets":[[],[]]},
                {"layout":"4","portlets":[[],[]]},
                {"layout":"5","portlets":[[],[],[]]},
                {"layout":"6","portlets":[[],[],[],[]]},
                {"layout":"7","portlets":[[],[],[]]},
                {"layout":"8","portlets":[[],[],[]]},
                {"layout":"9","portlets":[[],[],[]]},
                {"layout":"10","portlets":[[],[],[],[]]},
                {"layout":"11","portlets":[[],[],[],[],[]]},
                {"layout":"12","portlets":[[]]}
            ],
            "ALL_Setting":{}
        };

        //初始化机构模块模块
        initAllLayout(2);
//		ALL_Setting = All_Layout_.ALL_Setting;
//		check_info_test(2);
    }

    if(!!!(All_Layout_.ALL_Setting)){
        All_Layout_['ALL_Setting'] = {};
    }
    ALL_Setting =All_Layout_.ALL_Setting;
    //假定传回来的值 然后拼出这个串
    All_Layout_.nowLayout = All_Layout_.nowLayout || 1;
    data_portlet = All_Layout_.layouts[parseInt(All_Layout_.nowLayout)-1];
    //判断公有私有  检查菜单项 ---个人和机构获取方式不一样
    var check_del_info = has_portlet;
    var check_del_array = [];
    for(k in check_del_info[0]){
        // console.log(JSON.stringify(check_del_info[0][k]));
        //console.log(k+"||||||"+JSON.stringify(check_del_info[0][k]));
        $(check_del_info[0][k]).each(function(){
            check_del_array.push(this.id);
        });
    }
    var visit_portlet = {};
    visit_portlet["layout"] = data_portlet.layout;
    visit_portlet["portlets"] = [];
    var portlets = data_portlet.portlets;
    $(portlets).each(function(index){
        var num_l = 0;
        visit_portlet["portlets"].push([]);
        $(portlets[index]).each(function(i){
            //0私有1公有
            var this_p = portlets[index];
            //alert(this_p[i].id + this_p[i].re_postfix +"**" + ALL_Setting[""+this_p[i].id + this_p[i].re_postfix].com_setting.isopen);
            if(visit_portlet["portlets"][index] == undefined){
                visit_portlet["portlets"][index] = [];
            }
            if((visit_to != 3 || openPage == 0)) {
                if (ALL_Setting["" + this_p[i].id + this_p[i].re_postfix].com_setting.isopen == 1 && check_del_array.indexOf(this_p[i].id) != -1) {
                    visit_portlet["portlets"][index][num_l] = this_p[i];
                    num_l++;
                }
            }else{
                if(check_del_array.indexOf(this_p[i].id) != -1){
                    visit_portlet["portlets"][index][num_l] = this_p[i];
                    num_l++;
                }
            }
        });
        num_l = 0;
    });
    data_portlet = visit_portlet;
    $("#layout_hid_id").val(data_portlet.layout);
    //判断访问模式
    change_iframe(0);
    return true;
}
/*
 * 加载导航
 * */
function main_nav_load(){
    ["space_nav_info"].loadTemplates("../../../html/space/tpl/common/",function(){
    	//加载固定导航
    	var fixhtml = "";
    	if(orgidentity_id == "105"){
    		fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/class.html?orgid="+org_id+"&iid="+orgidentity_id+"'>首页</a></li>";
    		//if($.cookie("person_id") && $.cookie("identity_id")){
    		//	fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/main.html'>我的空间</a></li>";
    		//}
        }else if(orgidentity_id == "106"){
        	fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/group.html?orgid="+org_id+"&iid="+orgidentity_id+"'>首页</a></li>";
        	fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/group_blog.html?orgid="+org_id+"&iid="+orgidentity_id+"'>文章</a></li>";
        	//fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/group_res.html?orgid="+org_id+"&iid="+orgidentity_id+"'>资源</a></li>";
        	//fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/group_member.html?orgid="+org_id+"&iid="+orgidentity_id+"'>群组信息</a></li>";
        }else if(orgidentity_id == "107"){
        	fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/work.html?orgid="+org_id+"&iid="+orgidentity_id+"'>首页</a></li>";
        	fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/work_blog.html?orgid="+org_id+"&iid="+orgidentity_id+"'>文章</a></li>";
        	//fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/group_res.html?orgid="+org_id+"&iid="+orgidentity_id+"'>资源</a></li>";
        	//fixhtml += "<li class='outli'><a target='_self' href='../../../html/space/main/group_member.html?orgid="+org_id+"&iid="+orgidentity_id+"'>群组信息</a></li>";
        }
    	$("#navul_space").append(fixhtml);
    	
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "a_id":org_id,
                "a_identity_id":orgidentity_id,
                "a_type":"spacenav"
            },
            url : url_path_action_login + "/space/getAJson",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['list'] = data.a_json;
                    innerHTML['base64Encode'] = base64Encode;
                    var html = template('space_nav_info', innerHTML);
                    $("#navul_space").append(html);
                }
                //======================================================
                $("#navul_space > li").not(".navhome").hover(function(){
                    $(this).addClass("navmoon");
                },function(){
                    $(this).removeClass("navmoon");
                });

                $.fn.capacityFixed = function(options) {
                    var opts = $.extend({},$.fn.capacityFixed.deflunt,options);

                    var FixedFun = function(element) {
                        var top = opts.top;

                        element.css({
                            "top":top
                        });
                        $(window).scroll(function() {
                            var scrolls = $(this).scrollTop();
                            if (scrolls > top) {

                                if (window.XMLHttpRequest) {
                                    element.css({
                                        position: "fixed",
                                        top: 0
                                    });
                                } else {
                                    element.css({
                                        top: scrolls
                                    });
                                }
                            }else {
                                element.css({
                                    position: "absolute",
                                    top: top
                                });
                            }
                        });
                        element.find(".close-ico").click(function(event){
                            element.remove();
                            event.preventDefault();
                        });
                    };
                    return $(this).each(function() {
                        FixedFun($(this));
                    });
                };
                $.fn.capacityFixed.deflunt={
                    right : 0,//相对于页面宽度的右边定位
                    top: 0
                };
            },
            error : function(){

            }
        });
    });
}

function openToguanli(){
    var newUrl = url_path_html + "/html/social/main_set/main_set.html?space_type=2&orgid="+org_id+"&iid="+orgidentity_id;
    window.open(newUrl);
}

//向页面添加模块
//page--添加的模块id dom--  posit--是否是拖动添加
//黄记纲
//2014/11/27
function orgadd_portlet_action(page,dom_class,posit){
    //
    loadScripts(["../../../js/space/portlets/"+page+"_main.js"], 0, function() {

        //alert(dom_class);
        if (dom_class == 0) {
            return;
        }

        //此处添加模块初始化信息
        var func_info = page + "_initInfo";
        var all_info = window[func_info]();
//	all_info['person_info'] = {"id":"person_info","re_postfix":"","name":"个人信息",
//			"position":{"top":0,"left":0,"width":320,"height":100,"min_w":150,"min_h":90,"max_w":500,"max_h":400}};
//	all_info['photo_info'] = {"id":"photo_info","re_postfix":"","name":"图片信息",
//			"position":{"top":0,"left":0,"width":320,"height":220,"min_w":150,"min_h":90,"max_w":500,"max_h":400}};
//	all_info['resource_info'] = {"id":"resource_info","re_postfix":"","name":"资源信息",
//			"position":{"top":0,"left":0,"width":320,"height":220,"min_w":200,"min_h":200,"max_w":500,"max_h":400}};
//	all_info['resourcetome_info'] = {"id":"resourcetome_info","re_postfix":"","name":"推荐给我的资源信息",
//			"position":{"top":0,"left":0,"width":320,"height":220,"min_w":200,"min_h":200,"max_w":500,"max_h":400}};
//	all_info['resourceIrecommend_info'] = {"id":"resourceIrecommend_info","re_postfix":"","name":"我推荐的资源信息",
//			"position":{"top":0,"left":0,"width":320,"height":220,"min_w":200,"min_h":200,"max_w":500,"max_h":400}};
//	all_info['my_resource_info'] = my_resource_info_initInfo['my_resource_info'];

        var page_info = all_info[page + "_initinfo"];

        page_info.re_postfix = creatRandomNum_space();

        var iframe_main_div = $("#portlets_div");
        var p_html = "";

        if (data_portlet.layout == "12") {

            var info = put_portletTOLayout12(page_info.position.width, page_info.position.height, data_portlet.portlets[0]);

            page_info.position.left = info[0];
            page_info.position.top = info[1];

            p_html += "<div class=\"portlet spacebox-shadow\" id=\"" + page_info.id + page_info.re_postfix + "\" style=\"position: absolute; top: " + (page_info.position.top + portlets_div_top) + "px; left: " + (page_info.position.left + portlets_div_left) + "px; width: " + page_info.position.width + "px; \">";
        } else {
            p_html += "<div class=\"portlet spacebox-shadow portlet_n0 portlet_fix\" id=\"" + page_info.id + page_info.re_postfix + "\" style=\"\">";
        }

        p_html += "<input type=\"hidden\" class=\"hid_id\" value=\"" + page_info.id + "\"/>" +

            "<input type=\"hidden\" class=\"hid_re_postfix\" value=\"" + page_info.re_postfix + "\" />" +
            "<input type=\"hidden\" class=\"hid_name\" value=\"" + page_info.name + "\" />" +

            "<input type=\"hidden\" class=\"position_l\" value=\"" + page_info.position.left + "\" />" +
            "<input type=\"hidden\" class=\"position_t\" value=\"" + page_info.position.top + "\" />" +
            "<input type=\"hidden\" class=\"position_w\" value=\"" + page_info.position.width + "\" />" +
            "<input type=\"hidden\" class=\"position_h\" value=\"" + page_info.position.height + "\" />" +

            "<input type=\"hidden\" class=\"position_min_w\" value=\"" + page_info.position.min_w + "\" />" +
            "<input type=\"hidden\" class=\"position_min_h\" value=\"" + page_info.position.min_h + "\" />" +
            "<input type=\"hidden\" class=\"position_max_w\" value=\"" + page_info.position.max_w + "\" />" +
            "<input type=\"hidden\" class=\"position_max_h\" value=\"" + page_info.position.max_h + "\" />" +

            "<div class=\"portlet_header\" id=\"portlet_header_" + page_info.id + page_info.re_postfix + "\">" +
            "<h2 class=\"space_h2_bg\" title=\"" + page_info.name + "\"><span class=\"portlet_name h2_title\"><span style='margin:0px;height:100%;'>" + page_info.name + "</span></span>" +
            "<div>" +
            "<span title=\"删除\" onclick=\"delete_portlet(this,event);\" class='head_r portlet-del'><img src=\"../../../images/space/icon_chab.png\"/></span>" +
            "<span title=\"收起\" onclick=\"click_toggle(this,1,event);\" class='head_r toggle_hide portlet-toggle'><img src=\"../../../images/space/icon_jianb.png\"/></span>" +
            "<span title=\"展开\" onclick=\"click_toggle(this,2,event);\" class='head_r toggle_show portlet-toggle' style=\"display:none;\"><img src=\"../../../images/space/icon_jiab.png\"/></span>" +
            "<span title=\"设置\" onclick=\"set_portlet_info(this,event);\" class='head_r portlet-set'><img src=\"../../../images/space/icon_shezhib.png\"/></span>" +
            "</div>" +
            "</h2>" +
            "</div>" +
            "<div class=\"portlet_content\" id=\"portlet_content_" + page_info.id + "" + page_info.re_postfix + "\" style=\"position:relative;height:" + page_info.position.height + "px;\">" +
            "<div id=\"portlet_innerHtml_" + page_info.id + "" + page_info.re_postfix + "\" class=\"portlet_innerHtml\"></div>";
        if (data_portlet.layout == "12") {
            p_html += "<div class='coor coor_h' id=\"coor_" + page_info.id + page_info.re_postfix + "\" style='width:10px;height:" + page_info.position.height + "px;cursor: e-resize;'></div>";
            p_html += "<div class='coor' id=\"coor_" + page_info.id + page_info.re_postfix + "\" style='width:100%;height:10px;cursor: s-resize;'></div>";
            p_html += "<div class='coor' id=\"coor_" + page_info.id + page_info.re_postfix + "\" style='width:10px;height:10px;cursor: se-resize;'></div>";
            p_html += "</div>" + "</div>";
        } else {
            p_html += "<div class='coor' id=\"coor_" + page_info.id + page_info.re_postfix + "\" style='height: 10px;width:100%;cursor: n-resize;'></div>";
            p_html += "</div>" + "</div>";
        }

        //自由布局和固定布局的不同添加方式
        if (data_portlet.layout == "12") {
            iframe_main_div.append(p_html);
        } else {
            var this_eqnum = 0;
            var all_col = iframe_main_div.find(".column");

            all_col.each(function (i) {
                if (i == 0) {
                    this_eqnum = 0;
                } else {
                    this_eqnum = $(all_col[i]).find(".portlet").length < $(all_col[i - 1]).find(".portlet").length ? i : this_eqnum;
                }
            });

            if (!!posit) {
                move_to_add_portlet = true;
                move_to_add_portlet_info = page_info;
                iframe_main_div.find(".column").eq(this_eqnum).prepend(p_html).css("height", "auto");
            } else {
                iframe_main_div.find(".column").eq(this_eqnum).append(p_html).css("height", "auto");
            }
        }
        if (!move_to_add_portlet) {
            add_to_other_layout(page_info);
        }
        getInnerHTML(page_info.id, page_info.id + page_info.re_postfix, 3);

        //给添加的模块绑定拖动事件
        //判断是否是拖出来的div
        bind_mouse_down($("#" + page_info.id + page_info.re_postfix));
        if (!!posit) {
            check_info();
            each_bind_function($("#" + page_info.id + page_info.re_postfix));
        } else {
            check_info();
            check_info_test(2);
        }

        //each_bind_function($("#"+page_info.id + page_info.re_postfix));
    });
}
/**
 * 二级页之机构信息二级页展示
 * hjg
 * 2015/4/22
 * */
function getSecPage_org_selfInfo(){
//	$("#portlets_div").empty();
    if(!($("#portlets_div").hasClass("sec_div"))){
        $("#portlets_div").addClass("sec_div");
    }
    //当前是2级页
    isSecOrMain = 1;
    $("#banner_login_div").hide();
    $("#portlets_div").empty();
    $("#portlets_div").html("<div style='line-height:50px;background-color:#FFFFFF;width:100%;padding:10px;'>"+Base64.decode(org_info_['org_description_text'])+"</div>");


}
/**
 * 二级页之优秀学校二级页展示
 * hjg
 * 2015/4/22
 * */
function getMoreGoodSchoolSpace(){
//	$("#portlets_div").empty();
    ["sec_org_goodSchool_inner"].loadTemplates("../../../html/space/tpl/org/",function(){
        if(!($("#portlets_div").hasClass("sec_div"))){
            $("#portlets_div").addClass("sec_div");
        }
        //当前是2级页
        isSecOrMain = 1;
        $("#banner_login_div").hide();
        $("#portlets_div").empty();
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "org_id":org_id,
                "identity_id":orgidentity_id,
                "type":1,
                "limit":999},
            url : url_path_action_login + "/space/getSpacePortlet",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['list'] = data.list;
                    innerHTML['getSpaceUserPhoto'] = getSpaceOrgPhoto;
                    var html = template('sec_org_goodSchool_inner', innerHTML);
                    $("#portlets_div").html(html);
                }else{
                    var innerHTML = {};
                    innerHTML['list'] = [];
                    var html = template('sec_org_goodSchool_inner', innerHTML);
                    $("#portlets_div").html(html);
                }
            },
            error : function(){
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('sec_org_goodSchool_inner', innerHTML);
                $("#portlets_div").html(html);
            }
        });
    });
}
//跳转到机构空间
function openToOrgSpace(id,type){
    var newUrl = url_path_html + "/html/space/main/main_org.html?orgid="+id+"&iid="+type;
    window.open(newUrl);
}
//跳转到个人空间
function openToPerSpace(id,iid){
    var newUrl = url_path_html + "/html/space/main/main.html?id="+id+"&identity_id="+iid;
    window.open(newUrl);
}
/**
 * 二级页之优秀班级二级页展示
 * hjg
 * 2015/4/22
 * */
function getMoreGoodClassSpace(){
    ["sec_org_goodClass_inner"].loadTemplates("../../../html/space/tpl/org/",function(){
        if(!($("#portlets_div").hasClass("sec_div"))){
            $("#portlets_div").addClass("sec_div");
        }
        //当前是2级页
        isSecOrMain = 1;
        $("#banner_login_div").hide();
        $("#portlets_div").empty();
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "org_id":org_id,
                "identity_id":orgidentity_id,
                "type":2,
                "limit":999},
            url : url_path_action_login + "/space/getSpacePortlet",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['list'] = data.list;
                    innerHTML['getSpaceUserPhoto'] = getSpaceOrgPhoto;
                    var html = template('sec_org_goodClass_inner', innerHTML);
                    $("#portlets_div").html(html);
                }else{
                    var innerHTML = {};
                    innerHTML['list'] = [];
                    var html = template('sec_org_goodClass_inner', innerHTML);
                    $("#portlets_div").html(html);
                }
            },
            error : function(){
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('sec_org_goodClass_inner', innerHTML);
                $("#portlets_div").html(html);
            }
        });
    });
}
/**
 * 二级页之优秀教师二级页展示
 * hjg
 * 2015/4/22
 * */
function getMoreGoodTeacherSpace(){
    ["sec_org_goodTeacher_inner"].loadTemplates("../../../html/space/tpl/org/",function(){
//	$("#portlets_div").empty();
        if(!($("#portlets_div").hasClass("sec_div"))){
            $("#portlets_div").addClass("sec_div");
        }
        //当前是2级页
        isSecOrMain = 1;
        $("#banner_login_div").hide();
        $("#portlets_div").empty();
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "org_id":org_id,
                "identity_id":orgidentity_id,
                "type":3,
                "limit":999},
            url : url_path_action_login + "/space/getSpacePortlet",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['list'] = data.list;
                    innerHTML['getSpaceUserPhoto'] = getSpaceUserPhoto;
                    var html = template('sec_org_goodTeacher_inner', innerHTML);
                    $("#portlets_div").html(html);
                }else{
                    var innerHTML = {};
                    innerHTML['list'] = [];
                    var html = template('sec_org_goodTeacher_inner', innerHTML);
                    $("#portlets_div").html(html);
                }
            },
            error : function(){
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('sec_org_goodTeacher_inner', innerHTML);
                $("#portlets_div").html(html);
            }
        });
    });
}
/**
 * 二级页之优秀学生二级页展示
 * hjg
 * 2015/4/22
 * */
function getMoreGoodStudentSpace(){
    ["sec_org_goodStudent_inner"].loadTemplates("../../../html/space/tpl/org/",function(){
//	$("#portlets_div").empty();
        if(!($("#portlets_div").hasClass("sec_div"))){
            $("#portlets_div").addClass("sec_div");
        }
        //当前是2级页
        isSecOrMain = 1;
        $("#banner_login_div").hide();
        $("#portlets_div").empty();
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "org_id":org_id,
                "identity_id":orgidentity_id,
                "type":4,
                "limit":999},
            url : url_path_action_login + "/space/getSpacePortlet",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['list'] = data.list;
                    innerHTML['getSpaceUserPhoto'] = getSpaceUserPhoto;
                    var html = template('sec_org_goodStudent_inner', innerHTML);
                    $("#portlets_div").html(html);
                }else{
                    var innerHTML = {};
                    innerHTML['list'] = [];
                    var html = template('sec_org_goodStudent_inner', innerHTML);
                    $("#portlets_div").html(html);
                }
            },
            error : function(){
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('sec_org_goodStudent_inner', innerHTML);
                $("#portlets_div").html(html);
            }
        });
    });
}
/**
 * 二级页之通知公告二级页展示
 * hjg
 * 2015/4/22
 * */
function getMoreNews(d){
    ["sec_org_news_inner"].loadTemplates("../../../html/space/tpl/org/",function(){
        if(!($("#portlets_div").hasClass("sec_div"))){
            $("#portlets_div").addClass("sec_div");
        }
        //当前是2级页
        isSecOrMain = 1;
        $("#banner_login_div").hide();
        $("#portlets_div").empty();

        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "a_id":org_id,
                "a_identity_id":orgidentity_id
            },
            url : url_path_action_login + "/space/getNewsRegisterId",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    if(data.flag == 1){

                        $.ajax({
                            type : "GET",
                            async : false,
                            data:{"random_num":creatRandomNum(),
                            	"register_id":data.regist_id,
    							"page_number":d,
                                "page_size":15
                            },
                            url : url_path_action_login + "/notice/getNoticeList",
                            dataType: "json",
                            success : function(data) {
                                if(data.success){
                                    var innerHTML = {};
                                    innerHTML['list'] = data.list;
                                    innerHTML['data'] = data;
                                    innerHTML['base64Encode'] = base64Encode;
                                    var html = template('sec_org_news_inner', innerHTML);
                                    $("#portlets_div").html(html);
                                }else{
                                    var innerHTML = {};
                                    innerHTML['list'] = [];
                                    var html = template('sec_org_news_inner', innerHTML);
                                    $("#portlets_div").html(html);
                                }
                            },
                            error : function(){
                                var innerHTML = {};
                                innerHTML['list'] = [];
                                var html = template('sec_org_news_inner', innerHTML);
                                $("#portlets_div").html(html);
                            }
                        });
                    }else{
                        var innerHTML = {};
                        innerHTML['list'] = [];
                        var html = template('sec_org_news_inner', innerHTML);
                        $("#portlets_div").html(html);
                    }
                }else{
                    var innerHTML = {};
                    innerHTML['list'] = [];
                    var html = template('sec_org_news_inner', innerHTML);
                    $("#portlets_div").html(html);
                }
            },
            error : function(){
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('sec_org_news_inner', innerHTML);
                $("#portlets_div").html(html);
            }
        });

    });

}

// 二级页之机构新闻详细二级页展示
function getSecPage_newsInfo(regist_id, news_id){
//	$("#portlets_div").empty();
    if(!($("#portlets_div").hasClass("sec_div"))){
        $("#portlets_div").addClass("sec_div");
    }
    //当前是2级页
    isSecOrMain = 1;
    $("#banner_login_div").hide();
    $("#portlets_div").empty();
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),
            "regist_id":regist_id,
            "column_id":-1,
            "id":news_id
        },
        url : url_path_action_login + "/news/getNewsInfoById",
        dataType: "json",
        success : function(data) {
            if(data.success){
                var html = "<div style='line-height:50px;background-color:#FFFFFF;width:100%;padding:10px;'>" +
                    "<div style='height:50px;line-height:50px; font-weight:500;font-size:32px;width:100%;text-align:center;'>"+ data.title+"</div>" +
                    "<div>"+data.content+"</div></div>";
                $("#portlets_div").html(html);
            }else{
                var html = "<div style='text-align:center;line-height:50px;background-color:#FFFFFF;width:100%;height:50px;'>新闻信息读取失败</div>";
                $("#portlets_div").html(html);
            }
        },
        error : function(){
            var html = "<div style='text-align:center;line-height:50px;background-color:#FFFFFF;width:100%;height:50px;'>新闻信息读取失败</div>";
            $("#portlets_div").html(html);
        }
    });


}

/*
 * 首页加载关注访客信息
 * */
function getAttentionAndVisitor(){
    var json={};
    json['b_personid'] = org_id;
    json['b_identityid'] = orgidentity_id;
    if($.cookie("person_id")){
        json['personid'] = $.cookie("person_id");
        json['identityid'] = $.cookie("identity_id");
    }else{
        json['personid'] = "";
        json['identityid'] = "";
    }
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),
            "type": "space",
            "personid":json['personid'],
            "identityid":json['identityid'],
            "b_personid":json['b_personid'],
            "b_identityid":json['b_identityid']
        },
        url : url_path_action_login + "/space/attention/get",
        dataType: "json",
        success : function(data) {
        },
        error : function(){
        }
    });

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
function swf_resources_reload(id,id_info){
    var obj_id;
    var isIE;
    if (!!window.ActiveXObject || "ActiveXObject" in window)
    {
        isIE = true;
    }
    else{
        isIE=false;
    }

    if(isIE)
    {
        obj_id = $("#portlet_content_"+id_info).find("object").attr("id");
    }else{
        obj_id = $("#portlet_content_"+id_info).find("embed").attr("name");
    }

    if((!$("#"+obj_id).is(':visible'))&&((id=="photos")||(id=="music"))){
        $("#portlet_content_"+id_info).find(".review_img").css("display","none");
        $("#portlet_content_"+id_info).find("object").css("display","block");
        $("#portlet_content_"+id_info).find("embed").css("display","block");
    }else{
        var func_load = id + "_initSwf";
        window[func_load](obj_id);
    }
}

//模块显示的内容   参数d  当d==1时需要新加载数据   d==0时 直接读取开始获得的数据
//黄记纲
//2014/11/27
function getInnerHTML(id,id_info,d){
    //alert(JSON.stringify(ALL_Setting));
    //alert((ALL_Setting[''+id_info]));
    //设置(如果ALL_Setting中没有指定的模块设置信息，那么调用下面代码给模块一个初始化的设置信息)
    //此处添加模块初始化设置信息
//	var init_setting = {
//			"resource_info":{"com_setting":{"portlet_title":"资源信息","view_head":"1"},"self_setting":{"msg_num":"15"}},
//			"resourcetome_info":{"com_setting":{"portlet_title":"推荐给我的资源信息","view_head":"1"},"self_setting":{"msg_num":"15"}},
//			"resourceIrecommend_info":{"com_setting":{"portlet_title":"我推荐的资源信息","view_head":"1"},"self_setting":{"msg_num":"15"}},
//			"my_resource_info":my_resource_info_initInfo['my_resource_initset']
//	};
    var func_init = id + "_initInfo";
    //判断后决定是否需要加载js
    //console.log(func_init+"||||"+typeof window[func_init])
    //加载成功后回调继续执行
    loadScripts(["../../../js/space/portlets/"+id+"_main.js"], 0, function(){

        if(typeof(ALL_Setting[''+id_info]) == "undefined" || !!!(ALL_Setting[''+id_info])){
            var init = window[func_init]();
            ALL_Setting[""+id_info]=init[id + '_initset'];
        }
        //通用刷新
        if(d == 1 || d>=3){


            $("#portlet_header_"+id_info).find(".portlet_name").text(Base64.decode(ALL_Setting[''+id_info].com_setting.portlet_title));
            $("#portlet_header_"+id_info).find(".space_h2_bg").attr("title",Base64.decode(ALL_Setting[''+id_info].com_setting.portlet_title));

            //alert($("#portlet_header_"+id_info).children(".portlet_name").val());

            if(ALL_Setting[''+id_info].com_setting.view_head == "0"){
                $("#portlet_header_"+id_info).hide();
                if($.browser.msie) {
                    $("#portlet_header_"+id_info).height($("#portlet_header_"+id_info).height() - head_height);
                }

                $("#"+id_info).bind("mouseover",function(){
                    $("#portlet_header_"+id_info).show();
                    if($.browser.msie) {
                        $("#portlet_header_"+id_info).height($("#portlet_header_"+id_info).height() + head_height);
                    }
                }).bind("mouseleave",function(){
                    $("#portlet_header_"+id_info).hide();
                    if($.browser.msie) {
                        $("#portlet_header_"+id_info).height($("#portlet_header_"+id_info).height() - head_height);
                    }
                });

            }else{
                $("#portlet_header_"+id_info).show();
                if($.browser.msie) {
                    $("#portlet_header_"+id_info).height($("#portlet_header_"+id_info).height() + head_height);
                }
                $("#"+id_info).unbind("mouseover");
                $("#"+id_info).unbind("mouseleave");
            }
        }
        //个性设置
        if( d == 4 && gzipFlag == 1){
            var func_inner = id + "_initInnerHTML";
            window[func_inner](ALL_Setting[''+id_info],id,id_info);
            var func_afterInit = id + "_afterInit";
            window[func_afterInit](id,id_info);
        }else if( d >= 2 ){
            var func_inner = id + "_innerHTML";
            window[func_inner](ALL_Setting[''+id_info],id,id_info);
            var func_afterInit = id + "_afterInit";
            window[func_afterInit](id,id_info);
        }
    });



}
//删除模块
//黄记纲
//2014/11/27
function delete_portlet(dom,event){
    var portlet_name = $(dom).closest(".space_h2_bg").children(".portlet_name").text();
    art.dialog(
        {
            content:'确认删除\"'+portlet_name+'\"?',
            width: 300,
            lock:true,
            zIndex:9999,
            icon: 'warning',
            title: '提示',
            okVal:'确定',
            style:'succeed noClose',
            close:function(){

            }
        },
        function(){
            //删除
            var icon = $(dom).closest(".portlet");
            var id = $(icon).find(".hid_id").val();
            var re_postfix = $(icon).find(".hid_re_postfix").val();
            //delete ALL_Setting[''+icon.attr("id")];
            icon.remove();
            //删除其他布局的指定模块
            var als_ = All_Layout_.layouts;
            //获取每个布局
            $(als_).each(function(i){
                var this_layout_c = als_[i].portlets;
                //获取布局下的列信息
                $(this_layout_c).each(function(j){
                    var this_layout_p = this_layout_c[j];
                    //遍历列里的portlet
                    $(this_layout_p).each(function(k){
                        if((this_layout_p[k].id + this_layout_p[k].re_postfix) == ($(dom).closest(".portlet").attr("id"))){
                            this_layout_p.splice(k , 1);
                            return false;
                        }
                    });
                });
            });

            var func_dele = id + "_AfterDelete";
            window[func_dele](id,re_postfix);

            check_info();
            check_info_test(2);
            if(!!$.fn.zTree){
                load_add_tree();
            }
            $(window).trigger("resize");
        },
        function(){

        }

    );
}
/**
 * 显示全部
 * 参数：type（1--资源 2--试卷 4--备课 5--微课 6--云盘 7--作业）;deal_type（功能：1--显示全部 2--上传）
 * 2014-12-16
 * 姜莹莹
 */
function showYpt(type,deal_type){
    if(type == 1){
        $.cookie("res_yunormy",2,{path:"/"});
        $.cookie("menu_value_cookie",1,{path:"/"});
    }else if(type == 2){
        $.cookie("juan_yunormy",2,{path:"/"});
        $.cookie("menu_value_cookie",2,{path:"/"});
    }else if(type == 4){
        $.cookie("bk_yunormy",2,{path:"/"});
        $.cookie("menu_value_cookie",10,{path:"/"});
    }else if(type == 5){
        $.cookie("wk_yunormy",2,{path:"/"});
        $.cookie("menu_value_cookie",12,{path:"/"});
    }else if(type == 6){
        $.cookie("menu_value_cookie",11,{path:"/"});
    }else if(type == 7){
        $.cookie("menu_value_cookie",13,{path:"/"});
    }
    window.open("../../ypt/main/main.html");
}
function showYpt_Stu(type){
    window.open("../../yxx/main/main.html?system_id="+type);
}
//解码
function base64Encode(oldStr){
    var newStr = Base64.decode(oldStr);
    return newStr;
}
//清除空格
function trimStr(oldStr){
    return $.trim(oldStr);
}
//截取字符串 取前d个字符串
//d -->
function subStr(oldStr,d){
    return oldStr.substr(0 , d);
}

function getGzip(pid,iid){
    var str = "";
    if(visit_to != 3 || openPage == 0){
        str = "_data_no_login.json?login=0";
    }else{
        str = "_data.json?login=1";
    }
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),"person_id":person_id,"identity_id":identity_id},
        url : url_path_action_login + "/space/baktools/space_"+pid+"_"+iid+ str,
        dataType: "json",
        success : function(data) {
            gzipJson = data;
        },
        error : function(){

        }
    });
}
function getInteractionGzip(pid,iid){
    var str = "";
    if(visit_to != 3 || openPage == 0){
        str = "_interaction_data_no_login.json?login=0";
    }else{
        str = "_interaction_data.json?login=1";
    }
    $.ajax({
        type : "GET",
        async : false,
        data:{"random_num":creatRandomNum(),"person_id":person_id,"identity_id":identity_id},
        url : url_path_action_login + "/space/interaction/space_"+pid+"_"+iid+ str,
        dataType: "json",
        success : function(data) {
            interactionGzipJson = data;
        },
        error : function(){

        }
    });
}

function tb_remove_after(){
    if(!!art.dialog.list['set_port']){
        art.dialog.list['set_port'].show();
    }
}

var SpaceMain = {
	    delete_portlet : delete_portlet,
	    click_toggle : click_toggle,
	    getInnerHTML : getInnerHTML,
	    check_info_test : check_info_test,
	    set_portlet_info : set_portlet_info,
	    click_to_add_portlet : click_to_add_portlet,
	    changeLayout : changeLayout
	};
