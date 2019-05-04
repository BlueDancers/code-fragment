let Wpromise = require('./simple.4');
new Wpromise((resolve, reject) => {
  resolve('hello world');
})
  .then()
  .then()
  .then(res => {
    console.log(res); //我们希望可以正常打印出hello world，如何处理呢？
  });
