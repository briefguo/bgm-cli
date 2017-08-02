/*eslint-disable no-console*/

const chalk = require('chalk')
const fs = require('mz/fs')
const path = require('path')
const fetch = require('isomorphic-fetch')
const ora = require('ora')
const request = require('request')

const { resource, remoteServer } = require(`../package.config`)
const { mkdirSync, options } = require(`../utils`)

async function savaOne(item, json) {
  const targetPath = path.resolve(item.targetPath)
  const exists = await fs.exists(`${targetPath}`)
  if (!exists) {
    const pathArray = item.targetPath.split('/')
    pathArray.pop()
    const dirs = pathArray.join('/')
    mkdirSync(dirs)
  }

  switch (item.type) {
  case 'blob':
    request([remoteServer, item.originPath].join('/'))
      .pipe(fs.createWriteStream(targetPath))
    break
  default:
    await fs.writeFile(`${targetPath}`, item.format(json), item.options ? item.options(json) : { encoding: 'utf8' })
  }
}

async function fetchOne(something) {

  const spinner = ora(`fetching ${something}...`)
  spinner.start()

  const args = [`${remoteServer}${something}`, { method: 'GET' }]
  const json = await fetch(...args).then(res => res.json())
  let source
  if (Array.isArray(resource[something])) {
    source = resource[something]
  } else if (typeof resource[something] === 'function') {
    source = resource[something](json)
  }
  if (source.length == 0) {
    spinner.stop()
    console.log(chalk.red(`${something}目录暂无文件`))
    return
  }
  try {
    await Promise.all(source.map(item => savaOne(item, json)))
    spinner.stop()
    console.log(chalk.green(`${something} saved!`))
  } catch (e) {
    console.log(chalk.red(e))
    process.exit()
  }
}

// 生成dll
async function resolveInput() {
  const spinner = ora(`fetching...`)
  spinner.start()
  const [, something] = options._
  if (something) {
    await fetchOne(something)
  } else {
    await Promise.all(Object.keys(resource).map(item => fetchOne(item)))
  }
  spinner.stop()
}

module.exports = resolveInput()
