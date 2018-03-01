(function ($) { 
	var _self;
	var _temp_tips_json = {};
	$.widget( "dui.textarea", {  
		options: {        
			height_auto: false,
			width:"",
			height:"100px",
			max_height:"200px",
			word_length:500,
			index:1,
			tips:"",
			onChange:null,
			initShowTips:true//2016-3-24-add：true代表一直显示提示信息，false代表鼠标点击后才显示提示信息，鼠标移出隐藏提示信息
		},   					    
		_create: function() {  
			_self = this;
			if(this.options.width != ""){
				//是否设置宽度，默认自适应
				this.element.css("width",this.options.width);
			}
			if(this.options.height_auto){
				this.changer = $( "<div>", {          
					"contenteditable":true,
					"class":"form-control auto-textarea",
					"id":"dui-textarea-"+this.options.index
				}).appendTo( this.element );  
				$("#dui-textarea-"+this.options.index).css("min-height",this.options.height);
				$("#dui-textarea-"+this.options.index).css("max-height",this.options.max_height);
				
				if(this.options.tips != ""){	
					var _temp_tips = '<label id="replace_tip_'+this.options.index+'" style="left:13px;top:7px;color:#999">'+this.options.tips+'</label>';
					_temp_tips_json[this.options.index] = _temp_tips;
					$(_temp_tips).appendTo("#dui-textarea-"+this.options.index); 
					
					$("#dui-textarea-"+this.options.index).bind('focus',function(){
						var _index = this.id.substring(13);
						if($("#replace_tip_"+_index).length > 0){
							//_temp_tips = $("#dui-textarea-"+_index)[0].innerHTML;
							$("#dui-textarea-"+_index).empty();
						}						
					});
					$("#dui-textarea-"+this.options.index).bind('blur',function(){
						var _index = this.id.substring(13);
						var _val = $("#dui-textarea-"+_index).text();
						if($.trim(_val) == ""){
							$("#dui-textarea-"+_index).empty();
							var _temp_tips = _temp_tips_json[_index];
							$(_temp_tips).appendTo("#dui-textarea-"+_index); 
						}						
					});
					
				}				
			}else{
				this.changer = $( "<textarea>", {          
					"height": this.options.height,
					"class":"form-control",
					"placeholder":this.options.tips,
					"id":"dui-textarea-"+this.options.index
				}).appendTo( this.element );         		   
			}	
			this.element.append("<div style='float:right'><label class='tip-style' id='tip-"+this.options.index+"'>最多支持输入"+this.options.word_length+"个字符</label><input type='hidden' value='"+this.options.word_length+"'/></div>");
			
			$("#dui-textarea-"+this.options.index).bind('keyup',function(){
				var _index = this.id.substring(13);
				var _length = $("#tip-"+_index).parent().find('input').val();
				_self._showTip(_index,_length);
				_self._change();
			}); 
			$("#dui-textarea-"+this.options.index).bind('paste',function(event){
				var _index = this.id.substring(13);
				var _length = $("#tip-"+_index).parent().find('input').val();
				_self._onPaste(_index,_length,event);
				_self._change();
			});  
				
			//2016-3-24-add			
			if(!this.options.initShowTips){
				$("#tip-"+this.options.index).hide();
				$("#dui-textarea-"+this.options.index).bind('blur',function(){
					var _index = this.id.substring(13);
					$("#tip-"+_index).hide();
				}); 
				$("#dui-textarea-"+this.options.index).bind('click',function(){
					var _index = this.id.substring(13);
					$("#tip-"+_index).show();
				}); 				
			}
		},  
		_change:function(){
			//调用一组中的最后一个对象的回调函数
			if(this.options.onChange != null){
				this.options.onChange();
			}			
		},
		_isPlaceholer:function(){
			var input = document.createElement('input');
			return "placeholder" in input;
		},
		_showTip:function(index,length){	
			var _tagName = $("#dui-textarea-"+index).get(0).tagName;
			if(_tagName == "TEXTAREA"){
				var _value = $.trim($("#dui-textarea-"+index).val());
				_value = _value.replaceAll("\n","");
				var _len = _value.length;
			}else{
				var _len = $.trim($("#dui-textarea-"+index).text()).length;
			}		
			var _result = length - _len;
			if(_len == 0){
				$("#tip-"+index).text("最多支持输入" + _result + "个字符");
			}else{				
				if(_result <= 0){
					if(_tagName == "TEXTAREA"){
						var _val = $("#dui-textarea-"+index).val().replaceAll("\n","");
						var _str = _val.substring(0,length);						
						$("#dui-textarea-"+index).val(_str);
					}else{
						var _str = $("#dui-textarea-"+index).text().substring(0,length);
						$("#dui-textarea-"+index).text(_str);
					}
					$("#tip-"+index).text("剩余0个字符");
				}else{
					$("#tip-"+index).text("剩余" + _result + "个字符");
				}				
			}			
		},
		_onPaste:function(index,length,e){
			var pastedText = undefined;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
			} else {
				pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
			}
			if(pastedText != ""){
				var _tagName = $("#dui-textarea-"+index).get(0).tagName;
				setTimeout(function(){
					_self._showTip(index,length);
					if(_tagName == "DIV"){//2016-1-30处理标签
						var re=/<[^>]+>/g;
						pastedText=pastedText.replace(re,""); 
						$("#dui-textarea-"+index).text(pastedText);
					}
				});				
			}			
		},
		_destroy:function(){
			_self.element.empty();
		},
		value:function(){
			if(this.options.height_auto){
				if($("#replace_tip_"+this.options.index).length > 0){
					this.options.value = "";
				}else{
					var _value = $.trim($("#dui-textarea-"+this.options.index)[0].innerHTML);	
					_value = _value.replaceAll("&nbsp;"," ");
					_value = $.trim(_value);
					//_value = _value.replaceAll(" ","&nbsp;");//2016-1-30去掉，影响显示内容
					$("#dui-textarea-"+this.options.index)[0].innerHTML = _value;
					this.options.value = _value;
				}	

			}else{
				var _value = $.trim($("#dui-textarea-"+this.options.index).val());
				_value = _value.replaceAll("\n","</br>");	
				this.options.value = _value;
				$("#dui-textarea-"+this.options.index).val($.trim($("#dui-textarea-"+this.options.index).val()));
			}
			return this.options.value;
		},
		clear:function(){
			if(this.options.height_auto){
				$("#dui-textarea-"+this.options.index).text("");
				if(this.options.tips != ""){
					var _temp_tips = _temp_tips_json[this.options.index];
					$(_temp_tips).appendTo("#dui-textarea-"+this.options.index); 
				}
			}else{
				$("#dui-textarea-"+this.options.index).val("");
			}
			$("#tip-"+this.options.index).text("最多支持输入" + this.options.word_length + "个字符");
		},
		initContent:function(content){
			var _value = $.trim(content);
			if(this.options.height_auto){
				$("#dui-textarea-"+this.options.index)[0].innerHTML = _value;
				this._showTip(this.options.index,this.options.word_length);		
			}else{
				_value = _value.replaceAll("</br>","\n");	
				$("#dui-textarea-"+this.options.index).val(_value);
				this._showTip(this.options.index,this.options.word_length);		
			}			
			
		}
	});     
})(jQuery);		
