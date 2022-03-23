import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import { AcquisitionPackageDTO } from "@/models/AcquisitionPackageDTO";

const ATAT_ACQUISTION_PACKAGE_KEY="ATAT_ACQUISTION_PACKAGE_KEY";

@Module({
  name: 'AcquisitionPackage',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class AcquisitionPackageStore extends VuexModule {
  projectTitle = "";
  acquisitionPackage: AcquisitionPackageDTO  | null = null;
  hasAlternativeContactRep: boolean | null = null;

  public getTitle(): string {
    return this.projectTitle;
  }

  @Mutation
  public setHasAlternateCOR(value: boolean): void {
    this.hasAlternativeContactRep = value;
  }

  @Mutation
  public setAcquisitionPackage(value: AcquisitionPackageDTO): void {
    this.acquisitionPackage = value;
  }

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
     
       const storedAcquisitionPackageData = sessionStorage.getItem(ATAT_ACQUISTION_PACKAGE_KEY) as string;
       
      if(storedAcquisitionPackageData && storedAcquisitionPackageData.length > 0){
           const parsedData = JSON.parse(storedAcquisitionPackageData) as AcquisitionPackageDTO;
           this.setAcquisitionPackage(parsedData);
      }
      else{

           try {
            const acquisitionPackage = await api.acquisitionPackages.create();
             if(acquisitionPackage){
               this.setAcquisitionPackage(acquisitionPackage);
               sessionStorage.setItem(ATAT_ACQUISTION_PACKAGE_KEY, JSON.stringify(acquisitionPackage));
             }
             
           } catch (error) {
             
              console.log(`error creating acquisition package ${error}`);
           }

      }
  }
}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;