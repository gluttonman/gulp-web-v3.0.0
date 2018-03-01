function showVideoInfo(title,href){
    tb_show("当前视频："+title,href + "&TB_iframe=true&height=520&width=820","thickbox");
}

function showResourceInfo(title,href){
    var str = "";
    if(href.indexOf("?") > 0){
        str = "&";
    }else{
        str = "?";
    }
    tb_show("当前资源："+title,href + str + "TB_iframe=true&height=520&width=820","thickbox");
}

function showResourceById(title,id){
    var href = url_path_html + "/yx/html/showYptNsResource.html?id=" + id + "&t=" + Math.random();
    //tb_show("当前资源："+title,href + "&TB_iframe=true&height=520&width=820","thickbox");
    art.dialog.open(href, {
        title: title,
        height: 550,
        width: 850,
        zIndex:9999,
        lock:true
    });
}


function openResourcePage(url){
    window.open(url_path_html + "/yx/html/showResource.html?u=" + url);

}

function render_resourcePage(data,serviceName){
    if(null != data.list && data.list.length > 0){
        data = addServerUrlToJson(data);
        upDataToJson(data,1);
        beforeRender(data);
        var person_id_ = $.cookie("person_id");
        for(var i = 0; i < data.list.length;i++){
            //检测资源所有人是不是自己
            if(data.list[i].person_id == person_id_){
                data.list[i].is_mine = true;
            }else{
                data.list[i].is_mine = false;
            }
        }
        if(undefined != $.cookie("person_id") && "null" != $.cookie("person_id")){
            data.isLogin = true;
        }else{
            data.isLogin = false;
        }
    }

    var html = template.render(serviceName + 'Page_template', data);
    $("#"+ serviceName + "Page_content").html(html);
}

//显示功能
function showResOperation(iid){
    $("#resBtn_"+iid).css("display","block");
    $("#m_"+iid).mouseover(function(){
        $(this).show();
    }).mouseout(function() {
        $("#resBtn_"+iid).hide();
        $(this).hide();
    });
}

//功能隐藏
function hideResOperation(iid){
    $("#addResBag_"+iid).css("display","none");
    $("#resBtn_"+iid).css("display","none");
    $("#addResZy_"+iid).css("display","none");

}

/**
 * 修改资源信息
 *
 */
function toChangeResource(resource_title,resource_id_int,app_type_id,subject_id,scheme_id_int,structure_code,func){
    $.ajax({
        type : "GET",
        async : false,
        url : url_path_action + "/multiCheck/canRenameObj?obj_type=1&obj_id_int="+resource_id_int,
        dataType: "json",
        success : function(data) {
            if(data.success){
                if(data.can_rename == true){
                    tb_show("标题："+resource_title,url_path_html + "/yx/html/resource/res_edit.html?resource_title="+Base64.encode(resource_title)+"&obj_id_int="+resource_id_int+"&app_type_id="+app_type_id+"&subject_id="+subject_id+"&scheme_id="+scheme_id_int+"&structure_code="+structure_code+"&TB_iframe=true&height=510&width=420","thickbox");
                }else{
                    dialogOk("正在审核或者审核通过，不可以修改。",360,"");
                }
            }
        }
    });
    /*
     var url = url_path_html + "/yx/html/resource/changeResourceName.html?resource_id_int=" + resource_id_int +"&resource_title="+Base64.encode(resource_title);

     var dialog = art.dialog.open(url, {
     id : "toChangeResourceName",
     lock : true,
     title : '修改资源名称',
     width : 400,
     height : 150,
     ok : function() {
     var iframe = this.iframe.contentWindow;
     if (iframe.changeResourceName(resource_id_int)) {//保存数据成功
     dialogClose("修改成功!",3,200);
     if(undefined != func){
     var jscode = new Function(func)();
     }
     }
     }
     });
     */
}

function toChangeResourceName(resource_id_int,resource_title,func){

    var url = url_path_html + "/yx/html/resource/changeResourceName.html?resource_id_int=" + resource_id_int +"&resource_title="+Base64.encode(resource_title);

    var dialog = art.dialog.open(url, {
        id : "toChangeResourceName",
        lock : true,
        title : '修改资源名称',
        width : 400,
        height : 150,
        ok : function() {
            var iframe = this.iframe.contentWindow;
            if (iframe.changeResourceName(resource_id_int)) {//保存数据成功
                dialogClose("修改成功!",3,200);
                if(undefined != func){
                    var jscode = new Function(func)();
                }
            }
        }
    });
}

