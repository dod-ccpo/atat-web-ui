import {getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "../index";

@Module({name: 'AcquisitionPackage', namespaced: true, dynamic: true, store: rootStore})
export class AcquisitionPackageStore extends VuexModule {
  projectTitle = "";
  hasAlternativeContactRep: boolean | null = null;

  @Mutation
  public setHasAlternateCOR(value: boolean): void {
    this.hasAlternativeContactRep = value;
  }

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;