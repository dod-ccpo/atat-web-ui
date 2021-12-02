import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ATATSelect from "@/components/ATATSelect.vue";
Vue.use(Vuetify);

describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSelect, {
      localVue,
      vuetify,
      propsData: {
        rules: [(v: string) => !!v || "is required"],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("executes validateField method with no _selectedValue", async () => {
    await wrapper.setProps({
      selectedValue: "",
    });
    await wrapper.vm.validateField();
    expect(wrapper.vm.isFieldValid).toBe(false);
  });

  it("executes validateField method with valid _selectedValue", async () => {
    await wrapper.setProps({
      selectedValue: "dummy value",
    });
    await wrapper.vm.validateField();
    expect(wrapper.vm.isFieldValid).toBe(true);
  });

  it("executes validateField method with no rules", async () => {
    await wrapper.setProps({
      rules: [],
    });
    await wrapper.vm.validateField();
    expect(wrapper.vm.isFieldValid).toBe(false);
  });

  it("executes onchange method", async () => {
    const changedValue = "New Value";
    await wrapper.vm.onChange(changedValue);
    expect(wrapper.vm.selected).toBe(changedValue);
  });

  it("component mounted with existing value", async () => {
    wrapper = mount(ATATSelect, {
      localVue,
      vuetify,
      propsData: {
        selectedValue: "dummy value",
        validateOnLoad: true,
        rules: [(v: string) => !!v || "is required"],
      },
    });
    await wrapper.vm.validateField();
    expect(wrapper.vm.isFieldValid).toBe(true);
  });

  it("component mounted with no existing value && validateOnLoad == false", async () => {
    wrapper = mount(ATATSelect, {
      localVue,
      vuetify,
      propsData: {
        selectedValue: "",
        validateOnLoad: false,
        rules: [(v: string) => !!v || "is required"],
      },
    });
    await wrapper.vm.validateField();
    expect(wrapper.vm.isFieldValid).toBe(false);
  });
});
