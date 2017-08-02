/*eslint-disable no-console*/

const chalk = require('chalk')
const ora = require('ora')

const dllConfig = require('../webpack/dll.config')
const { webpackPromise } = require('../utils')

// 生成dll
async function packDll() {
  try {
    const spinner = ora('Packing dll...')
    spinner.start()
    await webpackPromise(dllConfig)
    spinner.stop()
    console.log(chalk.green(`Dll has packed successfully!`))
    return 'done'
  } catch (e) {
    console.log(e)
  }
}

module.exports = packDll()
