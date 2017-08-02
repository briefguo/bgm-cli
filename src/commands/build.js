/*eslint-disable no-console*/

const ora = require('ora')
const chalk = require('chalk')

const { dllDepend, webpackPromise } = require(`../utils`)

// 生成dll
async function packProd() {
  const spinner = ora('building...')
  spinner.start()
  if (dllDepend) {
    await require('./dll')
  }
  const prodConfig = require(`../webpack/prod.config`)
  await webpackPromise(prodConfig)
  spinner.stop()
  console.log(chalk.green(`build successfully!`))
  process.exit()
}

module.exports = packProd()
