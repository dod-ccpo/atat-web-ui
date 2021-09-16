import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import USAGovBanner from "@/components/USAGovBanner.vue";
Vue.use(Vuetify);

describe("Testing SecurityBanner Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(USAGovBanner, {
      router,
      localVue,
      vuetify,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("test toggle()", async () => {
    wrapper.vm.toggle();
    expect(wrapper.vm.show).toBe(true);
  });
});
