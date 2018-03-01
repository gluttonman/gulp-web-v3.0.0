(function ($) { 
	var _treeobj;
	var _randerdata = {"struc_id":"","struc_name":""};
	var _self;
	var _flag = true;
	var _pnamejson = new Array();
	var _number = 23;
    $.widget( "dui.dropDownStruc", {         
        options: {   
			type:"1",
			initType:"1",
			width:180,
			scheme_id:"-1",
			tips:"请选择结构",
			init_struc_code:"",
			onStrucCheck:null,
			onSchemeChange:null
        },   					   
        _create: function() {  
			_self = this;
			this.element.addClass("myDropDownStruc");
			$(".myDropDownStruc").hover(function() {
				_flag = false;
			},function() {
				_flag = true;
				$(".drop-struc-border").hide();
			});	
			this.changer = $( "<input>", {          
                "type": "text",
				"class": "form-control mystruc-tree",
				"width": this.options.width + "px",
				"value": this.options.tips,
				"readonly": "readonly"
            }).appendTo(this.element); 

			this._on( this.changer, {                  
				focus:this._onfocus,
				click:this._onclick,
				blur:this._onblur
            }); 
				
			var ztree_width = this.options.width + _number;
			this.changer = $( "<div>", {          
				"width": ztree_width + "px",
				"class": "drop-struc-border ztree-struc none"
            }).appendTo(this.element); 
			
			this.changer = $( "<ul>", {  
				"id": "tree",
				"class":"ztree"
            }).appendTo(".drop-struc-border"); 
        },
		_onfocus:function(){
			if(this.options.scheme_id != "-1"){
				$(".drop-struc-border").show();
			}			
		},
		_onclick:function(){
			if(this.options.scheme_id != "-1"){
				$(".drop-struc-border").show();
			}	
		},
		_onblur:function(){
			if(_flag){
				$(".drop-struc-border").hide();
			}			
		},
		_loadTree:function(){
			var _setting = {
				edit: {
					enable: true,
					drag: {
						//禁止拖拽节点
						autoExpandTrigger: false,
						isCopy: false,
	    				isMove: false
					},
					editNameSelectAll: true,
					showRemoveBtn: false,
					showRenameBtn: false
				},			
				async: {
					enable : true,
					type : "post",
					url : url_path_action_login + "/resource/getStructureAsyncInfo?random_num=" + creatRandomNum(),
					autoParam : ["id"],
				    otherParam : {"scheme_id":this.options.scheme_id}
				},
				callback: {
					onClick : this._onztreeclick,
					onAsyncSuccess: this._onZtreeAsyncSuccess
				}
			};
			$.fn.zTree.init($("#tree"),_setting);
			_treeobj = $.fn.zTree.getZTreeObj("tree");
			
			this.options.treeobj = _treeobj;
		},
		_onZtreeAsyncSuccess:function (event, treeId, treeNode, msg) {
			if(_treeobj != null){
				if(_self.options.onSchemeChange != null){
					_self.options.onSchemeChange();
				}
				
				
				var nodes = _treeobj.getNodes();  		
				_treeobj.expandNode(nodes[0], true);  	
				_treeobj.selectNode(nodes[0]);
				if(_self.options.initType == "1"){
					if(typeof(nodes[0]) == "undefined"){
						_randerdata = {};
					}else{
						var _rootName = nodes[0].name;
						$(".mystruc-tree").val(_rootName);
						_randerdata.struc_id = nodes[0].id;
						_randerdata.struc_name = _rootName;
						_randerdata.struc_code = nodes[0].structure_code;
						_randerdata.is_parent = nodes[0].isParent;
					}					
				}	

				if(_self.options.init_struc_code != ""){
					//节点定位
					var structure_code = _self.options.init_struc_code;
					var code_arr = structure_code.split("_");
					if(code_arr.length > 2){
						//展开
						for(var i = 1;i < code_arr.length - 1; i++){
							_treeobj.expandNode(_treeobj.getNodeByParam("id", code_arr[i]),true);
						}
						var _sel_node = _treeobj.getNodeByParam("id", code_arr[code_arr.length - 1]);
						if(_sel_node != null){
							_treeobj.selectNode(_sel_node);
							_randerdata.struc_id = code_arr[code_arr.length - 1];
							_randerdata.struc_name = _sel_node.name;
							_randerdata.struc_code = _sel_node.structure_code;
							_randerdata.is_parent = _sel_node.isParent;
							if(_self.options.type == "1"){
								var _pnode = _nname;
							}else{
								var _pnode = _self._getpname(_sel_node,"string");
							}
							$(".mystruc-tree").val(_pnode);
						}					
					}else{
						if(code_arr.length == 2){
							//选中二级子节点
							var _sel_node = _treeobj.getNodeByParam("id",code_arr[1]);
							_treeobj.selectNode(_sel_node);
							if(_sel_node != null){
								_randerdata.struc_id = code_arr[1];
								_randerdata.struc_name = _sel_node.name;
								_randerdata.struc_code = _sel_node.structure_code;
								_randerdata.is_parent = _sel_node.isParent;
								if(_self.options.type == "1"){
									var _pnode = _nname;
								}else{
									var _pnode = _self._getpname(_sel_node,"string");
								}
								$(".mystruc-tree").val(_pnode);
							}						
						}else if(code_arr.length == 1){
							//选中根节点
							_treeobj.selectNode(nodes[0]);
						}
					}
				}
			}			
		},
		_onztreeclick:function(event, treeId, treeNode, clickFlag){
			var _selnode = _treeobj.getSelectedNodes()[0];
			var _nname = _selnode.name;
			_randerdata.struc_id = _selnode.id;
			_randerdata.struc_name = _nname;
			_randerdata.struc_code = _selnode.structure_code;
			_randerdata.is_parent = _selnode.isParent;
			if(_self.options.type == "1"){
				var _pnode = _nname;
			}else{
				var _pnode = _self._getpname(_selnode,"string");
			}
						
			$(".mystruc-tree").val(_pnode);
			$(".drop-struc-border").hide();
			if(_self.options.onStrucCheck != null){
				_self.options.onStrucCheck();
			}		
		},
		_getpname:function(obj,type){
			if(obj == null)return "";
		　　var _pname = obj.name;
			var _pid = obj.id;
			_pnamejson.push({"id":_pid,"name":_pname});
		　　var pNode = obj.getParentNode();
		　　if(pNode!=null){
				if(type == "string"){
					_pname = this._getpname(pNode,type) +"->"+ _pname;
				}else if(type == "json"){
					this._getpname(pNode,type);
				}	   　　　
		　　}
			if(type == "string"){
				return _pname;
			}else if(type == "json"){
				return _pnamejson;
			}	
		},
		_destroy:function(){
			_self.element.empty();
		},
		loadTree:function(scheme_id){
			this.options.scheme_id = scheme_id;
			this._loadTree()
		},
		clearInput:function(){
			$(".mystruc-tree").val(this.options.tips);
			_randerdata = {};
		},
		getValue:function(){
			this.options.getValue = _randerdata;
			return this.options.getValue;
		}
	}); 
})(jQuery);		
