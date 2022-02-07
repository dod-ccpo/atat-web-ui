// const path = require('path')
// const HtmlWebPackPlugin = require('html-webpack-plugin')
const servicenowConfig = require('./servicenow.config')
// const { merge } = require('webpack-merge');

// const ROOT_PATH = path.join(__dirname, '../')

const DEFAULTS = {
  ASSET_SIZE_LIMIT: 10000
}
const CONFIG = {
  ...DEFAULTS,
  ...servicenowConfig
}


module.exports = {

  // eslint-disable-next-line no-unused-vars
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {

      // config.entry = {
      //   [CONFIG.JS_API_PATH + 'app']: ['./src/main.js'],
      // }

      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendors: {
              chunks: 'all',
              minChunks: 1,
              maxSize: 0,
              name: 'vendor',
              test: /([\\/]node_modules[\\/])|(assets\/)/,
              priority: -10,
            },
          },
        },
      }

      config.output.filename = 'js/[name]-[hash]-js'
      config.output.chunkFilename = 'js/[name]-[chunkhash]-js'

    }
  },
  chainWebpack: config => {


    if (process.env.NODE_ENV === 'production') {
    config.module
    .rule("images")
    .use("url-loader")
    .loader("url-loader")
    .tap(options => Object.assign(options, 
      { 
        limit: CONFIG.ASSET_SIZE_LIMIT,
        fallback: {
          ...options.fallback,
          options: {
            name: 'img/[name]-[hash:6]-[ext]',
          }
         
        }
      
      }));

      if (process.env.NODE_ENV === 'development') {
        config.plugin('define').tap((definitions) => {
          definitions[0]['process.env']['VUE_APP_USER'] = JSON.stringify(servicenowConfig.VUE_APP_USER);
          definitions[0]['process.env']['VUE_APP_PASSWORD'] = JSON.stringify(servicenowConfig.VUE_APP_PASSWORD);
          return definitions;
        });
      }




      // imgsRule.options = {
      //   limit: CONFIG.ASSET_SIZE_LIMIT,
      //   name: 'img/[name]-[hash:6]-[ext]',
      // }

      //   config.module.rule('fonts').
      //   fonts.options = {
      //     limit: CONFIG.ASSET_SIZE_LIMIT,
      //     name: 'assets/[name]-[hash:6]-[ext]',
      //   }
      // }
    }
  },
  css: {
    extract: false,
  },
}
