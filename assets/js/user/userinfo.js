$(function(){  //jq入口函数,使用jq
  var form = layui.form

  form.verify({
    nickname:function(value){
      if(value.length > 6){
        return '昵称必须在1~6个字符之间！'
      }
    }
  })

  initUserInfo()
//初始化用户的基本信息
function initUserInfo(){
  $.ajax({
    method:'GET',
    url:'/my/userinfo',
    data:$(this).serialize(),
    success:function(res){
      if(res.status !== 0){
        return layer.msg('获取用户信息失败！')
      }
      console.log(res);
      //调用form.val()快速为表单赋值 语法form.val('filter', object);
      form.val('formUserInfo',res.data)
    }

  })
}

//给重置按钮绑定点击事件重置表单数据
$('#btnReset').on('click',function(e){
  //阻止默认行为
  e.preventDefault()
  initUserInfo()
})

// 监听表单的提交事件,提交表单数据
$('.layui-form').on('submit',function(e){
   //阻止默认行为
   e.preventDefault()
  // 发起 ajax 数据请求
  $.ajax({
    method:'POST',
    url:'/my/userinfo',
    data:$(this).serialize(),
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg('更新用户信息失败！')
      }
      layui.layer.msg('更新用户信息成功！')
       // 调用父页面中的方法，重新渲染用户的头像和用户的信息
       window.parent.getUserInfo()   //这是index页面里的方法，因为ifrem是页中页
    //getUserInfo()请求获取用户的基本信息,向服务器请求
      }
  })

})
})