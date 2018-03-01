/**
 * Created by Lijun on 2016/11/17.
 */
$(document).ready(function(){
	initSelectStageSubject(0,0);
    loadTopicType();
    toPage(1);

    $(document).on("click","#use_help",function(){
        playHelp("35.mp4");
    });
});

function loadTopicType(){
    $.ajax({
        type:"post",
        async: false,
        data:{},
        url:url_path_html+"/yx/topic/topiclxList?r=" + Math.random(),
        success:function(data){
            var dataObj=eval("("+data+")");
            //得到数组
            dataObj = dataObj.list;
            var ul = $("#res_ul");
            for(var i=0;i<dataObj.length;i++){
                var li =$("<li></li>");
                li.attr("onclick","changeTopicType("+dataObj[i].lx_id+",this)");
                var a =$('<a style="cursor:pointer"></a>');
                a.text(dataObj[i].lx_name);
                li.append(a);
                ul.append(li);
            }
        }
    });
}

function changeTopicType(lx_id,li){
    $("#bk_type").val(lx_id);
    //去高亮
    $(li).parent().find("a").removeClass("active");
    //高亮
    $(li).find("a").addClass("active");
    toPage(1);
}
/**
 * 查询数据
 */
function toPage(page_number){

    //标题
    var title = $("#title").val();
    var lx_id = $("#bk_type").val();

    var stage_id = $('#sel_stage').val();
    var subject_id = $('#sel_subject').val();

    //参数
    var data = {
        "page": true,
        "manage" : "manage",//manage是“manage”代表是后台管理点过来的,前台则没有这个参数
        "title" : Base64.encode(title),//关键字
        "lx_id" : lx_id,
        "stage_id" : stage_id,
        "subject_id" : subject_id,
        "page_number" :page_number,
        "org_id" : parent.getHoleOrgId(),
        "page_size" : 10
    };

    var url = url_path_html+"/yx/topic/getMyTopicList?random="+Math.random();
    dataRender(data,url,'div_note','script_note');
}

function toEditTopic(id,page_number){
	call_back_number = page_number;
	var url = url_path_html + "/yx/html/manage/topic/editTopic.html?t=" + new Date().getTime();
		url += "&callBack=topic_call_back";
		url += "&id=" + id;
		url += "&TB_iframe=true";
		url += "&height=" + 400;
		url += "&width=" + 620;
		tb_show(id > 0 ? "修改专题" : "发布专题",url, "thickbox");
}

var call_back_number = 1;
function topic_call_back(){
	toPage(call_back_number);
	call_back_number = 1;
}



/**
 * 删除专题
 */
function deleteTheTopic(id, person_id, page_number){
    art.dialog.confirm("确定要删除吗？",function(){
        var url = url_path_html+"/yx/topic/delete";
        var data = {
            id:id,
            hdOwnId : person_id,
            business_type : 1
        };
        $.ajax({
            async:true,
            url: url,
            type : 'post',
            data : data,
            dataType: 'json',
            success: function(data){
                if(data.success){
                    dialogClose("删除成功！",1,200,'toPage('+page_number+')');
                }else{
                    dialogClose("系统繁忙，请稍后再试！",1,200,'');
                }
            }
        });
    });
}

/**
 * 查看详细
 */
function viewDetail(id){
    var url = parent.window.location + "";
    url = url.substring(0,url.lastIndexOf("\/"));
    window.open(url + "/topic.html?id=" + id);
}