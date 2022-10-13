/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import JWCC from "@/dashboards/JWCC.vue";
import api from "@/api"
import { AggregateResults, DashboardService } from "@/services/dashboards";
Vue.use(Vuetify);

describe("Testing JWCC Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(JWCC, {
      localVue,
      vuetify,
    });

    jest.spyOn(api.aggregate, 'makeRequest').mockImplementation(
      async (): Promise<AggregateResults> => {
        return {
          result: {
            stats: {
              sum: {
                funds_obligated: "100_000.0000",
                funds_total: "500_000.000"
              }
            }
          }
        }
      });

    jest.spyOn(api.taskOrderTable, 'all').mockImplementation(async (): Promise<any> => {
      return {
        result: [
          {
            clins: "",
            incrementally_funded: "",
            funds_obligated: "100000",
            sys_mod_count: "1",
            acquisition_package: {
              link: "https://dev00000.service-now.com/api/now/table/"
              + "x_g_dis_atat_acquisition_package/package-sys_id",
              value: "package-sys_id"
            },
            task_order_number: "9999999999999",
            sys_updated_on: "2022-10-06 17:35:57",
            sys_tags: "",
            task_order_status: "",
            sys_id: "task-order-sys_id",
            funding_request: "",
            sys_updated_by: "test-ctr",
            portfolio: "",
            sys_created_on: "2022-09-30 21:38:24",
            funding_plan: "",
            pop_end_date: "",
            pop_start_date: "",
            funds_total: "500000",
            sys_created_by: "test-ctr"
          }
        ]
      }
    });

  });

  it("renders successfully", async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true);
  });

  it.skip("loadOnEnter() - load initial dashboard data", async () => {
    // TODO: once changes regarding task orders, costs, and funding are solid
    // probably best to come back include more tests since there are data modeling
    // changes occurring related to costs
    await wrapper.vm.loadOnEnter()
    expect(await wrapper.vm.$data).toBe("loaded")
  })
});
