import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import HelpfulResourcesLink from "./HelpfulResourcesLink.vue";

Vue.use(Vuetify);

describe("Helpful Resources Link Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(HelpfulResourcesLink, {
      vuetify,
      localVue
    });
  });

  describe("testing Helpful Resources Link", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

});
