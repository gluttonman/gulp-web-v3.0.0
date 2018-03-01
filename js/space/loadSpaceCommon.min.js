/**
 * Created by Administrator on 2016/1/14.
 * 顶部机构导航尚未开发
 */

!function($){
    "use strict";
    var CommonInfo = function(ele,opts){
        this.ele = ele;
        this.personInfo = {
            person_id: $.cookie("person_id")||"",
            identity_id: $.cookie("identity_id")||"",
            bperson_id:opts.id,
            bidentity_id:opts.identity_id,
            is_admin:opts.is_admin||0,
            roles:[]
        };
        this.setting={
            topNav:{
                leftNav:["viewSpace","spacePortlet","layout","theme","open"],
                right:["select","message","person"]
            },
            body:true,
            nav:true,
            type:opts.type?opts.type:"",
            has_portlet:function (obj){
                return [{
                        "常用工具":[
                            {"id":"org_news","name":"新闻资讯","repetition":0},
                            {"id":"org_yxSelfInfo","name":"工作室简介","repetition":0},
                            //{"id":"feed","name":"动态","repetition":0},
                            {"id":"yx_workroomCount","name":"工作室统计","repetition":0},
                            {"id":"yx_workroom_article","name":"工作室文章","repetition":0},
                            {"id":"yx_workroom_resource","name":"工作室资源","repetition":0},
                            {"id":"yx_workroom_video","name":"工作室视频","repetition":0},
                            {"id":"yx_workroom_hd","name":"工作室活动","repetition":0},
                            //{"id":"yx_workroom_topic","name":"工作室专题","repetition":0},
                            //{"id":"yx_workroom_moke","name":"工作室磨课","repetition":0},
                            {"id":"groupMember","name":"工作室成员","repetition":0},
                            {"id":"toplink","name":"快捷链接","repetition":0},
                            {"id":"photos","name":"工作室相册","repetition":0},
                            {"id":"messageBoard","name":"留言板","repetition":0}
                        ]}
                    ];
            }
        };
        this.path = "/dsideal_yy";
        this.themeId;
        this.init(opts);
        this.initBack();
        this.initTopNav();
        this.initNav();
        this.spaceMessageArt = null;
        window.has_portlet = this.setting.has_portlet(this);
    };
    CommonInfo.prototype.init = function(opts){
        var that = this;
        var path_name = document.location.pathname;
        var can = false;
        if(path_name.indexOf("/work.html") > 0){
        	can = true;
        }
        if(opts.is_admin != 1 || !can){
            this.setting.topNav= {leftNav:["viewSpace"],right:["select","message","person"]};
        }
       

    };
    //加载nav
    CommonInfo.prototype.initTopNav = function(){
        var that = this,topNav = that.setting.topNav;
        if(window.openPage != 0 && topNav) {
            if($(that.ele).find(".space_top_nav_back")[0]){
                $(that.ele).find(".space_top_nav").empty();
            }else {
                $(that.ele).append("<div class='space_top_nav_back'></div><div class='space_top_nav'></div>");
            }
            if(that.personInfo.person_id){
                topNav = that.setting.topNav;
                for (var key in topNav) {
                    $(that.ele).find(".space_top_nav").append("<div class='" + key + "'></div>");
                    $(topNav[key]).each(function () {
                        that[this](key);
                    });
                }
            }else{
                that.setting.topNav={right:["select","login"]};
                $(that.ele).find(".space_top_nav").append("<div class='right'></div>");
                that["select"]("right");
                that["login"]("right");
            }
        }
    };
    
    CommonInfo.prototype.initBack = function(){
        var html = "",that = this,theThemeId = that.getThemeId(),space_name;

        var group_name = group_data.GROUP_NAME;
        window.org_info_= window.org_info_?window.org_info_:{};
        org_info_['org_name'] = Base64.encode(group_name);
        org_info_['org_description_text'] = Base64.encode(group_data.GROUP_DESC);

        $("body").attr("themeVal",theThemeId);
        $("body").attr("themeType","person");
        html += "<div class='spaceBackDiv'>";
        html += "<div class='name'>" + group_name + "</div>";
        html += "<div class='signature'></div>";
        html += "</div>";
        space_name = group_name;
        $(that.ele).append(html);
        if(space_name){
            document.title = space_name;
        }
    };
    
    CommonInfo.prototype.initNav = function(){
        var that = this,html="";
        if(that.setting.nav){
            html += "<div id='nav_space_maintop' class='spacebox-shadow'>";
            html += "<ul id='navul_space' class='clearfix'>";
           	html += "<li class='outli nav_work'><a target='_self' href='" + that.path + "/yx/html/space/main/work.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>首页</a></li>";
           	html += "<li class='outli nav_group_jyNews'><a target='_self' href='" + that.path + "/yx/html/space/main/group_jyNews.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>新闻资讯</a></li>";
        	html += "<li class='outli nav_group_jyarticle'><a target='_self' href='" + that.path + "/yx/html/space/main/group_jyarticle.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>文章</a></li>";
            html += "<li class='outli nav_group_gallery'><a target='_self' href='" + that.path + "/yx/html/space/main/group_gallery.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>相册</a></li>";
            html += "<li class='outli nav_group_jyVideo'><a target='_self' href='" + that.path + "/yx/html/space/main/group_jyVideo.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>视频</a></li>";
        	html += "<li class='outli nav_group_huodong'><a target='_self' href='" + that.path + "/yx/html/space/main/group_huodong.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>活动</a></li>";
        	html += "<li class='outli nav_group_topic'><a target='_self' href='" + that.path + "/yx/html/space/main/group_topic.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>专题</a></li>";
        	/*html += "<li class='outli nav_group_weike'><a target='_self' href='" + that.path + "/yx/html/space/main/group_weike.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>磨课</a></li>";*/
        	html += "<li class='outli nav_group_jyres'><a target='_self' href='" + that.path + "/yx/html/space/main/group_jyres.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>网盘</a></li>";
        	html += "<li class='outli nav_group_jytl'><a target='_self' href='" + that.path + "/yx/html/space/main/group_jytl.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>讨论</a></li>";
        	html += "<li class='outli nav_group_member'><a target='_self' href='" + that.path + "/yx/html/space/main/group_member.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>基本信息</a></li>";
        	html += "<li class='outli nav_group_yx_score_sort'><a target='_self' href='" + that.path + "/yx/html/space/main/group_yx_score_sort.html?orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>积分排名</a></li>";

            $.ajax({
                type : "GET",
                async : false,
                data:{"random_num":creatRandomNum(),
                    "a_id":that.personInfo.bperson_id,
                    "a_identity_id":that.personInfo.bidentity_id,
                    "a_type": that.personInfo.bidentity_id<100?"spacenav":"spacenav"
                },
                url : url_path_action_login + "/space/getAJson",
                dataType: "json",
                success : function(data) {
                    if(data.success){
                        var list = data.a_json;
                        for(var i = 0;i < list.length;i++){
                            if(list[i].checked){
                                html+= "<li class='outli'>";
                                html+= "<a href="+Base64.decode(list[i].url)+" target='_blank'>"+Base64.decode(list[i].name)+"</a>";
                                for(var j = 0,k=0;j < list[i].list.length;j++){
                                    if(list[i].list[j].checked){
                                        if(k==0){
                                            html+="<ul>";
                                            k += 1;
                                        }
                                        html+= "<a href="+Base64.decode(list[i].list[j].url)+" target='_blank'><li>"+Base64.decode(list[i].list[j].name)+"</li></a>";
                                    }
                                    if(j == list[i].list.length-1 && k==1){
                                        html+="</ul>";
                                    }
                                }
                                html+= "</li>";
                            }
                        }
                    }
                }
            });
            if((that.personInfo.person_id == that.personInfo.bperson_id) || (that.personInfo.identity_id == that.personInfo.bidentity_id)){
                html += "<a class='setting' href='" + that.path + "/html/space/main/main_manage.html?menu_id=space_nav'></a>";
            }
            html += "</ul>";

            html += "</div>";
            $(that.ele).append(html);
            $("#navul_space > li").not(".navhome").hover(function(){
                $(this).addClass("navmoon");
            },function(){
                $(this).removeClass("navmoon");
            });

            var list = $("#navul_space").children("li");
            var max_width = $("#navul_space").width() - 5;
            $(list).each(function(i){
                if(max_width - $(list[i]).outerWidth() < 0){
                    $(list[i]).hide();
                }
                max_width = max_width - $(list[i]).outerWidth();
            });

            //导航位置定位
            var this_pathname = window.location.pathname;
            this_pathname = this_pathname.substr(this_pathname.lastIndexOf("/")+1);
            this_pathname = this_pathname.split(".")[0];
            $("#navul_space > li.nav_" + this_pathname).addClass("active");
        }
    };
    //加载添加模块的方法
    CommonInfo.prototype.spacePortlet = function(keyName){
        var html = "",that = this;
            html += "<div class='spacePortlet dropdown'>" +
                "<a id='showPortletDropdown' href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>添加应用";
            html += "&nbsp;&nbsp;<span class='caret'></span></a>";
            html += "<div id='add_portlets_ul' class='dropdown-menu' role='menu'>";
            html += "<li><div><img class='closeImg' src='"+that.path+"/images/space/icon_chablue.png' title='关闭' width='14' height='24'/>"+
                "<ul id='tree_portletslist' class='ztree'></ul></div></li>";
            html += "</div>";
            html += "</div>";

        $("#showPortletDropdown").live("click",function(){
            var has_portlet =[];
            has_portlet = that.setting.has_portlet(that);
            var key_i = 0;
            var zNodes =[];
            var znode_ = 1;
            for(var key in has_portlet[0]){

                var pid_ ={};
                pid_["id"] = 100+key_i;
                pid_["pId"] = 0;
                pid_["name"] = key;
                pid_["open"] = key_i == 0?true:false;
                pid_['font']={};
                zNodes.push(pid_);
                $(has_portlet[0][''+key]).each(function (i){

                    var cid_ ={};
                    cid_["id"] = (key_i+1)*1000+znode_;
                    cid_["pId"] = 100+key_i;
                    cid_["name"] = has_portlet[0][''+key][i]["name"];
                    cid_["portletID"] = has_portlet[0][''+key][i]["id"];
                    cid_["repetition"] = has_portlet[0][''+key][i]["repetition"];
                    pid_['font']={};
                    zNodes.push(cid_);
                    znode_++;
                });

                key_i++;
            }

            var setting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: click_to_add_portlet
                },view: {
                    fontCss: function(treeId, node){
                        var this_portlets = data_portlet.portlets;
                        var check_ = {};
                        if( node.portletID == "" ){
                            check_ = {color:"#a5a5a5"};
                        }else if(node.repetition == 0){
                            $(this_portlets).each(function(index){
                                $(this_portlets[index]).each(function(i){
                                    if((node.portletID === this_portlets[index][i].id)){
                                        //alert(node.portletID + "**" + this_portlets[index][i].id);
                                        check_ = {color:"#a5a5a5"};
                                        return false;
                                    }
                                });
                            });
                        }
                        return check_;
                    },
                    selectedMulti: false
                }

            };
            $.fn.zTree.init($("#tree_portletslist"), setting, zNodes);
        });
        $("#add_portlets_ul .closeImg").off("click");
        $("#add_portlets_ul").off("click");
        $("#add_portlets_ul .closeImg").live("click",function(){
            $(this).closest(".spacePortlet").removeClass("open");
        });
        $("#add_portlets_ul").live("click",function(){
            return false;
        });
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.spacePortlet",html);
    };
    CommonInfo.prototype.layout = function(keyName){
        var html = "",that = this;
            html += "<div class='layout dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'> 调整布局";
            html += "&nbsp;&nbsp;<span class='caret'></span></a>";
            html += '<ul class="dropdown-menu" role="menu" id="change_layout_ul">'+
                '<li onclick="changeLayout(1)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat 0px 0px;"></div><input type="hidden" value="1"/><span><input type="radio" name="layoutId" class="ischeck"/>三列（1:2:1）</span></a></li>'+
                '<li onclick="changeLayout(2)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -120px 0px;"></div><input type="hidden" value="2"/><span><input type="radio" name="layoutId" class="ischeck"/>两列（2:1）</span></a></li>'+
                '<li onclick="changeLayout(3)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -240px 0px;"></div><input type="hidden" value="3"/><span><input type="radio" name="layoutId" class="ischeck"/>两列（1:2）</span></a></li>'+
                '<li onclick="changeLayout(4)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -360px 0px;"></div><input type="hidden" value="4"/><span><input type="radio" name="layoutId" class="ischeck"/>两列（1:1）</span></a></li>'+
                '<li onclick="changeLayout(5)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -480px 0px;"></div><input type="hidden" value="5"/><span><input type="radio" name="layoutId" class="ischeck"/>三列（1:1:1）</span></a></li>'+
                '<li onclick="changeLayout(6)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -600px 0px;"></div><input type="hidden" value="6"/><span><input type="radio" name="layoutId" class="ischeck"/>T列（1:1:1）</span></a></li>'+
                '<li onclick="changeLayout(7)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat 0px -120px;"></div><input type="hidden" value="7"/><span><input type="radio" name="layoutId" class="ischeck"/>T列（1:2）</span></a></li>'+
                '<li onclick="changeLayout(8)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -120px -120px;"></div><input type="hidden" value="8"/><span><input type="radio" name="layoutId" class="ischeck"/>T列（2:1）</span></a></li>'+
                '<li onclick="changeLayout(9)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -240px -120px;"></div><input type="hidden" value="9"/><span><input type="radio" name="layoutId" class="ischeck"/>T列（1:1）</span></a></li>'+
                '<li onclick="changeLayout(10)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -360px -120px;"></div><input type="hidden" value="10"/><span><input type="radio" name="layoutId" class="ischeck"/>TB列（1:1）</span></a></li>'+
                '<li onclick="changeLayout(11)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -480px -120px;"></div><input type="hidden" value="11"/><span><input type="radio" name="layoutId" class="ischeck"/>TB列（1:1:1）</span></a></li>'+
                '<li onclick="changeLayout(12)"><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/layout.png) no-repeat -600px -120px;"></div><input type="hidden" value="12"/><span><input type="radio" name="layoutId" class="ischeck"/>自由布局</span></a></li>'+
                '</ul>';
            html += "</div>";
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.layout",html);
        $("#space_common .layout").click(function(){
            $("#change_layout_ul li").eq(data_portlet.layout-1).find(".ischeck").attr("checked","checked");
        });
    };
    CommonInfo.prototype.theme = function(keyName){
        var html = "",that=this,theThemeId = that.getThemeId();

            html += "<div class='theme dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'> 设置风格";
            html += "&nbsp;&nbsp;<span class='caret'></span></a>";

            if(!(that.personInfo.bidentity_id >= 100 && that.personInfo.bidentity_id < 105)){
                html += '<div class="dropdown-menu spaceDropDownV2" role="menu" id="change_theme_ul_V2">'
                    +'<ul class="nav nav-tabs theme100" role="tablist">'
                    +'<li role="presentation" class="active"><a href="#oldTheme12" aria-controls="profile" role="tab" data-toggle="tab">实用风格</a></li>'
                    +'<li role="presentation"><a href="#newTheme12" aria-controls="home" role="tab" data-toggle="tab">炫彩风格</a></li>'
                    +'</ul>'
                    +'<div class="theme100">'
                    +'<div class="tab-content leftTh">'
                    +'<div role="tabpanel" class="tab-pane active" id="oldTheme12">'
                    +'<div class="th_l">'
                    +'<div themeVal="oldTheme1" class="bigImg mr mb oldTheme1"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme2" class="img mb oldTheme2"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme3" class="img mb oldTheme3"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme4" class="img mr oldTheme4"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme5" class="img mr oldTheme5"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme6" class="img oldTheme6"><div class="checked"></div></div>'
                    +'</div>'
                    +'<div class="th_r">'
                    +'<div themeVal="oldTheme7" class="img mr oldTheme7"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme8" class="img mr oldTheme8"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme10" class="img oldTheme9"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme9" class="bigImg mr mt oldTheme10"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme11" class="img mb mt oldTheme11"><div class="checked"></div></div>'
                    +'<div themeVal="oldTheme12" class="img oldTheme12"><div class="checked"></div></div>'
                    +'</div>'
                    +'</div>'
                    +'<div role="tabpanel" class="tab-pane" id="newTheme12">'
                    +'<div class="th_l">'
                    +'<div themeVal="teacher" class="bigImg mr mb teacher"><div class="checked"></div></div>'
                    +'<div themeVal="student" class="img mb student"><div class="checked"></div></div>'
                    +'<div themeVal="style3" class="img mb style3"><div class="checked"></div></div>'
                    +'<div themeVal="style4" class="img mr style4"><div class="checked"></div></div>'
                    +'<div themeVal="style5" class="img mr style5"><div class="checked"></div></div>'
                    +'<div themeVal="style6" class="img style6"><div class="checked"></div></div>'
                    +'</div>'
                    +'<div class="th_r">'
                    +'<div themeVal="style7" class="img mr style7"><div class="checked"></div></div>'
                    +'<div themeVal="style8" class="img mr style8"><div class="checked"></div></div>'
                    +'<div themeVal="style9" class="img style9"><div class="checked"></div></div>'
                    +'<div themeVal="style10" class="bigImg mr mt style10"><div class="checked"></div></div>'
                    +'<div themeVal="style11" class="img mb mt style11"><div class="checked"></div></div>'
                    +'<div themeVal="style12" class="img style12"><div class="checked"></div></div>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'<div class="rightTh '+theThemeId+'"><div class="rightThBg"></div></div>'
                    +'</div>'
                    +'</div>';
            }else{
                html += '<ul class="dropdown-menu" role="menu" id="change_theme_ul">'
                    +'<li themeVal=\'teacher\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat 0px 0px;"></div><input type="hidden" value="teacher"/><span><input type="radio" name="themeId" class="ischeck"/>蓝色风格</span></a></li>'
                    +'<li themeVal=\'student\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -120px 0px;"></div><input type="hidden" value="student"/><span><input type="radio" name="themeId" class="ischeck"/>红色风格</span></a></li>'
                    +'<li themeVal=\'style3\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -240px 0px;"></div><input type="hidden"  value="style3"/><span><input type="radio" name="themeId" class="ischeck"/>橙色风格</span></a></li>'
                    +'<li themeVal=\'style4\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -360px 0px;"></div><input type="hidden"  value="style4"/><span><input type="radio" name="themeId" class="ischeck"/>青色风格</span></a></li>'
                    +'<li themeVal=\'style5\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -480px 0px;"></div><input type="hidden"  value="style5"/><span><input type="radio" name="themeId" class="ischeck"/>黄色风格</span></a></li>'
                    +'<li themeVal=\'style6\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -600px 0px;"></div><input type="hidden"  value="style6"/><span><input type="radio" name="themeId" class="ischeck"/>暗色风格</span></a></li>'
                    +'<li themeVal=\'style7\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat 0px -120px;"></div><input type="hidden"  value="style7"/><span><input type="radio" name="themeId" class="ischeck"/>浅绿风格</span></a></li>'
                    +'<li themeVal=\'style8\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -120px -120px;"></div><input type="hidden"  value="style8"/><span><input type="radio" name="themeId" class="ischeck"/>金色风格</span></a></li>'
                    +'<li themeVal=\'style9\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -240px -120px;"></div><input type="hidden"  value="style9"/><span><input type="radio" name="themeId" class="ischeck"/>米色风格</span></a></li>'
                    +'<li themeVal=\'style10\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -360px -120px;"></div><input type="hidden"  value="style10"/><span><input type="radio" name="themeId" class="ischeck"/>粉色风格</span></a></li>'
                    +'<li themeVal=\'style11\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -485px -120px;"></div><input type="hidden"  value="style11"/><span><input type="radio" name="themeId" class="ischeck"/>蓝灰风格</span></a></li>'
                    +'<li themeVal=\'style12\'><a href="javascript:void(0);"><div style="width:121px;height:121px;background:url('+that.path+'/images/space/main/theme_org.png) no-repeat -615px -120px;"></div><input type="hidden"  value="style12"/><span><input type="radio" name="themeId" class="ischeck"/>彩色风格</span></a></li>'
                    +'</ul>';
            }
            html += "</div>";
        $("#change_theme_ul_V2").off("click");
        $("#change_theme_ul_V2").live("click",function(){
            return false;
        });
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.theme",html);
        if(!(that.personInfo.bidentity_id >= 100 && that.personInfo.bidentity_id < 105)) {
            $("div[themeVal='" + theThemeId + "'] .checked").addClass("active");
        }else{
            $("li[themeVal='" + theThemeId + "'] .ischeck").attr("checked",true);
        }

        $(".space_top_nav").find(".theme [themeVal]").click(function(){
            var thisThemeVal = $(this).attr("themeVal");
            $.ajax({
                type : "GET",
                async : false,
                data:{"random_num":creatRandomNum(),
                    "theme_json":"{\"theme\":\""+thisThemeVal+"\"}",
                    "person_id":that.personInfo.bperson_id,
                    "identity_id":that.personInfo.bidentity_id},
                url : url_path_action + "/space/setSpaceThemeInfo",
                dataType: "json",
                success : function(data) {
                    if(data.success){
                        that.themeId = thisThemeVal;
                        if(that.setting.body) {
                            $("body").attr("themeVal", that.themeId);
                            $("body").attr("themeType", (!(that.personInfo.bidentity_id >= 100 && that.personInfo.bidentity_id < 105)) ? "person" : "org");
                        }
                        if(!(that.personInfo.bidentity_id >= 100 && that.personInfo.bidentity_id < 105)) {
                            $("[themeVal] .checked").removeClass("active");
                            $("div[themeVal='" + thisThemeVal + "'] .checked").addClass("active");
                        }else{
                            $("li[themeVal='" + thisThemeVal + "'] .ischeck").attr("checked",true);
                        }
                    }else{
                        dialogOk("保存异常");
                    }
                },
                error: function(){
                    dialogOk("保存异常");
                }
            });
        });
        $("#change_theme_ul_V2 .nav a").click(function (e) {
            e.preventDefault();
            $(this).tab('show');
            $(this).closest(".dropdown").removeClass("active");
            return false;
        });
        $("#change_theme_ul_V2 .tab-content .tab-pane>div>div").hover(function () {
            $("#change_theme_ul_V2 .theme100 .rightTh").attr("class","rightTh "+$(this).attr("themeVal"));
        },function(){
            $("#change_theme_ul_V2 .theme100 .rightTh").attr("class","rightTh "+that.themeId);
        });
    };
    CommonInfo.prototype.open = function(keyName){
        var html = "",that=this;
        if(that.personInfo.bidentity_id<100){
            html += "<div class='open'>" +
                "<a target='_blank' href='"+that.path+"/html/space/main/main.html?to_open=0'>公开空间预览</a>";
            html += "</div>";
        }
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.open",html);
    };
    CommonInfo.prototype.manage = function(keyName){
        var html = "",that=this;
      
        html += "<div class='manage'>" +
            "<a target='_blank' href='" + that.path + "/html/social/main_set/main_set.html?space_type=2&orgid="+that.personInfo.bperson_id+"&iid="+that.personInfo.bidentity_id+"'>空间管理</a>";
        html += "</div>"; 
       
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.manage",html);
    };

    CommonInfo.prototype.select = function(keyName) {
        var html = "",that=this;
        html += "<div class='select dropdown'>" +
            "<div id='space_select_by_sort' class='dropdown-toggle' data-toggle='dropdown'>" +
                "<div class='sort'>" +
                    "<div class='sort_select' data-value='5'>" +
                        "<span>搜工作室</span>" +
                    "</div>" +
                "</div>" +
                "<div class='select_input'>" +
                "<input class='select_input' type='text'/>" +
                "</div>" +
            "</div>"+
            "<div class='dropdown-menu select_info' role='menu'>" +
            "" +
            "</div>";
        html += "</div>";

        that.putHtml(keyName,".space_top_nav>." + keyName + ">.select",html);

        $(".space_top_nav .select").bind("click",function(){
            if($(".space_top_nav .select").hasClass("open")){
                return false;
            }
            if($(".space_top_nav .select input").val().length == 0){
                return false;
            }
        });
        var spaceSearchInterval;
        $(".space_top_nav .select input").bind("mouseup keyup",function(){
            clearInterval(spaceSearchInterval);
            spaceSearchInterval = setInterval(function(){
                clearInterval(spaceSearchInterval);
                $(".space_top_nav .select .sort_select_val").hide();
                if($(".space_top_nav .select input").val().length == 0){
                    return false;
                }
                var sel_identity_id = ($(".space_top_nav .select .sort_select").attr("data-value"));
                that.spaceSelectFunction(sel_identity_id,1);
            },500);
        });
        $(".space_top_nav .select .sort_select").click(function(){
            $(".space_top_nav .select .sort_select_val").toggle();
            return false;
        });
        $("body").click(function(){$(".space_top_nav .select .sort_select_val").hide();});
        $(".space_top_nav .select .sort_select_val > div").click(function(){
            $(".space_top_nav .select .sort_select").attr("data-value",$(this).attr("value"));
            $(".space_top_nav .select .sort_select > span").html($(this).html());
            $(".space_top_nav .select .sort_select_val").hide();
            $(".space_top_nav .select input").trigger("mouseup");
            return false;
        });
    };
    CommonInfo.prototype.spaceSelectFunction = function(sel_identity_id,page){
        if(!$(".space_top_nav .select").hasClass("open")){
            $(".space_top_nav .select").addClass("open");
        }
        var html = "",list_size = 0,totalpage = 0,that=this;
        html = "<div class='select_list'>";
        
        $.ajax({
            type: "GET",
            async: false,
            data: {"random_num": creatRandomNum(),
                "keyWord":(Base64.encode($(".space_top_nav .select input").val())),
                "pageNumber": page,
                "pageSize": 5,
                "group_type": 2,
                "plat_type":10
            },
            url: url_path_action_login + "/group/queryGroup",
            dataType: "json",
            success: function (data) {
                if(data.success){
                    //console.log(JSON.stringify(data.rows));
                    list_size = data.rows.length;
                    totalpage = data.totalPage;
                    if(data.rows.length == 0){
                        html += "<div style='width: 100%;height: 100px;line-height: 100px;text-align: center;'>未查询到数据</div>";
                    }else{
                        html += "<div class='datalist'>" +
                            "<div class='org'>群组名</div>" +
                            "<div class='name'>创建者</div>" +
                            "</div>";
                    }

                    for(var i = 0;i < data.rows.length;i++) {
                        html += "<div class='datalist' data-link='" + that.path + "/yx/html/space/main/work.html?orgid="+ data.rows[i].ID +"&iid=106'>" +
                            "<div class='org textEllipsis' title='"+data.rows[i].GROUP_NAME+"'>"+data.rows[i].GROUP_NAME+"</div>" +
                            "<div class='name textEllipsis' title='"+data.rows[i].CREATOR_NAME+"'>"+data.rows[i].CREATOR_NAME+"</div>" +
                            "</div>";
                    }
                }else{

                }
            },error:function(){

            }
        });
    
        //console.log(page + "||" + totalpage);
        if(list_size > 0){
            html += "<div class='select_page'>" +
                "<div class='lgt'>";
                if(page > 1){
                    html += "<span data-page='"+(page-1)+"'><<</span>";
                }
            html += "</div>" +
                "<div class='mgt'>第"+page+"页 共"+ totalpage +"页</div>" +
                "<div class='rgt'>";
            if(page < totalpage){
                html += "<span data-page='"+(page-0+1)+"'>>></span>";
            }
            html += "</div>" +
                "</div>";
        }

        html += "</div>";
        $(".space_top_nav .select .select_info").html(html);

        $(".space_top_nav .select .select_page span").bind("click",function(){
            that.spaceSelectFunction(sel_identity_id,$(this).attr("data-page"));
        });
        $(".space_top_nav .select .select_info .datalist[data-link]").bind("click",function(){
            window.open($(this).attr("data-link"));
        });
    };
    CommonInfo.prototype.message = function(keyName){
        var html = "",that=this;

        html += "<div class='message'>" +
            "<a href='javascript:void(0);'>消息<span class='msg_span'>0</span>";
        html += "</a>";
        html += "<div class='messages_box dropdown-menu' role='menu'>";

        $(".space_top_nav").off("click",".message");
        $("#deleteAllshenqingMsgPage").live("click",function(){
            art.dialog(
                {
                    lock:true,
                    icon: 'question',
                    title: '提示',
                    content: '确定清空消息吗？'
                },function(){
                    $.ajax({
                        type : "POST",
                        async : false,
                        data:{"random_num":creatRandomNum(),
                            "person_id":that.personInfo.person_id,
                            "identity_id":that.personInfo.identity_id
                        },
                        url : url_path_action + "/space/message/clear_message",
                        dataType: "json",
                        success : function(data) {
                            if(data.success){
                                art.dialog(
                                    {
                                        lock:true,
                                        icon: 'question',
                                        title: '提示',
                                        content: '已清理消息。',
                                        time:2,
                                        close:function(){
                                            that.spaceMessageArt.close();
                                        }
                                    }
                                );
                            }else{
                                art.dialog(
                                    {
                                        lock:true,
                                        icon: 'question',
                                        title: '提示',
                                        content: '已清理消息。',
                                        time:2
                                    }
                                );
                            }
                        },error:function(){
                            art.dialog(
                                {
                                    lock:true,
                                    icon: 'question',
                                    title: '提示',
                                    content: '已清理消息。',
                                    time:2
                                }
                            );
                        }
                    });
                },function(){

                }
            );
        });
        $(".space_top_nav").on("click",".message",function(){

            that.spaceMessageArt = art.dialog(
                {
                    width: 800,
                    height: 460,
                    lock:true,
                    icon: null,
                    title: '消息',
                    padding: "0 15px",
                    //style:'succeed noClose',
                    init:function(){

                    },
                    close:function(){
                        that.message("right");
                    }
                }
            );
            that.getAllMessageList(1);
        });

        html += "</div>";
        html += "</div>";
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.message",html);
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "person_id":that.personInfo.person_id,
                "identity_id":that.personInfo.identity_id
            },
            url : url_path_action + "/space/message/get_prompt_message",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    $(".space_top_nav .message .msg_span").html(data.message_number);
                }
            }
        });
        /*
        setInterval(function(){
            $.ajax({
                type : "GET",
                async : false,
                data:{"random_num":creatRandomNum(),
                    "person_id":that.personInfo.person_id,
                    "identity_id":that.personInfo.identity_id
                },
                url : url_path_action + "/space/message/get_prompt_message",
                dataType: "json",
                success : function(data) {
                    if(data.success){
                        $(".space_top_nav .message .msg_span").html(data.message_number);
                    }
                }
            });
        },20000);
        */
    };
    CommonInfo.prototype.getAllMessageList = function (pagenum){
        var that=this,messageInfo={};
        messageInfo = that.getMessageList(pagenum,10);
        var html_ = "<div class='getAllshenqingMsg'>";
        $(messageInfo.list).each(function(i){
            html_ += "<div class='messagesa'>"
                + getSpaceDictionaryMessage(messageInfo.list[i])
                +"</div>";
        });
        if(!(messageInfo.list.length > 0)){
            html_ += "<div style='text-align: center;height: 200px;line-height: 200px;'>没有最新消息。</div>";
        }
        html_ += "<button type='button' class='btn btn-primary btn-sm' id='deleteAllshenqingMsgPage'>清空</button>";
        html_ += "<div id='allshenqingMsgPage'></div>";
        html_ += "</div>";
        that.spaceMessageArt.content(html_);
        loadScripts(["/dsideal_yy/js/space/tools/spacePage.js"], 0, function() {
            $("#allshenqingMsgPage").spacePage({
                pageSize: messageInfo.page_size,
                pageNumber: messageInfo.page_number,
                totalPage: messageInfo.total_page,
                totalRow: messageInfo.total_row,
                callBack: function (pagenum) {
                    that.getAllMessageList(pagenum);
                }
            });
        });

    };
    CommonInfo.prototype.getMessageList = function (pagenum,pagesize){
        var that = this,messageInfo={};
        $.ajax({
            type : "GET",
            async : false,
            data:{"random_num":creatRandomNum(),
                "person_id":that.personInfo.person_id,
                "identity_id":that.personInfo.identity_id,
                "page_number":pagenum,
                "page_size":pagesize
            },
            url : url_path_action + "/space/message/get_message",
            dataType: "json",
            success : function(data) {
                if(data.success){
                    messageInfo = data;
                    messageInfo.success = true;
                }else{
                    messageInfo.success = false;
                    messageInfo.list = [];
                }
            },
            error : function(){
                messageInfo.success = false;
                messageInfo.list = [];
            }
        });
        return messageInfo;
    };
    CommonInfo.prototype.person = function(keyName){
        var html = "",defaultOrgId,defaultOrgIid,data_,that = this;
            html += "<div class='person dropdown'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" + $.cookie("person_name");
            html += "<span class='caret'></span></a>";
            html += "<ul id='dropdown_to_where' class='dropdown-menu' role='menu'>";

            if($.cookie("ydrz") != 1) {
                html += '<li><a href="javascript:doLogout();">退出</a></li>';
            }
            html += "</div>";
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.person",html);

    };
    CommonInfo.prototype.viewSpace = function(keyName){
        var html = "",defaultOrgId,defaultOrgIid,data_,that = this,space_name_,space_name;
            if(that.personInfo.bidentity_id < 100){
                space_name = Base64.decode(person_info_.space_name);
            }else{
                space_name = Base64.decode(org_info_.org_name);
            }
            if(space_name.length > 8){
                space_name_ = space_name.substr(0,8)+"...";
            }else{
                space_name_ = space_name;
            }
            html += "<div class='viewSpace dropdown' title='"+space_name+"'>" +
                "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" + space_name_;
            html += "&nbsp;&nbsp;<span class='back'><img src='../../../images/space/sec/location.png'/></span></a>";
            html += "</div>";
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.viewSpace",html);
    };
    CommonInfo.prototype.login = function(keyName){
        var html = "",that = this;

        html += "<div class='login'>" +
                "<a href='javascript:void(0);'>登录</a>"+
                "</div>";
        that.putHtml(keyName,".space_top_nav>." + keyName + ">.login",html);
        $(that.ele).find(".space_top_nav>.right>.login").click(function(){
            var html = '<form role="form" id="login_form">'+
                '<div class="form-group">'+
                '<h3>用户登录</h3>'+
                '</div>'+
                '<div class="form-group">'+
                '<input placeholder="用户名" class="form-control" id="user" name="user" value="" onkeyup="value=value.replace(/[\W]/g, \'\')" onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[\W]/g, \'\')) " type="text">'+
                '<ul id="per_ul" style="display: none;background: #ffffff;width:206px;" class="user-ul user-ulc"></ul>'+
                '</div>'+
                '<div class="form-group form-group-input">'+
                '<input placeholder="密码" class="form-control" id="pwd" name="pwd" value="" onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[\W]/g, \'\')) " type="password">'+
                '</div>'+
                '<span id="log_error" class="pull-right" style="visibility: hidden; font-size:12px;color:red;margin-top:-15px;height: 30px;">&nbsp;</span>'+
                '<div class="form-group">'+
                '<button type="button" class="btn bl space-btn-primary" onclick="javascript:doLogin();" style="font-weight:bold;font-size:15px !important;">登&nbsp;&nbsp;&nbsp;录</button>'+
                '</div>'+
                '</form>'
            art.dialog({
                content:html,
                width: 300,
                lock:true,
                zIndex:9999,
                title: '用户登录',
                style:'succeed noClose',
                init:function(){
                    $("#pwd").keyup(function(event){
                        if(event.keyCode == 13) {
                            event.returnValue=false;
                            event.cancel = true;
                            doLogin();
                        }
                    });
                }
            });
        });
    };
    CommonInfo.prototype.getThemeId = function(){
        var that = this;
        if (that.themeId) {
            return that.themeId;
        }else{
            $.ajax({
                type: "GET",
                async: false,
                data: {"random_num": creatRandomNum(),
                    "person_id": that.personInfo.bperson_id,
                    "identity_id": that.personInfo.bidentity_id},
                url: url_path_action_login + "/space/getSpaceThemeInfo",
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        that.themeId = data.theme_json.theme;
                    }else{
                    	if(that.personInfo.bidentity_id == 5){
							that.themeId = "oldTheme9";
						}else if(that.personInfo.bidentity_id == 6){
							that.themeId = "oldTheme6";
						}else if(that.personInfo.bidentity_id == 7){
							that.themeId = "oldTheme12";
						}else{
							that.themeId = "teacher";
						}
                    }
                },
                error: function(){
                    that.themeId = "teacher";
                }
            });
            return that.themeId;
        }
    };
    CommonInfo.prototype.putHtml = function(key,className,html){
        var that = this;
        if ($(that.ele).find(className).length) {
            $(that.ele).find(className).replaceWith(html);
        } else {
            $(that.ele).find("."+key).append(html);
        }
    };
    $.fn.loadSpaceCommon=function(options){
        new CommonInfo(this,options?options:{});
    };
    $.fn.loadSpaceCommon.constructor = CommonInfo;

}(jQuery);