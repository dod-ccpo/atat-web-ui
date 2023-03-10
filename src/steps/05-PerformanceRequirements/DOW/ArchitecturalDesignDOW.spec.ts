import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ArchitecturalDesignDetails
  from "@/steps/05-PerformanceRequirements/DOW/ArchitecturalDesignDOW.vue";

Vue.use(Vuetify);

describe("Testing ArchitecturalDesignDetails Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ArchitecturalDesignDetails, {
      vuetify,
      localVue
    });
  });

  describe("testing ArchitecturalDesignDetails render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
