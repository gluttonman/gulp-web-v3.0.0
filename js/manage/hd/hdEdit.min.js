/**
 * Created by Lijun on 2016/11/15.
 */
var business_type = 0;
var	business_id = 0;
var hd_id = 0;
var hd_confid = 0;
var callBack = null;
var can_change_meeting = 1;
$(document).ready(function(){
    if(undefined != $.cookie("person_id") && "null" != $.cookie("person_id") && $.cookie("identity_id") == 5){
    	if(null != GetQueryString("business_type") && null != GetQueryString("business_id")){
    		business_type = GetQueryString("business_type"); 
			business_id = GetQueryString("business_id"); 
    	}
    	if(null != GetQueryString("callBack")){
    		callBack = GetQueryString("callBack");
    	}
    	if(null != GetQueryString("team_type")){
    		$("#team_type").val(GetQueryString("team_type"));
    	}
    	if(null != GetQueryString("team_id")){
            $("#team_select").hide();
    		$("#team_id").val(GetQueryString("team_id"));
    	}
        //加载活动类型
        loadHdlx(function(){
            //这时发布id
            if(null != GetQueryString("id")){
                hd_id = GetQueryString("id");
            }
            if(hd_id > 0){
                initBusiness();
            }else{
                initDefaultPlugins();
            }
        });

    }else{
        alert("未登录");
    }
});

var detail = null;
function initBusiness(){
    var url = url_path_html + "/yx/hd/findHdById?t=" + new Date().getTime();
    $.ajax({
        async:true,
        url: url,
        data: {id : hd_id},
        type:'post',
        dataType: 'json',
        success: function(res){
        	detail = res;
            hd_confid = detail.hd_confid;
            $("#hd_name").val(detail.hd_name);
            $("#con_pass").val(detail.con_pass);
            $("#team_type").val(detail.team_type);
            $("#team_id").val(detail.team_id);
            $("#team_name").val(detail.team_name);
            //$("#plan_id").val(detail.plan_id);
            //$("#plan_name").val(detail.plan_name);
            $('#content1').val(detail.hd_content);
            if(detail.is_show>0){
                $("#publicHd").trigger("click")
            }else{
                $("#privateHd").trigger("click")
            }
            //获取学段学科
            $("#sel_stage").val(detail.stage_id);
            $("#sel_subject").val(detail.subject_id);
            initSelectStageSubject(detail.stage_id,detail.subject_id);

            $("#lx_id").val(detail.lx_id);
            initDefaultPlugins(detail);

            $("#start_time").removeAttr("onfocus");
            //时间不允许修改
            //判断如果已结束则不可修改
            if(dateToStr() > $("#end_time").val()){
            	$("#end_time").removeAttr("onfocus");
            	$("#con_pass").attr("disabled",true);
            	can_change_meeting = 0;
            }
            
            //$("#team_name").removeAttr("onclick");
            //$("#team_name").attr("disabled",true);
            //$("#lx_id").attr("disabled",true);
            //$("#sel_stage").attr("disabled",true);
            //$("#sel_subject").attr("disabled",true);
        }
    });
}
function initDefaultPlugins(data){
	
    //开始结束时间
    if(undefined != data){
        $('#start_time').val(data.start_time);
        $('#end_time').val(data.end_time);
        $("#main_person_id").val(data.main_person_id);
        $("#main_person_name").val(data.main_person_name);
    }else{
    	var stage_id = $.cookie("background_stage_id");
    	var subject_id = $.cookie("background_subject_id");
    	if(null != GetQueryString("stage_id")){
    		stage_id = GetQueryString("stage_id");
    	}
    	if(null != GetQueryString("subject_id")){
    		subject_id = GetQueryString("subject_id");
    	}
    	initSelectStageSubject(stage_id,subject_id);
        $('#start_time').val(dateToStr());
        $('#end_time').val(dateToStr(dateAddHour(new Date(),1)));
        
        $("#main_person_id").val($.cookie("person_id"));
        $("#main_person_name").val($.cookie("person_name"));
    }
}

/**
 *选择参与群组
 */
function selectPerson(){

    var url = url_path_html+"/yx/html/manage/hd/areaPerson.html?id="+$("#team_id").val();

    art.dialog.open(url, {
        title: '参与群组',
        height: 450,
        width: 680,
        zIndex:9999,
        opacity:0,
        lock:true,
        ok:function(){

            var iframe = this.iframe.contentWindow;

            //id
            var id = iframe.$("input[type=radio]:checked").val();
            $("#team_id").val(id);

            //名
            var name = iframe.$("input[type=radio]:checked").parent().siblings("td").text();
            //去空格
            name = $.trim(name);

            $("#team_name").val(name);

        },
        cancel:function(){

        }
    });
}

/**
 * 加载活动类型
 */
