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
    vendor: "AWS",
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
    portfolio_funding_status: ""
    /* eslint-enable camelcase */
  },
  {
    name: "mock portfolio 2",
    csp: { link: "", value: ""},
    /* eslint-disable camelcase */
    csp_display: "CSP_B",
    vendor: "AWS",
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
    portfolio_funding_status: ""
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
      propsData: {
        isHomeView: true,
      }
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

  it("tests loadPortfolioData() - filters by active only", async () => {
    jest.spyOn(PortfolioSummaryStore, "searchPortfolioSummaryList").mockImplementation(
      () => Promise.resolve({
        // eslint-disable-next-line camelcase
        total_count: 2,
        portfolioSummaryList: portfolios
      }));
    wrapper.vm.$data.activeTab = "ACTIVE"
    await wrapper.vm.loadPortfolioData();
    expect(await wrapper.vm.$data.portfolioSearchDTO.portfolioStatus).toBe("");
  });

  it("tests generateFilterChips() - generates a filter chip for managed role", async () => {
    await wrapper.vm.setQueryParams("role", "MANAGED");
    await wrapper.vm.generateFilterChips();
    expect(wrapper.vm.$data.filterChips.length).toBe(1);
  });

  it("tests openSlideoutPanel with an event", async () => {
    const eObject = {
      currentTarget: 'test',
      preventDefault: jest.fn(),
      cancelBubble: false,
    }
    await wrapper.vm.openFilterSlideout(eObject);
    expect(await wrapper.vm.$data.showFilters).toBeTruthy();

  });

  it("changes active tab", async () => {
    wrapper.vm.$props.activeTab = "PROCESSING";
    Vue.nextTick(async () => {
      expect(await wrapper.vm.queryParams.portfolioStatus).toBe("PROCESSING");
      wrapper.vm.$props.activeTab = "ALL";
      Vue.nextTick(async () => {
        expect(await wrapper.vm.queryParams.portfolioStatus).toBe("");
      });
    });
  });

  it("sortPortfolios()", async () => {
    wrapper.vm.sortPortfolios(
      {newSelectedValue: 'DESCsys_updated_on', selectedBeforeChange: 'name'}
    );
    expect(await wrapper.vm.queryParams.sort).toBe("DESCsys_updated_on");
  });

  it("searchPortfolios()", async () => {
    wrapper.vm.$data.searchString = "testing";
    await wrapper.vm.searchPortfolios();
    expect(await wrapper.vm.queryParams.searchString).toBe("testing");
  });

  it("clearSearch()", async () => {
    await wrapper.vm.clearSearch();
    expect(await wrapper.vm.queryParams.searchString).toBe("");
  });


  it("clearAllFilters()", async () => {
    await wrapper.vm.clearAllFilters();
    expect(await wrapper.vm.$data.filterChips.length).toBe(0);
  });

  it("clearSearchOrFilters() both search and filters", async () => {
    wrapper.vm.$data.searchString = "test";
    wrapper.vm.$data.filterChips.push("test");
    await wrapper.vm.clearSearchOrFilters("both");
    expect(await wrapper.vm.$data.filterChips.length).toBe(0);
    expect(await wrapper.vm.$data.searchString).toBe("");
  });

  it("clearSearchOrFilters() search only", async () => {
    wrapper.vm.$data.searchString = "test";
    await wrapper.vm.clearSearchOrFilters("search");
    expect(await wrapper.vm.$data.searchString).toBe("");
  });

  it("clearSearchOrFilters() filter only", async () => {
    wrapper.vm.$data.filterChips.push("test");
    await wrapper.vm.clearSearchOrFilters("filters");
    expect(await wrapper.vm.$data.filterChips.length).toBe(0);
  });

  it("removeFilter() removes role filter with chip close X ", async () => {
    wrapper.vm.$data.filterChips.push({
      label: "Managed by me",
      value: "MANAGED",
      id: "Managed",
      type: "role",
    })

    await wrapper.vm.removeFilter(0);
    Vue.nextTick(async () => {
      expect(await wrapper.vm.$data.filterChips.length).toBe(0);
    });
  });

  it("removeFilter() removes funding status filter with chip close X ", async () => {
    wrapper.vm.$data.filterChips.push({
      label: "On track",
      value: "ON_TRACK",
      id: "OnTrack",
      type: "fundingStatuses",
    })
    await wrapper.vm.removeFilter(0);
    Vue.nextTick(async () => {
      expect(await wrapper.vm.$data.filterChips.length).toBe(0);
    });
  });

  it("removeFilter() removes CSP filter with chip close X ", async () => {
    wrapper.vm.$data.filterChips.push(  {
      label: "Amazon Web Services (AWS)",
      value: "CSP_A",
      id: "Amazon",
      abbreviation: "AWS",
      type: "csps",
    });
    await wrapper.vm.removeFilter(0);
    Vue.nextTick(async () => {
      expect(await wrapper.vm.$data.filterChips.length).toBe(0);
    })
  });

});
