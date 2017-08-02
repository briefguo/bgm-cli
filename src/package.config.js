const path = require('path')

try {
  // 项目配置
  module.exports = require(path.resolve('./bgm.config'))
} catch (e) {
  // default配置
  module.exports = {
    // 输出目录
    distPath: './dist',
    // 公用
    commonPath: './common',
    // 客户端目录
    clientPath: './client',
    // 核心目录
    corePath: './client/Root',

    // 资源目录[origin,target]
    // assetsPath: ['./assets', 'assets'],

    rootDirs: ['node_modules', './common', './client'],

    remoteServer: 'http://localhost:3008',

    // 静态资源配置
    resource: {
      '/svg': [{
        targetPath: `data/svg.html`,
        format: (json) => json.data
      }],
      '/menu': [{
        targetPath: `data/menus.json`,
        format: (json) => JSON.stringify(json.data.menus)
      }, {
        targetPath: `data/projects.json`,
        format: (json) => JSON.stringify(json.data.projects)
      }],
      '/api': [{
        targetPath: `data/api.json`,
        format: (json) => JSON.stringify(json.data)
      }],
      '/config': [{
        targetPath: `data/config.json`,
        format: (json) => JSON.stringify(json)
      }],
      '/images': (json) => json.map((item) => ({
        type: 'blob',
        originPath: `${item}`,
        targetPath: `common/${item}`,
      })),
    },
  }
}
