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
  GFEOverviewDTO,
  RequirementsCostEstimateDTO,
  OrganizationDTO,
  PeriodDTO,
  PeriodOfPerformanceDTO,
  ProjectOverviewDTO,
  SensitiveInformationDTO,
  CurrentEnvironmentDTO,
} from "@/api/models";

import { SelectData } from "types/Global";
import { SessionData } from "./models";
import DescriptionOfWork from "@/store/descriptionOfWork"
import Attachments from "../attachments";
import TaskOrder from "../taskOrder";
import FinancialDetails from "../financialDetails";
import { PeriodOfPerformanceApi } from "@/api/contractDetails";
import Periods from "../periods";
import { AttachmentService } from "@/services/attachment/base";
import { AttachmentServiceFactory } from "@/services/attachment";

const ATAT_ACQUISTION_PACKAGE_KEY = "ATAT_ACQUISTION_PACKAGE_KEY";

export const StoreProperties = {
  CurrentContract: "currentContract",
  ContractType: "contractType",
  Periods: "periods",
  ProjectOverview: "projectOverview",
  Organization: "organization",
  FairOpportunity: "fairOpportunity",
  GFEOverview:"gfeOverview",
  PeriodOfPerformance: "periodOfPerformance",
  RequirementsCostEstimate:"requirementsCostEstimate",
  SensitiveInformation: "sensitiveInformation",
  ClassificationLevel: "ClassificationRequirements",
  CurrentEnvironment: "currentEnvironment",
};


export const StatusTypes = {
  Upcoming: "Upcoming",
  OnTrack: "On_Track",
  Processing: "Processing",
  Active: "Active",
  AtRisk: "At-Risk",
  Delinquent: "Delinquent",
  Expired: "Expired",
  ExpiringSoon: "Expiring Soon",
  Archived: "Archived",
  Draft: "Draft",
  WaitingForSignatures: "Waiting For Signatures",
  TaskOrderAwarded: "Task Order Awarded",
  WaitingForTaskOrder: "Waiting For Task Order",

}

const initialCurrentContract = ()=> {
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

    packaging_shipping_other: "false",
    contractor_required_training: "",
    packaging_shipping_other_explanation: "",
    conflict_of_interest_explanation: "",
    potential_conflict_of_interest: "",
    required_training_courses: "",
    packaging_shipping_none_apply: "false",
    contractor_provided_transfer: "false",
  }
}

const initialFairOpportunity = () => {
  return {
    exception_to_fair_opportunity: "",
  };
};

const initialGFE = () => {
  return {
    dpas_unit_identification_code: "",
    gfe_gfp_furnished: "",
    dpas_custodian_number: "",
    property_accountable: "",
    property_custodian_name: "",
  };
};

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

const initialCurrentEnvironment = () => {
  return {
    current_environment_exists: "",
    environment_instances: "",
    additional_information: "",
  }
}

