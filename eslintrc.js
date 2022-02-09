module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
    es2020: true,
  },
  globals: {
    cy: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: "es2020",
  },
  ignorePatterns: ["**/*.min.js",  "**/*.config.js","**/*.postbuild.js"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "valid-typeof": "warn",
  },
  overrides: [
    {
      files: ["**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: {
        jest: true,
      },
    },
    {
      files: ["cypress/**/*.js"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": 0,
      },
    },
  ],
};
