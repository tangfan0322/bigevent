$.ajaxPrefilter(function(options) {
    //在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url='http://ajax.frontend.itheima.net'+options.url
 })