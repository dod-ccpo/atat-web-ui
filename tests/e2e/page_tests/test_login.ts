import { NightwatchBrowser } from "nightwatch";

const signInPage = {
  "Verifying the atatSigninpage": (browser: NightwatchBrowser) => {
    const home = browser.page.atatHome();

    home.navigate("http://localhost:8080").pause(10000);
    home.expect.element("@classificationBanner").to.be.present.before(1000);
    home.expect
      .element("@classificationBanner_text")
      .text.to.equal("An official website of the United States government");
    home.expect
      .element("@classificationBanner_link_msg")
      .text.to.equal("Here’s how you know");
    home.expect.element("@atatText").text.to.contain("Access the ATAT Cloud");
    home.expect
      .element("@certSelectionText")
      .text.to.contain("Certificate Selection");
    home.expect.element("@signInButton").to.be.present.before(2000);
    home.click("@signInButton");

    const dashboard = browser.page.dashBoard();
    dashboard.expect.element("@logoutTab").to.be.present.before(1000);
    dashboard.getText(
      "@atatHeaderText",
      function (result: { status: any; value: any }) {
        if (typeof result == "object" && result.status == 0) {
          home.assert.equal(result.value, "ATAT Cloud Services");
        }
      }
    );
    dashboard.getText(
      "@welcomeSubText",
      function (result: { status: any; value: any }) {
        console.log(result.value);
      }
    );
    browser.end();
  },
};

export default signInPage;
