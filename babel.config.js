// instrument .js and .vue files
const plugins = [];
if (process.env.NODE_ENV === "test") {
  //  plugins.push();
}
module.exports = {
  "presets": [
    ["@babel/preset-env"]
  ],

  // "plugins": [
  //   "@babel/plugin-transform-runtime",
  //   // ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
  //   // "@babel/plugin-transform-class-properties"
  // ]
}