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
    it('should return a string for period longer than a year', ()=>{
      const result = wrapper.vm.oneYearCheck(period1);
      expect(result.length).toBeGreaterThan(0)
    })
    it('should return a string for period longer than 12 month', ()=>{
      const result = wrapper.vm.oneYearCheck(period2);
      expect(result.length).toBeGreaterThan(0)
    })
    it('should return a string for period longer than 52 week', ()=>{
      const result = wrapper.vm.oneYearCheck(period3);
      expect(result.length).toBeGreaterThan(0)
    })
    it('should return a string for period longer than 365 days', ()=>{
      const result = wrapper.vm.oneYearCheck(period4);
      expect(result.length).toBeGreaterThan(0)
    })
  })
  describe("test oneYearCheck()- returns a empty string if the period is one year or less",() =>{
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
    const emptyCase = {
      duration: 0,
      unitOfTime: "",
      id: null,
      order: 1,
    }

    it('should return an empty string for correct year', ()=>{
      const result = wrapper.vm.oneYearCheck(period1);
      expect(result.length).toEqual(0)
    })
    it('should return an empty string for correct month', ()=>{
      const result = wrapper.vm.oneYearCheck(period2);
      expect(result.length).toEqual(0)
    })
    it('should return an empty string for correct week', ()=>{
      const result = wrapper.vm.oneYearCheck(period3);
      expect(result.length).toEqual(0)
    })
    it('should return an empty string for correct days', ()=>{
      const result = wrapper.vm.oneYearCheck(period4);
      expect(result.length).toEqual(0)
    })
    it('should return an empty string ', ()=>{
      const result = wrapper.vm.oneYearCheck(emptyCase);
      expect(result.length).toEqual(0)
    })
  })

  describe("test setTotalPoP()- should change the value of PoP duration and base duration",() =>{
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

    it('should change the value base and total duration',() => {
      wrapper.setData({optionPeriods:[{},period3]})
      wrapper.vm.setTotalPoP()
      expect(wrapper.vm.$data.basePoPDuration).toBe(0)
      expect(wrapper.vm.$data.totalPoPDuration).toBe(364)
      expect(wrapper.vm.$data.basePeriodMissing).toBe(true)


      wrapper.setData({optionPeriods:[period1,period2]})
      wrapper.vm.setTotalPoP()
      expect(wrapper.vm.$data.basePoPDuration).toBe(365)
      expect(wrapper.vm.$data.totalPoPDuration).toBe(725)
      expect(wrapper.vm.$data.basePeriodMissing).toBe(false)

    })
  })

})
