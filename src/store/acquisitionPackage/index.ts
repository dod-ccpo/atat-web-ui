import {  VuexModule, Module, getModule, Action, Mutation} from "vuex-module-decorators";
import rootStore from "../index";


@Module({ name: 'AcquisitionPackage',  namespaced: true, dynamic: true, store: rootStore})
export class AcquisitionPackageStore extends VuexModule  {
   hasAlternativeContactRep=  false;

   @Mutation
   public setHasAlternateCOR(value: boolean): void{
      this.hasAlternativeContactRep = value;
   }

}


const AcquisitionPackage= getModule(AcquisitionPackageStore);
export default AcquisitionPackage;