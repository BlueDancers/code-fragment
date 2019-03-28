let Wpromise = require('./simple')

new Wpromise((resolve,reject) => {
  resolve(1)
}).then(res => {
  console.log(res);
})