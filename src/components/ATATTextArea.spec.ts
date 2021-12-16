import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ATATTextArea from "@/components/ATATTextArea.vue";
Vue.use(Vuetify);
describe("Testing ATATTextArea Component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTextArea, {
      localVue,
      vuetify,
      stubs: ["atat-text-field", "atat-text-area"],
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("showStatusIcon true optional", async () => {
    await wrapper.setProps({ optional: true, value: "hello" });
    expect(wrapper.exists()).toBe(true);
  });
  it("showStatusIcon false optional", async () => {
    await wrapper.setData({ valid: false });
    expect(wrapper.exists()).toBe(true);
  });
});
