/* eslint-disable camelcase */
import { calcBasePeriod, IncrementalFundingResolver, FinancialPOCResolver } from '../index'
import Periods from "@/store/periods";


describe("testing src/router/index.ts", () => {
  const routeNames = {
    SummaryPage: "SummaryPage"
  }
  it("should return the amount of days in a year", async () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1"
          },
        ]
      ));
    const result = await calcBasePeriod();
    expect(result).toBe(365)
  })
  it("should return the amount of days in a week", async () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "WEEK",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1"
          },
        ]
      ));
    const result = await calcBasePeriod();
    expect(result).toBe(7)
  })
  it("should return the amount of days in a month", async () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "MONTH",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1"
          },
        ]
      ));
    const result = await calcBasePeriod();
    expect(result).toBe(30)
  })

  it("should return the amount of days in a month", async () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "",
            "period_unit_count": "",
            "period_type": "",
            "option_order": ""
          },
        ]
      ));
    const result = await calcBasePeriod();
    expect(result).toBe(0)
  })
  
  it("testing the resolver for IncrementalFunding()", () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "MONTH",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1"
          },
        ]
      ));
    
    const result = IncrementalFundingResolver("SummaryPage");
    expect(result).toBe("Incremental_Funding")
  })

  it("testing the resolver for FinancialPOCResolver()", () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1"
          },
        ]
      ));

    const result = FinancialPOCResolver("SummaryPage");
    expect(result).toBe("Financial_POC_Form")
  })
  
})
