# Webpack4.x 学习记录（深入）

webpack是一个模块打包器，而不是代码翻译器

webpack不是非常智能，需要开发者来配置不同文件的打包方式

npx是一个指定当前环境的命令工具

就像package.json 里面的scripts脚本里面的环境



## 基础配置



一个最基本的配置

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js', // 打包入口文件
  output: {
    filename: 'bundle.js', // 打包输出文件
    path: path.resolve(__dirname, 'bundle') // 打包路径
  }
}
```



打包命令相关

```javascript
vkcyan-MBP:webpack_demo vkcyan$ npm run bundle

> webpack_demo@1.0.0 bundle /Users/vkcyan/Desktop/github/code-fragment/webpack_demo
> webpack

Hash: 98e16d7ca7b6dcac83b2
Version: webpack 4.42.0
Time: 51ms
Built at: 2020-03-22 21:17:15
    Asset      Size  Chunks             Chunk Names
bundle.js  4.02 KiB    main  [emitted]  main // main的原因是默认打包名字就是main
Entrypoint main = bundle.js
[./src/index.js] 244 bytes {main} [built]
```



打包模式配置  production 为压缩代码  development为未压缩代码

```javascript
module.exports = {
  // mode: 'production', // 线上模式
  mode: 'development', // 开发模式
  entry: {
    main: './src/index.js' // main就是打包入口 等价于 字符串写法
  }
 	......
}
```



### 补充

entry可以进行多文件打包，将不同的js文件打包成自己配置的代码output

```javascript
entry: {
	main: './src/index.js',
	sub: './src/index.js'
}, // 打包入口文件
output: {
	filename: '[name]_[hash].js', // 打包输出文件
	path: path.resolve(__dirname, 'bundle') // 打包路径
},
```

这里就可以分别进行打包，生成main_hash sub_main的js文件

## loader

webpack是一个不是那么智能模块打包器，js是一个模块，图片是模块，css也是模块，对于不同的模块都需要不同的loader来进行对模块的处理

> webpack打包后会修改掉文件名，同时代码里面也会修改掉文件名称

```javascript
  module: {
    // 对不同模块进行打包
    rules: [
      {
        test: /\.png$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
```

webpack默认支持打包js文件，但是如果碰到了`.js`文件之外的文件的的时候，webpack就无法进行打包了，所以需要借助其他工具才可以进行打包，这里我们就用到了module，module就是帮助我们处理模块的识别，识别loader就会进行模块处理，处理完成后将生产的文件名会返回到打包的页面中



### 文件loader

> 完全替代file-loader的loader，支持配置阈值一下的文件直接打包成为base64

```javascript
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
      }
    ]
  },
```



### 样式loader

> 在webpack配置中，loader是存在先后顺序的，按从后到前的顺序执行
>
> 例如scss 文件不可以前面就是css-loader，需要先解析模块成为css
>
> 对于css相关文件的打包处理
>
> style-loader：在 DOM 里插入一个 <style> 标签，并且将 CSS 写入这个标签内。
>
> css-loader 解析import进来的css文件

```javascript
   {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'] 
        // 首先加载sass将scss文件进行打包处理为css文件，然后通过css-loader解析css文件，最后style-loader挂载dom结构
      },
```

> postcss-loader 是一个css后置处理器，可以处理css编译后的代码

```javascript
// importLoaders：用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。
// 
{
	loader: 'css-loader',
	options: {
		importLoaders: 2
	}
},
```



css模块化

```javascript
css模块开启
{
	loader: 'css-loader',
	options: {
		modules: true, // 开启模块化 开启后css名称就会变化，防止出现样式冲突
		importLoaders: 2
	}
},
```



总结： module的loader主要用户打包不同文件，并通过主观控制来实现不同的打包方案



## plugins

html-webpack-plugin

> webpack就是可以在webpack运行到某个时刻的时候，帮你做一些事情，例如htmlWebpackPlugin

> 该插件主要帮助我们主动生成html文件，并把打包生成的js文件自动引入到html文件

````javascript
  plugins: [new htmlWebpackPlugin()]
````

> 指定html模板，会帮我们将打包的js文件通过script的方式注入到html里面

```javascript
 plugins: [
    new htmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}