const saveSessionData = (store: AcquisitionPackageStore) => {
  sessionStorage.setItem(
    ATAT_ACQUISTION_PACKAGE_KEY,
    JSON.stringify({
      acquisitionPackage: store.acquisitionPackage,
      projectOverview: store.projectOverview,
      organization: store.organization,
      contactInfo: store.contactInfo,
      contractConsiderations: store.contractConsiderations,
      corInfo: store.corInfo,
      acorInfo: store.acorInfo,
      contractType: store.contractType,
      currentContract: store.currentContract,
      fairOpportunity: store.fairOpportunity,
      gfeOverview: store.gfeOverview,
      periods: store.periods,
      periodOfPerformance: store.periodOfPerformance,
      requirementsCostEstimate: store.requirementsCostEstimate,
      sensitiveInformation: store.sensitiveInformation,
      currentEnvironment: store.currentEnvironment,
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
  contractConsiderations: ContractConsiderationsDTO | null = null;
  corInfo: ContactDTO | null = null;
  acorInfo: ContactDTO | null = null;
  hasAlternativeContactRep: boolean | null = null;
  fairOpportunity: FairOpportunityDTO | null = null;
  currentContract: CurrentContractDTO | null = null;
  sensitiveInformation: SensitiveInformationDTO | null = null;
  periods: string | null = null;
  periodOfPerformance: PeriodOfPerformanceDTO | null = null;
  gfeOverview: GFEOverviewDTO | null = null;
  contractType: ContractTypeDTO | null = null;
  requirementsCostEstimate: RequirementsCostEstimateDTO | null = null;
  classificationLevel: ClassificationLevelDTO | null = null;
  currentEnvironment: CurrentEnvironmentDTO | null = null;
  totalBasePoPDuration = 0;
  taskOrderDetailsAlertClosed = false;

  fundingRequestType: string | null =  null;

  public initContact: ContactDTO = initialContact()

  public getTitle(): string {
    return this.projectOverview?.title || "";
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

  @Mutation
  public setProjectOverview(value: ProjectOverviewDTO): void {
    this.projectOverview = value;
  }

  @Mutation
  public setOrganization(value: OrganizationDTO): void {
    this.organization = value;
  }

  @Mutation
  public setContact(saveData: { data: ContactDTO; type: string }): void {
    const isCor = saveData.type === "COR";
    const dataKey =
      saveData.type === "Mission Owner"
        ? "contactInfo"
        : isCor
          ? "corInfo"
          : "acorInfo";

    this[dataKey] = saveData.data;
  }

  @Mutation
  public setCurrentContract(value: CurrentContractDTO): void {
    this.currentContract = this.currentContract
      ? Object.assign(this.currentContract, value)
      : value;
  }

  @Mutation
  public setSensitiveInformation(value: SensitiveInformationDTO): void {
    this.sensitiveInformation = this.sensitiveInformation
      ? Object.assign(this.sensitiveInformation, value)
      : value;
  }

  @Mutation
  public setPeriods(value: PeriodDTO[]): void {
    this.periods = value.map(period=> period.sys_id).join(',');
  }

  @Mutation
  public setClassificationLevel(value: ClassificationLevelDTO): void {
    this.classificationLevel = this.classificationLevel
      ? Object.assign(this.classificationLevel, value)
      : value;
  }

  @Mutation
  public setPeriodOfPerformance(value: PeriodOfPerformanceDTO): void {
    this.periodOfPerformance = this.periodOfPerformance
      ? Object.assign(this.periodOfPerformance, value)
      : value;
  }

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

  @Mutation
  public setGFEOverview(value: GFEOverviewDTO): void {
    this.gfeOverview = value;
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

  @Mutation
  public setCurrentEnvironment(value: CurrentEnvironmentDTO): void {
    this.currentEnvironment = this.currentEnvironment
      ? Object.assign(this.currentEnvironment, value)
      : value;
  }

  @Action
  public sampleAdditionalButtonActionInStore(actionArgs: string[]): void {
    console.log("in store: actionArgs", actionArgs);
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
    this.organization = sessionData.organization;
    this.periods = sessionData.periods;
    this.projectOverview = sessionData.projectOverview;
    this.periodOfPerformance = sessionData.periodOfPerformance;
    this.requirementsCostEstimate = sessionData.requirementsCostEstimate;
    this.sensitiveInformation = sessionData.sensitiveInformation;
    this.gfeOverview = sessionData.gfeOverview;
    this.classificationLevel = sessionData.classificationLevel;
    this.currentEnvironment = sessionData.currentEnvironment;
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    await ContactData.initialize();
    await OrganiationData.initialize();
    await DescriptionOfWork.initialize();
    await Attachments.initialize();
    await FinancialDetails.initialize();
    
    if (this.initialized) {
      return;
    }

    const storedSessionData = sessionStorage.getItem(
      ATAT_ACQUISTION_PACKAGE_KEY
    ) as string;

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
          this.setCurrentContract(initialCurrentContract());
          this.setContractConsiderations(initialContractConsiderations());
          this.setFairOpportunity(initialFairOpportunity());

          this.setRequirementsCostEstimate({ 
            estimatedTaskOrderValue: "",
            feePercentage: "",
            feeCharged: "" ,
            surge_capabilities: "",
            surge_capacity: ""
          });

          this.setGFEOverview(initialGFE());
          this.setPeriods([]);
          this.setPeriodOfPerformance(initialPeriodOfPerformance());
          this.setSensitiveInformation(initialSensitiveInformation());
          this.setCurrentEnvironment(initialCurrentEnvironment());
          this.setAcquisitionPackage(acquisitionPackage);
          await TaskOrder.initialize(acquisitionPackage.sys_id || "");
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
    [StoreProperties.GFEOverview]: api.gfeOverviewTable,
    [StoreProperties.Organization]: api.organizationTable,
    [StoreProperties.Periods]: api.periodTable,
    [StoreProperties.ProjectOverview]: api.projectOverviewTable,
    [StoreProperties.PeriodOfPerformance]: api.periodOfPerformanceTable,
    [StoreProperties.RequirementsCostEstimate]: api.requirementsCostEstimateTable,
    [StoreProperties.SensitiveInformation]: api.sensitiveInformationTable,
    [StoreProperties.CurrentEnvironment]: api.currentEnvironmentTable,
    [StoreProperties.ClassificationLevel]: api.classificationLevelTable,
  }

  //mapping store propertties name to acquisition package properties
  private acquisitionPackagePropertyMap: Record<string, string> = {
    [StoreProperties.ContractType]: "contract_type",
    [StoreProperties.CurrentContract]: "current_contract",
    [StoreProperties.FairOpportunity]: "fair_opportunity",
    [StoreProperties.GFEOverview]: "gfe_overview",
    [StoreProperties.Organization]:  "organization",
    [StoreProperties.ProjectOverview]: "project_overview",
    [StoreProperties.PeriodOfPerformance]: "period_of_performance",
    [StoreProperties.Periods]: "periods",
    [StoreProperties.RequirementsCostEstimate]: "requirements_cost_estimate",
    [StoreProperties.SensitiveInformation]: "sensitive_information",
    [StoreProperties.ClassificationLevel]: "classification_level",
    [StoreProperties.CurrentEnvironment]: "current_environment",
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
      const dataKey =
        contactType === "Mission Owner"
          ? "contactInfo"
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
          contact: sys_id,
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
        saveData.type === "Mission Owner"
          ? "contactInfo"
          : isCor
            ? "corInfo"
            : "acorInfo";

      const sys_id = this[dataKey]?.sys_id || "";
      const savedContact =
        sys_id.length > 0
          ? await api.contactsTable.update(sys_id, { ...saveData.data, sys_id })
          : await api.contactsTable.create(saveData.data);
      this.setContact({ data: savedContact, type: saveData.type });
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        contact: sys_id,
      } as AcquisitionPackageDTO);
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
  async saveData<TableDTO>({
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
      this.setStoreData({data: savedData, storeProperty});
      const acquisitionPackageProp = this.acquisitionPackagePropertyMap[storeProperty];
      if(acquisitionPackageProp === undefined)
      {
        throw new Error("unable to locate acquisition package property");
      }
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        [acquisitionPackageProp]: (data as BaseTableDTO).sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving store data ${storeProperty}`);
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
          sensitive_information: sys_id,
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
        sensitive_information: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving sensitive info data ${error}`);
    }
  }

  @Action({ rawError: true })
  async loadContractConsiderations(): Promise<ContractConsiderationsDTO> {
    try {
      await this.ensureInitialized();
      const sys_id = this.contractConsiderations?.sys_id || "";

      if (sys_id.length > 0) {
        const contractConsiderationsData =
          await api.contractConsiderationsTable.retrieve(sys_id as string);
        this.setContractConsiderations(contractConsiderationsData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          contract_considerations: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.contractConsiderations as ContractConsiderationsDTO;
    } catch (error) {
      throw new Error(`error occurred loading Contract Type data ${error}`);
    }
  }

  @Action({ rawError: true })
  async saveContractConsiderations(
    data: ContractConsiderationsDTO
  ): Promise<void> {
    try {
      const sys_id = this.contractConsiderations?.sys_id || "";
      const savedData =
        sys_id.length > 0
          ? await api.contractConsiderationsTable.update(sys_id, {
            ...data,
            sys_id,
          })
          : await api.contractConsiderationsTable.create({
            ...initialContractConsiderations(),
            ...data,
          });
      this.setContractConsiderations(savedData);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        contract_considerations: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(
        `error occurred saving Contract Considerations data ${error}`
      );
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
}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;
