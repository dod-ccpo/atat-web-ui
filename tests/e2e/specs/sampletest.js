module.exports = {
  "verifying the textfield test": (browser) => {
    browser
      .init()
      .url("http://localhost:8080/")
      .pause(10000)
      .waitForElementVisible("#app")
      .assert.elementPresent(".hello-world-view")
      .assert.containsText("h1", "Hello World")
      .assert.elementPresent("#plain-text-box_text_field")
      .setValue("#plain-text-box_text_field", "TestPortfolio 12344224200000uniquename")
      .pause(12000)
      .assert.value("#plain-text-box_text_field", "TestPortfolio 12344224200000uniquename")
      .assert.elementPresent("#success_text_field")
      .pause(12000)
      .setValue("#success_text_field", "Description of the Portfolio goes here")
      .assert.value("#success_text_field", "Description of the Portfolio goes here")
      .end();
  },
};
