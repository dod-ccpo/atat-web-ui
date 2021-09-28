import { EnhancedPageObject } from "nightwatch";

const atatHomePage = {
  commands: [
    {
      // using type ATATHomePage for "this" causes circular reference.
      // need to resolve use of commands in future sprint
      // signin(this: ATATHomePage) {
      //   this.api.pause(5000);
      //   return this.click("@signInButton");
      // },
    },
  ],
  elements: {
    classificationBanner: {
      name: "classificationBanner",
      locateStrategy: "css selector",
      selector: ".classification-banner",
    },
    classificationBanner_text: {
      name: "classificationBanner_text",
      locateStrategy: "css selector",
      selector: "div.USWDC-official-banner__text",
    },
    classificationBanner_link_msg: {
      name: "classificationBanner_link_msg",
      locateStrategy: "css selector",
      selector: "span.USWDC-official-banner__link_msg",
    },
    atatImage: {
      name: "atatImage",
      locateStrategy: "css selector",
      selector: "img.atat-nav-logo__icon",
    },
    atatlogo: {
      name: "atatlogo",
      locateStrategy: "css selector",
      selector: "#atat-main-child-img",
    },
    atatText: {
      selector: "div.text-center.mb-10.h1.font-weight-bold",
    },
    certSelectionText: {
      selector: "div.black--text.h3",
    },
    certSubText: {
      selector: "div.black--text.body-lg",
    },
    signInButton: {
      name: "atatImage",
      locateStrategy: "css selector",
      selector: "#login_button",
    },
    lastLoginFooter: {
      selector: "div.body.text-right.col",
    },
  },
  sections: {},
};

type ATATHomePage = EnhancedPageObject<
  typeof atatHomePage.commands[0],
  typeof atatHomePage.elements,
  Record<string, unknown>
>;

declare module "nightwatch" {
  interface NightwatchCustomPageObjects {
    atatHome(): ATATHomePage;
  }
}
export default atatHomePage;
