var hdInfo = null;
$(function() {
	//加载最新活动
	lastHdList();
	if(is_member == 1){
		$("#add_resource_btn").show();
		$("#add_article_btn").show();
		$("#btn_sp_add").show();
	}

	var id = GetQueryString("id");
	if(id != null){
		$.ajax({
            type: "GET",
            async: false,
            data: {
                "random_num": creatRandomNum(),
                "id": id
            },
            url: url_path_action_login + "/yx/hd/findHdById",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                	hdInfo = data;
                	var html = template("activitiesInfo_template", data);
                    $("#activitiesInfo_content").html(html);
                    
                    initHdUserHeadImgUrl(hdInfo.person_id);
            		$(".jtbk_line3_left_web02 p").html(hdInfo.hd_content);
            		//评论
            	    var commentUrl = url_path_html + "/yx/html/comment/commentModual.html?yx_business_type=hd&yx_business_id="+hdInfo.hd_id;
                	setTimeout(function(){
            			$("#commentIframe").attr('src',commentUrl);
            		},600);
                    
					loadActivitiesResource(1);
					loadActivitiesArticle(1,2,'article_zongjie_div','article_zongjie_script');
					loadActivitiesVideo(1);
					//initShowActivitiesBtn();
                }
            }
        });
	}
});

/**
 * 最新活动列表
 */
 function lastHdList(){
 	var url = url_path_html + "/yx/hd/getServiceHdList";
	var data ={
			"page_number" :1,
	      "page_size" : 6,
	      "service_type" : 6,
	      "service_id" : GetQueryString("orgid"),
	      "t" : Math.random()
	};
	dataRender(data,url,'newArticle','newArticle_inner','get');
 }