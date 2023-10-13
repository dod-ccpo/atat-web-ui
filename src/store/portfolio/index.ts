/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";

import {
  FilterOption,
  Portfolio,
  PortfolioDetailsDTO,
  PortfolioProvisioning,
  PortfolioSummaryQueryParams,
  User,
} from "../../../types/Global"

import AcquisitionPackage from "@/store/acquisitionPackage";
import {AlertDTO, ClinDTO, CostsDTO, PortfolioSummaryDTO, UserSearchResultDTO} from "@/api/models";
import AlertService from "@/services/alerts";
import _ from "lodash";
import {api} from "@/api";
import CurrentUserStore from "../user";
import {convertColumnReferencesToValues} from "@/api/helpers";
import { format } from "date-fns";

export const AlertTypes =  {
  SPENDING_ACTUAL:"SPENDING_ACTUAL",
  TIME_REMAINING: "TIME_REMAINING"
}

export const FundingAlertTypes = {
  POPExpiresSoonNoTOClin: "POPExpiresSoonNoTOClin",
  POPExpiresSoonWithTOClin: "POPExpiresSoonWithTOClin",
  POPExpiresSoonWithLowFunds: "POPExpiresSoonWithLowFunds",
  POPLowFunds: "POPLowFunds",
  POPFundsDelinquent: "POPFundsDelinquent",
  POPExpired: "POPExpired",
  POPZeroFundsRemaining: "POPZeroFundsRemaining"
};

interface CSPAdmin {
  dodId: string,
  email: string,
}
interface EnvironmentForProvisioning {
  cspName: string;
  operators: CSPAdmin[]
}

export interface CSPProvisioningData {
  name: string;
  classification_level?: string;
  cloud_distinguisher?: CloudDistinguisher;
}

interface CloudDistinguisher {
  description?: string;
  display_name?: string;
  name?: string;
}

// ATAT TODO AT-9567 - get env specific url from 
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

