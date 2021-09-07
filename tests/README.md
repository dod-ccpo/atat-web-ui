[Optional]Install Nightwatch globally
$ npm i -g nightwatch

## Install Edge driver

Download  the [Edge driver](https://msedgedriver.azureedge.net/92.0.902.78/edgedriver_win64.zip)

Extract the msedgedriver.exe
Rename the file to `MicrosoftWebDriver.exe`
Add `MicrosoftWebDriver.exe` to the PATH

### Install Java

Download the [Java](https://www.java.com/download/ie_manual.jsp)

### Run your end2end test on IE locally

npm run test:ie

### Run your end2end test on Edge locally

npm run test:edge

### Run your end2end test on Chrome locally

npm run test:chrome

### Run all end2end test on all three browsers parallely

npm run test:ts

### run e2e with browserstack

Setting Environment Variables
Create a `.env` file in the project's root directory and use the following Environment Variables: 


| Environment Variable Name | Description                                                                     |
|---------------------------| --------------------------------------------------------------------------------|
|'BROWSERSTACK_BUILD'       | The build name to use in BrowserStack                                           |
|'BROWSERSTACK_USERNAME'    | Your username to use when interacting with BrowserAutomate                      |
|'BROWSERSTACK_ACCESS_KEY'  | The API key that is available in BrowserStack                                   |
|'BROWSERSTACK_PROJECT'     | The Project name to use in BrowserStack                                         |


then you can run: 

for Chrome:
```
npm run test:browserstack:chrome
```
for IE:

```
npm run test:browserstack:ie11
```
for Edge:

```
npm run test:browsestack:edge
```

### Windows

### Mac OS
