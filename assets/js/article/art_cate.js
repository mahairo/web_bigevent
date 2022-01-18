$(function(){
var layer = layui.layer
var form = layui.form

  //打开页面就调用数据信息
  initArtCateList()
  //获取文章分类的列表
  function initArtCateList(){
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success:function(res){
        // console.log(res);   //这里用res是因为要把res里面所有的数据给模板引擎然后渲染到表格身体中，返回的是对象
        var htmlStr = template('tpl-table',res) //模板引擎返回的数据：模板，数据 
        $('tbody').html(htmlStr)  //把res的数据给表格
      }
    })
  }

  //获取索引值
  var indexAdd = null
  //给添加类别按钮注册点击事件
  $('#btnAddCate').on('click',function(){
    indexAdd = layer.open({
      type:1,
      title: '添加文章分类',
      area:['500px','250px'],
      content: $('#dialog-add').html()  //内容为模板引擎内输入的内容
    });  
  })

  //给表单绑定sumbit事件，需要经过事件代理因为form是动态生成的
  $('body').on('submit','#form-add',function(e){
    //组织默认行为,
    e.preventDefault()
    //提交分类
    $.ajax({
      method:'POST',
      url:'/my/article/addcates',
      data:$(this).serialize(), //快速获取表单输入的值
      success:function(res){
        console.log(res);
        
        if(res.status !== 0){
          return layer.msg('新增分类失败！')
        }
 
        //刷新一下页面
        initArtCateList()
        layer.msg('新增分类成功！')
        //再添加完信息后，根据索引关闭弹出层
        layer.close(indexAdd)  //添加索引
      }
    })
  })

  //给编辑按钮绑定点击事件
  var indexEdit = null
  //通过事件委派给编辑类别按钮注册点击事件，因为是动态生成的
  $('tbody').on('click','#btn-edit',function(){
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type:1,
      title: '修改文章分类',
      area:['500px','250px'],
      content: $('#dialog-edit').html()  //内容为模板引擎内输入的内容
    }); 
    
     //获取data里面的id
    var id = $(this).attr('data-id')
    //发起请求获取对应分类的数据
    // console.log(id);
    $.ajax({
      method:'GET',
      url:'/my/article/cates/' + id,
      success:function(res){
      form.val('form-edit',res.data)  //这里是用data是因为只把data里面的数据放在表单里，返回的是数组
    }
   })
  })
  //通过 事件委派 的方式，给修改按钮绑定点击事件
  $('body').on('submit','#form-edit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/updatecate',
      data:$(this).serialize(),
      success:function(res){
        console.log(res);
        if(res.status !== 0){
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })
 
  //通过事件委派的形式，为删除按钮绑定点击事件
  $('tbody').on('click','#btn-delete',function(){
    var id = $(this).attr('data-id')
    //提示用户是否删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/' + id,
        success:function(res){
          if(res.status !== 0){
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    });
  })
})