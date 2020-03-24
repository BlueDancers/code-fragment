/*
 * @Author: vkcyan
 * @Date: 2020-03-22 11:42:40
 * @LastEditTime: 2020-03-24 21:19:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.config.js
 */
const path = require('path')

module.exports = {
  // mode: 'production', // 线上模式
  mode: 'development', // 开发模式
  entry: {
    main: './src/index.js'
  }, // 打包入口文件

  module: {
    // 对不同模块进行打包
    rules: [
      {
        test: /\.(png|jpg|gif)$/, // 指定打包文件后缀
        use: {
          loader: 'url-loader',
          options: {
            // placeholder 为占位文字
            name: '[name]_[hash].[ext]', // 文件名字不变 name 文件名 ext 文件拓展名 hash 为哈希值
            outputPath: 'images/', // 打包到指定目录下面
            limit: 2048 // 打包成为base64的阈值 2048以上就会打包成为文件 与file-loader效果相同
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ] //首先加载style-loader 加载css的dom,然后加载css loader 准备css的解析 最后sass-loader 解析scss文件 完成解析
      }
    ]
  },
  output: {
    filename: 'bundle.js', // 打包输出文件
    path: path.resolve(__dirname, 'bundle') // 打包路径
  }
}
