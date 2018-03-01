
window.onload = function() {
    var to_open = GetQueryString("to_open");
    org_id = GetQueryString("orgid");
    orgidentity_id = GetQueryString("iid");

    //确定访问哪个机构
    //1.登录状态
    if($.cookie("person_id") && $.cookie("identity_id")){
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
        isOrgAdmin();
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

    person_id = org_id;
    identity_id = orgidentity_id;
    //如果是管理员
    if(is_admin == 1){
        //$("#space_head").css("visibility","visible");
        $("#space_head").show();
        $(".coor").css("cursor","n-resize");
        $(".portlet_header").css("cursor","move");
        $(".portlet_header .space_h2_bg").children("div").show();
        $(".coor_h").css("cursor","e-resize");

        $("#person_name").html($.cookie("person_name")+"&nbsp;&nbsp;<span class=\"caret\"></span>");
        load_add_tree();

        $("#add_portlets_ul").click(function(){
            return false;
        });
    }

    if(to_open == "0"){
        openPage = 0;
    }
    $("#space_common").loadSpaceCommon({
        id: org_id,
        identity_id: orgidentity_id,
        is_admin: 1//is_admin
    });
    var getInfoFlag = main_space_load();
    if(getInfoFlag == false){
        return false;
    }
    //初始化样式
    initCss();

    //加载fancybox页面样式
    $(".fancybox").fancybox({
        maxWidth:1200,
        width:950,
        openEffect: 'none',
        closeEffect: 'none',
        afterShow: function() {
            $(this.wrap).css("z-index","99").parent().css("z-index","98");
        }
    });
    //flash准备状态
    dataReady = true;

    if(visit_to == 3 && orgidentity_id < 105){
        //获取好友请求信息
        getFriendsMsg();
    }
    $("#friends_notices_message").live("mouseover",function () {
        if(visit_to != 3) return false;
        if($("#message_num").text() != 0){
            $(".messages_box").stop(true, true).fadeIn(0,function(){});
        }
    }).live("mouseout",function () {
        if(visit_to != 3) return false;
        $(".messages_box").fadeOut(100, function () {
            $(".messages_box").css("display", "none");
        });
    });
    $(window).scroll(function(e){
        b();
    });
    a(10,10);//#tbox的div距浏览器底部和右侧的距离
    b();
    $('#gotop').click(function(){
        $(document).scrollTop(0);
    });
};

