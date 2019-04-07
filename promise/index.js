let Wpromise = require('./simple')

new Wpromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000);
}).then(res => {
  console.log(res);
}, res => {
  console.log('失败', res);
})