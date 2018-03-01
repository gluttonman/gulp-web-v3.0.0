
//页面连接地址  jfinal:""  tomcat:"/dsideal_yy"
var url_path_html;
function getContextHtmlPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    if(result != "/dsideal_yy") {
    	result = pathName.substr(0,0);
    }
    return result;
}
url_path_html = getContextHtmlPath();

var url_path_action;
function getContextActionPath() {
    var pathName = document.location.pathname;
	
    var index = pathName.substr(1).indexOf("/html");
    var result = pathName.substr(0,index+1);
	
	result = "/dsideal_yy";
    return result;
}

//未登录时调用的action路径
var url_path_action_login = getContextActionPath();
//前台action路径
url_path_action = getContextActionPath() + "/ypt";

//contextpath
var contextpath= getContextActionPath() ;


//后台action路径
var url_path_action_ht = getContextActionPath() + "/management";


//分页每页显示条数
var pageSize = 20;
//文件名称长度
var fileNameLength = 100;

var view = "";
var rtype = "";
var nid = "";
var is_root = "";
var cnode = "";
var sort_type = "";
var sort_num = "";
var pg = "";
var totalPage = "";
var totalRow = 0;
var btype = "";

//管理我的试题中试题分类
var my_qtype = "";
//管理我的资源还是我的题库选题
var que_mtype = "";

//=======2015-11-21-JYY-云版还是局版
var versionParam = "common.server.location";
if($("#is_sfwpt").val()==1){
	var result = getGolbalValueByKeys(versionParam);
	var pt_type = result[versionParam];
}else{
	if(typeof(top.pt_type) == "undefined"){ 
		var result = getGolbalValueByKeys(versionParam);
		var pt_type = result[versionParam];
	}else{
		var pt_type = top.pt_type;
	}
}


if(pt_type == 1){
	//素材服务器IP地址
	var url_path_down = "http://dsideal-yy.oss-cn-qingdao.aliyuncs.com/";
	//资源上传地址
	var url_path = "http://dsideal-yy.oss-cn-qingdao.aliyuncs.com";
	//资源上传地址后缀
	var url_path_suffix = "down/Material/";
    //图片预览地址
    var url_path_img = "down/Material/";
	//上传地址（缩略图等）
	var url_path_other = "http://dsideal-yy.oss-cn-qingdao.aliyuncs.com";
	//访问地址（后台上传后跳转的action用到）
	var _action_path = "";
	//游戏资源地址 周枫
	var url_path_game = "down/Game/";
	//专题资源地址 周枫
	var url_path_zt = "down/Zhuanti/";
	//图片预览压缩请求地址
	var STATIC_IMAGE_PRE = "http://image.edusoa.com/";
	//专题资源地址 wzt
	var zt_url_path_down = 'down/Zhuanti/';

	var game_url_path_down = 'down/Game/';
	//微课app
	var wkapp_url_path_down = 'down/dzsb/apk/';
	//游戏移动端 apk ios windows
	var game_app_url_path_down ='down/App/';
}else{
	//图片上传地址（头像等）
	var url_path_img_head = "down/Image/";

	//访问地址（后台上传后跳转的action用到）
	var _action_path = "";
	
	var url_path_down = url_path_html + "/html/";//	demo:/dsideal_yy/html/

	//局版资源上传路径 周枫
	var url_path_suffix = "down/Material/";
	var url_path = url_path_action_login + "/res/newUpload/";
	//局版图片预览路径 周枫
    var url_path_img = "thumb/Material/";
	//图片预览压缩请求地址
	var STATIC_IMAGE_PRE = "";

	var zt_url_path_down = 'down/Zhuanti/';

	var game_url_path_down = 'down/Game/';
	//微课app
	var wkapp_url_path_down = 'down/dzsb/apk/';
	//游戏移动端 apk ios windows
	var game_app_url_path_down ='down/App/';
}


/*
    功能：初始化配置_action_path和局版STATIC_IMAGE_PRE的值，解决在配置文件中写固定IP地址的问题。
    作者：JYY
    时间：2015-05-19
*/
$(function(){ 
	
	var server_url = document.location.host;
	if(server_url.substring(0,7) != "http://"){		
		_action_path = "http://" + server_url;		
	}else{		
		_action_path = server_url;
	}
	
	if(pt_type == 2){
		STATIC_IMAGE_PRE = _action_path + "/dsideal_yy/html/";
	}
	//console.log(_action_path);
});


/*
    功能：将中文内容的斜杠和双引号转了，方便保存到lua+ssdb中,从SSDB提取出来组装JSON时就不会出错。
    作者：黄海
    时间：2015-01-31
*/
function jsonencode(str)
{
    var res = str.replace(/\"/g, "\\\"");
    res = res.replace(/\\/g, "\\\\");            
    return res;
}

function getGolbalValueByKeys(keys)
{	
	var myJson;
	$.ajax({
		type : "GET",		
		url : url_path_action_login + "/golbal/getValueByKey?key="+keys,		
		async : false,
		dataType : "json",
		success : function(data){			
			myJson=data;
		}
	});
	
	return myJson;
}


//生成路径之前的下载地址
var down_temp = "http://dsideal-yy.oss-cn-qingdao.aliyuncs.com/down/Material/";

//增加服务器地址到json串
function addServerUrlToJson(json_str) {
    json_str["url_path_down"] = url_path_down;
    json_str["btype"] = btype;
    json_str["my_qtype"] = my_qtype;
    json_str["que_mtype"] = que_mtype;
    return json_str;
} 

