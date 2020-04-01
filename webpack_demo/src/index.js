/*
 * @Author: your name
 * @Date: 2020-03-22 11:47:12
 * @LastEditTime: 2020-04-01 21:23:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/index.js
 */
function setComponent() {
  return import('lodash').then(_ => {
    var element = document.createElement('div')
    element.innerHTML = _.join(['11', '22', '33'], '-')
    return element
  })
}
setComponent().then(element => {
  console.log('组件数据', element)

  document.body.append(element)
})
import first from './first'

console.log(first)
