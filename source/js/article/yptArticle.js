var seq = 0;
function getPersonSortList(callback){
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
        url : url_path_action + "/blog/getCategory",
        dataType: "json",
        success : function(data) {
            if(data.success){
                innerHtml["list"] = data.list;
				var html = template('fenleiListInner', innerHtml);
				$("#per_sort").html(html);
				if(callback){
					callback();
				}
            }
        }
    });
   
}

function getOrgSortList(callback){
    var innerHtml = {};
    $.ajax({
        type : "GET",
        async : true,
        data:{
            "random_num":creatRandomNum(),
            "business_type": 1,
            "business_id": 1,
            "level":1,
            "identity_id": $.cookie("identity_id")
        },
        url : url_path_action + "/blog/getCategory",
        dataType: "json",
        success : function(data) {
            if(data.success){
                innerHtml["list"] = data.list;
				var html = template('orgFenleiListInner', innerHtml);
				$("#org_sort").html(html);
				if(callback){
					callback();
				}
            }
        }
    });
    
}


function getArticleCategoryForManage(){
	$("#articleCategoryManageDialog table tbody").empty();
	$.ajax({
		type : "GET",
		async : false,
		data:{"random_num":creatRandomNum(),
			"person_id":$.cookie("person_id"),
			"identity_id":$.cookie("identity_id"),
            "business_type": 1,
            "business_id": $.cookie("person_id"),
            "business_iid": $.cookie("identity_id"),
            "level": 2			
		},
		url : url_path_action + "/blog/getCategory",
		dataType: "json",
		success : function(data) {
			if(data.success){
				var innerHTML = {};
				innerHTML['data'] = data;
				var html = template('articleCategoryManage_inner', innerHTML);
				$("#articleCategoryManageDialog table tbody").html(html);
                //这里计算seq最大值
                for(var i = 0;i<data.list.length;i++){
                    seq = data.list[i].sequence>seq?data.list[i].sequence:seq;
                }
			}
		},
		error : function(){
			var data = {}
        	data.success = false;
        	innerHtml['data'] = data;
            var html = template('articleCategoryManage_inner', innerHtml);
            $("#articleCategoryManageDialog table tbody").html(html);
		}
	});
}

function articleCategoryManage(fromPublish){
	getArticleCategoryForManage();
	dia=art.dialog({
        content:$('#articleCategoryManageDialog').html(),
        width: 700,
        //height: 400,
        lock:true,
        icon: null,
        title: '分类管理',
        //style:'succeed noClose',
        close:function(){
        	if(fromPublish == 2){
        		getPersonSortList();
        	}
        },
		ok: true
    });
	
}


//type 0:add  1:update
function editSortManage(type,dom,id){
  var html_ = "<div id='editSortDiv' style='width:400px;'>" +
          "<table width='100%' class='table table-info'>" +
              "<tbody><tr>" +
                  "<td scope='row' width='72'>分类名称<br/>&nbsp;</td>" +
                  "<td colspan='3'><div id='editSortTitle'></div>" +
              "</tr></tbody>" +
          "</table>" +
          "</div>";
  var editSortTitleInput = null;
  art.dialog({
      title: (type==0?"增加分类":"修改分类"),
      content: html_,
      fixed: true,
      lock: true,
      width:400,
      init:function(){
          editSortTitleInput = $("#editSortTitle").input({
              index:3,
              placeholder:"请输入分类名称",
              maxCount:20,
              showType:1,
              width:275,
              onCheck:function(){
                  var val = editSortTitleInput.input("value");
                  if(val == ""){
                      editSortTitleInput.input("setTips","分类名称不能为空")
                  };
              }
          });

          if(type == 1){
              editSortTitleInput.input("setVal",$(dom).closest("tr").find(".title").html());
          }
          $("#editSortTitle").val($.trim($("#editSortTitle").val()).substring(0,20));
          $("#editSortHid").text(20-$("#editSortTitle").val().length);
          $("#editSortTitle").bind("keyup",function(){
              $("#editSortTitle").val($.trim($("#editSortTitle").val()).substring(0,20));
              $("#editSortHid").text(20-$("#editSortTitle").val().length);
          }).bind("paste",function(){
              $("#editSortTitle").val($.trim($("#editSortTitle").val()).substring(0,20));
              $("#editSortHid").text(20-$("#editSortTitle").val().length);
          });
      }
  },function(){
      var sorttitle = editSortTitleInput.input("value");
      if(sorttitle.length == 0){
          art.dialog.alert("请输入分类名称！");
          return false;
      }else if(sorttitle.length>20){
          art.dialog.alert("分类名称过长！");
          return false;
      }

      if(type == 0) {
          $.ajax({
              type : "POST",
              async : false,
              data:{
                  "random_num":creatRandomNum(),
                  "name": sorttitle,
                  "sequence": seq + 1,
                  "person_id": $.cookie("person_id"),
                  "identity_id":$.cookie("identity_id"),
                  "business_type":1,
                  "business_id":$.cookie("person_id"),
                  "business_iid":$.cookie("identity_id"),
                  "level":2,
                  "person_name": $.cookie("person_name")
              },
              url : url_path_action + "/blog/savePersonCategory",
              dataType: "json",
              success : function(data) {
                  if(data.success){
                      dialogClose("保存成功！",2,150,"");
                      seq += 1;
                      getArticleCategoryForManage();
      				dia.content($('#articleCategoryManageDialog').html());
      				//getArticleCategory();
                  }else{
                      dialogClose("保存失败！",2,150,"");
                  }
              },
              error : function(){
                  dialogClose("保存失败！",2,150,"");
              }
          });

      }else{
          $.ajax({
              type : "POST",
              async : false,
              data:{
                  "random_num":creatRandomNum(),
                  "name": sorttitle,
                  "id": id
              },
              url : url_path_action + "/blog/updatePersonCategory",
              dataType: "json",
              success : function(data) {
                  if(data.success){
                      dialogClose("修改成功！",2,150,"");
                      getArticleCategoryForManage();
      				dia.content($('#articleCategoryManageDialog').html());
      				//getArticleCategory();
                  }else{
                      dialogClose("修改失败！",2,150,"");
                  }
              },
              error : function(){
                  dialogClose("修改失败！",2,150,"");
              }
          });

      }
  },function(){

  });
}

