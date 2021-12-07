import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepOne from "@/wizard/Step1/views/Step1.vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuetify);

describe("Testing Step1 Component", () => {
  const $route = {
    path: "editportfolio/:id",
    name: "editportfolio",
  };
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueAxios, axios);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {
    updateWizardStep: jest.fn(),
    saveStepModel: jest.fn(),
  };
  const getters: any = {
    "wizard/getStepTouched": () => (stepNumber: number) => {
      return false;
    },
    "wizard/getStepModel": () => (stepNumber: number) => {
      return {
        name: "",
        description: "",
        dod_components: [],
        csp: "",
      };
    },
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
      getters,
    });
    wrapper = mount(stepOne, {
      store,
      localVue,
      vuetify,
      stubs: [
        "create-portfolio-form",
        "atat-text-field",
        "atat-text-area",
        "atat-button-card",
      ],
      mocks: { $route },
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

  it("contains CreatePortfolioForm Component", () => {
    expect(wrapper.vm.$refs.createPortfolioForm).toBeDefined();
  });

  it("contains CloudServiceProviderForm Component", () => {
    expect(wrapper.vm.$refs.cloudServiceProviderForm).toBeDefined();
  });

  it("test validate() ", async () => {
    const validated = await wrapper.vm.validate();
    expect(validated).toBe(false);
  });
});
