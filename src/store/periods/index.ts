/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";

import api from "@/api";
import { PeriodDTO, PeriodOfPerformanceDTO, ReferenceColumn } from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "../acquisitionPackage";

const savePeriod = async (period: PeriodDTO): Promise<PeriodDTO> => {
  try {
    const periodSysId = period.sys_id;
    const savedPeriod = periodSysId?.length ?
      await api.periodTable.update(periodSysId, period) :
      await api.periodTable.create(period);

    return savedPeriod;

  } catch (error) {
    throw new Error(`an error occurred saving period ${error}`)

  }
}

@Module({
  name: "PeriodsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class PeriodsStore extends VuexModule {
  periods: PeriodDTO[] | null = null;
  periodOfPerformance: PeriodOfPerformanceDTO | null = null;

  @Mutation
  public setPeriods(value: PeriodDTO[]): void {
    this.periods = value;
  }

  @Mutation
  public setPeriodOfPerformance(value: PeriodOfPerformanceDTO): void {
    this.periodOfPerformance = value;
  }

  @Action({ rawError: true })
  public async loadPeriods(): Promise<PeriodDTO[]> {
    try {
      const periodOfPerformance = await AcquisitionPackage
        .loadData<PeriodOfPerformanceDTO>({ storeProperty: StoreProperties.PeriodOfPerformance });

      this.setPeriodOfPerformance(periodOfPerformance);

      // we'll build a list of ids from the saved period of performance data
      let periods = "";

      if (periodOfPerformance.base_period) {
        periods += ((periodOfPerformance.base_period as unknown) as ReferenceColumn).value;
      }

      if (periodOfPerformance.option_periods) {
        periods += `, ${periodOfPerformance.option_periods}`;
      }

      if (!periods.length) {
        return [];
      }
      const requests = periods.split(",").map(period => api.periodTable.retrieve(period));
      const results = await Promise.all(requests);
      this.setPeriods(results);
      return results;

    } catch (error) {
      throw new Error(`error occurred loading periods :${error}`);
    }
  }

  @Action({ rawError: true })
  public async savePeriods(
    { periods, removed }: { periods: PeriodDTO[], removed: PeriodDTO[]}
  ): Promise<PeriodDTO[]> {
    try {
      const removeRequests = removed.map(period => api.periodTable.remove(period.sys_id || ""));
      if (removeRequests) {
        await Promise.all(removeRequests);
      }

      const saveRequests = periods.map(period => savePeriod(period));
      const savedPeriods = await Promise.all(saveRequests);
      this.setPeriods(savedPeriods);

      await AcquisitionPackage.saveCollection({
        collection: this.periods || [],
        property: StoreProperties.Periods
      });

      const basePeriod = savedPeriods.find(period => period.period_type === "BASE");
      const optionPeriods = savedPeriods.filter(period => period.period_type === "OPTION");

      const pop: PeriodOfPerformanceDTO = {
        sys_id: this.periodOfPerformance?.sys_id,
        base_period: basePeriod?.sys_id || "",
        option_periods: optionPeriods.map(period => period.sys_id).join(",")
      }

      await AcquisitionPackage.saveData({
        data: pop,
        storeProperty: StoreProperties.PeriodOfPerformance
      });

      return savedPeriods;

    } catch (error) {
      throw new Error(`error occurred saving periods ${error}`);
    }
  }
}

const Periods = getModule(PeriodsStore);
export default Periods;
