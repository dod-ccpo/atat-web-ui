// instrument .js and .vue files
const plugins = [];
if (process.env.NODE_ENV === "test") {
  plugins.push(["babel-plugin-istanbul", {
    extension: [".vue"],
  }, "istanbul-coverage"]);
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins,
}