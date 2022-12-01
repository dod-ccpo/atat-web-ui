# Setting up Cypress

[Optional]Install Cypress globally:

```
$ `npm i -g cypress@^^9.5.1`
```

### To Open Cypress window

```
node ./node_modules/cypress/bin/cypress open
or
npx cypress open

```

### To run Cypress tests on chrome

```
npm run test:e2e
```

### To run Cypress tests

Set .env variable 'VUE_APP_allowDeveloperNavigation' to true

### To run Cypress tests on localhost with mocked data

Change the .env variable 'isTestingLocally' to false
Change the .env variable 'isTestingInIframe' to false
Change the .env variable 'isTestingIsolated' to true
Ensure .env variable 'isolatedTestingURL' is set to "dist_testing/index.html"

Build app locally

```
npm run build:testing
```

Run app locally

```
npm run test:e2e --  --spec "cypress\integration\ATATDevSnow\<<test suite name>>\*.spec.js"
```

Open another terminal window and run

```
npx cypress open
```

### To run Cypress tests on localhost with ServiceNow Connection

Change the .env variable 'isTestingLocally' to true

Run app locally

```
npm run serve
```

Open another terminal window and run

```
npx cypress open
```

### To run Cypress tests on edge

```
npm run test:e2e --browser edge
```

### To run Cypress tests on chrome

```
npm run test:e2e --browser chrome
```

### Setting Environment Variables

Create a `.env` file in the project's root directory and use the following Environment Variables:

| Environment Variable Name          | Description                                    |
| ---------------------------------- | ---------------------------------------------- |
| 'testURL'                          | PortalUrl                                      |
| 'userId'                           | Your userId from Sandbox.                      |
| 'localTestURL'                     | http://localhost:8080                          |
| 'localTestURLInIframe'             | http://localhost:8080/testing.html             |
| 'isTestingLocally'                 | false (set true to test locally)               |
| 'isTestingInIframe'                | true (set to false for local to see snapshots) |
| 'VUE_APP_allowDeveloperNavigation' | true                                           |
| 'SNOWUSER'                         | Your username                                  |
| 'SNOWPASS'                         | Your password                                  |

```

```
