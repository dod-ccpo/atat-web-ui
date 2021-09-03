/* eslint-disable */
const path = require("path");
const deepmerge = require("deepmerge");
const chromedriver = require("chromedriver");
/* eslint-enable */

const startHeadless = process.env.VUE_NIGHTWATCH_HEADLESS === "1";
const concurrentMode = process.env.VUE_NIGHTWATCH_CONCURRENT === "1";
const userOptions = JSON.parse(process.env.VUE_NIGHTWATCH_USER_OPTIONS || "{}");
const chromeArgs = [];
const geckoArgs = [];

// user may have not installed geckodriver
let geckodriver = {};
try {
  geckodriver = require("geckodriver");
} catch (e) {
  console.info("Not Firefox driver install");
}

if (startHeadless) {
  chromeArgs.push("headless");
  geckoArgs.push("--headless");
}

const defaultSettings = {
  src_folders: ["dist/tests/e2e/page_tests"],
  output_folder: "tests/e2e/reports/browserstack",
  page_objects_path: "tests/e2e/page_objects",
  custom_assertions_path: "tests/e2e/custom_assertions",
  custom_commands_path: "tests/e2e/custom_commands",
  test_workers: concurrentMode,

  test_settings: {
    default: {
      launch_url: "${VUE_DEV_SERVER_URL}",
      detailed_output: !concurrentMode,
      globals: {
        waitForConditionTimeout: 5000,
      },
    },
    chrome: {
      desiredCapabilities: {
        browserName: "chrome",
        resolution: "1920x1080",
        chromeOptions: {
          w3c: false,
          args: chromeArgs,
        },
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: "firefox",
        resolution: "1920x1080",
        alwaysMatch: {
          acceptInsecureCerts: true,
          "moz:firefoxOptions": {
            args: geckoArgs,
          },
        },
      },
      webdriver: {},
    },
    ie11: {
      desiredCapabilities: {
        browser: "internet explorer",
        version: "11",
        platform: "WINDOWS",
        "browserstack.selenium_version": "3.141.59",
        "browserstack.ie.arch": "x32",
        "browserstack.ie.driver": "3.141.59",
        resolution: "1920x1080",
      },
    },
  },
};
const baseSettings = deepmerge(defaultSettings, webdriverServerSettings());
module.exports = deepmerge(baseSettings, adaptUserSettings(userOptions));

function adaptUserSettings(settings) {
  // The path to nightwatch external globals file needs to be made absolute
  // if it is supplied in an additional config file, due to merging of config files
  if (settings.globals_path) {
    settings.globals_path = path.resolve(settings.globals_path);
  }

  return settings;
}

function webdriverServerSettings() {
  return {
    selenium: {
      start_process: false,
      host: "hub-cloud.browserstack.com",
      port: 443,
      cli_args: {
        "webdriver.chrome.driver": chromedriver.path,
        "webdriver.gecko.driver": geckodriver.path,
      },
    },
    test_settings: {
      default: {
        desiredCapabilities: {
          "browserstack.user":
            process.env.BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME",
          "browserstack.key":
            process.env.BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACCESS_KEY",
          build: process.env.BROWSERSTACK_BUILD || "default_build",
          project: process.env.BROWSERSTACK_PROJECT || "default_project",
          "browserstack.debug": true,
          "browserstack.local": true,
        },
      },
      chrome: {
        desiredCapabilities: {
          "browserstack.user":
            process.env.BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME",
          "browserstack.key":
            process.env.BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACCESS_KEY",
          build: process.env.BROWSERSTACK_BUILD || "default_build",
          project: process.env.BROWSERSTACK_PROJECT || "default_project",
          "browserstack.debug": true,
          "browserstack.local": true,
        },
      },
      ie11: {
        desiredCapabilities: {
          "browserstack.user":
            process.env.BROWSERSTACK_USERNAME || "BROWSERSTACK_USERNAME",
          "browserstack.key":
            process.env.BROWSERSTACK_ACCESS_KEY || "BROWSERSTACK_ACCESS_KEY",
          build: process.env.BROWSERSTACK_BUILD || "default_build",
          project: process.env.BROWSERSTACK_PROJECT || "default_project",
          "browserstack.debug": true,
        },
      },
    },
  };
}
