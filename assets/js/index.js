// $(function(){
// })
$(()=>{
//调用getUserInfo()获取用户的基本信息
getUserInfo()

var layer = layui.layer 
//给退出按钮绑定退出功能
$('#btn_ogout').on('click',function(){
  //提示用户是否确认退出
  layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
  //1.清空本地存储中的token
  localStorage.removeItem('token')
  //2.重新跳转到登录页面
  location.href = '/login.html'
  //关闭询问框
    layer.close(index);

})

})
})
//请求获取用户的基本信息,向服务器请求
function getUserInfo(){
  $.ajax({
    method:'GET',
    url:'/my/userinfo',
    success:function(res){
      // console.log(res);
      if(res.status !== 0){
        return layui.layer.msg('获取用户信息失败!')
      }
      //调用renderAvatar()渲染用户头像
      renderAvatar(res.data) //后台返回的data属性，传给user形参
      // console.log(res);      
    }
  })
}
// 渲染用户的头像
function renderAvatar(user){ //后台返回的data数据
  //1.获取用户名,有优先级，如果有昵称就显示昵称，没有昵称显示用户登录名
  var name = user.nickname || user.username
  //2. 设置欢迎的文本 欢迎+两个空格+昵称或登录名
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if(user.user_pic !== null){ //后台返回的user里面的user_pic头像
      //3.1渲染图片头像
      $('.layui-nav-img').attr('src',user.user_pic).show()
      $('.text-avatar').hide()
    }else{
      //3.2渲染文本头像 图片头像隐藏，文本头像是登录名的第一个字母转成大写
      $('.layui-nav-img').hide()
       var first = name[0].toUpperCase()
       $('.text-avatar').html(first).show()
    }
}