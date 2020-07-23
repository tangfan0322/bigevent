$(function () {
      // 点击“去注册账号”的链接
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })
//   表单元素的验证
var form=layui.form;//获取layui中的表单元素
var layer=layui.layer;
form.verify({
    // uname:[/^[\ue400-\u9fa5]{2,5}$/,'用户名必须是汉字'],
    pwd:[/[^\s]{6,12}$/,'密码必须是6到12位，且不能出现空格'],
    // 验证再次确认密码，判断两次密码是否输入一致
    repwd:function(value) {
  var pwd = $('.reg-box [name=password]').val()
  if(pwd !== value) {
      return '两次密码不一致！'
  }
    }
})

// 监听注销表单的提交事件
    $("#form_reg").on("submit", function (e) {
        e.preventDefault()
        var uname=$('#form_reg [name=uname]').val();
        var pwd=$('#form_reg [name=password]').val();
        $.post('/api/reguser',
              {
                 username:uname,
                  password:pwd
              },function(res) {
            if(res.status !==0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录');
            $('#link_login').click();
        })
    });

    // 监听登录的表单提交事件
    $("#form_login").submit(function (e) { 
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res) {
                console.log(res);
                if(res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功');
                // 将登录成功得到的token字符串保存到本地存储
                localStorage.setItem('token',res.token);
                // 登录成功之后跳转到首页
                location.href='/index.html'
            }
        })
        
    });
})