$(function () {
//加载页面判断登录状态
    if (sso_flag == 0) {

    } else {
    	//if(!$.cookie("person_id") || !$.cookie("identity_id")){
    		//$.getJSON(isLoginAddr + "?targetService=" + getLoginInfoAddr + "&callback=?", {}, function (data, status) {
    		//	loginState(data);
    		//});
    		//addScriptTag(isLoginAddr + "?targetService=" + getLoginInfoAddr + "&callback=loginState");
    	//}
    }
});

function addScriptTag(src){
    var script = document.createElement('script');
    script.setAttribute("type","text/javascript");
    script.src = src;
    document.body.appendChild(script);
}

//回车登录
function enterLogin(event){
	if(event.keyCode == 13) {
		event.returnValue=false;  
	    event.cancel = true;   
	    doLogin();
	}
}

//登录
function doLogin(){
	if(sso_flag == 0){
		doLoginLocal();
	}else{
		doLoginSso();
	}
}


//本地登录
function doLoginLocal(){
	//云平台登录
	var login_type = 1;
	//附中登录
	//var login_type = 2;
	var username = document.getElementById("user").value;
	username = username.replace(/(^\s*)|(\s*$)/g, "");
	if(username == ""){
		$("#log_error").text("请输入用户名！");
		$("#log_error").css("visibility","visible");
		return;
	}
	var password = document.getElementById("pwd").value;
	password = password.replace(/(^\s*)|(\s*$)/g, "");
	if(password == ""){
		$("#log_error").text("请输入登录密码！");
		$("#log_error").css("visibility","visible");
		return;
	}
	
	$.ajax({
		url:url_path_action_login + "/login/doLogin?random_num=" + creatRandomNum()+"&login_type="+login_type+"&sys_type=7",
		async: false,
		type: "GET",
		data: $("#login_form").serialize(),
		dataType: "json",
		success: function(data)
		{
			if(data.success){
				
				//教师ID
				$.cookie("person_id", data.person_id, {path:"/"});
				//头像路径
				//$.cookie("avatar_url", getYptPersonTx(), {path:"/"});
				//身份ID
				$.cookie("identity_id", data.identity, {path:"/"});
				//票据
				$.cookie("token", data.token, {path:"/"});			
                //教师姓名
				$.cookie("person_name", data.person_name, {path:"/"});
				//角色ID
				$.cookie("role_id", data.role_id, {path:"/"});
				//
				$.cookie("user", data.user, {path:"/"});
				//刷新定位选中模块
				$.cookie("menu_value_cookie",1,{path:"/"});
				//定位我的模块
				$.cookie("res_yunormy",1,{path:"/"});
				$.cookie("que_yunormy",1,{path:"/"});
				$.cookie("juan_yunormy",1,{path:"/"});
				$.cookie("bk_yunormy",1,{path:"/"});
				$.cookie("wk_yunormy",1,{path:"/"});
				//群组定位10-25
				$.cookie("group_id",0,{path:"/"});
				$.cookie("STATIC_INDEX_NAME", "云备课中心", {path:"/"});
				
                window.location.reload();
				
			}else{
				$("#log_error").css("visibility","visible");
				$("#log_error").html(data.info);
			}
		}
	});
}

//sso登录
function doLoginSso(){
	var userName = document.getElementById("user").value;
	userName = userName.replace(/(^\s*)|(\s*$)/g, "");
	if(userName == ""){
		$("#log_error").text("请输入用户名！");
		$("#log_error").css("visibility","visible");
		return;
	}
	var password = document.getElementById("pwd").value;
	password = password.replace(/(^\s*)|(\s*$)/g, "");
	if(password == ""){
		$("#log_error").text("请输入登录密码！");
		$("#log_error").css("visibility","visible");
		return;
	}
	
	addScriptTag(ajaxLoginAddr + "?targetService=" + getLoginInfoAddr + "&callback=loginFormState&userName=" + userName + "&password=" + password);    
	//$.getJSON(ajaxLoginAddr+"?targetService="+getLoginInfoAddr+"&callback=?", {userName:userName,password:password,t:Math.random()}, function(data){
	//	loginFormState(data);
	//});
}


//1.判断浏览器登录状态后
function loginState(data) {
	var xmlHttp;
    if(data.isLogin == "true"){
		/**if (window.XMLHttpRequest){
			xmlHttp = new XMLHttpRequest();
		}else{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		}
		xmlHttp.onreadystatechange = function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				loginAfterSso();
			}
		}
		var url = getLoginInfoAddr + "?ticket="+data.ticket+"&t=" + Math.random();//刷新页面也进行一次票据验证
		xmlHttp.open("GET",url,true);
		xmlHttp.send();*/
    	$.ajax({
    		type : "GET",
    		url : getLoginInfoAddr + "?ticket="+data.ticket, //刷新页面也进行一次票据验证
    		async : false,
    		dataType:"json",
    		success : function(data){
    			loginAfterSso(2);
    		},
    		error : function(status){
    			loginAfterSso(2);
    		}
    	});
	}else{
		$.removeCookie('person_id', { path: '/' });
		$.removeCookie('identity_id', { path: '/' });
	}
}

