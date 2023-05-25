/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";

import api from "@/api";
import ContactData from "@/store/contactData";
import OrganizationData from "../organizationData";
import { TableApiBase } from "@/api/tableApiBase";
import {
  AcquisitionPackageDTO,
  AttachmentDTO,
  BaseTableDTO,
  ClassificationLevelDTO,
  ContactDTO,
  ContractConsiderationsDTO,
  ContractTypeDTO,
  CurrentContractDTO,
  FairOpportunityDTO,
  MarketResearchTechniquesDTO,
  EvaluationPlanDTO,
  OrganizationDTO,
  // PeriodDTO,
  // PeriodOfPerformanceDTO,
  ProjectOverviewDTO,
  SensitiveInformationDTO,
  ReferenceColumn,
  FundingRequirementDTO,
  RegionsDTO,
  PackageDocumentsSignedDTO,
  AddressDTO
} from "@/api/models";

import { 
  SelectData, 
  EvalPlanSourceSelection, 
  EvalPlanMethod, 
  uploadingFile, 
  signedDocument,
  YesNo, 
  User,
} from "types/Global";
import { SessionData } from "./models";
import DescriptionOfWork from "@/store/descriptionOfWork"
import Attachments from "../attachments";
import TaskOrder from "../taskOrder";
import FinancialDetails from "../financialDetails";
import Periods from "../periods";
import Steps from "../steps";
import { AttachmentServiceFactory } from "@/services/attachment";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import UserStore from "../user";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import ClassificationRequirements from "@/store/classificationRequirements";
import { AxiosRequestConfig } from "axios";
import IGCE from "@/store/IGCE";
import { convertColumnReferencesToValues } from "@/api/helpers";
import {TABLENAME as PACKAGE_DOCUMENTS_SIGNED } from "@/api/packageDocumentsSigned";
import {TABLENAME as PACKAGE_DOCUMENTS_UNSIGNED } from "@/api/packageDocumentsUnsigned";
const ATAT_ACQUISTION_PACKAGE_KEY = "ATAT_ACQUISTION_PACKAGE_KEY";

export const StoreProperties = {
  CurrentContract: "currentContract",
  ContractType: "contractType",
  Periods: "periods",
  ProjectOverview: "projectOverview",
  Organization: "organization",
  FairOpportunity: "fairOpportunity",
  MarketResearchTechniques: "marketResearchTechniques",
  EvaluationPlan: "evaluationPlan",
  // PeriodOfPerformance: "periodOfPerformance",
  SensitiveInformation: "sensitiveInformation",
  ClassificationLevel: "ClassificationRequirements",
  CurrentEnvironment: "currentEnvironment",
  ContractConsiderations: "contractConsiderations",
  Regions:"regions",
  PackageDocumentsSigned:"packageDocumentsSigned",
  ContractingShopNonDitcoAddress:"contractingShopNonDitcoAddress"
};

export const Statuses: Record<string, Record<string, string>> = {
  Active: { label: "Active", value: "ACTIVE" }, // PORT
  AtRisk: { label: "At-Risk", value: "AT_RISK" }, // CLIN, TO
  Archived: { label: "Archived", value: "ARCHIVED" }, // ACQ, PORT
  Deleted: { label: "Deleted", value: "DELETED" }, // ACQ
  Delinquent: { label: "Delinquent", value: "DELINQUENT" }, // CLIN
  Draft: { label: "Draft", value: "DRAFT" }, // ACQ
  Expired: { label: "Expired", value: "EXPIRED" }, // CLIN, TO
  ExpiringPop: { label: "Expiring PoP", value: "EXPIRING_POP" }, // CLIN
  ExpiringSoon: { label: "Expiring Soon", value: "EXPIRING_SOON" },
  FundingAtRisk: { label: "Funding At-Risk", value: "FUNDING_AT_RISK" }, // CLIN
  OnTrack: { label: "On Track", value: "ON_TRACK" }, // CLIN, TO
  OptionExercised: { label: "Option Exercised", value: "OPTION_EXERCISED" }, // CLIN
  OptionPending: { label: "Option Pending", value: "OPTION_PENDING" }, // CLIN  
  Processing: { label: "Processing", value: "PROCESSING" }, // PORT
  TaskOrderAwarded: { label: "Task Order Awarded", value: "TASK_ORDER_AWARDED" }, // ACQ
  Upcoming: { label: "Upcoming", value: "UPCOMING" }, // TO
  WaitingForSignatures: { label: "Waiting For Signatures", value: "WAITING_FOR_SIGNATURES" }, // ACQ
  WaitingForTaskOrder: { label: "Waiting For Task Order", value: "WAITING_FOR_TASK_ORDER" }, // ACQ
}


export const initialCurrentContract = (): CurrentContractDTO => {
  return {
    current_contract_exists: "",
    incumbent_contractor_name: "",
    contract_number: "",
    task_delivery_order_number: "",
    contract_order_expiration_date: "",
    contract_order_start_date: "",
    competitive_status: "",
    business_size: "",
    acquisition_package:AcquisitionPackage.packageId
  }
}

const initialProjectOverview = () => {
  const disclaimer:YesNo = "";
  return {
    sys_id: "",
    title: "",
    scope: "",
    emergency_declaration: "",
    project_disclaimer: disclaimer,
  };
};

const initialOrganization = () => {
  return {
    country: "",
    address_type: "",
    city: "",
    dodaac: "",
    street_address_1: "",
    street_address_2: "",
    zip_code: "",
    sys_id: "",
    disa_organization: "",
    organization_name: "",
    agency: "",
    state: "",
  };
};
const initialNonDitcoAddress = ():AddressDTO => {
  return {
    name: "",
    address_type: "US",
    street_address_1: "",
    unit: "",
    city: "",
    zip_postal_code: "",
    state_province_state_code: "",
    country: "",
  };
};

const initialContractType = ()=> {
  return {
    firm_fixed_price: "",
    time_and_materials: "",
    contract_type_justification: "",
    acquisition_package:AcquisitionPackage.packageId
  }
}

const initialContact = () => {
  return {
    grade_civ: "",
    role: "",
    dodaac: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    type: "",
    can_access_package: "",
    phone: "",
    phone_extension: "",
    rank_components: "",
    salutation: "",
    first_name: "",
    email: "",
    title: "",
    manually_entered: "",
  };
};

const initialContractConsiderations = ()=> {
  return {
    packaging_shipping_other: "",
    contractor_required_training: "",
    packaging_shipping_other_explanation: "",
    conflict_of_interest_explanation: "",
    potential_conflict_of_interest: "",
    required_training_courses: "",
    packaging_shipping_none_apply: "",
    contractor_provided_transfer: "",
    acquisition_package: AcquisitionPackage.packageId
  }
}

const initialFairOpportunity = () => {
  return {
    exception_to_fair_opportunity: "",
  };
};

export const initialEvaluationPlan = (): EvaluationPlanDTO => {
  return {
    source_selection: "" as EvalPlanSourceSelection,
    method: "" as EvalPlanMethod,
    has_custom_specifications: undefined,
    standard_specifications: "",
    custom_specifications: "",
  }
}

const initialPeriodOfPerformance = ()=> {

  return     { 
    pop_start_request: "",
    requested_pop_start_date: "",
    time_frame: "",
    recurring_requirement: "",
    base_and_options: "",
    
  }}

const initialSensitiveInformation = ()=> {

  return {

    pii_present: "",
    system_of_record_name: "",
    work_to_be_performed: "",
      
    baa_required: "",
      
    potential_to_be_harmful: "",
      
    foia_full_name: "",
    foia_email: "",
    foia_address_type: "",
    foia_city_apo_fpo: "",
    foia_street_address_1: "",
    foia_street_address_2: "",
    foia_state_province_state_code: "",
    foia_zip_postal_code: "",
    foia_country: "",
    section_508_sufficient: "",
  }
}

const initialClassificationLevel = () => {
  return {
    impact_level: "",
    classification: "",
  }
}

const saveAcquisitionPackage = (value: AcquisitionPackageDTO) => {
  api.acquisitionPackageTable.update(value.sys_id as string, value);
};

const saveSessionData = (store: AcquisitionPackageStore) => {
  sessionStorage.setItem(
    ATAT_ACQUISTION_PACKAGE_KEY,
    JSON.stringify({
      acquisitionPackage: store.acquisitionPackage,
      projectOverview: store.projectOverview,
      organization: store.organization,
      contactInfo: store.contactInfo,
      financialPocInfo: store.financialPocInfo,
      contractConsiderations: store.contractConsiderations,
      corInfo: store.corInfo,
      acorInfo: store.acorInfo,
      contractType: store.contractType,
      currentContract: store.currentContract,
      fairOpportunity: store.fairOpportunity,
      packageDocumentsSigned:store.packageDocumentsSigned,
      evaluationPlan: store.evaluationPlan,
      // periods: store.periods,
      // periodOfPerformance: store.periodOfPerformance,
      sensitiveInformation: store.sensitiveInformation,
      allowDeveloperNavigation: store.allowDeveloperNavigation,
      contractingShopNonDitcoAddress: store.contractingShopNonDitcoAddress
    })
  );
};

