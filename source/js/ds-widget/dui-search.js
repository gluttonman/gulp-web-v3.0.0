(function ($) { 
	var _self;
    $.widget( "dui.search", {         
        options: {        
			inputclass:"form-control",
			inputwidth:"200px",
			maxinput:20,
			tips:"请输入关键字",
			btnval:"搜索",
			btnclass:"btn btn-warning l5",
			onsearch:null,
			value:""
        },   					   
        _create: function() {  
			_self = this;
			//this.element.addClass("search");
			this.element.append("<div class='_idiv' style='display:inline-block;position:relative'>"); 
			this.changer = $( "<input>", {          
                "type": "text",
				"class":this.options.inputclass,
				"id":"search_keyword",
				"placeholder":this.options.tips,
				"width":this.options.inputwidth,
				"maxlength":this.options.maxinput
            });//.appendTo("._idiv");  
			
			$(this.element).find("._idiv").append(this.changer);//2016-3-18
			
			//2015-12-24
			$("#search_keyword").css("padding-right","20px");
			
			this._on( this.changer, {                  
                keydown: "onsearch",
				keyup:this._delshow,
				paste:this._paste
            }); 
						
			this.changer = $( "<span>", {          
				"class":"glyphicon glyphicon-remove search_cha abso search_del"
            }).appendTo("._idiv"); 
			
			this._on( this.changer, {                  
                click: this._clear
            });	
			
			this.changer = $( "<input>", {  
				"type": "button",
				"value":this.options.btnval,
				"class":this.options.btnclass
            }).appendTo( this.element ); 
			
			this._on( this.changer, {                  
                click: this._search
            });	
        },
		_delshow:function(){
			var _keyval = $("#search_keyword").val();
			
			//2015-12-8替换之前对正则表达式校验
			var _reg1 = new RegExp("[^\u4E00-\u9FA5^a-z^A-Z^0-9]"); 			
			var _check1 = _reg1.test(_keyval);

			if(_check1){
				//2015-10-21添加替换所有字符	
				_keyval = _keyval.replace(/[^\u4E00-\u9FA5^a-z^A-Z^0-9]/g, '');
				_keyval = _keyval.replace(/\^/g, '');
				
				$("#search_keyword").val(_keyval);
			}else{
				if(_keyval.indexOf("^") > 0){
					//2015-10-21添加替换所有字符	
					_keyval = _keyval.replace(/[^\u4E00-\u9FA5^a-z^A-Z^0-9]/g, '');
					_keyval = _keyval.replace(/\^/g, '');
					
					$("#search_keyword").val(_keyval);
				}
			}			
			
			//=================================
			if(_keyval.length > 0){
				$(".search_del").show();
			}
			else{
				$(".search_del").hide();
			}
		},
		_clear:function(){
			$("#search_keyword").val("");
			$("#search_keyword").focus();
			$(".search_del").hide();
			this.options.onsearch();	
		},
		_search:function(){
			this.options.onsearch();	
		},
		_paste:function(e){
			var pastedText = undefined;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
			} else {
				pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
			}
			if(pastedText != ""){
				// $(".search_del").show();
				setTimeout(function(){
					_self._delshow();
				});				
			}
		},
		_destroy:function(){
			_self.element.empty();
		},
		onsearch:function(event){
			if(event.keyCode == 13) {
				event.returnValue=false;  
				event.cancel = true;   
				//搜索
				this.options.onsearch();	
			}			
		},
		value:function(){
			this.options.value = $("#search_keyword").val();
			return this.options.value;
		},
		clear:function(){
			$("#search_keyword").val("");
			$(".search_del").hide();
		},
		init:function(value){
			var _val = value.replace(/[^\u4E00-\u9FA5^a-z^A-Z^0-9]/g, '');
			_val = _val.replace(/\^/g, '')
			$("#search_keyword").val(_val);
			this._delshow();
		}
	}); 
})(jQuery);		
