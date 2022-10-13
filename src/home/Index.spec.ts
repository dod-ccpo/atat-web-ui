import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Home from "./Index.vue";

Vue.use(Vuetify);


describe("Testing Landing Page", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const routes = [
    {
      name: "Project_Overview",
      path: "/"
    }
  ];

  const router = new VueRouter({
    routes
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Home, {
      vuetify,
      localVue,
      router,
    });

    const el = document.createElement("div");
    el.setAttribute("id", "HelpfulResourcesCards");
    el.scrollIntoView = jest.fn();
    document.body.appendChild(el);

  });

  describe("testing Landing Page (Home)", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("startNewAcquisition()", async () => {
      await wrapper.vm.startNewAcquisition();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

    it("scrollToResources()", async () => {
      await wrapper.vm.scrollToResources();
    });
  });

});
