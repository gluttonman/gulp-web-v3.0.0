$(document).ready(function(){
    //查询一下这个业务现在的推荐方式 。5机构;8研修活动
    //getSel_stage_subject("sel_stage_subject");
	$('#start_time').val(dateToStr(dateAddHour(new Date(),-24)).split(" ")[0]);
	$('#end_time').val(dateToStr().split(" ")[0]);
    toPage(1);
});

var search_type = 1;
function changeMokeType(type, li){
	search_type = type;
    //去高亮
    $(li).parent().find("a").removeClass("active");
    //高亮
    $(li).find("a").addClass("active");
    toPage(1);
}

function toPage(page_number){
    var total_page = $("#totalPage").val();
    if(total_page == undefined || total_page == 0){
        total_page = 1;
    }

    page_number = parseInt(page_number);
    total_page = parseInt(total_page);

    if(page_number <= total_page){
        var title = $('#title').val();
        var stage_id = $('#sel_stage').val();
        var subject_id = $('#sel_subject').val();
        var data ={
            "page_number" : page_number,
            "page_size" : 10,
            "start_time" : $("#start_time").val(),
            "end_time" : $("#end_time").val(),
            "mokeType" : $("#mokeType").val()
        };
        init(data);
    }
}
function init(data){
    var url = url_path_html + "/yx/moke/tjZjMokeList?t=" + Math.random();
    var tem = "mokeListTemplate";
    if(search_type == 2){
    	url = url_path_html + "/yx/moke/tjXyMokeList?t=" + Math.random();
    	tem = "mokeTeacherListTemplate";
    }
    dataRender(data,url,'mokeList',tem,'get',function(){
    });
}

