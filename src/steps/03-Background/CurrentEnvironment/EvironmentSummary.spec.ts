import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import EnvironmentSummary from "@/steps/03-Background/CurrentEnvironment/EnvironmentSummary.vue";

Vue.use(Vuetify);

describe("Testing EnvironmentSummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(EnvironmentSummary, {
      vuetify,
      localVue
    });
  });

  describe("testing EnvironmentSummary render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
