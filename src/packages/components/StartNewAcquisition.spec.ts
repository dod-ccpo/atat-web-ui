import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import StartNewAcquisition from "@/packages/components/StartNewAcquisition.vue";

Vue.use(Vuetify);

describe("Testing Start New Acquisition Component", () => {
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
    wrapper = mount(StartNewAcquisition, {
      vuetify,
      localVue,
      router,
    });
  });

  describe("testing Start New Acquisition", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("startNewAcquisition()", async () => {
      await wrapper.vm.startNewAcquisition();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

    it("testing @keydown.space to trigger startNewAcquisition()", async () => {
      const btn = await wrapper.find("#StartNewAcquisitionButton");
      btn.trigger('keydown.space'); // trigger viewAllPortfolios();
      expect(wrapper.vm.$route.name).toBe("Project_Overview");
    });

    it("testing @keydown.enter to trigger startNewAcquisition()", async () => {
      const btn = await wrapper.find("#StartNewAcquisitionButton");
      btn.trigger('keydown.enter'); // trigger viewAllPortfolios();
      expect(wrapper.vm.$route.name).toBe("Project_Overview");
    });

  });

});
