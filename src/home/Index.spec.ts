import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Home from "./Index.vue";

Vue.use(Vuetify);


describe("Testing Landing Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Home, {
      vuetify,
      localVue
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

    it("scrollToResources()", async () => {
      await wrapper.vm.scrollToResources();
    });
  });

});
