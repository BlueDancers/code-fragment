let Wpromise = require('./simple.3');

new Wpromise((resolve, reject) => {
  resolve('成功');
}).then(
  res => {
    console.log(res);
    return 111;
  },
  res => {
    console.log('失败', res);
  }
);
