const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const minimist = require('minimist')
const options = minimist(process.argv.slice(2))

const styleMatch = require('./styleMatch')
const packageConfig = require('../package.config')

exports.dllDepend = dllDepend()
exports.isProd = isProd
exports.resolveConfig = resolveConfig
exports.webpackPromise = webpackPromise

function dllDepend() {
  try {
    fs.readFileSync(path.resolve(packageConfig.distPath, 'dll-manifest.json'))
    return false
  } catch (e) {
    return true
  }
}

function isProd() {
  const [command] = options._
  switch (command) {
  case 'server':
    return false
  case 'dll':
    return true
  case 'build':
    return true
  default:
    return false
  }
}

function resolveConfig(config) {

  // 生产环境加密
  if (isProd()) {
    const [, host] = options._
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          NODE_HOST: JSON.stringify(host),
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true
        }
      })
    )
  }

  // 有资源文件夹的处理
  if (packageConfig.assetsPath) {
    const [assetsPath, assetsTargetPath] = packageConfig.assetsPath
    config.module.rules.push(
      /**** assets下的css和less不做cssModule ****/
      styleMatch('css', {
        include: [path.resolve(assetsPath)],
        isProd: isProd(),
      }),
      styleMatch('less', {
        include: [path.resolve(assetsPath)],
        isProd: isProd(),
      }),
    )
    config.plugins.push(
      new CopyWebpackPlugin([{
        from: assetsPath,
        to: assetsTargetPath
      }])
    )

    return config
  }
  return config
}

function webpackPromise(config) {
  return new Promise(function (resolve, reject) {
    webpack(resolveConfig(config), function (err) {
      if (err) {
        reject(err)
        throw new Error(JSON.stringify(err))
      }
      resolve()
    })
  })
}
