/*eslint-disable no-console*/

const path = require('path')
const del = require('del')
const chalk = require('chalk')
const packageConfig = require('../package.config')

function clean() {
  del.sync(path.resolve(packageConfig.distPath, '**/*'))
  console.log(chalk.green(`clean ${packageConfig.distPath} successfully!`))
}

module.exports = clean()
