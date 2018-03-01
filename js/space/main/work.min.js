
window.onload = function() {
    
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

