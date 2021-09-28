import { NightwatchBrowser } from "nightwatch";
const url = process.env.VUE_DEV_SERVER_URL;
const myPortfolioPage = {
  "Verifying the Signin Home Page": (browser: NightwatchBrowser): void => {
    const home = browser.page.atatHome();

    home.navigate(url).pause(10000);
    home.maximizeWindow();
    home.expect.element("@classificationBanner").to.be.present.before(1000);
    home.expect
      .element("@classificationBanner_text")
      .text.to.equal("An official website of the United States government");
    home.expect.element("@atatText").text.to.contain("Access the ATAT Cloud");
    home.expect.element("@signInButton").to.be.present.before(2000);
    home.click("@signInButton");
  },

  "Verifying DashBoard view": (browser: NightwatchBrowser): void => {
    const dashboard = browser.page.dashBoard();
    dashboard.assert.urlContains("dashboard");
    dashboard.expect.element("@logoutTab").to.be.present.before(1000);
    dashboard.expect.element("@menuText").text.to.equal("Menu");
    dashboard.expect.element("@dashboardTab").text.to.equal("Dashboard");
    dashboard.expect.element("@myPortfoliosTab").text.to.equal("My Portfolios");
    dashboard.expect.element("@reportsTab").text.to.equal("Reports");
    dashboard.click("@myPortfoliosTab");
  },
  "Verifying My Portfolio view": (browser: NightwatchBrowser): void => {
    const myport = browser.page.myPortfolios();
    myport.assert.urlContains("portfolios");
    myport.expect
      .element("@myPortfoliosHeaderText")
      .text.to.contain("My Porfolios");
    myport.expect
      .element("@myPortfoliosSubText")
      .text.to.equal("My Portfolios");
    myport.expect
      .element("@createNewPortfolioBtn")
      .text.to.contain("Create a New Portfolio");
    myport.assert.visible("@firstCard");
    myport.assert.visible("@createNewPortfolioBtn");
    myport.click("@createNewPortfolioBtn");
    myport.waitForElementNotPresent("@createNewPortfolioBtn", 1000);
    browser.end();
  },
};

export default myPortfolioPage;
