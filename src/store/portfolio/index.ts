/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";

import { 
  FilterOption, 
  MemberInvites, 
  Portfolio, 
  PortfolioCardData, 
  PortfolioProvisioning, 
  PortfolioSummaryQueryParams, 
  User,
} from "../../../types/Global"

import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import {AlertDTO, PortfolioSummaryDTO} from "@/api/models";
import AlertService from "@/services/alerts";
import _ from "lodash";
import {api} from "@/api";
import CurrentUserStore from "../user";

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

const initialPortfolioProvisioningObj = (): PortfolioProvisioning => {
  return {
    taskOrderNumber: "",
    contractor: "",
    csp: "",
    cspLong: "",
    contractIssuingOffice: "",
    totalObligatedAmount: null,
    totalAmount: null,
    popStartDate: "",
    popEndDate: "",
    classificationLevels: [],
    portfolioTitle: "",
    serviceOrAgency: "",
    admins: [],  
  }

}

@Module({
  name: "PortfolioStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class PortfolioDataStore extends VuexModule {

  public showTOPackageSelection = true;
  @Action({rawError: true})
  public async setShowTOPackageSelection(bool: boolean): Promise<void> {
    this.doSetShowTOPackageSelection(bool);
  }
  @Mutation
  public doSetShowTOPackageSelection(bool: boolean): void {
    this.showTOPackageSelection = bool;
  }


  public didNotUseDAPPS = false;
  @Action({rawError: true})
  public async setDidNotUseDAPPS(bool: boolean): Promise<void> {
    this.doSetDidNotUseDAPPS(bool);
    if (bool) {
      await AcquisitionPackage.setDisableContinue(false);
    }
  }
  @Mutation
  public doSetDidNotUseDAPPS(bool: boolean): void {
    this.didNotUseDAPPS = bool;
  }

  public selectedAcquisitionPackageSysId = "";
  @Action({rawError: true})
  public async setSelectedAcquisitionPackageSysId(sysId: string): Promise<void> {
    this.doSetSelectedAcquisitionPackageSysId(sysId);
  }
  @Mutation
  public doSetSelectedAcquisitionPackageSysId(sysId: string): void {
    this.selectedAcquisitionPackageSysId = sysId;
  }
  public get getSelectedAcquisitionPackageSysId(): string {
    return this.selectedAcquisitionPackageSysId;
  }
  

  public portfolioProvisioningObj: PortfolioProvisioning 
    = _.cloneDeep(initialPortfolioProvisioningObj());
 
  @Action({rawError: true})
  public async getPortfolioProvisioningObj(): Promise<PortfolioProvisioning> {
    return this.portfolioProvisioningObj;
  }

  @Action({rawError: true})
  public async startProvisioning(): Promise<void> {
    const unclassifiedOperators: Record<string, string>[] = [];
    const scrtOperators: Record<string, string>[] = [] 
    this.portfolioProvisioningObj.admins?.forEach(admin => {
      if (admin.hasUnclassifiedAccess && admin.unclassifiedEmail && admin.DoDId) {
        unclassifiedOperators.push({ dodId: admin.DoDId, email: admin.unclassifiedEmail });
      }
      if (admin.hasScrtAccess && admin.scrtEmail && admin.DoDId) {
        scrtOperators.push({ dodId: admin.DoDId, email: admin.scrtEmail });
      }
    });

    const provisioningPostObj = {
      portfolioName: this.portfolioProvisioningObj.portfolioTitle,
      portfolioAgency: this.portfolioProvisioningObj.serviceOrAgency,
      environments: {
        Unclassified: {
          operators: unclassifiedOperators
        },
        Secret: {
          operators: scrtOperators
        }
      }
    }

    // const 

    await api.edaApi.provisionPortfolio(
      provisioningPostObj,
      this.portfolioProvisioningObj.taskOrderNumber as string,
      this.selectedAcquisitionPackageSysId)
  }

  /**
   * Updates just the "title" (name) property of the portfolio record
   */
  @Action({rawError: true})
  public async updatePortfolioTitle(title: string | undefined): Promise<void> {
    await api.portfolioTable.update(this.currentPortfolio.sysId as string,
      {name: title} as unknown as PortfolioSummaryDTO
    )
    this.currentPortfolio.title = title;
  }

  /**
   * Updates just the description property of the portfolio record
   */
  @Action({rawError: true})
  public async updatePortfolioDescription(description: string | undefined): Promise<void> {
    await api.portfolioTable.update(this.currentPortfolio.sysId as string,
      {description: description} as unknown as PortfolioSummaryDTO
    )
    this.currentPortfolio.description = description;
  }

  public openTOSearchPortfolio = false;

  @Action({rawError: true})
  public async setOpenTOSearchModal(val: boolean): Promise<void> {
    this.setShowTOPackageSelection(true);
    this.doSetOpenTOSearchModal(val);
  }
  @Mutation
  public doSetOpenTOSearchModal(val: boolean): void {
    this.openTOSearchPortfolio = val;
  }

  private alertService = new AlertService();
  public activeTaskOrderNumber = "";
  
  public alerts: AlertDTO[]= [];
  currentPortfolio: Portfolio = { 
    sysId: "",
    title: "",
    description: "",
    status: "",
    csp: "",
    agency: "",
    createdBy: "",
    provisioned: "",
    members: [],
    taskOrderNumber: "",
  }
   
  public summaryFilterRoles: FilterOption[] = [
    {
      label: "All of my portfolios",
      value: "ALL",
      id: "All",
      type: "role",
    },
    {
      label: "Managed by me",
      value: "MANAGED",
      id: "Managed",
      type: "role",
    },
  ];  

  public summaryFilterFundingStatuses: FilterOption[] = [
    {
      label: "On track",
      value: "ON_TRACK",
      id: "OnTrack",
      type: "fundingStatuses",
    },
    {
      label: "Expiring soon",
      value: "EXPIRING_SOON",
      id: "ExpiringSoon",
      type: "fundingStatuses",
    },
    {
      label: "Funding at-risk",
      value: "AT_RISK",
      id: "AtRisk",
      type: "fundingStatuses",
    },
    {
      label: "Delinquent",
      value: "DELINQUENT",
      id: "Delinquent",
      type: "fundingStatuses",
    },
  ];

  public summaryFilterCSPs: FilterOption[] = [
    {
      label: "Amazon Web Services (AWS)",
      value: "CSP_A",
      id: "Amazon",
      abbreviation: "AWS",
      type: "csps",
    },
    {
      label: "Azure",
      value: "CSP_B",
      id: "Azure",
      type: "csps",
    },
    {
      label: "Google Cloud Platform (GCP)",
      value: "CSP_C",
      id: "GoogleCloud",
      abbreviation: "GCP",
      type: "csps",
    },
    {
      label: "Oracle",
      value: "CSP_D",
      id: "Oracle",
      type: "csps",
    },
  ];

  public defaultQueryParams: PortfolioSummaryQueryParams = {
    portfolioStatus: "", // empty string for ALL ... "ACTIVE" | "PROCESSING" | ""
    sort: "name", // "name" | "sys_updated_on"
    searchString: "",
    role: "ALL", // all, managed
    fundingStatuses: [], // 'ON_TRACK' | 'EXPIRING_SOON' | 'AT_RISK' | 'DELINQUENT'
    csps: [],
  }

  public portfolioSummaryQueryParams: PortfolioSummaryQueryParams 
    = _.cloneDeep(this.defaultQueryParams);

  public get portfolioSummaryQPs(): PortfolioSummaryQueryParams {
    return this.portfolioSummaryQueryParams;
  }

  @Action({rawError: true}) 
  public async setPortfolioProvisioning(data: PortfolioProvisioning): Promise<void> {
    this.doSetPortfolioProvisioning(data);
  }

  @Mutation
  public async doSetPortfolioProvisioning(data: PortfolioProvisioning): Promise<void> {
    this.portfolioProvisioningObj = this.portfolioProvisioningObj
      ? Object.assign(this.portfolioProvisioningObj, data)
      : data; 
  }

  @Action
  public async resetFilters(): Promise<void> {
    await this.setPortfolioSummaryQueryParams(
      {
        role: "ALL",
        fundingStatuses: [],
        csps: [],
      }
    );  

  }

  @Action
  public async resetQueryParams(): Promise<void> {
    await this.doResetQueryParams();
  }

  @Mutation
  public async doResetQueryParams(): Promise<void> {
    Object.assign(this.portfolioSummaryQueryParams, this.defaultQueryParams);
  }

  @Action
  public async setPortfolioSummaryQueryParams(
    params: PortfolioSummaryQueryParams
  ): Promise<void> {
    await this.doSetportfolioSummaryQueryParams(params);
  }

  @Mutation
  public async doSetportfolioSummaryQueryParams(
    params: PortfolioSummaryQueryParams
  ): Promise<void> {
    Object.assign(this.portfolioSummaryQueryParams, params);
  }

  //getter for portfolio status
  public get getStatus():string {
    return this.currentPortfolio.status ? this.currentPortfolio.status : "";
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
      description: portfolioData.description,
      status: portfolioData.status,
      csp: portfolioData.csp,
      agency: portfolioData.agency,
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
  public async setPortfolioData(value: Portfolio): Promise<void> {
    Object.assign(this.currentPortfolio,value)
  }

  @Mutation
  public setStatus(value: string): void {
    this.currentPortfolio.status = value;
  }

  @Mutation
  public setAlerts(value: AlertDTO[]): void {
    this.alerts = value;
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
      // TODO: AT-8747 - CREATE/UPDATE USER TO SNOW
      // in x_g_dis_atat_portfolio - either portfolio_managers or portfolio_viewers
      // depending on role
    });
  }

  @Action({rawError: true})
  public async getPortfolioData(): Promise<Portfolio> {
    // TODO: can likely remove logic below to add current user as Manager if no members
    // after AT-8747 is completed
    if (this.currentPortfolio.members?.length === 0) {
      const currentUser = await CurrentUserStore.getCurrentUser();
      const placeholderMember = {
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        email: currentUser.email,
        role: "Manager",
        phoneNumber: "5555555555",
        phoneExt: "1234",
        designation: "Civilian",
        agency: "U.S. Army"
      };
      this.currentPortfolio.members = [placeholderMember];
    }
    return this.currentPortfolio;
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
    this.setStatus(Statuses.Active.value);

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
    const lowFundsAlert = this.alerts.find(alert => alert.alert_type 
      === AlertTypes.SPENDING_ACTUAL && thresholdAtOrAbove(alert.threshold_violation_amount, 75)
    );
    const currentSpendingViolation = lowFundsAlert ? 
      getThresholdAmount(lowFundsAlert.threshold_violation_amount) : 0;

    fundingAlertData.hasLowFundingAlert = lowFundsAlert !== undefined;
    fundingAlertData.spendingViolation = lowFundsAlert !== undefined 
      ? currentSpendingViolation : 0;

    // does time remaining alert exist
    const timeremainingalert = this.alerts.find(
      alert => alert.alert_type === AlertTypes.TIME_REMAINING
    );

    fundingAlertData.daysRemaining = timeremainingalert ? 
      Number(timeremainingalert.threshold_violation_amount.replace('days','')) : 0;

    if(timeremainingalert){
      fundingAlertData.fundingAlertType =  fundingAlertData.daysRemaining <=0 ?
        FundingAlertTypes.POPExpired : (fundingAlertData.daysRemaining > 60 ? 
          fundingAlertData.fundingAlertType : FundingAlertTypes.POPExpiresSoonNoTOClin);
      if(fundingAlertData.daysRemaining <= 60){
        this.setStatus(Statuses.AtRisk.value);
      }
      if(fundingAlertData.daysRemaining <=0){
        this.setStatus(Statuses.Expired.value);
      }
  
    }

    if(fundingAlertData){
      fundingAlertData.fundingAlertType = 
       fundingAlertData.spendingViolation < 100 ? 
         (fundingAlertData.spendingViolation < 90 ? fundingAlertData.fundingAlertType :
           FundingAlertTypes.POPLowFunds): FundingAlertTypes.POPFundsDepleted;

      if(fundingAlertData.fundingAlertType == FundingAlertTypes.POPLowFunds){
        this.setStatus(Statuses.AtRisk.value);
      }
      if(fundingAlertData.fundingAlertType == FundingAlertTypes.POPFundsDepleted){
        this.setStatus(Statuses.Delinquent.value);
      }
    }
    
    if(timeremainingalert && lowFundsAlert){
      if(fundingAlertData.daysRemaining > 0 && fundingAlertData.spendingViolation < 100){
        fundingAlertData.fundingAlertType = FundingAlertTypes.POPExpiresSoonWithLowFunds;

        if (fundingAlertData.daysRemaining <= 60 || fundingAlertData.spendingViolation >= 90){
          this.setStatus(Statuses.AtRisk.value);
        }
      }
    }

    return fundingAlertData;
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    this.doReset();
  }
  @Mutation
  public async doReset(): Promise<void> {
    this.portfolioProvisioningObj = _.cloneDeep(initialPortfolioProvisioningObj());
    this.didNotUseDAPPS = false;
    this.showTOPackageSelection = true;
  }

}

const PortfolioStore = getModule(PortfolioDataStore);
export default PortfolioStore;
