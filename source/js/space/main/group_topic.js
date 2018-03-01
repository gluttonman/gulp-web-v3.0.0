/**
 * Created by Lijun on 2016/12/26.
 */
window.onload = function () {
    loadClassNews(1);
    if(is_login == 1 && is_member == 1){
        $("#topic_add").show()
    }
};
function loadClassNews(page_number) {
    $.ajax({
        type: "GET",
        async: false,
        data: {
            "page": true,
            "random_num": creatRandomNum(),
            "business_id": GetQueryString("orgid"),
            "business_type": 2,
            "page_number": page_number
        },
        url: url_path_action_login + "/yx/topic/getServiceTopicList",
        dataType: "json",
        success: function (data) {
            if (data.success) {
            	data.person_id = $.cookie("person_id");
            	data.is_admin = is_admin;
                var html = template('mainClassNewsInner', data);
                $("#mainClassNews").html(html);
            } else {
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('mainClassNewsInner', innerHTML);
                $("#mainClassNews").html(html);
            }
        },
        error: function () {
            var innerHTML = {};
            innerHTML['list'] = [];
            var html = template('mainClassNewsInner', innerHTML);
            $("#mainClassNews").html(html);
        }
    });
}
var call_back_number = 1
function toEditTopic(id, page_number) {
    call_back_number = page_number;
    var url = url_path_html + "/yx/html/manage/topic/editTopic.html?t=" + new Date().getTime();
    url += "&callBack=reloadTopicData";
    url += "&id=" + id;
    url += "&business_id=" + GetQueryString("orgid");
    url += "&business_type=2";
    url += "&TB_iframe=true";
    url += "&height=" + 400;
    url += "&width=" + 620;
    tb_show(id > 0 ? "修改专题" : "发布专题",url, "thickbox");
}

function reloadTopicData(){
    loadClassNews(call_back_number);
}

function deleteTopic(expand_id,page_number){
	call_back_number = page_number;
	art.dialog.confirm("确定要执行删除操纵吗?",function(){
		$.ajax({
			type: "GET",
	        async: false,
	        data: {
	            expand_id : expand_id
	        },
	        url: url_path_action_login + "/yx/topic/deleteService",
	        dataType: "json",
	        success: function (data) {
	            if (data.success) {
	            	reloadTopicData();
	            }
	        }
		});
	});
}