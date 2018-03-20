#v3.0.13#
gulp uglify-js-all时，压缩问题处理
#v3.0.11#
gulp watcher时，对于common目录下注入失败的问题处理
#v3.0.8#
将html模板文件重新规范名，在html前面增加.tpl以区分注入后的html文件。如下：
template file: *.tpl.html
inject file: *.html
修改已知问题


#v3.0.0版本规划#
一.3.0.0版本应该简化config的配置文件，配置文件中只配置合并压缩处理的文件即可，单独的文件应不需要在在进行配置
二.增加js和css全部压缩的功能




#v2.0.0#
gulp-web自动化前端工具

在0.0.1的基础上进行了升级，内部是es5的class重写了所有的方法，代码更简洁，更内聚。


#0.0.1#
gulp-web是自动化前端工具

gulp watcher [--min] 监听工程下的html css js文件，当这些文件有变化后，工具会自动执行一下命令来构建项目

#js文件处理#
gulp uglify-js--path jh/jhAdd.js 压缩指定的一个js文件

gulp uglify-jsconfig  根据jsConfig来压缩js文件

gulp uglify-js-all 压缩所有的js文件

#css文件处理#
gulp uglify-css --path bootstrap/bootstrap.css 压缩指定的css文件

gulp uglify-css-config 根据cssConfig来压缩css文件

gulp uglify-css-all 压缩所有的css文件

#html文件处理#

gulp tpl --path index.html 在html页面中注入需要的js,css和共用html文件
gulp tpl --path index.html --min 在html页面中注入需要的js,css和共用的html文件， 以压缩文件注入

gulp tpl-all 批量注入html目录下的所有html文件，以源文件的形式注入（js,css）

gulp tpl-all --min 批量注入html目录下的所有html文件，以压缩文件的形式注入（js,css）



