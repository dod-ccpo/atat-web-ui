const servicenowConfig = require('./servicenow.config');
require('dotenv').config()

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
  
  filenameHashing : false,
  configureWebpack: (config) => {
    if(process.env.NODE_ENV === 'production'){
    config.output.filename = 'js/[name]-js';
    config.output.chunkFilename = 'js/vendor-js';
    optimization = {
      splitChunks: {
        automaticNameDelimiter: '-',
        chunks: 'all',
        minChunks: 1,
        maxSize: 0,
        cacheGroups:{
          defaultVendors:{
            test: /([\\/]node_modules[\\/])|(assets\/)/,
            name: 'js/[name]-js',
            priority: -10,
          }
        }
      }
    }
  } else {
    config.devtool= 'source-map'
  }
  },
  chainWebpack: config => {
    let BASE_API_URL = process.env.BASE_API_URL;
    let VERSION = process.env.VERSION;
    if (!VERSION)
    {
      VERSION = "1.0.0";
    }
    if (!BASE_API_URL){
      console.error("You must provide a value for property BASE_API_URL. Stopping.")
      return process.exit(1)
    }
    BASE_API_URL += BASE_API_URL.endsWith("/") ? "api" : "/api"
    const SNOWUSER = process.env.NODE_ENV === 'development' ? process.env.SNOWUSER:''
    const SNOWPASS = process.env.NODE_ENV === 'development' ? process.env.SNOWPASS:''
    const SNOW_USER_SYSID = process.env.NODE_ENV === 'development' 
      ? process.env.userId : "e0c4c728875ed510ec3b777acebb356f"; // pragma: allowlist secret
    
      config.plugin('define').tap((definitions) => {
        let _base = definitions[0]["process.env"];
        definitions[0]["process.env"] = {
          ..._base,
          'VUE_APP_BASE_API_URL': JSON.stringify(BASE_API_URL),
          'VUE_APP_SNOWUSER': JSON.stringify(SNOWUSER),
          'VUE_APP_SNOWPASS': JSON.stringify(SNOWPASS),
          'SNOW_USER_SYSID': JSON.stringify(SNOW_USER_SYSID),
          'VERSION': JSON.stringify(VERSION)
        };
        return definitions;
      });
  },
  devServer: {
    open: true,
    setupExitSignals: true,

    client: {
      logging: 'error',
      progress: false,
      overlay: false,
      // {
      //   errors: true,
      //   warnings: true,
      //   runtimeErrors: true
      // }
    }
  },
  css: {
    extract: false
  }
}
