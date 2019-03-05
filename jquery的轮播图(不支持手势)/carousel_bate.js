$(document).ready(function() {
  isIE()
  var imageBox = $('.carousel')[0] // 获取图片对象
  var imageNum = $(imageBox).children().size() // 获取图片数量
  var nextId = 0 // 下一张图片的索引
  var delayTime = 3000 // 延迟时间
  var speed = 500 // 执行速度
  var intervalId // 定时器的控制器
  // 根据数量动态渲染icon
  var iconNum = 0 // 记录icon数量
  while (imageNum > iconNum) {
    // $('.iconbox').append(`<span class="carousel-icon" rel=${iconNum}></span>`)
    //ei11以下不支持模板字符串
    $('.iconbox').append("<span class='carousel-icon' rel=" + iconNum + '></span>')
    iconNum++
  }
  var rotate = function(clickId) {
    if (clickId != undefined) {
      if (clickId + 1 > imageNum) {
        nextId = 0
      } else if (clickId < 0) {
        nextId = imageNum - 1
      } else {
        nextId = clickId
      }
    } else {
      // 自动触发
      if (nextId + 2 > imageNum) {
        nextId = 0
      } else {
        nextId++
      }
    }
    $('.iconbox').children().removeClass('active') // 参数当前存在的active下标
    var activeChildren = $('.iconbox').children()[nextId]
    $(activeChildren).addClass('active') // 给当前的下标加class

    $(imageBox).animate({
        // left: `-${nextId*$(imageBox).width() +2}px`
        left: '-' + nextId * $('.carousel_img').width() + 'px'
      },speed)
  }
  // 初始化 1. 运行一次rotate函数 让其初始化 2. 给  iconbox  这个class第一个子元素添加 active
  rotate()
  intervalId = setInterval(rotate, delayTime) // 开启轮播
// 下标点击事件
  $('.iconbox').children().each(function(index) {
    $(this).click(function(e) {
      clearInterval(intervalId) // 清除定时器
      rotate(index) // 手动指定跳转
      intervalId = setInterval(rotate, delayTime) // 再次启动定时器
    })
  })
  // 左右滑动事件
  $('.carousel-left').click(function() {
    clearInterval(intervalId) // 清除定时器
    rotate(--nextId)
    intervalId = setInterval(rotate, delayTime) // 再次启动定时器
  })
  $('.carousel-right').click(function() {
    clearInterval(intervalId) // 清除定时器
    rotate(++nextId)
    intervalId = setInterval(rotate, delayTime) // 再次启动定时器
  })
  // 对ie浏览器进行特殊处理
  function isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      $('.carousel_img').css('width', $(window).width())
      $('.carousel').css('width', '1000%')
    } else {
      console.log('不是ie不作处理')
    }
  }
})
