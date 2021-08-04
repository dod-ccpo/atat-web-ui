module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transformIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/src/**/*.spec.ts"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.spec.ts", "src/**/*.vue"],
};
