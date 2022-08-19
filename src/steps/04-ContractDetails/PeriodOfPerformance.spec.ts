/* eslint-disable camelcase */
import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import PeriodOfPerformance from "@/steps/04-ContractDetails/PeriodOfPerformance.vue";
import validators from "@/plugins/validation";
import { DefaultProps } from "vue/types/options";
Vue.use(Vuetify);


describe("Testing PeriodOfPerformance Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PeriodOfPerformance, {
      localVue,
      vuetify,
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      console.log(wrapper)
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("test oneYearCheck()- returns a string if the period is more than one year",() =>{
    const period1 = {
      duration: 2,
      unitOfTime: "YEAR",
      id: null,
      order: 1,
    }
    const period2 = {
      duration: 13,
      unitOfTime: "MONTH",
      id: null,
      order: 1,
    }
    const period3 = {
      duration: 53,
      unitOfTime: "WEEK",
      id: null,
      order: 1,
    }
    const period4 = {
      duration: 366,
      unitOfTime: "DAY",
      id: null,
      order: 1,
    }
    const emptyCase = {
      duration: 0,
      unitOfTime: "",
      id: null,
      order: 1,
    }
    const p1Result = "The length of this period must be 1 year or less."
    const p2Result = "The length of this period must be 12 months or less."
    const p3Result = "The length of this period must be 52 weeks or less."
    const p4Result = "The length of this period must be 365 days or less."
    // eslint-disable-next-line max-len
    const cases = [[period1,p1Result],[period2,p2Result],[period3,p3Result],[period4,p4Result],[emptyCase,""]]
    test.each(cases)(
      'given values more than a year should return error message',(period,message) => {
        const result = wrapper.vm.oneYearCheck(period);
        expect(result).toEqual(message)
      }
    )
  })
  describe("test oneYearCheck()- returns a string if the period is more than one year",() =>{
    const period1 = {
      duration: 1,
      unitOfTime: "YEAR",
      id: null,
      order: 1,
    }
    const period2 = {
      duration: 12,
      unitOfTime: "MONTH",
      id: null,
      order: 1,
    }
    const period3 = {
      duration: 52,
      unitOfTime: "WEEK",
      id: null,
      order: 1,
    }
    const period4 = {
      duration: 365,
      unitOfTime: "DAY",
      id: null,
      order: 1,
    }
    const pResult = ""
    const cases = [[period1,pResult],[period2,pResult],[period3,pResult],[period4,pResult]]
    test.each(cases)(
      'given values more than a year should return error message',(period,message) => {
        const result = wrapper.vm.oneYearCheck(period);
        expect(result).toEqual(message)
      }
    )
  })

})
