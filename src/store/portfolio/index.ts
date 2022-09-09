/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";
import  {nameofProperty, storeDataToSession, retrieveSession} from "../helpers"
import { MemberInvites, Portfolio, User } from "../../../types/Global"
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
    Object.assign(this.portfolio,value)
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
  }

  @Action({rawError: true})
  private async initPortfolioData():Promise<void> {
    const obj: Portfolio = {
      title:  AcquisitionPackage.projectOverview?.title || "Mock Title",
      description:  AcquisitionPackage.projectOverview?.scope || "Mock Description",
      status: "Active",
      csp: "Azure",
      serviceAgency:  AcquisitionPackage.organization?.service_agency || "DISA",
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

  @Action({rawError: true})
  public async saveMembers(newMembers: MemberInvites): Promise<void> {
    newMembers.emails.forEach((email) => {
      const newMember: User = {
        firstName: "",
        lastName: "",
        email,
        role: newMembers.role,
      };
      this.portfolio.members?.push(newMember);
    });
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
    this.setInitialized(true);
  }

  @Action({rawError: true})
  public async getPortfolioData(): Promise<Portfolio> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.portfolio;
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
    if (!this.initialized) {
      try {
        const sessionRestored= retrieveSession(ATAT_PORTFOLIO_DATA_KEY);
        if(sessionRestored){
          this.setStoreData(sessionRestored);
        }
        else{
          await this.initPortfolioData();
          this.setInitialized(true);
          storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
        }
      } catch (error) {
        console.log(`error occurred loading portfolio data ${error}`)
      }
    }
  }

}

const PortfolioData = getModule(PortfolioDataStore);
export default PortfolioData;
