!function($){
    "use strict"
    var Page = function(ele,opts){
        this.ele = ele;
        this.pageSize=opts.pageSize;
        this.pageNumber=opts.pageNumber;
        this.totalPage=opts.totalPage;
        this.totalRow=opts.totalRow;
        this.callBack=opts.callBack;
        this.init();
    }
    Page.prototype.init = function(){
        var that = this,html="",thisPage = that.pageNumber,totalPage = that.totalPage;
        thisPage = thisPage -0;
        totalPage = totalPage -0;
        that.totalRow = that.totalRow -0;
        if(!thisPage || !totalPage || !that.totalRow || thisPage <= 0 || totalPage <= 0 || that.totalRow <= 0){
            $(that.ele).empty();
            return false;
        }
        thisPage<1?1:thisPage;
        html += '<div class="spacePage" style="padding: 5px 10px;">';
        if (thisPage - 1 < 1) {
            html += '<button class="btn btn-link firstPage" disabled="true" style="padding: 6px;color: #888888;">首页</button>';
            html += '<button class="btn btn-link prevPage" disabled="true" style="padding: 6px;color: #888888;">上一页</button>';
        } else {
            html += '<button class="btn btn-link firstPage" style="padding: 6px;text-decoration: none;">首页</button>';
            html += '<button class="btn btn-link prevPage" style="padding: 6px;text-decoration: none;">上一页</button>';
        }
        if(thisPage != 1) {
            html += '&nbsp;<button class="btn ' + (thisPage == 1 ? 'btn-primary' : 'btn-default numPage') + ' btn-sm" style="'+(thisPage == 1 ? '' : 'color: #428bca;')+'">1</button>';
        }
        if(thisPage>3){
            html += '&nbsp;<button class="btn btn-link" style="padding: 6px;text-decoration: none;">...</button>';
        }
        if (totalPage > thisPage + 1) {
            //10-7----this.page + 2
            var endPage = thisPage + 1;
        } else {
            var endPage = totalPage;
        }

        for (var i = thisPage - 1; i <= endPage; i++) {
            if (i > 0) {
                if (i == thisPage) {
                    html += '&nbsp;<button class="btn btn-primary btn-sm">'+i+'</button>';
                } else {
                    if (i != 1 && i != totalPage) {
                        html += '&nbsp;<button class="btn btn-default btn-sm numPage" style="color: #428bca;">'+i+'</button>';
                    }
                }
            }
        }

        if (thisPage + 3 <= totalPage){
            html += '&nbsp;<button class="btn btn-link" style="padding: 6px;text-decoration: none;">...</button>';
        }
        if (thisPage != totalPage){
            html += '&nbsp;<button class="btn btn-default btn-sm numPage" style="color: #428bca;">'+totalPage+'</button>';
        }

        html += '<button class="btn btn-link" style="padding: 6px;text-decoration: none;">'+thisPage+'&nbsp;/&nbsp;'+totalPage+'</span>';

        if (thisPage >= totalPage) {
            html += '<button class="btn btn-link" disabled="true" style="padding: 6px;color: #888888;">下一页</button>';
            html += '<button class="btn btn-link" disabled="true" style="padding: 6px;color: #888888;">尾页</button>';
        } else {
            html += '<button class="btn btn-link nextPage" style="padding: 6px;text-decoration: none;">下一页</button>';
            html += '<button class="btn btn-link endPage" style="padding: 6px;text-decoration: none;">尾页</button>';
        }
        html += '<span style="vertical-align: middle;color: #888">'+"共&nbsp;" + that.totalRow + "&nbsp;条&nbsp;&nbsp;每页&nbsp;"+ that.pageSize +'&nbsp;条</span>';
        html += "</div>";
        $(that.ele).html(html);
        $(that.ele).find(".numPage").click(function(){
            that.callBack($(this).text());
        });
        $(that.ele).find(".firstPage").click(function(){
            that.callBack(1);
        });
        $(that.ele).find(".prevPage").click(function(){
            that.callBack(thisPage-1);
        });
        $(that.ele).find(".nextPage").click(function(){
            that.callBack(thisPage+1);
        });
        $(that.ele).find(".endPage").click(function(){
            that.callBack(that.totalPage);
        });
    }
    $.fn.spacePage=function(options){
        new Page(this,options);
    }
    $.fn.spacePage.constructor = Page;
}(jQuery)