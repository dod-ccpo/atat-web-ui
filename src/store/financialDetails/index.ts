import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { fundingIncrements, IFPData } from "types/Global";

@Module({
  name: 'FinancialDetails',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class FinancialDetailsStore extends VuexModule {

  estimatedTaskOrderValue: string | null =  null;
  fundingRequestType: string | null =  null;

  initialFundingIncrementStr = "";
  initialFundingIncrement = 0; // EJY save number or string in store?
  fundingIncrements: fundingIncrements[] = [];

  @Action
  public async getIFPData(): Promise<IFPData> {
    return {
      initialFundingIncrementStr: this.initialFundingIncrementStr,
      fundingIncrements: this.fundingIncrements,
    }
  }

  @Mutation
  public async setIFPData(data: IFPData): Promise<void> {
    this.initialFundingIncrementStr = data.initialFundingIncrementStr;
    this.fundingIncrements = data.fundingIncrements;
    return;
  }

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
