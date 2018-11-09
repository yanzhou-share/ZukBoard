const CURRENT_PATH = process.cwd()

const { join } = require('path')
const port = require('read-pkg-up').sync().pkg.port

const mongoBaseUri = process.env.MONGODB_URI

module.exports = {
  port: port,
  ENV_VAR: {
    development: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: 'mongodb://127.0.0.1:27017/board',
      baseUrl: 'http://127.0.0.1:4099',
      serverUrl: 'http://devmini.imclass.cn:80/'
    },
    testing: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: 'mongodb://127.0.0.1:27017/board',
      baseUrl: 'http://127.0.0.1:4099',
      serverUrl: 'http://testmini.imclass.cn:80/'
    },
    production: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: 'mongodb://127.0.0.1:27017/board',
      baseUrl: 'http://www.imclass.cn',
      serverUrl: 'http://miniserver.imclass.cn:80/'
    },
    heroku: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: mongoBaseUri,
      baseUrl: 'http://www.imclass.cn',
      serverUrl: 'http://miniserver.imclass.cn:80/'
    },
    now: {
      staticBaseUrl: '/',
      apiUrl: '',
      db: mongoBaseUri,
      baseUrl: 'http://www.imclass.cn',
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
