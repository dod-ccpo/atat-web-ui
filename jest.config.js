module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transformIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/src/**/*.spec.ts"],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.spec.ts", "src/**/*.vue"],
};
