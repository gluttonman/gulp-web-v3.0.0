var group_id = 0;
$(document).ready(function(){
	if(null != GetQueryString("group_id")){
		group_id = GetQueryString("group_id");
	}
	if(group_id > 0){
		toPage(1);
	}
});

function toPage(page_number){
	//转成数字
	page_number=parseInt(page_number);
	if(page_number <= 0){
        page_number = 1;
    }
	var search_key = "";
	
	var paraData = {
        "random_num": creatRandomNum(),
        "search_type": 3,
        "pagenum": page_number,
        "pagesize": 10,
        "business_type": 2,
        "business_id": group_id,
        "business_iid": 106
    };
	var url = url_path_html + "/yx/article/getServiceArticleList";
	//加载资源列表数据
	$.ajax({
		url : url,
		type:"get",
		async: false,
		data : paraData,
		dataType : "json",
		success:function(data){
			data.page_number = parseInt(data.page_number)
			var html = template("article4verify_template", data);
			$("#article4verify_content").html(html);
		}
	});
}

function verifyArticleList4Group(ids,b_category_id){
	$.ajax({
		url : url_path_html + "/yx/article/verifyArticleList4Group?t=" + Math.random(),
		type:"get",
		async: false,
		data : {
			ids : ids,
			b_category_id : b_category_id
		},
		dataType : "json",
		success:function(data){
			if(data.success){
				dialogClose("审核通过!",2.5,200,'toPage(1)');
			}
		}
	});
}