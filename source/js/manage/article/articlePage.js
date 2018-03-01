$(document).ready(function(){
	initSelectStageSubject(0,0);
	getPersonSortList();
	getOrgSortList();
	toPage(1);
});


function changeArticleType(lx_id,li){
	$("#bk_type").val(lx_id);
	//去高亮
	$(li).parent().find("a").removeClass("active");
	//高亮
	$(li).find("a").addClass("active");
	queryHT(1);
}

 /**
  * 使用帮助按钮
  */
 $(document).on("click","#use_help",function(){
	 
	playHelp("34.mp4"); 
 	
 });
 ////////////////////////////////////////////////////////////////////////////////////////////////////////


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
	var wz_title=$("#wz_title").val(); //标题
	var subject_id=$("#sel_subject").val(); //学科id
	var stage_id=$("#sel_stage").val(); //学段id
	//var type_id=$("#bk_type").val();
	var data = {
			"business_type": 1,
			"pagenum": page_number,
			"pagesize": 10,
			"subject_id" :subject_id,
			"stage_id" :stage_id,
            "search_type": "title",
            "search_key": Base64.encode(wz_title),
            "person_id": $.cookie("person_id"),
            "identity_id": $.cookie("identity_id"),
            "category_id": $("#per_sort").val() || "",
            "l_person_id":$.cookie("person_id"),
            "l_identity_id":$.cookie("identity_id"),
            "random_num": Math.random(),
			"org_category_id": $("#org_sort").val() || ""
		   };
   var url = url_path_html + "/yx/article/getMyArticleList?random="+Math.random();
   dataRender(data,url,'business_content','business_template');
}
/*
 * 添加或者编辑文章
 * id发布id
 */
function addArticle(id,expand_id,page_number){
	call_back_number = page_number || 1;
	var url = url_path_html + "/yx/html/manage/article/addArticle.html";
		url += "?callBack=article_call_back";
		url += "&id=" + id;
		url += "&expand_id=" + expand_id;
		url += "&TB_iframe=true";
		url += "&height=" + 620;
		url += "&width=" + 720;
	if(id){
		tb_show("编辑文章",url, "thickbox");
	}else{
		tb_show("添加文章",url, "thickbox");
	}

}
var call_back_number = 1;
function article_call_back(){
	toPage(call_back_number);
	call_back_number = 1;
}

 //共享
 function openShareWin(title,id,event){
 	if(typeof(event) != "undefined"){
     	event.cancelBubble=true;
 	}
  	tb_show("当前文章："+title,"share.html?target_id=" + id + "&TB_iframe=true&height=400&width=300","thickbox");
 }