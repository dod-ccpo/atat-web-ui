# Setting up Cypress

[Optional]Install Cypress globally:

```
$ `npm i -g cypress@^^9.5.1`
```

[Optional]Install Cypressiframe:

```
 npm install -D cypress-iframe`
```

[Optional]Install dotenv:

```
npm i -d dotenv
```

### In your cypress/support/commands.js file, add the following:

import 'cypress-iframe';
// or
require('cypress-iframe');

```

### To Open Cypress window

```

node ./node_modules/cypress/bin/cypress open
or
npx cypress open

```

### To run Cypress tests using Cypress command line AKA Cypress CLI

```

npm run test:e2e

```

### Setting Environment Variables

Create a `.env` file in the project's root directory and use the following Environment Variables:

| Environment Variable Name | Description           |
| ------------------------- | --------------------- |
| 'testURL'                 | Url to use to test on |
| 'SNOWUSER'                | Your username to use  |
| 'SNOWPASS                 | password              |

```
