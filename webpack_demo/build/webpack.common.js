/*
 * @Author: your name
 * @Date: 2020-03-31 18:18:03
 * @LastEditTime: 2020-04-01 21:30:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.common.js
 */

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: {
    main: './src/index.js'
  }, // 打包入口文件
  output: {
    publicPath: './',
    filename: '[name].js', // 打包输出文件
    path: path.resolve(__dirname, '../bundle') // 打包路径
  },

  module: {
    // 对不同模块进行打包
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
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
  optimization: {
    splitChunks: {
      chunks: 'all', // async 异步代码分割(自动) initial 同步代码分割(自动) all 同步代码分割(手动)
      minSize: 0, // 默认执行代码分割的最小字节数
      maxSize: 50000,  // 如果打包文件大于50kb,这会进行代码在分割,尝试向50kb靠近
      minChunks: 2, // 当模块使用了至少x次才会进行代码分割
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        // 当设置all的时候会更新cacheGroups里面的规则进行打包
        // 将node_modules里面引入的代码打包到vendors这个组里面,名字会根据打包目录,或者别名进行命名,或者为name字段
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors' // 修改打包名
        },
        default: { // 当代码不被vendors里面的规则控制到的时候,打包文件就会根据default配置进行打包
          // minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name: 'common'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}
