const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('isomorphic-fetch');
const ora = require('ora');

const { toolServer, resource } = require(`${__dirname}/../package.config.js`);
const options = require(`${__dirname}/../_utils/options`);

function saveSome(something) {
  // 保存API;
  const args = [
    `${toolServer}/${something}`, {
      method: 'GET'
    }
  ];
  const spinner = ora(`fetching ${something}...`);
  spinner.start();
  fetch(...args)
    .then(res => res.json())
    .then(json => {
      resource[something].map(item => {
        fs.writeFile(`${path.resolve(item.target)}`, item.format(json), 'utf-8', (err) => {
          if (err) {
            console.log(chalk.red(err));
            process.exit();
          }
          spinner.stop();
          console.log(chalk.green(`fetch ${something} successfully!`));
        });
      });
    })
    .catch(error => {
      console.log(error);
      process.exit();
    });
}

// 生成dll
function fetchSome() {
  const [, something] = options._;
  if (something) {
    saveSome(something);
  } else {
    Object.keys(resource).map(item => {
      saveSome(item);
    });
  }
}

try {
  module.exports = fetchSome();
} catch (e) {
  console.log(e);
}
