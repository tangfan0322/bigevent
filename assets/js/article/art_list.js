$(function() {
    var form=layui.form;
    var layer=layui.layer
    var laypage=layui.laypage
    var q={
        pagenum:1,//页码值
        pagesize:2,//每页显示几条数据
        cate_id:'',//文章的id
        state:''//文章的状态
    }
    initTable();
    //1.调用接口，获取表格数据，并且利用模板引擎进行渲染
    function initTable() {
        $.ajax({
            method:'get',
            url:'/my/article/list',
            data:q,
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                layer.msg('获取文章列表成功')
                var htmlStr=template('tpl-table',res);
                $('#tb').html(htmlStr);
                //页面表格渲染成功之后，需要出现分页，所以调用分页
                renderPage(res.total)
            }
        })
    }

    //定义一个美化时间上午过滤器
    function getInteger(n) {
       return n > 9 ? n:'0'+n
    }
    template.defaults.imports.dataFormat=function(data) {
       var dt=new Date(data)
       var year=dt.getFullYear();
       var month=getInteger(dt.getMonth()+1)
       var day=getInteger(dt.getDate())
       var h=getInteger(dt.getHours())
       var m=getInteger(dt.getMinutes())
       var s=getInteger(dt.getSeconds())
       return year +'-' +month +'-' +day +'\t' +h +':'+m+':'+s
    }
    initCate();
    //实现下拉框自动获取分类名称
    function initCate() {
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr=template('select_demo',res)
                $('#city').html(htmlStr)
                 // 通过 layui 重新渲染表单区域的UI结构
                 form.render()
            }
        })
    }

    //2.实现筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        var cate_id=$('[name=cate_id]').val()
        var state=$('[name=state]').val()
        q.cate_id=cate_id;
        q.state=state;
        initTable()
    });
    
    //3.利用layui插件来渲染分页，laypage.render(options) 来设置基础参数
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox',
            count: total ,//数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            limits:[2, 3, 5, 10],
            layout:['count','limit','prev', 'page', 'next','skip'],
            jump: function(obj, first){
              //obj包含了当前分页的所有参数，比如：
            //   console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            //   console.log(obj.limit); //得到每页显示的条数
              q.pagenum=obj.curr
              q.pagesize = obj.limit
              //首次不执行
              if(!first){
                //do something
                initTable()
              }
            }
          });
    }

    //4.实现删除按钮的功能，提交表单数据，渲染表格
    $("body").on("click","#btn-delete", function () {
        var id=$(this).attr('data-id')
        // 获取删除按钮的个数
        var len=$('#btn-delete').length
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                  if (res.status !== 0) {
                    return layer.msg('删除文章失败！')
                  }
                  layer.msg('删除文章成功！')
                //   但数据删除完成后，需要判断当前页是否还有剩余的数据，则让页码值减一后再渲染表格
                if(len === 1) {
                //    删除按钮只有一个，当删除之后就没数据了，让页码值减一后渲染表格
                q.pagenum=q.pagenum===1 ? 1:q.pagenum-1
                }
                  initTable()
                }
                })
            layer.close(index);
          });
    });

    //5.实现点击编辑，实现跳转



// //     var fd=new FormData()
//     $("body").on("click","#Editbtn", function () {
//        var id=$(this).attr('data-id')
//        console.log(id);
       
//         $.ajax({
//             method:'GET',
//             url:'/my/article/'+id,
//             success:function(res) {
//                 console.log(res)
//                 // if(res.status !==0) {
//                 //     return layer.msg('获取文章失败')
//                 // }
//                 // fd.append('fdata',res.data)
//                 // console.log(fd);                
//                 // var fd=new FormData()
//                 // fd.append('res',res)
//                 // console.log(fd);
//                 // form.val('form_tab',res.data)
                
//             }
//         })
//     });
// //   表单提交修改后的数据
//     $("#form-pub").on("submit", function (e) {
//         e.preventDefault()
//         // 利用formData获取参数
        
//             $.ajax({
//                 method:'POST',
//                 url:'/my/article/edit',
//                 data:fd,
//                 contentType:false,
//                 processData:false,
//                 success:function(res) {
//                    if(res.status !==0) {
//                        return layer.msg('更新文章失败')
//                    }
//                    layer.msg('更新文章成功')
//                 }
//             })
        
//   })
    }); 
