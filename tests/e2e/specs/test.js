// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  "default e2e tests": (browser) => {
    browser
      .init()
      .waitForElementVisible("#app")
      .assert.elementPresent(".home-view")
      .assert.containsText("h1", "ATAT")
      .assert.not.containsText("h1", "JEDI")
      .assert.elementCount(".v-image__image", 1)
      .assert.cssProperty("header", "background-color", "rgba(22, 46, 81, 1)")
      .end();
  },

  "example e2e test using a custom command": (browser) => {
    browser.openHomepage().assert.elementPresent(".home-view").end();
  },
};
