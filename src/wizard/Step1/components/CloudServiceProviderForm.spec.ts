import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import CloudServiceProviderForm from "@/wizard/Step1/components/CloudServiceProviderForm.vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuetify);

describe("Testing CloudServiceProviderForm Component", () => {
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
    wrapper = mount(CloudServiceProviderForm, {
      store,
      localVue,
      vuetify,
      stubs: ["atat-button-card"],
      propsData: {
        csp: [
          {
            label: "CSP 1",
            value: "CSP 1",
            content: "CSP logo or optional text  1.",
          },
        ],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("Has a selected value", async () => {
    const value = await wrapper.vm.isSelected("one");
    expect(value).toBe(true);
  });
  it("Has no value", async () => {
    const value = await wrapper.vm.isSelected();
    expect(value).toBe("Please selected at least one Cloud Service Provider");
  });
  it("test validate() ", async () => {
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(true);
  });
  it("watches onCloudServiceProviderChange", async () => {
    await wrapper.setData({ cloudServiceProvider: "tony" });
    expect(wrapper.vm.cloudServiceProvider).toBe("tony");
  });
});
