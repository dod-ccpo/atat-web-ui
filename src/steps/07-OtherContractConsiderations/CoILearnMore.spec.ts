import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CoILearnMore from "@/steps/07-OtherContractConsiderations/CoILearnMore.vue";

Vue.use(Vuetify);

describe("Testing CoILearnMore Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CoILearnMore, {
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
