
(function($){
    "use strict"
    Array.prototype.loadTemplates = function (path,callback) {
        if(!path){
            console.log("loadTemplates缺少路径");
            return false;
        }
        loadTemToCallback(path,this,callback);
    };

    function loadTemToCallback(path,array,callback){
        if(array.length>0){
            $.get(path + array[0] + ".html", function(data){
                if($("#"+$(data).eq(0).attr("id")).length > 0){
                    callback();
                    return false;
                }
                $("body").append(data);
                array=array.slice(1);
                loadTemToCallback(path,array,callback);
            });
        }else{
            callback();
        }
    }

})(jQuery);