//action提交随机数，6位
var random_num = 0;
function creatRandomNum() {
    for(var i=0;i<6;i++) 
    { 
        random_num+=Math.floor(Math.random()*100000); 
    } 
    return random_num;
}

//替换js原生的trim方法
String.prototype.trim = function(){
	//用正则表达式将前后空格用空字符串替代。
	return this.replace(/(^\s*)|(\s*$)/g,"");
};


//对话框--确定取消
//dialogOkFun：确定函数  dialogCancelFun：取消函数
function dialogOkCancel(dialog_msg,dialog_width,dialog_ok_fun,dialog_cancel_fun){
	if(dialog_width == 0 || dialog_width == '') {
        dialog_width = 250;
    }
    art.dialog(
    {
        content:dialog_msg,
        width: dialog_width,
        lock:true,
		icon: 'warning',
        // zIndex:9999,
        title: '提示',
        style:'succeed noClose',
//        close:function(){$.fancybox.close();}
        close:function(){}
    },
    function()
    {
        var jscode = new Function(dialog_ok_fun)();
    },
    function()
    {
        var jscode = new Function(dialog_cancel_fun)();
    }
    
    );
}

//对话框--直接关闭
//dialog_msg：对话框内容  dialog_time：对话框存在时间  dialog_width：对话框宽度  dialog_close_fun：关闭时执行函数
function dialogClose(dialog_msg,dialog_time,dialog_width,dialog_close_fun) {
    if(dialog_width == 0 || dialog_width == '') {
        dialog_width = 200;
    }
    art.dialog({
        height: 70,
        width: dialog_width,
        fixed: true,
        lock: true,
        icon: 'succeed',
        time: dialog_time,
        title: '提示',
        content: '<label>' + dialog_msg + '</label>',    
       // zIndex:9999,
        cancel: false,
//        top:'50%',
        close:function(){
            var jscode = new Function(dialog_close_fun)();
        } 
    /*lock: true*/         
    }).show;
}

//对话框--点击确定后关闭
//dialog_msg：对话框内容  dialog_width：对话框宽度  dialog_ok_fun：关闭时执行函数
function dialogOk(dialog_msg,dialog_width,dialog_ok_fun) {
    if(dialog_width == 0 || dialog_width == '') {
        dialog_width = 200;
    }
    art.dialog({
    	height: 70,
    	width: dialog_width,
    	fixed: true,
    	icon: 'warning',
    	// zIndex:9999,
        /* time: 3,*/
        title: '提示',
        lock: true,
        content: '<label>' + dialog_msg + '</label>',  
//        top:'50%',
        ok: function () {
            var jscode = new Function(dialog_ok_fun)();
        }
                
    }).show;
}

var js_url = document.location.href;
//头像图片的大小限制
var maxAvatarFileSize = 20*1024*1024;
//获取头像文件的路径的前半段
var head_avatarUrl = url_path_action;

var download_size_limit = 10 * 1024 * 1024;


//访问路径
var resArray = new Array();
function beforeRender(data)
{
    var addToArray = function(id, rec){
        resArray[id] = rec;
    };
    
    data.addToArray = addToArray;
}

//增加服务器地址到json串
function baseAddObjectToJson(json_str, para, pata_name) {
    json_str[pata_name] = para;
    return json_str;

} 

var STATIC_MSG_HEIGHT = 511;

/**
 * 功能：获取url传参（当前url或者顶层url）
 * 日期： 2015年9月15日-MODIFY
 * 参数：name（参数名，非空），istop（是否为顶级url，非空代表取顶级url参数值，可以为空）
 * 作者：JYY
 */
function GetQueryString(name,istop) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
	if(typeof(istop) != "undefined") r = top.location.search.substr(1).match(reg);
	
    if (r != null) return unescape(r[2]);
	return null;
}

//动态截取并返回指定字节的字符串
function SubStringFun(strParam,strLength){
	var len = 0;
	var name_temp = "";
	for(var i = 0;i < strParam.length; i++)
	{
	    if(strParam.charCodeAt(i)>256)
	    {
	        len += 2;
	    }
	    else
	    {
	        len++;
	    }
	    if(len > strLength){
	    	break;
	    }
	    name_temp += strParam.charAt(i);
	}
	
	if(len > strLength){
		strParam = name_temp + "...";
	}
	return strParam;
};


//冒泡事件
function stopBubble(e) {
	if(typeof(e) != "undefined"){
		if(e && e.stopPropagation) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}
	}
	return false;
}

/**
 * 通用处理预览方法（支持fancybox预览和网页全屏预览）
 * 姜莹莹 2014年11月20日
 * 参数：JSON格式，包括以下属性（file_ext，file_id，file_title，file_page，_width，_height，p_status，p_type）
 * file_ext：文件扩展名
 * file_id：文件ID
 * file_title：文件名，
 * file_page：文件页数，
 * _width：宽（仅为swf格式文件提供），
 * _height：高（仅为swf格式文件提供），
 * p_status：预览状态，
 * m3u8_status: m3u8预览状态2016-3-3-add------------------------------，
 * p_type：预览方式（1--fancybox预览；2--全屏预览）
 * 返回值：JSON格式，根据预览方式而定，如果是fancybox预览，返回参数包括（_href，_class，_title）；如果是全屏预览，返回参数仅包括（_href）
 * 注：并非所有参数都必须非空，该方法会根据文件类型对参数的需要进行取值。
 */
