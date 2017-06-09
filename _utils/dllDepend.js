const path = require('path');
const fs = require('fs');
const packDll = require('./dll');

function dllDepend() {
  try {
    const packageConfig = require('../package.config');
    fs.readFileSync(path.resolve(packageConfig.distPath, 'dll-manifest.json'));
  } catch (e) {
    return packDll;
  }
}

module.exports = dllDepend();
