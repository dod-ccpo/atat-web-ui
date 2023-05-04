/// <reference types="cypress" />

//const { env } = require("process");
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config()
// eslint-disable-next-line no-unused-vars
/* eslint @typescript-eslint/no-var-requires: "off" */
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
  
  require('cypress-grep/src/plugin')(on,config)
  
  config.env.testURL = process.env.testURL;
  config.env.localTestURL = "http://localhost:8080/";
  config.env.isTestingLocally = process.env.isTestingLocally;
  config.env.BASE_API_URL = process.env.BASE_API_URL;
  config.env.isolatedTestingURL = process.env.isolatedTestingURL;
  config.env.isTestingIsolated = process.env.isTestingIsolated;
  config.env.isTestingInIframe = process.env.isTestingInIframe;  
  config.env.localTestURLInIframe = process.env.localTestURLInIframe;
  config.env.snowUser = process.env.SNOWUSER;
  config.env.snowPass = process.env.SNOWPASS;
  config.env.disaNoIframeUrl = process.env.disaNoIframeUrl;
  config.env.userId = process.env.userId
  
  return config;
}
