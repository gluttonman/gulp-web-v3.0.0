/**
 * Created by Lijun on 2016/11/14.
 */
$(document).ready(function(){
    loadHdType();
    initSelectStageSubject(0,0);
    toPage(1);
    init_use_help_click();
});

function init_use_help_click(){
    $(document).on("click","#use_help",function(){
        playHelp("32.mp4");
    });
}


/**
 * 活动类型
 */
function loadHdType(){
    $.ajax({
        type:"post",
        async: false,
        url:url_path_html+"/yx/hd/hdlxList?r=" + Math.random(),
        success:function(data){
            var dataObj=eval("("+data+")");
            //得到数组
            dataObj = dataObj.list;
            var ul = $("#res_ul");
            for(var i=0;i<dataObj.length;i++){
                var li =$("<li></li>");
                li.attr("onclick","changeHdType("+dataObj[i].lx_id+",this)");
                var a =$('<a style="cursor:pointer"></a>');
                a.text(dataObj[i].lx_name);
                li.append(a);
                ul.append(li);
            }
        }
    });
}

function changeHdType(lx_id,li){
    $("#bk_type").val(lx_id);
    //去高亮
    $(li).parent().find("a").removeClass("active");
    //高亮
    $(li).find("a").addClass("active");
    toPage(1);
}

function changeHdCreater(creater_type,li){
    $("#creater_type").val(creater_type);
    //去高亮
    $(li).parent().find("a").removeClass("active");
    //高亮
    $(li).find("a").addClass("active");
    toPage(1);
}


function init(data){
    var url = url_path_html + "/yx/hd/getMyHdList?t=" + Math.random();
    dataRender(data,url,'business_content','business_template','get',function(){
        if(undefined != $("#creater_1 a").attr("class") && $("#creater_1 a").attr("class") == "active"){
            $(".manage_hd").hide();
        }
    });
}

function toPage(page_number){
    var total_page = $("#totalPage").val();
    if(total_page == undefined || total_page == 0){
        total_page = 1;
    }

    page_number = parseInt(page_number);
    total_page = parseInt(total_page);

    if(page_number <= total_page){
        var business_title = $('#business_title').val();
        var stage_id = $('#sel_stage').val();
        var subject_id = $('#sel_subject').val();
        var lx_id = $("#bk_type").val();
        var creater_type = $("#creater_type").val();
        var data ={
            "page":true,
            "page_number" : page_number,
            "page_size" : 10,
            "hd_name" : Base64.encode(business_title),//关键字
            "lx_id" : lx_id,//service方式，按活动类型查询得传它
            "creater_type" : creater_type,
            "stage_id" : stage_id,
            "subject_id" : subject_id,
            "org_id" :parent.getHoleOrgId(),
            "regist_id" : 1
        };
        init(data);
    }
}


/**
 * 删除活动
 * @param id
 * @param page_number
 */
function businessDel(id,person_id, page_number){
    art.dialog.confirm("确定要删除吗？",function(){
        var url = url_path_html+"/yx/hd/delete";
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
 * 添加/修改活动
 id为0时代表添加，则page_number为1
 id大于0时为修改，
 */

function businessEdit(id,page_number){
	call_back_number = page_number;
	var url = url_path_html + "/yx/html/manage/hd/hdEdit.html?t=" + new Date().getTime();
		url += "&callBack=hd_call_back";
		url += "&id=" + id;
		url += "&TB_iframe=true";
		url += "&height=" + 450;
		url += "&width=" + 620;
		tb_show(id > 0 ? "修改活动" : "发布活动",url, "thickbox");
}
var call_back_number = 1;
function hd_call_back(){
	toPage(call_back_number);
	call_back_number = 1;
}


/**
 * 查看详细
 */
function viewDetail(hd_id,id){
    var url = parent.window.location + "";
    url = url.substring(0,url.lastIndexOf("\/"));
    window.open(url + "/activities_"+hd_id+".html?id=" + id);
}