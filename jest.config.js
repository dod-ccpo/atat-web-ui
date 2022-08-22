const { sassFalse } = require("sass");

module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  //collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
  collectCoverageFrom: [
    "<rootDir>/src/components/*.{vue,ts}",
    "<rootDir>/src/helpers/*.{vue,ts}",
    "<rootDir>/src/store/taskOrder/index.ts",
    "<rootDir>/src/router/resolvers/index.ts",


    //  "src/components/*.{js|vue}",
    // "src/components/**/*.{js|vue}",
    // "<rootDir>/src/steps/05-PerformanceRequirements/DOW/ComputeForm.{vue|js}",
    // "!**/*.{ts}",
    // "!**/src/steps/**/*.{ts|vue}",
    // "!**/src/api/**/*.{ts|vue}",
    // "src/steps/**/**/*.vue"
  ],
  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "<rootDir>/src/store/",
  //   "<rootDir>/src/api/",
  //   "<rootDir>/src/steps/",
  // ],

  // Indicates which provider should be used to instrument code for coverage
  //  coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover",
    "html"
  ],
  // A set of global variables that need to be available in all test environments
  // globals: {
  //   'ts-jest': {
  //     diagnostics: true
  //   }
  // },
  // An array of file extensions your modules use
  moduleFileExtensions: [
    "ts",
    "js",
    "vue"
  ],
  // A preset that is used as a base for Jest's configuration
  // preset: "ts-jest",
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.js"
  ],
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/src/components/*.spec.ts",
    "<rootDir>/src/steps/**/*.spec.ts",
    "<rootDir>/src/steps/**/**/*.spec.ts",
    "<rootDir>/src/helpers/index.spec.ts",
    "<rootDir>/src/store/taskOrder/__test__/index.spec.ts",
    "<rootDir>/src/router/resolvers/__test__/index.spec.ts",

    // "<rootDir>/src/steps/05-PerformanceRequirements/DOW/ComputeForm.spec.ts",
  ],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "<rootDir>/node_modules",
  //   "<rootDir>/src/store",
  //   "<rootDir>/src/api",
  // ],
  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: "http://localhost/",
  // A map from regular expressions to paths to transformers
  // transform: {
  //   "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
  //   "^.+\\.ts$": ["ts-jest",{"sourceMaps": "inline"}]
  // },
  // // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/(?!vuetify/)"
  ],
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
 
}