function delSortManage(dom,id){
  art.dialog({
      title: "删除分类",
      content: "确定删除\""+$(dom).closest("tr").find(".title").html()+"\"这个分类吗?",
      fixed: true,
      lock: true,
      icon: 'question'
  },function(){
      $.ajax({
          type : "POST",
          async : false,
          data:{
              "random_num":creatRandomNum(),
              "ids": id
          },
          url : url_path_action + "/blog/deletPersonCategoryByIds",
          dataType: "json",
          success : function(data) {
              if(data.success){
                  dialogClose("删除成功！",2,150,"");
                  getArticleCategoryForManage();
  				dia.content($('#articleCategoryManageDialog').html());
  				//getArticleCategory();
              }else{
                  art.dialog.alert("删除失败！"+data.info);
              }
          },
          error : function(){
          	art.dialog.alert("删除失败！"+data.info);
          }
      });
  },function(){

  });
}
//0 up 1 down
function moveSortManage(dom,type){
  var thisElem = $(dom).closest("tr");
  var flag = false;
  if((type == 0 && thisElem.index() > 0)||(type == 1 && thisElem.index() < thisElem.siblings().length)){
      flag = true;
  }

  if(flag){
      var c_json = [];
      if(type == 0){
          var acid = thisElem.find(".cid").val();
          var acseq = thisElem.find(".cseq").val();
          var bcid = thisElem.prev().find(".cid").val();
          var bcseq = thisElem.prev().find(".cseq").val();
          c_json = [{"category_id":acid,"sequence":bcseq},
              {"category_id":bcid,"sequence":acseq}];
      }else{
          var acid = thisElem.find(".cid").val();
          var acseq = thisElem.find(".cseq").val();
          var bcid = thisElem.next().find(".cid").val();
          var bcseq = thisElem.next().find(".cseq").val();
          c_json = [{"category_id":acid,"sequence":bcseq},
              {"category_id":bcid,"sequence":acseq}];
      }

      //处理ajax
      $.ajax({
          type : "POST",
          async : false,
          data:{
              "random_num":creatRandomNum(),
              "category": JSON.stringify(c_json),
              "org_person_id": $.cookie("person_id"),
              "identity_id": $.cookie("identity_id")
          },
          url : url_path_action + "/blog/updateCategoryOrder",
          dataType: "json",
          success : function(data) {
              if(data.success){
                  dialogClose("操作成功！",2,150,"");
                  getArticleCategoryForManage();
  				dia.content($('#articleCategoryManageDialog').html());
  				//getArticleCategory();
              }else{
                  dialogClose("操作失败！",2,150,"");
              }
          },
          error : function(){
              dialogClose("操作失败！",2,150,"");
          }
      });
  }
}

function getArticleCategory(){
    var innerHtml = {};
    $.ajax({
        type : "GET",
        async : true,
        data:{
            "random_num":creatRandomNum(),
            "person_id": person_id,
            "identity_id":identity_id,
            "business_type": 1,
            "business_id": person_id,
            "business_iid": identity_id,
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
            $("#category_"+cur_category).addClass("active");
        },
        error: function(){
        	var data = {};
        	data.success = false;
        	innerHtml['data'] = data;
            var html = template('articleCategory_inner', innerHtml);
            $("#articleCategory").html(html);
        }
    });
}

function deleteArticle(id,expand_id,page_number){
	 var ids = [{"id":id,"category_id":expand_id}];
	 art.dialog.confirm("确定要删除吗？",function(){
		var url = url_path_html+"/yx/article/delArticle?t=" + Math.random();
		var data = {
			ids:ids
		};
		$.ajax({
			   async:true,
			   url: url,
			   type : 'post',
			   data : {
				   ids : JSON.stringify(ids)
			   },
			   dataType: 'json',
			   success: function(data){
				   if(data.success){
						dialogClose("删除成功！",3,200,'toPage(' + page_number + ')');
				   }else{
					   dialogClose("系统繁忙，请稍后再试！",3,200,'');
				   }
			   }
		});	
	});
}

function deleteServiceArticle(id, expand_id, callback){
    art.dialog.confirm("确定要执行删除操作吗？", function (){
        if(!id || !expand_id){
            art.dialog.alert("id和expand_id不能为空");
            return false;
        }
        $.ajax({
            type:"post",
            url : url_path_html + "/yx/article/delArticleExpand",
            data : {id:id, expand_id:expand_id},
            dataType : "json",
            success : function(res){
                if(res){
                    dialogClose("删除成功,正在刷新页面...",2,200);
                    if(callback){
                        setTimeout(function(){
                            new Function(callback)();
                        },2000);
                    }
                }else{
                    art.dialog.alert("删除失败！");
                }

            }
        });
    });
}

/**
  * 查看详细
  */
 function viewDetail(id,expandId){
 	var url = parent.window.location + "";
 	url = url.substring(0,url.lastIndexOf("\/"));
 	window.open(url + "/article.html?id=" + id+"&expand_id="+expandId);
 }