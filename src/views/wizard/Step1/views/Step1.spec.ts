import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import stepOne from "@/views/wizard/Step1/views/Step1.vue";
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
      propsData: {
        step: 1,
      },
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

  it("should get errorPanelMessages", async () => {
    await wrapper.vm.errorPanelMessages;
    expect(wrapper.vm.errorPanelMessages).toStrictEqual([
      { display: false, id: 0, message: "Portfolio Name" },
      { display: false, id: 1, message: "DoD Component" },
      { display: false, id: 2, message: "Cloud Service Provider" },
    ]);
    await wrapper.vm.displayedErrorPanelMessages();
  });
  it("setTimeout in mount", async (done) => {
    setTimeout(() => {
      expect(wrapper.exists()).toBe(true);
      done();
    }, 1000);
  });

  it("test validate() ", async () => {
    const validated = await wrapper.vm.validate();
    expect(validated).toBe(false);
  });
});
