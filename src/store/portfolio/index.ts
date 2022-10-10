/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";
import  {nameofProperty, storeDataToSession, retrieveSession} from "../helpers"

import { 
  Checkbox,
  FilterOption, 
  MemberInvites, 
  Portfolio, 
  PortfolioCardData, 
  PortfolioSummaryQueryParams, 
  User,
} from "../../../types/Global"

import Vue from "vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {StatusTypes} from "@/store/acquisitionPackage";
import { AlertDTO } from "@/api/models";
import AlertService from "@/services/alerts";

const ATAT_PORTFOLIO_DATA_KEY = 'ATAT_PORTFOLIO_DATA_KEY';

export const AlertTypes =  {
  SPENDING_ACTUAL:"SPENDING_ACTUAL",
  TIME_REMAINING: "TIME_REMAINING"
}

export const FundingAlertTypes = {
  POPExpiresSoonNoTOClin: "POPExpiresSoonDaysNoTOClin",
  POPExpiresSoonWithTOClin: "POPExpiresSoonWithTOClin",
  POPExpiresSoonWithLowFunds: "POPExpiresSoonWithLowFunds",
  POPLowFunds: "POPLowFunds",
  POPFundsAt100Percent: "POPFundsAt100Percent",
  POPFundsDepleted: "POPFundsDepleted",
  POPExpired: "POPExpired",
};

export interface FundingAlertData {
  alerts: AlertDTO[],
  daysRemaining: number,
  spendingViolation: number;
  fundingAlertType: string;
  hasLowFundingAlert: boolean;
}

export const getThresholdAmount = (value: string): number => {
  const stringVal = value.replace('%', '');
  const numVal = Number(stringVal);
  return numVal;
}
export const thresholdAtOrAbove = (value: string, threshold: number): boolean => {
  const numVal = getThresholdAmount(value);
  return !Number.isNaN(numVal) && numVal >=threshold;
}

export const cspConsoleURLs: Record<string, string> = {
  azure: "https://portal.azure.com/abc123",
  aws: "https://signin.amazonaws-us-gov.com",
  google: "https://console.cloud.google.com",
  oracle: "https://console.oraclecloud.com",
}


