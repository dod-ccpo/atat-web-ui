import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'PIIRecord',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class PIIRecordStore extends VuexModule {

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

const PIIRecord = getModule(PIIRecordStore);
export default PIIRecord;
