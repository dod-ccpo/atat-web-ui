import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "../index";
import { AdditionalButton } from "../steps/types";

@Module({
  name: 'AcquisitionPackage',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class AcquisitionPackageStore extends VuexModule {
  projectTitle = "";
  hasAlternativeContactRep: boolean | null = null;

  public getTitle(): string {
    return this.projectTitle;
  }

  @Mutation
  public setHasAlternateCOR(value: boolean): void {
    this.hasAlternativeContactRep = value;
  }

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

  @Action
  public doSomethingInStore(foo: string, bar: string): void {
    console.log("do something in the store, e.g., set flag to not validate this substep");
    console.log("argsPasssed: foo: " + foo + ", bar: " + bar);
  }

}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;