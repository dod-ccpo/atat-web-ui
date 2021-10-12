# Setting up Cypress

[Optional]Install Cypress globally:

```
$ `npm i -g cypress@^8.5.0`

To Open Cypress window
```

node ./node_modules/cypress/bin/cypress open
or
npx cypress open

# Setting up Cypress with Browserstack

Install Browserstack node package:

```
npm install -g browserstack-cypress-cli
```

# To run Cypress tests using Cypress command line AKA Cypress CLI

```
npm run test:cypress
```

# To execute your Cypress Tests on Browserstack

```
npm run e2e

Setting Environment Variables
Create a `.env` file in the project's root directory and use the following Environment Variables:


| Environment Variable Name | Description                                                                     |
|---------------------------| --------------------------------------------------------------------------------|
|'BROWSERSTACK_BUILD'       | The build name to use in BrowserStack                                           |
|'BROWSERSTACK_USERNAME'    | Your username to use when interacting with BrowserAutomate                      |
|'BROWSERSTACK_ACCESS_KEY'  | The API key that is available in BrowserStack                                   |
|'CYPRESS_BASE_URL'         |  Url to use to test on                                                          |



```
