/*
 * @Author: your name
 * @Date: 2020-03-22 11:47:12
 * @LastEditTime: 2020-03-24 21:28:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/index.js
 */
import aqy from '../images/aqy.png'
import style from './index.scss'

let img = new Image()
img.src = aqy
console.log(style)

img.classList.add(style.root) 

var root = document.getElementById('app')
root.append(img)
