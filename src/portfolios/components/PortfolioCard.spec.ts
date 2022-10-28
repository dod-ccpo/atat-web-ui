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
      agency: "Joint Force",
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

  it("Test loadOnEnter()- should set funding alert chip string based on the " +
    "portfolio's funding status", async () => {
    wrapper.vm.$props.cardData.fundingStatus = "ON_TRACK";
    wrapper.vm.$props.cardData.fundingAlertChipString = "";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$props.cardData.fundingAlertChipString).toEqual("");
    wrapper.vm.$props.cardData.fundingStatus = "AT_RISK";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$props.cardData.fundingAlertChipString).toEqual("At-Risk");
    wrapper.vm.$props.cardData.fundingStatus = "FUNDING_AT_RISK";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$props.cardData.fundingAlertChipString).toEqual("At-Risk");
    wrapper.vm.$props.cardData.fundingStatus = "EXPIRING_SOON";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$props.cardData.fundingAlertChipString).toEqual("Expiring Soon");
  });

  it("Test loadOnEnter()- should set funding status chip string to title case " +
    "for any status that is not configured", async () => {
    wrapper.vm.$props.cardData.fundingStatus = "UNEXPECTED_FUNDING_STATUS";
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$props.cardData.fundingAlertChipString).toEqual("Unexpected Funding Status");
  });

  it("tests getter - hasFundingStatus() - false from undefined", async () => {
    await wrapper.vm.loadOnEnter();
    wrapper.vm.$props.cardData.fundingStatus = undefined;
    Vue.nextTick(() => {
      const foo = wrapper.vm.hasFundingStatus;
      expect(foo).toBeFalsy();  
    })
  })
  it("tests getter - hasFundingStatus() - true", async () => {
    await wrapper.vm.loadOnEnter();
    wrapper.vm.$props.cardData.fundingStatus = "foo";
    Vue.nextTick(() => {
      const foo = wrapper.vm.hasFundingStatus;
      expect(foo).toBeTruthy();  
    })
  })

});
