//create by zfz 2015-8-8
//全局变量
var group_type="1";
var stage_id="-1";
var subject_id="-1";
var tableData;
var zTreeObj;
//全局变量
var groupId;
var orgType;
var nodeId;

var groupIdQz = $(self.parent.document).find("#hidden_groupId").val();
var groupName = $(self.parent.document).find("#hidden_groupName").val();


var setting = {
	async: {
		enable: true,
		url: url_path_html + "/yx/getAsyncOrgTree",
		autoParam:["id=org_id"],
		otherParam:{"org_type":3,"get_next" : 1}
	},
    check: {
        enable: false,
        chkboxType: { "Y":"ps", "N":"ps"}
    },
    data: {
        key:{
            name: "name"
            //checked: "CHECKED"
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId"
        }
    },
    callback: {
    	beforeExpand : zTreeBeforeExpand,
        onClick: zTreeOnClick
    }

};

var keyword;
$(document).ready(function(){
	initMsTag();
    var data = {success:true, list:[], init_flag:true};
    var html = template.render('test', data);
    document.getElementById('table2').innerHTML = html;
    $(".que-content-img").css("height","327px");
    $(".que-content-img").css("border-bottom-width","0");
    $('#clearButton').hide();
    getOrgList();
    xdkm1 = $("#xdkm_demo1").stagesubject({
        change:function(){
            var data = xdkm1.stagesubject("getValue");
            stage_id=data.stage_id;
            subject_id=data.subject_id;
        }
    });
    $("#xdkm_demo1 #mystage span").hide();
    $("#xdkm_demo1 #mystage select").css({"width":"130px","margin":"10.3px 0px 8px 4px"});
    $("#xdkm_demo1 #mysubject span").hide();
    $("#xdkm_demo1 #mysubject select").css({"width":"130px","margin":"10.3px 0px 8px 4px"});

    keyword = $("#search_input").search({
        maxinput:10,
        inputwidth:155,
        onsearch:function(){
            //执行搜索
            searchFun();
        }
    });
    $("._idiv").prepend('<input id="hiddenText" type="text" style="display:none" />');
    $("#search_keyword").keydown(function(e){
        var curKey = e.which;
        if(curKey == 13){
            setTimeout(function(){
                goPage($("#pageNumber").val());

                stopBubble(e);
            },0);



        }
    });

});

function initMsTag(){
	
	$.ajax({
        url: url_path_html + "/yx/config/getMsTag?random_num=" + creatRandomNum(),
        method:"POST",
        async: false,
        dataType : "json",
        success: function(data){
            if(data.success){
            	var html = '';
            	for(var i=0;i<data.list.length;i++){
            		if(i == 0){
            			html = '<input type="radio" value="' + data.list[i].ms_id + '" checked="true" name="ms_tag"/>' + data.list[i].ms_name;
            		}else{
            			html = html + '<input type="radio" value="' + data.list[i].ms_id + '" name="ms_tag"/>' + data.list[i].ms_name;
            		}
            	}
                $("#ms_tag").html(html);
            }
        }
    });
}

