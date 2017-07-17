const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

try {
  const bgmConfig = path.resolve('./bgm.config.js');
  // const bgmConfig = path.resolve('./.mdvarc.js');
  fs.readFileSync(bgmConfig);
  module.exports = require(bgmConfig);
} catch (e) {
  // console.log(e);
  throw new Error(chalk.red('缺少bgmConfig配置,请在项目根目录添加 bgm.config.js'), e);
}
