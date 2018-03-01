$(document).ready(function(){
	initMsType();
	initSelectStageSubject(0,0);
    changeOrg($.cookie("background_yx_manage_org_id"),$.cookie("background_yx_manage_org_name"));
    toPage(1);
});
var mstagList = null;
function initMsType(lx_id,li){
	$.ajax({
        type:"post",
        async: false,
        data:{},
        url:url_path_html+"/yx/config/getMsTag?r=" + Math.random(),
        dataType : "json",
        success:function(data){
        	if(data.success){
        		mstagList = data.list;
        		var ul = $("#res_ul");
        		for(var i=0;i<data.list.length;i++){
        			var li =$("<li></li>");
        			li.attr("onclick","changeTopicType("+data.list[i].ms_id+",this)");
        			var a =$('<a style="cursor:pointer"></a>');
        			a.text(data.list[i].ms_name);
        			li.append(a);
        			ul.append(li);
        		}
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
    var stage_id = $('#sel_stage').val();
    var subject_id = $('#sel_subject').val();
    //参数
    var data = {
    	"ms_id" : $("#bk_type").val(),
        "stage_id" : stage_id,
        "subject_id" : subject_id,
        "org_id" : unit_id,
        "page_number" :page_number,
        "page_size" : 10
    };

    var url = url_path_html+"/yx/getOrgUser?random="+Math.random();
    dataRender(data,url,'div_note','script_note');
}

function tb_remove(){
	toPage(1);
	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("200",function(){ $('#TB_iframeContent').remove();$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
}

/**
 * 查看详细
 */
function viewDetail(id){
    window.open(url_path_html + "/yx/html/space/main/work.html?iid=106&orgid=" + id);
}

/**
 *创建群组 
 */
function openCreateWin(){
    tb_show("添加名师",url_path_html + "/yx/html/manage/team/add_mingshi.html?TB_iframe=true&height=490&width=715","thickbox");
    $('#TB_iframeContent').css({"width":"745px",'margin-top':'0px','border-radius':'0px'});
    $('#TB_title').css({"background-color":"#5bc0de",'border-bottom':'1px solid #777'});
    $('#TB_ajaxWindowTitle').css('color','#fff');
    $('#TB_closeWindowButton').css({"opacity":"1",'color':'#fff'});
           
}

function changeMsTag(id,ms_id,pageNumber){
	var html = '<div><select id="change_msselect">';
		for(var i=0;i<mstagList.length;i++){
			if(mstagList[i].ms_id == ms_id){
				html+= '<option value="' + mstagList[i].ms_id + '" selected="true">' + mstagList[i].ms_name + '</option>';
			}else{
				html+= '<option value="' + mstagList[i].ms_id + '">' + mstagList[i].ms_name + '</option>';
			}
		}
		html += '</select></div>';
	art.dialog({
		title : "修改",
		content : html,
		width : 300,
		height : 80,
		ok : function(){
			$.ajax({
				url: url_path_html + "/yx/team/changePlat?random_num=" + Math.random(),
				method:"POST",
				async: false, 
				data:{
					id: id,
					plat_id: $("#change_msselect").val()
				},
				dataType:'json',
				success: function(data, textStatus, JXHttp){
					if(data.success){
						dialogClose("修改成功，正在刷新列表",2,330,'toPage(' + pageNumber + ');');
						return true;
					}
				}
			});
		}
	});
}

function deleteMs(id,pageNumber){
	art.dialog.confirm("工作室相关信息将全部清楚,确定要删除该名师吗?",function(){
		$.ajax({
			url: url_path_html + "/yx/team/delTeam?random_num=" + Math.random(),
			method:"POST",
			async: false, 
			data:{groupId: id},
			dataType:'json',
			success: function(data, textStatus, JXHttp){
				if(data.success){
					dialogClose("删除成功，正在刷新列表",2,330,'toPage(' + pageNumber + ');');
				}
			}
		});
	});
}