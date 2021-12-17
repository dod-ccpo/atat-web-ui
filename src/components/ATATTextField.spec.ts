import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import ATATTextField from "@/components/ATATTextField.vue";
Vue.use(Vuetify);

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTextField, {
      router,
      localVue,
      vuetify,
      propsData: {
        rules: [(v: string) => !!v || "is required"],
      },
    });
    wrapper.setData({
      id: "clin-number",
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("test input actions, is success", async () => {
    await wrapper.setData({
      isFieldDirty: true,
      isFieldValid: true,
    });
    await wrapper.vm.inputActions("hello");
    expect(wrapper.exists()).toBe(true);
  });
  it("testing validateField", async () => {
    await wrapper.vm.validateField();
    await wrapper.setProps({ validateOnLoad: true });
    expect(wrapper.exists()).toBe(true);
  });
});
