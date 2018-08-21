var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({
      sourceMap: config.debug.productionSourceMap,
      extract: true
    })
  },
  devtool: config.debug.productionSourceMap
    ? '#source-map'
    : false,
  output: {
    path: config.debug.assetsRoot,
    publicPath: config.debug.assetsPublicPath,
    filename: utils.assetsPath('js/[name].[chunkhash].js', config.debug.assetsSubDirectory),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js', config.debug.assetsSubDirectory)
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.debug.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': config.debug.env.NODE_ENV
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.debug.index,
      template: 'index.html',
      inject: true,
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  ]
})

module.exports = webpackConfig