var key="";  //输入的搜索关键字
function searchFun(){
    key = keyword.search("value");
    goPage(1);
}
//全选
function checkAll() {
    var allchecks = document.getElementsByName("chk_person");
    if (document.getElementById("chk_delAll").checked) {
        for (var i = 0; i < allchecks.length; i++) {
            if(allchecks[i].disabled == false){
                allchecks[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < allchecks.length; i++) {
            if(allchecks[i].disabled == false){
                allchecks[i].checked = false;
            }
        }
    }
}

//取消全选
function nocheck(){
    var allchecks = document.getElementsByName("chk_person");
    var allchecksCheched=$('input[name="chk_person"]:checked');
    if(allchecks.length!=allchecksCheched.length){
        $("#chk_delAll").attr("checked",false);
    }
}

//对多条数据或其中一条数据都可以
function batchJoinPersons()
{
    var personData;
    var person_selected= $("input[name='chk_person']:checked");
    if(person_selected.length == 0){
        showAlert({content: "请选择用户。", time:2});
        return;
    }
    var personArray = new Array();
    for(var i=0; i<person_selected.length; i++){
        if(person_selected[i].value !== "-1"){
            var index = person_selected[i].value;
            personData =tableData[index];
            personArray.push([personData.person_id, personData.identity_id, personData.person_name]);

        }
    }
    
    if(personArray.length > 0){
    	joinPerson(personArray);
    }
}

//选中一条数据进行操作
function add2Group(person_index,dom)
{

	var personData =tableData[person_index];
    var personArray = new Array();
    personArray.push([personData.person_id, personData.identity_id, personData.person_name]);
    
    joinPerson(personArray);

}

function joinPerson(paramJSON){
	var ms_id = $("input[name='ms_tag']:checked").val();
    $.ajax({
        url: url_path_html + "/yx/team/setGzs?random_num=" + creatRandomNum(),
        method:"POST",
        async: false,
        data:{
        	paramJSON : JSON.stringify(paramJSON),
        	ms_id : ms_id
        },
        dataType : "json",
        success: function(data){
            if(data.success){
                dialogClose("保存成功，正在刷新成员列表",2,330,'cancel();');
            }else{
                if(data.info == "notlogin"){
                    top.location = url_path_action + "/";
                }else{
                    if(data.info != null && data.info != ""){
                        alert(data.info);
                    }else{
                        alert("设置失败，请刷新页面后重试。");
                    }
                }
            }
        }
    });
}

function cancel(){
    self.parent.tb_remove();
}
//分页处理
function goPage(pageNumber){
    pg = new showPages('pg');
    pg.pageCount = totalPage;
    if(pageNumber == 0) {
        pageNumber = 1;
    }
    pg.toPage(pageNumber);
}

function zTreeOnClick(event, treeId, treeNode) {
    $("#orgId").val(treeNode.id);
    nodeId=treeNode.id;
    orgType=treeNode.org_type;
    goPage(1);
};

function zTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.otherParam.org_type = treeNode.org_type;
};

function renderData(pageNumber)
{
    goPage(pageNumber);
}
//获得群组

function getOrgList(){
	var org_id = $.cookie("background_yx_manage_org_id");
	 $.ajax({
	        url : url_path_html + "/management/sys/org/getEduUnitByOrgId?org_id=" + org_id,
	        type : "get",
	        async : false,
	        dataType : "json",
	        success : function(data){
	            if(data.success){
	            	if(data.PROVINCE_ID == 0){
	            		getAreaNodeList(org_id,0);
	            	}else if(data.PROVINCE_ID > 0 && data.CITY_ID == 0){
	            		getAreaNodeList(org_id,1);
	            	}else if(data.PROVINCE_ID > 0 && data.CITY_ID > 0 && data.DISTRICT_ID == 0){
	            		getAreaNodeList(org_id,2);
	            	}else{
	            		getSchoolNodeList(org_id,null);
	            	}
	            }
	        }
	    });
		
}

function getAreaNodeList(org_id,org_type){
	$.ajax({
        url : url_path_html + "/yx/getAsyncOrgTree?random_num=" + creatRandomNum(),
        type : "POST",
        async : false,
        data:{
            "org_id": org_id,
            "org_type": org_type,
            "get_next": 1
        },
        dataType : "json",
        success : function(data){
            if (null != data) {
            	getSchoolNodeList(org_id,data);
            }
        }
    });
}


function getSchoolNodeList(org_id,bef_data){
	if(null == bef_data){
		bef_data = new Array();
	}
	$.ajax({
        url : url_path_html + "/yx/getOrgTreeById?random_num=" + creatRandomNum(),
        type : "POST",
        async : false,
        data:{
            "id" :	org_id,
            "root_id" :	org_id
        },
        dataType : "json",
        success : function(data){
        	if(data.length > 0){
        		var has_org = false;
        		for(var i=0;i<data.length;i++){
        			var arr = {
        				id : data[i].id,
        				pId : data[i].pId,
        				name : data[i].name,
        				org_type : data[i].unit_type,
        				isParent : data[i].isParent
        			};
        			bef_data.push(arr);
        			if(data[i].ORG_ID == org_id){
        				has_org = true;
        			}
        		}
        	}
        	if(!has_org && org_id != 99999){
        		var a_data = {
    					id : org_id,
    					pId : 0,
    					org_type : 2,
    					name : getOrgName(org_id)
    			};
        		bef_data.push(a_data);
        	}
        	zTreeObj = $.fn.zTree.init($("#tree"), setting, bef_data);
        }
    });
}


function getOrgName(org_id){
	var org_name = null;
	$.ajax({
        url : url_path_html + "/management/sys/org/getEduUnitByOrgId?random_num=" + creatRandomNum(),
        type : "POST",
        async : false,
        data:{
            "org_id": org_id
        },
        dataType : "json",
        success : function(data){
        	org_name = data.ORG_NAME;
        }
    });
	return org_name;
}


//模糊查询群组内成员
function  getDataList(pageNumber){
	$("#chk_delAll").attr("checked",false);
    var workroom_id = $("#workroom_id").val();
    //var the_keyword=$("#keyword").val();
    var keyword = Base64.encode(key);  //搜索内容加密后传给后台
    keyword = keyword.replace(/\+/g,"%2B");
    if(nodeId==undefined){
        showAlert({content: "请在左侧选择机构。", time:2});
        return;
    }
    $.ajax({
        url : url_path_html + "/yx/getOrgUser?random_num="+creatRandomNum(),
        type : "POST",
        async: false,
        data:{
            "org_id": nodeId,
            "rangeType": 1,
            "stage_id": stage_id,
            "subject_id": subject_id,
            "keyword":keyword,
            "pageNumber": pageNumber,
            "pageSize": 10
        },
        dataType : "json",
        success: function(data)
        {
            if(data.success){
                $("#pagenumber_cur").val(pageNumber);
                $("#pageNumber").val(data.pageNumber);
                $("#totalRow").val(data.totalRow);
                $("#pageSize").val(data.pageSize);
                $("#totalPage").val(data.totalPage);
                tableData = data.list;
                var html = template.render('test', data);
                document.getElementById('table2').innerHTML = html;
                $('#totalPage').val(data.totalPage);

            }else{
                if(data == "notlogin"){
                    top.location = url_path_action + "/";
                }else{
                    alert(data.info);
                }
            }
        }
    });
    $(".que-content-img").css("height","279px");
    $(".que-content-img").css("border-bottom-width","1px");

}

