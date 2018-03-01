
var orgid = 0,orgidentity_id = 0;
$(function(){
    orgid = GetQueryString("id");
    orgidentity_id = GetQueryString("iid");
    $('#groupArticleNav > .nav-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if($(this).attr("href") == "#myArticle"){
            getMyArticleMain();
        }else if($(this).attr("href") == "#orgArticle"){
            getMyOrgArticleMain();
        }
    });
    $('#groupArticleNav > .nav-tabs a:first').trigger("click");

    $(".allPublishBtn").live("click",function(){

        var artId = [],that_=this;
        if($(this).attr("class") == "noExist allPublishBtn"){
            artId.push($(this).closest("tr").find(".artId").val()-0);
        }else{
            $("#myArtMainList").find(".artId:checked").each(function(i){
                artId.push($(this).val()-0);
            });
        }
        if(artId.length == 0){
            art.dialog({
                title: "提示",
                content: "请选择文章",
                width: 200,
                lock:true,
                time:1.5,
                resize: false,
                fixed:true,
                cancel:false
            });
            return false;
        }
        var pubArt = art.dialog({
            content:"",
            width: 250,
            //height: 400,
            lock:true,
            icon: null,
            title:"请选择要发布到的分类",
            //style:'succeed noClose',
            close:function(){

            },
            init:function(){
                var innerHtml = {};
                $.ajax({
                    type : "GET",
                    async : true,
                    data:{
                        "random_num":creatRandomNum(),
                        "person_id": orgid,
                        "identity_id":orgidentity_id,
                        "business_type": (orgidentity_id == 105?3:2),
                        "business_id": orgid,
                        "business_iid": orgidentity_id,
                        "level":1
                    },
                    url : url_path_action_login + "/blog/getCategory",
                    dataType: "json",
                    success: function (data) {
                        innerHtml['data'] = data;
                        var html = template("orgSortInner",innerHtml);
                        pubArt.content(html);
                    },
                    error: function(){
                        var data = {};
                        data.success = false;
                        innerHtml['data'] = data;
                        var html = template("orgSortInner",innerHtml);
                        pubArt.content(html);
                    }
                });

            }
        },function(){
            var categoryId = $("#orgSortSelect").val();
            if(categoryId == -1 || !!categoryId == false){
                return false;
            }
            var info = "";
            $.ajax({
                type : "POST",
                async : false,
                data:{
                    "random_num":creatRandomNum(),
                    "b_category_id": categoryId,
                    "business_type":(orgidentity_id == 105?3:2),
                    "business_id": orgid,
                    "business_iid": orgidentity_id,
                    "ids":JSON.stringify(artId)
                },
                url : url_path_action + "/blog_expand/pull_article_expand",
                dataType: "json",
                success: function (data) {
                    if(data.success){
                        info = "操作成功";
                        var bbbid = 0;
                        if(orgidentity_id == 105){
                            bbbid = 131;
                        }else if(orgidentity_id == 106){
                            bbbid = 151;
                        }else if(orgidentity_id == 107){
                            bbbid = 181;
                        }

                        if($(that_).attr("class") == "noExist allPublishBtn"){
                            var dom_ = $(that_).closest("tr").find(".artId");
                            var options = {
                                business_type:bbbid,
                                relatived_id:$(dom_).val(),
                                r_person_id:orgid,
                                r_identity_id:orgidentity_id,
                                operation_content:$.cookie("person_name") + '发表了文章' + $(dom_).attr("data-artTitle") + '。',
                                e_relatived_id:$(dom_).attr("data-expand_id")
                            };
                            creditWriteToQueue(options);
                        }else{
                            $("#myArtMainList").find(".artId:checked").each(function(i){
                                var options = {
                                    business_type:bbbid,
                                    relatived_id:$(this).val(),
                                    r_person_id:orgid,
                                    r_identity_id:orgidentity_id,
                                    operation_content:$.cookie("person_name") + '发表了文章' + $(this).attr("data-artTitle") + '。',
                                    e_relatived_id:$(this).attr("data-expand_id")
                                };
                                creditWriteToQueue(options);
                            });
                        }

                    }else{
                        info = "操作失败";
                    }
                },
                error: function(){
                    info = "操作失败";
                }
            });
            art.dialog({
                title: "提示",
                content: info,
                width: 200,
                lock:true,
                time:2,
                resize: false,
                fixed:true,
                cancel:false,
                close:function(){
                    var page = 0;
                    page = $("#myArticlePage .btn-primary").text();
                    if(!!page == false || page < 1){
                        page = 1;
                    }
                    getPersonArticleList(page);
                }
            });
        },function(){

        });
    });
    //***********************************************
    $(".delPublishBtn").live("click",function(){
        var list_last = 0;
        var artId = [];
        if($(this).attr("class") == "noExist delPublishBtn"){
            artId.push({
                "id":$(this).closest("tr").find(".artId").val()-0,
                "b_category_id":$(this).closest("tr").find(".artId").attr("data-b_category_id"),
                "expand_id":$(this).closest("tr").find(".artId").attr("data-expand_id")
            });
            if($(this).closest("tr").siblings().length == 0){
                list_last = 1;
            }
        }else{
            $("#myArtMainList2").find(".artId:checked").each(function(i){
                artId.push({
                    "id":$(this).val()-0,
                    "b_category_id":$(this).attr("data-b_category_id"),
                    "expand_id":$(this).attr("data-expand_id")
                });
            });
            if($("#myArtMainList2").find(".artId:checked").length == $("#myArtMainList2").find(".artId").length){
                list_last = 1;
            }
        }
        if(artId.length == 0){
            art.dialog({
                title: "提示",
                content: "请选择文章",
                width: 200,
                lock:true,
                time:1.5,
                resize: false,
                fixed:true,
                cancel:false
            });
            return false;
        }
        art.dialog.confirm("确定要取消已发布的文章吗？",function(){
            var info = "";
            $.ajax({
                type : "POST",
                async : false,
                data:{
                    "random_num":creatRandomNum(),
                    "ids":JSON.stringify(artId)
                },
                url : url_path_action + "/blog_expand/del_article_expand",
                dataType: "json",
                success: function (data) {
                    if(data.success){
                        info = "操作成功";
                    }else{
                        info = "操作失败";
                    }
                },
                error: function(){
                    info = "操作失败";
                }
            });
            art.dialog({
                title: "提示",
                content: info,
                width: 200,
                lock:true,
                time:2,
                resize: false,
                fixed:true,
                cancel:false,
                close:function(){
                    var page = 0;
                    page = $("#myArticlePage2 .btn-primary").text();
                    page = page - list_last;
                    if(!!page == false || page < 1){
                        page = 1;
                    }
                    getOrgArticle(page);
                }
            });
        },function(){

        });

    });
    $("#checkboxAll").live("click",function(){
        if($(this).attr("checked")){
            $("#myArtMainList .artId:enabled").attr("checked",true);
        }else{
            $("#myArtMainList .artId").attr("checked",false);
        }
    });
    $("#checkboxDelAll").live("click",function(){
        if($(this).attr("checked")){
            $("#myArtMainList2 .artId:enabled").attr("checked",true);
        }else{
            $("#myArtMainList2 .artId").attr("checked",false);
        }
    });
});
//获取全部文章模板
function getMyArticleMain(){
    var html = template("myArticleInner",{});
    $("#myArticle").html(html);
    getPersonSort();
    getOrgSort();
}
//获取全部机构文章模板
function getMyOrgArticleMain(){
    var html = template("orgArticleInner",{});
    $("#orgArticle").html(html);
    getOrgArticle(1);
}
function getPersonSort(){
    var innerHtml = {};
    $.ajax({
        type : "GET",
        async : true,
        data:{
            "random_num":creatRandomNum(),
            "person_id": $.cookie("person_id"),
            "identity_id":$.cookie("identity_id"),
            "business_type": 1,
            "business_id": $.cookie("person_id"),
            "business_iid": $.cookie("identity_id"),
            "level":2
        },
        url : url_path_action_login + "/blog/getCategory",
        dataType: "json",
        success: function (data) {
            innerHtml['data'] = data;
            var html = template('articleCategory_inner', innerHtml);
            $("#articleCategory").html(html);
            bindCategoryClick();
            $("#articleCategory li").removeClass("active");
            $("#category_").addClass("active");
        },
        error: function(){
            var data = {}
            data.success = false;
            innerHtml['data'] = data;
            var html = template('articleCategory_inner', innerHtml);
            $("#articleCategory").html(html);
        }
    });
}
function getOrgSort(){
    var innerHtml = {};
    $.ajax({
        type : "GET",
        async : true,
        data:{
            "random_num":creatRandomNum(),
            "person_id": orgid,
            "identity_id":orgidentity_id,
            "business_type": (orgidentity_id == 105?3:2),
            "business_id": orgid,
            "business_iid": orgidentity_id,
            "level":1
        },
        url : url_path_action_login + "/blog/getCategory",
        dataType: "json",
        success: function (data) {
            innerHtml['data'] = data;
            var html = template('orgSort_inner', innerHtml);
            $("#orgSort").html(html);
        },
        error: function(){
            var data = {};
            data.success = false;
            innerHtml['data'] = data;
            var html = template('orgSort_inner', innerHtml);
            $("#orgSort").html(html);
        }
    });
}
function bindCategoryClick(){
    $("#articleCategory li").click(function(){
        $("#articleCategory li").removeClass("active");
        $(this).addClass("active");
        getPersonArticleList(1);
    });
    getPersonArticleList(1);
}
//获取机构文章列表
function getOrgArticle(page){
    var innerHtml = {};
    $.ajax({
        type: "GET",
        async: true,
        data: {
            "random_num": creatRandomNum(),
            "search_type": "title",
            "search_key": "",
            "pagenum": page,
            "pagesize": 10,
            "business_id":orgid,
            "business_iid":orgidentity_id,
            "business_type":(orgidentity_id == 105?3:2),
            "person_id":$.cookie("person_id"),
            "identity_id":$.cookie("identity_id")
        },
        url: url_path_action_login + "/blog_expand/list_article_expand",
        dataType: "json",
        success: function (data) {
            innerHtml['data'] = data;
            //innerHtml['checkIsSpaceImg'] = checkIsSpaceImg;
            var html = template('myArticle2_inner', innerHtml);
            $("#myArtMainList2").html(html);
            $("#myArticlePage2").spacePage({
                pageSize:data.page_size,
                pageNumber:data.page_number,
                totalPage:data.total_page,
                totalRow:data.total_row,
                callBack:getOrgArticle
            });
        },
        error: function(){
            var data = {};
            data.success = false;
            innerHtml['data'] = data;
            var html = template('myArticle2_inner', innerHtml);
            $("#myArtMainList2").html(html);
        }
    });
}
function getPersonArticleList(page){
    var searchVal = "";
    if(searchVal.length > 0){
        searchVal = Base64.encode(searchVal);
    }
    var innerHtml = {};
    $.ajax({
        type: "GET",
        async: true,
        data: {
            "random_num": creatRandomNum(),
            "search_type": "title",
            "search_key": searchVal,
            "identity_id": $.cookie("identity_id"),
            "person_id": $.cookie("person_id"),
            "pagenum": page,
            "pagesize": 10,
            "business_type": 1,
            "category_id": $("#articleCategory li.active input").val(),
            "b_id":orgid,
            "b_iid":"106,107",
            "b_type":2
        },
        url: url_path_action_login + "/blog/search",
        dataType: "json",
        success: function (data) {
            innerHtml['data'] = data;
            //innerHtml['checkIsSpaceImg'] = checkIsSpaceImg;
            var html = template('myArticle_inner', innerHtml);
            $("#myArtMainList").html(html);
            $("#myArticlePage").spacePage({
                pageSize:data.page_size,
                pageNumber:data.page_number,
                totalPage:data.total_page,
                totalRow:data.total_row,
                callBack:getPersonArticleList
            });
        },
        error: function(){
            var data = {};
            data.success = false;
            innerHtml['data'] = data;
            var html = template('myArticle_inner', innerHtml);
            $("#myArtMainList").html(html);
        }
    });
}











