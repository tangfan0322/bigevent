$(function() {
  var layer=layui.layer;
  //获取用户的基本信息
  getMsg();
  //点击退出，实现页面跳转
  $(".btnLogout").on("click", function () {
    layer.confirm('确定退出?', {icon: 3, title:'提示'}, function(index){
     //退出之后情况本地存储
     localStorage.removeItem('token')
     //退出后跳转页面
      location.href='/login.html'
      layer.close(index);
    });
  });
    // 获取用户的基本信息
    function getMsg() {
      $.ajax({
        method:'GET',
        url:'/my/userinfo',
      //   headers:{
      //     Authorization:data
      //   },
        success:function(res) {
            if(res.status !== 0) {
              return 
            }
          //  console.log(res);
          //  获取姓名
           var name=res.data.nickname || res.data.username
           $('#welcome').html("欢迎 &nbsp;&nbsp;" +name)
          //  渲染头像
          if(res.data.user_pic) {
            $(".layui-nav-img").attr('src',res.data.user_pic).show();
            $('.text-avatar').hide()
          }else {
            $(".layui-nav-img").hide()
            $('.text-avatar').html(res.data.username[0].toUpperCase())
          }
        }
    })
   }
})