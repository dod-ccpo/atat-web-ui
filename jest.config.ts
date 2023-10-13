/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  testEnvironment: "jsdom",

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files 
  //for which coverage information should be collected
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
    '.+\\.(css|styl|less|sass|scss|svg)$': "<rootDir>/empty-module.js",
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // A preset that is used as a base for Jest's configuration
  //preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  preset: "ts-jest",

  // A list of paths to modules that run some code to configure 
  // or set up the testing framework before each test
  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.ts"
  ],
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "<rootDir>/src/home/**/*.spec.ts",
    "<rootDir>/src/components/*.spec.ts",
    "<rootDir>/src/components/**/*.spec.ts",
    "<rootDir>/src/steps/01-AcquisitionPackageDetails/COR_ACOR/*.spec.ts",
    "<rootDir>/src/steps/02-EvaluationCriteria/SummaryStepTwo.spec.ts",
    "<rootDir>/src/steps/03-Background/components/*.spec.ts",
    "<rootDir>/src/steps/03-Background/CurrentContract/**/*.spec.ts",
    "<rootDir>/src/steps/03-Background/CurrentEnvironment/*.spec.ts",
    "<rootDir>/src/steps/03-Background/SummaryStepFour.spec.ts",
    "<rootDir>/src/steps/04-ContractDetails/SummaryStepThree.spec.ts",
    "<rootDir>/src/steps/05-PerformanceRequirements/CurrentFunctions/ReplicateAndOptimize.spec.ts",
    "<rootDir>/src/steps/05-PerformanceRequirements/DOW/DOWLandingPage.spec.ts",
    "<rootDir>/src/steps/07-OtherContractConsiderations/*.spec.ts",
    "<rootDir>/src/steps/07-OtherContractConsiderations/*.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/BAA.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/BAALearnMore.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/Section508AccessibilityRequirements.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/Section508Standards.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/FOIACoordinator.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/FOIA.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/PII.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/PIIRecord.spec.ts",
    "<rootDir>/src/steps/08-StandardsAndCompliance/SummaryStepSeven.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/CurrentlyHasFunding.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/GeneratePackageDocumentsFunding.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/components/GeneratingDocumentsFunding.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/components/ReviewDocumentsFunding.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/RequireFundingDocuments.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/GTCInformation.spec.ts",
    "<rootDir>/src/steps/10-FinancialDetails/Upload7600.spec.ts",
    // "<rootDir>/src/steps/**/*.spec.ts",0
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
  // An array of regexp pattern strings that are matched 
  // against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [  "<rootDir>/node_modules" ],
 
  // This option sets the URL for the jsdom environment. 
  //It is reflected in properties such as location.href
  testEnvironmentOptions: {
    customExportConditions: ["node","node-addon"],
    url: "http://localhost/",

  },

  // A map from regular expressions to paths to transformers
  transform: {
    //"^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.vue$": ["@vue/vue2-jest", {sourceMaps: "inline"}],
  },
  // An array of regexp pattern strings that are matched against 
  // all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/(?!vuetify/)"
  ],
  // Indicates whether each individual test should be reported during the run
  verbose: true,
}
