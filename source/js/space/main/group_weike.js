$(function() {

    loadMainNav();


    if (undefined != $.cookie("person_id") && null != $.cookie("person_id")) {
        $.ajax({
            type: "GET",
            async: false,
            data: {
                "random_num": Math.random(),
                "person_id": $.cookie("person_id"),
                "identity_id": $.cookie("identity_id"),
                "group_id": org_id
            },
            url: url_path_action_login + "/group/isExist",
            dataType: "json",
            success: function(data) {
                if (data.success) {
                    is_member = 1;
                }
            }
        });
    }
});


/*加载标签模板*/
function loadMainNav() {
    var html = template("mainGroupNavInner", {});
    $("#groupMain").html(html);
    $('#mainGroupNav a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
        $(".groupResContent").children("div").empty();
        getSortHtml();
    });
    $('#mainGroupNav a:first').trigger("click");
    loadGroupWeikeListTemplate(1);
}


function getSortHtml() {

    var html = template("weikeSortInner", {});
    $("#groupWeike").html(html);
    searchGroupInput = null;
    $("div[id $= 'search_input']").empty();
    searchGroupInput = $("#weike_search_input").search({
        btnclass: "btn btn-warning",
        tips: "请输入关键字",
        onsearch: function() {
            loadGroupWeikeListTemplate(1);
        }
    });
}
/*磨课*/
function loadGroupWeikeListTemplate(page) {
    var keyword = searchGroupInput.search("value");
    keyword = keyword ? keyword : "";
    keyword = Base64.encode(keyword);

    var url = url_path_html + "/yx/moke/listTeamMoke?t=" + Math.random();
    
    
    var dataFormat = {
		"title" : keyword,
		"identity_id" :5,			
		"team_id":org_id,
		"page_size":10,
		//"stage_id" : stage_id,
		//"subject_id" : subject_id,
		"page_number" : page
    };
    
    $.ajax({
        type: "post",
        url: url,
        data: dataFormat,
        dataType: "json",
        success: function(res) {
        	res.is_admin = is_admin;
        	res.login_person = $.cookie("person_id");
            var listHtml = template("group_moke_list_inner", res);
            $("#group_moke_list").html(listHtml)
            
            $("#mokeTablePage").spacePage({
                pageSize: res.page_size,
                pageNumber: res.page_number,
                totalPage: res.total_page,
                totalRow: res.total_row,
                callBack: loadGroupWeikeListTemplate
            });
            

        },
        error: function(err) {

        }
    });

}
/*检测是否登录状态*/
function checkUserLogin() {
    if ($.cookie("person_id") && $.cookie("identity_id")) {
        return true;
    } else {
        return false;
    }
}

function delTeamMoke(id,page_number){
	art.dialog.confirm("确定要删除该条记录么?",function(){
		$.ajax({
			type: "post",
			url: url_path_html + "/yx/moke/delMokeTeam?t=" + Math.random(),
			data: {
				moke_id : id,
				team_id : org_id
			},
			dataType: "json",
			success: function(res) {
				dialogClose("删除成功！",3,200,'');
				setTimeout(function(){
					loadGroupWeikeListTemplate(page_number);
				},3000);
			}
		});
	});
	
}
