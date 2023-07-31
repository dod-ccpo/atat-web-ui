import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import BAALearnMore from "./BAALearnMore.vue";



Vue.use(Vuetify);

describe("Testing BAALearnMore Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(BAALearnMore, {
      vuetify,
      localVue,
    });
  });

  describe("testing BAALearnMore.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
