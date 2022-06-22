import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'FinancialDetails',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class FinancialDetailsStore extends VuexModule {

  estimatedTaskOrderValue: string | null =  null;
  fundingRequestType: string | null =  null;

  @Mutation
  public setEstimatedTaskOrderValue(value: string): void {
    this.estimatedTaskOrderValue = value;
  }

  @Mutation
  public setFundingRequestType(value: string): void {
    this.fundingRequestType = value;
  }

}

const FinancialDetails = getModule(FinancialDetailsStore);
export default FinancialDetails;