//执行删除我的上传方法,这个调用云平台的删除功能，这个删除不删除我分享的资源
function resourceDel(resInfoId,resIdInt,func){
    art.dialog.confirm("确定要删除吗？",function(){
        $.ajax({
            type : "POST",
            async : false,
            dataType:"json",
            url : url_path_html + "/ypt/group/deleteResource",
            data : {"resInfoId": resInfoId, "resIdInt":resIdInt, "deleteType":1},//课件 教案 备课 材料
            success : function(data) {
                dialogClose("删除成功!",3,200);
                if(undefined != func){
                    var jscode = new Function(func)();
                }
            }
        });
    });
}
/*
 * 删除我的资源，以及我共享的资源
 *
 * */
function delMyResource(resIdInt, func){
    art.dialog.confirm("确定要删除吗？",function(){
        $.ajax({
            type : "POST",
            async : true,
            dataType:"json",
            url : url_path_html + "/yx/resource/delMyResource",
            data : {"resIdInt":resIdInt},
            success : function(data) {
                dialogClose("删除成功!",3,200);
                if(undefined != func){
                    var jscode = new Function(func)();
                }
            }
        });
    });
}
function delServiceResource(id,func){

    art.dialog.confirm('你确定要删除吗？',function () {
        $.ajax({
            async:true,
            url: url_path_html+"/yx/resource/delServiceResource?math="+Math.random(),
            type:'post',
            data:{
                ids : id
            },
            dataType: 'json',
            success: function(data){
                if(data.success){
                    dialogClose("删除成功！",3,200);
                    setTimeout(function(){
                        if(undefined != func){
                            var jscode = new Function(func)();
                        }
                    },3000);
                }else{
                    dialogClose("删除失败,请稍后再试！",3,200);
                }
            }
        });
    });
}

function delServiceResourceByIdInt(resource_id_int,service_type,service_id,func){

    art.dialog.confirm('你确定要删除吗？',function () {
        $.ajax({
            async:true,
            url: url_path_html+"/yx/resource/delServiceResourceByIdInt?math="+Math.random(),
            type:'post',
            data:{
                ids : resource_id_int,
                service_type : service_type,
                service_id : service_id
            },
            dataType: 'json',
            success: function(data){
                if(data.success){
                    dialogClose("删除成功！",3,200);
                    setTimeout(function(){
                        if(undefined != func){
                            var jscode = new Function(func)();
                        }
                    },3000);
                }else{
                    dialogClose("删除失败,请稍后再试！",3,200);
                }
            }
        });
    });
}

function addServiceResource(resource_id_int,service_type,service_id,bk_type,func){
	art.dialog.confirm('你确定要执行审核操作吗？',function () {
        $.ajax({
            async:true,
            url: url_path_html+"/yx/resource/addServiceResource?math="+Math.random(),
            type:'post',
            data:{
                ids : resource_id_int,
                service_type : service_type,
                service_id : service_id,
                bk_type : bk_type
            },
            dataType: 'json',
            success: function(data){
                if(data.success){
                    dialogClose("审核成功！",3,200);
                    setTimeout(function(){
                        if(undefined != func){
                            var jscode = new Function(func)();
                        }
                    },3000);
                }else{
                    dialogClose("审核失败,请稍后再试！",3,200);
                }
            }
        });
    });
}

//显示下拉功能
function dropdownShow(id){
    var btn_down = $("#" + id).offset().top + $("#" + id).height();
    var q_down = $("#business_content").offset().top + $("#business_content").height();
    var menu_height = q_down - btn_down - 20;

    var m_height = $(".r-menu").height();
    if(m_height == 0){
        m_height = 116;
    }

    if(menu_height < m_height){
        $("#" + id ).next().removeClass("dropdown-menu");
        $("#" + id ).next().addClass("dropup-menu");
    }else{
        $("#" + id ).next().removeClass("dropup-menu");
        $("#" + id ).next().addClass("dropdown-menu");
    }

    $(".dropdown-menu r-menu").css("display","none");
    var m_btn = id.substring(4);
    var m_btn_display = $("#m_"+m_btn).css("display");
    if(m_btn_display == "none"){
        $("#m_"+m_btn).css("display","block");
    }else{
        $("#m_"+m_btn).css("display","none");
    }
}


