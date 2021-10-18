// 打包核心配置文件
let Available = ['dist-a', 'dist-b'] // dist-a 环境a代码包 dist-b 环境b代码包 
/**
 * 获取更新配置
 * @param {String} objName 当前更新名称
 * @returns
 */
module.exports = (objName) => {
  if (!Available.includes(objName)) {
    console.log('当前项目不存在您输入的更新命令,请检查更新名称')
    process.exit(0)
  }
  return {
    host: 'xx.xx.xx.xx', // 服务器地址
    username: 'root',
    password: 'xxxxxxxxxx',
    buildPath: '', // 本地打包项目地址(深入就这个)
    buildobj: 'dist', // 本地打包文件名称
    uploadDir: '/xx/xx/xx', // 服务端项目地址
    objname: objName, // 打包项目名称
    backObject: 'objName', // 备份的文件夹名称
    buildScript: 'npm run build' // 更新命令
  }
}