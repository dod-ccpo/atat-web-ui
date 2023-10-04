/* eslint-disable max-len */
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
  // testMatch: [
  //   "<rootPath>/*.spec.ts",
  //   "<rootPath>/**/*.spec.ts"
  // ],
  // An array of regexp pattern strings that are matched 
  // against all test paths, matched tests are skipped
  testPathIgnorePatterns: [  
    "src/plugins/__tests__/Validation.spec.ts",
    "src/steps/01-AcquisitionPackageDetails/ContactInfo.spec.ts",
    "src/steps/01-AcquisitionPackageDetails/Organization.spec.ts",
    "src/steps/01-AcquisitionPackageDetails/ProjectOverview.spec.ts",
    "src/steps/01-AcquisitionPackageDetails/components/DoDAAC.spec.ts",
    "src/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/CreateEvalPlan.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/Differentiators.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/EvalPlanDetails.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/NoEvalPlan.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/Summary.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/components/Callout.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/components/CreateEvalPlanSlideOut.spec.ts",
    "src/steps/02-EvaluationCriteria/EvalPlan/components/CustomSpecifications.spec.ts",
    "src/steps/02-EvaluationCriteria/Exceptions.spec.ts",
    "src/steps/02-EvaluationCriteria/JandA/ImpactOfRequirement.spec.ts",
    "src/steps/02-EvaluationCriteria/JandA/UniqueSource.spec.ts",
    "src/steps/02-EvaluationCriteria/JustificationAndApproval.spec.ts",
    "src/steps/02-EvaluationCriteria/MRR/CertificationPOCTypeForm.spec.ts",
    "src/steps/02-EvaluationCriteria/MRR/CertificationPOCs.spec.ts",
    "src/steps/02-EvaluationCriteria/MRR/MarketResearchEfforts.spec.ts",
    "src/steps/02-EvaluationCriteria/components/FairOppExceptions.spec.ts",
    "src/steps/04-ContractDetails/PeriodOfPerformance.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/ArchitecturalDesign.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/ArchitecturalDesignDOW.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/ComputeFormElements.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/EntireDuration.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/OtherOfferingSummary.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/OtherOfferings.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/OtherRequirementSummary.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/ServiceOfferingDetails.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/ServiceOfferings.spec.ts",
    "src/steps/05-PerformanceRequirements/DOW/SummaryStepFive.spec.ts",
    "src/steps/10-FinancialDetails/CurrentlyHasFunding.spec.ts",
    "src/steps/10-FinancialDetails/FundingRequestLearnMore.spec.ts",
    "src/steps/10-FinancialDetails/GTCInformation.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/CannotProceed.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/CostSummary.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/EstimatesDeveloped.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/FeeCharged.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/GatherPriceEstimates.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/Index.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/SupportingDocumentation.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/SurgeCapabilities.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/SurgeCapacity.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/TravelEstimates.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/components/Card_Requirements.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/components/ICGELearnMore.spec.ts",
    "src/steps/10-FinancialDetails/IGCE/components/SlideOut_GatherPricesEstimates.spec.ts",
    "src/steps/10-FinancialDetails/IncrementalFunding.spec.ts",
    "src/steps/11-GeneratePackageDocuments/UploadSignedDocuments.spec.ts"
  ],
 
  // This option sets the URL for the jsdom environment. 
  //It is reflected in properties such as location.href
  testEnvironmentOptions: {
    customExportConditions: ["node","node-addon"],
    url: "http://localhost/",

  },

  // A map from regular expressions to paths to transformers
  transform: {
    //"^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.ts$": [
      "ts-jest", {
        tsconfig: 'tsconfig.json',
        isolateModules: true
      }
    ],
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
