const CURRENT_PATH = process.cwd()

const { join } = require('path')
const port = require('read-pkg-up').sync().pkg.port

const mongoBaseUri = process.env.MONGODB_URI

module.exports = {
  port: port,
  ENV_VAR: {
    local: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: 'mongodb://127.0.0.1:27017/board',
      baseUrl: 'http://localhost:4089/',
      serverUrl: 'http://devmini.imclass.cn:80/'
    },
    development: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: mongoBaseUri,
      baseUrl: 'https://miniwb.imclass.cn/',
      serverUrl: 'http://devmini.imclass.cn:80/'
    },
    testing: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: mongoBaseUri,
      baseUrl: 'https://test.imclass.cn',
      serverUrl: 'http://testmini.imclass.cn:80/'
    },
    production: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: mongoBaseUri,
      baseUrl: 'https://www.imclass.cn',
      serverUrl: 'http://miniserver.imclass.cn:80/'
    }
  },
  webpackConfig: {
    build: {
      assetsRoot: join(CURRENT_PATH, '/public'),
      assetsSubDirectory: 'dist',
      productionSourceMap: true,
      productionGzip: false,
      productionGzipExtensions: ['js', 'css'],
      bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
      port: port,
      autoOpenBrowser: false,
      assetsSubDirectory: 'dist',
      entries: join(CURRENT_PATH, '/src/**/client/main.js'),
      proxyTable: {
        // '/server': {
        //   target: 'https://dev.hoozha.com:8999/server/',
        //   changeOrigin: true,
        //   pathRewrite: {
        //     '^/server': ''
        //   }
        // }
      },
      cssSourceMap: false
    }
  }
}