function loadHdlx(callback){
    var url = url_path_html + "/yx/hd/hdlxList";
    dataRender(null,url,'lx_id','hdlx_template','get',function(){
        $("#lx_id").on("change", function(){
            //在工作室，默认的team_id就是工作室的id
            if($(this).find("option:selected").text()=="集体备课" && null == GetQueryString("team_id")){
                $("#team_select").show()
            }
        })
        if(callback){
            callback();
        }
    });
}

function hdSubmit(){
	$("#hdSubmitBtn").attr("disabled",true);
	var stage_id = $("#sel_stage").val();
    var stage_name = $("#sel_stage option:selected").html();
    var subject_id = $("#sel_subject").val();
    var subject_name = $("#sel_subject option:selected").html();
    var lx_id = $("#lx_id").val();
    var lx_name	= $("#lx_id").find("option:selected").text();
    var team_type = $("#team_type").val();
    var team_id = $("#team_id").val();
    var team_name = $("#team_name").val();
    //var plan_id = $("#plan_id").val();
    //var plan_name = $("#plan_name").val();
    var hd_content = $("#content1").val();
    //以下为需要验证的参数
    var is_show = $("input[name='pop']:checked").val()
    //如果选了集体备，那么就必须得选学科学段，和组
    if(lx_id==3){
        if(stage_id == 0){
            art.dialog.alert("请选择学段！");
            $("#hdSubmitBtn").attr("disabled",false);
            return false;
        }
        if(subject_id == 0){
            art.dialog.alert("请选择学科！");
            $("#hdSubmitBtn").attr("disabled",false);
            return false;
        }
        if(team_id == ""||team_id == 0){
            art.dialog.alert("请选择群组！");
            $("#hdSubmitBtn").attr("disabled",false);
            return false;
        }
    }

    var hd_name = $("#hd_name").val();
    if(null == hd_name || "" == $.trim(hd_name)){
        art.dialog.alert("名称不能为空！");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }
    var start_time = $("#start_time").val();
    if(null == start_time || "" == $.trim(start_time)){
        art.dialog.alert("开始时间不能为空！");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }
    var end_time = $("#end_time").val();
    if(null == end_time || "" == $.trim(end_time)){
        art.dialog.alert("结束时间不能为空！");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }

    if(end_time < start_time){
        art.dialog.alert("结束时间不能小于开始时间！");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }

    //密码
    var con_pass = $("#con_pass").val();
    //验证密码的正则
    var reg4con_pass = /^[0-9a-zA-Z]*$/g;
    if(null == con_pass || "" == $.trim(con_pass) ){
        art.dialog.alert("活动密码不能为空,6-10位的数字和字母！");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }
    if(con_pass.length < 6|| con_pass.length > 10 || !reg4con_pass.test(con_pass)){
        art.dialog.alert("活动密码格式错误,6-10位的数字和字母！");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }
    if(hd_content.replace(/<[^>]+>/g,"").length > 120){
        art.dialog.alert("内容字数不能大于120字!");
        $("#hdSubmitBtn").attr("disabled",false);
        return false;
    }
    
    var dataFormat = {
        "hd_id" : hd_id,//发布id
        "stage_id" : stage_id,
        "stage_name" : stage_name,
        "subject_id" : subject_id,
        "subject_name" : subject_name,
        "lx_id" : lx_id,
        "lx_name" : lx_name,
        "team_type" : team_type,
        "team_id" : team_id,
        "team_name" : team_name,
        //"plan_id" : plan_id,
        //"plan_name" : plan_name,
        "hd_content" : hd_content,
        "hd_name" : hd_name,
        "start_time" : start_time,
        "end_time" : end_time,
        "con_pass" : con_pass,
        is_show : is_show,
        "business_type" :business_type,
        "business_id" :business_id
    };
    
	var url = url_path_html+"/yx/hd/save?t=" + Math.random();
	if(hd_id > 0){
       	dataFormat.method = "edit";
       	dataFormat.hd_confid = hd_confid;
       	
       	if(can_change_meeting == 1){
        	if(detail.start_time == start_time && detail.end_time == end_time && detail.con_pass == con_pass){
        		can_change_meeting = 0;
        	}else{
        		can_change_meeting = 1;
        	}
        }else{
        	can_change_meeting = 0;
        }
       	dataFormat.can_change_meeting = can_change_meeting;
    }else{
    	dataFormat.method = "add";
    }
	
  	$.ajax({
	   async:true,
	   url: url,
	   type:'post',
	   data : dataFormat,
	   dataType: 'json',
	   success: function(data){
		   if(data.success){
			   dialogClose(hd_id == 0 ? "添加成功！" : "修改成功！",3,200,'');
               setTimeout(function(){
            	   if(callBack != null){
            		   var fun = "parent." + callBack + "()";
            		   eval(fun);
            	   }
            	   cannel();
               },2000);
		   }else{
			   dialogClose("系统繁忙！",3,200,'');
		   }
	   }
	});
}

function cannel(){
	if("undefined" != typeof(parent.tb_remove)){
		parent.tb_remove();
	}
}