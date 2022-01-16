$(function(){
var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {  //声明变量之一
      // 纵横比1:1
      aspectRatio: 1,
      // 指定预览区域,两个预览区域
      preview: '.img-preview'
    }
  
    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮注册点击事件
    $('#btnChooseImage').on('click',function(){
      $('#file').click()
    })

    //给文件选择框绑定更换图片事件
    $('#file').on('change',function(e){
      //获取用户选择的文件
      var filelist = e.target.files //e里面有个target属性，里面有个files对象
      console.log(e);
      
      if(filelist.length === 0){
        return layer.msg('请选择照片！')
      }

      //1.拿到用户选择的文件列表
      var file = e.target.files[0]  //[0]获取选中的文件列表
       // 2. 将文件，转化为路径
       var imgURL = URL.createObjectURL(file)
      // 3. 重新初始化裁剪区域
       $image
         .cropper('destroy')      // 销毁旧的裁剪区域
         .attr('src', imgURL)  // 重新设置图片路径
         .cropper(options)        // 重新初始化裁剪区域
    })
    //给确定按钮绑定文件上传裁剪之后的头像
    $('#btnUpload').on('click',function(){
      //1.拿到用户裁剪之后的图片
      var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')  // 将 Canvas 画布上的内容，转化为 base64 格式的字符串 文件的内容转换成字符串形式
      //2.调用接口把文件上传到服务器，然后在页面更新头像
      $.ajax({
        method:'POST',
        url:'/my/update/avatar',
        data:{
          avatar:dataURL,
        },
        success:function(res){
          if(res.status !== 0){
            return layer.msg('更换头像失败！')
          }
          layer.msg('更换头像成功！')
          //更新父页面头像
          window.parent.getUserInfo()
        }
      })
    })
})