const getStoreDataTableProperty = (
  storeProperty: string,
  store: AcquisitionPackageStore
): BaseTableDTO => {
  // get specific property
  const dataProperty = (store as unknown as Record<string, BaseTableDTO>)[
    storeProperty
  ];

  if (!dataProperty) {
    throw new Error(`unable to locate store property : ${storeProperty}`);
  }

  return dataProperty;
};


@Module({
  name: "AcquisitionPackage",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class AcquisitionPackageStore extends VuexModule {
  // NOTE: Make sure data vars that are typed are assigned a default value.
  // If left undefined, even when set with proper value, it will return undefined.
  // Also do not use `| undefined` e.g., `private foo: SelectData | undefined;` as
  // the undefined will be returned when getting the variable value.

  //has the store been initialized
  initialized = false;
  //keeps track of project title for global display
  projectTitle = "";
  acquisitionPackage: AcquisitionPackageDTO | null = null;
  projectOverview: ProjectOverviewDTO | null = null;
  organization: OrganizationDTO | null = null;
  contactInfo: ContactDTO | null = null;
  financialPocInfo: ContactDTO | null = null;
  contractConsiderations: ContractConsiderationsDTO | null = null;
  corInfo: ContactDTO | null = null;
  acorInfo: ContactDTO | null = null;
  hasAlternativeContactRep: boolean | null = null;
  fairOpportunity: FairOpportunityDTO | null = null;
  marketResearchTechniques: MarketResearchTechniquesDTO[] | null = null;
  packageDocumentsSigned: PackageDocumentsSignedDTO | null = null;
  evaluationPlan: EvaluationPlanDTO | null = null;
  currentContract: CurrentContractDTO | null = null;
  sensitiveInformation: SensitiveInformationDTO | null = null;
  // periods: string | null = null;
  // periodOfPerformance: PeriodOfPerformanceDTO | null = null;
  contractType: ContractTypeDTO | null = null;
  fundingRequirement: FundingRequirementDTO | null = null;
  classificationLevel: ClassificationLevelDTO | null = null;
  totalBasePoPDuration = 0;
  taskOrderDetailsAlertClosed = false;
  docGenJobStatus = "";
  packageId = "";
  regions: RegionsDTO[] | null = null;
  isLoading = false;
  // Sole Source
  // monitoring user interactions re: 
  // 1 - generated text
  hasSoleSourceGeneratedTextBeenEdited = false;
  // 2 - has form been edited
  hasSoleSourceCauseFormBeenEdited = false;
  // 3 - has user entered original text
  isSoleSourceTextOriginal=false


  validateNow = false;
  allowDeveloperNavigation = false;
  generatedDocumentNames: string[] = [
    "DescriptionOfWork.docx",
    "IncrementalFundingPlan.docx",
    "RequirementsChecklist.docx",
    "IGCE.xlsx",
    "EvaluationPlan.docx",
  ]
  contractingShop = "";
  attachmentNames: string[] = []
  anticipatedUsersAndDataNeedsVisited = false
  disableContinue = false
  hideNavigation = false
  hideSideNavigation = false
  isNewPackage = false
  fundingRequestType: string | null =  null;

  currentUser: User = {};
  currentUserIsMissionOwner = false;
  currentUserIsContributor = false;

  isProdEnv: boolean | null = null;
  @Action({rawError: true})
  public async setIsProdEnv(): Promise<void> {
    await this.doSetIsProdEnv();
  }
  @Mutation
  public async doSetIsProdEnv(): Promise<void> {
    this.isProdEnv = window.location.hostname === "services.disa.mil"
      || window.location.hostname === "services-test.disa.mil";
  }
  
  emulateProdNav = false;
  @Action({rawError: true})
  public async setEmulateProdNav(bool: boolean): Promise<void> {
    await this.doToggleEmulateProdEnv(bool);
  }
  @Mutation
  public async doToggleEmulateProdEnv(bool: boolean): Promise<void> {
    this.emulateProdNav = bool;
  }

  packageCreator: User = {};
  contractingShopNonDitcoAddress: AddressDTO | null = null;
  @Mutation
  public doSetPackageCreator(user: User): void {
    this.packageCreator = user;
  }
  public get getPackageCreator(): User {
    return this.packageCreator;
  }

  packageMissionOwner: User = {};
  @Mutation
  public doSetPackageMissionOwner(user: User): void {
    this.packageMissionOwner = user;
  }
  public get getPackageMissionOwner(): User {
    return this.packageMissionOwner;
  }

  public get getPackageStatus(): string {
    return this.acquisitionPackage?.package_status as string;
  }

  /* ===============================================
  /* ===============================================
  /* CONTRIBUTOR DISPLAY/INVITE/REMOVE ETC LOGIC
  /* ===============================================
  /* =============================================== */

  public packageContributors: User[] = [];

  public get getPackageContributors(): User[] {
    return this.packageContributors;
  }

  @Action({rawError: true})
  public async setPackageContributors(contributorSysIds: string): Promise<void> {
    // can be used for single or multiple - send csv string for multiple
    const sysIds = contributorSysIds.split(",");
    sysIds.forEach(async sysId => {
      const contributor = await UserStore.getUserRecord(sysId);        
      if (contributor) {
        this.doAddPackageContributor(contributor);
      }
    });
  }

  @Mutation
  public doAddPackageContributor(user: User): void {
    this.packageContributors.push(user);
  }

  @Mutation
  public async removeContributorFromStore(sysId: string): Promise<void> {
    this.packageContributors = this.packageContributors.filter(obj => obj.sys_id !== sysId);
  }

  @Mutation
  public async sortPackageContributors(): Promise<void> {
    this.packageContributors = this.packageContributors.sort((a,b) => {
      return a.fullNameForSort && b.fullNameForSort 
        ? a.fullNameForSort > b.fullNameForSort ? 1: -1
        : -1;
    });
  }

  @Action({rawError: true}) 
  public async removeContributor(sysId: string): Promise<void> {
    const contributorSysIds = this.packageContributors.map(obj => obj.sys_id);
    const newContributorSysIds = contributorSysIds.filter(id => id !== sysId).join(",");
    await this.doRemoveContributor({sysId: sysId, sysIds: newContributorSysIds});
    await this.updateAcquisitionPackage();
  }

  @Mutation
  public async doRemoveContributor(data: { sysId: string, sysIds: string}): Promise<void> {
    this.packageContributors = this.packageContributors.filter(obj => obj.sys_id !== data.sysId);
    if (this.acquisitionPackage) {
      this.acquisitionPackage.contributors = data.sysIds;
    }
  }

  @Action({rawError: true})
  public async transferOwnership(newOwnerSysId: string): Promise<void> {
    const currentUserSysId = this.currentUser.sys_id;
    if (currentUserSysId && this.acquisitionPackage && this.acquisitionPackage.contributors) {
      this.doAddPackageContributor(this.packageMissionOwner);
      const newOwnerUser = this.packageContributors.find(obj => obj.sys_id === newOwnerSysId);
      if (newOwnerUser) {
        this.doSetPackageMissionOwner(newOwnerUser);
      }
      await this.removeContributorFromStore(newOwnerSysId);
      
      let contributors = this.acquisitionPackage.contributors.split(","); 
      contributors.push(currentUserSysId);
      // remove new mission owner from contributors list
      contributors = contributors.filter(id => id !== newOwnerSysId);
      const newContributorsList = contributors?.join(",");

      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        contributors: newContributorsList,
        mission_owners: newOwnerSysId,
      } as AcquisitionPackageDTO);

      await this.updateAcquisitionPackage();
    }
  }

  public showInviteContributorsModal = false;
  public get getShowInviteContributorsModal(): boolean {
    return this.showInviteContributorsModal;
  }
  @Action
  public setShowInviteContributorsModal(show: boolean): void {
    this.doSetShowInviteContributorsModal(show);
  }
  @Mutation
  public doSetShowInviteContributorsModal(show: boolean): void {
    this.showInviteContributorsModal = show;
  }

  @Action({rawError: true})
  public async inviteContributors(sysIds: string): Promise<void> {
    const currentContributors = this.acquisitionPackage?.contributors?.split(",");
    const newContributors = sysIds.split(",");
    // double-check new contributor sys_id not in current contributors
    const uniqueNewContributors = newContributors.filter(
      n => !currentContributors?.includes(n)
    );
    const allContributors = currentContributors
      ? [...currentContributors, uniqueNewContributors]
      : uniqueNewContributors;

    this.setAcquisitionPackage({
      ...this.acquisitionPackage,
      contributors: allContributors.join(",") as string,
    } as AcquisitionPackageDTO);

    await this.updateAcquisitionPackage();
    await this.setPackageContributors(uniqueNewContributors.join(","));
    await this.sortPackageContributors();
  }

  /* ===============================================
  /* ===============================================
  /* END CONTRIBUTOR DISPLAY/INVITE/REMOVE ETC LOGIC
  /* ===============================================
  /* =============================================== */


  @Action({rawError: true})
  public async setCurrentUser(): Promise<void> {
    const currentUser = await UserStore.getCurrentUser();
    await this.doSetCurrentUser(currentUser);

    const isOwner = this.acquisitionPackage?.mission_owners && this.currentUser.sys_id
      ? this.acquisitionPackage.mission_owners.includes(this.currentUser.sys_id)
      : false;
    await this.doSetCurrentUserIsOwner(isOwner);

    const isContributor = this.acquisitionPackage?.contributors && this.currentUser.sys_id
      ? this.acquisitionPackage.contributors.includes(this.currentUser.sys_id)
      : false;
    await this.doSetCurrentUserIsContributor(isContributor);
  }

  @Mutation
  public async doSetCurrentUser(currentUser: User): Promise<void> {
    this.currentUser = currentUser;
  }

  @Mutation async doSetCurrentUserIsOwner(val: boolean): Promise<void> {
    this.currentUserIsMissionOwner = val;
  }
  @Mutation async doSetCurrentUserIsContributor(val: boolean): Promise<void> {
    this.currentUserIsContributor = val;
  }

  public get getCurrentUserIsMissionOwner(): boolean {
    return this.currentUserIsMissionOwner;
  }

  public get getCurrentUserIsContributor(): boolean {
    return this.currentUserIsContributor;
  }

  public initContact: ContactDTO = initialContact()

  public getTitle(): string {
    return this.projectOverview?.title || "";
  }

  public get getValidateNow(): boolean {
    return this.validateNow;
  }

  public cancelLoadDest = "Home";
  @Mutation
  public doSetCancelLoadDest(val: string): void {
    this.cancelLoadDest = val;
  }
  public get getCancelLoadDest(): string {
    return this.cancelLoadDest || "Home";
  }

  public packagePercentLoaded = 0;
  public get getPackagePercentLoaded(): number {
    return this.packagePercentLoaded;
  }
  @Mutation
  public setPackagePercentLoaded(val: number): void {
    this.packagePercentLoaded = val;
  }

  public get getIsLoading(): boolean {
    return this.isLoading;
  }
  @Action({rawError: true})
  public setIsLoading(val: boolean): void {
    this.doSetIsLoading(val);
  }
  @Mutation
  public doSetIsLoading(val: boolean): void {
    this.isLoading = val;
  }

  @Action({rawError: false})
  public async setContractingShop(value: string): Promise<void> {
    this.doSetContractingShop(value);
  }

  @Mutation
  private doSetContractingShop(value: string): void {
    this.contractingShop = value;
    if(this.acquisitionPackage)
      this.acquisitionPackage.contracting_shop = value;
  }

  @Action({rawError: false})
  public async setAttachmentNames(value: string[]): Promise<void> {
    this.doSetAttachmentNames(value);
  }
  @Mutation
  private doSetAttachmentNames(value: string[]): void {
    this.attachmentNames = value;
  }

  @Action({rawError: false})
  public async setAnticipatedUsersAndDataNeedsVisited(value: boolean): Promise<void> {
    this.doSetAnticipatedUsersAndDataNeedsVisited(value);
  }
  @Mutation
  private doSetAnticipatedUsersAndDataNeedsVisited(value: boolean): void {
    this.anticipatedUsersAndDataNeedsVisited = value;
  }

  @Action({rawError: false})
  public async setHideNavigation(value: boolean): Promise<void> {
    this.doSetHideNavigation(value);
  }
  @Mutation
  private doSetHideNavigation(value: boolean): void {
    this.hideNavigation = value;
  }
  @Action({rawError: false})
  public async setHideSideNavigation(value: boolean): Promise<void> {
    this.doSetHideSideNavigation(value);
  }
  @Mutation
  private doSetHideSideNavigation(value: boolean): void {
    this.hideSideNavigation = value;
  }

  @Action({rawError: false})
  public async setIsNewPackage(value: boolean): Promise<void> {
    this.doSetIsNewPackage(value);
  }
  @Mutation
  private doSetIsNewPackage(value: boolean): void {
    this.isNewPackage = value;
  }
  @Action
  public async setValidateNow(value: boolean): Promise<void> {
    this.doSetValidateNow(value);
  }

  @Mutation
  public async doSetValidateNow(value: boolean): Promise<void>{
    this.validateNow = value;
  }

  @Action({rawError: false})
  public async setDisableContinue(value: boolean): Promise<void> {
    this.doSetDisableContinue(value);
  }

  @Mutation
  private doSetDisableContinue(value: boolean): void {
    this.disableContinue = value;
  }

  public get getAllowDeveloperNavigation(): boolean {
    return this.allowDeveloperNavigation;
  }
  @Mutation
  public setAllowDeveloperNavigation(value: boolean): void{
    this.allowDeveloperNavigation = value;
  }

  @Mutation
  public setBasePoPDuration(value: number): void {
    this.totalBasePoPDuration = value;
  }
  @Mutation
  public setTaskOrderDetailsAlertClosed(value: boolean): void {
    this.taskOrderDetailsAlertClosed = value;
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setHasAlternateCOR(value: boolean): void {
    this.hasAlternativeContactRep = value;
  }

  @Mutation
  public async setAcquisitionPackage(value: AcquisitionPackageDTO): Promise<void> {
    this.acquisitionPackage = value;
    saveSessionData(this);
  }
  @Action
  public async getAcquisitionPackage(): Promise<AcquisitionPackageDTO | null> {
    return this.acquisitionPackage;
  }

  public get getAcquisitionPackageData(): AcquisitionPackageDTO | null {
    return this.acquisitionPackage;
  }

  @Action
  public async getJamrrTemplateSysID(type: string): Promise<string>{
    let attachment: AttachmentDTO[] = [{
      file_name: "",
      table_sys_id: ""
    }];
    const name = (type === 'ja') 
      ? "JWCC J&A Template_Template.docx" 
      : "JWCC Market Research Report (Sole Source)_Template.docx";

    const getAttachmentSysIDQuery: AxiosRequestConfig = {
      params: {
        sysparm_fields: "sys_id",
        sysparm_query: "file_name=" + name + "^table_name=sys_ws_operation"
      }
    };
    attachment = await api.attachments.getQuery(getAttachmentSysIDQuery);
    return attachment.length 
      ? this.getDomain + "/sys_attachment.do?sys_id=" + attachment[0].sys_id || ""
      : "";    
  }

  @Action
  public getAcquisitionPackageSysId(): string {
    return this.acquisitionPackage?.sys_id || "";
  }

  @Mutation
  public setProjectOverview(value: ProjectOverviewDTO): void {
    this.projectOverview = value;
  }

  @Mutation
  public setOrganization(value: OrganizationDTO): void {
    this.organization = value;
  }

  @Mutation
  public getInitialFairOpportunity(): FairOpportunityDTO {
    return initialFairOpportunity();
  }
  @Mutation
  public getInitialPackageDocumentsSigned() {
    return this.packageDocumentsSigned;
  }

  @Mutation
  public setContact(saveData: { data: ContactDTO; type: string }): void {
    const isCor = saveData.type === "COR";
    const dataKey =
      saveData.type === "Primary Contact"
        ? "contactInfo"
        : saveData.type === "Financial POC"
          ? "financialPocInfo"
          : isCor
            ? "corInfo"
            : "acorInfo";
    this[dataKey] = saveData.data;
  }

  @Action({rawError: true})
  public async getContact(type: string): Promise<ContactDTO> {
    if(type === "COR")
      return this.corInfo as ContactDTO;
    else if(type === "ACOR")
      return this.acorInfo as ContactDTO;
    else if(type === "Financial POC")
      return this.financialPocInfo as ContactDTO;
    else
      return this.contactInfo as ContactDTO;
  }

  @Mutation
  public setCurrentContract(value: CurrentContractDTO): void {
    this.currentContract = this.currentContract
      ? Object.assign(this.currentContract, value)
      : value;
  }

  @Action
  public async clearCurrentContractInfo(): Promise<void> {
    const data = initialCurrentContract();
    data.current_contract_exists = "NO";
    this.setCurrentContract(data);
    this.saveData<CurrentContractDTO>({data,
      storeProperty: StoreProperties.CurrentContract});
  }

  @Mutation
  public setSensitiveInformation(value: SensitiveInformationDTO): void {
    this.sensitiveInformation = this.sensitiveInformation
      ? Object.assign(this.sensitiveInformation, value)
      : value;
  }
  @Mutation
  public setContractingShopNonDitcoAddress(value: AddressDTO): void {
    this.contractingShopNonDitcoAddress = this.contractingShopNonDitcoAddress
      ? Object.assign(this.contractingShopNonDitcoAddress, value)
      : value;
  }

  // @Mutation
  // public setPeriods(value: PeriodDTO[]): void {
  //   this.periods = value.map(period=> period.sys_id).join(',');
  // }

  @Mutation
  public setClassificationLevel(value: ClassificationLevelDTO): void {
    this.classificationLevel = this.classificationLevel
      ? Object.assign(this.classificationLevel, value)
      : value;
  }

  // @Mutation
  // public setPeriodOfPerformance(value: PeriodOfPerformanceDTO): void {
  //   this.periodOfPerformance = this.periodOfPerformance
  //     ? Object.assign(this.periodOfPerformance, value)
  //     : value;
  // }

  @Mutation
  public setContractType(value: ContractTypeDTO): void {
    this.contractType = this.contractType
      ? Object.assign(this.contractType, value)
      : value;
  }

  @Mutation
  public setContractConsiderations(value: ContractConsiderationsDTO): void {
    this.contractConsiderations = this.contractConsiderations 
      ? Object.assign(this.contractConsiderations, value) 
      : value;
  }
  @Action({ rawError: true })
  public async setRegions(): Promise<void> {
    const value:RegionsDTO[] = await api.regionsTable.all()
    this.doSetRegions(value);
  }
  @Mutation
  public doSetRegions(value: RegionsDTO[]): void {
    this.regions = value
  }

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }
  public get getProjectTitle(): string {
    return this.projectTitle;
  }

  @Action({rawError: true})
  public async setFairOpportunity(value: FairOpportunityDTO): Promise<void> {
    await this.doSetFairOpportunity(value);
    if (this.initialized) {
      if (this.fairOpportunity && this.fairOpportunity.sys_id) {
        await api.fairOpportunityTable.update(
          this.fairOpportunity.sys_id,
          this.fairOpportunity
        );
        await this.doSetFairOpportunity(value);
      } else if (this.fairOpportunity && !this.fairOpportunity.sys_id) {
        const savedObj = await api.fairOpportunityTable.create(this.fairOpportunity);
        if (savedObj.sys_id) {
          await this.doSetFairOpportunity(savedObj);
          await this.updateAcquisitionPackage();
        }
      }
    } else {
      const techniques: MarketResearchTechniquesDTO[] 
        = await api.marketResearchTechniquesTable.all();
      await this.doSetMarketResearchTechniques(techniques);
    }
  }
  @Mutation
  public async doSetFairOpportunity(value: FairOpportunityDTO): Promise<void> {
    this.fairOpportunity = this.fairOpportunity
      ? Object.assign(this.fairOpportunity, value)
      : value;
    if (value.sys_id && this.acquisitionPackage && !this.acquisitionPackage.fair_opportunity) {
      this.acquisitionPackage.fair_opportunity = value.sys_id as string;
    } 

    if (value.exception_to_fair_opportunity?.toLowerCase() === "no_none"){
      //if exists, delete appropriation of funds data
      await FinancialDetails.deleteAppropriationOfFunds();
    }
  }
  @Mutation
  public async doSetMarketResearchTechniques(
    techniques: MarketResearchTechniquesDTO[]
  ): Promise<void> {
    if (techniques && techniques.length) {
      this.marketResearchTechniques = techniques.sort((a,b) => a.sequence > b.sequence ? 1 : -1);
    }
  }

  @Mutation
  public setPackageDocumentsSigned(value: PackageDocumentsSignedDTO): void {
    const acquisition_package = typeof value.acquisition_package === "object"
      ? (value.acquisition_package as ReferenceColumn).value as string
      : value.acquisition_package as string;
    value.acquisition_package = acquisition_package

    this.packageDocumentsSigned = value;
  }

  public get exceptionToFairOpportunity(): string | undefined {
    return this.fairOpportunity?.exception_to_fair_opportunity;
  }

  @Mutation
  public setEvaluationPlan(value: EvaluationPlanDTO): void {
    if (this.evaluationPlan) {
      this.evaluationPlan = Object.assign(this.evaluationPlan, value);
    } else {
      this.evaluationPlan = value;
    }
  }

  public get getEvaluationPlan(): EvaluationPlanDTO {
    return this.evaluationPlan || initialEvaluationPlan();
  }

  public get getFairOpportunity(): FairOpportunityDTO | null {
    return this.fairOpportunity || null;
  }

  @Action({rawError: true})
  public async setHasSoleSourceGeneratedTextBeenEdited(edited: boolean):Promise<void>{
    this.doSetHasSoleSourceGeneratedTextBeenEdited(edited);
  }

  @Mutation
  public async doSetHasSoleSourceGeneratedTextBeenEdited(edited:boolean):Promise<void>{
    this.hasSoleSourceGeneratedTextBeenEdited = edited;
  }

  @Action({rawError: true})
  public async setHasSoleSourceCauseFormBeenEdited(edited: boolean):Promise<void>{
    this.doSetHasSoleSourceCauseFormBeenEdited(edited);
  }

  @Mutation
  public async doSetHasSoleSourceCauseFormBeenEdited(edited:boolean):Promise<void>{
    this.hasSoleSourceCauseFormBeenEdited = edited;
  }

  @Action({rawError: true})
  public async setIsSoleSourceTextOriginal(edited: boolean):Promise<void>{
    this.doSetIsSoleSourceTextOriginal(edited);
  }

  @Mutation
  public async doSetIsSoleSourceTextOriginal(edited:boolean):Promise<void>{
    this.isSoleSourceTextOriginal = edited;
  }
  
  @Action({rawError: true})
  public async getPackageDocumentsSigned(): Promise<PackageDocumentsSignedDTO | null>{
    return this.packageDocumentsSigned;
  }

  @Action
  public sampleAdditionalButtonActionInStore(actionArgs: string[]): void {
    console.log("in store: actionArgs", actionArgs);
  }
  @Action ({rawError: true})
  public async getDocGenStatus(packageId: string): Promise<string> {
    if(this.acquisitionPackage){
      this.acquisitionPackage.docgen_job_status = 
        await (await (api.acquisitionPackageTable.retrieve(packageId))).docgen_job_status;
    }
    return this.acquisitionPackage?.docgen_job_status || "";
  }

  @Action ({rawError: true})
  public async saveDocGenStatus(newDocGenStatus: string): Promise<void> {
    if(this.acquisitionPackage && AcquisitionPackage.packageId){
      this.acquisitionPackage.docgen_job_status = newDocGenStatus;
      await this.updateAcquisitionPackage();
    }
  }

  @Mutation
  private setDataFromSession(sessionData: SessionData) {
    this.acquisitionPackage = sessionData.acquisitionPackage;
    this.acorInfo = sessionData.acorInfo;
    this.contactInfo = sessionData.contactInfo;
    this.contractConsiderations = sessionData.contractConsiderations;
    this.corInfo = sessionData.corInfo;
    this.contractType = sessionData.contractType;
    this.currentContract = sessionData.currentContract;
    this.fairOpportunity = sessionData.fairOpportunity;
    this.packageDocumentsSigned = sessionData.packageDocumentsSigned;
    this.evaluationPlan = sessionData.evaluationPlan;
    this.organization = sessionData.organization;
    this.projectOverview = sessionData.projectOverview;
    this.sensitiveInformation = sessionData.sensitiveInformation;
    this.classificationLevel = sessionData.classificationLevel;
    this.allowDeveloperNavigation = sessionData.allowDeveloperNavigation;
    this.regions = sessionData.regions
    this.contractingShopNonDitcoAddress = sessionData.contractingShopNonDitcoAddress;
  }

  @Action({rawError: true})
  public async loadPackageFromId(packageId: string): Promise<void> {
    this.setIsLoading(true);
    this.setPackagePercentLoaded(0);
    Steps.clearAltBackButtonText();
    let acquisitionPackage = await api.acquisitionPackageTable.retrieve(packageId);
    if (acquisitionPackage) {
      acquisitionPackage = convertColumnReferencesToValues(acquisitionPackage)
      await ContactData.initialize();
      this.setPackagePercentLoaded(5);
      await OrganizationData.initialize();
      this.setPackagePercentLoaded(10);
      await DescriptionOfWork.initialize();
      this.setPackagePercentLoaded(15);
      await Attachments.initialize();
      this.setPackagePercentLoaded(20);
      await FinancialDetails.initialize();
      await this.setRegions();
      this.setPackagePercentLoaded(22);
      if (acquisitionPackage.sys_created_by) {
        const creator 
          = await UserStore.getUserRecord(acquisitionPackage.sys_created_by);
        this.doSetPackageCreator(creator);
        this.setPackagePercentLoaded(25);
      }
      if (acquisitionPackage.mission_owners) {
        // there should only be one mission owner, but the field in servicenow is a list,
        // to be on the safe side, split the csv string of sysIds, take the first
        const missionOwnerSysId = (acquisitionPackage.mission_owners.split(","))[0];
        const missionOwner = await UserStore.getUserRecord(missionOwnerSysId);      
        this.doSetPackageMissionOwner(missionOwner);  
        this.setPackagePercentLoaded(28);
      }

      const currentEnvironmentSysId = acquisitionPackage.current_environment as string;
      const projectOverviewSysId = acquisitionPackage.project_overview as string;
      const organizationSysId = acquisitionPackage.organization as string;
      const evalPlanSysId = acquisitionPackage.evaluation_plan as string;
      const popSysId = acquisitionPackage.period_of_performance as string;
      const fairOppSysId = acquisitionPackage.fair_opportunity as string;
      const currContractSysId = 
        acquisitionPackage.current_contract_and_recurring_information as string;
      const sensitiveInfoSysId = acquisitionPackage.sensitive_information as string;
      const contractTypeSysId =  acquisitionPackage.contract_type as string;
      const classificationLevelSysId = acquisitionPackage.classification_level as string;
      const contractConsiderationsSysId = acquisitionPackage.contract_considerations as string;
      const corSysId = acquisitionPackage.cor as string;
      const aCorSysId = acquisitionPackage.acor as string;
      const primaryContactSysId = acquisitionPackage.primary_contact as string;
      const ContractingShopNonDitcoAddressID =
          acquisitionPackage.contracting_shop_non_ditco_address as string;

      await this.setAcquisitionPackage({
        ...acquisitionPackage,
        project_overview: projectOverviewSysId,
        current_environment: currentEnvironmentSysId,
        organization: organizationSysId,
        period_of_performance: popSysId,
        fair_opportunity: fairOppSysId,
        current_contract_and_recurring_information: currContractSysId,
        sensitive_information: sensitiveInfoSysId,
        contract_type: contractTypeSysId,
        contract_considerations: contractConsiderationsSysId,
        evaluation_plan: evalPlanSysId,
        cor: corSysId,
        acor: aCorSysId,
        primary_contact: primaryContactSysId,
        contracting_shop_non_ditco_address: ContractingShopNonDitcoAddressID,
      });

      if (acquisitionPackage.contributors) {
        await this.setPackageContributors(acquisitionPackage.contributors);
      }

      await ClassificationRequirements.getAllClassificationLevels();
      this.setPackagePercentLoaded(32);

      // load selected call will take care of loading or setting an empty array
      await ClassificationRequirements
        .loadSelectedClassificationLevelsByAqId(this.acquisitionPackage?.sys_id as string);
      this.setPackagePercentLoaded(35);

      if(acquisitionPackage.contracting_shop)
        await this.setContractingShop(acquisitionPackage.contracting_shop);
      
      if(projectOverviewSysId) {
        const projectOverview = await api.projectOverviewTable.retrieve(
          projectOverviewSysId
        );
        if(projectOverview){
          this.setProjectOverview(projectOverview);
          this.setProjectTitle(projectOverview.title);
        }
      } else {
        this.setProjectOverview(
          initialProjectOverview()
        )
      }

      if(currentEnvironmentSysId){
        await CurrentEnvironment.loadCurrentEnvFromId(
          currentEnvironmentSysId
        );
      } else {
        await CurrentEnvironment.setCurrentEnvironment(
          await CurrentEnvironment.initializeCurrentEnvironment()
        );
      }
      this.setPackagePercentLoaded(40);

      // call below loads if available or initializes
      await IGCE.loadRequirementsCostEstimateDataByPackageId(
        this.acquisitionPackage?.sys_id as string
      );
      this.setPackagePercentLoaded(45);

      if(organizationSysId) {
        const organization: OrganizationDTO = await api.organizationTable.retrieve(
          organizationSysId
        );
        if(organization) {
          const orgData = convertColumnReferencesToValues(organization); 
          this.setOrganization(orgData);
          if (organization.agency) {
            await this.setSelectedAgencyById(organization.agency);
          }
        }

      } else {
        this.setOrganization(
          initialOrganization()
        );
      }

      if(evalPlanSysId){
        await EvaluationPlan.loadEvalPlanFromId(evalPlanSysId);
      } else {
        await EvaluationPlan.setEvaluationPlan(
          await EvaluationPlan.initialEvaluationPlan()
        );
      }
      this.setPackagePercentLoaded(50);

      if(popSysId){
        await Periods.loadPeriodOfPerformanceFromSysId(
          popSysId
        )
      } else {
        await Periods.setPeriodOfPerformance(
          await Periods.initialPeriodOfPerformance()
        )
      }
      this.setPackagePercentLoaded(55);
      if(fairOppSysId) {
        const fairOpportunity = await api.fairOpportunityTable.retrieve(
          fairOppSysId
        );
        if(fairOpportunity)
          this.setFairOpportunity(fairOpportunity);
      } else {
        this.setFairOpportunity(
          initialFairOpportunity()
        );
      }
      // EJY HERE

      this.setPackagePercentLoaded(60);

      if(currContractSysId) {
        const currentContract = await api.currentContractTable.retrieve(
          currContractSysId
        );
        if(currentContract){
          const contractData = convertColumnReferencesToValues(currentContract)
          this.setCurrentContract(contractData);
        }
      } else {
        this.setCurrentContract(
          initialCurrentContract()
        );
      }
      this.setPackagePercentLoaded(65);

      if(sensitiveInfoSysId){
        const sensitiveInformation = await api.sensitiveInformationTable.retrieve(
          sensitiveInfoSysId
        );
        if(sensitiveInformation)
          this.setSensitiveInformation(sensitiveInformation);
      } else {
        this.setSensitiveInformation(
          initialSensitiveInformation()
        );
      }
      if(ContractingShopNonDitcoAddressID){
        const contractingShopNonDitcoAddress = await api.addressTable.retrieve(
          ContractingShopNonDitcoAddressID
        );
        if(contractingShopNonDitcoAddress){
          this.setContractingShopNonDitcoAddress(contractingShopNonDitcoAddress);
        }
      }else{
        this.setContractingShopNonDitcoAddress(initialNonDitcoAddress())
      }
      this.setPackagePercentLoaded(70);

      if(contractTypeSysId){
        const contractType = await api.contractTypeTable.retrieve(
          contractTypeSysId
        );
        if(contractType)
          this.setContractType(contractType);
      } else {
        this.setContractType(
          initialContractType()
        )
      }
      this.setPackagePercentLoaded(75);

      if(classificationLevelSysId) {
        const classificationLevel = await api.classificationLevelTable.retrieve(
          classificationLevelSysId
        );
        if(classificationLevel)
          this.setClassificationLevel(classificationLevel);
      } else {
        this.setClassificationLevel(
          initialClassificationLevel()
        );
      }
      this.setPackagePercentLoaded(80);

      if(contractConsiderationsSysId) {
        const contractConsiderations = await api.contractConsiderationsTable.retrieve(
          contractConsiderationsSysId
        );
        if(contractConsiderations)
          this.setContractConsiderations(contractConsiderations);
      } else {
        this.setContractConsiderations(
          initialContractConsiderations()
        );
      }
      this.setPackagePercentLoaded(85);

      if(corSysId) {
        const corInfo = await api.contactsTable.retrieve(
          corSysId
        );
        if(corInfo){
          corInfo.sys_id = corSysId;
          this.setContact({ data: corInfo, type: "COR"});
        }
      }

      if(aCorSysId) {
        const acorInfo = await api.contactsTable.retrieve(
          aCorSysId
        );
        if(acorInfo){
          acorInfo.sys_id = aCorSysId;
          this.setContact({ data: acorInfo, type: "ACOR"});
          this.setHasAlternateCOR(true);
        }
      } else {
        this.setHasAlternateCOR(false);
      }

      if(primaryContactSysId){
        const primaryContact = await api.contactsTable.retrieve(
          primaryContactSysId
        );
        if(primaryContact){
          primaryContact.sys_id = primaryContactSysId
          this.setContact({
            data: primaryContact,
            type: "Primary Contact"
          });
        }
      }
      const query: AxiosRequestConfig = {
        params: {
          sysparm_query: "acquisition_package.sys_id=" + AcquisitionPackage.packageId
        }
      };
      const signedDocuments = await api.packageDocumentsSignedTable
        .getQuery(query);
      if(signedDocuments.length <= 0){
        const packageDocumentsSigned = await api.packageDocumentsSignedTable
          .create({acquisition_package:acquisitionPackage.sys_id})
        this.setPackageDocumentsSigned(packageDocumentsSigned)
      }else{
        this.setPackageDocumentsSigned(signedDocuments[0])
      }

      this.setPackagePercentLoaded(90);

      await FinancialDetails.loadFundingRequirement();

      this.setPackagePercentLoaded(92);

      await DescriptionOfWork.loadDOWfromAcquistionPackageId(packageId);
      this.setPackagePercentLoaded(94);
      await ClassificationRequirements.loadCdsSolutionByPackageId(packageId);
      this.setPackagePercentLoaded(96);
      await IGCE.loadTrainingEstimatesFromPackage(packageId);
      this.setPackagePercentLoaded(98);
      await this.setCurrentUser();
      await DescriptionOfWork.loadTravel();

      if (this.packageContributors.length) {
        this.sortPackageContributors();
      }
  
      this.setPackagePercentLoaded(100);

      this.setInitialized(true);
      this.setIsLoading(false);

    } else {
      await this.initialize();
    }
  }

  // @Mutation
  // private setPeriodsFromString(value: string): void {
  //   this.periods = value;
  // }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {

    if (this.initialized) {
      return;
    }
    this.setIsLoading(true);
    this.setPackagePercentLoaded(0);
    Steps.clearAltBackButtonText();

    await ContactData.initialize();
    this.setPackagePercentLoaded(5);
    await OrganizationData.initialize();
    this.setPackagePercentLoaded(10);
    this.setPackagePercentLoaded(15);
    await Attachments.initialize();
    this.setPackagePercentLoaded(20);
    await FinancialDetails.initialize();
    this.setPackagePercentLoaded(25);

    await this.setRegions()
    const storedSessionData = sessionStorage.getItem(
      ATAT_ACQUISTION_PACKAGE_KEY
    ) as string;
    const loggedInUser = await UserStore.getCurrentUser();

    if (loggedInUser && loggedInUser.sys_id) {
      const creator = await UserStore.getUserRecord(loggedInUser.sys_id);      
      this.doSetPackageCreator(creator);
      this.doSetPackageMissionOwner(creator);
    }

    if (storedSessionData && storedSessionData.length > 0) {
      const parsedData = JSON.parse(storedSessionData) as SessionData;
      this.setDataFromSession(parsedData);
      this.setInitialized(true);
    } else {
      try {
        const acquisitionPackage = await api.acquisitionPackageTable.create();
        if (acquisitionPackage) {
          this.setPackagePercentLoaded(30);

          await this.setPackageId(acquisitionPackage.sys_id as string);
          this.setProjectOverview(initialProjectOverview());
          this.setOrganization(initialOrganization());
          this.setContractType(initialContractType());
          this.setContact({ data: initialContact(), type: "COR" });
          this.setContact({ data: initialContact(), type: "ACOR" });
          this.setContact({ data: initialContact(), type: "Financial POC" })
          this.setCurrentContract(initialCurrentContract());
          this.setContractConsiderations(initialContractConsiderations());
          this.setFairOpportunity(initialFairOpportunity());
          const evaluationPlanDTO = await EvaluationPlan.getEvaluationPlan();
          if(evaluationPlanDTO){
            this.setEvaluationPlan(evaluationPlanDTO);
            acquisitionPackage.evaluation_plan = evaluationPlanDTO.sys_id as string;
          }
          this.setPackagePercentLoaded(50);
          this.setContractingShopNonDitcoAddress(initialNonDitcoAddress())
          // this.setPeriods([]);
          // this.setPeriodOfPerformance(initialPeriodOfPerformance());
          this.setSensitiveInformation(initialSensitiveInformation());
          // sys_id from current environment will need to be saved to acquisition package
          const currentEnvironmentDTO = await CurrentEnvironment.initializeCurrentEnvironment();
          this.setPackagePercentLoaded(60);

          acquisitionPackage.current_environment = currentEnvironmentDTO.sys_id as string;
          await IGCE.initializeRequirementsCostEstimate(acquisitionPackage.sys_id || "");
          this.setPackagePercentLoaded(70);
          const periodOfPerformanceDTO = await Periods.initialPeriodOfPerformance();
          this.setPackagePercentLoaded(80);
          acquisitionPackage.period_of_performance = periodOfPerformanceDTO.sys_id as string;
          acquisitionPackage.mission_owners = loggedInUser.sys_id as string;          
          this.setPackagePercentLoaded(90);

          this.setAcquisitionPackage(acquisitionPackage);
          this.setPackagePercentLoaded(93);

          saveAcquisitionPackage(acquisitionPackage);
          const packageDocumentsSigned = await api.packageDocumentsSignedTable
            .create({acquisition_package:acquisitionPackage.sys_id})
          this.setPackageDocumentsSigned(packageDocumentsSigned)
          this.setPackagePercentLoaded(96);
          await this.setCurrentUser();
          this.setPackagePercentLoaded(100);

          this.setInitialized(true);
        }
      } catch (error) {
        console.log(`error creating acquisition package ${error}`);
      }
    }
    await DescriptionOfWork.initialize();
    this.setPackagePercentLoaded(95);
    await Periods.initialize();
    this.setPackagePercentLoaded(100);
    this.setIsLoading(false);
  }

  // service or agency selected on Organiation page
  selectedAgency: SelectData = { text: "", value: "" };
  selectedAgencyAcronym = "";

  public get getSelectedAgencyAcronym(): string {
    return this.selectedAgencyAcronym;
  }

  @Action({rawError: true})
  public async setSelectedAgencyById(sysId: string): Promise<void> {
    const agencyData = OrganizationData.agencyData.find(obj => obj.sys_id === sysId);
    if (agencyData) {
      const agencySelectData: SelectData = {
        text: agencyData.label,
        value: agencyData.sys_id as string,
      }    
      this.doSetSelectedAgency(agencySelectData);
      this.doSetSelectedAgencyAcronym(agencyData.acronym);
    }
  }

  @Mutation
  public doSetSelectedAgencyAcronym(str: string): void {
    this.selectedAgencyAcronym = str;
  }
  
  public getSelectedAgency(): SelectData {
    return this.selectedAgency;
  }

  @Action({ rawError: true })
  public async setSelectedAgency(agencySelectData: SelectData): Promise<void> {
    this.doSetSelectedAgency(agencySelectData);
    const agencyData = OrganizationData.agencyData.find(
      obj => obj.sys_id === agencySelectData.value
    );
    if (agencyData) this.doSetSelectedAgencyAcronym(agencyData.acronym);   
  }

  @Mutation
  public doSetSelectedAgency(value: SelectData): void {
    this.selectedAgency = value;
  }

  // military branch selected on Contact Info page
  public selectedContactBranch: SelectData = { text: "", value: "" };

  @Action({ rawError: true })
  public setSelectedContactBranch(value: SelectData): void {
    this.doSetSelectedContactBranch(value);
  }

  @Mutation
  public doSetSelectedContactBranch(value: SelectData): void {
    this.selectedContactBranch = value;
  }

  //mapping of store properties to api endpoints 
  private apiEndpointMap: Record<string, TableApiBase<BaseTableDTO>> = {
    [StoreProperties.ContractType]: api.contractTypeTable,
    [StoreProperties.CurrentContract]: api.currentContractTable,
    [StoreProperties.FairOpportunity]: api.fairOpportunityTable,
    [StoreProperties.MarketResearchTechniques]: api.marketResearchTechniquesTable,
    [StoreProperties.Organization]: api.organizationTable,
    // [StoreProperties.Periods]: api.periodTable,
    [StoreProperties.ProjectOverview]: api.projectOverviewTable,
    // [StoreProperties.PeriodOfPerformance]: api.periodOfPerformanceTable,
    [StoreProperties.SensitiveInformation]: api.sensitiveInformationTable,
    [StoreProperties.CurrentEnvironment]: api.currentEnvironmentTable,
    [StoreProperties.ClassificationLevel]: api.classificationLevelTable,
    [StoreProperties.ContractConsiderations]: api.contractConsiderationsTable,
    [StoreProperties.Regions]:api.regionsTable,
    [StoreProperties.PackageDocumentsSigned]:api.packageDocumentsSignedTable,
    [StoreProperties.ContractingShopNonDitcoAddress]:api.addressTable,
  }

  //mapping store propertties name to acquisition package properties
  private acquisitionPackagePropertyMap: Record<string, string> = {
    [StoreProperties.ContractType]: "contract_type",
    [StoreProperties.CurrentContract]: "current_contract_and_recurring_information",
    [StoreProperties.FairOpportunity]: "fair_opportunity",
    [StoreProperties.EvaluationPlan]: "evaluation_plan",
    [StoreProperties.Organization]:  "organization",
    [StoreProperties.ProjectOverview]: "project_overview",
    // [StoreProperties.PeriodOfPerformance]: "period_of_performance",
    // [StoreProperties.Periods]: "periods",
    [StoreProperties.SensitiveInformation]: "sensitive_information",
    [StoreProperties.ClassificationLevel]: "classification_level",
    [StoreProperties.CurrentEnvironment]: "current_environment",
    [StoreProperties.ContractConsiderations]: "contract_considerations",
    [StoreProperties.Regions]: "regions",
    [StoreProperties.PackageDocumentsSigned]: "package_documents_signed",
    [StoreProperties.ContractingShopNonDitcoAddress]: "contracting_shop_non_ditco_address",

  }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  

  @Action({ rawError: true })
  async loadContactInfo(contactType: string): Promise<ContactDTO> {
    try {
      await this.ensureInitialized();
      const isCor = contactType === "COR";

      let acqPkgKey = "";
      // let dataKey = "";

      switch(contactType) {
      case "Primary Contact":
        acqPkgKey = "contactInfo";
        break;
      case "FinancialPocInfo": 
        acqPkgKey = "financialPocInfo";
        break;
      case "COR": 
        acqPkgKey = "corInfo";
        break;
      case "ACOR": 
        acqPkgKey = "acorInfo";
        break;
      }

      const dataKey =
        contactType === "Primary Contact"
          ? "contactInfo"
          : contactType === "Financial POC"
            ? "financialPocInfo"
            : isCor
              ? "corInfo"
              : "acorInfo";

      const sys_id = this[dataKey]?.sys_id || "";
      if (sys_id.length > 0) {
        if (dataKey === "acorInfo") {
          this.setHasAlternateCOR(true);
        }
        const contactInfo = await api.contactsTable.retrieve(sys_id as string);
        this.setContact({ data: contactInfo, type: contactType });
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          [acqPkgKey]: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this[dataKey] as ContactDTO;
    } catch (error) {
      throw new Error(`error occurred loading contact info ${error}`);
    }
  }

  @Action({ rawError: true })
  /**
   * Saves Organization data to backend
   */
  async saveContactInfo(saveData: {
    data: ContactDTO;
    type: string;
  }): Promise<void> {
    try {
      const isCor = saveData.type === "COR";
      const dataKey =
        saveData.type === "Primary Contact"
          ? "contactInfo"
          : saveData.type === "Financial POC"
            ? "financialPocInfo"
            : isCor
              ? "corInfo"
              : "acorInfo";

      const sys_id = this[dataKey]?.sys_id || "";
      const savedContact =
        sys_id.length > 0
          ? await api.contactsTable.update(sys_id, { ...saveData.data, sys_id })
          : await api.contactsTable.create(saveData.data);
      this.setContact({ data: savedContact, type: saveData.type });

      if(dataKey === "corInfo"){
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          cor: savedContact.sys_id as string,
        } as AcquisitionPackageDTO);
      } else if(dataKey === "acorInfo"){
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          acor: savedContact.sys_id as string,
        } as AcquisitionPackageDTO);
        this.setHasAlternateCOR(true);
      } else if (dataKey === "financialPocInfo") {
        const fundingReq = await FinancialDetails.getFundingRequirement();
        if (fundingReq.sys_id) {
          await api.fundingRequirementTable.update(
            fundingReq.sys_id,
            {...fundingReq, financial_poc: savedContact.sys_id as string})
        }
      } else {
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          primary_contact: savedContact.sys_id as string,
        } as AcquisitionPackageDTO);
      }
      await this.updateAcquisitionPackage();
    } catch (error) {
      throw new Error(`error occurred saving contact info ${error}`);
    }
  }

  /**
   * Helper to retrieve api end point from map
   * @param apiKey string
   * @returns 
   */
  @Action({rawError: true})
  getApiEndPoint(apiKey: string): TableApiBase<BaseTableDTO> {
    const endPoint = this.apiEndpointMap[`${apiKey}`];
    if(endPoint === undefined){
      throw new Error(`unable to find api endpoint with key ${apiKey}`);
    }
    return endPoint;
  }

  @Mutation
  async setStoreData<TableDTO>({
    data,
    storeProperty,
  }: {
    data: TableDTO;
    storeProperty: string;
  }): Promise<void> {
    const storeAsTableRecord = this as unknown as Record<string, TableDTO>;
    storeAsTableRecord[storeProperty] = data;
  }


  /**
   * Loads data for a given store value
   * @param {storePropery}: string
   * @returns TableData
   */
  @Action({ rawError: true })
  async loadData<TableDTO>({ storeProperty }: {
    storeProperty: string;
  }): Promise<TableDTO> {
    try {
      await this.ensureInitialized();
      // retrives Store TableDTO based property using property name as key
      const storeDataProperty = getStoreDataTableProperty(storeProperty, this);
      const sysId = storeDataProperty.sys_id || "";
      if (sysId.length > 0) {
        // retrieves endpoint mapped to store property
        const apiEndPoint = await this.getApiEndPoint(storeProperty);
        const loadAction: Promise<TableDTO> | undefined = 
          apiEndPoint.retrieve(sysId) as Promise<TableDTO>;
        const retrievedData = await loadAction;
        this.setStoreData({ data: retrievedData, storeProperty });
        const acquisitionPackageProp = this.acquisitionPackagePropertyMap[storeProperty];
        if(acquisitionPackageProp === undefined)
        {
          throw new Error("unable to locate acquisition package property");
        }
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          [acquisitionPackageProp]: (retrievedData as BaseTableDTO).sys_id,
        } as AcquisitionPackageDTO);
        return retrievedData;
      }
      return storeDataProperty as TableDTO;
    } catch (error) {
      throw new Error(`error occurred loading data for ${storeProperty} ${error}`);
    }
  }


  @Action({ rawError: true })
  /**
   * Saves data for a given TableDTO/store property
   */
  async saveData<TableDTO extends BaseTableDTO>({
    data,
    storeProperty,
  }: {
    data: TableDTO;
    storeProperty: string;
  }): Promise<void> {
    try {
      const storeDataProperty = getStoreDataTableProperty(storeProperty, this);
      const apiEndPoint = await this.getApiEndPoint(storeProperty);
      const saveAction = (storeDataProperty.sys_id && storeDataProperty.sys_id.length > 0) ? 
        apiEndPoint.update(storeDataProperty.sys_id || "", data) :
        apiEndPoint.create(data);
      const savedData = await saveAction;
      // updates the store state data
      await this.setStoreData({data: savedData, storeProperty});
      const acquisitionPackageProp = this.acquisitionPackagePropertyMap[storeProperty];
      if(acquisitionPackageProp === undefined)
      {
        throw new Error("unable to locate acquisition package property");
      }
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        [acquisitionPackageProp]: (savedData as BaseTableDTO).sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving store data ${storeProperty}`);
    } finally {
      await this.updateAcquisitionPackage();
    }
  }

  @Action({rawError: true})
  public async updateAcquisitionPackage(): Promise<void>{
    if(this.acquisitionPackage && this.acquisitionPackage.sys_id){
      await api.acquisitionPackageTable.update(
        this.packageId,
        this.acquisitionPackage
      );
    }
  }

  /**
   * Loads Sensitive Information (FOIA) data from backend
   */
  @Action({ rawError: true })
  async loadSensitiveInformation(): Promise<SensitiveInformationDTO> {
    try {
      await this.ensureInitialized();

      const sys_id = this.sensitiveInformation?.sys_id || "";

      if (sys_id.length > 0) {
        const sensitiveInformationData =
          await api.sensitiveInformationTable.retrieve(sys_id as string);
        this.setSensitiveInformation(sensitiveInformationData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          sensitive_information: {value: sys_id},
        } as AcquisitionPackageDTO);
      }
      return this.sensitiveInformation as SensitiveInformationDTO;
    } catch (error) {
      throw new Error(`error occurred loading sensitive info data ${error}`);
    }
  }

  /**
   * Saves Sensitive Information (FOIA) data to backend
   */
  @Action({ rawError: true })
  async saveSensitiveInformation(data: SensitiveInformationDTO): Promise<void> {
    try {
      const sys_id = this.sensitiveInformation?.sys_id || "";
      const savedSensitiveInformation =
        sys_id.length > 0
          ? await api.sensitiveInformationTable.update(sys_id, {
            ...data,
            sys_id,
          })
          : await api.sensitiveInformationTable.create(data);
      this.setSensitiveInformation(savedSensitiveInformation);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        sensitive_information: sys_id
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving sensitive info data ${error}`);
    }
  }

  @Action({ rawError: true })
  async removeAttachment({
    key,
    attachmentId,
    recordId,
  }: {
    key: string;
    attachmentId: string;
    recordId: string;
  }): Promise<void> {
    const storeData = this as unknown as Record<string, unknown>;

    try {
      // attachment table data is stored as a comma separated
      // string list on the acquisition package object and in the store
      const tableIdList = storeData[key] as string;
      const tableIds = tableIdList.length ? tableIdList.split(",") : [];

      // convert first letter of key to uppercase because the file attachment
      // service factory expects keys in CamelCased upper case starting letters
      const convertedKey = key[0].toUpperCase() + key.substring(1);
      // locate attachment service
      const attachmentService = AttachmentServiceFactory(convertedKey);

      // remove attachment
      await attachmentService.remove({
        sys_id: attachmentId,
        table_sys_id: recordId,
      } as AttachmentDTO);

      //remove attachment record from
      const recordIndex = tableIds.findIndex((record) => record === recordId);
      if (recordIndex > -1) {
        tableIds.splice(recordIndex, 1);
        //update store data
        const data = tableIds.join(",");
        this.updatePackageData({ key, data });
      }
    } catch (error) {
      console.error(
        `error ocurred removing attachment data for ${key} error: ${error}`
      );
    }
  }

  @Action({ rawError: true })
  async updatePackageData<TData>({
    key, data}: { key: string; data: TData;}): Promise<void> {
    this.setStoreData({data: data, storeProperty: key});
    this.setAcquisitionPackage({
      ...this.acquisitionPackage,
      [key]: data,
    } as AcquisitionPackageDTO);
  }

  @Action({rawError: true})
  async getPackageData<TDataType>({property}: {property: string}): Promise<TDataType>{
    await this.ensureInitialized();
    const packageData = (this.acquisitionPackage as unknown) as Record<string, unknown>;
    return packageData[property] as TDataType;
  }

  @Action({rawError: true})
  async saveCollection<TData extends BaseTableDTO>({collection, property}:
    {collection: TData[], property: string}): Promise<void> {
    this.updatePackageData({key: property, data: collection.map(item=>item.sys_id).join(",")});
  }

  @Action({rawError: true})
  public async setPackageId(value: string): Promise<void> {
    this.doSetPackageId(value);
  }

  /**
   * @param isDocumentTypeSigned 
   * @returns link to download unsigned or signed documents 
   */
  @Action({rawError: true})
  public async setDownloadPackageLink(isDocumentTypeSigned: boolean): Promise<string> {
    const getdocumentsSysIDQuery: AxiosRequestConfig = {
      params: {
        sysparm_fields: "sys_id",
        sysparm_query: "acquisition_package=" + this.packageId
      }
    };
    const sysID = (isDocumentTypeSigned
      ? await api.packageDocumentsSignedTable.getQuery(getdocumentsSysIDQuery)
      : await api.packageDocumentsUnsignedTable.getQuery(getdocumentsSysIDQuery))[0]?.sys_id || "";
    return this.getDomain + '/download_all_attachments.do?sysparm_sys_id=' + sysID;
  }

  @Action({rawError: true})
  public async removeACORInformation(): Promise<void>{
    try{
      await api.contactsTable.remove(this.acorInfo?.sys_id as string)
      this.setContact({ data: initialContact(), type: "ACOR" });
    } catch (error){
      throw new Error(`error removing Alternate Contracting Officers data ${error}`);
    }
    
  }

  public get getDomain(): string {
    // return document.location.origin.indexOf("localhost") > -1
    //   ? 'https://services-dev.disa.mil'
    //   : document.location.origin

    return document.location.origin
  }

  @Action({rawError: true})
  public async getDocuments(isSigned:boolean): Promise<uploadingFile[]> {
    const query: AxiosRequestConfig = {
      params: {
        sysparm_query: "acquisition_package.sys_id=" + this.packageId
      }
    };
    const sysId = (isSigned 
      ? await api.packageDocumentsSignedTable.getQuery(query)
      : await api.packageDocumentsUnsignedTable.getQuery(query))[0].sys_id;

    if(sysId !== ""){
      try {
        const attachments = await Attachments.getAttachmentsByTableSysIds({
          serviceKey: isSigned ? PACKAGE_DOCUMENTS_SIGNED : PACKAGE_DOCUMENTS_UNSIGNED, 
          tableSysId: sysId || ""
        });
        const uploadedFiles = attachments.map((attachment: AttachmentDTO) => {
          const file = new File([], attachment.file_name, {
            lastModified: Date.parse(attachment.sys_created_on || "")
          });
          const upload: uploadingFile = {
            attachmentId: attachment.sys_id || "",
            fileName: attachment.file_name,
            file: file,
            created: file.lastModified,
            progressStatus: 100,
            link: attachment.download_link || "",
            recordId: attachment.table_sys_id,
            isErrored: false,
            isUploaded: true
          }
          return upload;
        });
        return [...uploadedFiles];
      } catch (error) {
        throw new Error("an error occurred loading Package " + 
          (isSigned ? 'Signed' : 'Unsigned') + " Documents data");
      }
    }
    return [];
  }


  @Action({rawError: true})
  public async getSignedDocumentsList(): Promise<signedDocument[]> {
    const fairOpportunity = 
     AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
    
    const incrementallyFunded =    
      FinancialDetails.fundingRequirement?.incrementally_funded || "";
    
    return [
      {
        itemName:"Requirements Checklist",
        requiresSignature:true,
        alertText:"Requires signatures",
        show:true
      },
      {
        itemName:"Independent Government Cost Estimate",
        requiresSignature:true,
        alertText:"Requires signatures",
        show:true
      },
      {
        itemName:"Incremental Funding Plan",
        requiresSignature:true,
        alertText:"Requires signatures",
        show:incrementallyFunded === "YES"
      },
      {
        itemName:"Justification and Approval",
        requiresSignature:true,
        alertText:"Complete and sign",
        show:["NO_NONE", ""].every(fo=>fo !== fairOpportunity)
      },
      {
        itemName:"Sole Source Market Research Report",
        requiresSignature:true,
        alertText:"Complete and sign",
        show:["NO_NONE", ""].every(fo=>fo !== fairOpportunity)
      },
      {
        itemName:"Description of Work",
        requiresSignature:false,
        show:true
      },
      {
        itemName:"Evaluation Plan",
        requiresSignature:false,
        show:fairOpportunity === "NO_NONE"
      }
    ] as signedDocument[]
  }

  @Action({rawError: true})
  public async getCompletedPackageList(): Promise<string[]> {
    const signedDocs = (await this.getSignedDocumentsList()).filter(
      signedDoc => signedDoc.show
    ).map(signedDoc => signedDoc.itemName.replace("(Template)", ""));

    const unsignedDocs = (await this.getDocuments(false)).filter(
      /**
       * removes duplicated names of generated docs from the docs retrieved
       * from package documents unsigned table
       * (eg. `DocumentOfWork.pdf` is already accounted for in this list in
       *       signedDocs list as `Document Of Work`)
      **/
      unsignedDoc => 
        this.generatedDocumentNames.every(docName => docName !== unsignedDoc.fileName)
    )
    const supportingDocuments = ['Supporting Documents (' + unsignedDocs.length + ')'];
    return signedDocs.concat(supportingDocuments)
  }

  @Mutation
  public doSetPackageId(value: string): void {
    this.packageId = value;
  }

  @Action({rawError: true})
  public async reset(): Promise<void>{
    await ContactData.reset();
    await OrganizationData.reset();
    await DescriptionOfWork.reset();
    await Attachments.reset();
    await FinancialDetails.reset();
    await CurrentEnvironment.reset();
    await IGCE.reset();
    await Periods.reset();
    await TaskOrder.reset();
    await ClassificationRequirements.reset();
    await EvaluationPlan.reset();
    Steps.clearAltBackButtonText();
    sessionStorage.removeItem(ATAT_ACQUISTION_PACKAGE_KEY);

    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.packagePercentLoaded = 0;
    this.projectTitle = "";
    this.acquisitionPackage = null;
    this.projectOverview = null;
    this.organization = null;
    this.contractConsiderations = null;
    this.contactInfo = null;
    this.corInfo = null;
    this.acorInfo = null;
    this.financialPocInfo = null;
    this.hasAlternativeContactRep = null;
    this.fairOpportunity = null;
    this.packageDocumentsSigned = null;
    this.evaluationPlan = null;
    this.currentContract = null;
    this.sensitiveInformation = null;
    // this.periods = null;
    // this.periodOfPerformance = null;
    this.contractType = null;
    this.classificationLevel = null;
    this.totalBasePoPDuration = 0;
    this.taskOrderDetailsAlertClosed = false;
    this.packageId = "";
    this.validateNow = false;
    this.allowDeveloperNavigation = false;
    this.fundingRequestType =  null;
    this.fundingRequirement = null;
    this.contractingShop = "";
    this.packageContributors = [];
    this.packageCreator = {};
    this.packageMissionOwner = {};
    this.selectedAgency = { text: "", value: "" };
    this.selectedAgencyAcronym = "";
    this.showInviteContributorsModal = false;
    this.contractingShopNonDitcoAddress = null;
  }
}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;
