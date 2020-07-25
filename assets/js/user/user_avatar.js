$(function() {
    var layer=layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 1.3 创建裁剪区域
  $image.cropper(options)

  //实现点击上传按钮，可以上传文件
  $("#btnChooseImage").on("click", function () {
      $('#file').click();//调用文件选择框的上传方法
  });

  //更换裁剪区域的图片,给文件选择框绑定change事件
  $("#file").on("change", function (e) {
      var fileslist=e.target.files
      if(fileslist.length === 0) {
          return layer.msg('请上传一张图片')
      }
      //拿到文件之后
        // 1. 拿到用户选择的文件
    var file = e.target.files[0]
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
    // 3. 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  });

  //点击确定按钮，实现文件上传，调用接口
  $("#btnUpload").on("click", function () {
       // 1. 要拿到用户裁剪之后的头像
    var dataURL = $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100
    })
    .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
        method:'POST',
        url:'/my/update/avatar',
        data:{
            avatar: dataURL
          },
        success:function(res) {
            if(res.status !== 0) {
                return layer.msg('上传头像失败')
            }
            layer.msg('头像上传成功');
            window.parent.getMsg();
        }
    })
  });
})