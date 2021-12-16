import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import CloudServiceProviderForm from "@/views/wizard/Step1/components/CloudServiceProviderForm.vue";

Vue.use(Vuetify);

describe("Testing CloudServiceProviderForm Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CloudServiceProviderForm, {
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
    expect(value).toBe("Please select at least one cloud service provider");
  });
  it("test validate() ", async () => {
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(true);
  });
});
