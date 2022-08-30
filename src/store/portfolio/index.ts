/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";
import  {nameofProperty, storeDataToSession, retrieveSession} from "../helpers"
import {User, PortfolioData} from "../../../types/Global"
import Vue from "vue";
import AcquisitionPackage, { AcquisitionPackageStore } from "@/store/acquisitionPackage";

const ATAT_PORTFOLIO_DATA_KEY = 'ATAT_PORTFOLIO_DATA_KEY';

@Module({
  name: "PortfolioData",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PortfolioDataStore extends VuexModule {
  // NOTE: Make sure data vars that are typed are assigned a default value.
  // If left undefined, even when set with proper value, it will return undefined.
  // Also do not use `| undefined` e.g., `private foo: SelectData | undefined;` as
  // the undefined will be returned when getting the variable value.

  //has the store been initialized
  initialized = false;
  //keeps track of project title for global display
  public title = ""
  public description = ""
  public status = ""
  public csp = ""
  public serviceAgency = ""
  public createdBy = ""
  public provisioned = ""
  public members: User[] =[]

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this,x=> x.title),
    nameofProperty(this, x=> x.description),
    nameofProperty(this, x=> x.status),
    nameofProperty(this, x=> x.csp),
    nameofProperty(this, x=> x.serviceAgency),
    nameofProperty(this, x=> x.createdBy),
    nameofProperty(this, x=> x.provisioned),
    nameofProperty(this, x=> x.members),
  ];



  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setPortfolioData(value: PortfolioData): void {
    this.description = value.description
    this.status = value.status
    this.csp = value.csp
    this.serviceAgency = value.serviceAgency
    this.createdBy = value.createdBy
    this.provisioned = value.provisioned
    this.title = value.title;
    this.members= value.members
  }


  @Action({rawError: true})
  private async getPortfolioData():Promise<void>
  {
    const obj: PortfolioData = {
      title: AcquisitionPackage.projectOverview?.title || "Mock Title",
      description: AcquisitionPackage.projectOverview?.scope || "Mock Description",
      status: "",
      csp: "",
      serviceAgency: AcquisitionPackage.organization?.service_agency || "",
      createdBy: AcquisitionPackage.acquisitionPackage?.sys_created_by || "",
      provisioned: AcquisitionPackage.acquisitionPackage?.sys_created_on || "",
      members: [{
        firstName:"Maria",
        lastName: "Missionowner",
        email:"maria.missionowner@mail.mil",
        role: "Manager"
      }],
      updated:AcquisitionPackage.acquisitionPackage?.sys_updated_on || ""
    }
    this.setPortfolioData(obj);
  }
  @Mutation
  public setStoreData(sessionData: string):void{
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error('error restoring session for portfolio data store');
    }
  }
  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    try {
      const sessionRestored= retrieveSession(ATAT_PORTFOLIO_DATA_KEY);
      if(sessionRestored){
        this.setStoreData(sessionRestored);
      }
      else{
        await this.getPortfolioData();
        this.setInitialized(true);
        storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
      }
    } catch (error) {
      console.log(`error occurred loading portfolio data ${error}`)
    }
  }

}

const PortfolioData = getModule(PortfolioDataStore);
export default PortfolioData;
