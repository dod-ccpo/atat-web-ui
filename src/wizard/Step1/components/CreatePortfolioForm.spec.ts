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
    await wrapper.setProps({
      name: "Dummy name",
    });
    expect(wrapper.vm.$props.name).toEqual("Dummy name");
  });

  it("renders dod_components with no rules", async () => {
    await wrapper.setProps({
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

  it("test validateForm() ", async () => {
    await wrapper.setData({
      _dod_components: ["army"],
    });
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
    const validated = await wrapper.vm.validateForm();
    expect(await wrapper.vm.$data.rules.portfolioName.length).toBe(2);
    expect(await wrapper.vm.$data.rules.portfolioName[0]()).toBe(
      "Name is required"
    );
    expect(await wrapper.vm.$data.rules.portfolioName[1](111)).toBe(
      "Portfolio name must be between 4-100 characters."
    );
    expect(await wrapper.vm.$data.rules.portfolioName[0](1111)).toBe(true);
    expect(await wrapper.vm.$data.rules.portfolioName[1]("fhdjsifgh")).toBe(
      true
    );
    expect(wrapper.vm.$data.isDodComponentsValid).toBe(
      "Please select all of the DoD components that will fund your Portfolio"
    );
    expect(validated).toBe(true);
  });
});
