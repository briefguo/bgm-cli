/*eslint-disable no-console*/
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch');
const ora = require('ora');
const request = require('request');

const { resource, remoteServer } = require(`${__dirname}/../package.config.js`);
const options = require(`${__dirname}/../_utils/options`);

function mkdirSync(url, mode, cb) {
  var arr = url.split("/");
  mode = mode || '0755';
  cb = cb || function () {};
  if (arr[0] === ".") { //处理 ./aaa
    arr.shift();
  }
  if (arr[0] == "..") { //处理 ../ddd/d
    arr.splice(0, 2, arr[0] + "/" + arr[1])
  }

  function inner(cur) {
    if (!fs.existsSync(cur)) { //不存在就创建一个
      fs.mkdirSync(cur, mode)
    }
    if (arr.length) {
      inner(cur + "/" + arr.shift());
    } else {
      cb();
    }
  }
  arr.length && inner(arr.shift());
}

function savaOne(item, json) {
  return new Promise(function (resolve, reject) {

    const targetPath = path.resolve(item.targetPath)

    fs.exists(`${targetPath}`, function (exists) {
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
        resolve(item.targetPath)
        break;
      default:
        fs.writeFile(`${targetPath}`, item.format(json), item.options ? item.options(json) : { encoding: 'utf8' }, (err) => {
          if (err) {
            reject(err)
          }
          resolve(item.targetPath)
        });
      }
    });
  });
}

function fetchOne(something) {

  const spinner = ora(`fetching ${something}...`);
  spinner.start();

  const args = [`${remoteServer}${something}`, { method: 'GET' }];
  fetch(...args)
    .then(res => res.json())
    .then(json => {

      let source
      if (Array.isArray(resource[something])) {
        source = resource[something]
      } else if (typeof resource[something] === 'function') {
        source = resource[something](json)
      }
      if (source.length == 0) {
        spinner.stop();
        console.log(chalk.red(`${something}目录暂无文件`));
        return
      }
      source.map(item => {
        savaOne(item, json)
          .then((info) => {
            spinner.stop();
            console.log(chalk.green(`${info} saved!`));
          })
          .catch((err) => {
            console.log(chalk.red(err));
            process.exit();
          })
      });

    })
    .catch(error => {
      console.log(error);
      process.exit();
    });
}

// 生成dll
function resolveInput() {
  const [, something] = options._;
  if (something) {
    fetchOne(something);
  } else {
    Object.keys(resource).map(item => {
      fetchOne(item);
    });
  }
}

try {
  module.exports = resolveInput();
} catch (e) {
  console.log(e);
}
