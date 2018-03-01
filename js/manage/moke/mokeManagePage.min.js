$(document).ready(function(){
    //查询一下这个业务现在的推荐方式 。5机构;8研修活动
    getSel_stage_subject("sel_stage_subject");
    toPage(1);
});

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
            "page":true,
            "page_number" : page_number,
            "page_size" : 10,
            "title" : Base64.encode(title),//关键字
            "stage_id" : stage_id,
            "subject_id" : subject_id,
            "mokeType" : $("#mokeType").val()
        };
        init(data);
    }
}
function init(data){
    var url = url_path_html + "/yx/moke/queryMokes?t=" + Math.random();
    dataRender(data,url,'mokeList','mokeListTemplate','get',function(){
    });
}

function distributeTeacher(mokeName, mokeId, teamId, pageNumber,meet_id){
    var url = url_path_html+"/yx/html/manage/moke/famousTeacher.html?id="+teamId;

    art.dialog.open(url, {
        title: '名师工作室',
        height: 450,
        width: 680,
        zIndex:9999,
        opacity:0,
        lock:true,
        ok:function(){
            var iframe = this.iframe.contentWindow;
            //id
            var id = iframe.$("input[type=radio]:checked").val();
            //名
            var name = iframe.$("input[type=radio]:checked").parent().siblings("td").text();
            //去空格
            name = $.trim(name);
            var meetingFlag = meet_id > 0 ? false : true;
            var data = {
                meeting_flag : meetingFlag,
                moke_name : mokeName,
                moke_id : mokeId,
                team_id : id,
                team_name : name,
            }
            $.ajax({
                type :  "POST",
                url : url_path_html + "/yx/moke/setMokeTeam?t=" + Math.random(),
                data : data,
                dataType : "json",
                success : function(res){
                    if(res.success){
                        toPage(pageNumber)
                        dialogClose(res.info,1,200,'');
                    }else{
                        dialogClose("系统繁忙，请稍后再试！",1,200,'');
                    }
                }
            })

        },
        cancel:function(){

        }
    });
}


function changeMokeType(type, li){
    $("#mokeType").val(type);
    //去高亮
    $(li).parent().find("a").removeClass("active");
    //高亮
    $(li).find("a").addClass("active");
    toPage(1);
}

function showExpertMokeList(){
    var url = url_path_html + "/yx/html/manage/moke/myMokePage.html";
    url += "?callBack=article_call_back";
    url += "&famous_teacher=1";
    url += "&team_id=0";
    url += "&t=" + Math.random();
    art.dialog.open(url, {
        title: '管理磨课',
        height: 600,
        width: 900,
        lock:true,
        fixed: true,
        padding:"15px",
        close:function(){

        }
    });
}