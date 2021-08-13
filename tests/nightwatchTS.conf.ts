import { NightwatchTestSettingScreenshots, NightwatchOptions } from "nightwatch";
//import { seleniumserver } from "selenium-server";
const seleniumServerPath = require("selenium-server").path;
const iedriverPath = require("iedriver").path;
const chromedriverPath = require("chromedriver").path;
//const mswebdriverPath = require("MicrosoftWebDriver.exe").path;


const defaultTestSettings: NightwatchTestSettingScreenshots = {
  launch_url: "${VUE_DEV_SERVER_URL}",
  globals: {
    waitForConditionTimeout: 5000
  },
  log_screenshot_data: true,
  screenshots: {
    enabled: true,
    path: 'captures/'
  },
  desiredCapabilities: {
    handlesAlerts: true
  }
}

const webdriverChromeConfig: NightwatchOptions = {
  src_folders: ['./dist/tests'],
  output_folder: './reports/webdriver/chrome/',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: '',
  globals_path: '',
  webdriver: {
    start_process: true,
    port: 9515,
    server_path: chromedriverPath,
    cli_args: ["--verbose"],

  },
  test_settings: {
    chrome: {
      ...defaultTestSettings,
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          w3c: false
        }
      }
    }
  }
}

// const webdriverEdgeConfig: NightwatchOptions = {
//   src_folders: ['./dist/tests'],
//   output_folder: './reports/webdriver/edge',
//   custom_commands_path: '',
//   custom_assertions_path: '',
//   page_objects_path: '',
//   globals_path: '',
//   webdriver: {
//     start_process: true,
//     port: 17556,
//     server_path: mswebdriverPath,
//     cli_args: ["--verbose"],

//   },
//   test_settings: {
//     edge: {
//       ...defaultTestSettings,
//       desiredCapabilities: {
//         browserName: "MicrosoftEdge",
//         javascriptEnabled: true,
//         acceptSslCerts: true

//       }
//     }
//   }
// }

const seleniumConfig: NightwatchOptions = {
  src_folders: ['./dist/tests'],
  output_folder: './reports/selenium/ie',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: '',
  globals_path: '',
  selenium: {
    start_process: true,
    start_session: true, //not sure what this does
    host: "127.0.0.1",
    port: 4444,
    server_path: seleniumServerPath,
    log_path: '',
    cli_args: {
      // "webdriver.ie.driver": process.platform === "win32" ? iedriverPath : ""
    }
  },

  test_settings: {
    ie: {
      ...defaultTestSettings,
      desiredCapabilities: {
        browserName: "internet explorer",
      }

    }
  }
};





const config: NightwatchOptions = {
  ...seleniumConfig,
  //...webdriverEdgeConfig,
  ...webdriverChromeConfig

}


export default config;