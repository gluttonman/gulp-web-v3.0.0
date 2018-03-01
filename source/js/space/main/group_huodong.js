$(function () {
    getHdtype();
    refreshHdList();
    //添加活动
    if(is_member){
        $(".bk_add").show();
    }
});

function getHdtype() {
    var url = url_path_html + "/yx/hd/hdlxList";
    dataRender(null, url, 'hdlx_content', 'hdlx_template', 'get');
}
function toHdtype(dom){
    $(dom).addClass("find_typesa").siblings().removeClass("find_typesa");
    toHdPage(1);
}


/**
* 添加/修改活动
id为0时代表添加，则page_number为1
id大于0时为修改，
*/

function businessEdit(id,page_number){
    call_back_number = page_number;
    var url = url_path_html + "/yx/html/manage/hd/hdEdit.html?t=" + new Date().getTime();
    url += "&callBack=hd_call_back";
    url += "&id=" + id;
    url += "&business_type=2";
    url += "&business_id="+org_id;
    url += "&team_type=2";
    url += "&team_id="+org_id;
    url += "&TB_iframe=true";
    url += "&height=" + 450;
    url += "&width=" + 620;
    tb_show(id > 0 ? "修改活动" : "发布活动",url, "thickbox");
}
var call_back_number = 1;
function hd_call_back(){
    refreshHdList(call_back_number)
    call_back_number = 1
}
/**
 * 活动翻页
 */
function toHdPage(page_number) {
    //类型
    var lx_id = 0;
    if ($(".wangsearch .find_typesa").length > 0) {
        lx_id = $(".wangsearch .find_typesa").attr("id").replace(
            "hd_type_", "");
    }
    //活动名
    var hd_name = $("#serch_title").val() == "请输入活动名称" ? "" : $("#serch_title").val();
    var total_page = $("#totalPage").val();
    if (parseInt(page_number)>parseInt(total_page)) {
        return
    }
    if (page_number) {
        var data = {
            "page" : true,
            page_number: parseInt(page_number),
            page_size: 12,
            business_type: 2,//群组
            business_id: org_id,//组id
            lx_id: lx_id,//活动类型id
            hd_name: Base64.encode(hd_name),//关键字搜索
            timestamp: new Date().getTime()
        }
        init(data);
    }
}

function init(data) {
    var url = url_path_html + "/yx/hd/getServiceHdList?t=" + Math.random();
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                data.login_person = $.cookie("person_id");
                data.is_admin = is_admin;
				data.org_id = org_id;
                var html = template("hdPageInfo_template", data);
                $("#hdPageInfo_content").html(html);
            }
        }
    });
}

function refreshHdList(page_number){
    let pageNumber = page_number?page_number:1
    toHdPage(pageNumber)
    lastHdList()
}

/**
 * 删除活动
 * @param id
 * @param page_number
 */
function businessDel(expand_id, page_number){
    art.dialog.confirm("确定要删除吗？",function(){
        var url = url_path_html+"/yx/hd/deleteService";
        var data = {
        		expand_id:expand_id
        };
        $.ajax({
            async:true,
            url: url,
            type : 'post',
            data : data,
            dataType: 'json',
            success: function(data){
                if(data.success){
                    dialogClose("删除成功！",1,200,'refreshHdList('+page_number+')');
                }else{
                    dialogClose("系统繁忙，请稍后再试！",1,200,'');
                }
            }
        });
    });

}

/**
 * 最新活动列表
 */
function lastHdList() {
    var url = url_path_html + "/yx/hd/getServiceHdList";
    var data = {
        "page" : true,
        "page_number": 1,
        "page_size": 6,
        "business_type": 2,
        "business_id": GetQueryString("orgid"),
        "t": Math.random()
    };
    $.ajax({
        url: url,
        type: 'get',
        data: data,
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                data.login_person = $.cookie("person_id");
                data.is_admin = is_admin;
                var html = template("newArticle_inner", data);
                $("#newArticle").html(html);
            }
        }
    });
}
