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
    // dropBox()
    
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
    var form=layui.form
     var $Id = new URLSearchParams(location.search).get("Id");
      console.log($Id);
         $.ajax({
             method:'GET',
             url:'/my/article/'+$Id,
             success:function(res) {
                //  console.log(res);
                 if(res.status !==0) {
                     return layer.msg('获取文章失败')
                 }
                 form.val('art_edit',res.data);//这里只是把得到的数据进行表单的填充，在发起表单提交的时候并没有把数据 
                 console.log(res.data.cate_id);
                 dropBox(res.data.cate_id)
             }
         })
  // 渲染下拉框中的内容
  
  function dropBox(currentCateId = "") {
      $.ajax({
          method:'get',
          url:'/my/article/cates',
          success:function(res) {
              if(res.status !== 0) {
                  return layer.msg('获取分类数据失败')
              }
              res.currentCateId = currentCateId
              var htmlStr=template('selectTab',res)
            //   $('#city').html(htmlStr)
            $("[name=cate_id]").html(htmlStr);
              form.render()
          }
      })
  }

        var art_state='已发布'
        $("#saveDraft").on("click", function () {
            art_state='草稿'
        });
        //给表单注册提交事件
        $("#form-pub").on("submit", function (e) {
            e.preventDefault()
            var fd=new FormData($(this)[0])
            fd.append("Id", $Id);
            fd.append('state',art_state)
            $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
              width: 400,
              height: 280
             })
             .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
             fd.append('cover_img',blob)
          //    发起ajax请求
          EditArticle(fd)
        })
        });
  function EditArticle(fd) {
      $.ajax({
          method:'POST',
          url:'/my/article/edit',
          data:fd,
          contentType:false,
          processData:false,
          success:function(res) {
              console.log(res);
              if(res.status !== 0) {
                  return layer.msg('更新文章失败')
              }
              layer.msg('更新文章成功')
               location.href='/article/art_list.html'
          }
      })
  }
})