//=====11-19jyy=====处理返回数据（预览以及下载地址等）
function upDataToJson(json_tem,type) {
    var path_m = STATIC_IMAGE_PRE + "down/Material/";
    var path_thumb = url_path_down + "down/Thumbs/";
    //是否为名师
    var is_teacher = self.parent.g_is_teacher;
    json_tem["is_teacher"] = is_teacher;

    //是否是区域均衡
    var is_qyjh = self.parent.g_is_qyjh;
    json_tem["is_qyjh"] = is_qyjh;
    //若在我的大学区下   鼠标移动到资源上面，展示 资源所属活动和协作体名称
    if($("#view_id_hid").val() == 9){
        json_tem["show_qyjh"] = 1;
    }else{
        json_tem["show_qyjh"] = 0;
    }

    var list = new Array();
    $.each(json_tem.list,function(i,n){
        var r_format = n.resource_format;
        var file_id = n.file_id;

        if(undefined == n.url_code){
            n.url_code = encodeURI(n.resource_title);
        }

        var _id = path_m + file_id.substring(0,2) + "/" + file_id + "." + r_format + "?flag=download&n=" + n.url_code + "." + r_format;
        var _class = "";
        var _title = n.resource_title + '.' + r_format;
        var _href = "";
        var _i = i;
        var thumbtwo_id = n.thumb_id;
        var _file_path_thumb = path_thumb + thumbtwo_id.substring(0,2) + "/" + thumbtwo_id + ".thumb";
        var resource_page = n.resource_page;

        //===============处理预览方式=============
        //参数：file_ext，file_id，file_title，file_page，_width，_height，p_status，p_type
        var f_json =
        {
            "file_ext":r_format,
            "file_id":file_id,
            "file_title":n.resource_title,
            "file_page":resource_page,
            "_width":n.width,
            "_height":n.height,
            "p_status":n.preview_status,
            "p_type":1
        };
        //返回预览所需参数
        var p_json = dealPreviewFun(f_json);
        _class = p_json._class;
        _href = p_json._href;
        _title = p_json._title;

        //===============处理下载方式=============
        //参数：（file_id，file_ext，for_urlencoder_url，for_iso_url，url_code）
        var _json =
        {
            "file_id":file_id,
            "file_ext":r_format,
            "for_urlencoder_url":n.for_urlencoder_url,
            "for_iso_url":n.for_iso_url,
            "url_code":n.url_code
        };
        var _down_path = dealDownpathFun(_json);
        var _khd_down_path_hou =  "filename="+n.resource_title+"."+r_format+",url="+path_m + file_id.substring(0,2) + "/" + file_id + "." + r_format;
        var _khd_down_path =  "dsoneres://"+Base64.encode(_khd_down_path_hou);


        //alert("_khd_down_path==="+_khd_down_path);
        json_tem.list[i]["down_path"] = _down_path;
        json_tem.list[i]["khd_down_path"] = _khd_down_path;


        if(type == 2){
            //我的资源
            var myres_source = "";
            if(n.type_id == 1){
                myres_source = "我的收藏";
            }else if(n.type_id == 2){
                myres_source = "我推荐的资源";
            }else if(n.type_id == 3){
                myres_source = "推荐给我的资源";
            }else if(n.type_id == 4){
                myres_source = "我的评论";
            }else if(n.type_id == 5){
                myres_source = "我的反馈";
            }else if(n.type_id == 6){
                myres_source = "我的上传";
            }else if(n.type_id == 7){
                myres_source = "我的共享";
            }
            json_tem.list[i]["myres_source"] = myres_source;
        }else{
            var range_type = $("#view_id_hid").val();
            json_tem.range_type = range_type;
        }

        json_tem.list[i]["app_type_title"] = json_tem.list[i]["app_type_name"];
        var _apptype = json_tem.list[i]["app_type_name"];
        var _apparr = _apptype.split(",");
        if(_apparr.length > 1){
            json_tem.list[i]["app_type_name"] = _apparr[0] + "...";
        }

        //新的service方式，id是发布id,删除时得用到，所以这里不能让它改成别的值，刘博2016-04-19
        //json_tem.list[i]["id"] = _id;
        json_tem.list[i]["class_b"] = _class;
        json_tem.list[i]["class_a"] = "text-overflow " + _class;
        json_tem.list[i]["title"] = _title;
        json_tem.list[i]["href"] = _href;
        json_tem.list[i]["href_a"] = _href;
        json_tem.list[i]["data_original"] = _file_path_thumb;
    });
}

