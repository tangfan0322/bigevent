$(function() {
    // 1.初始化富文本
    initEditor()
    //2.对于图片裁剪的操作
     // 2.1. 初始化图片裁剪器
    var $image = $('#image')
   // 2.2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 2.3. 初始化裁剪区域
  $image.cropper(options)
//3.给选择封面按钮注册文件上传功能
    $("#selectBtn").on("click", function () {
        $('#coverFile').click()
    });
    dropBox()
    // 渲染下拉框中的内容
    var form=layui.form
    function dropBox() {
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr=template('selectTab',res)
                $('#city').html(htmlStr)
                form.render()
            }
        })
    }
// 4.图片文件上传事件，需要把选择的图片渲染到img标签中
    $("#coverFile").on("change", function (e) {
        var files=e.target.files
        if(files.length === 0) {
            return
        }
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
         .cropper('destroy')      // 销毁旧的裁剪区域
         .attr('src', newImgURL)  // 重新设置图片路径
         .cropper(options)        // 重新初始化裁剪区域
    });
//5.所需参数中的文章状态，默认设为已发布
    var art_state='已发布'
    //给“存为草稿”按钮绑定点击事件，改变文章状态
    $("#saveDraft").on("click", function () {
        art_state='草稿'
    });
// 6.给表单绑定提交事件，利用formData传入参数，发起ajax请求
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        // 利用formData获取参数
        var fd=new FormData($(this)[0])
        fd.append('state',art_state)
     // 拿到用户裁剪的图片
        $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
       })
       .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
       fd.append('cover_img',blob)
    //    发起ajax请求
    publishArticle(fd)
  })
    });
    // 定义一个ajax请求函数
    function publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success:function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                  }
                  layer.msg('发布文章成功！')
                  // 发布文章成功后，跳转到文章列表页面
                  location.href = '/article/art_list.html'
                // 问题：点击切换到文章列表后，怎么让左侧的按钮也变颜色
            }
        })
    }
})