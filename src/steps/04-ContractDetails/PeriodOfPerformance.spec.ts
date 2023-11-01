/* eslint-disable camelcase */
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { expect, test, describe } from "vitest"
import PeriodOfPerformance from "@/steps/04-ContractDetails/PeriodOfPerformance.vue";

describe("Testing PeriodOfPerformance Component", () => {

  const period = {
    duration: 0,
    unitOfTime: ""
  }

  const wrapper:VueWrapper = shallowMount(PeriodOfPerformance, {
    props: {},
    global: {},
    plugins: []
  });

  describe("Initialization....", () => {
    test("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("test oneYearCheck()- returns a string if the period is more than one year",() =>{
    test('returns error msg string for period longer than a year', async ()=>{
      period.duration= 2;
      period.unitOfTime="YEAR";
      expect((await wrapper.vm.$options.methods.oneYearCheck(period))?.length).toBeGreaterThan(0)
    });
    test('returns error msg string for period longer than a year', async ()=>{
      period.duration= 13;
      period.unitOfTime="MONTH";
      expect((await wrapper.vm.$options.methods.oneYearCheck(period))?.length).toBeGreaterThan(0)
    });
    test('returns error msg string for period longer than a year', async ()=>{
      period.duration= 53;
      period.unitOfTime="WEEK";
      expect((await wrapper.vm.$options.methods.oneYearCheck(period))?.length).toBeGreaterThan(0)
    });
    test('returns error msg string for period longer than a year', async ()=>{
      period.duration= 366;
      period.unitOfTime="DAY";
      expect((await wrapper.vm.$options.methods.oneYearCheck(period))?.length).toBeGreaterThan(0)
    });
    test('accommodates the `switch` default statement to return an empty string', async ()=>{
      period.duration= 365;
      period.unitOfTime="DAYZZZZ";
      expect((await wrapper.vm.$options.methods.oneYearCheck(period))?.length).toBe(0)
    });
    test('returns an empty string for period <= than a year', async ()=>{
      period.duration= 365;
      period.unitOfTime="DAY";
      expect((await wrapper.vm.$options.methods.oneYearCheck(period))?.length).toBe(0)
    });
  })

})
