module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
        
    console.log({webpackConfig, api, options});
  })
}