/* eslint-disable camelcase */
import { createApp } from 'vue';
import {createVuetify} from "vuetify";
import { mount} from "@vue/test-utils";
import PeriodOfPerformance from "@/steps/04-ContractDetails/PeriodOfPerformance.vue";

describe("Testing PeriodOfPerformance Component", () => {
  const pop = createApp(PeriodOfPerformance)
  let vuetify = createVuetify();
  // let wrapper: VueWrapper;

  const period = {
    duration: 0,
    unitOfTime: ""
  }
  const wrapper = mount(pop, {
    vuetify
  });

  beforeEach(() => {
    
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("test oneYearCheck()- returns a string if the period is more than one year",() =>{
    it('returns error msg string for period longer than a year', async ()=>{
      period.duration= 2;
      period.unitOfTime="YEAR";
      expect((await wrapper.vm.$.exposed?.oneYearCheck(period)).length).toBeGreaterThan(0);
    });
    it('returns error msg string for period longer than a year', async ()=>{
      period.duration= 13;
      period.unitOfTime="MONTH";
      expect((await wrapper.vm.$.exposed?.oneYearCheck(period)).length).toBeGreaterThan(0);
    });
    it('returns error msg string for period longer than a year', async ()=>{
      period.duration= 53;
      period.unitOfTime="WEEK";
      expect((await wrapper.vm.$.exposed?.oneYearCheck(period)).length).toBeGreaterThan(0);
    });
    it('returns error msg string for period longer than a year', async ()=>{
      period.duration= 366;
      period.unitOfTime="DAY";
      expect((await wrapper.vm.$.exposed?.oneYearCheck(period)).length).toBeGreaterThan(0);
    });
    it('accommodates the `switch` default statement to return an empty string', async ()=>{
      period.duration= 365;
      period.unitOfTime="DAYZZZZ";
      expect((await wrapper.vm.$.exposed?.oneYearCheck(period)).length).toBe(0);
    });
    it('returns an empty string for period <= than a year', async ()=>{
      period.duration= 365;
      period.unitOfTime="DAY";
      expect((await wrapper.vm.$.exposed?.oneYearCheck(period)).length).toBe(0);
    });
  })

})
