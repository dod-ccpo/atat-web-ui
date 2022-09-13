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
import {
  PeriodDTO,
  PeriodOfPerformanceDTO,
  ReferenceColumn,
} from "@/api/models";
import Vue from "vue";
import AcquisitionPackage from "../acquisitionPackage";
import {
  nameofProperty,
  retrieveSession,
  storeDataToSession,
} from "../helpers";
import { StoreProperties } from "../acquisitionPackage/storeproperties";

const ATAT_PERIODS_DATA_KEY = "ATAT_PERIODS_DATA_KEY";

const savePeriod = async (period: PeriodDTO): Promise<PeriodDTO> => {
  try {
    const periodSysId = period.sys_id;
    const savedPeriod = periodSysId?.length
      ? await api.periodTable.update(periodSysId, period)
      : await api.periodTable.create(period);

    return savedPeriod;
  } catch (error) {
    throw new Error(`an error occurred saving period ${error}`);
  }
};

const initialPeriodOfPerformance: PeriodOfPerformanceDTO = {
  pop_start_request:"",
  requested_pop_start_date: "",
  time_frame: "",
  recurring_requirement: "",
  option_periods: "",
  base_period: ""
}

@Module({
  name: "PeriodsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PeriodsStore extends VuexModule {
  initialized = false;
  periods: PeriodDTO[] | null = null;
  periodOfPerformance: PeriodOfPerformanceDTO | null = null;

  @Action
  public async getAllPeriods(): Promise<PeriodDTO[] | null> {
    return this.periods;
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.periods),
    nameofProperty(this, (x) => x.periodOfPerformance),
  ];

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setPeriods(value: PeriodDTO[]): void {
    this.periods = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_PERIODS_DATA_KEY
    );

  }

  @Mutation
  public setPeriodOfPerformance(value: PeriodOfPerformanceDTO): void {
    this.periodOfPerformance = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_PERIODS_DATA_KEY
    );
  }

  @Action({ rawError: true })
  async initialize(): Promise<void> {

    const sessionRestored = retrieveSession(ATAT_PERIODS_DATA_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    }
     
  }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  @Action({ rawError: true })
  public async loadPeriods(): Promise<PeriodDTO[]> {

    await this.ensureInitialized();

    try {
      
      if(this.periodOfPerformance?.sys_id)
      {

        const periodOfPerformance =  await 
        api.periodOfPerformanceTable.retrieve(this.periodOfPerformance.sys_id);
        this.setPeriodOfPerformance(periodOfPerformance);
        // we'll build a list of ids from the saved period of performance data
        let periods = "";

        if (periodOfPerformance.base_period) {
          periods += (
          periodOfPerformance.base_period as unknown as ReferenceColumn
          ).value;
        }

        if (periodOfPerformance.option_periods) {
          periods += `, ${periodOfPerformance.option_periods}`;
        }

        if (!periods.length) {
          return [];
        }
        const requests = periods
          .split(",")
          .map((period) => api.periodTable.retrieve(period));
        const results = await Promise.all(requests);
        this.setPeriods(results);
        return results;

      }

      return [];
      
    } catch (error) {
      throw new Error(`error occurred loading periods :${error}`);
    }
  }

  @Action({rawError: true})
  public async loadPeriodOfPerformance(): Promise<PeriodOfPerformanceDTO>{

    await this.ensureInitialized();

    if(this.periodOfPerformance && this.periodOfPerformance.sys_id 
      && this.periodOfPerformance.sys_id.length > 0)
    {
      const periodOfPerformance =  await 
      api.periodOfPerformanceTable.retrieve(this.periodOfPerformance.sys_id);
      this.setPeriodOfPerformance(periodOfPerformance);

      if(periodOfPerformance && this.periods != null){
          
        const basePeriod = this.periods.find(
          (period) => period.period_type === "BASE"
        );
        const optionPeriods = this.periods.filter(
          (period) => period.period_type === "OPTION"
        );

        const pop: PeriodOfPerformanceDTO = {
          time_frame: this.periodOfPerformance?.time_frame || "",
          pop_start_request: this.periodOfPerformance?.pop_start_request || "",
          requested_pop_start_date: this.periodOfPerformance?.requested_pop_start_date  || "",
          base_period: basePeriod?.sys_id || "",
          option_periods: optionPeriods.map((period) => period.sys_id).join(","),
        };

        return pop;
      }
      
      return periodOfPerformance;

    }

    return initialPeriodOfPerformance;

  }

  @Action({ rawError: true })
  public async savePeriods({
    periods,
    removed,
  }: {
    periods: PeriodDTO[];
    removed: PeriodDTO[];
  }): Promise<PeriodDTO[]> {
    try {
      const removeRequests = removed.map((period) =>
        api.periodTable.remove(period.sys_id || "")
      );
      if (removeRequests) {
        await Promise.all(removeRequests);
      }

      const saveRequests = periods.map((period) => savePeriod(period));
      const savedPeriods = await Promise.all(saveRequests);
      this.setPeriods(savedPeriods);

      await AcquisitionPackage.saveCollection({
        collection: this.periods || [],
        property: StoreProperties.Periods,
      });

      const basePeriod = savedPeriods.find(
        (period) => period.period_type === "BASE"
      );
      const optionPeriods = savedPeriods.filter(
        (period) => period.period_type === "OPTION"
      );

      const pop: PeriodOfPerformanceDTO = {
        time_frame: this.periodOfPerformance?.time_frame || "",
        pop_start_request: this.periodOfPerformance?.pop_start_request || "",
        requested_pop_start_date: this.periodOfPerformance?.requested_pop_start_date  || "",
        base_period: basePeriod?.sys_id || "",
        option_periods: optionPeriods.map((period) => period.sys_id).join(","),
      };

      const popSysId = this.periodOfPerformance?.sys_id || "";
      const savePop = popSysId.length > 0 ? 
        api.periodOfPerformanceTable.update(popSysId || "", pop):
        api.periodOfPerformanceTable.create(pop);

      const savedPop= await savePop;

      this.setPeriodOfPerformance(savedPop);

      return savedPeriods;
    } catch (error) {
      throw new Error(`error occurred saving periods ${error}`);
    }
  }

  @Action({rawError: true})
  public async savePeriodOfPerformance(value: PeriodOfPerformanceDTO) : Promise<void>{
    const popSysId = value?.sys_id || "";
    const savePop = popSysId.length > 0 ? 
      api.periodOfPerformanceTable.update(popSysId || "", value):
      api.periodOfPerformanceTable.create(value);

    const savedPop= await savePop;
    this.setPeriodOfPerformance(savedPop);

  } 

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for organization data store");
    }
  }
}

const Periods = getModule(PeriodsStore);
export default Periods;
