// instrument .js and .vue files
const plugins = [];
if (process.env.NODE_ENV === "test") {
  plugins.push(["babel-plugin-istanbul", {
    extension: [".vue"],
    // This will be set to "true" (a string) in most CI pipelines.
    // This helps work around some issues with coverage reporting between
    // environments.
    // TODO: Find a more permanent solution
    "useInlineSourceMaps": process.env.CI !== "true",
  }, "istanbul-coverage"]);
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins,
}