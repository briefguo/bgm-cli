const chalk = require('chalk');
const webpack = require('webpack');

const options = require(`${__dirname}/../_utils/options`);
const packageConfig = require(`${__dirname}/../package.config`);
const dllDepend = require(`${__dirname}/../_utils/dllDepend`);

// 生成dll
function packProd() {
  const prodConfig = require(`${__dirname}/../webpack/prod.config`);
  const [, host] = options._;
  prodConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        NODE_HOST: JSON.stringify(host),
      }
    }),
    new webpack.optimize.UglifyJsPlugin(packageConfig.UglifyJsPlugin)
  );
  webpack(prodConfig, function (err) {
    if (err) {
      throw new Error('webpack', err);
    }
    
    console.log(chalk.green(`build successfully!`));
    process.exit();
  });
}

if (dllDepend) {
  module.exports = dllDepend(function () {
    packProd();
  });
} else {
  module.exports = packProd();
}
