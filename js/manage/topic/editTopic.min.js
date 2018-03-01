/**
 * Created by Lijun on 2016/11/17.
 */
var business_type = 2;
var	business_id = 1;
var topic_id = 0;
var callBack = null;
$(document).ready(function(){
    if(undefined != $.cookie("person_id") && "null" != $.cookie("person_id") && $.cookie("identity_id") == 5){
    	if(null != GetQueryString("business_type") && null != GetQueryString("business_id")){
    		business_type = GetQueryString("business_type"); 
			business_id = GetQueryString("business_id"); 
    	}
    	if(null != GetQueryString("callBack")){
    		callBack = GetQueryString("callBack");
    	}
    	//得到学段数据
    	initSelectStageSubject($.cookie("background_stage_id"),$.cookie("background_subject_id"));
    	
    	initTopicType();
        //这时发布id
        if(null != GetQueryString("id")){
        	topic_id = GetQueryString("id");
        }
        if(topic_id > 0){
        	initBusiness();
        }
    }else{
        alert("未登录");
    }
});

function initBusiness(){
	 //加载
    $.ajax({
        type:"post",
        async: false,
        data:{"id":topic_id},
        dataType : "json",
        url:url_path_html+"/yx/topic/findTopicById?r="+new Date().getTime(),
        success:function(data){
            var dataObj=data.list;
            //标题
            $("#title").val(dataObj.title);

            //内容
            $("#content").val(dataObj.content);

            //获取学段学科
            $("#sel_stage").val(dataObj.stage_id);
            getSubjectList(dataObj.stage_id);
            $("#sel_subject").val(dataObj.subject_id);

            //专题类型
            //$('#lx_id').find("option[value="+dataObj.lx_id+"]").attr("selected","selected");
            $('#lx_id').val(dataObj.lx_id);

        }
    });
}

function initTopicType(){
    //专题类型
    var url = url_path_html + "/yx/topic/topiclxList";
    dataRenderSync(null,url,'topic_lx','topic_lx_script','get');
}


function topicSubmit(){
	var lx_id = $("#lx_id").find("option:selected").val();
    //专题类型名称
    var lx_name = $("#lx_id").find("option:selected").text();
    //学段id
    var stage_id = $("#sel_stage").val();
    //学科id
    var subject_id = $("#sel_subject").val();
    //学段名称
    var stage_name = $("#sel_stage").find("option:selected").text();
    //学科名称
    var subject_name = $("#sel_subject").find("option:selected").text();
    //标题
    var title = $("#title").val();
    if($.trim(title)==""||title.length>30){
        art.dialog.alert("专题名称字数1-30！");
        return false;
    }
    //内容
    var content = $("#content").val();
    if(content.length>300){
        art.dialog.alert("专题导读0-300字符！");
        return false;
    }
    var submitUrl = url_path_html+"/yx/topic/save";
    var data = {
        id : topic_id,
        lx_id : lx_id,
        lx_name : lx_name,
        stage_id : stage_id,
        subject_id : subject_id,
        stage_name : stage_name,
        subject_name : subject_name,
        title : title,
        content : content,
        business_type : business_type,
        business_id : business_id,
        method : "add"
    };
    if(topic_id > 0){//编辑
        data.method = "edit";
    }
    
    $.ajax({
        type:"post",
        data:data,
        url:submitUrl,
        dataType : "json",
        success:function(data){
            if(data.success){
            	dialogClose(topic_id == 0 ? "添加成功！" : "修改成功！",3,200,'');
                setTimeout(function(){
             	   if(callBack != null){
             		   var fun = "parent." + callBack + "()";
             		   eval(fun);
             	   }
             	   cannel();
                },2000);
            	
            	
                
            }
        }
    });

}

function cannel(){
	if("undefined" != typeof(parent.tb_remove)){
		parent.tb_remove();
	}
}





