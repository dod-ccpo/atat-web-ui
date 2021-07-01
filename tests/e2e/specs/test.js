// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  "default e2e tests": (browser) => {
    browser
      .init()
      .waitForElementVisible("#app")
      .assert.elementPresent("#hello-world-view")
      .assert.containsText("h1", "Hello World")
      .assert.elementCount(".v-image__image", 1)
      .end();
  },

  "example e2e test using a custom command": (browser) => {
    browser.openHomepage().assert.elementPresent("#hello-world-view").end();
  },
};
