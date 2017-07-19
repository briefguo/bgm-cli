// const chalk = require('chalk');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const connectHistoryApiFallback = require('connect-history-api-fallback');

const packageConfig = require(`${__dirname}/../package.config`);
const dllDepend = require(`${__dirname}/../_utils/dllDepend`);

// 生成dll
function startServer() {
  const devWebpackConfig = require(`${__dirname}/../webpack/dev.config`);
  const __distPath = packageConfig.distPath;
  const bundler = webpack(devWebpackConfig);
  const devMiddleware = webpackDevMiddleware(bundler, {
    publicPath: '/',
    stats: {
      hash: true,
      chunks: false, // Makes the build much quieter
      colors: true // Shows colors in the console
    }
  });

  const opts = Object.assign({
    port: 3000,
    open: false
  }, {
    server: {
      baseDir: __distPath,
      middleware: [
        connectHistoryApiFallback(),
        devMiddleware,
        webpackHotMiddleware(bundler, {
          log: () => {},
          heartbeat: 2000 // <== add this line
        })
      ]
    }
  });

  // 开发服务器OK
  devMiddleware.waitUntilValid(function () {

  });

  // 开发服务器Invalid
  devMiddleware.invalidate(function () {

  });

  return browserSync(opts);

}

if (dllDepend) {
  module.exports = dllDepend(function () {
    startServer();
  });
} else {
  module.exports = startServer();
}
