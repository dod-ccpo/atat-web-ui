/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "@/store";

export interface TravelEstimateNeeds {
  setCeilingPrice: string,
  estimatedTravelCosts: string[]
};

export interface SurgeRequirements {
  capacity: string,
  capabilities: string
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
  surgeRequirements: SurgeRequirements = {
    capacity: "",
    capabilities: ""
  }
  
  @Mutation
  public setTravelEstimateNeeds(needs: TravelEstimateNeeds): void {
    this.travelEstimateNeeds.setCeilingPrice = needs.setCeilingPrice;
    this.travelEstimateNeeds.estimatedTravelCosts = needs.estimatedTravelCosts;
  }

  @Mutation
  public setSurgeRequirements(surgeCap: SurgeRequirements): void {
    this.surgeRequirements.capacity = surgeCap.capacity;
    this.surgeRequirements.capabilities = surgeCap.capabilities;
  }

  @Action({ rawError: true })
  public async getTravelEstimateNeeds(): Promise<TravelEstimateNeeds> {
    return this.travelEstimateNeeds;
  }

  @Action({ rawError: true })
  public async getSurgeRequirements(): Promise<SurgeRequirements> {
    return this.surgeRequirements;
  }

}

const IGCE = getModule(IGCEStore);
export default IGCE;

