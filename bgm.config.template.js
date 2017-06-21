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
  remoteServer: 'http://localhost:3008',
  // 静态资源配置
  resource: {
    '/svg': [{
      targetPath: `data/svg.html`,
      format: json => json.data
    }],
    '/menu': [{
      targetPath: `data/menus.json`,
      format: json => JSON.stringify(json.data.menus)
    }, {
      targetPath: `data/projects.json`,
      format: json => JSON.stringify(json.data.projects)
    }],
    '/api': [{
      targetPath: `data/api.json`,
      format: json => JSON.stringify(json.data)
    }],
    '/config': [{
      targetPath: `data/config.json`,
      format: json => JSON.stringify(json)
    }],
    '/images': (json) => json.map(item => ({
      type: 'blob',
      originPath: `${item}`,
      targetPath: `common/${item}`,
    })),
  },
  // 加密配置
  UglifyJsPlugin: {
    compress: {
      warnings: false,
      drop_console: true
    }
  }
};
