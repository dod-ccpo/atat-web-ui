import Vue from "vue";
import { createVuetify } from "vuetify";
import { mount, VueWrapper } from "@vue/test-utils";

import ArchitecturalDesignDetails
  from "@/steps/05-PerformanceRequirements/DOW/ArchitecturalDesignDOW.vue";

const Vuetify = createVuetify()
Vue.use(Vuetify);

describe("Testing ArchitecturalDesignDetails Component", () => {
  let vuetify
  let wrapper: VueWrapper;

  beforeEach(() => {
    vuetify = createVuetify();
    wrapper = mount(ArchitecturalDesignDetails, {
      vuetify,
    });
  });

  describe("testing ArchitecturalDesignDetails render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
