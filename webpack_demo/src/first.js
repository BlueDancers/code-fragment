/*
 * @Author: your name
 * @Date: 2020-03-26 15:20:15
 * @LastEditTime: 2020-03-30 18:17:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/src/first.js
 */

export default function first() {
  var btn = document.createElement('button')
  btn.innerHTML = '增加'
  document.body.appendChild(btn)
  btn.onclick = function() {
    var div = document.createElement('div')
    document.body.appendChild(div)
  }
}
