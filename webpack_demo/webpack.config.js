/*
 * @Author: vkcyan
 * @Date: 2020-03-22 11:42:40
 * @LastEditTime: 2020-03-26 15:32:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.config.js
 */
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // mode: 'production', // 线上模式
  mode: 'development', // 开发模式
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src/index.js'
  }, // 打包入口文件
  output: {
    publicPath: '/',
    filename: '[name]_[hash].js', // 打包输出文件
    path: path.resolve(__dirname, 'bundle') // 打包路径
  },
  devServer: {
    contentBase: './bundle', // 指定监听文件,一般情况下不需要写
    hot: true, // 是否开启热更新
    hotOnly: true // 启用热模块替换,而不会在构建失败的情况下进行页面刷新作为后备。
  },
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
        test: /\.(eot|ttf|svg|woff)$/, // 指定打包文件后缀
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
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
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ] //首先加载style-loader 加载css的dom,然后加载css loader 准备css的解析 最后sass-loader 解析scss文件 完成解析
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] //首先加载style-loader 加载css的dom,然后加载css loader 准备css的解析 最后sass-loader 解析scss文件 完成解析
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.HotModuleReplacementPlugin(), // 可以做到模块化替换 配合热更新使用
    new webpack.NamedModulesPlugin() // 提示热更新的文件
  ]
}
