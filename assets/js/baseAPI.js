
//每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options){

  
  //在发起真正的ajax请求之前，统一拼接请求的根路径，后台返回的地址
  options.url = 'http://www.liulongbin.top:3007' + options.url
  console.log(options.url);
  //统一为有权限的接口，设置headers请求头   headers就是请求头配置对象
  if(options.url.indexOf('/my/') !== -1){
    options.headers = {  //在浏览器network里面的headers，发送到服务器
      Authorization:localStorage.getItem('token') || '' //获取本地存储的token值,没有token值就返回空认证失败
    }  //有权限授权 ：读本地存储里面的token(登录成功之后服务器返回的token)
 //token验证my开头的接口
 
}
//  console.log(options);
  //全局统一执行complete回调函数
  //complete是option后台返回的一个对象
  options.complete = function(res){
    // console.log('执行了 complete 回调：')
    console.log(res)
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
      //1.强制清空token
      localStorage.removeItem('token')
      //2.强制跳转到登录页面
      location.href = '/login.html'
    }
  }
})