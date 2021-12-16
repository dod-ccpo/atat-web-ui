import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import CreatePortfolioForm from "@/views/wizard/Step1/components/CreatePorfolioForm.vue";

Vue.use(Vuetify);

describe("Testing CreatePortfolioForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: any;
  let wrapper: any;
  const getters: any = {
    "wizard/getStepTouched": () => (stepNumber: number) => {
      return false;
    },
  };
  const store = new Vuex.Store({
    getters,
  });
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreatePortfolioForm, {
      localVue,
      store,
      vuetify,
      stubs: ["atat-text-field", "atat-text-area"],
      propsData: {
        name: undefined,
        description: "testDescription",
        dod_components: undefined,
        erroredFields: [],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders dod_components", async () => {
    await wrapper.setProps({
      name: "Dummy name",
    });
    expect(wrapper.vm.$props.name).toEqual("Dummy name");
  });

  it("renders dod_components with no rules", async () => {
    await wrapper.setProps({
      rules: {},
      dod_components: ["air force", "army"],
    });
    expect(wrapper.vm.$props.dod_components).toEqual(["air force", "army"]);
  });

  it("renders dod_components with  rules", async () => {
    await wrapper.setData({
      rules: {
        portfolioName: [
          (v: string) => !!v || "Name is required",
          (v: string) =>
            (v.length >= 4 && v.length <= 100) ||
            "Portfolio name must be between 4-100 characters.",
        ],
      },
    });
    await wrapper.setProps({
      dod_components: ["air force", "army"],
    });
    expect(wrapper.vm.$props.dod_components).toEqual(["air force", "army"]);
  });
  it("testing portfolioName rules return ", async () => {
    await Vue.nextTick();
    const rules = wrapper.vm.rules.portfolioName[0]();
    const rules1 = wrapper.vm.rules.portfolioName[0]("hgfhfhfh");
    const rules2 = wrapper.vm.rules.portfolioName[1]("11");
    const rules3 = wrapper.vm.rules.portfolioName[1]("hgfhfhfh");

    expect(rules).toBe("Name is required");
    expect(rules2).toBe("Portfolio name must be between 4-100 characters.");
    expect(rules1).toBe(true);
    expect(rules3).toBe(true);
  });

  it("test validateForm() ", async () => {
    const validated = await wrapper.vm.validateForm();
    expect(validated).toBe(false);
  });
});
