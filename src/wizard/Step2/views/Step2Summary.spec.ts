import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepTwoSummary from "@/wizard/Step2/views/Step2Summary.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";
import { ATATSummaryCardItem, ATATSummaryCards, TaskOrders } from "../../../../types/Wizard";

const localVue = createLocalVue();
Vue.use(Vuetify);
localVue.use(Vuex);
localVue.use(VueAxios, axios);
localVue.use(VueRouter);

describe("Testing Step2 Component", () => {
  let vuetify: any;
  let wrapper: any;
  let store: any;
  let mockTaskOrders: TaskOrders;
  let ATATSummaryCards: ATATSummaryCards;
  let ATATSummaryCardItem: ATATSummaryCardItem;

  let showPopText: boolean = false;

  const actions: any = {
    updateWizardStep: jest.fn(),
    saveStepModel: jest.fn(),

  };

  const getters: any = {
    getMockTaskOrders: () => {
      const mockTaskOrders: TaskOrders = {
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
        ]
      }
      return mockTaskOrders;
    }
    // getStepTouched: () => (stepNumber: number) => {
    //   return false;
    // },
    // getStepModel: () => (stepNumber: number) => {
    //   return {
    //     name: "",
    //     description: "",
    //     dod_components: [],
    //     csp: "",
    //   };
    // },
    // getTaskOrderByName: () => (id: string) => {
    //   return [
    //     {
    //       task_order_number: "TaskOrder_0001",
    //       clins: [
    //         {
    //           clin_number: "0001",
    //           idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
    //           total_clin_value: 200000,
    //           obligated_funds: 10000,
    //           pop_start_date: "2021-09-01",
    //           pop_end_date: "2022-09-01",
    //         },
    //       ],
    //     },
    //   ];
    // },
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
      stubs: [
        "atat-summary-card",
        "atat-button-card",
      ],
    });
    wrapper.setData({
      // taskOrderDetails: {
      //   task_order_number: "",
      //   task_order_file: {
      //     description: "",
      //     id: "",
      //     created_at: "",
      //     updated_at: "",
      //     size: 0,
      //     name: "",
      //     status: "",
      //   },
      //   clins: [
      //     {
      //       clin_number: "0001",
      //       idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
      //       total_clin_value: 200000,
      //       obligated_funds: 10000,
      //       pop_start_date: "2021-09-01",
      //       pop_end_date: "2022-09-01",
      //     },
      //   ],
      // },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  // it("contains ATATSummaryCard Component", () => {
  //   expect(wrapper.vm.$refs.createTaskOrderForm).toBeDefined();
  // });

  // it("adds a CLIN", async () => {
  //   await Vue.nextTick();
  //   await wrapper.vm.addClin();
  //   const newClinNumber = wrapper.vm.taskOrderDetails.clins[1].clin_number
  //   expect(newClinNumber).toBe('0002');
  // });

  // it("deletes a CLIN", async () => {
  //   await Vue.nextTick();
  //   await wrapper.vm.deleteClin(1);
  //   let clinCount = wrapper.vm.taskOrderDetails.clins.length;
  //   expect(clinCount).toBe(0);

  //   await wrapper.vm.deleteClin(0);
  //   clinCount = wrapper.vm.taskOrderDetails.clins.length;
  //   expect(clinCount).toBe(0);
  // });

  // it("test validate() ", async () => {
  //   const validated = await wrapper.vm.validate();
  //   expect(validated).toBe(false);
  // });
});
