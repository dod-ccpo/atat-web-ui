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
import AcquisitionPackage, { StoreProperties } from "../acquisitionPackage";
import {
  nameofProperty,
  retrieveSession,
  storeDataToSession,
} from "../helpers";
import * as converter from "number-to-words"
import { AxiosRequestConfig } from "axios";
import { convertColumnReferencesToValues } from "@/api/helpers";

const ATAT_PERIODS_DATA_KEY = "ATAT_PERIODS_DATA_KEY";

const savePeriod = async (period: PeriodDTO): Promise<PeriodDTO> => {
  try {
    const periodSysId = period.sys_id;

    const savedPeriod = periodSysId
      ? await api.periodTable.update(periodSysId, period)
      : await api.periodTable.create(period);

    return savedPeriod;
  } catch (error) {
    throw new Error(`an error occurred saving period ${error}`);
  }
};

export const defaultPeriodOfPerformance: PeriodOfPerformanceDTO = {
  pop_start_request: "",
  requested_pop_start_date: "",
  time_frame: "",
  recurring_requirement: "",
  option_periods: "",
  base_period: "",
}

@Module({
  name: "PeriodsStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PeriodsStore extends VuexModule {
  initialized = false;
  periods: PeriodDTO[] = [];
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

  @Action({rawError: true})
  public async getPeriodOfPerformance(): Promise<PeriodOfPerformanceDTO | null> {
    return this.periodOfPerformance;
  }

  @Action({rawError: true})
  public async setPeriodOfPerformance(value: PeriodOfPerformanceDTO): Promise<void> {
    value = convertColumnReferencesToValues(value);
    this.doSetPeriodOfPerformance(value);
    await this.savePeriodOfPerformance(value);
  }

  @Mutation
  private doSetPeriodOfPerformance(value: PeriodOfPerformanceDTO): void {
    this.periodOfPerformance = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_PERIODS_DATA_KEY
    );
  }

  @Action({rawError: true})
  public async loadPeriodOfPerformanceFromSysId(sysId: string): Promise<void> {
    let periodOfPerformance = await api.periodOfPerformanceTable.retrieve(sysId);
    periodOfPerformance = convertColumnReferencesToValues(periodOfPerformance);

    this.setPeriods([]);

    if (periodOfPerformance) {
      const periods: PeriodDTO[] = [];
      const basePeriodSysId = periodOfPerformance.base_period as string;

      await this.setPeriodOfPerformance({
        ...periodOfPerformance,
        base_period: basePeriodSysId
      });

      if (basePeriodSysId) {   
        let basePeriod = await api.periodTable.retrieve(basePeriodSysId);
        if (basePeriod) {
          basePeriod = convertColumnReferencesToValues(basePeriod);
          periods.push(basePeriod);
        }
      }
  
      if(periodOfPerformance.option_periods){
        const optionPeriodsArr = periodOfPerformance.option_periods.split(",");
        let queryString = "sys_id=";
        if(optionPeriodsArr.length > 1)
          queryString += optionPeriodsArr.join("^ORsys_id=")
        else if (optionPeriodsArr.length == 1) {
          queryString += optionPeriodsArr[0];
        }
  
        if(optionPeriodsArr.length > 0) {
          const config: AxiosRequestConfig = {
            params: {
              sysparm_display_value: "false",
              sysparm_query: queryString
            }
          };
  
          const optionPeriods: PeriodDTO[] = await api.periodTable.getQuery(config);
          if (optionPeriods.length) {
            periods.push(...optionPeriods);
          }
        }
      }
      this.setPeriods(periods);
    }
    
  }

  @Action({rawError: true})
  public async initialPeriodOfPerformance(): Promise<PeriodOfPerformanceDTO> {
    try { 

      if(!this.initialized){
        const periodOfPerformance = await api.periodOfPerformanceTable.create(
          defaultPeriodOfPerformance
        );

        await this.setPeriodOfPerformance(periodOfPerformance);
        this.setInitialized(true);

        return periodOfPerformance;
      }

      return this.periodOfPerformance || defaultPeriodOfPerformance;
      
    } catch(error) {
      throw new Error(`an error occurred while initializing period of performance ${error}`);
    }
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
        // we'll build a list of ids from the saved period of performance data
        let periods = "";

        if (this.periodOfPerformance.base_period) {
          const baseSysId = typeof this.periodOfPerformance.base_period === "object"
            ? (this.periodOfPerformance.base_period as ReferenceColumn).value as string
            : this.periodOfPerformance.base_period as string;
          periods += baseSysId
        }

        if (this.periodOfPerformance.option_periods) {
          periods += `,${this.periodOfPerformance.option_periods}`;
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
      let periodOfPerformance = await api.periodOfPerformanceTable.retrieve(
        this.periodOfPerformance.sys_id
      );

      periodOfPerformance = convertColumnReferencesToValues(periodOfPerformance);

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
          sys_id: this.periodOfPerformance.sys_id || "",
        };

        return pop;
      }
      
      return periodOfPerformance;

    }

    return await this.initialPeriodOfPerformance();

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

      const savedPop = await savePop;

      savedPop.base_period = basePeriod?.sys_id || "";

      this.setPeriodOfPerformance(savedPop);

      return savedPeriods;
    } catch (error) {
      throw new Error(`error occurred saving periods ${error}`);
    }
  }

  @Action({rawError: true})
  public async savePeriodOfPerformance(value: PeriodOfPerformanceDTO) : Promise<void>{
    await api.periodOfPerformanceTable.update(value.sys_id || "", value);
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

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_PERIODS_DATA_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.periods = [];
    this.periodOfPerformance = null;
  }

  @Action({rawError:true})
  public formatPeriodOfPerformance(): string {
    if (this.periods.length === 0){
      return "";
    }

    const basePeriod = this.periods.filter(p=>p.period_type.toLowerCase()==="base")[0]
    const optionPeriods = this.periods.filter(p=>p.period_type.toLowerCase()!=="base");
  
    let formattedPop = "";
    formattedPop += basePeriod.period_unit_count
    formattedPop += " ";
    formattedPop += basePeriod.period_unit.toLowerCase();
    formattedPop += " base period";
    formattedPop += optionPeriods.length > 0 ? ", plus " : "";

    const extractFromOptionGroup = (group: PeriodDTO[], prefix: string): string => {
      let section = "";
      section += prefix;
      section += converter.toWords(group.length);
      section += " ";
      section += group[0].period_unit_count;
      section += "-";
      section += group[0].period_unit.toLowerCase();
      section += " option period";
      section += group.length > 1 ? "s" : "";
      return section;
    };

    // costs.sort((a, b) => Date.parse(a.year_month) - Date.parse(b.year_month));
    const orderedPeriods: PeriodDTO[] = 
      [...optionPeriods].sort(
        (a, b) => parseInt(a.option_order) - parseInt(b.option_order));
    let previousPeriod!: PeriodDTO;
    let currentGroup: PeriodDTO[] = [];
    const allGroups: PeriodDTO[][] = [];
    for (const period of orderedPeriods) {
      if (
        previousPeriod &&
        (previousPeriod.period_unit !== period.period_unit || 
        previousPeriod.period_unit_count !== period.period_unit_count)
      ) {
        // If the current period is different from the last one, 
        // extract the current group and reset the array
        allGroups.push(currentGroup);
        currentGroup = [];
      }
      currentGroup.push(period);
      previousPeriod = period;
    }

    // Extract the final remaining group when we're done
    if (currentGroup.length > 0) {
      allGroups.push(currentGroup);
    }

    // Now that we've assembled all the groups, extract the text from them
    for (const [index, group] of allGroups.entries()) {
      if (index === 0) {
        formattedPop += extractFromOptionGroup(group, "");
      } else if (index === allGroups.length - 1) {
        formattedPop += extractFromOptionGroup(group, " and ");
      } else {
        formattedPop += extractFromOptionGroup(group, ", ");
      }
    }
    return formattedPop;
  };
}

const Periods = getModule(PeriodsStore);
export default Periods;
