import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import ATATSideBar from "@/components/ATATSideBar.vue";
Vue.use(Vuetify);

describe("Testing ATATSideBar Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSideBar, {
      router,
      localVue,
      vuetify,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
