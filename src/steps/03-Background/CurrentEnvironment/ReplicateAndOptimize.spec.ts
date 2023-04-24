import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ReplicateAndOptimize
  from "@/steps/05-PerformanceRequirements/CurrentFunctions/ReplicateAndOptimize.vue";

Vue.use(Vuetify);

describe("Testing ReplicateAndOptimize Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReplicateAndOptimize, {
      vuetify,
      localVue
    });
  });

  describe("testing ReplicateAndOptimize render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
