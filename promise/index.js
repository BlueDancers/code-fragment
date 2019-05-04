let Wpromise = require('./simple.4');
Wpromise.resolve('成功')
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
