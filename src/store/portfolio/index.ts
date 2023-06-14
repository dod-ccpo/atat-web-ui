/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";

import {
  Environment,
  FilterOption,
  MemberInvites, 
  Operator,
  Portfolio,
  PortfolioCardData,
  PortfolioProvisioning,
  PortfolioSummaryQueryParams,
  User,
} from "../../../types/Global"

import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import {AlertDTO,
  EnvironmentDTO, OperatorDTO, PortfolioSummaryDTO, UserSearchResultDTO} from "@/api/models";
import AlertService from "@/services/alerts";
import _ from "lodash";
import {api} from "@/api";
import CurrentUserStore from "../user";
import {AxiosRequestConfig} from "axios";
import {convertColumnReferencesToValues} from "@/api/helpers";
import { formatISO9075, startOfTomorrow } from "date-fns";

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

interface CSPAdmin {
  dodId: string,
  email: string,
}
interface EnvironmentOperators {
  cspName: string;
  operators: CSPAdmin[]
}

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

// ATAT TODO - future ticket when implemented: get env specific url from 
// atat_environments table - column `dashboard_link`
export const cspConsoleURLs: Record<string, string> = {
  azure: "https://portal.azure.com/",
  aws: "https://signin.amazonaws-us-gov.com",
  gcp: "https://console.cloud.google.com",
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

  public impactLevels: Record<string, string> = {};

  @Action({ rawError: true})
  public async setImpactLevels(): Promise<void> {
    //  EJY come back here.
  }

  @Action({rawError: true})
  public async startProvisioning(): Promise<void> {
    let portfolioName=""
    let portfolioAgency = ""
    if (this.selectedAcquisitionPackageSysId) {
      const packageId = this.selectedAcquisitionPackageSysId;
      const acquisitionPackage = convertColumnReferencesToValues(
        await api.acquisitionPackageTable.retrieve(packageId)
      );
      if(acquisitionPackage.project_overview){
        const overviewId = acquisitionPackage.project_overview as string
        const projectOverview = await api.projectOverviewTable.retrieve(
          overviewId
        );
        if(projectOverview){
          portfolioName = projectOverview.title
        }
      }
      if(acquisitionPackage.organization){
        const organizationId = acquisitionPackage.organization as string
        const organizationInfo = convertColumnReferencesToValues(await api.organizationTable
          .retrieve(organizationId));
        if(organizationInfo){
          portfolioAgency = organizationInfo.agency || ""
        }
      }
    }

    
    // const environments: EnvironmentOperators = []


    const unclassifiedOperators: Record<string, string>[] = [];
    const scrtOperators: Record<string, string>[] = [] 
    this.portfolioProvisioningObj.admins?.forEach(admin => {


      if (admin.hasUnclassifiedAccess && admin.unclassifiedEmail && admin.DoDId) {
        // unclassifiedOperators.push({ dodId: admin.DoDId, email: admin.unclassifiedEmail });
      }
      if (admin.hasScrtAccess && admin.scrtEmail && admin.DoDId) {
        // scrtOperators.push({ dodId: admin.DoDId, email: admin.scrtEmail });
      }
    });

    const provisioningPostObj = {
      portfolioName: portfolioName || this.portfolioProvisioningObj.portfolioTitle,
      portfolioAgency: portfolioAgency || this.portfolioProvisioningObj.serviceOrAgency,
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
  public activeTaskOrderSysId = "";
  
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
    environments: [],
    lastUpdated: "",
  }

  public blankEnvironment: Environment = {
    csp: "",
    csp_id: "",
    csp_display: "",
    name: "",
    dashboard_link: "",
    pending_operators: [],
    portfolio: "",
    provisioned: "",
    provisioned_date: "",
    provisioning_failure_cause: "",
    provisioning_request_date: "",
    csp_admins: [],
    environmentStatus: "",
  }  

  public currentPortfolioEnvSysId = "";
  @Action({rawError: true})
  public async setCurrentEnvSysId(sysId: string): Promise<void> {
    this.doSetCurrentEnvSysId(sysId);
  }
  @Mutation
  public doSetCurrentEnvSysId(sysId: string): void {
    this.currentPortfolioEnvSysId = sysId;
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
    debugger;
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
    await this.doSetCurrentPortfolio(portfolioData);
    const env = portfolioData.environments ? portfolioData.environments[0] : null;
    if (env && env.sys_id) {
      await this.setCurrentEnvSysId(env.sys_id);
    }
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
      agencyDisplay: portfolioData.agencyDisplay,
      taskOrderNumber: portfolioData.taskOrderNumber,
      taskOrderSysId: portfolioData.taskOrderSysId,
      portfolio_managers: portfolioData.portfolio_managers,
      portfolio_managers_detail: portfolioData.portfolio_managers_detail,
      portfolio_viewers: portfolioData.portfolio_viewers,
      portfolio_viewers_detail: portfolioData.portfolio_viewers_detail,
      members: portfolioData.members,
      environments: portfolioData.environments,
      lastUpdated: portfolioData.lastUpdated,
      createdBy: portfolioData.createdBy
    };
    Object.assign(this.currentPortfolio, dataFromSummaryCard);
    this.activeTaskOrderNumber = portfolioData.taskOrderNumber 
      ? portfolioData.taskOrderNumber : "";
    this.activeTaskOrderSysId = portfolioData.taskOrderSysId ? portfolioData.taskOrderSysId : "";
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

  /**
   * Populates the portfolio members detail for the portfolio managers and viewers.
   * After populating, the list gets sorted by the user's name.
   */
  @Action({rawError: true})
  public async populatePortfolioMembersDetail(portfolio: Portfolio): Promise<Portfolio> {
    const userSysIds = portfolio.portfolio_managers + "," + portfolio.portfolio_viewers;
    const allMembersDetailListDTO = await api.userTable.getUsersBySysId(userSysIds);

    const allMembersDetailList: User[] = 
      allMembersDetailListDTO.map((userSearchDTO: UserSearchResultDTO) => {
        return {
          sys_id: userSearchDTO.sys_id,
          firstName: userSearchDTO.first_name,
          lastName: userSearchDTO.last_name,
          fullName: userSearchDTO.name,
          email: userSearchDTO.email,
          phoneNumber: userSearchDTO.phone,
          agency: userSearchDTO.company
        }
      })
    portfolio.portfolio_managers_detail = [];
    portfolio.portfolio_viewers_detail = [];
    portfolio.members = [];
    allMembersDetailList.forEach(member => {
      if (portfolio.portfolio_managers?.indexOf(member.sys_id as string) !== -1) {
        member.role = "Manager";
        portfolio.portfolio_managers_detail?.push(member);
        
      } else {
        member.role = "Viewer";
        portfolio.portfolio_viewers_detail?.push(member);
      }
      portfolio.members?.push(member);
    })
    portfolio.members?.sort((a, b) => {
      if (a.fullName && b.fullName) {
        return a.fullName > b.fullName ? 1 : -1;
      } else {
        return 0;
      }
    });
    if (portfolio.createdBy) {
      const createdByUser = await api.userTable.search(portfolio.createdBy);
      this.doSetPortfolioCreator(createdByUser[0]);
    }
    return portfolio;
  }

  public portfolioCreator: User = {};
  @Mutation
  public doSetPortfolioCreator(user: UserSearchResultDTO): void {
    this.portfolioCreator = {
      sys_id: user.sys_id,
      firstName: user.first_name,
      lastName: user.last_name,
      fullName: user.name,
      email: user.email,
      phoneNumber: user.phone,
      agency: user.company
    }
  }

  /**
   * By updating the new members to the current portfolio, all the screen where current
   * portfolio is used for display, will get auto refreshed.
   */
  @Mutation
  public async doUpdateCurrentPortfolioMembers(newMembers: User[]): Promise<void> {
    this.currentPortfolio.portfolio_managers_detail =
      this.currentPortfolio.portfolio_managers_detail?.concat(
        newMembers.filter(newMember => newMember.role === "Manager"))
    this.currentPortfolio.portfolio_viewers_detail =
      this.currentPortfolio.portfolio_viewers_detail?.concat(
        newMembers.filter(newMember => newMember.role === "Viewer"))
    this.currentPortfolio.members = this.currentPortfolio.members?.concat(newMembers);
    this.currentPortfolio.portfolio_managers =
      this.currentPortfolio.portfolio_managers_detail?.map(
        managerDetail => managerDetail.sys_id).toString();
    this.currentPortfolio.portfolio_viewers =
      this.currentPortfolio.portfolio_viewers_detail?.map(
        viewerDetail => viewerDetail.sys_id).toString();
    this.currentPortfolio.members?.sort((a, b) => {
      if (a.fullName && b.fullName) {
        return a.fullName > b.fullName ? 1 : -1;
      } else {
        return 0;
      }
    })
  }

  /**
   * Compiles a comma separated list of managers and viewers that is a union
   * of new and existing members. Then saves the members to the Portfolio and then
   * updates the current portfolio with the new members.
   */
  @Action({rawError: true})
  public async inviteMembers(newMembers: User[]): Promise<void> {
    const managersList = this.currentPortfolio.portfolio_managers_detail ?
      this.currentPortfolio.portfolio_managers_detail.map(
        manager => manager.sys_id) : [];
    const viewersList = this.currentPortfolio.portfolio_viewers_detail ?
      this.currentPortfolio.portfolio_viewers_detail.map(
        viewer => viewer.sys_id) : [];
    newMembers.forEach(newMember => {
      if(newMember.role === "Manager") {
        managersList.push(newMember.sys_id);
      } else {
        viewersList.push(newMember.sys_id);
      }
    })
    const membersPayload = {
      portfolio_managers: managersList.toString(),
      portfolio_viewers: viewersList.toString()
    }
    await api.portfolioTable.update(this.currentPortfolio.sysId as string,
      membersPayload as PortfolioSummaryDTO);
    await this.doUpdateCurrentPortfolioMembers(newMembers);
  }

  /**
   * Loads all the operators of a portfolio and then groups them by environment. Then
   * makes a call-out to sort the operators by each environment.
   */
  @Action({rawError: true})
  public async loadAllOperatorsOfPortfolioEnvironment(environment: EnvironmentDTO): Promise<void> {
    if (!environment.csp_admins || environment.csp_admins.length === 0) {
      const queryForAllOperatorsOfPortfolio: AxiosRequestConfig = {
        params: {
          sysparm_query: "^environmentIN" + environment.sys_id
        }
      };
      let allOperatorsOfPortfolioEnv = await api.operatorTable.getQuery(
        queryForAllOperatorsOfPortfolio
      );
      allOperatorsOfPortfolioEnv.forEach(async (operator: OperatorDTO): Promise<void> => {
        operator = convertColumnReferencesToValues(operator)        
        await this.transformAndAddOperatorToPortfolioEnvironment({
          environment: environment,
          operatorDTO: operator
        })
      }, this)

      await this.sortPortfolioEnvironmentOperators(environment);
    }
  }

  /**
   * Adds the new operator to the operators list of the environment of the
   * current portfolio. It is the responsibility of the caller to ensure that
   * this is not a duplicate entry.
   */
  @Mutation
  public async transformAndAddOperatorToPortfolioEnvironment(
    newOperatorToTransform: {
      environment: EnvironmentDTO,
      operatorDTO: OperatorDTO
    }): Promise<void> {
    const operatorDTO = newOperatorToTransform.operatorDTO;
    let operatorStatus: Operator["status"] = "";
    if (operatorDTO.provisioned === "false" &&
      operatorDTO.provisioning_failure_cause?.trim().length === 0) {
      operatorStatus = "Processing"
    } else if (operatorDTO.provisioned === "false" &&
      operatorDTO.provisioning_failure_cause &&
      operatorDTO.provisioning_failure_cause.length > 0) {
      operatorStatus = "Failed"
    } else if (operatorDTO.provisioned === "true") {
      operatorStatus = "Provisioned"
    }
    
    // Business rules require status of Processing to be listed first.
    // Vuetify table sort decending puts empty values at end. 
    // Add date of tomorrow to Processing operators. Date will be hidden
    // with logic from the table. This will allow desired sorting.
    const pDate = operatorStatus === "Processing"
      ? formatISO9075(new Date(startOfTomorrow()))
      : operatorDTO.provisioned_date;

    const operator: Operator = {
      sysId: operatorDTO.sys_id,
      environment: operatorDTO.environment,
      email: operatorDTO.email,
      dodId: operatorDTO.dod_id,
      status: operatorStatus,
      addedBy: operatorDTO.added_by,
      provisionedDate: pDate,
      provisioned: operatorDTO.provisioned,
      provisioningFailureCause: operatorDTO.provisioning_failure_cause,
      provisioningRequestDate: operatorDTO.provisioning_request_date
    }
    if (!newOperatorToTransform.environment.csp_admins) {
      newOperatorToTransform.environment.csp_admins = [];
    }
    newOperatorToTransform.environment.csp_admins.unshift(operator);
  }

  /**
   * Sorts the operators (or cspAdmins) of a specific environment of the portfolio. Here are the
   * sorting rules.
   * Descending by provisioned date BUT must list all with status Processing first
   * alphabetically by email, then sort by Provisioned on date.
   */
  @Mutation
  public async sortPortfolioEnvironmentOperators(environment: EnvironmentDTO): Promise<void> {
    environment.csp_admins?.sort((a, b) => {
      const operatorA = a as unknown as Operator;
      const operatorB = b as unknown as Operator;
      // sort by provisioned date
      if (operatorA.provisionedDate && operatorB.provisionedDate) {
        return operatorB.provisionedDate > operatorA.provisionedDate ? -1 : 1;
      } else {
        return 0;
      }
    })
  }

  /**
   * Expects to get one of the environments from the current portfolio of this
   * store, to which the new operator needs to be added.
   */
  @Action({rawError: true})
  public async addCSPOperator(newOperatorToAdd: {environment: EnvironmentDTO,
    operator: Operator}): Promise<void> {
    const newOperator = newOperatorToAdd.operator;
    const operatorDTO: OperatorDTO = {
      environment: newOperatorToAdd.environment.sys_id,
      email: newOperator.email,
      dod_id: newOperator.dodId,
      // created_by is DB connection specific. Added by should be pulled from current user
      added_by: CurrentUserStore.currentUser.sys_id,
      provisioned_date: "",
      provisioned: "false",
      provisioning_failure_cause: "",
      provisioning_request_date: new Date().getUTCDate().toString()
    }
    const operatorResponse = await api.operatorTable.create(operatorDTO);
    await this.transformAndAddOperatorToPortfolioEnvironment(
      {
        environment: newOperatorToAdd.environment,
        operatorDTO: operatorResponse
      });
    await this.sortPortfolioEnvironmentOperators(newOperatorToAdd.environment);
  }

  @Action({rawError: true})
  public async getPortfolioData(): Promise<Portfolio> {
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
    this.portfolioCreator = {};
  }

}

const PortfolioStore = getModule(PortfolioDataStore);
export default PortfolioStore;
