import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATStepperNavigation from "@/components/ATATStepperNavigation.vue";
import {DefaultProps} from "vue/types/options";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATStepperNavigation, {
      localVue,
      vuetify,
    });
  });
  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });
});

