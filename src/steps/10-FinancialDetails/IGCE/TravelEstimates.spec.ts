import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import TravelEstimates from "@/steps/10-FinancialDetails/IGCE/TravelEstimates.vue";
import validators from "@/plugins/validation";
import IGCEStore from "@/store/IGCE";
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
      wrapper.vm.currentData.ceilingPrice = estimate;
      Vue.nextTick(()=>{
        expect(wrapper.vm.travelFormFields).toBe(estimate);
      })
    });

  
  it("changeSelection() - sets $data.estimatedTravelCosts to [] if !pageLoad ", 
    async () => {
      const estimate = "single";
      await wrapper.setData({
        ceilingPrice: estimate,
        savedData: {
          ceilingPrice: "multiple",
          estimatedTravelCosts: ["1,234.56, 2,345,67"],
        },
      })
      expect(wrapper.vm.$data.estimatedTravelCosts).toEqual([]);
    });
    
  it("santizeValue() - set $data.selectedTravelEstimate to return expected value ", 
    async () => {
      wrapper.vm.sanitizeValue(0,"0.00")
      expect(wrapper.vm.currentData.estimatedTravelCosts[0]).toBe("")
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
