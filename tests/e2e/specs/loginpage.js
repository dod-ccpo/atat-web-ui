module.exports = {
  "verifying the loginpage": (browser) => {
    browser
      .init()
      .url("${VUE_DEV_SERVER_URL}")
      .windowMaximize()
      .pause(10000)
      .waitForElementVisible("#app")
      .assert.elementPresent("div.text-center.mb-10.h1.font-weight-bold:nth-child(1)")
      .assert.containsText("div.text-center.mb-10.h1.font-weight-bold:nth-child(1)", "Access the ATAT Cloud")

      .assert.elementPresent(".black--text:nth-child(2)")
      .getText(".black--text:nth-child(2)")
      .click("button.text-capitalize > .v-btn__content")
      .pause(10000)
      .assert.elementPresent("#atat-header-nav__logout .body")
      .assert.elementPresent("h1.my-5.h1.font-weight-bold")
      .getText("h1.my-5.h1.font-weight-bold")
      .assert.elementPresent("h3.h3.mb-7:nth-child(1)")
      .getText("h3.h3.mb-7:nth-child(1)")
      .click("a.font-weight-bold.h6.text-decoration-underline.mt-1.mx-1")
      .end();
  },
};
