(function ($) { 
	var _self;
	var arrObject = new Array();
    $.widget( "dui.input", {         
        options: {        
			index:1,
			width:"300px",
			inputClass:"form-control",
			maxCount:50,
			placeholder:"",
			initShowTips:false,//初始化是否显示提示信息
			// isNull:true,//是否可以为空
			// nullTips:"",
			isPwd:false,
			onCheck:null,//个性化校验
			showType:"1",//展示方式：1垂直，2横向
			isScroll:true//是否滚动条定位，默认定位
        },   					   
        _create: function() {  
			arrObject[this.options.index] = this;
			_self = this;
			//var _del_class = "input-del";
			var _label_class = "dui-input-label";
			if(this.options.showType == "1"){
				this.element.css({"width":this.options.width,"height":"55px"});
				//_del_class = "input-del";
				_label_class = "dui-input-label";
			}else{
				//this.element.css({"height":"55px"});
				//_del_class = "input-del-inline";
				_label_class = "dui-input-label-inline";
			}
			//支持密码2016-3-14-modify
			if(this.options.isPwd){
				this.changer = $( "<input>", {    
					"type":"password",
					"placeholder":this.options.placeholder,
					"width":this.options.width,
					"class":this.options.inputClass,
					"id":"dui-input-"+this.options.index
				}).appendTo( this.element ); 
			}else{
				this.changer = $( "<input>", {    
					"type":"text",
					"placeholder":this.options.placeholder,
					"width":this.options.width,
					"class":this.options.inputClass,
					"id":"dui-input-"+this.options.index,
					"maxlength":this.options.maxCount
				}).appendTo( this.element );  
			}
			
			
			//FOR IE8
			var _check = this._isPlaceholer();
			if(!_check){
				this.element.css("position","relative");	
				$('<label id="replace_tip_'+this.options.index+'" style="color:#999;position: absolute; padding-left: 15px; padding-top:5px;left:0px;top: 2px;line-height: 1.4285;">'+this.options.placeholder+'</label>').appendTo(this.element); 
				$("#replace_tip_"+this.options.index).bind('click',function(){
					var _index = this.id.substring(12);
					$("#replace_tip_"+_index).css("display","none");
					$("#dui-input-"+_index)[0].focus();
				});
			}
			
			//$("#dui-input-"+this.options.index).css("padding-right","23px");
			
			// this.changer = $( "<span>", {        
				// "id":"dui-del-"+this.options.index,
				// "class":"glyphicon glyphicon-remove search_cha abso "+_del_class
            // }).appendTo(this.element); 
			
			// $("#dui-del-"+this.options.index).css("left",parseInt(this.options.width) - 20);
			
			// $("#dui-del-"+this.options.index).bind('click',function(){
				// var _index = this.id.substring(8);
				// $("#dui-input-"+_index).val("");
				// $("#dui-input-"+_index).focus();
				// var _length = arrObject[_index].options.maxCount;
				// _self._showTip(_index,_length);
			// });  
			
			$("#dui-input-"+this.options.index).bind('keyup',function(){
				var _index = this.id.substring(10);
				var _length = arrObject[_index].options.maxCount;
				_self._showTip(_index,_length);
				$("#replace_tip_"+_index).css("display","none");//FOR IE8
			}); 
			
			$("#dui-input-"+this.options.index).bind('click',function(){
				var _index = this.id.substring(10);
				var _length = arrObject[_index].options.maxCount;
				_self._showTip(_index,_length);
				$("#replace_tip_"+_index).css("display","none");//FOR IE8
			}); 
			
			$("#dui-input-"+this.options.index).bind('paste',function(event){
				var _index = this.id.substring(10);
				var _length = arrObject[_index].options.maxCount;
				_self._onPaste(_index,_length,event);
			}); 

			$("#dui-input-"+this.options.index).bind('blur',function(){
				
				var _index = this.id.substring(10);
				$("#dui-label-"+_index).hide();

				if($.trim($("#dui-input-"+_index).val()) == ""){//FOR IE8
					$("#replace_tip_"+_index).css("display","block");
				}
				
				if(arrObject[_index].options.onCheck != null){
					arrObject[_index].options.onCheck();	
					
					if($("#dui-label-"+_index).css("display") != "none"){
						arrObject[_index].element.addClass("has-error");					
						setTimeout(function(){
							arrObject[_index].element.removeClass("has-error");
						},1200);
					}					
				}				
			}); 
			
			this.changer = $( "<label>", {      
				"text":"最多支持输入"+this.options.maxCount+"个字符",
				"class":_label_class,
				"id":"dui-label-"+this.options.index
			}).appendTo( this.element );  
			
			if(this.options.initShowTips){
				$("#dui-label-"+this.options.index).show();
			}else{
				$("#dui-label-"+this.options.index).hide();
			}
        },_showTip:function(index,length){	
			var _len = $.trim($("#dui-input-"+index).val()).length;	
			var _result = length - _len;
			if(_len == 0){
				//$("#dui-del-"+index).hide();
				$("#dui-label-"+index).text("最多支持输入" + length + "个字符");
			}else{	
				//$("#dui-del-"+index).show();
				if(_result < 0){//2016-3-14-modify
					$("#dui-label-"+index).text("最多支持输入" + length + "个字符");
					arrObject[index].element.addClass("has-error");					
				}else{
					$("#dui-label-"+index).text("剩余" + _result + "个字符");	
					arrObject[index].element.removeClass("has-error");
				}	
			}		
			$("#dui-label-"+index).show();
		},_onPaste:function(index,length,e){
			var pastedText = undefined;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
			} else {
				pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
			}
			if(pastedText != ""){
				setTimeout(function(){
					_self._showTip(index,length);
				});				
			}			
		},_isPlaceholer:function(){
			var input = document.createElement('input');
			return "placeholder" in input;
		},_destroy:function(){
			_self.element.empty();
		},value:function(){
			$("#dui-input-"+this.options.index).val($.trim($("#dui-input-"+this.options.index).val()));
			this.options.value = $.trim($("#dui-input-"+this.options.index).val());
			return this.options.value;
		},clear:function(){
			$("#dui-input-"+this.options.index).val("");
			$("#dui-label-"+this.options.index).hide();
			$("#dui-del-"+this.options.index).hide();			
		},setTips:function(str){
			$("#dui-label-"+this.options.index).text(str);		
			$("#dui-label-"+this.options.index).show();
		},check:function(){
			if(this.options.onCheck != null){
				this.options.onCheck();
				if($("#dui-label-"+this.options.index).css("display") == "none"){
					this.options.check = true;
				}else{
					this.options.check = false;
					if(this.options.isScroll){
						if(typeof(this.element.ScrollTo) == "function"){
							this.element.ScrollTo(0);
						}
					}	
					this.element.addClass("has-error");
					var _obj = this.element;					
					setTimeout(function(){
						_obj.removeClass("has-error");
					},1200);
				}	
			}else{
				this.options.check = true;
			}					
			return this.options.check;
		},setVal:function(val){
			$("#dui-input-"+this.options.index).val($.trim(val));
			$("#replace_tip_"+this.options.index).css("display","none");//FOR IE8
			//隐藏提示信息
			$("#dui-label-"+this.options.index).css("display","none");
		}
	}); 
})(jQuery);	

