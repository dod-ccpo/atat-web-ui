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
import { PeriodDTO } from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "../acquisitionPackage";


const savePeriod = async (period: PeriodDTO):Promise<PeriodDTO>=> {

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

    @Mutation
     public setPeriods(value: PeriodDTO[]): void{
       this.periods = value;
     }

    @Action({rawError:true})
    public async loadPeriods():Promise<PeriodDTO[]>{
      try {
  
        const periods = await AcquisitionPackage
          .getPackageData<string>({property: StoreProperties.Periods}) || "";

        if(!periods.length){
          return [];
        }
        const requests = periods.split(",").map(period=> api.periodTable.retrieve(period));
        const results = await Promise.all(requests);
        this.setPeriods(results);
        return results;
      } catch (error) {
        throw new Error(`error occurred loading periods :${error}`);
          
      }

    }

    @Action({rawError: true})
    public async savePeriod({periods, removed}:{periods: PeriodDTO[], 
        removed: PeriodDTO[]}): Promise<PeriodDTO[]>{
      try {

        const removeRequests = removed.map(period=>api.periodTable.remove(period.sys_id || ""));
        if(removeRequests){
          await Promise.all(removeRequests);
        }
       
        const saveRequests = periods.map(period=> savePeriod(period));
        const savedPeriods = await Promise.all(saveRequests);
        this.setPeriods(savedPeriods);

        await AcquisitionPackage.saveCollection({ collection: this.periods || [], 
          property: StoreProperties.Periods});

        return savedPeriods;


      } catch (error) {
        throw new Error(`error occurred saving periods ${error}`); 
      }
    }
}



const Periods = getModule(PeriodsStore);
export default Periods;
