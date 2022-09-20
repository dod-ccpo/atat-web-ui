import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import emergencyDeclarationSupport  
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(emergencyDeclarationSupport, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

 
})
