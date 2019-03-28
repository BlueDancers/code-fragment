const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      showModal: false
  },
  hideModal () {
    this.SwitchDialog()
  },
  SwitchDialog () { // 切换显示隐藏
    this.setData({
      showModal: !this.data.showModal
    })
  },
  preventTouchMove () {
    // .. 存在的意义 == > 弹出框蒙版截断touchmove事件 
  },
  onCancel () {
    console.log('取消')
    this.SwitchDialog()
  },
  onConfirm () {
    console.log('确认')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})