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

### To run Cypress tests on localhost
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

| Environment Variable Name | Description          |
| ------------------------- | -------------------- |
| 'testURL'                 | PortalUrl            |
| 'localTestUrl'            | http://localhost:8080/testing.html |
| 'isTestingLocally'        | false  (set true to test locally)  |
| 'SNOWUSER'                | Your username to use |
| 'SNOWPASS'                | password             |

```

```
