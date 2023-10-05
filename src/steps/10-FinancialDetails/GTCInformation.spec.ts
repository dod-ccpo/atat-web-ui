import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import GTCInformation from "./GTCInformation.vue";
import { DefaultProps } from "vue/types/options";

Vue.use(Vuetify);

describe("Testing GTC Information component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(GTCInformation, {
      localVue,
      vuetify
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
