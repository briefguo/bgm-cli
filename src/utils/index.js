/*eslint-disable no-console*/

const Table = require('cli-table')
const chalk = require('chalk')
const fs = require('fs')
const minimist = require('minimist')
const options = minimist(process.argv.slice(2))
const { dllDepend, isProd, resolveConfig, webpackPromise } = require('./env')

const table = new Table({
  head: ['Template Name', 'Owner/Name', 'Branch'],
  style: {
    head: ['green']
  }
})

function listTplTable(tplList, lyric) {
  const list = Object.keys(tplList)
  if (list.length) {
    list.forEach((key) => {
      table.push([key, tplList[key]['owner/name'], tplList[key]['branch']])
      if (table.length === list.length) {
        console.log(table.toString())
        if (lyric) {
          console.log(chalk.green(`\u2714 ${lyric}`))
        }
        process.exit()
      }
    })
  } else {
    console.log(table.toString())
    if (lyric) {
      console.log(chalk.green(`\u2714 ${lyric}`))
    }
    process.exit()
  }
}

function mkdirSync(url, mode, cb) {
  var arr = url.split("/")
  mode = mode || '0755'
  cb = cb || function () {}
  if (arr[0] === ".") { //处理 ./aaa
    arr.shift()
  }
  if (arr[0] == "..") { //处理 ../ddd/d
    arr.splice(0, 2, arr[0] + "/" + arr[1])
  }

  function inner(cur) {
    if (!fs.existsSync(cur)) { //不存在就创建一个
      fs.mkdirSync(cur, mode)
    }
    if (arr.length) {
      inner(cur + "/" + arr.shift())
    } else {
      cb()
    }
  }
  arr.length && inner(arr.shift())
}

exports.dllDepend = dllDepend
exports.isProd = isProd
exports.resolveConfig = resolveConfig
exports.webpackPromise = webpackPromise
exports.listTplTable = listTplTable
exports.mkdirSync = mkdirSync
exports.options = options
exports.styleMatch = require('./styleMatch')
