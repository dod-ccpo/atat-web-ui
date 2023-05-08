const { sassFalse } = require("sass");

module.exports = {
  testEnvironment: "jsdom",

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [ 
    "src/**/*.vue", 
    "src/**/index.ts", 
    "src/components/**/*.ts",
    "src/steps/**/*.ts", 
    "src/plugins/*.ts", 
    "src/dashboards/*.ts",  
    "src/services/*.ts", 
    "src/main.ts"
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    }
  },
  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [ ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "lcov"
  ],
  // An array of file extensions your modules use
  moduleFileExtensions: [
    "ts",
    "js",
    "vue"
  ],
  moduleNameMapper:{
    '.+\\.(css|styl|less|sass|scss|svg)$': "<rootDir>/empty-module.js"
  },
  // A preset that is used as a base for Jest's configuration
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.js"
  ],
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/src/home/**/*.spec.ts",
    "<rootDir>/src/components/*.spec.ts",
    "<rootDir>/src/components/**/*.spec.ts",
    // "<rootDir>/src/steps/**/*.spec.ts",
    "<rootDir>/src/store/**/*.spec.ts",
    "<rootDir>/src/router/**/*.spec.ts",
    "<rootDir>/src/helpers/*.spec.ts",
    "<rootDir>/src/api/**/*.spec.ts",
    "<rootDir>/src/action-handlers/**/*.spec.ts",
    "<rootDir>/src/portfolio/**/*.spec.ts",
    "<rootDir>/src/packages/**/*.spec.ts",
    "<rootDir>/src/portfolios/**/*.spec.ts",
    "<rootDir>/src/documentReview/**/*.spec.ts",
    "<rootDir>/src/plugins/*.spec.ts",
    "<rootDir>/src/dashboards/*.spec.ts",
    "<rootDir>/src/services/*.spec.ts",
    "<rootDir>/src/*.spec.ts"
  ],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [  "<rootDir>/node_modules" ],
 
  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: "http://localhost/",

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.vue$": ["@vue/vue2-jest", {"sourceMaps": "inline"}],
  },
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/(?!vuetify/)"
  ],
  // Indicates whether each individual test should be reported during the run
  verbose: true,
}
