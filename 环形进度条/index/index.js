const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1.5, // 倒计时
    pageNum: 10,
    interval: null // 存储定时器
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /*
    思路: 首先使用变量存储定时器,方便clean吊计时器
    在定时器里面进行判断,假如在10以下,时间还没有到,更新canvas,
    直到0,clean掉定时器
  */
  countdown() { // 控制计时器
    let interval = setInterval(() => {
      let num = this.data.num // 获取定时时长
      if (num > -0.5) {
        this.setData({
          num: (this.data.num - 0.2).toFixed(1), // 计时器变量
          pageNum: this.data.pageNum-1
        })
        //num = num + 0.2
        this.drawRang(num)
      } else {
        clearInterval(this.data.interval)
      }
    }, 1000);
    this.setData({
      interval
    })
  },
  // drawRang() {
  //   //绘制正方形
  //   let cvsCtx = wx.createCanvasContext('can');
  //   cvsCtx.setFillStyle('rgb(27,181,56)'); // 设置填充色
  //   cvsCtx.fillRect(10,10,150,100)/填充一个矩形 (x,y,width,height)
  //   cvsCtx.draw()// 绘制图片 
  //   cvsCtx.setFillStyle('red') // 设置填充色
  //   cvsCtx.fillRect(50,50,100,100) //填充一个矩形 (x,y,width,height)
  //   cvsCtx.draw(true) // true表示不会覆盖上一个绘制的图案 如果没有true就是覆盖
  // }
  drawRang(num) {
    console.log(num);

    let cvsCtx = wx.createCanvasContext('can');
    cvsCtx.setFillStyle('#1BB538'); // 绿色
    cvsCtx.setStrokeStyle('#A4E1AF'); // 浅绿色
    cvsCtx.arc(200, 200, 50, 0, 2 * Math.PI, false);
    // arc(x,y,半径,起始弧度,终止弧度,false/true(顺时针/逆时针))
    // 不需要描边 cvsCtx.stroke(); //对当前路径进行描边
    cvsCtx.fill(); // 	对当前路径进行填充
    //这个阶段以及完成了底面的绘制

    cvsCtx.setFillStyle('#fff');
    cvsCtx.setFontSize(30); // 设置这题大小
    cvsCtx.setTextAlign('center'); // 设置字体居中
    cvsCtx.fillText(this.data.pageNum, 200, 210); // 在xy轴为(200,200)的地方输出文本
    //这个节点完成了文字的输出

    // 绘制圆环
    cvsCtx.beginPath();
    cvsCtx.setLineWidth(6); // 设置边的宽度
    cvsCtx.setStrokeStyle('#ffffff');
    cvsCtx.setLineCap('round');
    cvsCtx.arc(200, 200, 40, 1.5 * Math.PI, (num * Math.PI -0.2 * Math.PI), true);
    cvsCtx.stroke();
    cvsCtx.draw();
  }
})