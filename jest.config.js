module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ["/node_modules/(?!vuetify/)"],
  testMatch: ["**/src/**/*.spec.ts", "**/src/**/*.spec.js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.spec.ts", "src/**/*.vue"],
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules"
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "vue"
  ],
  transform: {
   
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.ts$": "ts-jest"
  },
 
  verbose: true,
  testURL: "http://localhost/"
 
}