import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

@Module({
  name: 'GovtFurnishedEquipment',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class GovtFurnishedEquipmentStore extends VuexModule {

  needsPropertyCustodian: boolean | null = null;

  @Action
  public setNeedsPropertyCustodian(isNeeded: boolean): void {
    this.doSetNeedsPropertyCustodian(isNeeded);
  }
  @Mutation
  public doSetNeedsPropertyCustodian(isNeeded: boolean): void {
    this.needsPropertyCustodian = isNeeded;
  }

}

const GovtFurnishedEquipment = getModule(GovtFurnishedEquipmentStore);
export default GovtFurnishedEquipment;
