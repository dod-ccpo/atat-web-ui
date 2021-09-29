import { EnhancedPageObject, NightwatchBrowser } from "nightwatch";

const dashBoardPage = {
  commands: [
    {
      scrollIntoView: (browser: NightwatchBrowser): unknown => {
        return browser.execute(
          "window.scrollTo(0, document.body.scrollHeight);"
        );
      },
    },
  ],
  elements: {
    atatHeaderText: {
      selector: "h1.mb-5.h1.font-weight-bold",
    },
    welcomeSubText: {
      selector: "h3.h3.mb-7:nth-child(1)",
    },
    updateBtn: {
      selector:
        "a.v-btn.v-btn--is-elevated.v-btn--has-bg.v-btn--router.theme--light.v-size--default.primary",
    },
    nameTab: {
      selector: "#atat-header-nav__user-display-name",
    },
    supportTab: {
      selector: "#atat-header-nav__support",
    },
    logoutTab: {
      selector: "#atat-header-nav__logout",
    },
    menuText: {
      selector: "div.v-subheader.font-weight-bold.text-h6.theme--light",
    },
    getStartedBtn: {
      selector:
        "button.ml-auto.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--default.primary",
    },
    dashboardTab: {
      selector: "a[href*='createportfolio']",
    },
    myPortfoliosTab: {
      selector: "a[href*='portfolios']",
    },
    reportsTab: {
      selector: "a[href*='createportfolio#']",
    },
    image: {
      selector: "img.mt-9",
    },
    profileContinueBtn: {
      name: "profileContinueBtn",
      locateStrategy: "xpath",
      selector: "//span[contains(text(),'Continue')]",
    },
  },
  sections: {},
};

type DashBoardPage = EnhancedPageObject<
  typeof dashBoardPage.commands[0],
  typeof dashBoardPage.elements,
  Record<string, unknown>
>;

declare module "nightwatch" {
  interface NightwatchCustomPageObjects {
    dashBoard(): DashBoardPage;
  }
}
export default dashBoardPage;
