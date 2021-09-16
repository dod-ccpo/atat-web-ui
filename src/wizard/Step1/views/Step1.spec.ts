import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import stepOne from "@/wizard/Step1/views/Step1.vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuetify);

describe("Testing Step1 Component", () => {
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
    getStepTouched: () => (stepNumber: number) => {
      return true;
    },
    getStepModel: () => (stepNumber: number) => {
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
    });
    wrapper.setData({
      model: {
        name: "",
        description: "",
        dod_components: [],
        csp: "",
      },
      touched: true,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  // it("renders successfully and validates on mount", async () => {
  //   store={
  //     getters: {
  //       getStepTouched: () => (stepNumber: number) => {
  //         return false;
  //       }
  //     }
  //   }
  
  //   shallowMount(stepOne, { store });
  //   expect(await wrapper.exists()).toBe(true);
  // });

  it("contains CreatePortfolioForm Component", () => {
    expect(wrapper.vm.$refs.createPortfolioForm).toBeDefined();
  });

  it("contains CloudServiceProviderForm Component", () => {
    expect(wrapper.vm.$refs.cloudServiceProviderForm).toBeDefined();
  });

  it("test validate() ", async () => {
    await wrapper.setData({
      touched: false,
    });
    const validated = await wrapper.vm.validate();
    expect(validated).toBe(false);
  });
});
