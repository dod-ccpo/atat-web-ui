module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transformIgnorePatterns: ["/node_modules/(?!vuetify/)"],
  testMatch: [
    "**/src/components/*.spec.ts",
    "**/src/steps/**/*.spec.ts",
    "**/src/steps/**/**/*.spec.ts",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/components/*.{vue}",
    "src/steps/**/*.{vue}",
    "src/steps/**/**/*.{vue}"
  ],
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