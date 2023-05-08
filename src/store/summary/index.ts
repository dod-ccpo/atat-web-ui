/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";

import {
  PeriodDTO,
  PeriodOfPerformanceDTO,
} from "@/api/models";

import { SummaryItem } from "types/Global";

export const defaultSummary: SummaryItem= {
  title: "",
  description: "",
  isComplete: false,
  isTouched: false
}

@Module({
  name: "SummaryStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class SummaryStore extends VuexModule {
  

  @Action({rawError: true})
  public async getAllPeriods(): Promise<PeriodDTO[] | null> {
    return this.periods;
  }


  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

 
}

const Summary = getModule(SummaryStore);
export default Summary;
