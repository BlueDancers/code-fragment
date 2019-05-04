let Wpromise = require('./simple.3');

new Wpromise((resolve, reject) => {
  resolve('成功');
})
  .then(
    res => {
      console.log(res);
      return new Promise((resolve, reject) => {
        //返回一个新的Promise
        setTimeout(() => {
          reject('hello world');
        }, 2000);
      });
    },
    res => {
      console.log('失败', res);
    }
  )
  .then(
    res => {
      setTimeout(() => {
        reject('hello world');
      }, 2000);
    },
    res => {
      console.log('二次回调失败', res);
      return new Promise((resolve, reject) => {
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
