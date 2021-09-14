import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import CreatePortfolioForm from "@/wizard/Step1/components/CreatePorfolioForm.vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuetify);

describe("Testing CreatePortfolioForm Component", () => {
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
    wrapper = mount(CreatePortfolioForm, {
      store,
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-text-area"],
      propsData: {
        name: "",
        description: "testDescription",
        dod_components: undefined,
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders dod_components", async () => {
    wrapper.setProps({
      dod_components: ["air force", "army"],
    });
    wrapper.setData({ rules: { test: ["2"] } });
    expect(wrapper.vm.dod_components).toBeDefined();
  });

  it("test validateForm() ", async () => {
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(true);
  });
});
