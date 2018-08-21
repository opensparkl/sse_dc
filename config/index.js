/**
 * Copyright (c) 2018 SPARKL Limited. All Rights Reserved.
 * Author <jacoby@sparkl.com> Jacoby Thwaites.
 * Used in build/xxx.js scripts for each environment.
 *
 * See http://vuejs-templates.github.io/webpack for documentation.
 */
var path = require('path')

module.exports = {
  build: {
    env: {
      NODE_ENV: '"production"'
    },
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  debug: {
    env: {
      NODE_ENV: '"development"'
    },
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: []
  },
  dev: {
    env: {
      NODE_ENV: '"development"'
    },
    port: 8099,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  }
}