var support_extension = ["avi","mp4","mpg","mpeg","wmv","asf","flv","rmvb","mov"];//系统支持的视频格式
function dealPreviewFun(file_info){
	var file_ext = file_info.file_ext;
	var file_id = file_info.file_id;
	var p_type = file_info.p_type;
	
	var path_p = url_path_down + "down/Preview/";
	var path_m = url_path_down + "down/Material/";
	
	var _class = "";
	var _href = "";
    var _title = file_info.file_title + "." + file_ext;

	if (!Array.prototype.indexOf){  
         Array.prototype.indexOf = function(elt , from){  
         var len = this.length >>> 0;  
         var from = Number(arguments[1]) || 0;  
         from = (from < 0)  
              ? Math.ceil(from)  
              : Math.floor(from);  
         if (from < 0)  
           from += len;  
         for (; from < len; from++)  
         {  
           if (from in this &&  
               this[from] === elt)  
             return from;  
         }  
         return -1;  
       };  
	} 
	
	var check_extension = support_extension.indexOf(file_ext);
	if(check_extension != "-1"){//支持的视频格式
		var m3u8_status = file_info.m3u8_status;
		if(p_type == 1){
			_class = "fancybox fancybox.iframe";
		}
		_href = url_path_html + "/html/ypt/common/preview_video_common.html?file_id="+file_id+"&p_type="+p_type+"&r_format="+file_ext+"&resource_title="+Base64.encode(file_info.file_title)+"&preview_status="+file_info.p_status+"&m3u8_status="+m3u8_status;
	}else{
		if(file_ext == "jpg" || file_ext == "jpeg" || file_ext == "png" || file_ext == "gif" || file_ext == "bmp"){
			//不需要判断预览状态
			var _p = path_m + file_id.substring(0,2) + "/" + file_id + "." + file_ext;
			
			var _w = file_info._width;
			var _h = file_info._height;
			if(_w == 0 || _w > 640){
				 _w = "640";		
			}
			if(_h == 0 || _h > 480){
				 _h = "480";		
			}	
			
			if(p_type == 1){
				_class = "fancybox";
				_p = STATIC_IMAGE_PRE + url_path_img + file_id.substring(0,2) + "/" + file_id + "." + file_ext+"@"+_w+"w_"+_h+"h_100Q_1x."+"png";
				if(file_ext == "gif"){
					_p = STATIC_IMAGE_PRE + url_path_img + file_id.substring(0,2) + "/" + file_id + "." + file_ext;
				}
				_href = _p;
			}else{
				_p = url_path_img + file_id.substring(0,2) + "/" + file_id + "." + file_ext+"@"+_w+"w_"+_h+"h_100Q_1x."+"png";
				if(file_ext == "gif"){
					_p = url_path_img + file_id.substring(0,2) + "/" + file_id + "." + file_ext;
				}
				_href = url_path_html + "/html/ypt/common/preview_image.html?file_path="+_p+"&title="+Base64.encode(_title)+"&width="+_w+"&height="+_h+"&file_id="+file_id;
			}
		//}else if(file_ext == "xmind"){
		//	if(p_type == 1){
		//		_class = "fancybox";
		//		_href = url_path_down + "down/Preview/" + file_id.substring(0,2) + "/" + file_id + ".png";	
		//	}else{
		//		var _w = file_info._width;
		//		var _h = file_info._height;
		//		if(_w == 0 || _w > 640){
		//			 _w = "640";		
		//		}
		//		if(_h == 0 || _h > 480){
		//			 _h = "480";		
		//		}	
		//		var _p = "down/Preview/" + file_id.substring(0,2) + "/" + file_id + ".png";	
		//		_href = url_path_html + "/html/ypt/common/preview_image.html?file_path="+_p+"&title="+Base64.encode(_title)+"&width="+_w+"&height="+_h+"&file_id="+file_id;
		//	}					
		}else if(file_ext == "swf"){
			//不需要判断预览状态
			if(p_type == 1){
				_class = "fancybox fancybox.iframe";
				_href = url_path_html + "/html/ypt/common/preview_flash2D_X.html?file_path="+path_m+"&file_id="+file_id+"&width="+file_info._width+"&height="+file_info._height+"&p_type="+p_type;
			}else{
				var _w = file_info._width;
				var _h = file_info._height;
				if(typeof(_w) == "undefined" || typeof(_h)){
					_w = 700;
					_h = 480;
				}
				_href = url_path_html + "/html/ypt/common/preview_flash2D_X.html?file_path="+path_m+"&file_id="+file_id+"&width="+_w+"&height="+_h+"&title="+Base64.encode(_title)+"&p_type="+p_type;
			}
		}else if(file_ext == "mp3"){
			//不需要判断预览状态
			if(p_type == 1){
				_class = "fancybox fancybox.iframe";
				_href = url_path_html + "/html/ypt/common/preview_mp3.html?file_path="+path_m+"&file_id="+file_id+"&p_type="+p_type;
			}else{
				_href = url_path_html + "/html/ypt/common/preview_mp3.html?file_path="+path_m+"&file_id="+file_id+"&title="+Base64.encode(_title)+"&p_type="+p_type;
			}
		}else{
			//以下格式需要判断预览状态
			var check_pstatus_extension = ["doc","docx","ppt","pptx","txt","pdf","wps"];
			var check_pstatus = check_pstatus_extension.indexOf(file_ext);
			if(check_pstatus != "-1"){
				if(file_info.p_status == "1"){
					if(p_type == 1){
						_class = "fancybox fancybox.iframe";
						_href = url_path_html + "/html/ypt/common/preview_doc.html?file_path="+path_p+"&file_id="+file_id+"&page_num="+file_info.file_page+"&p_type="+p_type;
					}else{
						_href = url_path_html + "/html/ypt/common/preview_doc.html?file_path="+path_p+"&file_id="+file_id+"&page_num="+file_info.file_page+"&title="+Base64.encode(_title)+"&p_type="+p_type;
					}
				}else{
					var url_str;
					if(file_info.p_status == "0"){//待生成
						url_str = "res_view.html";
					}else{//生成失败
						url_str = "res_error_view.html"; 
					}
					if(p_type == 1){
						_class = "fancybox fancybox.iframe";
						_href = url_path_html + "/html/ypt/common/"+url_str+"?file_path="+path_m+"&file_id="+file_id+"&p_type="+p_type;
					}else{
						_href = url_path_html + "/html/ypt/common/"+url_str+"?file_path="+path_m+"&file_id="+file_id+"&title="+Base64.encode(_title)+"&p_type="+p_type;
					}
				}			
			}else{//格式不支持预览
				if(p_type == 1){
					_class = "fancybox fancybox.iframe";
					_href = url_path_html + "/html/ypt/common/res_no_view.html?file_path="+path_m+"&file_id="+file_id+"&p_type="+p_type;
				}else{
					_href = url_path_html + "/html/ypt/common/res_no_view.html?file_path="+path_m+"&file_id="+file_id+"&title="+Base64.encode(_title)+"&p_type="+p_type;
				}				
			}
		}	
	} 
		
	if(p_type == 1){
		return {"_href":_href,"_class":_class,"_title":_title};
	}else{
		return {"_href":_href};
	}	
}


