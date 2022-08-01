const servicenowConfig = require('./servicenow.config')


const DEFAULTS = {
  ASSET_SIZE_LIMIT: 10000
}
const CONFIG = {
  ...DEFAULTS,
  ...servicenowConfig
}

module.exports = {

  transpileDependencies: [
    'vuex-module-decorators'
  ],

  // eslint-disable-next-line no-unused-vars
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {

      // config.entry = {
      //   [CONFIG.JS_API_PATH + 'app']: ['./src/main.ts'],
      // }

      config.optimization = {
        minimize: true,
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

    let BASE_API_URL =  process.env.BASE_API_URL;
    BASE_API_URL += BASE_API_URL.endsWith("/") ? "api" : "/api";
    let SNOWUSER = process.env.NODE_ENV === 'development' ? process.env.SNOWUSER :'';
    let SNOWPASS = process.env.NODE_ENV === 'development' ? process.env.SNOWPASS : '';

    config.plugin('define').tap((definitions) => {
      let _base = definitions[0]["process.env"];
      definitions[0]["process.env"] = {
        ..._base,
        'VUE_APP_BASE_API_URL': JSON.stringify(BASE_API_URL),
        'VUE_APP_SNOWUSER': JSON.stringify(SNOWUSER),
        'VUE_APP_SNOWPASS': JSON.stringify(SNOWPASS),
      };
      return definitions;
    });

    if (process.env.NODE_ENV === 'production') {
      config.module
        .rule("images")
        .use("url-loader")
        .loader("url-loader")
        .tap(options => Object.assign(options, {
          limit: CONFIG.ASSET_SIZE_LIMIT,
          fallback: {
            ...options.fallback,
            options: {
              name: 'img/[name]-[hash:6]-[ext]',
            }

          }

        }));

        config.module
        .rule("svg")
        .use("file-loader")
        .loader("file-loader")
        .tap(options => Object.assign(options, {
              name: 'img/[name]-[hash:6]-[ext]',
        }));

      config.module
        .rule("fonts")
        .use("url-loader")
        .loader("url-loader")
        .tap(options => Object.assign(options, {
          limit: CONFIG.ASSET_SIZE_LIMIT,
          fallback: {
            ...options.fallback,
            options: {
              name: 'other_assets/[name]-[hash:6]-[ext]',
            }

          }

        }));
    }
  },
  css: {
    extract: false,
  },
}