import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepTwo from "@/wizard/Step2/views/Step2.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";

Vue.use(Vuetify);

describe("Testing Step1 Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueAxios, axios);
  localVue.use(VueRouter);
  const routes = [
    {
      name: "editfunding",
      path: "/",
    },
  ];
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {
    updateWizardStep: jest.fn(),
    saveStepModel: jest.fn(),
  };
  const getters: any = {
    getStepTouched: () => (stepNumber: number) => {
      return false;
    },
    getStepModel: () => (stepNumber: number) => {
      return {
        name: "",
        description: "",
        dod_components: [],
        csp: "",
      };
    },
    getTaskOrderByName: () => (id: string) => {
      return [
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
          ],
        },
      ];
    },
  };
  const router = new VueRouter({ routes });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
      getters,
    });
    wrapper = mount(stepTwo, {
      store,
      localVue,
      vuetify,
      router,
      stubs: [
        "create-portfolio-form",
        "atat-text-field",
        "atat-text-area",
        "atat-button-card",
        "atat-file-upload",
      ],
    });
    wrapper.setData({
      model: {
        name: "",
        description: "",
        dod_components: [],
        csp: "",
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("renders successfully", async () => {});

  // it("contains CreatePortfolioForm Component", () => {
  //   expect(wrapper.vm.$refs.createPortfolioForm).toBeDefined();
  // });
  //
  // it("contains CloudServiceProviderForm Component", () => {
  //   expect(wrapper.vm.$refs.cloudServiceProviderForm).toBeDefined();
  // });
  //
  it("test validate() ", async () => {
    const validated = await wrapper.vm.validate();
    expect(validated).toBe(false);
  });
});
