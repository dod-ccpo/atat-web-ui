import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SurgeCapabilities from "@/steps/10-FinancialDetails/IGCE/SurgeCapabilities.vue";
import validators from "@/plugins/validation"
import AcquisitionPackage from "@/store/acquisitionPackage";
Vue.use(Vuetify);

describe("Testing SurgeCapabilities Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      () => Promise.resolve({}));

    vuetify = new Vuetify();
    wrapper = mount(SurgeCapabilities, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

})
