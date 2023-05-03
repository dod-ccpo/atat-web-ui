/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TaskOrder from "@/portfolios/portfolio/components/TaskOrder/TaskOrder.vue";
import PortfolioSummary from "@/store/portfolioSummary";
import { PortfolioSummaryDTO } from "@/api/models";
import PortfolioData from "@/store/portfolio";
Vue.use(Vuetify);

describe("Testing TaskOrder Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;

  let total_task_order_value:(number | undefined) = 0;
  let total_lifecycle_amount:(number | undefined) = 0;
  let funds_spent_task_order:(number | undefined) = 0;
  const dummyPortfolioSummaryList: (PortfolioSummaryDTO[]) = [
    {
      name: "",
      csp:{
        "link": "dummyLink.com/01a",
        "value": "01a"
      },
      active_task_order: {
        "link": "dummyLink.com/01a",
        "value": "01a"
      },
      csp_display: "",
      vendor: "",
      dod_component: "",
      task_order_number: "",
      sys_updated_on: "",
      task_order_status: "",
      pop_end_date: "",
      pop_start_date: "",
      funds_obligated: 0,
      portfolio_status: "",
      portfolio_funding_status: "",
      portfolio_managers: "",
      funds_spent: 0,
      task_orders: [
        {
          "clins": "01,02,03",
          "sys_id": "sys01",
          "portfolio": {
            "link": "google.com",
            "value": "port01"
          },
          "task_order_number": "1234",
          "pop_end_date": "2023-09-30",
          "pop_start_date": "2022-10-01",
          "task_order_status": "ACTIVE",
          "clin_records": [],
          "funds_obligated": "825000",
          "total_task_order_value": total_task_order_value,
          "total_lifecycle_amount": total_lifecycle_amount,
          "funds_spent_task_order": funds_spent_task_order,
          "incrementally_funded": "",
          "acquisition_package": "", 
          "funding_plan": "",
          "funds_total": ""
        }
      ],
      alerts: []
    }
  ];

  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  PortfolioData.setActiveTaskOrderNumber("1234");
 

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TaskOrder, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("loadOnEnter() test with task order that has valid money amounts", async()=>{
    total_task_order_value = 120000;
    total_lifecycle_amount = 240000;
    funds_spent_task_order = 60000;
    jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockReturnValue(
      new Promise(resolve => resolve(dummyPortfolioSummaryList))
    );
    await wrapper.vm.loadOnEnter();
  })

  it("loadOnEnter() test with task order that has undefined money amounts", async()=>{
    total_task_order_value = undefined;
    total_lifecycle_amount = undefined;
    funds_spent_task_order = undefined;
    jest.spyOn(PortfolioSummary, 'getAllPortfolioSummaryList').mockReturnValue(
      new Promise(resolve => resolve(dummyPortfolioSummaryList))
    );
    await wrapper.vm.loadOnEnter();
  })

})
