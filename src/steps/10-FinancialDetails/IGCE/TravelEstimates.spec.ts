import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TravelEstimates from "@/steps/10-FinancialDetails/IGCE/TravelEstimates.vue";
import validators from "@/plugins/validation";
Vue.use(Vuetify);

describe("Testing TravelEstimates Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(TravelEstimates, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("travelFormFields() - set $data.selectedTravelEstimate to return expected value ", 
    async () => {
      const estimate = "single";
      wrapper.setData({
        selectedTravelEstimate: estimate
      })
      expect(wrapper.vm.travelFormFields).toBe(estimate)
    });

  it("santizeValue() - set $data.selectedTravelEstimate to return expected value ", 
    async () => {
      wrapper.vm.sanitizeValue(0,"0.00")
      expect(wrapper.vm.$data.Amounts[0]).toBe("")
    });

  it("getOption('0') - sends param to return formatted string like `Base`, `Option 1` ", 
    async () => {
      const getOption = wrapper.vm.getOption(0);
      expect(getOption).toBe("Base");
    });

  it("getOption('1') - sends param to return formatted string like `Base`, `Option 1` ", 
    async () => {
      const getOption = wrapper.vm.getOption(1);
      expect(getOption).toBe("Option 1");
    });




  


})
