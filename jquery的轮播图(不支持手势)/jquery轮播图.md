## jQuery实现的无缝轮播



最近在维护公司一个比较老的项目,本来是不想写这个的,但是网上的插件真的是不咋地,bug太多了,只能使用我渣渣的jQuery水平来写一个轮播了

**传统的轮播图与MVVM的轮播图,的实现思路是不一样的**



类似于Vue,我们只关心数据的显示隐藏,在显示隐藏过程中添加过渡动画,达到完全不涉及dom的操作

但是传统的轮播图不是这样的,因为涉及到dom的操作,思路发生的变化

大致思路是这样的

1. 获取图片数量
2. 获取图片宽度
3. 定义图片索引
4. 动态渲染轮播图导航
5. (核心)rotate方法进行索引的切换,同时使用animate()进行`索引`*`图片宽度`的偏移
6. 启动定时器
7. 添加下标点击事件
8. 添加左右点击事件



> html 没什么好说的,就是图片列表

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="./carousel_bate.css">
  <title>jQuery轮播图</title>
</head>
<body>
  <div class="carousel-conatiners">
    <div class="carousel">
       <!-- img应为后端动态渲染 -->
      <img src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
      <img src="http://www.vkcyan.top/FgbA0ptti6uF-9Rf5X6zC1VWVrnN.png" alt="">
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



> js部分还是有一些坑的,后面再说

```js
$(document).ready(function () {
  var imageBox = $('.carousel')[0] // 获取图片对象
  var imageNum = $(imageBox).children().size() // 获取图片数量
  var iconBox = $('.iconbox')
  var iconBoxList = iconBox.children()
  var nextId = 0 // 下一张图片的索引
  var delayTime = 3000 // 延迟时间
  var speed = 500 // 执行速度
  var intervalId // 定时器的控制器
  // 根据数量动态渲染icon
  var iconNum = 0 // 记录icon数量
  while (imageNum > iconNum) {
    $('.iconbox').append(`<span class="carousel-icon" rel=${iconNum}></span>`)
    iconNum++
  }
  var rotate = function (clickId) {
    if (clickId != undefined) {
      console.log(clickId);
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
    $(iconBox).children().removeClass('active') // 参数当前存在的active下标
    var activeChildren = $(iconBox).children()[nextId]
    $(activeChildren).addClass('active') // 给当前的下标加class

    $(imageBox).animate({
      left: `-${nextId*$(imageBox).width() +5}px`
    }, speed)
  }
  // 初始化解决方法
  // 1. 运行一次rotate函数 让其初始化
  // 2. 给 iconbox 这个class第一个子元素添加 active 
  rotate()
  intervalId = setInterval(rotate, delayTime); // 开启轮播

  iconBox.children().each(function (index, val) { // 下标点击事件
    $(this).click(function (e) {
      clearInterval(intervalId) // 清除定时器
      rotate(index) // 手动指定跳转
      intervalId = setInterval(rotate, delayTime); // 再次启动定时器
    })
  })
  // 先左滑动
  $('.carousel-left').click(function () {
    clearInterval(intervalId) // 清除定时器
    rotate(--nextId)
    intervalId = setInterval(rotate, delayTime); // 再次启动定时器
  })
  $('.carousel-right').click(function () {
    clearInterval(intervalId) // 清除定时器
    rotate(++nextId)
    intervalId = setInterval(rotate, delayTime); // 再次启动定时器
  })
})
```



> css 部分除了固定的布局,就是需要保证图片是一行排列的,其他的例如 轮播导航 左右切换 很好调整

```css
* {
  margin: 0;
  padding: 0;
}

.carousel-conatiners {
  position: relative;
  width: 100%;
  height: 450px;
  overflow: hidden;
  float: left;
}

.carousel {
  position: relative;
  display: flex;
  top: 0px;
  left: 0px;
  height: 400px;
}

.carousel img {
  width: 100%;
  display: block;
  float: left;
}

.iconbox {
  position: absolute;
  bottom: 0px;
  height: 50px;
  width: 100%;
  color: black;
  display: flex;
  justify-content: center;
}

.carousel-icon {
  margin: 10px 20px;
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: black;
}

.active {
  background-color: brown;
}

.carousel-left {
  cursor: pointer;
  transform: translate(0, -50%);
  margin-top: -25px;
  margin-left: 20px;
  position: absolute;
  top: 50%;
  left: 0;
}

.carousel-right {
  cursor: pointer;
  transform: translate(0, -50%);
  margin-top: -25px;
  margin-right: 20px;
  position: absolute;
  top: 50%;
  right: 0;
}
```

效果为这样

![](http://www.vkcyan.top/lij-mDT_POB0AnW4cEW6O9WlezBz.gif)





遇到的问题

1. 浏览器窗口大小调整,导致轮播图发生错乱

解决方法:

​	最开始写的时候,我在初始化的获取了宽度,所以这个宽度变量是定值,于是就会出现浏览器窗口发生变化的时候,动画偏移还是最初的宽度,就会发生错乱的情况,所以,这些随时可能变化的值,就不能用变量去初始化,在每次切换的时候动态获取轮播图宽度

````JavaScript
 $(imageBox).animate({
   left: `-${nextId*$(imageBox).width() +5}px`
 }, speed)
````



代码写的比较急,所以有很多可以优化的地方,如果各位需要的话,有空可以优化一下,顺便加上手势拖动效果







