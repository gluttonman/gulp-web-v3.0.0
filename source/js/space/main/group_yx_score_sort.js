﻿$(function() {
    getGroupMembers(1);
});

/*current_page: 记录当前的页面， 当兑换完积分后从新刷新当前分页*/
var current_page = 1;
var myScore = 0;
var sortType = "All" //查询积分类型， All全部积分， Week本周积分
function getGroupMembers(page) {
    current_page = page;
    var innerHtml = {};
    $.ajax({
        type: "GET",
        async: false,
        data: {
            "random_num": creatRandomNum(),
            "groupId": org_id,
            "nodeId": org_id,
            "rangeType": 3,
            "orgType": -1,
            "stage_id": -1,
            "subject_id": -1,
            "keyword": "",
            "member_type": -1,
            "pageNumber": page,
            "pageSize": 1000,
            "sortType" : sortType
        },
        url: url_path_action_login + "/yx/team/group_yx_score_sort",
        dataType: "json",
        success: function(data) {
            if (data.success) {
                innerHtml = data;
                var scoreList = data.table_List
                for (var i = 0; i < scoreList.length; i++) {
                    if (scoreList[i]["PERSON_ID"] == $.cookie("person_id")) {
                        myScore = scoreList[i]["score_sort"]
                        innerHtml['my_score'] = myScore
                    }
                }
                innerHtml['sortType'] = sortType;
                innerHtml['GROUP_ID'] = org_id;
                innerHtml['is_super'] = is_super;
                innerHtml['is_admin'] = is_admin;
                innerHtml['is_member'] = is_member;
                innerHtml['is_login'] = is_login;
                if ($.cookie("person_id")) {
                    innerHtml['person_id'] = $.cookie("person_id");
                    innerHtml['identity_id'] = $.cookie("identity_id");
                }
                if (is_super == 1) {
                    innerHtml['member_type'] = 0;
                } else if (is_admin == 1) {
                    innerHtml['member_type'] = 1;
                } else {
                    innerHtml['member_type'] = 2;
                }
                innerHtml['getSpaceUserPhoto'] = getSpaceUserPhoto;
            } else {

            }
        },
        error: function() {

        }
    });

    var html = template('group_member_inner', innerHtml);
    $("#group_member").html(html);
    if (is_member == 1) {
        $("#jfdh").show();
    }
}

function changeSortType(obj, type){
    sortType = type
    getGroupMembers(1)
}