@Module({
  name: "PortfolioData",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class PortfolioDataStore extends VuexModule {
  
  private alertService = new AlertService();
  //has the store been initialized
  initialized = false;

  public activeTaskOrderNumber = "";
  
  public alerts: AlertDTO[]= [];
  currentPortfolio: Portfolio = { 
    sysId: "",
    title: "",
    description: "",
    status: "",
    csp: "",
    serviceAgency: "",
    createdBy: "",
    provisioned: "",
    members: [],
    taskOrderNumber: "",
  }
  public status = StatusTypes.Active;
   
  public summaryFilterRoles: FilterOption[] = [
    {
      label: "All of my portfolios",
      value: "all",
      id: "All",
      type: "role",
    },
    {
      label: "Managed by me",
      value: "managed",
      id: "Managed",
      type: "role",
    },
  ];  

  public summaryFilterFundingStatuses: FilterOption[] = [
    {
      label: "On track",
      value: "OnTrack",
      id: "OnTrack",
      type: "fundingStatuses",
    },
    {
      label: "Expiring soon",
      value: "ExpiringSoon",
      id: "ExpiringSoon",
      type: "fundingStatuses",
    },
    {
      label: "Funding at-risk",
      value: "AtRisk",
      id: "AtRisk",
      type: "fundingStatuses",
    },
    {
      label: "Delinquent",
      value: "Delinquent",
      id: "Delinquent",
      type: "fundingStatuses",
    },
  ];

  public summaryFilterCSPs: FilterOption[] = [
    {
      label: "Amazon Web Services (AWS)",
      value: "aws",
      id: "Amazon",
      abbreviation: "AWS",
      type: "csps",
    },
    {
      label: "Azure",
      value: "azure",
      id: "Azure",
      type: "csps",
    },
    {
      label: "Google Cloud Platform (GCP)",
      value: "google",
      id: "GoogleCloud",
      abbreviation: "GCP",
      type: "csps",
    },
    {
      label: "Oracle",
      value: "oracle",
      id: "Oracle",
      type: "csps",
    },
  ];


  public portfolioSummaryQueryParams: PortfolioSummaryQueryParams = {
    portfolioStatus: "all", // all, processing, active
    sort: "alpha",
    searchString: "",
    role: "all", // all, managed
    fundingStatuses: [],
    csps: [],
  }

  public get portfolioSummaryQPs(): PortfolioSummaryQueryParams {
    return this.portfolioSummaryQueryParams;
  }

  @Action
  public async setportfolioSummaryQueryParams(
    params: PortfolioSummaryQueryParams
  ): Promise<void> {
    debugger;
    await this.doSetportfolioSummaryQueryParams(params);
  }

  @Mutation
  public async doSetportfolioSummaryQueryParams(
    params: PortfolioSummaryQueryParams
  ): Promise<void> {
    Object.assign(this.portfolioSummaryQueryParams, params);
  }

  @Action
  public async queryPortfolioList(): Promise<void> {
    // make API call based on this.portfolioSummaryQueryParams values
    
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this,x=> x.currentPortfolio),
    nameofProperty(this,x=> x.status),
    nameofProperty(this,x=> x.alerts),
  ];

  //getter for portfolio status
  public get getStatus():string {
    return this.status;
  }

  public showAddMembersModal = false;
  public get getShowAddMembersModal(): boolean {
    return this.showAddMembersModal;
  }

  @Action
  public async setCurrentPortfolio(portfolioData: PortfolioCardData): Promise<void> {
    this.doSetCurrentPortfolio(portfolioData);
  }

  @Mutation
  public async doSetCurrentPortfolio(portfolioData: PortfolioCardData): Promise<void> {
    const dataFromSummaryCard = {
      sysId: portfolioData.sysId,
      title: portfolioData.title,
      status: portfolioData.status,
      csp: portfolioData.csp,
      serviceAgency: portfolioData.serviceAgency,
      taskOrderNumber: portfolioData.taskOrderNumber,
    };
    Object.assign(this.currentPortfolio, dataFromSummaryCard);
    this.activeTaskOrderNumber = portfolioData.taskOrderNumber 
      ? portfolioData.taskOrderNumber : "";
  }

  @Action
  public setActiveTaskOrderNumber(taskOrderNum: string | undefined): void {
    if (taskOrderNum) {
      this.doSetActiveTaskOrderNumber(taskOrderNum);
    }
  }
  @Mutation
  public doSetActiveTaskOrderNumber(taskOrderNum: string): void {
    this.activeTaskOrderNumber = taskOrderNum;
  }

  @Action
  public setShowAddMembersModal(show: boolean): void {
    this.doSetShowAddMembersModal(show);
  }
  @Mutation
  public doSetShowAddMembersModal(show: boolean): void {
    this.showAddMembersModal = show;
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setPortfolioData(value: Portfolio): void {
    Object.assign(this.currentPortfolio,value)
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
  }

  @Mutation
  public setStatus(value: string): void {
    this.status = value;
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
  }

  @Mutation
  public setAlerts(value: AlertDTO[]): void {
    this.alerts = value;
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
  }

  @Action({rawError: true})
  private async initPortfolioData():Promise<void> {
    const portfolioObj: Portfolio = {
      // temp add Maria Missionowner until have members from backend
      members: [{
        firstName:"Maria",
        lastName: "Missionowner",
        email:"maria.missionowner.civ@mail.mil",
        role: "Manager",
        phoneNumber:"5555555555",
        phoneExt:"1234",
        designation: "Civilian",
        serviceAgency: "U.S Army"
      }],
    };

    if (!this.currentPortfolio.sysId) {
      const obj: Portfolio = {
        title:  AcquisitionPackage.projectOverview?.title || "Mock Title",
        description:  AcquisitionPackage.projectOverview?.scope || "Mock Description",
        status: "Active",
        csp: "Azure",
        serviceAgency:  AcquisitionPackage.organization?.service_agency || "DISA",
        createdBy:  AcquisitionPackage.acquisitionPackage?.sys_created_by || "",
        provisioned:  AcquisitionPackage.acquisitionPackage?.sys_created_on || "",
        updated:  AcquisitionPackage.acquisitionPackage?.sys_updated_on || ""
      };
      Object.assign(portfolioObj, obj); 
    }
    
    this.setPortfolioData(portfolioObj);
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
      this.currentPortfolio.members?.push(newMember);
    });
    storeDataToSession(this, this.sessionProperties, ATAT_PORTFOLIO_DATA_KEY);
    this.setInitialized(true);
  }

  @Action({rawError: true})
  public async getPortfolioData(): Promise<Portfolio> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.currentPortfolio;
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

  @Action({ rawError: true })
  public async getAlerts(taskOrderNumber: string): Promise<AlertDTO[]> {
    const alerts = await this.alertService.getAlerts(taskOrderNumber);
    this.setAlerts(alerts)
    return alerts;
  }

  @Action({ rawError: true })
  public async getFundingTrackerAlert(taskOrderNumber: string):Promise<FundingAlertData>{

    //just set the status to active for now
    //in the future this logic will be more complex
    this.setStatus(StatusTypes.Active);

    const fundingAlertData: FundingAlertData = {
      alerts: [],
      daysRemaining: 0,
      spendingViolation: 0,
      fundingAlertType: "",
      hasLowFundingAlert: false,
    }

    const alerts = await this.getAlerts(taskOrderNumber);
   
    alerts.forEach(alert=>{
      if(alert.alert_type == AlertTypes.SPENDING_ACTUAL &&
        !fundingAlertData.alerts.some(alert=>alert.alert_type == AlertTypes.SPENDING_ACTUAL) ){
        fundingAlertData.alerts.push(alert);
      }
      if(alert.alert_type == AlertTypes.TIME_REMAINING && 
        !fundingAlertData.alerts.some(alert=>alert.alert_type == AlertTypes.TIME_REMAINING)){
        fundingAlertData.alerts.push(alert);
      }
    });

    // does alert type spending actual exist and if it does, does the threshold
    // meet or exceeed 100% if spending alert and threshold is at or 
    // above 100% show expiration alert
    const lowFundsAlert = this.alerts.find(alert=>alert.alert_type 
    === AlertTypes.SPENDING_ACTUAL 
    && thresholdAtOrAbove(alert.threshold_violation_amount, 75));
    const currentSpendingViolation = lowFundsAlert ? 
      getThresholdAmount(lowFundsAlert.threshold_violation_amount): 0;

    fundingAlertData.hasLowFundingAlert = lowFundsAlert !== undefined;
    fundingAlertData.spendingViolation = lowFundsAlert !== undefined 
      ? currentSpendingViolation : 0;

    // does time remaining alert exist
    const timeremainingalert = this.alerts.find(alert=>alert.alert_type == 
    AlertTypes.TIME_REMAINING);
    fundingAlertData.daysRemaining = timeremainingalert ? 
      Number(timeremainingalert.threshold_violation_amount.replace('days','')): 0;

    if(timeremainingalert){
      fundingAlertData.fundingAlertType =  fundingAlertData.daysRemaining <=0 ?
        FundingAlertTypes.POPExpired : (fundingAlertData.daysRemaining > 60 ? 
          fundingAlertData.fundingAlertType : FundingAlertTypes.POPExpiresSoonNoTOClin);
      if(fundingAlertData.daysRemaining <= 60){
        this.setStatus(StatusTypes.AtRisk);
      }
      if(fundingAlertData.daysRemaining <=0){
        this.setStatus(StatusTypes.Expired);
      }
  
    }

    if(fundingAlertData){
      fundingAlertData.fundingAlertType = 
       fundingAlertData.spendingViolation < 100 ? 
         (fundingAlertData.spendingViolation < 90 ? fundingAlertData.fundingAlertType :
           FundingAlertTypes.POPLowFunds): FundingAlertTypes.POPFundsDepleted;

      if(fundingAlertData.fundingAlertType == FundingAlertTypes.POPLowFunds){
        this.setStatus(StatusTypes.AtRisk);
      }
      if(fundingAlertData.fundingAlertType == FundingAlertTypes.POPFundsDepleted){
        this.setStatus(StatusTypes.Delinquent);
      }
    }
    
    if(timeremainingalert && lowFundsAlert){
      if(fundingAlertData.daysRemaining > 0 && fundingAlertData.spendingViolation < 100){
        fundingAlertData.fundingAlertType = FundingAlertTypes.POPExpiresSoonWithLowFunds;

        if(fundingAlertData.daysRemaining <= 60){
          this.setStatus(StatusTypes.AtRisk);
        }
        if(fundingAlertData.spendingViolation >=90){
          this.setStatus(StatusTypes.AtRisk)
        }
      }
    }
    

    return fundingAlertData;
  }

}

const PortfolioData = getModule(PortfolioDataStore);
export default PortfolioData;
