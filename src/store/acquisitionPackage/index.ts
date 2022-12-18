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
import OrganiationData from "../organizationData";
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
  EvaluationPlanDTO,
  RequirementsCostEstimateDTO,
  OrganizationDTO,
  // PeriodDTO,
  // PeriodOfPerformanceDTO,
  ProjectOverviewDTO,
  SensitiveInformationDTO,
  ReferenceColumn, FundingRequirementDTO,
} from "@/api/models";

import { SelectData, EvalPlanSourceSelection, EvalPlanMethod } from "types/Global";
import { SessionData } from "./models";
import DescriptionOfWork from "@/store/descriptionOfWork"
import Attachments from "../attachments";
import TaskOrder from "../taskOrder";
import FinancialDetails from "../financialDetails";
import Periods from "../periods";
import { AttachmentServiceFactory } from "@/services/attachment";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import UserStore from "../user";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import ClassificationRequirements from "@/store/classificationRequirements";
import { AxiosRequestConfig } from "axios";
import IGCE, {defaultRequirementsCostEstimate} from "@/store/IGCE";

const ATAT_ACQUISTION_PACKAGE_KEY = "ATAT_ACQUISTION_PACKAGE_KEY";

export const StoreProperties = {
  CurrentContract: "currentContract",
  ContractType: "contractType",
  Periods: "periods",
  ProjectOverview: "projectOverview",
  Organization: "organization",
  FairOpportunity: "fairOpportunity",
  EvaluationPlan: "evaluationPlan",
  // PeriodOfPerformance: "periodOfPerformance",
  RequirementsCostEstimate:"requirementsCostEstimate",
  SensitiveInformation: "sensitiveInformation",
  ClassificationLevel: "ClassificationRequirements",
  CurrentEnvironment: "currentEnvironment",
  ContractConsiderations: "contractConsiderations",
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
  }
}

