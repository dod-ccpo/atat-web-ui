import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ATATHeaderNav from "@/components/ATATHeaderNav.vue";
import store from "../store/index";
import VueRouter from "vue-router";
Vue.use(Vuetify);

describe("Testing HeaderNav Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATHeaderNav, {
      router,
      localVue,
      vuetify,
      store,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  it("test login() ", async () => {
    await wrapper.vm.login();
    expect(wrapper.vm.login).toBeDefined();
  });
  it("test logout() ", async () => {
    await wrapper.vm.logout();
    expect(wrapper.vm.logout).toBeDefined();
  });
  it("test logout itemClicked ", async () => {
    const item = {
      action: "logout",
    };
    await wrapper.vm.itemClicked(item);
    expect(wrapper.vm.itemClicked).toBeDefined();
  });
  it("test navigation itemClicked ", async () => {
    const item = {
      url: "fakeURL",
    };
    await wrapper.vm.itemClicked(item);
    expect(wrapper.vm.itemClicked).toBeDefined();
  });
});
