/**
 * Created by Lijun on 2016/11/14.
 */
$(document).ready(function(){
    initSelectStageSubject(0,0);
    toPage(1);
    //init_use_help_click();
});

function init_use_help_click(){
    $(document).on("click","#use_help",function(){
        playHelp("32.mp4");
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
    var url = url_path_html + "/yx/moke/listTeamMoke?t=" + Math.random();
    dataRender(data,url,'business_content','business_template','post', function(){
		//如果是名师隐藏操作按钮
		if(GetQueryString("famous_teacher")=="1"){
			$("#applyMokeBtn").hide();
            var contentWrapper = $("#business_content")
            contentWrapper.find("a[name='modifyMokeBtn']").hide();
            contentWrapper.find("a[name='deleteMokeBtn']").hide();
            contentWrapper.find("a[name='applyMokeBtn']").hide();
			$("#creater_1").hide();
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
        var business_title = $.trim($('#business_title').val());
        
        var stage_id = $('#sel_stage').val();
        var subject_id = $('#sel_subject').val();
        var lx_id = $("#bk_type").val();
        var creater_type = $("#creater_type").val();
        
        var data = {
    			"person_id":$.cookie("person_id"),
    			"title" : Base64.encode(business_title),
    			"identity_id" :5,			
    			"page_size":10,
    			"stage_id" : stage_id,
    			"subject_id" : subject_id,
    			"page_number" : page_number
    	};
        if(creater_type == 1){
        	data.show = 0;
        }
        if(GetQueryString("famous_teacher")=="1"){
			data["is_famous"] = true
			data["team_id"] = GetQueryString("team_id")
		}


        init(data);
    }
}


/**
 * 删除活动
 * @param id
 * @param page_number
 */
function businessDel(id,page_number){
    art.dialog.confirm("确定要删除吗？",function(){
        var url = url_path_html+"/yx/moke/delMoke";
        var data = {
        		moke_id:id
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
	var url = url_path_html + "/yx/html/manage/moke/mokeEdit.html?t=" + new Date().getTime();
		url += "&callBack=moke_call_back";
		url += "&id=" + id;
		url += "&TB_iframe=true";
		url += "&height=" + 500;
		url += "&width=" + 780;
		tb_show("编辑磨课",url, "thickbox");
}
var call_back_number = 1;
function moke_call_back(){
	toPage(call_back_number);
	call_back_number = 1;
}

/*查看磨课，不可修改*/
function businessView(id,page_number){
	call_back_number = page_number;
	var url = url_path_html + "/yx/html/manage/moke/mokeView.html?t=" + new Date().getTime();
	url += "&callBack=moke_call_back";
	url += "&id=" + id;
	url += "&TB_iframe=true";
	url += "&height=" + 500;
	url += "&width=" + 780;
	tb_show("查看磨课",url, "thickbox");
}

/**
 * 查看详细
 */
function showMoke(id,team_id){
    window.open(url_path_html + "/html/space/main/group_moke_detail.html?orgid="+team_id+"&iid=107&id=" + id);
}

function shenqingMoke(id,page_number){
	var jxsj = 0;
	var jxkj = 0;
	var url = url_path_html+"/space/ypt/getResourceAll?t=" + Math.random();
  	var dataFormat = {
  			res_type : 51,
 		   pageNumber : 1,
 		   pageSize : 100,
 		   rtype : 0,
 		   beike_type : 1,
 		   view : id,
 		   sort_num : 2	
  	};
	$.ajax({
  	   async:false,
	   url: url,
	   type:'post',
	   data : dataFormat,
	   dataType: 'json',
	   success: function(data){
		   if(data.success){
				if(null != data.list && data.list.length > 0){
					jxsj = data.list.length;
				}
		   }
	   }
	});
	
	dataFormat.beike_type = 2;
	$.ajax({
	  	   async:false,
		   url: url,
		   type:'post',
		   data : dataFormat,
		   dataType: 'json',
		   success: function(data){
			   if(data.success){
					if(null != data.list && data.list.length > 0){
						jxkj = data.list.length;
					}
			   }
		   }
	});
	
	if(jxsj > 0 && jxkj > 0){
		$.ajax({
	         async:true,
	         url: url_path_html + "/yx/moke/shenqingMoke?t=" + Math.random(),
	         type : 'post',
	         data : {moke_id:id},
	         dataType: 'json',
	         success: function(data){
	             if(data.success){
	                 dialogClose("申请成功！",2,200,'toPage('+page_number+')');
	             }else{
	                 dialogClose("系统繁忙，请稍后再试！",2,200,'');
	             }
	         }
	     });
	}else{
		if(jxsj == 0){
			art.dialog.confirm("未上传教学设计,是否现在进行上传？",function(){
				businessEdit(id,$("#cur_page").val());
		    });
			return;
		}
		if(jxkj == 0){
			art.dialog.confirm("未上传教学课件,是否现在进行上传？",function(){
				businessEdit(id,$("#cur_page").val());
		    });
		}
	}
	
}