//2.点击登录按钮后
function loginFormState(data) {
	var xmlHttp;
    if(data.isLogin == "true"){
		/*if (window.XMLHttpRequest){
			xmlHttp = new XMLHttpRequest();
		}else{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		}
		xmlHttp.onreadystatechange = function(){
			if (xmlHttp.readyState==4 && xmlHttp.status==200){
				loginAfterSso();
			}
		}
		var url = getLoginInfoAddr + "?ticket="+data.ticket+"&t=" + Math.random();
		xmlHttp.open("GET",url,true);
		xmlHttp.send();*/
    	$.ajax({
    		type : "GET",
    		url : getLoginInfoAddr + "?ticket="+data.ticket, //刷新页面也进行一次票据验证
    		async : false,
    		dataType:"json",
    		success : function(data){
    			loginAfterSso(1);
    		},
			error : function(data){
				loginAfterSso(1);
			}
    	});
	}else{
		switch (data.errorCode){
			case '1':
				$("#log_error").text("用户名不存在！");
				$("#log_error").css("visibility","visible");
				break;
			case '2':
				$("#log_error").text("用户名和密码不匹配！");
				$("#log_error").css("visibility","visible");
				break;
			case '3':
				//$("#log_error").text("用户无权限访问该系统！");
				//$("#log_error").css("visibility","visible");
				break;
			case '4':
				$("#log_error").text("票据已经失效,请重新登录！");
				$("#log_error").css("visibility","visible");
				break;
			case '0':
				$("#log_error").text("服务器端票据错误！");
				$("#log_error").css("visibility","visible");
				break;
		}
	}
}

//sso登录后，在本地登录
function loginAfterSso(formFlag){
	//云平台登录
	var login_type = 1;
	//var username = document.getElementById("user").value;
	//username = username.replace(/(^\s*)|(\s*$)/g, "");
	
	$.ajax({
		//不带数据共享
		//url:url_path_action_login + "/caslogin/teacheradd?random_num=" + creatRandomNum()+"&login_type="+login_type,
		//带数据共享
		url:url_path_action_login + "/caslogin/casLoginWithShare?random_num=" + creatRandomNum()+"&login_type="+login_type+"&sys_type=7",
		async: false,
		type: "GET",
		dataType: "json",
		success: function(data)
		{
			if(data.success){
				
				//教师ID
				$.cookie("person_id", data.person_id, {path:"/"});
				//头像路径
				//$.cookie("avatar_url", getYptPersonTx(), {path:"/"});
				//身份ID
				$.cookie("identity_id", data.identity, {path:"/"});
				//票据
				$.cookie("token", data.token, {path:"/"});			
                //教师姓名
				$.cookie("person_name", data.person_name, {path:"/"});
				//角色ID
				$.cookie("role_id", data.role_id, {path:"/"});
				//
				$.cookie("user", data.user, {path:"/"});
				//刷新定位选中模块
				$.cookie("menu_value_cookie",1,{path:"/"});
				//定位我的模块
				$.cookie("res_yunormy",1,{path:"/"});
				$.cookie("que_yunormy",1,{path:"/"});
				$.cookie("juan_yunormy",1,{path:"/"});
				$.cookie("bk_yunormy",1,{path:"/"});
				$.cookie("wk_yunormy",1,{path:"/"});
				//群组定位10-25
				$.cookie("group_id",0,{path:"/"});
				$.cookie("STATIC_INDEX_NAME", "云备课中心", {path:"/"});

				if(formFlag == 1){
					window.location.reload();
				}
				
			}else{
				$("#log_error").css("visibility","visible");
				$("#log_error").html(data.info);
			}
		}
	});
}

function check(){
	var username = document.getElementById("user").value;
	username = username.replace(/(^\s*)|(\s*$)/g, "");
	if(username == ""){
		$("#log_error").text("请输入用户名！");
		$("#log_error").css("visibility","visible");
		return false;
	}
	var password = document.getElementById("pwd").value;
	password = password.replace(/(^\s*)|(\s*$)/g, "");
	if(password == ""){
		$("#log_error").text("请输入登录密码！");
		$("#log_error").css("visibility","visible");
		return false;
	}
	return true;
}


/*空间退出*/
function doLogout(toPage){
	var url = url_path_html + "/login/doLogout?type=2&t=" + Math.random();
	$.ajax({
		url:url,
		type:"get",
		async: false,
		success:function(data){
			if(null != toPage){
				window.location = toPage;
			}else{
				window.location = "/dsideal_yy/yx/html/index.html";
			}
		}
	});
}