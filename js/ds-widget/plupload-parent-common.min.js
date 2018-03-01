var upload_count = 0;//已选择上传文件个数
var current_count = 0;//当前完成上传文件个数
var uploading = 0;//是否正在上传
var is_upload = 0;//是否上传了文件，1为  已经上传   0为未上传

//检查文件是否正在上传
var is_check = false;//是否检查
var check_result = -1;//点击确定还是取消：1确定  0取消
var is_complete = 0;//是否上传完成：1是  0否
function checkIsUpload(){
	is_check = true;
	check_result = -1;
	var is_close = null;
	if(is_complete == 1){
		dialogOk("正在保存文件，不可以关闭。",300,'');
		is_check = false;
	}else{
		art.dialog(
		{
			content:'正在上传文件，确定关闭吗？',
			width: 300,
			lock:true,
			zIndex:9999,
			icon: 'warning',
			title: '提示',
			okVal:'确定',
			cancelVal:'取消',
			style:'succeed noClose',
			ok:function(){
				check_result = 1;
				showUploadNum();
			},
			cancel:function(){
				check_result = 0;
			}
		});
	}
}

//上传文件个数检查
function showUploadNum(){	
	if(upload_count >= current_count)
	{
		if(upload_count == 0){
			dialogClose("您选择的文件均未上传成功！",2.5,400,'tb_remove_fun();');
		}else{
			dialogClose("您一共选择了"+upload_count+"个文件,成功上传"+current_count+"个文件。",2.5,400,'tb_remove_fun();');
		}		
	}else{
		dialogClose("您选择的文件均未上传成功！",2.5,400,'tb_remove_fun();');
		//tb_remove_fun();
	}
}

//方法重写
function tb_remove(){
	var tb_remove_type = $("#tb_remove_type").val();
	if(uploading == 1)
	{
		checkIsUpload();
		return false;
	}		
	if(tb_remove_type ==9){
		var queEnterIframe = document.getElementById("TB_iframeContent");
		var randerData = queEnterIframe.contentWindow.render_data;
		if(randerData==1){
			dialogOk("正在录入试题，不能关闭录入界面！","240","");
			return false;
		}
	}
	tb_remove_fun();
	return false;
}
		
//thickbox执行关闭
function tb_remove_fun(){
	uploading = 0;
	is_check = false;
	upload_count = 0;
	current_count = 0;
	if(typeof(tb_remove_after) != "undefined"){
		tb_remove_after();
	}
	$("#TB_imageOff").unbind("click");
	$("#TB_closeWindowButton").unbind("click");
	$("#TB_window").fadeOut("200",function(){ $('#TB_iframeContent').remove();$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
	$("#TB_load").remove();
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
}