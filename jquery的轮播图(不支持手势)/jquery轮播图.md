## jQuery实现的无缝轮播（兼容到IE10）

![](http://www.vkcyan.top/FrfROjvz74zYukBzbmIhY7tLgnrG.gif)

> 兼容IE11，IE10

最近在维护公司一个比较老的项目，本来是不想写这个的，但是网上的插件真的是一言难尽，bug太多了，本来想躲个懒，结果花了更多时间

![](http://www.vkcyan.top/FpnGyIU52pqPnQBVzOuMxcp4AnLv.png)



## 正题

**传统的轮播图与MVVM的轮播图的实现思路是不一样的**

类似于Vue，我们只关心数据的变化，在显示隐藏过程中添加过渡动画，达到完全不涉及dom，轻松完成轮播组件

但是传统的轮播图不是这样的，因为涉及到dom的操作，思路发生的了变化

本文的大致思路是这样的

1. 获取图片数量
2. 获取图片宽度
3. 定义图片索引
4. 动态渲染轮播图导航
5. (核心)rotate方法进行索引的切换，同时使用animate()进行`索引`*`图片宽度`的偏移
6. 启动定时器
7. 添加下标点击事件
8. 添加左右点击事件



> html 没什么好说的，就是图片列表

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width， initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="./carousel_bate.css">
  <title>Document</title>
</head>

<body>
  <div class="carousel-conatiners">
    <div class="carousel">
      <img class="carousel_img" src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img class="carousel_img" src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img class="carousel_img" src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img class="carousel_img" src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img class="carousel_img" src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
    </div>
    <!-- 底部小icon动态渲染 -->
    <div class="iconbox"></div>
    <!-- 左右图标 -->
    <div class="carousel-left">
      <img src="http://www.vkcyan.top/Frbiyli7a0QMCLhq40Kz7LjkOnOa.png" alt="">
    </div>
    <div class="carousel-right">
      <img src="http://www.vkcyan.top/FqO53vcLOtTh-cj7kKIX3i0eaoLr.png" alt="">
    </div>
  </div>
  <script src="jquery.1.7.2.js"></script>
  <script src="./carousel_bate.js"></script>
</body>

</html>
```



> js部分还是有一些坑的，后面再说

```js
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
      }，speed)
  }
  // 初始化 1. 运行一次rotate函数 让其初始化 2. 给  iconbox  这个class第一个子元素添加 active
  rotate()
  intervalId = setInterval(rotate， delayTime) // 开启轮播
// 下标点击事件
  $('.iconbox').children().each(function(index) {
    $(this).click(function(e) {
      clearInterval(intervalId) // 清除定时器
      rotate(index) // 手动指定跳转
      intervalId = setInterval(rotate， delayTime) // 再次启动定时器
    })
  })
  // 左右滑动事件
  $('.carousel-left').click(function() {
    clearInterval(intervalId) // 清除定时器
    rotate(--nextId)
    intervalId = setInterval(rotate， delayTime) // 再次启动定时器
  })
  $('.carousel-right').click(function() {
    clearInterval(intervalId) // 清除定时器
    rotate(++nextId)
    intervalId = setInterval(rotate， delayTime) // 再次启动定时器
  })
  // 对ie浏览器进行特殊处理
  function isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      $('.carousel_img').css('width'， $(window).width())
      $('.carousel').css('width'， '1000%')
    } else {
      console.log('不是ie不作处理')
    }
  }
})
```



> css 部分除了固定的布局，就是需要保证图片是一行排列的，其他的例如 轮播导航 左右切换 很好调整

```css
* {
  margin: 0;
  padding: 0;
}

.carousel-conatiners {
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
  margin-top: 10px;
}

.carousel {
  position: relative;
  display: flex;
  top: 0px;
  left: 0px;
  height: 400px;
  width: 100%;
}

.carousel_img {
  float: left;
  display: block;
  height: 360px;
  width: 100%;
  cursor: pointer;
}

.iconbox {
  position: absolute;
  bottom: 0px;
  height: 20px;
  width: 100%;
  color: black;
  display: flex;
  justify-content: center;
}

.carousel-icon {
  display: block;
  cursor: pointer;
  margin: 10px 20px 0px 10px;
  width: 30px;
  height: 10px;
  background: rgba(206， 206， 206， 1);
  border-radius: 5px;
}

.active {
  background-color: black;
}

.carousel-left {
  cursor: pointer;
  transform: translate(0， -50%);
  margin-top: -25px;
  margin-left: 23%;
  position: absolute;
  top: 50%;
  left: 0;
  width: 40px;
  height: 120px;
  background: rgba(255， 255， 255， 1);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.carousel-left img {
  display: inline-block;
  width: 14px;
  height: 45px;
}

.carousel-right img {
  width: 14px;
  height: 45px;
}

.carousel-right {
  cursor: pointer;
  transform: translate(0， -50%);
  margin-top: -25px;
  margin-right: 23%;
  position: absolute;
  top: 50%;
  right: 0;
  width: 40px;
  height: 120px;
  background: rgba(255， 255， 255， 1);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.carousel-conatiners:hover .carousel-left，
.carousel-conatiners:hover .carousel-right {
  opacity: 0.5;
}

.carousel-left:hover，
.carousel-right:hover {
  opacity: 0.8;
}
```





## 后话

面对不兼容ie的问题，因为IE会默认对flex布局内的100%宽度进行相对父元素的宽度平分，所以对ie需要进行特殊的处理，当然不能为了ie动已经完成的css，所以，我们判断当前浏览器时候是ie，进行轮播图父元素的宽度增加，这样ie就也显示正常了(ie10以下不支持flex布局)



### 仓库地址

[github](https://github.com/vkcyan/Small-code/tree/master/jquery%E7%9A%84%E8%BD%AE%E6%92%AD%E5%9B%BE(%E4%B8%8D%E6%94%AF%E6%8C%81%E6%89%8B%E5%8A%BF))









