$(function() {
    var layer = layui.layer;
    var form=layui.form
        //1.调用接口，渲染表格数据,获取文章类别信息
        initArtCateList();
    function initArtCateList() {
         $.ajax({
           method:'GET',
           url:'/my/article/cates',
           success:function(res) {
              var htmlStr=template('category',res)
              $('#tb').html(htmlStr)
             }
         })
       }
    //2.给按钮添加点击事件，点击弹出提示框
    var indexAdd=null;
    $("#btnAddCate").on("click", function () {
     indexAdd=  layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
          });    
    });
    //3.新增文章分类，弹出层里面提交表单数据
    $('body').on("submit","#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('新增文章类别失败')
                }
                layer.msg('新增文章成功');
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    });
    //4.点击删除按钮，根据id删除文章分类,主要是通过定义标签的自定义属于来获取id值的
    $("tbody").on("click","#btnDelete", function () {
        var id=$(this).attr('data-id');
        $.ajax({
            method:'GET',
            url:'/my/article/deletecate/' + id,
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('删除分类失败')
                }
                layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
                   layer.msg('删除分类成功')
                    initArtCateList();
                    layer.close(index);
                  });
              
            }
        })
    });
    //编辑分类，通过点击编辑按钮，获取文章的id，进行表单提交
    var initEdit=null;
    $("tbody").on("click","#btnEdit", function () {
        initEdit=layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
          });
        var id=$(this).attr('data-id')  
       
        //发起请求，修改
        $.ajax({
            method:'get',
            url:'/my/article/cates/' + id,
            success:function(res) {
                form.val('form-edit', res.data)
                // console.log(res);
            }
        })  
    });

    //5.提交修改表单的数据，获取表单数据，调用接口，重新渲染页面
    $("body").on("submit", "#form-edit",function () {
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('修改文章信息失败')
                }
                layer.msg('修改文章信息成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    });
})