/**
 * 通用下载方法
 * 姜莹莹 2014年11月20日
 * 参数：JSON格式，包括以下属性（file_id，file_ext，for_urlencoder_url，for_iso_url，url_code）
 * file_id：文件ID
 * file_ext：文件扩展名
 * for_urlencoder_url：IE浏览器文件下载地址，
 * for_iso_url：非IE浏览器文件下载地址，
 * url_code：文件名urlEncode编码格式，
 * 返回值：String格式，下载路径
 */
var dealDownpathFun = function(data){
	var _path = "";
	if(pt_type == 1){
		//云版
		var userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/;
		var ua = userAgent.toLowerCase();
		var match = rMsie.exec(ua);		
		var isEdge = userAgent.indexOf("Edge") > -1;
		if(match!=null)
		{
			_path = data.for_urlencoder_url;
		}
		else
		{
			_path = data.for_iso_url;
			if (isEdge) {_path = data.for_urlencoder_url;}
		}
		if(_path == "-1"){
    		var p_path = down_temp + data.file_id.substring(0,2) + "/" + data.file_id + "." + data.file_ext;
    		_path = p_path;
		}else{
			_path = 'javascript:downFun("'+_path+'");';
			//_path = Base64.decode(_path);
		}
		
	}else{
		//局版
		var path_m = url_path_down + "down/Material/";
		var file_path_ju = path_m + data.file_id.substring(0,2) + "/" + data.file_id + "." + data.file_ext + "?flag=download&n=" + data.url_code + "." + data.file_ext;
		_path = file_path_ju;
			
	}
	return _path;
};

//执行下载
function downFun(_path){
	window.location.href = Base64.decode(_path);
}

//非法字符
var szMsg="[`~!@#$^&*()=-_|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘’；：”“'。，、？]";
//邮箱
var emailMsg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
//空格
var regNull = /\s/;
//英文和数字
var regEngNum = /[\W]/g;

/**
 * 检查字符串是否包含特殊字符（包括空格）
 * 姜莹莹 2014年11月24日
 * 参数1：要检验的字符串
 * 参数2：验证类型：1--验证是否含有特殊字符，2--验证是否含有除英文和数字以为的字符
 * 返回值：Boolean格式，true--不包含特殊字符  false--包含特殊字符
 */
var checkCharacter = function(str,type){
     var checkResult = true;
     if(type == 1){
    	 for(var i = 1;i < szMsg.length;i++){
             if(str.indexOf(szMsg.substring(i-1,i))>-1){
             	checkResult = false;
             	break;
             }
         }
         if(regNull.exec(str) != null){
        	 checkResult = false;
         }
     }else if(type == 2){        
    	 if(regEngNum.test(str)){
    		 checkResult = false;//含有除英文和数字以为的字符
    	 }else{
    		 checkResult = true;
    	 }
     }
     return checkResult;
};

/**
 * 字节转换
 * 姜莹莹 2014年11月26日
 * 参数：字节
 * 返回值：KB
 * 12-11注释，方法未经过测试通过，暂时注释
 */
//function bytesToSize(bytes) {
//    if (bytes === 0) return '0 B';
//    var k = 1024, //转换为KB
//        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
//        i = Math.floor(Math.log(bytes) / Math.log(k));
////   	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
//  	return (bytes / Math.pow(k, i)).toPrecision(3);
//}

/**
 * 生成guid号
 * 姜莹莹 2014年12月8日
 * 参数：无
 * 返回值：String
 */
function NewGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++)
    {
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid.toUpperCase();
}

/**
 * 处理action返回false
 * 姜莹莹 2014年11月24日 2015-8-13修改：添加对后台的处理
 * 参数：JSON格式（info--错误信息，type--错误类型）
 * 返回值：无
 */
function dealReturnMsg(data,type){
	if(type == 2){
		//后台
		if(data.status == "0"){
			top.location = "login.html";
		}
	}else{
		//前台
		if(data.status == "0"){
			top.location = url_path_action_login+"/";;
		}
	}	
}

