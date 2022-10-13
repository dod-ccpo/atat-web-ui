import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Packages from "./Index.vue";

Vue.use(Vuetify);

describe("Testing Packages Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(VueRouter);

  const routes = [
    {
      name: "Packages",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Packages, {
      vuetify,
      localVue,
      router,
    });
  });

  describe("testing tabClicked()", () => {
    it("renders successfully", async () => {
      wrapper.vm.tabClicked("ALL");
      const activeTab = wrapper.vm.$data.activeTab
      expect(activeTab).toBe("ALL");
    });
  });

  describe("testing navigation", () => {

    it("toAcquisitions() - tests back to home", async () => {
      wrapper.vm.$data.altBackDestination = "Home";
      await wrapper.vm.toAcquisitions();
      expect(router.app.$route.name).toBe("Project_Overview");
    });
  
  });
});
