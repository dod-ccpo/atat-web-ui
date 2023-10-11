import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import Index from "@/portfolios/portfolio/components/Index.vue";
import PortfolioStore from "@/store/portfolio";
import { Environment, Portfolio, PortfolioDetailsDTO } from "types/Global";
import CurrentUserStore from "@/store/user";
import { UserDTO } from "@/api/models";

Vue.use(Vuetify);
const mockPortfolio = {
  name: "mock portfolio",
  csp: "",
  /* eslint-disable camelcase */
  csp_display: "CSP_A",
  agency: "ARMY",
  vendor: "AWS",
  dod_component: "ARMY", // EJY - DOUBLE-CHECK this is still needed
  task_order_number: "123456",
  sys_updated_on: "2022-09-26 15:50:20",
  task_order_status: "ACTIVE",
  pop_end_date: "2022-12-31",
  pop_start_date: "2022-01-01",
  funds_obligated: 10000,
  portfolio_status: "PROCESSING",
  portfolio_owner: "",
  portfolio_managers: "4567,1234",
  portfolio_viewers: "7890,5432",
  funds_spent: 5000,
  task_orders: [],
  active_task_order: "",
  alerts: [],
  portfolio_funding_status: "",
  last_cost_data_sync: "",
  /* eslint-enable camelcase */
};

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Index, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Tests leavePortfolio()", async () => {
    /* eslint-disable */
    const mockUser: UserDTO = {
      last_login_time: "01/02/03",
      name: "Test User",
      first_name: "Test",
      last_name: "User",
      user_name: "TestUser",
      email: "Test@email.mil",
      company: "Rando company",
      mobile_phone: "123-456-7890",
      phone: "123-456-7890",
      home_phone: "123-456-7890",
      title: "User Title",
      sys_id: "1234",
    };
    /* eslint-enable */
    const leavePort = jest
      .spyOn(PortfolioStore, "leavePortfolio")
      .mockImplementation();
    CurrentUserStore.setCurrentUser(mockUser);
    await PortfolioStore.setCurrentPortfolio(mockPortfolio);
    await wrapper.vm.leavePortfolio();
    expect(leavePort).toBeCalled();
    expect(wrapper.vm.$data.showLeaveModalSpinner).toBe(false);
    expect(PortfolioStore.showLeavePortfolioModal).toBe(false);
  });

  it("test openLeavePortfolioModals()", async () => {
    await wrapper.vm.openLeavePortfolioModal();
    expect(PortfolioStore.showLeavePortfolioModal).toBe(true);
  });

  it("test closeLeavePortfolioModals()", async () => {
    await wrapper.vm.closeLeavePortfolioModal();
    expect(PortfolioStore.showLeavePortfolioModal).toBe(false);
  });

  it("test loadOnEnter", async () => {
    /* eslint-disable */
    const mockPortfolio: Portfolio = {
      sysId: "1234",
      title: "good portfolio title",
      description: "good description",
      csp: "4321",
      environments: [
        {
          classification_level: "U",
          csp: "",
          csp_display: "azure_il4_dev",
          csp_id: "",
          dashboard_link: "https://www.google.com/",
          environment_status: "PROCESSING",
          name: "Test 2 - Unclassified",
          portfolio: "",
          provisioned: "false",
          provisioned_date: "",
          provisioning_failure_cause: "",
          provisioning_request_date: "",
          sys_created_by: "test.user",
          sys_created_on: "2023-09-22 18:58:03",
          sys_id: "",
          sys_mod_count: "2",
          sys_tags: "",
          sys_updated_by: "admin",
          sys_updated_on: "2023-09-22 18:59:06",
        },
      ] as Environment[],
    };
    /* eslint-enable */
    await PortfolioStore.setCurrentPortfolioFromCard(mockPortfolio as PortfolioDetailsDTO);
    await wrapper.vm.loadOnEnter();
    expect(wrapper.vm.$data.portfolioSysId).toBe(mockPortfolio.sysId);
    expect(wrapper.vm.$data.portfolioCSP).toBe(mockPortfolio.csp);
    expect(wrapper.vm.$data.portfolioDescription).toBe(
      mockPortfolio.description
    );
    expect(wrapper.vm.$data.title).toBe(mockPortfolio.title);
  });
});
