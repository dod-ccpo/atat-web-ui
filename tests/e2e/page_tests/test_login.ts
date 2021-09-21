/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NightwatchBrowser } from "nightwatch";

const url = process.env.VUE_DEV_SERVER_URL;

const signInPage = {
  "Verifying the ATAT Signin page 1": (browser: NightwatchBrowser) => {
    const home = browser.page.atatHome();

    home.navigate(url).pause(10000);
    home.expect.element("@classificationBanner").to.be.present.before(1000);
    home.expect
      .element("@classificationBanner_text")
      .text.to.equal("An official website of the United States government");
    home.expect
      .element("@classificationBanner_link_msg")
      .text.to.equal("Here’s how you know");
    home.expect
      .element("@atatImage")
      .to.have.attribute("alt")
      .which.startsWith("A")
      .and.endsWith("TAT logo");
    home.expect.element("@atatText").text.to.contain("Access the ATAT Cloud");
    home.assert.visible("@atatlogo");
    home.expect
      .element("@certSelectionText")
      .text.to.contain("Certificate Selection");
    home.getText(
      "@certSubText",
      function (result: { status: any; value: any }) {
        home.assert.equal(typeof result, "object");
        home.assert.strictEqual(result.status, 0);
        const certTextBody =
          "When you are prompted to select a certificate, please select an\n" +
          "Authentication (Identification) Certificate from the provided choices.";
        home.assert.equal(result.value, certTextBody);
      }
    );
    home.assert.visible("@lastLoginFooter");
    home.getText(
      "@lastLoginFooter",
      function (result: { status: number; value: any }) {
        home.assert.equal(typeof result, "object");
        home.assert.strictEqual(result.status, 0);
        console.log(result.value);
        home.assert.containsText("@lastLoginFooter", "Last login:");
      }
    );
  },

  "Clicking on the Signin Button 2": (browser: NightwatchBrowser) => {
    const home = browser.page.atatHome();
    home.expect.element("@signInButton").to.be.present.before(2000);
    home.click("@signInButton");
  },

  "Navigating to landing page which is DashBoard 3": (
    browser: NightwatchBrowser
  ) => {
    const home = browser.page.atatHome();
    const dashboard = browser.page.dashBoard();
    dashboard.assert.urlContains("dashboard");
    dashboard.expect.element("@logoutTab").to.be.present.before(1000);
    dashboard.getText(
      "@atatHeaderText",
      function (result: { status: any; value: any }) {
        if (typeof result === "object" && result.status === 0) {
          home.assert.equal(result.value, "ATAT Cloud Services");
        }
      }
    );
    dashboard.getText(
      "@welcomeSubText",
      function (result: { status: any; value: any }) {
        home.assert.equal(typeof result, "object");
        home.assert.strictEqual(result.status, 0);
        console.log(result.value);
        const WelcomeSubText =
          "Welcome to the Account Tracking and Automation Tool, Maria!";
        home.assert.equal(result.value, WelcomeSubText);
      }
    );
    browser.end();
  },
};

export default signInPage;
