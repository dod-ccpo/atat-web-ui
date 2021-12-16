import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepTwoSummary from "@/views/wizard/Step2/views/Step2Summary.vue";
import VueRouter from "vue-router";

const localVue = createLocalVue();
Vue.use(Vuetify);
localVue.use(Vuex);
localVue.use(VueRouter);

describe("Testing Step2 Component", () => {
  let vuetify: any;
  let wrapper: any;
  let store: any;

  const actions: any = {
    updateWizardStep: jest.fn(),
    saveStepModel: jest.fn(),
  };

  const getters: any = {
    deleteTaskOrderByName: () => (id: string) => {
      return [];
    },
    getMockTaskOrders: () => {
      return {
        details: [
          {
            task_order_number: "TaskOrder_0001",
            clins: [
              {
                clin_number: "0001",
                idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
                total_clin_value: 200000,
                obligated_funds: 10000,
                pop_start_date: "2021-09-01",
                pop_end_date: "2022-09-01",
              },
              {
                clin_number: "0002",
                idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
                total_clin_value: 7500000,
                obligated_funds: 500000,
                pop_start_date: "2021-09-01",
                pop_end_date: "2022-09-01",
              },
            ],
          },
        ],
      };
    },
  };

  const routes = [
    {
      name: "addfunding",
      path: "/wizard/addfunding",
    },
  ];

  const router = new VueRouter({ routes });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
      getters,
    });
    wrapper = mount(stepTwoSummary, {
      store,
      localVue,
      vuetify,
      router,
    });
    wrapper.setData({
      task_order_number: "item_to_delete",
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  // it("deletes an item", async () => {
  //   wrapper.vm.deleteItem("");
  //   await Vue.nextTick();
  //   wrapper.vm.deleteItem("item_to_delete");
  //   expect(wrapper.exists()).toBe(true);
  // });
});
