/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";
import  {nameofProperty, storeDataToSession, retrieveSession} from "../helpers"
import { User,Portfolio} from "../../../types/Global"
import Vue from "vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

const ATAT_PORTFOLIO_DATA_KEY = 'ATAT_PORTFOLIO_DATA_KEY';

@Module({
  name: "PortfolioData",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PortfolioDataStore extends VuexModule {
  //has the store been initialized
  initialized = false;
  portfolio: Portfolio = { 
    title: "",
    description: "",
    status: "",
    csp: "",
    serviceAgency: "",
    createdBy: "",
    provisioned: "",
    members: [],
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this,x=> x.portfolio),
  ];



  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setPortfolioData(value: Portfolio): void {
    // this.portfolio = {...this.portfolio, ...value}
    Object.assign(this.portfolio,value)
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
  }


  @Action({rawError: true})
  private async getPortfolioData():Promise<void>
  {
    const obj: Portfolio = {
      title:  AcquisitionPackage.projectOverview?.title || "Mock Title",
      description:  AcquisitionPackage.projectOverview?.scope || "Mock Description",
      status: "",
      csp: "",
      serviceAgency:  AcquisitionPackage.organization?.service_agency || "",
      createdBy:  AcquisitionPackage.acquisitionPackage?.sys_created_by || "",
      provisioned:  AcquisitionPackage.acquisitionPackage?.sys_created_on || "",
      members: [{
        firstName:"Maria",
        lastName: "Missionowner",
        email:"maria.missionowner@mail.mil",
        role: "Manager"
      }],
      updated:  AcquisitionPackage.acquisitionPackage?.sys_updated_on || ""
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
