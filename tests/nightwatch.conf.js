/* eslint-disable @typescript-eslint/no-var-requires */

let cd = require("chromedriver").path;

module.exports = {
  src_folders: [],

  test_settings: {
    default: {
      launch_url: "${VUE_DEV_SERVER_URL}",
      globals: {
        waitForConditionTimeout: 5000,
      },
    },

    selenium: {
      // Selenium Server is running locally and is managed by Nightwatch
      selenium: {
        start_process: true,
        port: 4444,
        server_path: require("selenium-server").path,
        cli_args: {
          "webdriver.ie.driver":
            process.platform === "win32" ? require("iedriver").path : "",
        },
      },
    },
    webdriver: {
      start_process: true,
    },
    "webdriver.chrome": {
      extends: "webdriver",
      server_path: require("chromedriver").path,
      cli_args: ["--verbose"],
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          w3c: false,
        },
      },
    },
    "webdriver.edge": {
      extends: "webdriver",
      selenium_port: 17556,
      selenium_host: "127.0.0.1",
      slient: false,
      default_path_prefix: "",
      desiredCapabilities: {
        browserName: "MicrosoftEdge",
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
    },

    "selenium.chrome": {
      extends: "selenium",
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          w3c: false,
        },
      },
    },

    "selenium.firefox": {
      extends: "selenium",
      desiredCapabilities: {
        browserName: "firefox",
      },
    },

    "selenium.ie": {
      extends: "selenium",
      desiredCapabilities: {
        browserName: "internet explorer",
        javascriptEnabled: true,
      },
    },
  },
};
