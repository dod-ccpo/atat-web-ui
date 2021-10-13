/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const fs = require('fs');

const browserstack = {
    auth: {
        username: process.env.BROWSERSTACK_USERNAME,
        access_key: process.env.BROWSERSTACK_ACCESS_KEY,
    },
    browsers: [
        {
            browser: "chrome",
            os: "Windows 10",
            versions: ["latest"],
        },
        {
            browser: "edge",
            os: "Windows 10",
            versions: ["latest"],
        },
    ],
    environment_settings: {
        baseURL: process.env.CYPRESS_BASE_URL,

    },
    run_settings: {
        cypress_config_file: "./cypress.json",
        cypress_version: 7,
        project_name: "atat-web-ui",
        build_name: process.env.BROWSERSTACK_BUILD,
        pluginsFile: "./cypress/plugins/index.js",
        parallels: 2,
        npm_dependencies: {
            "dotenv": "^10.0.0"
        }
    },
};

let data = JSON.stringify(browserstack, null);

fs.writeFileSync("./browserstack.json", data);