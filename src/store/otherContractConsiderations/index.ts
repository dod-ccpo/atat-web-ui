import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'OtherContractConsiderations',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

// EJY 6/22/22 - this appears to not be in use any longer - any reason to keep?
export class OtherContractConsiderationsStore extends VuexModule {

  PIIRecordIncluded: boolean | null = null;

  @Action
  public setPIIRecord(included: boolean): void {
    this.doSetPIIRecordIncluded(included);
  }
  @Mutation
  public doSetPIIRecordIncluded(included: boolean): void {
    this.PIIRecordIncluded = included;
  }

}

const OtherContractConsiderations = getModule(OtherContractConsiderationsStore);
export default OtherContractConsiderations;
