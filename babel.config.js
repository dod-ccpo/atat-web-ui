// instrument .js and .vue files
const plugins = [];
if (process.env.NODE_ENV === "test") {
  //  plugins.push();
}
module.exports = {
  presets: [
    '@vue/app',
  ],
  plugins,
}