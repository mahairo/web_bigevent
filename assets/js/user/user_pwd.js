$(function(){
  var form = layui.form

  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd:function(value){ //新密码的值，不能跟旧密码相同
      if(value === $('[name=oldPwd]').val()){ //
        return '新旧密码不能相同！'
      }
    },
    rePwd:function(value){ //确认新密码的值，和更改的密码相同
      if(value !== $('[name=newPwd]').val()){
        return '两次密码不一致！'
      }  //[name=newPwd]属性选择器，因为是获取name=newPwd的元素并且是字符串加引号
    }
  })

  //给form表单绑定 submit 事件，在事件处理函数里面取消默认行为
$('.layui-form').on('submit',function(e){
  e.preventDefault()
  //查阅接口文档，利用 $.ajax() 来发送 post 请求
  $.ajax({
    method:'POST',
    url:'/my/updatepwd',
    data:$(this).serialize(),
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg('更新密码失败！')
      }
      // console.log(res.status);
      
      layui.layer.msg('更新密码成功！')
      //重置表单,jq方式转换成dom方法用reset重置
      $('.layui-form')[0].reset()
    }
  })
})
})
