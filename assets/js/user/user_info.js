$(function() {
    var form=layui.form
    var layer=layui.layer
    //定义输入框的验证规则
    form.verify({
        nickname:function(value) {
            if(value.length >6) {
                return '昵称长度必须在1~6之间'
            }
        }
    })
    //获取用户的基本信息，并且渲染到表单
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                //快速位表单赋值form.val('赋值给哪个表单',值),通过lay-filter定义表单名
               form.val('formUserInfo',res.data)
            }
        })
    }
   
    //表单重置效果，点击重置，原始数据还原
    $("#btnReset").on("click", function (e) {
        e.preventDefault();//阻止重置按钮的默认行为
        initUserInfo();//重新调用接口并渲染表单
    });

    //提交表单，更新表单数据，调用接口
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功');
                //调用父页面中的方法，获取用户的基本信息
                window.parent.getMsg();//window代表iframe这个页面，需要调用父页面中的方法
            }
        })
    });
})