var scrollJson;	
//滚动条定位类型1：window 2：div
var scroll_type = 1;
//实现定位的div
var div_id = "";
//滚动条距离上面div的偏移高度
var div_height = 0;

jQuery.getPos = function (e)
{
	var l = 0;
	var t  = 0;
	var w = jQuery.intval(jQuery.css(e,'width'));
	var h = jQuery.intval(jQuery.css(e,'height'));
	var wb = e.offsetWidth;
	var hb = e.offsetHeight;
	while (e.offsetParent){
		l += e.offsetLeft + (e.currentStyle?jQuery.intval(e.currentStyle.borderLeftWidth):0);
		t += e.offsetTop  + (e.currentStyle?jQuery.intval(e.currentStyle.borderTopWidth):0);
		e = e.offsetParent;
	}
	l += e.offsetLeft + (e.currentStyle?jQuery.intval(e.currentStyle.borderLeftWidth):0);
	t  += e.offsetTop  + (e.currentStyle?jQuery.intval(e.currentStyle.borderTopWidth):0);
	return {x:l, y:t, w:w, h:h, wb:wb, hb:hb};
};
jQuery.getClient = function(e)
{
	if (e) {
		w = e.clientWidth;
		h = e.clientHeight;
	} else {
		w = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
		h = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;
	}
	return {w:w,h:h};
};
jQuery.getScroll = function (e) 
{
	if (e) {
		t = e.scrollTop;
		l = e.scrollLeft;
		w = e.scrollWidth;
		h = e.scrollHeight;
	} else  {
		if (document.documentElement && document.documentElement.scrollTop) {
			t = document.documentElement.scrollTop;
			l = document.documentElement.scrollLeft;
			w = document.documentElement.scrollWidth;
			h = document.documentElement.scrollHeight;
		} else if (document.body) {
			t = document.body.scrollTop;
			l = document.body.scrollLeft;
			w = document.body.scrollWidth;
			h = document.body.scrollHeight;
		}
	}
	return { t: t, l: l, w: w, h: h };
};

jQuery.intval = function (v)
{
	v = parseInt(v);
	return isNaN(v) ? 0 : v;
};

jQuery.fn.ScrollTo = function(s) {
	o = jQuery.speed(s);
	return this.each(function(){
		new jQuery.fx.ScrollTo(this, o);
	});
};

jQuery.fx.ScrollTo = function (e, o)
{
	var z = this;
	z.o = o;
	z.e = e;
	z.p = jQuery.getPos(e);
	z.s = jQuery.getScroll();
//	alert("y:"+z.p.y+"y2:"+z.s.y);
	z.clear = function(){clearInterval(z.timer);z.timer=null};
	z.t=(new Date).getTime();
	z.step = function(){
		var t = (new Date).getTime();
		var p = (t - z.t) / z.o.duration;
		if (t >= z.o.duration+z.t) {
			z.clear();
//			setTimeout(function(){z.scroll(z.p.y, z.p.x)},13);
			setTimeout(function(){z.scroll(z.p.y, 0)},13);
		} else {
			st = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.p.y-z.s.t) + z.s.t;
			sl = ((-Math.cos(p*Math.PI)/2) + 0.5) * (z.p.x-z.s.l) + z.s.l;
//			z.scroll(st, sl);
			z.scroll(st, 0);
		}
	};
	z.scroll = function (t, l){
			if(typeof(scrollJson) != "undefined"){
				scroll_type = 2;
				div_id = scrollJson.scroll_div_id;
				div_height = scrollJson.div_top_height;
			}
			if(scroll_type == 1){
				//window窗口的滚动条定位
				window.scrollTo(l, t);
			}else{
				//指定div的滚动条定位
				t = t - div_height;
				document.getElementById(div_id).scrollTop = t;
			}
		};
	z.timer=setInterval(function(){z.step();},13);
};
