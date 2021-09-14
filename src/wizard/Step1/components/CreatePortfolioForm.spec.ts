import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import CreatePortfolioForm from "@/wizard/Step1/components/CreatePorfolioForm.vue";

Vue.use(Vuetify);

describe("Testing CreatePortfolioForm Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreatePortfolioForm, {
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-text-area"],
      propsData: {
        name: undefined,
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
    wrapper.setData({ rules: { portfolioName: ["2"] } });
    expect(wrapper.vm.dod_components).toBeDefined();
  });

  it("renders dod_components with no rules", async () => {
    wrapper.setProps({
      dod_components: ["air force", "army"],
    });
    expect(wrapper.vm.dod_components).toBeDefined();
  });

  it("test validateForm() ", async () => {
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(true);
  });
});
