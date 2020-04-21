const loaderUtils = require('loader-utils')
module.exports = function (source) {
  const option = loaderUtils.getOptions(this)
  return source.replace('hello', this.query.name)
}


