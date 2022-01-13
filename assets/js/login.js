$(function () {
 
  //点击去注册的链接,注册盒子隐藏，登录盒子显示
  $('#link_reg').on('click', function () {

    $('.login-box').hide()
    $('.reg-box').show()
  })

  //点击去登录的链接，登录盒子隐藏，注册盒子显示
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  //从layui中获取form属性
  var form = layui.form
  //从layui中获取弹出层样式
  var layer = layui.layer
  //通过form.verify()函数自定义校验规则
  form.verify({
    //自定义了一个叫pwd的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    //校验两次密码是否一样
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $('.reg-box [name=password]').val()  //后代选择器
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })
  //监听注册表单的提交事件
  $('#form_reg').on('submit',function(e){
    //1.阻止默认提交行为
    e.preventDefault()
    //2.发起ajax请求
    var data = {
      username:$('#form_reg [name=username]').val(),
      password:$('#form_reg [name=password]').val()
    }
    $.post('/api/reguser',data,function(res){
      if(res.status !== 0){
        // return console.log(res.message);
        //注册失败弹出
        return layer.msg(res.message)
        
      }
      // console.log('注册成功');
      layer.msg('注册成功，请登录!')
      //注册成功模拟点击行为(自动跳转)
      $('#link_login').click()
    })

  })

  //监听登陆表单的提交事件
  $('#form_login').on('submit',function(e){
  //组织默认跳转行为
  e.preventDefault()
  //2.发起ajax请求
  $.ajax({
    url: '/api/login',
    type:'POST',   //提交
    //快速获取表单中的全部数据
    data:$(this).serialize(),
    success:function(res){  //成功的回调函数
      if(res.status !== 0){  //不=0就是不成功
        return layer.msg('登录失败')  //用提示框提示失败
      }
      layer.msg('登录成功!')
       // 将登录成功得到的 token 字符串，保存到 localStorage 中,token本质就是字符串，是唯一的，登录成功后,返回字符串,在服务器上有记录,以后每次登录必须有token
       //token用于有权限接口的身份认证
      //  console.log(res.token);
      localStorage.setItem('token',res.token)
      //跳转到后台主页
       location.href = '/index.html'
    }
  })
  })
})