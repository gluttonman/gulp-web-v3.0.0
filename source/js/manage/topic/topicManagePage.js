/**
 * Created by Lijun on 2016/11/17.
 */
$(document).ready(function(){
	loadTopicType();
    getSel_stage_subject("sel_stage_subject");
    changeOrg($.cookie("background_yx_manage_org_id"),$.cookie("background_yx_manage_org_name"));

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
        "title" : Base64.encode(title),//关键字
        "lx_id" : lx_id,
        "org_id" : unit_id,
        "stage_id" : stage_id,
        "subject_id" : subject_id,
        "page_number" :page_number,
        "page_size" : 10
    };

    var url = url_path_html+"/yx/topic/getManageTopicList?random="+Math.random();
    dataRender(data,url,'div_note','script_note');
}

function toEditTopic(id,page_number){
    var title = "添加专题";
    if(id > 0){
        title = "修改专题";
    }
    var url = url_path_html+"/yx/html/topic/editTopic.html?id=" + id;
    art.dialog.open(url, {
        title: title,
        height: 450,
        width: 750,
        zIndex:9999,
        lock:true,
        ok:function(){
            var iframe = this.iframe.contentWindow;
            //类型id
            var lx_id = iframe.$("#lx_id").find("option:selected").val();
            //专题类型名称
            var lx_name = iframe.$("#lx_id").find("option:selected").text();
            //学段id
            var stage_id = iframe.$("#sel_stage").val();
            //学科id
            var subject_id = iframe.$("#sel_subject").val();
            //学段名称
            var stage_name = iframe.$("#sel_stage").find("option:selected").text();
            //学科名称
            var subject_name = iframe.$("#sel_subject").find("option:selected").text();
            //标题
            var title = iframe.$("#title").val();
            if($.trim(title)==""||title.length>30){
                art.dialog.alert("专题名称字数1-30！");
                return false;
            }
            //内容
            var content = iframe.$("#content").val();
            if(content.length>300){
                art.dialog.alert("专题导读0-300字符！");
                return false;
            }
            var submitUrl = url_path_html+"/yx/topic/save";
            var data = {
                id : id,
                lx_id : lx_id,
                lx_name : lx_name,
                stage_id : stage_id,
                subject_id : subject_id,
                stage_name : stage_name,
                subject_name : subject_name,
                org_id : parent.getHoleOrgId(),
                title : title,
                content : content,
                method : "add"
            }
            if(id > 0){//编辑
                data["method"] = "edit"
            }
            setTimeout(function(){
                art.dialog({
                    content: "正在保存信息...",
                    width: 240,
                    title: "提示",
                    close:function(){
                        return true;
                    },
                    init: function () {
                        var _this = this;
                        $.ajax({
                            type:"post",
                            data:data,
                            url:submitUrl,
                            dataType : "json",
                            success:function(data){
                                if(data.success){
                                    setTimeout(function(){
                                        dialogClose(id == 0 ? "添加成功！" : "修改成功！",3,200,'');
                                        _this.close();
                                        toPage(page_number);
                                        return true;
                                    },200);
                                }else{
                                    _this.close();
                                    dialogClose("系统繁忙！",3,200,'');
                                    return true;
                                }
                            }
                        });
                    }
                });
            },10);

        },
        cancel:function(){
        }
    });

}

/**
 * 删除专题
 */
function deleteTheTopic(id, page_number){
    art.dialog.confirm("确定要删除吗？",function(){
        var url = url_path_html+"/yx/topic/delete?t=" + Math.random();
        var data = {
            id:id
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

/**
 * 推荐/取消推荐
 * @param id
 * @param page_number
 */
function checkTopic(id,checkFlag,page_number){
    if(!id){
        console.error("id or recommend is null")
        return
    }
    art.dialog.confirm("确定要执行操作吗？",function(){
        var url = url_path_html+"/yx/topic/checkTopic?t=" + Math.random();
        var data = {
            topic_id:id,
            checkFlag : checkFlag,
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
                    dialogClose("操作成功！",1,200,'toPage('+page_number+')');
                }else{
                    dialogClose("系统繁忙，请稍后再试！",1,200,'');
                }
            }
        });
    });

}
