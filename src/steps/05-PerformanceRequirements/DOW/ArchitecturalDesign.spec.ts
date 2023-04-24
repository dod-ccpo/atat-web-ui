import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ArchitecturalDesign from "@/steps/05-PerformanceRequirements/DOW/ArchitecturalDesign.vue";

Vue.use(Vuetify);

describe("Testing ArchitecturalDesign Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ArchitecturalDesign, {
      vuetify,
      localVue
    });
  });

  describe("testing ArchitecturalDesign render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
