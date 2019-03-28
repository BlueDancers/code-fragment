const app = getApp()
Page({

  data: {
    autoplay:true,  // 自动轮播
    circular:true, // 是否衔接滑动
    previousMargin: '100rpx', // 前边距
    nextMargin: '100rpx', // 后边距
    currentIndex: 0
  },

  onLoad: function (options) {
  
  },
  /* 这里实现控制中间凸显图片的样式 */
  handleChange: function(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
})
