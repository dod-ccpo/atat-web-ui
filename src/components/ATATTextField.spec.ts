import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ATATTextField from "@/components/ATATTextField.vue";
Vue.use(Vuetify);

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTextField, {
      localVue,
      vuetify,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("test input actions, is success", async () => {
    await wrapper.vm.inputActions("hello");
    expect(wrapper.exists()).toBe(true);
  });
});
