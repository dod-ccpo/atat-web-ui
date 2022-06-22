import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'FinancialDetails',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

// EJY 6/22/22 - this appears to not be in use any longer - any reason to keep?
export class FinancialDetailsStore extends VuexModule {

  estimatedTaskOrderValue: string | null =  null;

  @Mutation
  public setEstimatedTaskOrderValue(value: string): void {
    this.estimatedTaskOrderValue = value;
  }


}

const FinancialDetails = getModule(FinancialDetailsStore);
export default FinancialDetails;