function setViewCount(){
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url_path_html + "/tongji/tj_view?type_id=1&random_num=" + creatRandomNum(),
        success : function(data) {

        }
    });
}


//修改下载次数
function changeDownloadNum(info_id,resource_id_int,event){
    stopBubble(event);
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url_path_html + "/ypt/resource/setDownCount?resource_id_int="+resource_id_int + "&random_num=" + creatRandomNum(),
        success : function(data) {
            if(data.success){

            }else{
                dealReturnMsg(data);
            }
        }
    });
    //统计下载次数
    setDownloadCount();
}

/**
 * 统计下载次数
 * 姜莹莹
 * 2014年11月26日
 */
function setDownloadCount(){
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url_path_html + "/tongji/tj_down?type_id=1&random_num=" + creatRandomNum(),
        success : function(data) {

        }
    });
}



/*******************************************************************************
 * 以下为批量操作的相关的代码，增加时间 2016年3月4日
 *****************************************************************************/
// 全局变量，BatchOper 和 CheckBox 两个构造函数的实例对象，用于全局使用；
var g_BatchOper, g_CheckBox;

/**
 * 获取 CheckBox 的实例化对象
 * @param reInitFlag 是否重新初始化：true是，false否
 */
function getCheckBoxObj(reInitFlag) {
    if (g_CheckBox == undefined) {
        g_CheckBox = new CheckBox();
    }
    if (reInitFlag != undefined && reInitFlag == true) {
        g_CheckBox.reInit();
    }
    return g_CheckBox;
}

/**
 * 获取 BatchOper 的实例化对象
 */
function getBatchOperObj() {
    if (g_BatchOper == undefined) {
        g_BatchOper = new BatchOper();
    }
    return g_BatchOper;
}

/**
 * 构造函数 BatchOper（批量操作）
 * @constructor BatchOper
 */
function BatchOper() {
    this.dom_operSpan = $("#span_batch");
    this.isBatchOper  = false;
    this.operMode     = "del";

    this.reInit = function() {
        this.dom_operSpan = $("#span_batch");
        this.isBatchOper  = true;
        this.operMode     = "del";
    };

    // 切换审核面板的 打开/关闭 状态
    this.toggleToolbar = function()
    {
        var checkBoxObj = getCheckBoxObj();
        if (!this.isBatchOper) // 切换到批量操作模式
        {
            checkBoxObj.showAll(); // 显示所有复选框
            $("input[name='radio_model'][value='" + this.operMode + "']").attr("checked", "checked"); //根据this.operMode的值设置单选框的选中状态（防止浏览器缓存）
            this.setOperMode(this.operMode); // 设置批量操作模式（删除、审核）
            this.dom_operSpan.show();  // 显示批量操作工具栏
            //$("#label_oper").text("批量操作 >>");
        }
        else //关闭批量操作模式
        {
            checkBoxObj.hideAll();     // 隐藏所有复选框
            this.dom_operSpan.hide();  // 隐藏批量操作工具栏
            //$("#label_oper").text("批量操作 <<");
        }
        this.isBatchOper = !this.isBatchOper;
    };

    /**
     * BatchOper（批量操作）类的函数
     * 设置批量操作的类型
     * @param operMode string （del：批量删除操作， chk：批量审核操作）
     */
    this.setOperMode = function(operMode) {
        var checkBoxObj = getCheckBoxObj();
        if (operMode != null || operMode != undefined) {
            this.operMode = operMode;
        }
        checkBoxObj.clearAll(); // 清空所有选中的复选框
        checkBoxObj.showAll();  // 显示所有复选框
        if (this.operMode == "del") {
            // 如果用户选择的是批量删除，则禁用所有不能删除的记录的复选框（checkbox）
            checkBoxObj.disabledByDel();
            this.showBatDelBtn();
        }
        if (this.operMode == "chk") {
            // 如果用户选择的是批量审核，则禁用所有不能审核的记录的复选框（checkbox）
            checkBoxObj.disabledByCheck();
            this.showBatCheckBtn();
        }
    };

    this.showBatDelBtn = function () {
        $("#btn_batch_del").css("display", "inline-block");
        $("#btn_batch_check").css("display", "none");
    };

    this.showBatCheckBtn = function () {
        $("#btn_batch_del").css("display", "none");
        $("#btn_batch_check").css("display", "inline-block");
    };
}


