import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import NewAcquisitionCard from "./NewAcquisitionCard.vue";

Vue.use(Vuetify);

describe("Helpful Resources Link Component", () => {
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
    wrapper = mount(NewAcquisitionCard, {
      vuetify,
      localVue,
      router,
    });
  });

  describe("testing Helpful Resources Link", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("startNewAcquisition()", async () => {
      await wrapper.vm.startNewAcquisition();
      expect(router.app.$route.name).toBe("Project_Overview");
    });

    it("scrollToLearnMore()", async () => {
      wrapper.vm.scrollToLearnMore();
    });

  });

});
