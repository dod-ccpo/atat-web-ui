/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "@/store";
import Periods from "../periods";
import DescriptionOfWork from "../descriptionOfWork";
import { PeriodDTO } from "@/api/models";

export interface TravelEstimateNeeds {
  ceilingPrice: string,
  estimatedTravelCosts: string[]
};

export interface SurgeRequirements {
  capacity: string,
  capabilities: string
}

export interface Fee{
  isCharged: string,
  percentage: string
}

@Module({
  name: "IGCEStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class IGCEStore extends VuexModule {
  // flag to show/skip `CannotProceed` page 
  // found at src\steps\10-FinancialDetails\IGCE\CannotProceed.vue
  hasDOWandPoP = false;

  travelEstimateNeeds: TravelEstimateNeeds =  {
    ceilingPrice: "",
    estimatedTravelCosts: []
  }
  surgeRequirements: SurgeRequirements = {
    capacity: "",
    capabilities: ""
  }
  feeSpecs: Fee ={
    isCharged: "",
    percentage: ""
  }

  
  @Mutation
  public setTravelEstimateNeeds(needs: TravelEstimateNeeds): void {
    this.travelEstimateNeeds.ceilingPrice = needs.ceilingPrice;
    this.travelEstimateNeeds.estimatedTravelCosts = needs.estimatedTravelCosts;
  }

  @Mutation
  public setSurgeRequirements(surgeCap: SurgeRequirements): void {
    this.surgeRequirements.capacity = surgeCap.capacity;
    this.surgeRequirements.capabilities = surgeCap.capabilities;
  }

  @Mutation
  public setFeeSpecs(fee: Fee): void {
    this.feeSpecs.isCharged= fee.isCharged;
    this.feeSpecs.percentage = fee.percentage;
  } 

  @Mutation
  public setHasDOWandPop(): void {
    this.hasDOWandPoP = ((Periods.periods && Periods.periods.length > 0) && 
      DescriptionOfWork.isIncomplete === false) || false;
  }

  @Action({ rawError: true })
  public async getTravelEstimateNeeds(): Promise<TravelEstimateNeeds> {
    return this.travelEstimateNeeds;
  }

  @Action({ rawError: true })
  public async getSurgeRequirements(): Promise<SurgeRequirements> {
    return this.surgeRequirements;
  }

  @Action({ rawError: true })
  public async getFeeSpecs(): Promise<Fee> {
    return this.feeSpecs;
  }

  @Action({ rawError: true })
  public async getHasDOWandPoP(): Promise<boolean> {
    return this.hasDOWandPoP;
  }

}

const IGCE = getModule(IGCEStore);
export default IGCE;