/**
 * 预览前处理（检查最新预览情况）
 * 姜莹莹 2015-1-24（2016-3-4修改：支持m3u8视频播放）
 * 参数1：pre_id--当前点击标签的ID，例如<a id="a1">标签的ID;
 * 参数2：target_id--用于拼接缓存key值的ID，例如云资源的缓存key值resource_342342中的数字后缀即为资源列表返回的iid;
 * 参数3：preview_status--预览状态;新增参数m3u8_status---------2016-3-4
 * 参数4：extension--扩展名;
 * 参数5：type--读哪个库的缓存（1：资源的，2：试卷的）;
 * 参数6：yunormy--具体判断读哪个缓存（1：云的  2：我的 0：不区分云的还是我的）
 * 参数7：bk_type--是否为资源包里的资源（仅为备课使用，其他可以不传）
 * 返回值：无
 * 备注：由于现有方法checkPreviewStatus只实现了对于资源和试卷的缓存的检查，如果不满足需求，需要对原有方法增加分支进行修改。
 */
function checkPreviewStatus(pre_id,target_id,preview_status,extension,type,yunormy,bk_type,m3u8_status){
	var check_extension = support_extension.indexOf(extension);
	var is_check = false;
	if(type == 1 && check_extension != -1){
		if(m3u8_status == 2){
			return;
		}else if(m3u8_status == 1){
			is_check = true;
		}else if(m3u8_status == 0){
			if(preview_status == 1){
				return;
			}else{
				is_check = true;
			}
		}
	}else{
		if(preview_status == 1){
			return;
		}else{
			is_check = true;
		}
	}
	
	if(is_check){
		$.ajax({
			type : "GET",
			async : false,
			dataType:"json",   
			//checkPreviewStatus方法中实现了根据type和yunormy定位到哪个缓存，最终方法返回最新预览状态以及预览所需其他参数。
			url : url_path_action + "/checkPreviewStatus?type="+type+"&yunormy="+yunormy+"&target_id="+target_id,
			success : function(data) {
			    if(data.success){                 
					if(data.m3u8_status == "2" || data.preview_status == "1"){		 		                	   
					   //修改当前预览的路径
					   var file_id = data.file_id;
					   var file_title = data.title;
					   var file_page = data.page;
					   var paramJson = 
					   {
						   "file_ext":extension,
						   "file_id":file_id,
						   "file_title":file_title,
						   "file_page":file_page,
						   "_width":0,
						   "_height":0,
						   "p_status":data.preview_status,
						   "p_type":1,
						   "m3u8_status":data.m3u8_status
					   };
					   var resJson = dealPreviewFun(paramJson);
					   var newHref = resJson._href;
					   $("#"+pre_id).attr("href",newHref);
					   var menu_value_cookie = $.cookie("menu_value_cookie");
					   if(menu_value_cookie == "1" || menu_value_cookie == "2" || menu_value_cookie == "10"){
						   if(menu_value_cookie == "10"){
							   if(bk_type != 1){
								    var myPage = $("#myPage").val();
									if(myPage == null || typeof(myPage) == "undefined") myPage = 1;
								    goPage(myPage);
								    //触发单击事件
								    setTimeout(function(){
									   $("#"+pre_id).click();
								    },500);
							   }
						   }else{
							    var myPage = $("#myPage").val();
								if(myPage == null || typeof(myPage) == "undefined") myPage = 1;
								goPage(myPage);
							    //触发单击事件
							    setTimeout(function(){
								   $("#"+pre_id).click();
							    },500);
						   }
					   }	                	  
				   }
			   }
			}
		});			
	}
}
//名师工作室中名字乱码问题
function   getNameReturn(_name){
	_name= _name.replace(/\//g,'');
	_name= _name.replace(/\%2B/g,"+");
	_name= _name.replace(/\%2F/g,"/");
    _name=Base64.decode(_name);
}


/**
 * 【通用方法】thickbox弹出展示各模块资源的详细（审核）信息
 * 姜莹莹 2015-03-31
 * 参数1：resource_type: 1：资源 2：试题  3：试卷  4：备课  5：微课
 * 参数2：type_id：暂时默认值为1
 * 参数3：resource_id：各模块资源在info表的ID
 * 参数4：title:资源名称
 * 返回值：无
 */
function getResInfo(title,resource_type,type_id,resource_id,event){
	if(typeof(event) != "undefined"){
		stopBubble(event);	
	}
	var str = "";
	if(resource_type == 1){
		str = "资源";
	}else if(resource_type == 2){
		str = "试题";
	}else if(resource_type == 3){
		str = "试卷";
	}else if(resource_type == 4){
		str = "备课";
	}else if(resource_type == 5){
		str = "微课";
	}
	self.parent.document.getElementById("tb_remove_type").value = 0;
	self.parent.tb_show("当前"+str+"："+title,"../../base/resource_check/show_res_info.html?resource_type="+resource_type+"&type_id="+type_id+"&resource_id="+resource_id+"&TB_iframe=true&height=360&width=700","thickbox");
}

//资源共享范围JSON数据2015-6-24-JYY
var range_json = {
	"range_list": 
	[
		{
			"range_id":1,
			"range_name":"东师理想"
		},
		 {
			 "range_id":6,
			 "range_name":"本省"
		 },
		{
			"range_id": 7,
			"range_name":"本市"
		},
		{
			"range_id": 2,
			"range_name":"本区"
		},
		{
			"range_id": 3,
			"range_name":"本校"
		}
		//,
		// {
			// "range_id": 4,
			// "range_name":"学科组"
		// }
	]
};

//table导出到excel控件
//周枫 2015.06.25
//BEGIN
var LODOP; //声明为全局变量   
	function SaveAsFile(){ 
		LODOP=getLodop();   
		LODOP.PRINT_INIT(""); 
		LODOP.ADD_PRINT_TABLE(100,20,1024,80,document.documentElement.innerHTML); 
		LODOP.SET_SAVE_MODE("Orientation",2); //Excel文件的页面设置：横向打印   1-纵向,2-横向;
		LODOP.SET_SAVE_MODE("PaperSize",9);  //Excel文件的页面设置：纸张大小   9-对应A4
		LODOP.SET_SAVE_MODE("Zoom",90);       //Excel文件的页面设置：缩放比例
		LODOP.SET_SAVE_MODE("CenterHorizontally",true);//Excel文件的页面设置：页面水平居中
		LODOP.SET_SAVE_MODE("CenterVertically",true); //Excel文件的页面设置：页面垂直居中
//		LODOP.SET_SAVE_MODE("QUICK_SAVE",true);//快速生成（无表格样式,数据量较大时或许用到） 
		LODOP.SAVE_TO_FILE("备课中心数据导出.xls"); 
	};	 
	function OutToFileOneSheet(){ 
		LODOP=getLodop();   
		LODOP.PRINT_INIT(""); 
		LODOP.ADD_PRINT_TABLE(100,20,500,60,document.getElementById("div1").innerHTML); 
		LODOP.SET_SAVE_MODE("FILE_PROMPT",false); 
		if (LODOP.SAVE_TO_FILE(document.getElementById("T1").value)) alert("导出成功！");		 
	}; 
	function OutToFileMoreSheet(){ 
		LODOP=getLodop();   
		LODOP.PRINT_INIT(""); 
		LODOP.ADD_PRINT_TABLE(100,20,500,60,document.documentElement.innerHTML); 
		LODOP.SET_SAVE_MODE("PAGE_TYPE",2); 
		LODOP.SET_SAVE_MODE("CenterHeader","页眉"); //Excel文件的页面设置
		LODOP.SET_SAVE_MODE("CenterFooter","第&P页"); //Excel文件的页面设置
		LODOP.SET_SAVE_MODE("Caption","我的标题栏");//Excel文件的页面设置					 
		LODOP.SET_SAVE_MODE("RETURN_FILE_NAME",1); 
		document.getElementById("T2").value=LODOP.SAVE_TO_FILE("多个Sheet的文件.xls");		 
	};	
	function SaveAsEmfFile(){ 
		LODOP=getLodop();   
		LODOP.PRINT_INIT(""); 
		LODOP.ADD_PRINT_HTM(0,0,"100%","100%",document.documentElement.innerHTML); 
		LODOP.SET_SAVE_MODE("SAVEAS_IMGFILE_EXENAME",".emf");
		LODOP.SAVE_TO_FILE("新的矢量图片文件.emf"); 
	};	

//table导出到excel控件
//周枫 2015.06.25
//END


/**
 * 【通用方法】动态引入js文件和css文件
 * 姜莹莹 2015-07-28
 * 参数1：path: 引入文件的路径
 * 调用方式：dynamicLoading.js("test.js");
 * 返回值：无
 */
var dynamicLoadingFile = {
    css: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
}


//浏览器版本
var userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/;

//office插件下载地址
function goOffice(down_type){
	if(down_type == 1){
		//下载学科office工具
		window.location.href = url_path_down + "/down/OfficeInstaill/EduOffice.exe";
		return;
	}
	if($.cookie("person_id")!=undefined && $.cookie("identity_id")!=undefined){
		window.open("../../ypt/jxpt/index.html");
	}else{
		dialogOk('请您先登录系统。',300,'');
	}
}

//下载插件2015-11-8-JYY-ADD
function downExe(){
	window.location.href = url_path_down + "/down/TeaInstaill/DSDownUpLoadHelper.exe";
}


/**
 * 生成当前门户请求地址
 * 姜莹莹 2015-11-23
 * 返回值类型：String
 */
function getPortalUrl(){
	var portalUrl = "";
	var typeParam = "common.portal.site.type";
	var levelParam = "common.portal.site.level";
	var urlParam = "common.portal.site.url";
	var orgIdParam = "common.org.id";
	var result = getGolbalValueByKeys(typeParam+","+levelParam+","+urlParam+","+orgIdParam);
	var index_type = result[typeParam];//门户类型
	var index_level = result[levelParam];//门户层级
	var index_url = result[urlParam];//门户地址
	var org_id = result[orgIdParam];//安装地区ID
	if(index_type == "1"){
		//多级门户		
		if(index_level == "1"){
			//市级
			portalUrl = index_url;
		}else if(index_level == "2"){
			//区级
			portalUrl = index_url+"?area_id="+org_id;
		}else if(index_level == "3"){
			//校级
			portalUrl = index_url+"?school_id="+org_id;
		}		
	}else{
		//单级门户
		portalUrl = index_url;
	}	
	return portalUrl;
}

/**
 * 功能：全部替换（将字符串中的参数s1全部替换为s2）
 * 日期：2015-11-27
 * 返回值类型：String
 * 调用方式：var str = "a b c "; str = str.replaceAll(" ","");
 */
String.prototype.replaceAll = function(s1,s2){ 
	return this.replace(new RegExp(s1,"gm"),s2); 
}

/**
 * 功能：弹出登录窗口
 * 日期：2015-12-1
 * 参数1：该参数在回调函数时返回，非必填项，可用于执行登录后的操作中，例如预览路径等
 * 参数2：登录类型，非必填项，默认值为1（云平台登录），注意：如果需要传该参数2时，参数1需要有占位（例如空字符串或者-1等）！
 * 参数3：大赛的地区，ds_district=1是吉林省
 * 回调函数：loginCallback(param)，param的值即为调用showLogin的参数
 */
function showLogin(param,login_type,ds_district){
	tb_show("登录","/dsideal_yy/html/login_window.html?param="+param+"&login_type="+login_type+"&ds_district="+ds_district+"&TB_iframe=true&height=180&width=300","thickbox");
}

/**
 * 根据域名获取门户信息，返回对应门户首页地址
 * 姜莹莹 2015-12-22
 * 返回值类型：String
 */
function getPortalInfoByDomain(){
	var portal_json = {};
	var portal_url = "";
	var index_domain = document.domain;
	var sso_param = "common.sso";
	var result = getGolbalValueByKeys(index_domain,sso_param);
	var result_str = result[index_domain];
	if(result_str == ""){
		portal_json["success"] = false;
	}else{
		var result_json = eval('('+result_str+')');
	
		var index_type = result_json.type;//门户类型
		var index_level = result_json.level;//门户层级
		var index_url = result_json.url;//门户地址
		var org_id = result_json.area_id;//安装地区ID
		if(index_type == "1"){
			//多级门户		
			if(index_level == "1"){
				//市级
				portal_url = index_url;
			}else if(index_level == "2"){
				//区级
				portal_url = index_url+"?area_id="+org_id;
			}else if(index_level == "3"){
				//校级
				portal_url = index_url+"?school_id="+org_id;
			}		
		}else{
			//单级门户
			portal_url = index_url;
		}
		var result_sso = result[sso_param];
		portal_json["url"] = portal_url;
		portal_json["sso"] = result_sso;
		portal_json["info"] = result_json;
		portal_json["success"] = true;
	}	
	return portal_json;
}

/**
 *功能：统计用户登录活跃数+1
 *日期：2015-12-24-JYY
 */
function setLoginCount(){
	setTimeout(function(){
		var person_id = $.cookie("person_id");
		$.ajax({
			type : "GET",		
			url : url_path_action_login + "/new_djmh/setHuoYue?person_id="+person_id+"&random="+creatRandomNum(),		
			async : false,
			dataType : "json",
			success : function(data){			
			
			}
		});
		
	},2000);	
}

var tool_arr = 
	['undo', 'redo', '|',
	'bold', 'italic', 'underline', 'fontborder', 'strikethrough','|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
	'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
	'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
	'link', 'unlink', 
	'simpleupload'];	
	
function showModifyPwd(user,pwd,type,param){	
	//tb_remove();
	//setTimeout(function(){
	//	tb_show("密码修改", "/dsideal_yy/html/modify_default_pwd.html?user="+user+"&pwd="+pwd+"&type="+type+"&param="+param+"&TB_iframe=true&height=190&width=421","thickbox");			
	//},400);	
	
	$("#TB_ajaxWindowTitle",window.parent.document)[0].innerHTML = "密码修改";
	$("#TB_ajaxWindowTitle",window.parent.document).attr("title","密码修改");
	
	$("#TB_iframeContent",window.parent.document).attr("src","/dsideal_yy/html/modify_default_pwd.html?user="+user+"&pwd="+pwd+"&type="+type+"&param="+param);
	$("#TB_iframeContent",window.parent.document).css({"width":"430px"});
	$("#TB_window",window.parent.document).css({"width":"430px"});
}

/**
 *功能：打开选择模块内容的窗口
 *日期：2016-3-21-JYY
 *参数1（module_type）：模块类型，1资源，2试卷，3试题，4备课，5微课，6格式化试卷中选题
 *参数2（callback）:回调函数名称
 */
var selCallback;
function openSelModule(module_type,func,jsonData,selDatas){
	self.parent.selCallback = func;
	if(module_type == 1){
		self.parent.tb_show("选择资源","/dsideal_yy/html/ypt/resources/select_resources.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");	
	}
	if(module_type == 2){
		self.parent.tb_show("选择试卷","/dsideal_yy/html/ypt/paper/select_paper.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");	
	}
	if(module_type == 3){
		self.parent.tb_show("选择试题","/dsideal_yy/html/ypt/question/select_question.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");	
	}	 
	if(module_type == 5){
		self.parent.tb_show("选择微课","/dsideal_yy/html/ypt/weike/select_wk.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");	
	}
}
/**
 *功能：根据数据显示星级
 *日期：2016-3-18-JYY
 *参数1：score（当前分数）
 *参数2：max_score（最大分数，Int）
 *参数3：show_score（是否显示分数，Boolean）
 */
function createStar(score,max_score,show_score){
	var score_str = score + "";
	var score_arr = score_str.split(".");
	var score_int = score_arr[0];
	var decimal = score_arr[1];
	if(typeof(decimal) == "undefined") decimal = 0;
	var img_str = "";
	var star_count = 0;
	for(var i = 0;i < score_int; i++){
		img_str += '<img class="star" src="/dsideal_yy/images/star/1.png"/>';
		star_count ++;
	}
	if(score_int < max_score && decimal != 0){
		img_str += '<img class="star" src="/dsideal_yy/images/star/0.'+decimal+'.png"/>';
		star_count ++;
	}
	for(var j = max_score;j > star_count; j--){
		img_str += '<img class="star" src="/dsideal_yy/images/star/0.png"/>';
	}
	if(show_score){
		img_str += '<span style="font-family: STXingkai; font-size: 25px; display: inline-block;position:absolute; top: 0px; margin-left: 15px; color: rgb(255, 153, 0);">'+score+'</span>';
	}
	return img_str;
}

/*
* *功能：打开选择模块内容的窗口,迁移到空间的没有frame的页面使用，其余同上
* 2016.6.16 By zfz
*/
function openSelModuleSpace(module_type,func,jsonData,selDatas){
    selCallback = func;
    if(module_type == 1){
        tb_show("选择资源","/dsideal_yy/html/ypt/resources/select_resources.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");
    }
    if(module_type == 2){
        tb_show("选择试卷","/dsideal_yy/html/ypt/paper/select_paper.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");
    }
    if(module_type == 3){
        tb_show("选择试题","/dsideal_yy/html/ypt/question/select_question.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");
    }
    if(module_type == 5){
        tb_show("选择微课","/dsideal_yy/html/ypt/weike/select_wk.html?selectedDatas="+selDatas+"&jsonData="+jsonData+"&TB_iframe=true&height=560&width=960","thickbox");
    }
}
/*
 *2015-07-21 资源预览的时候  需要调用的预览资源计数接口，由lzy提供，所有点击资源预览处都需要调用
 * 
 */
function  saveResourcePreviewRecord(obj_id_int,res_type){
   var  person_id=$.cookie("person_id");
   var identity_id=$.cookie("identity_id");
	var  flg=false;
	 $.ajax({
	        type : "POST",
	        async : false,
	        dataType : "json",
	        url : url_path_action_login + "/resCtl/saveResourcePreviewRecord",
	        data:{  "person_id":person_id,"identity_id":identity_id,"obj_id_int":obj_id_int,"res_type":res_type},
	        success : function(data) {
	            if(data.success){
	              flg=true;	
	            }
	        }
	    });
	 return flg;
}

/*
 * 富文本编辑器附件下载方法
 * 2015-10-27-JYY
 */
function downloadResAttachment(resource_id_int){
	$.ajax({
		type : "GET",
		async : false,
		dataType:"json",
		url : url_path_action_login + "/resource/getResourceByIDInt?resource_id_int="+resource_id_int,
		success : function(data) 
		{   
			if(data.success)
			{
				var _json = 
				{
					"file_id":data.file_id,
					"file_ext":data.resource_format,
					"for_urlencoder_url":data.for_urlencoder_url,
					"for_iso_url":data.for_iso_url,
					"url_code":data.url_code
				};
				var down_path = dealDownpathFun(_json);
				window.location.href = down_path;
			}
		}
	});
}


/**
 * 弹出登陆对话框
 * JYF 2016.11.23
 */
function fnShowLoginDialog() {
	var html = '<form role="form" id="login_form">' +
		'<div class="form-group">' +
		'<h3 style="border-bottom: 1px solid #666;color: #333;font: bold 20px ;text-align: center;padding-bottom: 10px;">用户登录</h3>' +
		'</div>' +
		'<div class="form-group">' +
		'<input style="width: 250px;" placeholder="用户名" class="form-control" id="user_dialog" name="user" value="" onkeyup="value=value.replace(/[\W]/g, \'\')" onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[\W]/g, \'\')) " type="text">' +
		'<ul id="per_ul" style="display: none;background: #ffffff;width:206px;" class="user-ul user-ulc"></ul>' +
		'</div>' +
		'<div class="form-group form-group-input">' +
		'<input style="width: 250px;" placeholder="密码" class="form-control" id="pwd_dialog" name="pwd" value="" onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[\W]/g, \'\')) " type="password">' +
		'</div>' +
		'<span id="log_error_dialog" class="pull-right" style="visibility: hidden; font-size:12px;color:red;margin-top:-15px;height: 30px;">&nbsp;</span>' +
		'<div class="aui_buttons" style="padding: 0;border: none;margin: 32px 0 5px;">' +
		'<button type="button" class="aui_state_highlight" onclick="fnMyLogin();" style="font-weight:bold;font-size:15px !important;width: 100%;margin: 0;height: 35px;">登&nbsp;&nbsp;&nbsp;录</button>' +
		'</div>' +
		'</form>'
	art.dialog({
		content: html,
		width: 300,
		lock: true,
		zIndex: 9999,
		title: '用户登录',
		style: 'succeed noClose',
		init: function () {
			$("#pwd_dialog").keyup(function (event) {
				if (event.keyCode == 13) {
					event.returnValue = false;
					event.cancel = true;
					fnMyLogin();
					// doLogin();
				}
			});
		}
	});
}
function fnMyLogin(){
	var is_sso = $(window.parent.document).contents().find("#iframeid")[0].contentWindow.is_sso;
	if(is_sso != 1){
		var username = $("#user_dialog").val();
		username = username.replace(/(^\s*)|(\s*$)/g, "");
		if(username == ""){
			$("#log_error_dialog").text("请输入用户名！");
			$("#log_error_dialog").css("visibility","visible");
			return;
		}
		var password = $("#pwd_dialog").val();
		password = password.replace(/(^\s*)|(\s*$)/g, "");
		if(password == ""){
			$("#log_error_dialog").text("请输入登录密码！");
			$("#log_error_dialog").css("visibility","visible");
			return;
		}

		var check_result = $(window.parent.document).contents().find("#iframeid")[0].contentWindow.checkLoginPwd(username, password);
		var check_flag = false;
		if(check_result.success){
			if(check_result.login_status == 1){//正常登录
				check_flag = true;
			}
		}else{
			$("#log_error_dialog").css("visibility","visible");
			$("#log_error_dialog").html(check_result.info);
		}
		if(!check_flag){
			return;
		}
		//执行正常登录
		$(window.parent.document).contents().find("#iframeid")[0].contentWindow.doLoginFun(username, password);
	} else {
		$(window.parent.document).contents().find("#iframeid")[0].contentWindow.submitForm();
	}
}

