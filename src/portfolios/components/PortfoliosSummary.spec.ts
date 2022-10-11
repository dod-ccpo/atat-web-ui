import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfoliosSummary from "@/portfolios/components/PortfoliosSummary.vue";
import PortfolioSummaryStore from "@/store/portfolioSummary"
import { PortfolioSummaryDTO } from "@/api/models";
Vue.use(Vuetify);

const portfolios: PortfolioSummaryDTO[] = [
  {
    name: "mock portfolio",
    csp: { link: "", value: ""},
    /* eslint-disable camelcase */
    csp_display: "CSP_A",
    dod_component: "ARMY",
    task_order_number: "123456",
    sys_updated_on: "2022-09-26 15:50:20", 
    task_order_status: "ACTIVE",
    pop_end_date: "2022-12-31",
    pop_start_date: "2022-01-01",
    funds_obligated: 10000,
    portfolio_status: "PROCESSING",
    portfolio_managers: "",
    funds_spent: 5000,
    task_orders: [],
    active_task_order: {
      link: "",
      value: ""
    },
    alerts: [],
    funding_status: []
    /* eslint-enable camelcase */
  },
  {
    name: "mock portfolio 2",
    csp: { link: "", value: ""},
    /* eslint-disable camelcase */
    csp_display: "CSP_B",
    dod_component: "ARMY",
    task_order_number: "123456",
    sys_updated_on: "2022-09-26 15:50:20", 
    task_order_status: "ACTIVE",
    pop_end_date: "2022-12-31",
    pop_start_date: "2022-01-01",
    funds_obligated: 10000,
    portfolio_status: "ACTIVE",
    portfolio_managers: "",
    funds_spent: 5000,
    task_orders: [
      {
        clins: "",
        clin_records: [],
        incrementally_funded: "",
        funds_obligated: "20000",
        acquisition_package: "",
        task_order_number: "123456",
        task_order_status: "ACTIVE",
        portfolio: "",
        funding_plan: "",
        pop_end_date: "2022-12-31",
        pop_start_date: "2022-01-01",
        funds_total: "10000",    
      }
    ],
    active_task_order: {
      link: "",
      value: ""
    },
    alerts: [],
    funding_status: []
    /* eslint-enable camelcase */
  }

];

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfoliosSummary, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("tests loadPortfolioData()", async () => {
    jest.spyOn(PortfolioSummaryStore, "searchPortfolioSummaryList").mockImplementation(
      () => Promise.resolve({
        // eslint-disable-next-line camelcase
        total_count: 2,
        portfolioSummaryList: portfolios
      }));
    await wrapper.vm.loadPortfolioData();
    expect(wrapper.vm.$data.portfolioCardData.length).toBe(2);
  });

})