var media_type_id = 0,app_type_id = 0,scheme_id = 0,struc,structure_id = 0;
function changeScheme(s_id){
    var url = url_path_html+"/resource/getAllScheme?random_num="+Math.random();

    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url,
        data : {
            "subject_id" : $("#sel_subject").val(),//学科
            "type_id" : 1,//恒久不变
            "plat_id" :1,//恒久不变
            "version_id" : 1,//恒久不变
            "zj_zs" : 1//恒久不变
        },
        success : function(data) {
            if(data.success){
                var html = template.render('select_xb', data);
                $("#select_xb_div").html(html);
                if(null != s_id){
                    scheme_id = s_id;
                    $("#scheme_id").val(scheme_id);
                }else{
                    if(data.version_list.length>0){//这个学科下有版本数据
                        scheme_id = data.version_list[0].version_id;
                    }
                }
                changeStructure();
            }else{
                $("#scheme_id").html('<option value="0">请选择学科</option>');
                scheme_id = 0;
                struc.dropDownStruc("clearInput");
            }
        }
    });

}

function initStructure(node){
    struc = $("#structure_div").dropDownStruc({
        type:2,
        width:170,
        init_struc_code : node == null ? "" : node,
        onStrucCheck:function(){
            //alert("触发选择结构事件");
        }
    });
}

function changeStructure(){
    $("#select_struc_div").show();
    struc.dropDownStruc("loadTree",$("#scheme_id").val());
}

function getStrucValue(){
    return struc.dropDownStruc("getValue");
}

function initMediaType(){
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url_path_action + "/media/getMediaType?type_id=0&random_num="+creatRandomNum(),
        success : function(data) {
            if(data.success){
                var html_type = template.render('media_type_script', data);
                document.getElementById('media_type_content').innerHTML = html_type;
            }
        }
    });
}

function initAppType(){
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        data:{"scheme_id":scheme_id,"random_num":creatRandomNum()},
        url : url_path_action + "/apptype/get_apptype",
        success : function(data) {
            if(data.success){
                var html_type = template.render('app_type_script', data);
                document.getElementById('app_type_content').innerHTML = html_type;
            }
        }
    });
}




/**
 * 构造函数 CheckBox（表格中的复选框的相关函数）
 */
function CheckBox() {
    //类属性 复选框（选择全部）
    this.cbox_checkAll = $("#check_all");
    //属性 列表中的所有复选框
    this.cbox_children = $(".chks");

    this.reInit = function() {
        this.cbox_checkAll = $("#check_all");
        this.cbox_children = $(".chks");
    };

    /**
     * 显示所有复选框（包括【全部】复选框）
     */
    this.showAll = function() {
        this.cbox_checkAll.css("display","inline-block");
        this.cbox_checkAll.attr("checked",false);
        this.cbox_children.css("display", "inline-block");
    };

    // 隐藏所有复选框
    this.hideAll = function() {
        this.cbox_checkAll.css("display", "none");
        this.cbox_checkAll.attr("checked",false);
        this.cbox_children.css("display","none");
    };

    // 选中所有没有禁用的复选框
    this.checkAll = function() {
        var isChecked = this.cbox_checkAll.attr("checked");
        if (isChecked) {
            $(".chks:enabled").attr("checked", true);
        } else {
            this.cbox_children.attr("checked", false);
        }
    }

    // 清除复选框的选中状态
    this.clearAll = function() {
        this.cbox_checkAll.attr("checked", false);
        this.cbox_children.attr("checked", false);
    }

    // 禁用不能进行删除操作的记录的复选框
    this.disabledByDel = function () {
        $("input[canDel=false]").attr("disabled", "disabled");
        $("input[canDel=true]").removeAttr("disabled");
    }

    // 禁用不能进行审核操作的记录的复选框
    this.disabledByCheck = function () {
        $("input[canCheck=false]").attr("disabled", "disabled");
        $("input[canCheck=true]").removeAttr("disabled");
    }
}

