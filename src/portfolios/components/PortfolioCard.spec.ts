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
      status: "Active",
      csp: "aws",
      serviceAgency: "Joint Force",
      lastModifiedStr: "Started 23 minutes ago",
      currentPoP: "",
      totalObligated: "",
      fundsSpent: "",
      fundsSpentPercent: "",
      fundingAlertChipString: "expired"
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
        isHaCCAdmin: true,
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
    await wrapper.setData({ showLeavePortfolioModal: false })
    await wrapper.vm.cardMenuClick({action: menuActions.leavePortfolio});
    expect(await wrapper.vm.$data.showLeavePortfolioModal).toBeTruthy();
  });

  it("clicks meatball menu - Email portfolio managers", async () => {
    window.open = jest.fn();
    await wrapper.vm.cardMenuClick({action: menuActions.emailManagers});
    expect(window.open).toHaveBeenCalled();

  });

  it("clicks meatball menu - Log into CSP console", async () => {
    window.open = jest.fn();
    await wrapper.vm.cardMenuClick({action: menuActions.loginToCSP, url: "foo"});
    expect(window.open).toHaveBeenCalledWith("foo", "_blank");
  });

  it("clicks meatball menu - no action taken", async () => {
    await wrapper.vm.cardMenuClick({action: "foo"});
  });

  it("gets status chip background color", async () => {
    const bgColor = wrapper.vm.statusChipBgColor;
    expect(bgColor.length).toBeGreaterThan(0);
  });

  it("gets NO status chip background color", async () => {
    wrapper.vm.$props.cardData.status = undefined;
    wrapper.vm.$props.cardData.fundingAlertChipString = undefined;
    const bgColor = wrapper.vm.statusChipBgColor;
    expect(bgColor.length).toEqual(0);
  });

});
