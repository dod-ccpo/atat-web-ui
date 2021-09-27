import { EnhancedPageObject } from "nightwatch";

const myPortfoliosPage = {
  commands: [{}],
  elements: {
    myPortfoliosHeaderText: {
      name: "myPortfoliosHeaderText",
      locateStrategy: "css selector",
      selector: "h1.mb-3.h1.font-weight-bold",
    },

    myPortfoliosSubText: {
      name: "myPortfoliosSubText",
      locateStrategy: "css selector",
      selector: "div.h3",
    },
    createNewPortfolioBtn: {
      name: "createNewPortfolioBtn",
      locateStrategy: "css selector",
      selector: "#btn-create-new-portfolio",
    },
    openBtn: {
      name: "openBtn",
      locateStrategy: "css selector",
      selector: "#OPEN_0",
    },
    firstCard: {
      name: "firstCard",
      locateStrategy: "css selector",
      selector: "div.col.col-4 div.v-card",
    },
  },
  sections: {},
};

type MyPortfoliosPage = EnhancedPageObject<
  typeof myPortfoliosPage.commands[0],
  typeof myPortfoliosPage.elements,
  Record<string, unknown>
>;

declare module "nightwatch" {
  interface NightwatchCustomPageObjects {
    myPortfolios(): MyPortfoliosPage;
  }
}
export default myPortfoliosPage;