/**
 * 响应事件：用户选择批量删除操作的单选框
 */
function event_selBatMode(oper) {
    var batchOperObj = getBatchOperObj();
    batchOperObj.setOperMode(oper);
}

/**
 * 响应事件： 点击【批量操作】标签时的响应事件
 */
function event_toggleBatchModel()
{
    var batchOperObj = getBatchOperObj();
    batchOperObj.toggleToolbar();
}

/**
 * 响应事件：选中/取消 对表头中复选框的操作
 */
function checkAll() {
    var checkBoxObj = getCheckBoxObj();
    checkBoxObj.checkAll();
}



//共享
function openShareWin(resource_title,resIdInt,type,iid,resource_type,event){
    if(typeof(event) != "undefined"){
        event.cancelBubble=true;
    }
    resource_title = resource_title.replace("‘","'");
    tb_show(resource_title,url_path_html + "/yx/html/resource/share.html?target_id="+resIdInt+"&target_type=1&s_type=1&r_type="+resource_type+"&TB_iframe=true&height=400&width=300","thickbox");
}



//审核页面
function showCheckPage(check_id,resource_title,type)
{
    tb_show("当前审核资源：" + resource_title,url_path_html + "/yx/html/resource/res_check.html?type="+type+"&check_id="+check_id+"&unit_id="+unit_id + "&TB_iframe=true&height=300&width=560","thickbox");
}

//修改审核结果页面
function showModifyCheckPage(check_status,check_id,resource_title,type)
{
    tb_show("修改审核结果：" + resource_title,url_path_html + "/yx/html/resource/res_check_modify.html?unit_id="+unit_id+"&check_id="+check_id+"&check_status="+check_status+"&TB_iframe=true&height=280&width=560","thickbox");
}

//代替下级审核页面
function showSupersedeCheckPage(check_id, resource_title, type)
{
    tb_show("【代审】当前审核资源：" + resource_title, url_path_html + "/yx/html/resource/res_supersede_check.html?type="+type+"&check_id="+check_id+"&unit_id="+unit_id + "&TB_iframe=true&height=300&width=560","thickbox");
}

/**
 * 删除审核信息的ajax请求（支持批量删除）
 * @param checkIdArray
 */
function ajax_delCheckInfo(checkIdArray) {
    var paramJson = { check_ids: checkIdArray};
    $.ajax({
        async : false,
        type  : "POST",
        url   : url_path_html + "/ypt/multiCheck/delCheckInfo?random_num=" + creatRandomNum(),
        data  : { "param_json": JSON.stringify(paramJson) },
        dataType : "json",
        success : function(data)
        {
            if(data.success) {
                dialogClose("删除成功", 2, 200,'toPage(1);');
            } else {
                if(data.info == "notlogin") {
                    top.location = "/admin";
                } else {
                    alert(data.info);
                }
            }
        }
    });
}

/**
 * 删除资源
 * @param check_id
 */
function delRes(check_id)
{
    dialogOkCancel('确定删除当前资源吗？', 200, 'delResFun(' + check_id + ')','');
}

/**
 * 执行删除操作(单个删除)
 * @param check_id
 */
function delResFun(check_id)
{
    var checkIdArray = [check_id];
    ajax_delCheckInfo(checkIdArray);
}

//批量审核
function subResCheck()
{
    var res_check = document.getElementsByName("res_check");
    var arrayChk = new Array();
    var count = 0;
    for (var i = 0; i < res_check.length; i++)
    {
        if (res_check[i].checked)
        {
            arrayChk.push({"id":res_check[i].id,"n":res_check[i].value});
            count++;
        }
    }

    if(count == 0){
        self.parent.parent.dialogOk("请选择要审核的资源。",250,"");
        return;
    }

    var reslist = JSON.stringify(arrayChk);
    reslist = Base64.encode(reslist);
    tb_show("资源审核",url_path_html + "/yx/html/resource/res_check.html?type=1&reslist="+reslist+"&unit_id="+unit_id+"&TB_iframe=true&height=400&width=560","thickbox");
}



/**
 * 按钮响应函数： 点击【批量删除】时的响应事件
 */
