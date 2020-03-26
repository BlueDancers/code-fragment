/*
 * @Author: your name
 * @Date: 2020-03-22 11:47:12
 * @LastEditTime: 2020-03-26 15:21:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/index.js
 */
import './default.css'
import first from './first'
first()

var btn = document.createElement('button')
btn.innerHTML = '增加'
document.body.appendChild(btn)

btn.onclick = function() {
  var div = document.createElement('div')
  div.innerHTML = '模块'
  document.body.appendChild(div)
}
