// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')

var config = require('../config/index')
var path = require('path')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.debug.conf')

var assetsPath = path.join(
  config.debug.assetsRoot, config.debug.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
