/* eslint-disable camelcase */
import { calcBasePeriod } from '../index'
import axios from "axios"
import Periods from "@/store/periods";

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("testing src/router/index.ts", () => {

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
})