const initialProjectOverview = () => {
  return {
    sys_id: "",
    title: "",
    scope: "",
    emergency_declaration: "",
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

const initialContractType = ()=> {
  return {
    firm_fixed_price: "",
    time_and_materials: "",
    contract_type_justification: "",
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
      evaluationPlan: store.evaluationPlan,
      // periods: store.periods,
      // periodOfPerformance: store.periodOfPerformance,
      requirementsCostEstimate: store.requirementsCostEstimate,
      sensitiveInformation: store.sensitiveInformation,
      allowDeveloperNavigation: store.allowDeveloperNavigation
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
  evaluationPlan: EvaluationPlanDTO | null = null;
  currentContract: CurrentContractDTO | null = null;
  sensitiveInformation: SensitiveInformationDTO | null = null;
  // periods: string | null = null;
  // periodOfPerformance: PeriodOfPerformanceDTO | null = null;
  contractType: ContractTypeDTO | null = null;
  requirementsCostEstimate: RequirementsCostEstimateDTO | null = null;
  fundingRequirement: FundingRequirementDTO | null = null;
  classificationLevel: ClassificationLevelDTO | null = null;
  totalBasePoPDuration = 0;
  taskOrderDetailsAlertClosed = false;
  docGenJobStatus = "";
  packageId = "";

  validateNow = false;
  allowDeveloperNavigation = false;

  fundingRequestType: string | null =  null;

  public initContact: ContactDTO = initialContact()

  public getTitle(): string {
    return this.projectOverview?.title || "";
  }

  public get getValidateNow(): boolean {
    return this.validateNow;
  }

  @Action
  public async setValidateNow(value: boolean): Promise<void> {
    this.doSetValidateNow(value);
  }

  @Mutation
  public async doSetValidateNow(value: boolean): Promise<void>{
    this.validateNow = value;
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
  public setAcquisitionPackage(value: AcquisitionPackageDTO): void {
    this.acquisitionPackage = value;
    saveSessionData(this);
  }
  @Action
  public async getAcquisitionPackage(): Promise<AcquisitionPackageDTO | null> {
    return this.acquisitionPackage;
  }

  @Action
  public async getJamrrTemplateUrl(type: string): Promise<string>{
    let url = '';
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
    if(attachment){
      url = attachment[0].download_link as string;
    }
    return url;
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
  public getInitialFairOpportunity() {
    return initialFairOpportunity();
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

  @Mutation
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

  @Mutation
  public setFairOpportunity(value: FairOpportunityDTO): void {
    this.fairOpportunity = value;
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

  @Mutation
  public setRequirementsCostEstimate(value: RequirementsCostEstimateDTO): void {
    this.requirementsCostEstimate = this.requirementsCostEstimate
      ? Object.assign(this.requirementsCostEstimate, value)
      : value;
  }
  @Action({rawError: true})
  public getRequirementsCostEstimate(): RequirementsCostEstimateDTO | null{
    return this.requirementsCostEstimate;
  }

  @Action({rawError: true})
  public async getFairOpportunity(): Promise<FairOpportunityDTO | null>{
    return this.fairOpportunity;
  }

  @Mutation
  public setFundingRequirement(value: FundingRequirementDTO): void {
    this.fundingRequirement = this.fundingRequirement
      ? Object.assign(this.fundingRequirement, value)
      : value;

    if (this.acquisitionPackage && !this.acquisitionPackage.funding_requirement) {
      this.acquisitionPackage.funding_requirement = value.sys_id || "";
    }
    
  }
  @Action({rawError: true})
  public getFundingRequirement(): FundingRequirementDTO | null{
    return this.fundingRequirement;
  }

  @Action
  public sampleAdditionalButtonActionInStore(actionArgs: string[]): void {
    console.log("in store: actionArgs", actionArgs);
  }
  @Action
  public async getDocGenStatus(packageId: string): Promise<string> {
    if(this.acquisitionPackage){
      this.acquisitionPackage.docgen_job_status = 
        await (await (api.acquisitionPackageTable.retrieve(packageId))).docgen_job_status;
    }
    return this.acquisitionPackage?.docgen_job_status || "";
  }

  @Action
  public async saveDocGenStatus(newDocGenStatus: string): Promise<void> {
    if(this.acquisitionPackage && this.acquisitionPackage.sys_id){
      this.acquisitionPackage.docgen_job_status = newDocGenStatus;
      await api.acquisitionPackageTable.update(
        this.acquisitionPackage.sys_id,
        this.acquisitionPackage
      );
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
    this.evaluationPlan = sessionData.evaluationPlan;
    this.organization = sessionData.organization;
    // this.periods = sessionData.periods;
    this.projectOverview = sessionData.projectOverview;
    // this.periodOfPerformance = sessionData.periodOfPerformance;
    this.requirementsCostEstimate = sessionData.requirementsCostEstimate;
    this.sensitiveInformation = sessionData.sensitiveInformation;
    this.classificationLevel = sessionData.classificationLevel;
    this.allowDeveloperNavigation = sessionData.allowDeveloperNavigation;
  }

  @Action({rawError: true})
  public async loadPackageFromId(packageId: string): Promise<void> {
    const acquisitionPackage = await api.acquisitionPackageTable.retrieve(packageId);
    if (acquisitionPackage) {

      await ContactData.initialize();
      await OrganiationData.initialize();
      await DescriptionOfWork.initialize();
      await Attachments.initialize();
      await FinancialDetails.initialize();


      const currentEnvironmentSysId = 
        typeof acquisitionPackage.current_environment === "object" ?
          (acquisitionPackage.current_environment as ReferenceColumn).value as string
          : acquisitionPackage.current_environment as string;

      const projectOverviewSysId = 
        typeof acquisitionPackage.project_overview === "object" ?
          (acquisitionPackage.project_overview as ReferenceColumn).value as string
          : acquisitionPackage.project_overview as string;

      const organizationSysId =
        typeof acquisitionPackage.organization === "object" ?
          (acquisitionPackage.organization as ReferenceColumn).value as string
          : acquisitionPackage.organization as string;

      const evalPlanSysId = 
        typeof acquisitionPackage.evaluation_plan === "object" ?
          (acquisitionPackage.evaluation_plan as ReferenceColumn).value as string
          : acquisitionPackage.evaluation_plan as string;

      const popSysId = 
        typeof acquisitionPackage.period_of_performance === "object" ?
          (acquisitionPackage.period_of_performance as ReferenceColumn).value as string
          : acquisitionPackage.period_of_performance as string;

      const fairOppSysId = 
        typeof acquisitionPackage.fair_opportunity === "object" ?
          (acquisitionPackage.fair_opportunity as ReferenceColumn).value as string
          : acquisitionPackage.fair_opportunity as string;

      const currContractSysId = 
        typeof acquisitionPackage.current_contract_and_recurring_information === "object" ?
          // eslint-disable-next-line max-len
          (acquisitionPackage.current_contract_and_recurring_information as ReferenceColumn).value as string
          : acquisitionPackage.current_contract_and_recurring_information as string;

      const sensitiveInfoSysId =
        typeof acquisitionPackage.sensitive_information === "object" ?
          (acquisitionPackage.sensitive_information as ReferenceColumn).value as string
          : acquisitionPackage.sensitive_information as string;

      const contractTypeSysId =
        typeof acquisitionPackage.contract_type === "object" ?
          (acquisitionPackage.contract_type as ReferenceColumn).value as string
          : acquisitionPackage.contract_type as string;

      const classificationLevelSysId =
        typeof acquisitionPackage.classification_level === "object" ?
          (acquisitionPackage.classification_level as ReferenceColumn).value as string
          : acquisitionPackage.classification_level as string;

      const contractConsiderationsSysId = 
        typeof acquisitionPackage.contract_considerations === "object" ?
          (acquisitionPackage.contract_considerations as ReferenceColumn).value as string
          : acquisitionPackage.contract_considerations as string;

      const reqCostEstimateSysId = 
        typeof acquisitionPackage.requirements_cost_estimate === "object" ?
          (acquisitionPackage.requirements_cost_estimate as ReferenceColumn).value as string
          : acquisitionPackage.requirements_cost_estimate as string;

      const corSysId = 
        typeof acquisitionPackage.cor === "object" ?
          (acquisitionPackage.cor as ReferenceColumn).value as string
          : acquisitionPackage.cor as string;

      const aCorSysId =
        typeof acquisitionPackage.acor === "object" ?
          (acquisitionPackage.acor as ReferenceColumn).value as string
          : acquisitionPackage.acor as string;

      const primaryContactSysId =
        typeof acquisitionPackage.primary_contact === "object" ?
          (acquisitionPackage.primary_contact as ReferenceColumn).value as string
          : acquisitionPackage.primary_contact as string;

      const fundingRequirementSysId =
        typeof acquisitionPackage.funding_requirement === "object" ?
          (acquisitionPackage.funding_requirement as ReferenceColumn).value as string
          : acquisitionPackage.funding_requirement as string;

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
        requirements_cost_estimate: reqCostEstimateSysId,
        evaluation_plan: evalPlanSysId,
        cor: corSysId,
        acor: aCorSysId,
        primary_contact: primaryContactSysId,
        funding_requirement: fundingRequirementSysId
      });

      await ClassificationRequirements.getAllClassificationLevels();
      // load selected call will take care of loading or setting an empty array
      await ClassificationRequirements
        .loadSelectedClassificationLevelsByAqId(this.acquisitionPackage?.sys_id as string);
      
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

      // call below loads if available or initializes
      await IGCE.loadRequirementsCostEstimateDataById(
        this.acquisitionPackage?.sys_id as string
      );

      if(organizationSysId) {
        const organization = await api.organizationTable.retrieve(
          organizationSysId
        );
        if(organization)
          this.setOrganization(organization);
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

      if(popSysId){
        await Periods.loadPeriodOfPerformanceFromSysId(
          popSysId
        )
      } else {
        await Periods.setPeriodOfPerformance(
          await Periods.initialPeriodOfPerformance()
        )
      }

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

      if(currContractSysId) {
        const currentContract = await api.currentContractTable.retrieve(
          currContractSysId
        );
        if(currentContract)
          this.setCurrentContract(currentContract);
      } else {
        this.setCurrentContract(
          initialCurrentContract()
        );
      }

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

      if(reqCostEstimateSysId) {
        const requirementsCostEstimate = await api.requirementsCostEstimateTable.retrieve(
          reqCostEstimateSysId
        );
        if(requirementsCostEstimate)
          this.setRequirementsCostEstimate(requirementsCostEstimate);
      } else {
        this.setRequirementsCostEstimate(
          defaultRequirementsCostEstimate()
        );
      }

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

      if(fundingRequirementSysId){
        const fundingRequirement = await api.fundingRequirementTable.retrieve(
          fundingRequirementSysId
        );
        if(fundingRequirement){
          this.setFundingRequirement(fundingRequirement);
          // load the financial Poc  of the funding requirement and store
          // the contact to the "financialPocInfo property
          const financialPocSysId =
            typeof fundingRequirement.financial_poc === "object" ?
              (fundingRequirement.financial_poc as ReferenceColumn).value as string
              : fundingRequirement.financial_poc as string;
          if(financialPocSysId) {
            const financialPocInfo = await api.contactsTable.retrieve(
              financialPocSysId
            );
            if(financialPocInfo){
              this.setContact({ data: financialPocInfo, type: "Financial POC"});
            }
          }
        }
      }

      await DescriptionOfWork.loadDOWfromAcquistionPackageId(packageId);
      await ClassificationRequirements.loadCdsSolutionByPackageId(packageId);

      this.setInitialized(true);

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

    await ContactData.initialize();
    await OrganiationData.initialize();
    await DescriptionOfWork.initialize();
    await Attachments.initialize();
    await FinancialDetails.initialize();

    const storedSessionData = sessionStorage.getItem(
      ATAT_ACQUISTION_PACKAGE_KEY
    ) as string;

    const loggedInUser = await UserStore.getCurrentUser();

    if (storedSessionData && storedSessionData.length > 0) {
      const parsedData = JSON.parse(storedSessionData) as SessionData;
      this.setDataFromSession(parsedData);
      this.setInitialized(true);
    } else {
      try {
        const acquisitionPackage = await api.acquisitionPackageTable.create();
        if (acquisitionPackage) {
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

          this.setRequirementsCostEstimate({
            acquisition_package: "",
            has_DOW_and_PoP: "",
            architectural_design_current_environment: {
              option: "",
              estimated_values: []
            },
            architectural_design_performance_requirements: {
              option: "",
              estimated_values: []
            },
            fee_specs: {
              is_charged: "",
              percentage: null
            },
            how_estimates_developed: {
              cost_estimate_description: "",
              previous_cost_estimate_comparison: {
                options: "",
                percentage: null
              },
              tools_used: "",
              other_tools_used: ""
            },
            optimize_replicate: {
              option: "",
              estimated_values: []
            },
            surge_requirements: {
              capabilities: "",
              capacity: null
            },
            training: [],
            travel: {
              option: "",
              estimated_values: []
            }
          });

          // this.setPeriods([]);
          // this.setPeriodOfPerformance(initialPeriodOfPerformance());
          this.setSensitiveInformation(initialSensitiveInformation());
          // sys_id from current environment will need to be saved to acquisition package
          const currentEnvironmentDTO = await CurrentEnvironment.initializeCurrentEnvironment();
          acquisitionPackage.current_environment = currentEnvironmentDTO.sys_id as string;
          await IGCE.initializeRequirementsCostEstimate();
          const requirementsCostEstimateDTO = await IGCE.getRequirementsCostEstimate();
          acquisitionPackage.requirements_cost_estimate =
            requirementsCostEstimateDTO.sys_id as string;
          const periodOfPerformanceDTO = await Periods.initialPeriodOfPerformance();
          acquisitionPackage.period_of_performance = periodOfPerformanceDTO.sys_id as string;
          acquisitionPackage.mission_owners = loggedInUser.sys_id as string;
          const taskOrderObj = await TaskOrder.initialize(acquisitionPackage.sys_id || "");

          acquisitionPackage.funding_requirement 
            = taskOrderObj.funding_requirement?.sys_id as string;

          this.setAcquisitionPackage(acquisitionPackage);
          saveAcquisitionPackage(acquisitionPackage);

          this.setInitialized(true);
        }
      } catch (error) {
        console.log(`error creating acquisition package ${error}`);
      }
    }
    await Periods.initialize();
  }

  // service or agency selected on Organiation page
  selectedAgency: SelectData = { text: "", value: "" };

  public getSelectedAgency(): SelectData {
    return this.selectedAgency;
  }

  @Action({ rawError: true })
  public setSelectedAgency(value: SelectData): void {
    this.doSetSelectedAgency(value);
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
    [StoreProperties.Organization]: api.organizationTable,
    // [StoreProperties.Periods]: api.periodTable,
    [StoreProperties.ProjectOverview]: api.projectOverviewTable,
    // [StoreProperties.PeriodOfPerformance]: api.periodOfPerformanceTable,
    [StoreProperties.RequirementsCostEstimate]: api.requirementsCostEstimateTable,
    [StoreProperties.SensitiveInformation]: api.sensitiveInformationTable,
    [StoreProperties.CurrentEnvironment]: api.currentEnvironmentTable,
    [StoreProperties.ClassificationLevel]: api.classificationLevelTable,
    [StoreProperties.ContractConsiderations]: api.contractConsiderationsTable,
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
    [StoreProperties.RequirementsCostEstimate]: "requirements_cost_estimate",
    [StoreProperties.SensitiveInformation]: "sensitive_information",
    [StoreProperties.ClassificationLevel]: "classification_level",
    [StoreProperties.CurrentEnvironment]: "current_environment",
    [StoreProperties.ContractConsiderations]: "contract_considerations",
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
        const fundingRequirement = TaskOrder.value.funding_requirement;
        if(fundingRequirement?.sys_id) {
          await api.fundingRequirementTable.update(
            fundingRequirement?.sys_id,
            {...fundingRequirement, financial_poc: savedContact.sys_id as string})
          if (this.acquisitionPackage && !this.acquisitionPackage.funding_requirement) {
            this.acquisitionPackage.funding_requirement = fundingRequirement.sys_id;
          }
        }
      } else {
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          primary_contact: savedContact.sys_id as string,
        } as AcquisitionPackageDTO);
      }
      await this.saveAcquisitionPackage();
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
      await this.saveAcquisitionPackage();
    }
  }

  @Action({rawError: true})
  public async saveAcquisitionPackage(): Promise<void>{
    if(this.acquisitionPackage && this.acquisitionPackage.sys_id){
      await api.acquisitionPackageTable.update(
        this.acquisitionPackage.sys_id,
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
        ...this.sensitiveInformation,
        sensitive_information: {value: sys_id}
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

  @Mutation
  public doSetPackageId(value: string): void {
    this.packageId = value;
  }

  @Action({rawError: true})
  public async reset(): Promise<void>{

    await ContactData.reset();
    await OrganiationData.reset();
    await DescriptionOfWork.reset();
    await Attachments.reset();
    await FinancialDetails.reset();
    await CurrentEnvironment.reset();
    await IGCE.reset();
    await Periods.reset();
    await TaskOrder.reset();
    await ClassificationRequirements.reset();
    await EvaluationPlan.reset();

    sessionStorage.removeItem(ATAT_ACQUISTION_PACKAGE_KEY);

    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
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
    this.evaluationPlan = null;
    this.currentContract = null;
    this.sensitiveInformation = null;
    // this.periods = null;
    // this.periodOfPerformance = null;
    this.contractType = null;
    this.requirementsCostEstimate = null;
    this.classificationLevel = null;
    this.totalBasePoPDuration = 0;
    this.taskOrderDetailsAlertClosed = false;
    this.packageId = "";
    this.validateNow = false;
    this.allowDeveloperNavigation = false;
    this.fundingRequestType =  null;
    this.fundingRequirement = null;
  }
}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;
