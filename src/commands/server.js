const ora = require('ora')
const webpack = require('webpack')
const browserSync = require('browser-sync')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const connectHistoryApiFallback = require('connect-history-api-fallback')

const packageConfig = require('../package.config')
const distPath = packageConfig.distPath
const { dllDepend, resolveConfig } = require('../utils')

// 生成dll
async function startServer() {
  const spinner = ora('Start Server...')
  spinner.start()
  if (dllDepend) {
    await require('./dll')
  }

  const devWebpackConfig = resolveConfig(require('../webpack/dev.config'))
  const bundler = webpack(devWebpackConfig)
  const devMiddleware = webpackDevMiddleware(bundler, {
    publicPath: '/',
    stats: {
      hash: true,
      chunks: false, // Makes the build much quieter
      colors: true // Shows colors in the console
    }
  })

  const opts = Object.assign({ port: 3000, open: false }, {
    server: {
      baseDir: distPath,
      middleware: [
        connectHistoryApiFallback(),
        devMiddleware,
        webpackHotMiddleware(bundler, {
          log: () => {},
          heartbeat: 2000 // <== add this line
        })
      ]
    }
  })

  // 开发服务器OK
  devMiddleware.waitUntilValid(function () {
    spinner.stop()
  })

  // 开发服务器Invalid
  devMiddleware.invalidate(function () {})

  return browserSync(opts)
}

module.exports = startServer()
