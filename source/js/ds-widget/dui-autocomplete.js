(function ($) { 
	window['myautodata']= {"data":{},"fillColume":"","focusIndex":-1,"keyword":""};
	var _self;
	var _timer = null;
    $.widget( "dui.autocomplete", {         
        options: {        
			inputclass:"form-control",
			inputwidth:260,
			maxinput:20,
			tips:"请输入（中文、简拼、全拼）进行检索",
			rows:5,
			url:"",
			columnData:null,
			afterSelHandler:null,
			inputVal:"",
			person_id:0
        },   					   
        _create: function() { 
			_self = this;
			this.element.append("<div class='myautocomplete' style='display:inline-block;position:relative'></div>");
			
			$(".myautocomplete").click(function(event){
				stopBubble(event);
			});
			
			$(document).click(function(e){                         				
				_self._clearData();
			});   
			
			this.changer = $( "<input>", {          
                "type": "text",
				"id":"myautocompleteinput",
				"placeholder":this.options.tips,
				"class":this.options.inputclass, 				
				"width":this.options.inputwidth + "px",
				"maxlength":this.options.maxinput
            }).appendTo(".myautocomplete");  

			this._on( this.changer, {                  
				keyup:this._onkeyup,
				paste:this._onpaste,
				blur:this._onblur
            }); 
			
			var _check = this._isPlaceholer();
			if(!_check){
				$('<label id="replace_tip" style="position:absolute;left:13px;top:7px;color:grey">'+this.options.tips+'</label>').appendTo(".myautocomplete"); 
				$("#replace_tip").bind('click',function(){
					$("#replace_tip").css("display","none");
					$("#myautocompleteinput")[0].focus();
				});
				
				$("#myautocompleteinput").bind('blur',function(){
					var _val = $("#myautocompleteinput").val();			
					if($.trim(_val) == ""){
						$("#replace_tip").css("display","block");
					}
				});
			}
			
			var _appendStr = "<div class='autocomplete' style='display:none;width:"+this.options.inputwidth+"px;position:absolute;background-color:#fff;z-index:9999'></div>";
			$(_appendStr).appendTo(".myautocomplete"); 

        },
        _onblur:function(e){
			if($("#myautocompleteinput").val() != this.options.inputVal){
				this.options.person_id = 0;
				//$("#myautocompleteinput").val('');
			}
		},
		_onkeyup:function(event){
			if(event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40){
				if(myautodata.keyword != $("#myautocompleteinput").val()){
					myautodata.focusIndex = -1;
				}

				if(myautodata.focusIndex == -1 && myautodata.keyword != $("#myautocompleteinput").val()){
					clearTimeout(_timer);
					_timer = setTimeout(function(){
						_self._getData(1);
						var _val = $("#myautocompleteinput").val();
						if($.trim(_val) == ""){
							$(".autocomplete").css("display","none");
						}else{
							$(".autocomplete").css("display","block");
						}
						myautodata.keyword = _val;
					}, 200);			
				}				
			}
			
			if(typeof(myautodata.data.rows) != "undefined"){
				switch (event.keyCode) {
					case 38: //上
						$("#"+myautodata.focusIndex+" td").removeClass("sel-hover");
						if(myautodata.focusIndex > 0){
							myautodata.focusIndex = myautodata.focusIndex - 1;
						}else{
							myautodata.focusIndex = myautodata.data.rows.length - 1;
						}	
						$("#"+myautodata.focusIndex+" td").addClass("sel-hover");
						break;
					case 40: //下
						$("#"+myautodata.focusIndex+" td").removeClass("sel-hover");
						if(myautodata.focusIndex == myautodata.data.rows.length - 1){
							myautodata.focusIndex = 0;
						}else{						
							myautodata.focusIndex = myautodata.focusIndex + 1;
						}
						$("#"+myautodata.focusIndex+" td").addClass("sel-hover");
						break;
					case 13:
						this._showSelectInfo(myautodata.focusIndex);		
						this._clearData();
						break;
					case 37://左
						_self._goPage(myautodata.data.page - 1,myautodata.data.total);
						break;
					case 39://右
						_self._goPage(myautodata.data.page + 1,myautodata.data.total);
						break;
					default:
						//return;
				}
			}			
		},
		_onpaste:function(e){
			var pastedText = undefined;
			if (window.clipboardData && window.clipboardData.getData) { // IE
				pastedText = window.clipboardData.getData('Text');
			} else {
				pastedText = e.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
			}
			if(pastedText != ""){	
				setTimeout(function(){
					_self._getData(1);
					var _val = $("#myautocompleteinput").val();
					if($.trim(_val) == ""){
						$(".autocomplete").css("display","none");
					}else{
						$(".autocomplete").css("display","block");
					}
				});				
			}
		},
		_clearData:function(type){
			myautodata.focusIndex = -1;
			myautodata.data = {};
			if(type != 1){
				$(".autocomplete").css("display","none");
			}			
		},
		_getData:function(pageNumber){
			this._clearData(1);
			var _val = $("#myautocompleteinput").val();			
			if($.trim(_val) != ""){
				_val = Base64.encode(_val);
				_val = _val.replace(/\+/g,"%2B");
				var _action_url = this.options.url;
				if(_action_url.indexOf("?") >= 0){
					_action_url = _action_url + "&random_num="+creatRandomNum()
				}else{
					_action_url = _action_url + "?random_num="+creatRandomNum()
				}
				$.ajax({
					type : "GET",
					async : true,
					dataType:"json",
					url :_action_url + "&page="+pageNumber+"&rows="+this.options.rows+"&searchTerm="+_val,
					success : function(data) 
					{
						if(data.success && data.total > 0){
							myautodata.data = data;
							_self._refresh();
						}else{
							$(".autocomplete").empty();
							$(".autocomplete").css("display","none");
						}	
					}
				});		
			}			
		},
		_refresh:function(){	
			$(".autocomplete").empty();
			var _appendStr = "<table class='table table-condensed table-striped table-hover'>";
			var _column = this.options.columnData;
			_appendStr += "<thead class='head'>";
			myautodata.fillColume = _column[0].columnName;
			for(var i = 0;i < _column.length;i++){
				if(_column[i].fillColumn == true || _column[i].fillColumn == "true"){
					myautodata.fillColume = _column[i].columnName;
				}
				_appendStr += "<th width='"+_column[i].width+"%' class='center'>"+_column[i].label+"</th>";
			}
			_appendStr += "</thead>";
			var _data = myautodata.data;
	
			for(var j = 0;j < _data.rows.length;j++){
				_appendStr += "<tr id='"+j+"' class='info-tr'>";
				for(var n = 0;n < _column.length;n++){
					var _columnName = _column[n].columnName;
					var _columnVal = _data.rows[j][_columnName];
					var _totalWidth = this.options.inputwidth;
					var _columnWidth = _totalWidth * Number(_column[n].width) / 100 - 10;					
					_appendStr += "<td class='center' width='"+_column[n].width+"%'><div class='auto-textoverflow' title='"+_columnVal+"' style='width:"+_columnWidth+"px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>"+_columnVal+"</div></td>";
				}				
				_appendStr += "</tr>";
			}

			_appendStr += "<tr class='page'><td align='center' colspan='"+_column.length+"'><a class='leftpage' title='首页' id='first_page'><i class='glyphicon first-page'></i></a><a class='leftpage' title='上一页' id='pre_page'><i class='glyphicon prev-page'></i></a><span>第"+_data.page+"页</span><span>|</span><span>共"+_data.total+"页</span><a class='rightpage' title='下一页' id='next_page'><i class='glyphicon next-page'></i></a><a class='rightpage' title='尾页' id='last_page'><i class='glyphicon last-page'></i></a></td></tr>";
	
			_appendStr += "</table>";

			$(_appendStr).appendTo(".autocomplete"); 

			//事件绑定
			$("#first_page").bind('click',function(){
				_self._goPage(1,_data.total);
			});
			$("#pre_page").bind('click',function(){
				_self._goPage(_data.page - 1,_data.total);
			});
			$("#next_page").bind('click',function(){
				_self._goPage(_data.page + 1,_data.total);
			});
			$("#last_page").bind('click',function(){
				_self._goPage(_data.total,_data.total);
			});
			$(".info-tr").bind('click',function(){
				_self._showSelectInfo(this.id);
			});
						
			$(".info-tr").mouseover(function(){ 
				myautodata.focusIndex = -1;
				$(".autocomplete td").removeClass("sel-hover");
				$("#"+this.id+" td").addClass("sel-hover");				
			}).mouseout(function() {  
				$("#"+this.id+" td").removeClass("sel-hover");
			}); 
		},
		_goPage:function(pageNumber,totalPage){
			if(pageNumber > totalPage || pageNumber < 1){
				return;
			}
			if(myautodata.data.page == pageNumber){
				return;
			}
			this._getData(pageNumber);
		},
		_showSelectInfo:function(sel_index){
			var _data = myautodata.data;	
			var _showColumnName = myautodata.fillColume;
			if(sel_index != -1){
				var _showColumnVal = _data.rows[sel_index][_showColumnName];
				$("#myautocompleteinput").val(_showColumnVal);
				this.options.inputVal = $("#myautocompleteinput").val();
				this.options.person_id = _data.rows[sel_index]["person_id"];
				//记录当前关键字
				myautodata.keyword = _showColumnVal;
				$(".autocomplete").empty();
				this.options.afterSelHandler(_data.rows[sel_index]);
			}			
		},
		_isPlaceholer:function(){
			var input = document.createElement('input');
			return "placeholder" in input;
		},
		_destroy:function(){
			_self.element.empty();
		},
		inputVal:function(){
			return this.options.inputVal;
		},
		getPersonId:function(){
			return this.options.person_id;
		},
		clear:function(){
			$("#myautocompleteinput").val("");
		},
		initInput:function(value){
		
			$("#myautocompleteinput").val(value);
		}
	}); 
})(jQuery);		
