// Chinese (China) (zh_CN)
if(typeof(fileNameLength) == "undefined"){
	var fileNameLength = 100;
}

plupload.addI18n({"Stop Upload":"停止上传","Upload URL might be wrong or doesn't exist.":"由于当前网络不稳定导致上传失败，请稍后重试。","tb":"tb","Size":"大小","Close":"关闭","Init error.":"初始化错误。","Add files to the upload queue and click the start button.":"（将文件添加到上传队列，然后点击“开始上传”按钮）","Filename":"文件名","Image format either wrong or not supported.":"图片格式错误或者不支持。","Status":"状态","HTTP Error.":"HTTP 错误。","Start Upload":"开始上传","mb":"mb","kb":"kb","Duplicate file error.":"重复文件错误。","File size error.":"您选择的文件过大，网页端暂不支持上传。","N/A":"N/A","gb":"gb","Error: Invalid file extension:":"错误：无效的文件扩展名:","Select files":"超过200M的文件清选择 <a href='javascript:uploadBigFile();' style='color:red;font-weight:bold'>客户端上传</a>","%s already present in the queue.":"%s 已经在当前队列里。","File: %s":"文件: %s","b":"b","Uploaded %d/%d files":"已上传 %d/%d 个文件","Upload element accepts only %d file(s) at a time. Extra files were stripped.":"每次只接受同时上传 %d 个文件，多余的文件将会被删除。","%d files queued":"添加文件(已有%d 个)","File: %s, size: %d, max file size: %d":"文件: %s, 大小: %d, 最大文件大小: %d","Drag files here.":"把文件拖到这里。","Runtime ran out of available memory.":"运行时已消耗所有可用内存。","File count error.":"文件数量错误。","File extension error.":"您上传的文件扩展名不符合要求，请重新选择。","Error: File too large:":"错误: 文件太大:","Add Files":"增加文件","Filename too long.":"文件名最多支持"+fileNameLength+"个字符。"});
function uploadApp(){
	callClient();
}