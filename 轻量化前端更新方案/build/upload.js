const fs = require('fs')
const path = require('path')
const { NodeSSH } = require('node-ssh')
const archiver = require('archiver')
const inquirer = require('inquirer')
const exec = require('child_process').exec
const ssh = new NodeSSH()
const uploadFun = require('../upload.config.js')


/**
 * 获取当前平台
 */
let objName = process.argv[2] // 更新名字
let startTime = null // 程序开始更新的时间
// 获取上传服务器配置
let config = uploadFun(objName)
const verifyList = [
  {
    type: 'input',
    message: '您正在更新到线上环境,请确认接口域名',
    name: 'objName'
  }
]
inquirer.prompt(verifyList).then(() => {
  uploadBuild()
})

function uploadBuild() {
  startTime = new Date()
  console.log(`${objName}开始更新`)
  let buildcmd = exec(config.buildScript, (error, stdout, stderr) => {
    if (!error) {
      console.log('打包完成', stdout)
      app()
    } else {
      console.error('打包出现错误', stderr)
      process.exit(0)
    }
  })
  buildcmd.stdout.on('data', data => {
    console.log(data.toString())
  })
}

/**
 * 通过ssh链接服务器
 */
function app() {
  ssh
    .connect({
      host: config.host,
      username: config.username,
      password: config.password
    })
    .then(res => {
      // 上传代码压缩包
      uploadData()
    })
    .catch(err => {
      console.log(err)
    })
}

/**
 * 上传代码 压缩现有代码
 */
function uploadData() {
  // 创建文件输出流
  let output = fs.createWriteStream(
    `${path.join(__dirname, '../')}${config.buildPath}/${config.objname}.zip`
  )
  // 设置压缩级别
  let archive = archiver('zip', {
    zlib: {
      level: 8
    }
  })
  // 存档警告
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn('stat故障和其他非阻塞错误')
    } else {
      throw err
    }
  })
  // 存档出错
  archive.on('error', function(err) {
    throw err
  })
  // 通过管道方法将输出流存档到文件
  archive.pipe(output)
  archive.directory(
    `${path.join(__dirname, '../')}${config.buildPath}/${config.buildobj}`,
    '/'
  )
  archive.finalize()
  // 文件输出流结束
  output.on('close', function() {
    console.log(
      `总共 ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB,完成源代码压缩`
    )
    ssh
      .putFile(
        `${path.join(__dirname, '../')}${config.buildPath}/${
          config.objname
        }.zip`,
        `${config.uploadDir}/${config.objname}.zip`
      )
      .then(() => {
        console.log('程序zip上传成功,判断线上是否需要备份')
        runcmd()
      })
      .catch(err => {
        console.log(err)
      })
  })
}

/**
 * 执行ssh命令 判断当前是否存在备份
 */
function runcmd() {
  ssh
    .execCommand('ls', {
      cwd: config.uploadDir
    })
    .then(res => {
      if (res.stdout) {
        let fileList = res.stdout.split('\n')
        if (config.objname == config.backObject) {
          if (fileList.includes(config.objname)) {
            console.log('当前更新为线上正常环境,开始进行备份')
            backupData()
          } else {
            console.log('当前更新为线上正常环境,并且是第一次,将跳过备份')
            cmdunzip()
          }
        } else {
          console.log('当前为测试环境,无需备份,直接解压上传压缩包')
          cmdunzip()
        }
      } else if (res.stderr) {
        console.log('查询指定目录失败')
      } else {
        console.log('ssh链接发生了错误')
      }
    })
}

/**
 * 备份项目
 */
function backupData() {
  ssh
    .execCommand(
      `mv ${config.objname} backup/${
        config.objname
      }_backup${new Date().getTime()}`,
      {
        cwd: config.uploadDir
      }
    )
    .then(res => {
      if (res.stderr) {
        console.log('备份发生错误', res.stderr)
      } else {
        console.log('完成备份,解压最新代码')
        cmdunzip()
      }
    })
    .catch(err => {
      console.log('备份发生未知链接错误', err)
    })
}

/**
 * 解压最新代码zip
 */
function cmdunzip() {
  // 解压程序
  ssh
    .execCommand(
      `rm -rf ${config.objname} && unzip -o -d ${config.uploadDir}/${config.objname} ${config.objname}.zip  && rm -f ${config.objname}.zip`,
      {
        cwd: config.uploadDir
      }
    )
    .then(() => {
      console.log(`项目包完成解压,${config.objname}项目部署成功了!`)
      console.log(
        `项目更新时长${(new Date().getTime() - startTime.getTime()) / 1000}s`
      )
      return deletelocalFile().then(() => {
        console.log('本地缓存zip清除完毕')
      })
    })
    .then(() => {
      // 针对mac电脑打包生成.DS_Store文件进行处理
      ssh
        .execCommand(`rm -rf ${config.objname}/static/.DS_Store`, {
          cwd: config.uploadDir
        })
        .then(() => {
          console.log('线上项目.DS_Store删除完成')
          ssh.dispose()
          process.exit(0)
        })
        .catch(err => {
          console.log(err)
        })
    })

    .catch(err => {
      console.log('解压出现错误', err)
    })
}
/**
 *删除本地生成的压缩包
 */
function deletelocalFile() {
  return new Promise((resolve, reject) => {
    fs.unlink(
      `${path.join(__dirname, '../')}${config.buildPath}/${config.objname}.zip`,
      err => {
        if (err) {
          reject(err)
          throw err
        } else {
          resolve()
        }
      }
    )
  })
}
