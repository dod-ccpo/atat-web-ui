require('dotenv').config()
module.exports = {
  "verifying the textfield test": (browser) => {
    browser
      .init()
      .url(process.env.E2E_TEST)
      .pause(10000)
      .waitForElementVisible("#app")
      .assert.containsText("h1", "Hello World")
      .windowMaximize()
      .assert.elementPresent("#plain-text-box_text_field")
      .setValue("#plain-text-box_text_field", "TestPortfolio 12344224200000uniquename")
      .pause(10000)
      .assert.value("#plain-text-box_text_field", "TestPortfolio 12344224200000uniquename")
      .assert.elementPresent("#success_text_field")
      .pause(12000)
      .setValue("#success_text_field", "Description of the Portfolio goes here")
      .assert.value("#success_text_field", "Description of the Portfolio goes here")
      .end();
  },
};