```



## SourceMap配置

文档地址https://www.webpackjs.com/configuration/devtool/

sourceMap:它是一个映射关系，他知道打包目录下main.js文件某一行出错了，实际上对应的src目录下的打包前的代码的某一行

```
inline： 将map文件直接打包到js中，不生成map文件，对速度提升不大
cheap：字体是行里面的错误，不提示列，建议开启
module： 会额外提示loader的错误，建议开启
eval： 不会生成source-map，打包非常快，无法提供准确错误提示
none： 不会生成source-map 不会生成映射，理论上最快

打包测试
eval 15s 6s
source-map 18s 8s
cheap-source-map 15s 6.8s
cheap-module-eval-source-map 16s 7s

开发环境建议使用 cheap-module-eval-source-map

我个人认为，不应该在线上环境排查错误，所以使用none，
```



## WebpackDevServer配置

### 监听打包

监听文件，文件变化则打包代码

```bash
webpack --watch
```

很明显这样有很大的弊端，很显然是不满足开发需求的

所以需要以这个内置服务来帮我们完成

webpackdevserver就是一个node服务器，可以自己实现一下

### 在node中使用webpack

```javascript
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const complier = webpack(config)

const app = express()
app.use(
  webpackDevMiddleware(complier, {})
)
app.listen(3000, () => {
  console.log('express running')
})
```

运行node文件就可以实现一个开发环境服务器，但是这个没有热更新的功能

### WebpackDevServer

#### contentBase

devServer里面的contentBase表示的是告诉服务器从哪里提供内容。（也就是服务器启动的根目录，默认为当前执行目录，一般不需要设置）

```javascript
devServer: {
	contentBase: './bundle', // 指定监听文件,一般情况下不需要写
  hot: true, // 是否开启热更新
  hotOnly: true // 启用热模块替换,而不会在构建失败的情况下进行页面刷新作为后备。
},
pulgins:[
  //....
  new webpack.HotModuleReplacementPlugin(), // 可以做到模块化替换 配合热更新使用
  new webpack.NamedModulesPlugin() // 提示热更新的文件
]
```



## js打包配置

> 为了兼容各种各样浏览器，需要对es6等等高版本代码进行兼容性处理

```
对于js的统一用到@babel系列的插件
babel-loader，用来处理ES6语法，将其编译为浏览器可以执行的js语法。
@babel/preset-env插件。它可以根据开发者的配置，按需加载插件。减少打包大小
```

如果使用@babel/preset-env配合polyfill来做的话，会产生变量冲突

#### @babel/preset-env

将es6的代码转化为es5的代码

#### @babel/polyfill

@babel/polyfill主要是兼用低版本代码，例如promise模块，需要注入到进来进行低版本的兼容

所以如果是库文件的应该使用 @babel/plugin-transform-runtime进行打包

> 该转换器的另一个目的是为您的代码创建一个沙盒环境。如果直接导入core-js或@ babel / polyfill及其提供的内置程序（例如Promise，Set和Map），则这些将污染全局范围。

当@babel/preset-env设置useBuiltIns为true的时候，不需要再页面里面引入@babel/polyfill了，否则会有一条警告

```bash
  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the `import '@babel/polyfill'` call or use `useBuiltIns: 'entry'` instead.
```



#### 摇树优化

> 摇树优化只支持es模块
>
> 注： 摇树优化大部分框架已经增加了配置，所以了解一下子配置即可

```javascript
optimization: {
  // 启用摇树优化
  usedExports: true
}
```



#### 对配置文件进行提取

> 使用webpack-merge 进行webpack配置文件的合并



#### 代码分割（code Splitting）

> 代码分割与webpack无关
>
> webpack实现代码分割只需要加入optimitzation配置即可
>
> 代码分割可以实现将不怎么修改的第三方库额外打包出来，这样就不需要额外的加载数据了，非常适合打包第三方库
>
> 只需要简单配置，即可开启代码分割
>
> 注意： 同步import的可以做到自动完成代码分割，但是动态引入的需要高版本的webpack作为支持
>
> 或者在.babelrc里面进行配置插件 babel-plugin-dynamic-import-webpack 

```javascript
 optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
```



```
import(/* webpackChunkName:"lodash" */ 'lodash')
代码打包别名
```



#### SplitChunksPlugins

> 代码分割主要依赖库

##### 默认代码分割配置

```
splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
    default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

