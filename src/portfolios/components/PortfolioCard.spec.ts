import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioCard from "@/portfolios/components/PortfolioCard.vue";
import { PortfolioCardData } from "types/Global";
import AppSections from "@/store/appSections";

Vue.use(Vuetify);

const menuActions = {
  viewFundingTracker: "navToFundingTracker",
  viewTaskOrders: "navToTaskOrders",
  leavePortfolio: "leavePortfolio",
  emailManagers: "emailManagers",
  archivePortfolio: "archivePortfolio",
  loginToCSP: "loginToCSP",
}


describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const cardData: PortfolioCardData =
    {
      // eslint-disable-next-line camelcase
      sys_id: "1234567890",
      title: "ABC123 portfolio",
      status: "Processing",
      csp: "aws",
      branch: "Joint Force",
      lastModified: "Started 23 minutes ago",
      currentPoP: "",
      totalObligated: "",
      fundsSpent: "",
      fundsSpentPercent: "",
    };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioCard, {
      localVue,
      vuetify,
      propsData:({
        cardData,
        index: 0,
        isLastCard: false,
      })      
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("clicks meatball menu - emit to leave portfolio", async () => {
    wrapper.vm.leavePortfolio();
    expect(wrapper.emitted().leavePortfolio).toBeTruthy()
  });

  it("clicks meatball menu - view funding tracker", async () => {
    await wrapper.vm.cardMenuClick({action: menuActions.viewFundingTracker});
    expect(AppSections.activeAppSection).toBe(AppSections.sectionTitles.PortfolioSummary);
  });

  it("clicks meatball menu - view task orders", async () => {
    await wrapper.vm.cardMenuClick({action: menuActions.viewTaskOrders});
    expect(AppSections.activeAppSection).toBe(AppSections.sectionTitles.PortfolioSummary);
  });

  it("clicks meatball menu - Leave portfolio", async () => {
    await wrapper.vm.cardMenuClick({action: menuActions.leavePortfolio});
    expect(wrapper.vm.$data.showLeavePortfolioModal).toBeTruthy();
  });

  it("clicks meatball menu - Email portfolio managers", async () => {
    await wrapper.vm.cardMenuClick({action: menuActions.emailManagers});
  });

  it("clicks meatball menu - Log into CSP console", async () => {
    await wrapper.vm.cardMenuClick({action: menuActions.loginToCSP, url: "https://google.com"});
  });

  it("clicks meatball menu - Log into CSP console", async () => {
    await wrapper.vm.cardMenuClick({action: "foo"});
  });

  it("gets status chip background color", async () => {
    const bgColor = wrapper.vm.statusChipBgColor;
    expect(bgColor.length).toBeGreaterThan(0);
  });

  it("gets NO status chip background color", async () => {
    wrapper.vm.$props.cardData.status = undefined;
    const bgColor = wrapper.vm.statusChipBgColor;
    expect(bgColor.length).toEqual(0);
  });

});
