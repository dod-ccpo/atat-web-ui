import { NightwatchBrowser } from "nightwatch";

const loginpagetest = {
  "verifying the loginpage": function (client: NightwatchBrowser) {
    client
      .init()
      .url("${VUE_DEV_SERVER_URL}")
      .windowMaximize("max")
      .pause(10000)
      .waitForElementVisible("#app")
      .assert.elementPresent(
        "div.classification-banner.text-center.white--text.body-lg.d-block"
      )
      .assert.elementPresent("div.mr-3")
      .assert.containsText(
        "div.USWDC-official-banner__text.mr-3",
        "An official website of the United States government"
      )
      .assert.containsText(
        "span.USWDC-official-banner__link_msg.text-decoration-underline",
        "Here’s how you know"
      )
      .assert.elementPresent(
        "div.text-center.mb-10.h1.font-weight-bold:nth-child(1)"
      )
      .assert.containsText(
        "div.text-center.mb-10.h1.font-weight-bold:nth-child(1)",
        "Access the ATAT Cloud"
      )
      .assert.elementPresent(".black--text:nth-child(2)")
      .getText(".black--text:nth-child(2)")
      .assert.elementPresent("#login_button")
      .waitForElementVisible("button[id=login_button]", 2000)
      .execute(function () {
        // @ts-ignore: Object is possibly 'null'
        document.getElementById("login_button").click();
      })
      .pause(10000)
      .assert.elementPresent("#atat-header-nav__logout")
      .assert.elementPresent("h1.mb-5.h1.font-weight-bold")
      .getText("h1.mb-5.h1.font-weight-bold")
      .assert.elementPresent("h3.h3.mb-7:nth-child(1)")
      .getText("h3.h3.mb-7:nth-child(1)")
      .click("a.font-weight-bold.h6.text-decoration-underline.mt-1.mx-1")
      .end();
  },
};
export default loginpagetest;
