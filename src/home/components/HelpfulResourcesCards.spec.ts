import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import HelpfulResourcesCards from "./HelpfulResourcesCards.vue";

Vue.use(Vuetify);

describe("Helpful Resources Cards Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(HelpfulResourcesCards, {
      vuetify,
      localVue
    });
  });

  describe("testing Helpful Resources Cards", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

});
