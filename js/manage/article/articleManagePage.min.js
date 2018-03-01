var unit_id,unit_name,unit_type;
$(document).ready(function(){
	initSelectStageSubject(0,0);
	getOrgSortList();
	
	changeOrg($.cookie("background_yx_manage_org_id"),$.cookie("background_yx_manage_org_name"));
	
	var param = {
		url:url_path_html + "/yx/getPersonByKeyAndOrg?unit_id="+unit_id,
		rows:5,
		tips : "请输入姓名",
		inputwidth:308,
		columnData:[
			{'columnName':'person_name','label':'姓名','width':'30','fillColumn':true},
			{'columnName':'school_name','label':'所在机构','width':'70'}
		],
		afterSelHandler:function(data){
			toPage(1);
		}
	};
	if($.browser.msie && $.browser.version.indexOf('8.') >= 0){
		param.tips = "";
	}
	myupload = $("#upload_person").autocomplete(param);
	toPage(1);
});


/**
 * 到页
 */
function toPage(page_number){
	var total_page = $("#totalPage").val();
    if(total_page == undefined){
      total_page = 1;
    }else if(total_page == 0){
      total_page = 1;
    }
	if(page_number<=total_page&&page_number>0){
 		queryHT(page_number);
 	}
 }

 /**
  * 门户二级页文章分页
  */


//文章管理中查询
function queryHT(page_number){
	var obj_name = $("#title").val(); //标题
	var subject_id = $("#sel_subject").val(); //学科id
	var stage_id = $("#sel_stage").val(); //学段id
	var org_sort = $("#org_sort").val();
	var search_person_id = myupload.autocomplete("getPersonId");
	var data = {
		"search_type" : "title",
		"search_key" : Base64.encode($("#title").val()),
		"org_category_id" : org_sort,
		"unit_type" : unit_type,
		"unit_id" : unit_id,
		"subject_id" :subject_id,
		"stage_id" :stage_id,
		"person_id" : search_person_id,
		"pagenum" :page_number,
	    "pagesize" : 10,
	    "t" : Math.random()
   };
	
   var url = url_path_html + "/yx/article/getManageArticleList?random="+Math.random();
   dataRender(data,url,'business_content','business_template');
}
 

 /**
  * 使用帮助按钮
  */
 $(document).on("click","#use_help",function(){
	 
	playHelp("34.mp4"); 
 	
 });

 function verifyArticleList4Org(ids,flag,page_number){
	 art.dialog.confirm("确定要执行审核操作么?",function(){
		 $.ajax({
			 url : url_path_html + "/yx/article/verifyArticleList4Org?t=" + Math.random(),
			 type:"get",
			 async: false,
			 data : {
				 ids : ids,
				 unit_id : unit_id,
				 unit_type : unit_type,
				 flag : flag
			 },
			 dataType : "json",
			 success:function(data){
				 if(data.success){
					 toPage(page_number);
					 dialogClose("操作成功!",2.5,200,'toPage(1)');
				 }
			 }
		 });
	 });
}

