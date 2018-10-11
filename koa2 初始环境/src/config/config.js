/* 存储所有的配置信息 */

let host = 'localhost' // 配置数据库
let port = 27017

let config =  {
  DB: `mongodb://${host}:${port}/..`, // 数据库链接
  secretOrPublicKey: 'private' // token秘钥
}

module.exports = config