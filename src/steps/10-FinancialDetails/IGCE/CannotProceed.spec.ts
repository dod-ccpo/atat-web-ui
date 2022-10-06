import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CannotProceed from "@/steps/10-FinancialDetails/IGCE/CannotProceed.vue";
import Periods from "@/store/periods";
import DescriptionOfWork from "@/store/descriptionOfWork";
Vue.use(Vuetify);

describe("Testing CannotProceed Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CannotProceed, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it(`isPopIncomplete(PeriodDTO[]]) - check to see data.$isPopIncomplete===false`, 
    async()=>{
      Periods.setPeriods([
        {
          "period_unit": "YEAR",
          "period_unit_count": "1",
          "period_type": "BASE",
          "option_order": "1"
        }
      ])
      expect(await wrapper.vm.isPoPIncomplete).toBe(false);
    })

  it(`isPopIncomplete([]) - check to see data.$isPopIncomplete===true`, 
    async()=>{
      Periods.setPeriods([]);
      expect(await wrapper.vm.isPoPIncomplete).toBe(true);
    })

  it(`isPerformanceReqsIncomplete() - test to validate data.$isPerformanceReqsIncomplete===true`, 
    async()=>{
      const isComplete = true;
      DescriptionOfWork.setIsIncomplete(isComplete)
      expect(await wrapper.vm.isPerformanceReqsIncomplete).toBe(isComplete);
    })

})