function event_batchDel() {
    var checkArray = $(".chks:checked");
    if (checkArray.length == 0) {
        dialogOk("请在表格中选择要删除的记录", 300);
        return;
    }
    dialogOkCancel('确定批量删除已经选中的资源吗？', 350,'batchDelObj()','');
}

/**
 * 获取选中的记录，并提交删除审核信息的ajax请求
 */
function batchDelObj() {
    var checkArray = $(".chks:checked");
    var checkIdArray = [];
    $.each(checkArray, function(index, cbox) {
        checkIdArray.push(cbox.id);
    });
    ajax_delCheckInfo(checkIdArray);
}



/**
 * 关键字对象
 * @returns
 */
function SensitiveWord(){
    // 将本页的资源的resource_id_int全部拼成字符串
    this.idArray    = new Array();
    this.idArrayStr = "";
    this.getIdStr = function() {
        this.idArrayStr = this.idArray.join();
    };

    this.resHash = {};
    this.wordHash;
    this.init = function() {
        return;
        this.getIdStr();
        var tempWordHash = new Array();
        if (this.idArray.length > 0) {
            $.ajax({
                async : false,
                type  : "GET",
                url   : url_path_action_login + "/res/getSensitivewordInfoByIds?random_num=" + creatRandomNum(),
                data  : { "ids": this.idArrayStr },
                dataType : "json",
                success : function(data)
                {
                    if (data instanceof Array) {
                        for (var idx=0; idx<data.length; idx++) {
                            var wordRec = data[idx];
                            tempWordHash[parseInt(wordRec.resource_id_int)] = wordRec;
                        }
                    }
                }
            });
        }
        this.wordHash = tempWordHash;
        return this.wordHash;
    }

    this.hasWord = function(resIdInt) {
        if (this.wordHash == undefined) {
            return false;
        }

        if (this.wordHash[resIdInt] != undefined) {
            return true;
        }
        return false;
    };

    this.getWord = function(resIdInt) {
        if (this.hasWord(resIdInt)) {
            return this.wordHash[resIdInt];
        } else {
            return undefined;
        }
    };

    this.viewWord = function(resIdInt) {
        var resRec   = this.resHash[parseInt(resIdInt)];
        var resTitle = resRec.resource_title + "." + resRec.resource_format;
        var wordDetail = this.getWord(parseInt(resIdInt));
        var wordDetailStr = JSON.stringify(wordDetail);
        top.tb_show("查看敏感词", url_path_html + "/html/base/resource_check/show_sensitive_word.html?resource_title=" + escape(resTitle) + "&word_detail=" + escape(wordDetailStr) + "&TB_iframe=true&height=320&width=560","thickbox");
    };
}


function getInfoAndCheckFlow(title,resource_type,type_id,resource_id,event){
    if(typeof(event) != "undefined"){
        stopBubble(event);
    }
    tb_show("当前资源:"+title,url_path_html + "/yx/html/resource/show_res_info.html?resource_type="+resource_type+"&type_id="+type_id+"&resource_id="+resource_id+"&TB_iframe=true&height=360&width=540","thickbox");
}


/**
 * 获取审核列表中每行记录中的功能按钮是否显示的配置
 */
