const { remoteServer } = require('./package.json')

module.exports = {
  // 输出目录
  distPath: './dist',
  // 公用
  commonPath: './common',
  // 客户端目录
  clientPath: './client',
  // 核心目录
  corePath: './client/_Root',
  // browserSync配置
  'browserSync': {
    port: 3000,
    open: false
  },
  // dev环境的js加载配置
  devJSloader: [{
    loader: 'react-hot-loader'
  }, {
    loader: 'babel-loader'
  }],
  // 静态资源配置
  resource: {
    [`${remoteServer}/svg`]: [{
      target: './common/svg/SVG.html',
      format: json => json.data
    }],
    [`${remoteServer}/menu`]: [{
      target: './common/menu/MENUS.json',
      format: json => JSON.stringify(json.data.menus)
    }, {
      target: './common/menu/PROJECTS.json',
      format: json => JSON.stringify(json.data.projects)
    }],
    [`${remoteServer}/api`]: [{
      target: './common/api/data.json',
      format: json => JSON.stringify(json.data)
    }]
  },
  // 加密配置
  UglifyJsPlugin: {
    compress: {
      warnings: false,
      drop_console: true
    }
  }
};