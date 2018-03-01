    window.onload = function(){
		if(is_admin){
		 	$("#add_news_btn").show();
		}
		loadClassNews();
    };
    function loadClassNews(pageNumber){
		var pageNum = pageNumber || 1;
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "register_id":1000014,
                "org_ids" : org_id,
                "notice_type": 1,
                "page_number":pageNum,
                "page_size":15,
            },
            url : url_path_action_login + "/notice/getNoticeList",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    var innerHTML = {};
                    innerHTML['list'] = data.list;
                    innerHTML['data'] = data;
                    innerHTML['base64Encode'] = base64Encode;
                    innerHTML['is_admin'] = is_admin;
                    
                    innerHTML['page_size'] = data.page_size;
                    innerHTML['total_page'] = data.total_page;
                    innerHTML['total_row'] = data.total_row;
                    innerHTML['page_number'] = data.page_number;
                    var html = template('mainClassNewsInner', innerHTML);
                    $("#mainClassNews").html(html);
                }else{
                    var innerHTML = {};
                    innerHTML['list'] = [];
                    var html = template('mainClassNewsInner', innerHTML);
                    $("#mainClassNews").html(html);
                }
            },
            error : function(){
                var innerHTML = {};
                innerHTML['list'] = [];
                var html = template('mainClassNewsInner', innerHTML);
                $("#mainClassNews").html(html);
            }
                });
    
    }


    function changeNoticeType(type){
        selectedNoticeType = type
        loadClassNews()
    }

    //解码
    function base64Encode(oldStr){
        var newStr = Base64.decode(oldStr);
        return newStr;
    }
    
    function addNews(){

        var ue;
        var html = "<div id='addNews'>"+
            "<div class='row' style='margin:0px;width: 650px;line-height: 34px;'>"+
            "<div class='col-md-1' style='width:70px'>标题：</div>"+
            "<div class='col-md-11' style='width:400px'><input name='' class='form-control' id='news_title' placeholder='请输入新闻资讯标题' type='text' />"+
            "<span class='help-block m-b-none'>新闻资讯标题<font color='red'>(必填，最多30个汉字，60个字符！)</font></span>"+
            "</div>"+
            "</div>"+
            "<div class='row' style='margin:0px;width: 600px;line-height: 34px;'>"+
            "<div class='col-md-1' style='width:70px'>内容：</div>"+
            "<div class='col-md-11' style='width:400px'>"+
            "<span class='help-block m-b-none' style='margin-top:0px;'>新闻资讯内容<font color='red'>(必填)</font></span>"+
            "</div>"+
            "</div>"+
            "<div class='row' style='margin:0px;line-height: 34px;'>"+
            "<div class='col-md-12'>"+
            "<script id='editor' type='text/plain'></script>"+
            "</div>"+
            "</div>"+
            "</div>";
    	var this_dialog = art.dialog({
    		content : html,
    		width : 750,
    		height : 400,
    		lock : true,
    		icon : null,
    		title : '发布新闻资讯',
    		init : function() {
    			$("#news_id").val("");
                //JS中初始化编辑器
                ue = UE.getEditor('editor', {
                    toolbars: [
                        tool_arr    //默认显示的工具栏，在base-config.js文件中定义
                    ],
                    initialFrameWidth:690,    //编辑器宽度
                    initialFrameHeight:300,    //编辑器高度
                    zIndex:11111
                });
    		},
    		//style:'succeed noClose',
    		close : function() {
    			//$("#addNav input").val("");
                ue.destroy();
    		}
    	}, function() {
    		//输入校验
    		var che_ =  $.trim($("#news_title").val());
    		var title_char_num = 0;
    		for ( var i = 0; i < che_.length; i++) {
    			if (che_[i].match(/[^\x00-\xff]/ig) != null)
    				title_char_num += 2;
    			else
    				title_char_num += 1;
    		}
    		if (title_char_num == 0 || title_char_num > 60) {
    			art.dialog.alert("标题请输入1-60个字符，1汉字=2字符！");
    			return false;
    		}
            if(!ue.hasContents()){
                art.dialog.alert("请填新闻资讯内容！");
                return false;
            }
    		var text =  ue.getContentTxt().substring(0,100);
    		if(text == null || text.length == 0){
    			art.dialog.alert("资讯内容不能只有图片！");
    			return false;
    		}
    		
    		var registerId = $("#regist_id").val();
    		var news_title = $("#news_title").val();//Base64.encode($("#news_title").val());
    		//content = Base64.encode(content);
            //ue.getKfContent(function(content) {
                $.ajax({
                    type: "POST",
                    url: url_path_action + "/notice/addNotice",
                    data: {
                    	"register_id": 1000014,
                        "title": news_title,
                        "content": ue.getContent(),
                        "notice_type": 1,//1表示新闻，2表示通知，3表示公告
                        "org_id": org_id,
                        "org_type": orgidentity_id,
                        "person_id": $.cookie("person_id"),
                        "identity_id": $.cookie("identity_id")
                    },
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.success) {
                        	
                        	dialogClose("操作成功！",3,200,"loadClassNews()");
                        	
                        } else {
                            art.dialog.alert(data.info);
                        }
                    }
                });
            //});
            return true;
    	}, function() {

    	}
    	
    	);

    }
    
    /**
     * 查看公告详情
     * @param url
     */
    function viewTheNews(url,title){
    	title = title || "";
		var dialog = art.dialog.open(url, {
			id : "setRole",
			lock : true,
			title : title,
			width : '90%',
			height : '80%'
		});
    }
    
    
    /**
     * 删除新闻
     */
    function deleteNews(news_id,regist_id,news_title){
    	art.dialog.confirm('确定要删除 “'+news_title+'”?', function () {
    		$.ajax({
    			type : "GET",
    			url : url_path_action + "/notice/deleteNoticeByIds?notice_ids="+news_id,
    			dataType : "json",
    			async : false,
    			success : function(data){
    				if(data.success){
    					dialogClose("删除成功！正在刷新列表...", 3, 220, 'loadClassNews()');
    					//getNewsList(1);
    				}else{
    					art.dialog.alert(data.info);
    				}
    			}
    		});
    	}, function () {
    		
    	});
    }
    

  //编辑新闻
  function editNews(news_id,regist_id){
  	$("#news_id").val(news_id);
      var ue;
  	var html = "<div id='addNews'>"+
          "<div class='row' style='margin:0px;width: 650px;line-height: 34px;'>"+
          "<div class='col-md-1'>标题：</div>"+
          "<div class='col-md-11'><input name='' class='form-control' id='news_title' placeholder='请输入新闻资讯标题' type='text' />"+
          "<span class='help-block m-b-none'>新闻资讯标题！<font color='red'>(必填，最多30个汉字，60个字符！)</font></span>"+
          "</div>"+
          "</div>"+
          "<div class='row' style='margin:0px;width: 600px;line-height: 34px;'>"+
          "<div class='col-md-1'>内容：</div>"+
          "<div class='col-md-11'>"+
          "<span class='help-block m-b-none' style='margin-top:0px;'>新闻资讯内容！<font color='red'>(必填)</font></span>"+
          "</div>"+
          "</div>"+
          "<div class='row' style='margin:0px;line-height: 34px;'>"+
          "<div class='col-md-12'>"+
          "<script id='editor' type='text/plain'></script>"+
          "</div>"+
          "</div>"+
          "</div>"
  	var this_dialog = art.dialog({
  		content : html,
  		width : 750,
  		height : 400,
  		lock : true,
  		icon : null,
  		title : '发布新闻资讯',
  		init : function() {
  			//getNewsById();
              //JS中初始化编辑器
              ue = UE.getEditor('editor', {
                  toolbars: [
                      tool_arr    //默认显示的工具栏，在base-config.js文件中定义
                  ],
                  initialFrameWidth:690,    //编辑器宽度
                  initialFrameHeight:300,    //编辑器高度
                  zIndex:11111
              });
              ue.ready(function(){
                  ue.setContent(getNewsById());//此处一般为通过ajax请求获取返回值，然后向编辑器赋值
              });
  		},
  		close : function() {
  			//$("#addNav input").val("");
              ue.destroy();
  		}
  	}, function() {
  		//输入校验
  		var che_ =  $.trim($("#news_title").val());
  		var title_char_num = 0;
  		for ( var i = 0; i < che_.length; i++) {
  			if (che_[i].match(/[^\x00-\xff]/ig) != null)
  				title_char_num += 2;
  			else
  				title_char_num += 1;
  		}
  		if (title_char_num == 0 || title_char_num > 60) {
  			art.dialog.alert("标题请输入1-60个字符，1汉字=2字符！");
  			return false;
  		}

          if(!ue.hasContents()){
              art.dialog.alert("请填新闻资讯内容！");
              return false;
          }
          var text =  ue.getContentTxt().substring(0,100);
          if(text == null || text.length == 0){
              art.dialog.alert("请填新闻资讯内容！");
              return false;
          }
  		
  		var news_title = $("#news_title").val();//Base64.encode($("#news_title").val());
  		//content = Base64.encode(content);
              
          //ue.getKfContent(function(content) {
              $.ajax({
                  type: "POST",
                  url: url_path_action + "/notice/editNotice",
                  data: {"notice_id": news_id,
                      "title": news_title,
                      "content": ue.getContent()
                  },
                  dataType: "json",
                  async: false,
                  success: function (data) {
                      if (data.success) {

                    	  dialogClose("操作成功！",1,200,"loadClassNews()");
                      } else {
                          art.dialog.alert(data.info);
                      }
                  }
              });
          //});
          return true;
  	}, function() {

  	}
  	
  	);
  }
  
  
//获取新闻信息
  function getNewsById(){
  	var regist_id = $("#regist_id").val();
  	var news_id = $("#news_id").val();
  	var html = '';
  	$.ajax({
  		type : "GET",
  		url : url_path_action_login + "/notice/getNoticeById?notice_id="+news_id,
  		dataType : "json",
  		async : false,
  		success : function(data){
  			if(data.success){				
  				$("#news_title").val(data.notice.title);//Base64.decode()
  				html += data.notice.content;//Base64.decode()
  			}else{
  				art.dialog.alert(data.info);
  			}
  		}
  	});
  	return html;	
  }