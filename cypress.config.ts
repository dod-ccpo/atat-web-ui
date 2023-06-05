import { defineConfig } from 'cypress'
import * as dotenv from  'dotenv';

dotenv.config();
export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 90000,
  numTestsKeptInMemory: 1,
  retries: 2,
  env: {
    BABEL_ENV: 'e2e',
  },
  e2e: {    
    setupNodeEvents(on, config) {      
      require('@cypress/grep/src/plugin')(config)      
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
      return config  ;
    },
  },
})
