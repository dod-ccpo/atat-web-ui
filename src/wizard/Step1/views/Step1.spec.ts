import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
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
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
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
    expect(validated).toBe(true);
  });
});