function getRecordButton(record, recommendMap, canRecommend) {
    var result = new Object();
    result.btn_recommend = false;
    result.btn_cancel_recommend = false;
    result.btn_toTop = false;
    result.btn_cancel_toTop = false;
    result.btn_check = false;
    result.btn_modify = false;
    result.btn_delete = false;
    result.btn_supersedeCheck = false;

    if (canRecommend == null || canRecommend == undefined) {
        canRecommend = true;
    }

    if (canRecommend)
    {
        if (record.current_status == "10")
        {
            if (record.can_supersedeCheck == true)
            {
                result.btn_supersedeCheck = true;
            }
            else
            {
                result.btn_check = true;
            }

            if (record.can_delete == true)
            {
                result.btn_delete = true;
            }
        }
        else if (record.current_status == "11")
        {
            if (record.sort_ts != null && record.sort_ts != undefined) //如果sort_ts不为空，则代表被推荐过
            {
                if (record.b_top == 1) //被置顶
                {
                    result.btn_cancel_toTop = true;
                }
                else
                {
                    result.btn_toTop = true;
                }
                result.btn_cancel_recommend = true;
            }
            else
            {
                result.btn_recommend = true;
                if (record.can_modify == true)
                {
                    result.btn_modify = true;
                }

                if (record.can_delete == true)
                {
                    result.btn_delete = true;
                }
            }
        }
        else if (record.current_status == "12")
        {
            if (record.can_delete == true)
            {
                result.btn_delete = true;
            }
            if (record.can_modify == true)
            {
                result.btn_modify = true;
            }
        }
    }
    else
    {
        if (record.current_status == "10")
        {
            if (record.can_supersedeCheck == true)
            {
                result.btn_supersedeCheck = true;
            }
            else
            {
                result.btn_check = true;
            }

            if (record.can_delete == true)
            {
                result.btn_delete = true;
            }
        }
        else if (record.current_status == "11")
        {
            if (record.can_modify == true)
            {
                result.btn_modify = true;
            }
            if (record.can_delete == true)
            {
                result.btn_delete = true;
            }
        }
        else if (record.current_status == "12")
        {
            if (record.can_delete == true)
            {
                result.btn_delete = true;
            }
            if (record.can_modify == true)
            {
                result.btn_modify = true;
            }
        }
    }
    return result;
}



//列表数据处理
var sensitiveWord;
function dealData(json_tem)
{
    sensitiveWord = new SensitiveWord();
    $.each(json_tem.list,function(i,n){
        sensitiveWord.idArray.push(n.obj_id_int);
        var tempResRec = {
            resource_title : n.resource_title,
            resource_format : n.resource_format
        };
        sensitiveWord.resHash[parseInt(n.obj_id_int)]  = tempResRec;

        var r_format = n.resource_format;
        var file_id = n.file_id;
        var _class = "";
        var _title = n.resource_title + '.' + r_format;
        if(r_format == ""){
            _title = n.resource_title;
        }
        var _href = "";
        var resource_page = n.resource_page;
        //===============处理预览方式=============
        //参数（file_ext，file_id，file_title，file_page，_width，_height，url_code，p_status）
        var f_json =
        {
            "file_ext":r_format,
            "file_id":file_id,
            "file_title":n.resource_title,
            "file_page":resource_page,
            "_width":0,
            "_height":0,
            "p_status":n.preview_status,
            "p_type":1
        };
        //返回预览所需参数
        var p_json = dealPreviewFun(f_json);
        _class = p_json._class;
        _href = p_json._href;

        //===============处理下载方式=============
        //参数：（file_id，file_ext，for_urlencoder_url，for_iso_url，url_code）
        var _json =
        {
            "file_id":file_id,
            "file_ext":r_format,
            "for_urlencoder_url":n.for_urlencoder_url,
            "for_iso_url":n.for_iso_url,
            "url_code":n.url_code
        };

        var _down_path = dealDownpathFun(_json);

        json_tem.list[i]["down_path"] = _down_path;

        json_tem.list[i]["_class"] = _class;
        json_tem.list[i]["_href"] = _href;
        json_tem.list[i]["title"] = _title;

        if(json_tem.list[i]["resource_size"] == "-1"){
            json_tem.list[i]["resource_size"] = "--";
        }

        var dest_id = json_tem.list[i].dest_unit;

        var dest = 0;
        json_tem.list[i]["dest"] = dest;
    });
    sensitiveWord.init();
    json_tem.sensitiveWord = sensitiveWord;
}

//修改下载次数
function changeDownloadNum(resource_id_int){
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url_path_action + "/resource/setDownCount?resource_id_int=" + resource_id_int + "&random_num=" + creatRandomNum(),
        success : function(data) {

        }
    });
}
//修改预览次数
function changePreviewNum(resource_id_int){
    $.ajax({
        type : "GET",
        async : false,
        dataType:"json",
        url : url_path_html + "/yx/resource/setPreviewCount?id=" + resource_id_int + "&random_num=" + creatRandomNum(),
        success : function(data) {

        }
    });
}

function openReview(resource_title,resource_id_int){
    tb_show("当前备课资源：" + resource_title,url_path_html+"/html/ypt/review/review.html?target_id="+resource_id_int+"&target_type=1&s_type=4&r_type=0&TB_iframe=true&height=500&width=640","thickbox");
}
