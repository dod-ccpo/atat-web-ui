/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "@/store";

export interface TravelEstimateNeeds {
  setCeilingPrice: string,
  estimatedTravelCosts: string[]
};

export interface SurgeRequirements {
  surgeCapacity: string,
  surgeCapabilities: string
}

@Module({
  name: "IGCEStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class IGCEStore extends VuexModule {
  travelEstimateNeeds: TravelEstimateNeeds =  {
    setCeilingPrice: "",
    estimatedTravelCosts: []
  }
  surgeCapacity: SurgeRequirements = {
    surgeCapacity: "",
    surgeCapabilities: ""
  }
  
  @Mutation
  public setTravelEstimateNeeds(needs: TravelEstimateNeeds): void {
    this.travelEstimateNeeds.setCeilingPrice = needs.setCeilingPrice;
    this.travelEstimateNeeds.estimatedTravelCosts = needs.estimatedTravelCosts;
  }

  @Mutation
  public setSurgeCapacity(surgeCap: SurgeRequirements): void {
    this.surgeCapacity.surgeCapacity = surgeCap.surgeCapacity;
    this.surgeCapacity.surgeCapabilities = surgeCap.surgeCapabilities;
  }

  @Action({ rawError: true })
  public async getTravelEstimateNeeds(): Promise<TravelEstimateNeeds> {
    return this.travelEstimateNeeds;
  }

  @Action({ rawError: true })
  public async getSurgeCapacity(): Promise<SurgeRequirements> {
    return this.surgeCapacity;
  }

}

const IGCE = getModule(IGCEStore);
export default IGCE;

