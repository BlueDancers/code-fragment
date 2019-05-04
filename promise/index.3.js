let Wpromise = require('./simple.3');

new Wpromise((resolve, reject) => {
  resolve('成功');
})
  .then(
    res => {
      throw '报错了';
    },
    res => {}
  )
  .then(
    res => {},
    res => {
      console.log('二次回调失败', res);
      return new Wpromise((resolve, reject) => {
        //返回一个新的Promise
        setTimeout(() => {
          resolve('hello world');
        }, 2000);
      });
    }
  )
  .then(res => {
    console.log('第三次回调', res);
  });

// /**
//  * 理解call的例子
//  * @param {Function} firstName
//  * @param {Function} lastName
//  */
// function func(firstName, lastName) {
//   // console.log(firstName(1), lastName(1), this.name);
// }
// var obj = {
//   name: 'linxin'
// };
// func.call(
//   obj,
//   x => {
//     console.log(x);
//   },
//   y => {
//     console.log(y);
//   }
// );
