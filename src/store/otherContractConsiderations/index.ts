import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'OtherContractConsiderations',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

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

  needsFOIACoordinator: boolean | null = null;

  @Action
  public setNeedsFOIACoordinator(included: boolean): void {
    this.doSetNeedsFOIACoordinator(included);
  }
  @Mutation
  public doSetNeedsFOIACoordinator(included: boolean): void {
    this.needsFOIACoordinator = included;
  }

}

const OtherContractConsiderations = getModule(OtherContractConsiderationsStore);
export default OtherContractConsiderations;
