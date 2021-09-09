import { EnhancedPageObject, EnhancedSectionInstance, NightwatchAPI, NightwatchAssertion, NightwatchBrowser, NightwatchTests } from "nightwatch";


const headerSection = {
  selector: 'header',
  commands: [{
    //  //add commands specific to the section here
  }],
  elements: {
    classificationBanner: {
      name: "classificationBanner",
      locateStrategy: "css selector",
      selector: ".classification-banner",
    },
    classificationBanner_text: {
      name: "classificationBanner_text",
      locateStrategy: "css selector",
      selector: ".USWDC-official-banner__text.mr3",
    },
    classificationBanner_link_msg: {
      name: "classificationBanner_link_msg",
      locateStrategy: "css selector",
      selector: "span.USWDC-official-banner__link_msg",
    },
  }
};
interface HeaderSection extends EnhancedSectionInstance<typeof headerSection.commands[0], typeof headerSection.elements, {}> { }
const mainSection = {
  selector: 'main',
  commands: [{
    ////add commands specific to the section here
  }],
  elements: {

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
      selector: "div.black--text body- lg",
    },
    signInBtn: {
      selector: "#login_button",
    },
  }
};
interface MainSection extends EnhancedSectionInstance<typeof mainSection.commands, typeof mainSection.elements, {}> { }


/*
* Didn't create any objects for the footer
*/
const footerSection = {
  selector: 'footer',
  commands: [{
    //add commands specific to the section here
  }],
  elements: {

  }
};

interface FooterSection extends EnhancedSectionInstance<typeof footerSection.commands[0], typeof footerSection.elements, {}> { }

const appSection = {
  selector: '#app',
  commands: [{

  }],
  elements: {
    classificationBanner: {
      selector: '.classification-banner'
    }
  },
  sections: {
    //header: headerSection,
    // main: mainSection,
    // footer: footerSection
  }
};

interface AppSection extends EnhancedSectionInstance<typeof appSection.commands[0], typeof appSection.elements, { /*header: HeaderSection, main: MainSection, footer: FooterSection*/ }> { }

const atatHomePage = {
  commands: [{
    signin(this: ATATHomePage) {
      this.api.pause(5000);
      return this.click('@signInButton');

    }
  }],
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
      selector: '#login_button'
    }

  },
  sections: {
    header: headerSection,
    main: mainSection,
    footer: footerSection,
    apps: appSection
  }
};

interface ATATHomePage extends EnhancedPageObject<typeof atatHomePage.commands[0], typeof atatHomePage.elements, { header: HeaderSection, main: MainSection, footer: FooterSection, apps: AppSection }> { }

declare module 'nightwatch' {
  interface NightwatchCustomPageObjects {
    atatHome(): ATATHomePage;
  }
}
export default atatHomePage