const initialCurrentPortfolio = (): Portfolio => {
  return {
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
    vendor: "",
    lastCostDataSync: ""
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

  // if user has started provisioning from an acquisition package card meatball
  // menu on the home page or the All Packages page, routing will skip both
  // the "Add to existing portfolio" and "did you use DAPPs" pages in the 
  // provisioning workflow
  public provisioningFromMeatball = false;
  @Action({rawError: true})
  public async setProvisioningFromMeatballMenu(bool: boolean): Promise<void> {
    this.doSetProvisioningFromMeatballMenu(bool);
  }
  @Mutation
  public doSetProvisioningFromMeatballMenu(bool: boolean): void {
    this.provisioningFromMeatball = bool;
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

  public selectedPortfolioPackageSysId = "";
  @Action({rawError: true})
  public async setSelectedPortfolioPackageSysId(sysId: string): Promise<void> {
    this.doSetSelectedPortfolioPackageSysId(sysId);
  }
  @Mutation
  public doSetSelectedPortfolioPackageSysId(sysId: string): void {
    this.selectedPortfolioPackageSysId = sysId;
  }
  public get getSelectedPortfolioPackageSysId(): string {
    return this.selectedPortfolioPackageSysId;
  }
  
  public portfolioProvisioningObj: PortfolioProvisioning 
    = _.cloneDeep(initialPortfolioProvisioningObj());
 
  @Action({rawError: true})
  public async getPortfolioProvisioningObj(): Promise<PortfolioProvisioning> {
    return this.portfolioProvisioningObj;
  }

  public CSPProvisioningData: CSPProvisioningData[] = [];
  public CSPHasImpactLevels = false;
  public get doesCSPHaveImpactLevels(): boolean {
    return this.CSPHasImpactLevels;
  }
  public get doesTaskOrderHaveUnclassified(): boolean {
    return this.portfolioProvisioningObj
      .classificationLevels?.includes("Unclassified") as boolean; 
  }

  @Action({ rawError: true})
  public async setCSPProvisioningData(): Promise<void> {
    try {
      let cspData: CSPProvisioningData[] = [];
      let hasCloudDistinguishers = false;
      const csp = this.portfolioProvisioningObj.csp?.toUpperCase();
      const response = await api.cloudServiceProviderTable.getQuery({
        params: {
          sysparm_fields: "name,cloud_distinguisher,classification_level",
          sysparm_query: "vendorIN" + csp
        }
      });
      response.forEach(obj => {
        const csp: CSPProvisioningData = { 
          name: obj.name, 
          classification_level: obj.classification_level,
          cloud_distinguisher: undefined
        };
        const cd = obj.cloud_distinguisher;
        if (cd && cd.length) {
          const cdObj = JSON.parse(cd);
          csp.cloud_distinguisher = cdObj;
          hasCloudDistinguishers = true;
        }
        cspData.push(csp);
      });
      cspData = cspData.sort((a,b) => a.name > b.name ? 1 : -1)
      await this.doSetCSPProvisioningData({cspData, hasCloudDistinguishers});
    } catch (error) {
      console.error(error);
    }
  }
  @Mutation
  public async doSetCSPProvisioningData(data: {
    cspData: CSPProvisioningData[],
    hasCloudDistinguishers: boolean
  }
  ): Promise<void> {
    this.CSPProvisioningData = data.cspData;
    this.CSPHasImpactLevels = data.hasCloudDistinguishers;
  }

  public envsForProvisioning: EnvironmentForProvisioning[] = [];
  @Mutation
  public addEnvForProvisioning(data: { 
    cspName: string, admin: CSPAdmin}
  ): void {
    const i = this.envsForProvisioning.findIndex(obj => obj.cspName === data.cspName);
    if (i > -1) {
      this.envsForProvisioning[i].operators.push(data.admin);
    } else {
      this.envsForProvisioning.push(
        {cspName: data.cspName, operators: [data.admin]}
      );
    }
  }

  @Action({rawError: true})
  public async startProvisioning(): Promise<void> {
    await this.resetCurrentPortfolio();
    try {
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

      const unclassCSP = this.CSPProvisioningData.find(obj => obj.classification_level === "U");
      const unclassName = unclassCSP?.name as string;
      const scrtCSP = this.CSPProvisioningData.find(obj => obj.classification_level === "S");
      const scrtName = scrtCSP?.name as string;
      const tsCSP = this.CSPProvisioningData.find(obj => obj.classification_level === "TS");
      const tsName = tsCSP?.name as string;

      this.portfolioProvisioningObj.admins?.forEach(admin => {
        if (admin.hasUnclassifiedAccess && admin.unclassifiedEmail && admin.DoDId) {
          if (admin.impactLevels && admin.impactLevels.length) {
            const dodId = admin.DoDId;
            const email = admin.unclassifiedEmail;
            admin.impactLevels.forEach(il => {
              const adm: CSPAdmin = { dodId, email }
              this.addEnvForProvisioning({ cspName: il, admin: adm });
            });
          } else {
            const adm: CSPAdmin = { dodId: admin.DoDId, email: admin.unclassifiedEmail};
            this.addEnvForProvisioning({ cspName: unclassName, admin: adm });
          }      
        }
        if (admin.hasScrtAccess && admin.scrtEmail && admin.DoDId) {
          const adm: CSPAdmin = { dodId: admin.DoDId, email: admin.scrtEmail};
          this.addEnvForProvisioning({ cspName: scrtName, admin: adm });
        }
        if (admin.hasTSAccess && admin.tsEmail && admin.DoDId) {
          const adm: CSPAdmin = { dodId: admin.DoDId, email: admin.tsEmail};
          this.addEnvForProvisioning({ cspName: tsName, admin: adm });
        }
      });

      const provisioningPostObj = {
        portfolioName: portfolioName || this.portfolioProvisioningObj.portfolioTitle,
        portfolioAgency: portfolioAgency || this.portfolioProvisioningObj.serviceOrAgency,
        environments: this.envsForProvisioning
      }
      await api.edaApi.provisionPortfolio(
        provisioningPostObj,
        this.portfolioProvisioningObj.taskOrderNumber as string,
        this.selectedAcquisitionPackageSysId
      );
    } 
    catch(error) {
      // ATAT TODO AT-9177 (EPIC) - add graceful fail message to user in UI
      throw new Error(`Error provisioning portfolio: ${error}`);
    }
  }

  /**
   * Updates just the "title" (name) property of the portfolio record
   */
  @Action({rawError: true})
  public async updatePortfolioTitle(title: string): Promise<void> {
    await api.portfolioTable.update(this.currentPortfolio.sysId as string,
      {name: title} as unknown as PortfolioSummaryDTO
    )
    this.doUpdatePortfolioTitle(title);
  }
  @Mutation
  public doUpdatePortfolioTitle(title: string): void {
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
  public portfolioIsUpdating = false;
  
  public alerts: AlertDTO[]= [];

  @Action
  public async setActiveTaskOrderNumber(taskOrderNumber: string): Promise<void> {
    await this.doSetActiveTaskOrderNumber(taskOrderNumber)
  }
  @Mutation
  public async doSetActiveTaskOrderNumber(taskOrderNumber: string): Promise<void> {
    this.activeTaskOrderNumber = taskOrderNumber;
  }

  @Action
  public async setPortfolioIsUpdating(updatingState: boolean): Promise<void> {
    await this.doSetPortfolioIsUpdating(updatingState)
  }
  @Mutation
  public async doSetPortfolioIsUpdating(updatingState: boolean): Promise<void> {
    this.portfolioIsUpdating = updatingState;
  }

  public currentPortfolio: Portfolio = _.cloneDeep(initialCurrentPortfolio());
  @Action({rawError: true})
  public async resetCurrentPortfolio(): Promise<void> {
    this.doResetCurrentPortfolio();
  }
  @Mutation
  public async doResetCurrentPortfolio(): Promise<void> {
    this.currentPortfolio = _.cloneDeep(initialCurrentPortfolio());
  }

  public isProvisioningTOFollowOn = false;
  @Action({rawError: true})
  public async setProvisioningTOFollowOn(state: boolean): Promise<void> {
    await this.doSetProvisioningTOFollowOn(state)
  }
  @Mutation
  public async doSetProvisioningTOFollowOn(state: boolean): Promise<void> {
    this.isProvisioningTOFollowOn = state;
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
  public async initProvisioningFromResponse(data: PortfolioProvisioning): Promise<void> {
    await this.doInitProvisioningFromResponse(data);
    await this.setCSPProvisioningData();
  }

  @Mutation
  public async doInitProvisioningFromResponse(data: PortfolioProvisioning): Promise<void> {
    this.portfolioProvisioningObj = data;
  }
  
  @Action({rawError: true}) 
  public async setPortfolioProvisioning(data: PortfolioProvisioning): Promise<void> {
    await this.doSetPortfolioProvisioning(data);
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
  public showArchivePortfolioModal = false;
  public showLeavePortfolioModal = false;
  public currentUserIsViewer = false;
  public currentUserIsManager = false;
  public currentUserIsOwner = false;
  public currentOwnerSysId = "";

  @Action
  public async setCurrentPortfolioFromCard(portfolioCardData: PortfolioDetailsDTO): Promise<void> {
    await this.doSetCurrentPortfolioFromCard(portfolioCardData);
    this.doSetPortfolioCreator(portfolioCardData.portfolio.portfolio_users?.creator as User)
    await this.doSetCurrentUserRole();
  }

  @Mutation
  public async doSetCurrentPortfolioFromCard(
    portfolioCardData: PortfolioDetailsDTO): Promise<void> 
  {
    const portfolioData = portfolioCardData.portfolio;
    const portfolioOwner = {...portfolioData.portfolio_users?.owner, role: "Owner"}

    const dataFromSummaryCard = {
      sysId: portfolioCardData.portfolioId,
      title: portfolioData.portfolio_name,
      description: portfolioData.description,
      status: portfolioData.portfolio_status,
      clins: portfolioData.clins,
      currentCLINs: portfolioData.clins?.filter((clin: ClinDTO) => 
        portfolioData.inPeriodClins?.includes(clin.sys_id)
      ),
      vendor: portfolioData.vendor,
      agency: portfolioData.agency,
      agencyDisplay: portfolioData.agencyDisplay,
      currentUserIsManager: portfolioData.current_user_is_manager,
      currentUserIsOwner: portfolioData.current_user_is_manager,
      portfolio_owner: portfolioOwner,
      portfolio_managers: portfolioData.portfolio_users?.managers,
      portfolio_viewers: portfolioData.portfolio_users?.viewers,
      taskOrder: {
        ...portfolioData.task_order,
        pop_start_date: portfolioData.pop_start_date,
        pop_end_date: portfolioData.pop_end_date,
        clins: [...<[]>portfolioData.clins],
      },
      members: [
        portfolioOwner, 
        ...<[]>portfolioData.portfolio_users?.managers.map((manager) =>{
          manager.role = 'Manager'
          return manager
        }),
        ...<[]>portfolioData.portfolio_users?.viewers.map((viewer) => {
          viewer.role = 'Viewer';
          return viewer
        })
      ],
      environments: portfolioData.environments,
      fundsData: {
        fundsAvailable: portfolioData.available_funds,
        estimatedFundsAvailable: portfolioData.estimated_funds_available,
        fundsToBeInvoiced: portfolioData.estimated_funds_to_be_invoiced,
        periodFundsSpent: portfolioData.period_funds_spent,
        endOfMonthXaasForecast: portfolioData.spend_end_of_month_xaas_forecast,
        endOfMonthXaasTrend: portfolioData.spend_end_of_month_xaas_forecast_trend,
        endOfPeriodForecast: portfolioData.spend_end_of_period_forecast,
        lastMonthSpent: portfolioData.spend_last_month,
        lastMonthTrend: portfolioData.spend_last_month_trend,
        spendMonthAverage: portfolioData.spend_monthly_average,
        totalPortfolioFunds: portfolioData.total_portfolio_funds,
        costs: portfolioData.clins?.reduce((acc: CostsDTO[], curr:ClinDTO) => 
          [...acc, ...<[]>curr.costs], [])
      },
      lastUpdated: portfolioData.last_updated,
      createdBy: portfolioData.portfolio_users?.creator.name,
      popStartDate: portfolioData.pop_start_date,
      popEndDate: portfolioData.pop_end_date,
    };
    Object.assign(this.currentPortfolio, dataFromSummaryCard);
    this.activeTaskOrderNumber = portfolioData.task_order?.task_order_number 
      ? portfolioData.task_order.task_order_number : "";
    this.activeTaskOrderSysId = portfolioData.task_order?.sys_id 
      ? portfolioData.task_order.sys_id : "";
  }

  @Action
  public async getSelectedPortfolioData(portfolioSysId: string): Promise<PortfolioDetailsDTO>{
    const currentUserSysId = CurrentUserStore.currentUser.sys_id;
    return api.portfolioApi.getPortfolioDetails(currentUserSysId as string, portfolioSysId)
  }

  @Mutation
  public async doSetCurrentUserRole(): Promise<void> {
    const sysId = CurrentUserStore.currentUser.sys_id as string;
    this.currentUserIsManager =
      this.currentPortfolio.currentUserIsManager as boolean;
    this.currentUserIsViewer =
      this.currentPortfolio.portfolio_viewers?.includes(sysId) as boolean;
    this.currentUserIsOwner = this.currentPortfolio.currentUserIsOwner as boolean;
  }

  @Action
  public setShowAddMembersModal(show: boolean): void {
    this.doSetShowAddMembersModal(show);
  }

  @Mutation
  public doSetShowAddMembersModal(show: boolean): void {
    this.showAddMembersModal = show;
  }

  @Action
  public setShowArchivePortfolioModal(show: boolean): void {
    this.doSetShowArchivePortfolioModal(show);
  }

  @Mutation
  public doSetShowArchivePortfolioModal(show: boolean): void {
    this.showArchivePortfolioModal = show;
  }

  @Action
  public setShowLeavePortfolioModal(show: boolean): void {
    this.doSetShowLeavePortfolioModal(show);
  }

  @Mutation
  public doSetShowLeavePortfolioModal(show: boolean): void {
    this.showLeavePortfolioModal = show;
  }

  @Action({rawError: true})
  public async removeMemberFromCurrentPortfolio(sysId: string): Promise<void> {
    const members = this.currentPortfolio.members?.filter(m => m.sys_id !== sysId);
    await this.doSetCurrentPortfolio({members});
  }

  @Action({rawError: true})
  public async setCurrentPortfolioMembers(portfolio: Portfolio): Promise<void> {
    try {
      if (portfolio.sysId) {
        const owner = portfolio.portfolio_owner as unknown as User

        const members = {
          portfolio_owner: owner.sys_id,
          portfolio_managers: portfolio.portfolio_managers,
          portfolio_viewers: portfolio.portfolio_viewers,
        } as unknown as PortfolioSummaryDTO;
        let response = await api.portfolioTable.update(portfolio.sysId, members);
        response = convertColumnReferencesToValues(response);
        debugger;
        await this.setCurrentPortfolio(response);
        await this.doSetCurrentUserRole();
        await this.populatePortfolioMembersDetail(portfolio);
      }        
    } catch(error) {
      console.error("Error updating portfolio members:" + error);
    }
  }
  @Action({rawError: true})
  public async setCurrentPortfolio(portfolio: Portfolio): Promise<void> {
    await this.doSetCurrentPortfolio(portfolio);
  }

  @Mutation
  public async doSetCurrentPortfolio(portfolio: Portfolio): Promise<void> {
    Object.assign(this.currentPortfolio, portfolio)
  }

  public userLeftPortfolio = false;
  @Action({rawError: true})
  public async setUserLeftPortfolio(value: boolean): Promise<void> {
    this.doSetUserLeftPortfolio(value);
  }
  @Mutation
  public async doSetUserLeftPortfolio(value: boolean): Promise<void> {
    this.userLeftPortfolio = value;
  }

  @Mutation
  public doSetCurrentPortfolioStatus(value: string): void {
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
    const userSysIds = portfolio.portfolio_owner + "," 
      + portfolio.portfolio_managers + "," + portfolio.portfolio_viewers;
    const allMembersDetailListDTO = await api.userApi.getUsersBySysId(userSysIds);
    const allMembersDetailList: User[] = 
      allMembersDetailListDTO.map((userSearchDTO: UserSearchResultDTO) => {
        return {
          sys_id: userSearchDTO.sys_id,
          firstName: userSearchDTO.first_name,
          lastName: userSearchDTO.last_name,
          fullName: userSearchDTO.name,
          email: userSearchDTO.email,
          phoneNumber: userSearchDTO.phone,
          agency: userSearchDTO.company,
          title: userSearchDTO.title,
        }
      });
    portfolio.members = [];
    let portfolioOwner: User = {};
    let isOwner = false;
    allMembersDetailList.forEach(member => {
      isOwner = false;
      if (portfolio.portfolio_owner === member.sys_id) {
        portfolioOwner = member;
        portfolioOwner.role = "Owner";
        isOwner = true;
      } else if (portfolio.portfolio_managers?.indexOf(member.sys_id as string) !== -1) {
        member.role = "Manager";
      } else {
        member.role = "Viewer";
      }
      if (!isOwner) {
        portfolio.members?.push(member);
      }
    })
    portfolio.members?.sort((a, b) => {
      if (a.fullName && b.fullName) {
        return a.fullName > b.fullName ? 1 : -1;
      } else {
        return 0;
      }
    });

    // add portfolio owner to front of member list
    if (Object.keys(portfolioOwner).length > 0) {
      portfolio.members.unshift(portfolioOwner);    if (portfolio.createdBy) {
        const createdByUser = await api.userApi.search(portfolio.createdBy);
        this.doSetPortfolioCreator(createdByUser[0]);
      }  
    }
    await this.doSetCurrentUserRole();
    await this.setCurrentPortfolio(portfolio);

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
      agency: user.company,
      title: user.title,
    }
  }

  @Action({rawError: true})
  public async inviteMembers(newMembers: User[]): Promise<void> {
    const managersList = this.currentPortfolio.portfolio_managers?.split(",") ?? [];
    const viewersList = this.currentPortfolio.portfolio_viewers?.split(",") ?? [];

    newMembers.forEach(newMember => {
      if (newMember.role === "Manager") {
        managersList.push(newMember.sys_id as string);
      } else {
        viewersList.push(newMember.sys_id as string);
      }
    });
    const membersPayload = {
      portfolio_managers: managersList.toString(),
      portfolio_viewers: viewersList.toString()
    }
    const response = await api.portfolioTable.update(
      this.currentPortfolio.sysId as string, membersPayload as PortfolioSummaryDTO
    );
    const portfolio = convertColumnReferencesToValues(response);
    const members = {
      portfolio_owner: portfolio.portfolio_owner,
      portfolio_managers: portfolio.portfolio_managers,
      portfolio_viewers: portfolio.portfolio_viewers,
    }
    await this.setCurrentPortfolio(members);

    await this.populatePortfolioMembersDetail(this.currentPortfolio);
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


  @Action({rawError: true})
  public async archivePortfolio(): Promise<void> {
    await api.portfolioTable.update(this.currentPortfolio.sysId as string,
      // eslint-disable-next-line max-len
      {is_archived: true, last_updated: format(new Date(), "yyyy-MM-dd HH:mm:ss")} as unknown as PortfolioSummaryDTO
    )
    this.doSetCurrentPortfolioStatus("ARCHIVED");
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    this.doReset();
  }

  @Action({rawError: true})
  public async leavePortfolio(): Promise<void>{
    const userSysId = CurrentUserStore.getCurrentUserData.sys_id;
    if(userSysId) {
      const currentPortfolio = this.currentPortfolio;

      if(currentPortfolio.portfolio_managers) {
        const managers = currentPortfolio.portfolio_managers.split(',');
        // eslint-disable-next-line camelcase
        currentPortfolio.portfolio_managers = managers.filter(id => id !== userSysId).join(',');
      }

      if(currentPortfolio.portfolio_viewers) {
        const viewers = currentPortfolio.portfolio_viewers.split(',');
        // eslint-disable-next-line camelcase
        currentPortfolio.portfolio_viewers = viewers.filter(id => id !== userSysId).join(',');
      }
      await this.setCurrentPortfolioMembers(currentPortfolio);
    }
  }

  public taskOrderDetailsAlertClosed = false;

  @Mutation
  public setTaskOrderDetailsAlertClosed(value: boolean): void {
    this.taskOrderDetailsAlertClosed = value;
  }

  @Mutation
  public async doReset(): Promise<void> {
    this.portfolioProvisioningObj = _.cloneDeep(initialPortfolioProvisioningObj());
    this.didNotUseDAPPS = false;
    this.showTOPackageSelection = true;
    this.portfolioCreator = {};
    this.selectedAcquisitionPackageSysId = "";
    this.CSPProvisioningData = [];
    this.CSPHasImpactLevels = false;    
    this.envsForProvisioning = [];
    this.activeTaskOrderNumber = "";
    this.taskOrderDetailsAlertClosed = false;
  }

 

}

const PortfolioStore = getModule(PortfolioDataStore);
export default PortfolioStore;
