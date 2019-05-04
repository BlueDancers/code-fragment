let Wpromise = require('./simple.4');
new Wpromise((resolve, reject) => {
  resolve('hello world');
})
  .then()
  .then()
  .then(res => {
    console.log(res); //我们希望可以正常打印出hello world，如何处理呢？
    return '穿透回调成功';
  })
  .then(
    res => {
      console.log(res);
      return new Wpromise((resolve, reject) => {
        //返回一个新的Promise
        setTimeout(() => {
          resolve('hello world');
        }, 2000);
      });
    },
    res => {
      console.log(res);
    }
  )
  .then(res => {
    console.log('成功回调', res);
  })
  .catch(res => {
    console.log('失败回调', res);
  });
