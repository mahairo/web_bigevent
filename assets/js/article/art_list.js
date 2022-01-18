$(function(){
  
var layer = layui.layer
var form = layui.form
var laypage = layui.laypage

//定义时间过滤器
template.defaults.imports.dateFormat = function(date){
  let myDate = new Date(date)
  let y = String(myDate.getFullYear())
  let m = String(myDate.getMonth() + 1).padStart(2,'0')
  let d = String(myDate.getDate()).padStart(2,'0')
  let h = String(myDate.getHours()).padStart(2,'0')
  let i = String(myDate.getMinutes()).padStart(2,'0')
  let s = String(myDate.getSeconds()).padStart(2,'0')
  return `${y}-${m}-${d} ${h}:${i}:${s}`
}

  // 定义一个查询的参数对象q，将来请求数据的时候，需要将请求参数对象提交到服务器
var q = {
  pagenum:1, // 页码值，告知服务器我们需要的是第几页数据,默认请求第一页的数据
  pagesize:2, // 每页显示几条数据，默认每页显示2条
  cate_id:'', // 文章分类的 Id ,需要找哪一个分类下的文章，默认是所有文章
  state:''     // 文章的发布状态,查找的是什么状态的文章
}

initTable()

initCate()
// 进页面就发起请求，获取文章列表数据的方法
function initTable(){
  $.ajax({
    method: 'GET',
    url:'/my/article/list',
    data:q,
    success:function(res){
      if (res.status !== 0) {
        return layer.msg('获取文章列表失败！')
      }
      console.log(res);
      
      // 使用模板引擎渲染页面的数据
      var htmlStr = template('tpl-table',res)
      $('tbody').html(htmlStr)
      // 调用渲染分页的方法
      renderPage(res.total)
    }
  })
}

//初始化文章分类的方法
function initCate(){
  $.ajax({
    method:'GET',
    url:'/my/article/cates',
    success:function(res){
      if(res.status !== 0){
        return layer.msg('获取分类数据失败！')
      }
     //成功就调用模板引擎渲染分类的可选项
    var htmlStr = template('tpl-cate',res)
    // console.log(htmlStr);
    
    //利用属性选择器填充
    $('[name=cate_id]').html(htmlStr)
    // 通过 layui 的render属性 重新渲染表单区域的UI结构
    //页面上可视的下拉菜单不是原生的
    form.render()
    }
    
  })
}

//为筛选表单绑定submit事件,监听表单提交事件，如果提交了就执行这个数据
$('#form-search').on('submit',function(e){
  e.preventDefault()
  //获取表单中选中的值 每个下拉菜单的值
  var cate_id = $('[name=cate_id]').val()
  var state = $('[name=state]').val()
  // 为查询参数对象 q 中对应的属性赋值
  q.cate_id = cate_id
  q.state = state
  // 根据最新的筛选条件，重新渲染表格的数据
  initTable()
})

// 定义渲染分页的方法
function renderPage(total) {
  // 调用 laypage.render() 方法来渲染分页的结构
  laypage.render({
    elem: 'pageBox', // 分页容器的 Id
    count: total, // 总数据条数
    limit: q.pagesize, // 每页显示几条数据
    curr: q.pagenum, // 设置默认被选中的分页
    layout:['count','limit','prev','page','next','skip'],
    limits:[2,3,5,10],  //每页展示多少条
    //1.页码分页发生切换的时候，触发jump回调
    //2.只要调用了 laypage.render() 方法，就会触发 jump 回调
    jump: function(obj,first){  //当前分页的所有选项值，是否首次，一般用于初始加载的判断
      //通过first的值判断出只要调用laypage.render()方法，就会触发jump回调函数
      //first的值等于true，证明是方式2触发的，方式2触发就不调用initTable()函数，只有点击页码的时候才调用
      console.log(obj.curr);  //当前点击的页码
      //把最新的页码值，赋值到 q 这个查询参数对象中
      q.pagenum = obj.curr  
      // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
      q.pagesize = obj.limit

     // 根据最新的 q 获取对应的数据列表，并渲染表格
      // initTable()
      //首次不执行initTable()函数
      if(!first){
        initTable()
      }
    }
  })
}

//通过委托为删除按钮绑定点击事件
$('tbody').on('click','.btn-delete',function(){
  //判断删除按钮的个数
  var len = $('.btn-delete').length
  //获取当前文章的id
  var id = $(this).attr('data-id')
  //询问用户是否要删除数据
  layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
  $.ajax({
    method:'GET',
    url:'/my/article/delete/' + id,
    success:function(res){
      if(res.status !== 0){
        return layer.msg('删除文章失败！')
      }
      layer.msg('删除文章成功！')
      //当数据删除完成后，需要判断这一页是否还有剩余的数值，没有的话就让页码值-1后重新刷新页面，判断删除按钮是否还存在，获取删除按钮的个数
    
      if(len === 1){
      // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了 ,如果不等于1，每次点击删除的时候就-1条数据 
      //页码值最小必须是1
      q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
      }
      //调用函数
      initTable()
    }
  })
    layer.close(index);
  });
})
})