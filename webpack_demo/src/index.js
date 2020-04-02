/*
 * @Author: your name
 * @Date: 2020-03-22 11:47:12
 * @LastEditTime: 2020-04-02 18:18:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/index.js
 */
// function setComponent() {
//   return import('lodash').then(_ => {

//     return element
//   })
// }

document.addEventListener('click', () => {
  var element = document.createElement('div')
  element.innerHTML = 2312321312 //_.join(['11', '22', '33'], '-')
  document.body.append(element)
  // setComponent().then(element => {
  //   console.log('组件数据', element)
  //
  // })
})
