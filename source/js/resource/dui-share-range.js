(function ($) { 
	var _this;
    $.widget( "dui.sharerange", {         
        options: { 
			sharetip : "共享范围：",
			setRangeSel : null,
			setBatchRangeSel : null,
			getRangeSel : null,
			type : 1
        },   					   
        _create: function() {
			var _data = this._getData();
			if(_data == null) return;			
			var _orglist = _data.org_List; 
			var _grouplist = _data.group_List;
			var _sharestr = this.options.sharetip;
			if(this.options.type == 1){
				for(var i = 0; i < _orglist.length; i++){
					if(i == 0){
						_sharestr += '<label><input type="radio" id="'+_orglist[i].input_id+'" name="share_range_org" checked="checked" value="'+_orglist[i].org_id+'" >'+_orglist[i].org_name+'</label>';
					}else{
						_sharestr += '<label><input type="radio" id="'+_orglist[i].input_id+'" name="share_range_org" value="'+_orglist[i].org_id+'" >'+_orglist[i].org_name+'</label>';
					}
				}
			}else if(this.options.type == 2){
				_sharestr += '<label><input type="radio" id="chk_org" name ="share_range_org" checked="checked" value="1">共享到平台</label>';
			}
			
			_sharestr += '<label style="border-right:1px dashed;padding-right:15px;"><input type="radio" id="share_self" name ="share_range_org" value="0">自己</label>';
						
			for(var j = 0; j < _grouplist.length; j++){	
				if(_grouplist[j].group_name != null){
					_sharestr += '<label><input type="checkbox" id="'+_grouplist[j].group_id+'" name ="share_range_gourp" value="'+_grouplist[j].group_id+'">'+_grouplist[j].group_name+'</label>';	
				}						
			}
			this.element.append(_sharestr);
			
			$("[name='share_range_org']").bind("click",function(){	
				if(document.getElementById("share_all") != null){
					if (document.getElementById("share_all").checked) {
						$("[name='share_range_gourp']").removeAttr("checked").attr("disabled","disabled");     
					} else {
						$("[name='share_range_gourp']").removeAttr("disabled"); 
					}	
				}					
			});	
        },
		_getData:function(){
			var _returnData;
			$.ajax({
				type : "GET",
				async : false,
				dataType:"json",
				url : url_path_action+"/config/getShareRange",
				success : function(data) 
				{
					if(data.success){
						_returnData = data;
					}else{
						_returnData = null;
						alert(data.info);
					}
				}			
			});
			return _returnData;
		},
		setRangeSel:function(rangeId){
			$("#"+rangeId).attr("checked","checked");
		},
		setBatchRangeSel:function(rangeIdStr){
			var _idarr = rangeIdStr.split(",");
			for(var i = 0;i < _idarr.length; i ++){
				$("#"+_idarr[i]).attr("checked","checked");
			}
		},
		getRangeSel:function(seltype){
			var _selid = "";			
			if(seltype == 1){
				_selid = $('input[name="share_range_org"]:checked').val();
			}else if(seltype == 2){
				_selid = $('input[name="share_range_org"]:checked').attr("id");
			}
			if(_selid == 0){
				_selid = "";
			}else{
				_selid = _selid + ",";
			}
			$("input[name='share_range_gourp']:checkbox").each(function(){ 
				if($(this).attr("checked"))
				{
					_selid += $(this).val()+",";
				}
			});
			if(_selid != "") _selid = _selid.substring(0,_selid.length-1);			
			this.options.getRangeSel = _selid;
			return this.options.getRangeSel;
		}
	}); 
})(jQuery);		