##### 配置解析

```javascript
  optimization: {
    splitChunks: {
      chunks: 'all', // async 异步代码分割(自动) initial 同步代码分割(自动) all 同步代码分割(手动)
      minSize: 30000, // 默认执行代码分割的最小字节数
      // maxSize: 50000,  // 如果打包文件大于50kb,这会进行代码在分割,尝试向50kb靠近,很少用到
      minChunks: 1, // 当模块使用了至少多少次次才会进行代码分割,很少用到
      maxAsyncRequests: 5, // 同时加载的模块库,只为前五个库会进行代码分割,后面的不会进行分割了,很少用到
      maxInitialRequests: 3, // 入口文件进行加载的时候,最多同时加载前三个库,后面的不会再进行分割,很少用到
      automaticNameDelimiter: '~', // 组与文件,生成的时候的连接符,很少用到
      name: true, // 打包生成文件文件支持自定义
      cacheGroups: { // 分割代码规则定义(缓存组),可以对打包文件进行缓存,每次代码分割都会走缓存组里面的逻辑 
        // 当设置all的时候会更新cacheGroups里面的规则进行打包
        // 将node_modules里面引入的代码打包到vendors这个组里面,名字会根据打包目录,或者别名进行命名,或者为name字段
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 权重,如果同时符合多个代码分割规则,则按priority的大小来定义应该
          name: 'vendors' // 修改打包名
        },
        default: {
          // 当代码不被vendors里面的规则控制到的时候,打包文件就会根据default配置进行打包
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true, // 如果一个模块已经被打包过了,那么就不会打包已经引用的模块,会使用之前打包过的模块
          name: 'common'
        }
      }
    }
  },
```

代码分割是解决打包后的大文件的好办法，可以将第三方库进行分离进而减小包的大小，但是也不是越分割越好，因为打包的文件太多的话，http请求也会变慢，所以需要合理的进行代码分割达到优化打包

注： 代码分割只会对重复访问有效果，无法优化第一次加载时间



##### Lazy Loading

也就是异步import 的概念，在函数运行中动态引入某个模块的，例如路由懒加载



##### 预加载模块

> 官方推荐编码方式
>
> 通过注释webpackPrefetch来实现预加载功能

```js
import(/* webpackPrefetch: true */ 'LoginModal');
```



#### 打包库文件

```javascript
const path = require('path')
module.exports = {
  entry: '../src/index',
  externals: ['lodash'],
  // 如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals。这个功能主要是用在创建一个库的时候用
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library', // 打包名
    library: 'library', // 注入全局变量
    libraryTarget: 'umd' // 全平台打包方式
  }
}
```



#### externals

externals主要为告诉wbpack打包的时候忽略那些库，在打包项目的时候可以引入cdn，同时配置externals，来做到不加载库文件，

同时也可以配置不同环境的打包代码，例如原始环境，exmodules，common环境



#### 项目打包优化

使用exclude，来去除无需打包的js代码

尽可能少的使用plugins，尤其是开发环境，可优化启动速度

关于项目启动速度优化： DllPlugin

##### DllPlugin

对于库的代码，也就是不经常变动的代码，可以单独抽离出来，这样以后打包就不编译这些模块了

过程：

- 对库进行单独打包，并使用webpack.DllPlugin生成manifest.json的映射文件
- 通过addAssetHtmlwebpackPlugin进行打包生成的第三方代码的注入，并使用webpack.DllReferencePlugin来完成对manifest.json文件配置读取



webpack.dll.js

> 对第三方库进行提取，并生成manifest映射文件

```js
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    lodash: ['lodash'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]', // 必须暴露出去,才可以被引用
  },
  plugins: [
    // 库映射关系文件,
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json'),
    }),
  ],
}

```



webpack.common.js

> 将生成的dll文件进行直接注入，打包到时候就不会在进行打包库文件了

```javascript
 // 向生成的html里面注入一个文件
new addAssetHtmlWebpackPlugin({
  filepath: path.resolve(__dirname, '../dll/vendors.dll.js'),
}),
// 注入第三方库的映射文件
new webpack.DllReferencePlugin({
  manifest: path.resolve(__dirname, '../dll/vendors.manifest.json'),
}),
```

