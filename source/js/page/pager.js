
var pager = {
	    formId:'form1',
		//divID
		pagerid : 'pager',
		//当前页码
		pno : 1,
		//每页记录数
		rowscount:20,
		//总页码
		total : 20,
		//总数据条数
		totalRecords : 0,
		//是否显示总页数
		isShowTotalPage : true,
		//是否显示总记录数
		isShowTotalRecords : true,
		//是否显示页码跳转输入框
		isGoPage : true,
		lang : {
			prePageText : '上一页',
			nextPageText : '下一页',
			totalPageBeforeText : '共',
			totalPageAfterText : '页',
			totalRecordsAfterText : '条数据',
			gopageBeforeText : '转到',
			gopageButtonOkText : '确定',
			gopageAfterText : '页',
			buttonTipBeforeText : '第',
			buttonTipAfterText : '页'
		},
		gopageWrapId : 'pager_gopage_wrap',
		gopageButtonId : 'pager_btn_go',
		gopageTextboxId : 'pager_btn_go_input',
		
		/****链接算法****/
		getLink : function(n){
			return "javascript:void(0)";
		},

		//跳转框得到输入焦点时
		focus_gopage : function (){
			var btnGo = $('#'+this.gopageButtonId);
			$('#'+this.gopageTextboxId).attr('hideFocus',true);
			btnGo.show();
			btnGo.css('left','0px');
			$('#'+this.gopageWrapId).css('border-color','#6694E3');
			btnGo.animate({left: '+=44'}, 50,function(){
				$('#'+this.gopageWrapId).css('width','88px');
			});
		},
		textValid:function(text,pno){
			var page = text.value;
			var reg = /^[0-9]*$/;
			if(reg.test(page)){
				return true;
			}else{
				text.value = pno;
				return false;
			}
		},
		//跳转框失去输入焦点时
		blur_gopage : function(){
			var _this = this;
			setTimeout(function(){
				var btnGo = $('#'+_this.gopageButtonId);
				btnGo.animate({
				    left: '-=44'
				  }, 100, function(){
					  btnGo.css('left','0px');
					  btnGo.hide();
					  $('#'+_this.gopageWrapId).css('border-color','#DFDFDF');
				  });
			},400);
		},
		//跳转框页面跳转()
		gopage : function(){
			var str_page = $('#'+this.gopageTextboxId).val();
			if(isNaN(str_page)){
				$('#'+this.gopageTextboxId).val(this.next);
				return;
			}
			var n = parseInt(str_page);
			if(n < 1 || n >this.total){
				$('#'+this.gopageTextboxId).val(this.next);
				return;
			}
			service_page(str_page);
			//$('#'+this.formId).submit();
		},
        //控制页面跳转
        link_page:function(formid,pno){
			//$('#'+this.gopageTextboxId).val(pno);
			//$('#'+formid).submit();
        	service_page(pno);
        },
		//分页按钮控件初始化
		init : function(config){
			this.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
			this.total = isNaN(config.total) ? 1 : parseInt(config.total);
			this.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords);
			if(config.pagerid){this.pagerid = config.pagerid;}
			if(config.gopageWrapId){this.gopageWrapId = config.gopageWrapId;}
			if(config.gopageButtonId){this.gopageButtonId = config.gopageButtonId;}
			if(config.gopageTextboxId){this.gopageTextboxId = config.gopageTextboxId;}
			if(config.isShowTotalPage != undefined){this.isShowTotalPage=config.isShowTotalPage;}
			if(config.isShowTotalRecords != undefined){this.isShowTotalRecords=config.isShowTotalRecords;}
			if(config.isGoPage != undefined){this.isGoPage=config.isGoPage;}
			if(config.lang){
				for(var key in config.lang){
					this.lang[key] = config.lang[key];
				}
			}
			if(config.getLink && typeof(config.getLink) == 'function'){this.getLink = config.getLink;}
			//validate
			if(this.pno < 1) this.pno = 1;
			this.total = (this.total <= 1) ? 1: this.total;
			if(this.pno > this.total) this.pno = this.total;
			this.prv = (this.pno<=2) ? 1 : (this.pno-1);
			this.next = (this.pno >= this.total-1) ? this.total : (this.pno + 1);
			this.hasPrv = (this.pno > 1);
			this.hasNext = (this.pno < this.total);
			this.inited = true;
		},
		//生成控件代码
		generPageHtml : function(){
			if(!this.inited){
				return;
			}
			var str_prv='',str_next='';
			if(this.hasPrv){
				str_prv = '<a href="'+this.getLink(this.prv)+'" title="'
					+this.lang.prePageText+'"  onclick="pager.link_page(\''+this.formId+'\','+this.prv+')" >'+this.lang.prePageText+'</a>';
			}else{
				str_prv = '<span class="disabled">'+this.lang.prePageText+'</span>';
			}
			
			if(this.hasNext){
				str_next = '<a href="'+this.getLink(this.next)+'" title="'
					+this.lang.nextPageText+'"  onclick="pager.link_page(\''+this.formId+'\','+this.next+')">'+this.lang.nextPageText+'</a>';
			}else{
				str_next = '<span class="disabled">'+this.lang.nextPageText+'</span>';
			}
			var str = '';
			var dot = '<span style="color:#777">...</span>';
			var total_info='';
			if(this.isShowTotalPage || this.isShowTotalRecords){
				total_info = '<span class="normalsize">'+this.lang.totalPageBeforeText;
				if(this.isShowTotalPage){
					total_info += this.total + this.lang.totalPageAfterText;
					if(this.isShowTotalRecords){
						total_info += '&nbsp;/&nbsp;';
					}
				}
				if(this.isShowTotalRecords){
					total_info += this.totalRecords + this.lang.totalRecordsAfterText;
				}
				
				total_info += '</span>';
			}
			
			var gopage_info = '';
			if(this.isGoPage){
				gopage_info = '&nbsp;<span style="color:#777">'+this.lang.gopageBeforeText+'</span><span id="'+this.gopageWrapId+'">'+
					'<input type="button" id="'+this.gopageButtonId+'" onclick="pager.gopage()" value="'
						+this.lang.gopageButtonOkText+'" />'+
					'<input type="hidden" name="maxRows" value="'+this.rowscount+'"/>'+
					'<input type="text" style="line-height: normal;" id="'+this.gopageTextboxId+'" name="page"  onfocus="pager.focus_gopage()"  onkeyup="pager.textValid(this,'+this.pno+')"   onblur="pager.blur_gopage()" value="'+this.pno+'" /></span><span style="color:#777">'+this.lang.gopageAfterText+"</span>";
				 
			}
			//分页处理
			if(this.total <= 8){
				for(var i=1;i<=this.total;i++){
					if(this.pno == i){
						str += '<span class="curr">'+i+'</span>';
					}else{
						str += '<a href="'+this.getLink(i)+'" title="'
							+this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText+'"  onclick="pager.link_page(\''+this.formId+'\','+i+')" >'+i+'</a>';
					}
				}
			}else{
				if(this.pno <= 5){
					for(var i=1;i<=7;i++){
						if(this.pno == i){
							str += '<span class="curr">'+i+'</span>';
						}else{
							str += '<a href="'+this.getLink(i)+'" title="'+
								this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText+'"  onclick="pager.link_page(\''+this.formId+'\','+i+')" >'+i+'</a>';
						}
					}
					str += dot;
				}else{
					str += '<a href="'+this.getLink(1)+'" title="'
						+this.lang.buttonTipBeforeText + '1' + this.lang.buttonTipAfterText+'"  onclick="pager.link_page(\''+this.formId+'\',1)" >1</a>';
					str += '<a href="'+this.getLink(2)+'" title="'
						+this.lang.buttonTipBeforeText + '2' + this.lang.buttonTipAfterText +'" onclick="pager.link_page(\''+this.formId+'\',2)" >2</a>';
					str += dot;
					
					var begin = this.pno - 2;
					var end = this.pno + 2;
					if(end > this.total){
						end = this.total;
						begin = end - 4;
						if(this.pno - begin < 2){
							begin = begin-1;
						}
					}else if(end + 1 == this.total){
						end = this.total;
					}
					for(var i=begin;i<=end;i++){
						if(this.pno == i){
							str += '<span class="curr">'+i+'</span>';
						}else{
							str += '<a href="'+this.getLink(i)+'" title="'
								+this.lang.buttonTipBeforeText + i + this.lang.buttonTipAfterText+'"  onclick="pager.link_page(\''+this.formId+'\','+i+')" >'+i+'</a>';
						}
					}
					if(end != this.total){
						str += dot;
					}
					if (this.total - this.pno >= 4){
						str += '<a href="'+this.getLink(i)+'" title="'
						+this.lang.buttonTipBeforeText + this.total + this.lang.buttonTipAfterText+'"  onclick="pager.link_page(\''+this.formId+'\','+this.total+')" >'+this.total+'</a>';
					}
				}
			}			
			str = "&nbsp;"+str_prv + str + str_next  + total_info + gopage_info;
			$("#"+this.pagerid).html(str);
		}
};
