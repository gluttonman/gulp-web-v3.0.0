﻿window.onload = function() {
    findNotice(1);
    if(is_member == 1){
    	$("#ftAdd").parent().show();
    }
    $("#ftAdd").click(function(){
		var url = "group_jyft.html?orgid=" + org_id + "&iid="+orgidentity_id;
		var person_id=$.cookie("person_id");
		if(null==person_id||person_id==""){
			art.dialog.alert("请先登录！");
			return false;
		}
		window.location = url;
	});
};

//解码
function base64Encode(oldStr){
	var newStr = Base64.decode(oldStr);
	return newStr;
}


function findNotice(pageNumber){
	var paramData={
	   // is_bx : 1,
		page_number	: pageNumber,
		page_size : 10,
		tlqybk_id : org_id,
		qybh : org_id
    };
	
	 $.ajax({
         type: "GET",
         async: false,
         data: paramData,
         url: url_path_html + '/yx/pxtl/ftManagePage?random_num='+Math.random(),
         dataType: "json",
         success: function (data) {
             if (data.status) {
            	 $("#ft_content").html(template('ft_template', data));
            	 pager.init({
						pno : pageNumber,
						total : data.total_page,
						totalRecords :data.page_size
				   });
				   pager.generPageHtml();
             }
         }
     });

}

function service_page(pageNumber){
	findNotice(pageNumber)
}
function ht(id){
	window.open("group_jyht.html?orgid="+org_id+"&iid="+orgidentity_id+"&ft_id="+id);
}








