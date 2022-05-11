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
import { TableApiBase } from "@/api/tableApiBase";
import {
  AcquisitionPackageDTO,
  BaseTableDTO,
  ContractConsiderationsDTO,
  RequirementsCostEstimateDTO,
} from "@/api/models";
import { SelectData } from "types/Global";
import { SessionData } from "./models";
import { ProjectOverviewDTO } from "@/api/models";
import { OrganizationDTO } from "@/api/models";
import { ContactDTO } from "@/api/models";
import { FairOpportunityDTO } from "@/api/models";
import { CurrentContractDTO } from "@/api/models";
import { SensitiveInformationDTO } from "@/api/models";
import { PeriodOfPerformanceDTO } from "@/api/models";
import { GFEOverviewDTO } from "@/api/models";
import { ContractTypeDTO } from "@/api/models";


const ATAT_ACQUISTION_PACKAGE_KEY = "ATAT_ACQUISTION_PACKAGE_KEY";

export const StoreProperties = {
  CurrentContract: "currentContract",
  ContractType: "contractType",
  ProjectOverview: "projectOverview",
  Organization: "organization",
  FairOpportunity: "fairOpportunity",
  GFEOverview:"gfeOverview",
  PeriodOfPerformance: "periodOfPerformance",
  RequirementsCostEstimate:"requirementsCostEstimate",
  SensitiveInformation: "sensitiveInformation",
};

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
    service_agency: "",
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
    contractor_required_training: "UNSELECTED",
    packaging_shipping_other_explanation: "",
    conflict_of_interest_explanation: "",
    potential_conflict_of_interest: "UNSELECTED",
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

const initialSensativeInformation = ()=> {

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
      periodOfPerformance: store.periodOfPerformance,
      requirementsCostEstimate: store.requirementsCostEstimate,
      sensativeInformation: store.sensitiveInformation,
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
  periodOfPerformance: PeriodOfPerformanceDTO | null = null;
  gfeOverview: GFEOverviewDTO | null = null;
  contractType: ContractTypeDTO | null = null;
  requirementsCostEstimate: RequirementsCostEstimateDTO | null = null;

  public initContact: ContactDTO = initialContact();

  public getTitle(): string {
    return this.projectOverview?.title || "";
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
    this.contractConsiderations = this.contractConsiderations ?
      Object.assign(this.contractConsiderations, value) : value;
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
    this.requirementsCostEstimate = value;
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
    this.projectOverview = sessionData.projectOverview;
    this.periodOfPerformance = sessionData.periodOfPerformance;
    this.requirementsCostEstimate = sessionData.requirementsCostEstimate;
    this.sensitiveInformation = sessionData.SensitiveInformation;
    this.gfeOverview = sessionData.gFEOverview;
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
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
          this.setAcquisitionPackage(acquisitionPackage);
          this.setFairOpportunity(initialFairOpportunity());
          this.setRequirementsCostEstimate({ surge_capabilities: "" });
          this.setGFEOverview(initialGFE());
          this.setPeriodOfPerformance(initialPeriodOfPerformance());
          this.setSensitiveInformation(initialSensativeInformation());
          //the should be in the initialization sequence
          this.setAcquisitionPackage(acquisitionPackage);
          this.setInitialized(true);
        }
      } catch (error) {
        console.log(`error creating acquisition package ${error}`);
      }
    }
  }

  // service or agency selected on Organiation page
  selectedServiceOrAgency: SelectData = { text: "", value: "" };

  public getSelectedServiceOrAgency(): SelectData {
    return this.selectedServiceOrAgency;
  }

  @Action({ rawError: true })
  public setSelectedServiceOrAgency(value: SelectData): void {
    this.doSetSelectedServiceOrAgency(value);
  }

  @Mutation
  public doSetSelectedServiceOrAgency(value: SelectData): void {
    this.selectedServiceOrAgency = value;
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

  // used on Contact Info and COR/ACOR pages
  public branchData: SelectData[] = [
    { text: "U.S. Air Force", value: "USAF" },
    { text: "U.S. Army", value: "ARMY" },
    { text: "U.S. Coast Guard", value: "USCG" },
    { text: "U.S. Marine Corps", value: "USMC" },
    { text: "U.S. Navy", value: "NAVY" },
    { text: "U.S. Space Force", value: "USSF" },
  ];

  public serviceOrAgencyData: SelectData[] = [
    {
      text: "Communications & Electronics Command",
      value: "COMMUNICATIONS_AND_ELECTRONICS_COMMAND",
    },
    {
      text: "Defense Advanced Research Project Agency (DARPA)",
      value: "DEFENSE_ADVANCED_RESEARCH_PROJECT_AGENCY",
    },
    {
      text: "Defense Commissary Agency",
      value: "DEFENSE_COMMISSARY_AGENCY",
    },
    {
      text: "Defense Contract Audit Agency (DCAA)",
      value: "DEFENSE_CONTRACT_AUDIT_AGENCY",
    },
    {
      text: "Defense Contract Management Agency (DCMA)",
      value: "DEFENSE_CONTRACT_MANAGEMENT_AGENCY",
    },
    {
      text: "Defense Counterintelligence and Security Agency",
      value: "DEFENSE_COUNTERINTELLIGENCE_AND_SECURITY_AGENCY",
    },
    {
      text: "Defense Criminal Investigation Service",
      value: "DEFENSE_CRIMINAL_INVESTIGATION_SERVICE",
    },
    {
      text: "Defense Finance and Accounting Service",
      value: "DEFENSE_FINANCE_AND_ACCOUNTING_SERVICE",
    },
    {
      text: "Defense Information Systems Agency (DISA)",
      value: "DEFENSE_INFORMATION_SYSTEMS_AGENCY",
    },
    {
      text: "Defense Intelligence Agency (DIA)",
      value: "DEFENSE_INTELLIGENCE_AGENCY",
    },
    {
      text: "Defense Logistics Agency (DLA)",
      value: "DEFENESE_LOGISTICS_AGENCY",
    },
    {
      text: "Defense Media Activity (DMA)",
      value: "DEFENSE_MEDIA_ACTIVITY",
    },
    {
      text: "Defense Security Cooperation Agency",
      value: "DEFENSE_SECURITY_COOPERATION_AGENCY",
    },
    {
      text: "Defense Technical Information Center",
      value: "DEFENSE_TECHNICAL_INFORMATION_CENTER",
    },
    {
      text: "Defense Threat Reduction Center (DTRA)",
      value: "DEFENSE_THREAT_REDUCTION_CENTER",
    },
    {
      text: "Department of Defense",
      value: "DEPARTMENT_OF_DEFENSE",
    },
    {
      text: "Department of Homeland Security",
      value: "DEPARTMENT_OF_HOMELAND_SECURITY",
    },
    {
      text: "Department of Housing and Urban Development",
      value: "DEPARTMENT_OF_HOUSING_AND_URBAN_DEVELOPMENT",
    },
    {
      text: "Department of State",
      value: "DEPARTMENT_OF_STATE",
    },
    {
      text: "Drug Enforcement Agency",
      value: "DRUG_ENFORCEMENT_AGENCY",
    },
    {
      text: "Executive Office of the President",
      value: "EXECUTIVE_OFFICE_OF_THE_PRESIDENT",
    },
    {
      text: "Federal Aviation Administration",
      value: "FEDERAL_AVIATION_ADMINISTRATION",
    },
    {
      text: "Federal Bureau of Investigation",
      value: "FEDERAL_BUREAU_OF_INVESTIGATION",
    },
    {
      text: "Federal Communications Commission",
      value: "FEDERAL_COMMUNICATIONS_COMMISSION",
    },
    {
      text: "Joint Chiefs of Staff",
      value: "JOINT_CHIEFS_OF_STAFF",
    },
    {
      text: "Joint Forces Command",
      value: "JOINT_FORCES_COMMAND",
    },
    {
      text: "Joint Information Operations Warfare Command",
      value: "JOINT_INFORMATION_OPERATIONS_WARFARE_COMMAND",
    },
    {
      text: "Joint Logistics Systems Center",
      value: "JOINT_LOGISTICS_SYSTEMS_CENTER",
    },
    {
      text: "Joint Staff Comptroller",
      value: "JOINT_STAFF_COMPTROLLER",
    },
    {
      text: "Joint System Engineering & Integration Office (JSEIO)",
      value: "JOINT_SYSTEM_ENGINEERING_AND_INTEGRATION_OFFICE",
    },
    {
      text: "Military Health System (MHS) Defense Health Agency (DHA)",
      value: "MILITARY_HEALTH_SYSTEM_DEFENSE_HEALTH_AGENCY",
    },
    {
      text: "Military Sealift Command",
      value: "MILITARY_SEALIFT_COMMAND",
    },
    {
      text: "National Geospatial Intelligence Agency",
      value: "NATIONAL_GEOSPATIAL_INTELLIGENCE_AGENCY",
    },
    {
      text: "National Ground Intelligence Agency",
      value: "NATIONAL_GROUND_INTELLIGENCE_AGENCY",
    },
    {
      text: "National Guard Bureau",
      value: "NATIONAL_GUARD_BUREAU",
    },
    {
      text: "National Security Agency",
      value: "NATIONAL_SECURITY_AGENCY",
    },
    {
      text: "Office of the Security of Defense (OSD)",
      value: "OFFICE_OF_THE_SECURITY_OF_DEFENSE",
    },
    {
      text: "U.S. Africa Command",
      value: "US_AFRICA_COMMAND",
    },
    {
      text: "U.S. Air Force",
      value: "US_AIR_FORCE",
    },
    {
      text: "U.S. Air Force Europe (USAFE)",
      value: "US_AIR_FORCE_EUROPE",
    },
    {
      text: "U.S. Army",
      value: "US_ARMY",
    },
    {
      text: "U.S. Central Command (USCENTCOM)",
      value: "US_CENTRAL_COMMAND",
    },
    {
      text: "U.S. Coast Guard",
      value: "US_COAST_GUARD",
    },
    {
      text: "U.S. Cyber Command",
      value: "US_CYBER_COMMAND",
    },
    {
      text: "U.S. Department of Agriculture",
      value: "US_DEPARTMENT_OF_AGRICULTURE",
    },
    {
      text: "U.S. European Command (USEUCOM)",
      value: "US_EUROPEAN_COMMAND",
    },
    {
      text: "U.S. Marine Corps",
      value: "US_MARINE_CORPS",
    },
    {
      text: "U.S. Navy",
      value: "US_NAVY",
    },
    {
      text: "U.S. Northern Command (USNORTHCOM)",
      value: "US_NORTHERN_COMMAND",
    },
    {
      text: "U.S. Pacific Command (USPACCOM)",
      value: "US_PACIFIC_COMMAND",
    },
    {
      text: "U.S. Southern Command (USSOUTHCOM)",
      value: "US_SOUTHERN_COMMAND",
    },
    {
      text: "U.S. Special Operations Command (USSOCOM)",
      value: "US_SPECIAL_OPERATIONS_COMMAND",
    },
    {
      text: "U.S. Strategic Command (USSTRATCOM)",
      value: "US_STRATEGIC_COMMAND",
    },
    {
      text: "U.S. Transportation Command (USTRANSCOM)",
      value: "US_TRANSPORTATION_COMMAND",
    },
    {
      text: "Communications & Electronics Command",
      value: "COMMUNICATIONS_AND_ELECTRONICS_COMMAND",
    },
    {
      text: "Defense Advanced Research Project Agency (DARPA)",
      value: "DEFENSE_ADVANCED_RESEARCH_PROJECT_AGENCY",
    },
    {
      text: "Defense Commissary Agency",
      value: "DEFENSE_COMMISSARY_AGENCY",
    },
    {
      text: "Defense Contract Audit Agency (DCAA)",
      value: "DEFENSE_CONTRACT_AUDIT_AGENCY",
    },
    {
      text: "Defense Contract Management Agency (DCMA)",
      value: "DEFENSE_CONTRACT_MANAGEMENT_AGENCY",
    },
    {
      text: "Defense Counterintelligence and Security Agency",
      value: "DEFENSE_COUNTERINTELLIGENCE_AND_SECURITY_AGENCY",
    },
    {
      text: "Defense Criminal Investigation Service",
      value: "DEFENSE_CRIMINAL_INVESTIGATION_SERVICE",
    },
    {
      text: "Defense Finance and Accounting Service",
      value: "DEFENSE_FINANCE_AND_ACCOUNTING_SERVICE",
    },
    {
      text: "Defense Information Systems Agency (DISA)",
      value: "DEFENSE_INFORMATION_SYSTEMS_AGENCY",
    },
    {
      text: "Defense Intelligence Agency (DIA)",
      value: "DEFENSE_INTELLIGENCE_AGENCY",
    },
    {
      text: "Defense Logistics Agency (DLA)",
      value: "DEFENESE_LOGISTICS_AGENCY",
    },
    {
      text: "Defense Media Activity (DMA)",
      value: "DEFENSE_MEDIA_ACTIVITY",
    },
    {
      text: "Defense Security Cooperation Agency",
      value: "DEFENSE_SECURITY_COOPERATION_AGENCY",
    },
    {
      text: "Defense Technical Information Center",
      value: "DEFENSE_TECHNICAL_INFORMATION_CENTER",
    },
    {
      text: "Defense Threat Reduction Center (DTRA)",
      value: "DEFENSE_THREAT_REDUCTION_CENTER",
    },
    {
      text: "Department of Defense",
      value: "DEPARTMENT_OF_DEFENSE",
    },
    {
      text: "Department of Homeland Security",
      value: "DEPARTMENT_OF_HOMELAND_SECURITY",
    },
    {
      text: "Department of Housing and Urban Development",
      value: "DEPARTMENT_OF_HOUSING_AND_URBAN_DEVELOPMENT",
    },
    {
      text: "Department of State",
      value: "DEPARTMENT_OF_STATE",
    },
    {
      text: "Drug Enforcement Agency",
      value: "DRUG_ENFORCEMENT_AGENCY",
    },
    {
      text: "Executive Office of the President",
      value: "EXECUTIVE_OFFICE_OF_THE_PRESIDENT",
    },
    {
      text: "Federal Aviation Administration",
      value: "FEDERAL_AVIATION_ADMINISTRATION",
    },
    {
      text: "Federal Bureau of Investigation",
      value: "FEDERAL_BUREAU_OF_INVESTIGATION",
    },
    {
      text: "Federal Communications Commission",
      value: "FEDERAL_COMMUNICATIONS_COMMISSION",
    },
    {
      text: "Joint Chiefs of Staff",
      value: "JOINT_CHIEFS_OF_STAFF",
    },
    {
      text: "Joint Forces Command",
      value: "JOINT_FORCES_COMMAND",
    },
    {
      text: "Joint Information Operations Warfare Command",
      value: "JOINT_INFORMATION_OPERATIONS_WARFARE_COMMAND",
    },
    {
      text: "Joint Logistics Systems Center",
      value: "JOINT_LOGISTICS_SYSTEMS_CENTER",
    },
    {
      text: "Joint Staff Comptroller",
      value: "JOINT_STAFF_COMPTROLLER",
    },
    {
      text: "Joint System Engineering & Integration Office (JSEIO)",
      value: "JOINT_SYSTEM_ENGINEERING_AND_INTEGRATION_OFFICE",
    },
    {
      text: "Military Health System (MHS) Defense Health Agency (DHA)",
      value: "MILITARY_HEALTH_SYSTEM_DEFENSE_HEALTH_AGENCY",
    },
    {
      text: "Military Sealift Command",
      value: "MILITARY_SEALIFT_COMMAND",
    },
    {
      text: "National Geospatial Intelligence Agency",
      value: "NATIONAL_GEOSPATIAL_INTELLIGENCE_AGENCY",
    },
    {
      text: "National Ground Intelligence Agency",
      value: "NATIONAL_GROUND_INTELLIGENCE_AGENCY",
    },
    {
      text: "National Guard Bureau",
      value: "NATIONAL_GUARD_BUREAU",
    },
    {
      text: "National Security Agency",
      value: "NATIONAL_SECURITY_AGENCY",
    },
    {
      text: "Office of the Security of Defense (OSD)",
      value: "OFFICE_OF_THE_SECURITY_OF_DEFENSE",
    },
    {
      text: "U.S. Africa Command",
      value: "US_AFRICA_COMMAND",
    },
    {
      text: "U.S. Air Force",
      value: "US_AIR_FORCE",
    },
    {
      text: "U.S. Air Force Europe (USAFE)",
      value: "US_AIR_FORCE_EUROPE",
    },
    {
      text: "U.S. Army",
      value: "US_ARMY",
    },
    {
      text: "U.S. Central Command (USCENTCOM)",
      value: "US_CENTRAL_COMMAND",
    },
    {
      text: "U.S. Coast Guard",
      value: "US_COAST_GUARD",
    },
    {
      text: "U.S. Cyber Command",
      value: "US_CYBER_COMMAND",
    },
    {
      text: "U.S. Department of Agriculture",
      value: "US_DEPARTMENT_OF_AGRICULTURE",
    },
    {
      text: "U.S. European Command (USEUCOM)",
      value: "US_EUROPEAN_COMMAND",
    },
    {
      text: "U.S. Marine Corps",
      value: "US_MARINE_CORPS",
    },
    {
      text: "U.S. Navy",
      value: "US_NAVY",
    },
    {
      text: "U.S. Northern Command (USNORTHCOM)",
      value: "US_NORTHERN_COMMAND",
    },
    {
      text: "U.S. Pacific Command (USPACCOM)",
      value: "US_PACIFIC_COMMAND",
    },
    {
      text: "U.S. Southern Command (USSOUTHCOM)",
      value: "US_SOUTHERN_COMMAND",
    },
    {
      text: "U.S. Special Operations Command (USSOCOM)",
      value: "US_SPECIAL_OPERATIONS_COMMAND",
    },
    {
      text: "U.S. Strategic Command (USSTRATCOM)",
      value: "US_STRATEGIC_COMMAND",
    },
    {
      text: "U.S. Transportation Command (USTRANSCOM)",
      value: "US_TRANSPORTATION_COMMAND",
    },
  ];

  public stateListData: SelectData[] = [
    { text: "Alabama", value: "AL" },
    { text: "Alaska", value: "AK" },
    { text: "Arizona", value: "AZ" },
    { text: "Arkansas", value: "AR" },
    { text: "California", value: "CA" },
    { text: "Colorado", value: "CO" },
    { text: "Connecticut", value: "CT" },
    { text: "Delaware", value: "DE" },
    { text: "District of Columbia", value: "DC" },
    { text: "Florida", value: "FL" },
    { text: "Georgia", value: "GA" },
    { text: "Hawaii", value: "HI" },
    { text: "Idaho", value: "ID" },
    { text: "Illinois", value: "IL" },
    { text: "Indiana", value: "IN" },
    { text: "Iowa", value: "IA" },
    { text: "Kansas", value: "KS" },
    { text: "Kentucky", value: "KY" },
    { text: "Louisiana", value: "LA" },
    { text: "Maine", value: "ME" },
    { text: "Maryland", value: "MD" },
    { text: "Massachusetts", value: "MA" },
    { text: "Michigan", value: "MI" },
    { text: "Minnesota", value: "MN" },
    { text: "Mississippi", value: "MS" },
    { text: "Missouri", value: "MO" },
    { text: "Montana", value: "MT" },
    { text: "Nebraska", value: "NE" },
    { text: "Nevada", value: "NV" },
    { text: "New Hampshire", value: "NH" },
    { text: "New Jersey", value: "NJ" },
    { text: "New Mexico", value: "NM" },
    { text: "New York", value: "NY" },
    { text: "North Carolina", value: "NC" },
    { text: "North Dakota", value: "ND" },
    { text: "Ohio", value: "OH" },
    { text: "Oklahoma", value: "OK" },
    { text: "Oregon", value: "OR" },
    { text: "Pennsylvania", value: "PA" },
    { text: "Rhode Island", value: "RI" },
    { text: "South Carolina", value: "SC" },
    { text: "South Dakota", value: "SD" },
    { text: "Tennessee", value: "TN" },
    { text: "Texas", value: "TX" },
    { text: "Utah", value: "UT" },
    { text: "Vermont", value: "VT" },
    { text: "Virginia", value: "VA" },
    { text: "Washington", value: "WA" },
    { text: "West Virginia", value: "WV" },
    { text: "Wisconsin", value: "WI" },
    { text: "Wyoming", value: "WY" },
  ];

  public countryListData = [
    { text: "United States of America", value: "US" },
    { text: "Afghanistan", value: "AF" },
    { text: "Åland Islands", value: "AX" },
    { text: "Albania", value: "AL" },
    { text: "Algeria", value: "DZ" },
    { text: "American Samoa", value: "AS" },
    { text: "Andorra", value: "AD" },
    { text: "Angola", value: "AO" },
    { text: "Anguilla", value: "AI" },
    { text: "Antarctica", value: "AQ" },
    { text: "Antigua and Barbuda", value: "AG" },
    { text: "Argentina", value: "AR" },
    { text: "Armenia", value: "AM" },
    { text: "Aruba", value: "AW" },
    { text: "Australia", value: "AU" },
    { text: "Austria", value: "AT" },
    { text: "Azerbaijan", value: "AZ" },
    { text: "Bahamas", value: "BS" },
    { text: "Bahrain", value: "BH" },
    { text: "Bangladesh", value: "BD" },
    { text: "Barbados", value: "BB" },
    { text: "Belarus", value: "BY" },
    { text: "Belgium", value: "BE" },
    { text: "Belize", value: "BZ" },
    { text: "Benin", value: "BJ" },
    { text: "Bermuda", value: "BM" },
    { text: "Bhutan", value: "BT" },
    { text: "Bolivia", value: "BO" },
    { text: "Bosnia and Herzegovina", value: "BA" },
    { text: "Botswana", value: "BW" },
    { text: "Bouvet Island", value: "BV" },
    { text: "Brazil", value: "BR" },
    { text: "British Indian Ocean Territory", value: "IO" },
    { text: "Brunei Darussalam", value: "BN" },
    { text: "Bulgaria", value: "BG" },
    { text: "Burkina Faso", value: "BF" },
    { text: "Burundi", value: "BI" },
    { text: "Cambodia", value: "KH" },
    { text: "Cameroon", value: "CM" },
    { text: "Canada", value: "CA" },
    { text: "Cape Verde", value: "CV" },
    { text: "Cayman Islands", value: "KY" },
    { text: "Central African Republic", value: "CF" },
    { text: "Chad", value: "TD" },
    { text: "Chile", value: "CL" },
    { text: "China", value: "CN" },
    { text: "Christmas Island", value: "CX" },
    { text: "Cocos (Keeling) Islands", value: "CC" },
    { text: "Colombia", value: "CO" },
    { text: "Comoros", value: "KM" },
    { text: "Congo", value: "CG" },
    { text: "Congo, The Democratic Republic of the", value: "CD" },
    { text: "Cook Islands", value: "CK" },
    { text: "Costa Rica", value: "CR" },
    { text: 'Cote D"Ivoire', value: "CI" },
    { text: "Croatia", value: "HR" },
    { text: "Cuba", value: "CU" },
    { text: "Cyprus", value: "CY" },
    { text: "Czech Republic", value: "CZ" },
    { text: "Denmark", value: "DK" },
    { text: "Djibouti", value: "DJ" },
    { text: "Dominica", value: "DM" },
    { text: "Dominican Republic", value: "DO" },
    { text: "Ecuador", value: "EC" },
    { text: "Egypt", value: "EG" },
    { text: "El Salvador", value: "SV" },
    { text: "Equatorial Guinea", value: "GQ" },
    { text: "Eritrea", value: "ER" },
    { text: "Estonia", value: "EE" },
    { text: "Ethiopia", value: "ET" },
    { text: "Falkland Islands (Malvinas)", value: "FK" },
    { text: "Faroe Islands", value: "FO" },
    { text: "Fiji", value: "FJ" },
    { text: "Finland", value: "FI" },
    { text: "France", value: "FR" },
    { text: "French Guiana", value: "GF" },
    { text: "French Polynesia", value: "PF" },
    { text: "French Southern Territories", value: "TF" },
    { text: "Gabon", value: "GA" },
    { text: "Gambia", value: "GM" },
    { text: "Georgia", value: "GE" },
    { text: "Germany", value: "DE" },
    { text: "Ghana", value: "GH" },
    { text: "Gibraltar", value: "GI" },
    { text: "Greece", value: "GR" },
    { text: "Greenland", value: "GL" },
    { text: "Grenada", value: "GD" },
    { text: "Guadeloupe", value: "GP" },
    { text: "Guam", value: "GU" },
    { text: "Guatemala", value: "GT" },
    { text: "Guernsey", value: "GG" },
    { text: "Guinea", value: "GN" },
    { text: "Guinea-Bissau", value: "GW" },
    { text: "Guyana", value: "GY" },
    { text: "Haiti", value: "HT" },
    { text: "Heard Island and Mcdonald Islands", value: "HM" },
    { text: "Holy See (Vatican City State)", value: "VA" },
    { text: "Honduras", value: "HN" },
    { text: "Hong Kong", value: "HK" },
    { text: "Hungary", value: "HU" },
    { text: "Iceland", value: "IS" },
    { text: "India", value: "IN" },
    { text: "Indonesia", value: "ID" },
    { text: "Iran, Islamic Republic Of", value: "IR" },
    { text: "Iraq", value: "IQ" },
    { text: "Ireland", value: "IE" },
    { text: "Isle of Man", value: "IM" },
    { text: "Israel", value: "IL" },
    { text: "Italy", value: "IT" },
    { text: "Jamaica", value: "JM" },
    { text: "Japan", value: "JP" },
    { text: "Jersey", value: "JE" },
    { text: "Jordan", value: "JO" },
    { text: "Kazakhstan", value: "KZ" },
    { text: "Kenya", value: "KE" },
    { text: "Kiribati", value: "KI" },
    { text: 'Korea, Democratic People"S Republic of', value: "KP" },
    { text: "Korea, Republic of", value: "KR" },
    { text: "Kuwait", value: "KW" },
    { text: "Kyrgyzstan", value: "KG" },
    { text: 'Lao People"S Democratic Republic', value: "LA" },
    { text: "Latvia", value: "LV" },
    { text: "Lebanon", value: "LB" },
    { text: "Lesotho", value: "LS" },
    { text: "Liberia", value: "LR" },
    { text: "Libyan Arab Jamahiriya", value: "LY" },
    { text: "Liechtenstein", value: "LI" },
    { text: "Lithuania", value: "LT" },
    { text: "Luxembourg", value: "LU" },
    { text: "Macao", value: "MO" },
    { text: "Macedonia, The Former Yugoslav Republic of", value: "MK" },
    { text: "Madagascar", value: "MG" },
    { text: "Malawi", value: "MW" },
    { text: "Malaysia", value: "MY" },
    { text: "Maldives", value: "MV" },
    { text: "Mali", value: "ML" },
    { text: "Malta", value: "MT" },
    { text: "Marshall Islands", value: "MH" },
    { text: "Martinique", value: "MQ" },
    { text: "Mauritania", value: "MR" },
    { text: "Mauritius", value: "MU" },
    { text: "Mayotte", value: "YT" },
    { text: "Mexico", value: "MX" },
    { text: "Micronesia, Federated States of", value: "FM" },
    { text: "Moldova, Republic of", value: "MD" },
    { text: "Monaco", value: "MC" },
    { text: "Mongolia", value: "MN" },
    { text: "Montserrat", value: "MS" },
    { text: "Morocco", value: "MA" },
    { text: "Mozambique", value: "MZ" },
    { text: "Myanmar", value: "MM" },
    { text: "Namibia", value: "NA" },
    { text: "Nauru", value: "NR" },
    { text: "Nepal", value: "NP" },
    { text: "Netherlands", value: "NL" },
    { text: "Netherlands Antilles", value: "AN" },
    { text: "New Caledonia", value: "NC" },
    { text: "New Zealand", value: "NZ" },
    { text: "Nicaragua", value: "NI" },
    { text: "Niger", value: "NE" },
    { text: "Nigeria", value: "NG" },
    { text: "Niue", value: "NU" },
    { text: "Norfolk Island", value: "NF" },
    { text: "Northern Mariana Islands", value: "MP" },
    { text: "Norway", value: "NO" },
    { text: "Oman", value: "OM" },
    { text: "Pakistan", value: "PK" },
    { text: "Palau", value: "PW" },
    { text: "Palestinian Territory, Occupied", value: "PS" },
    { text: "Panama", value: "PA" },
    { text: "Papua New Guinea", value: "PG" },
    { text: "Paraguay", value: "PY" },
    { text: "Peru", value: "PE" },
    { text: "Philippines", value: "PH" },
    { text: "Pitcairn", value: "PN" },
    { text: "Poland", value: "PL" },
    { text: "Portugal", value: "PT" },
    { text: "Puerto Rico", value: "PR" },
    { text: "Qatar", value: "QA" },
    { text: "Reunion", value: "RE" },
    { text: "Romania", value: "RO" },
    { text: "Russian Federation", value: "RU" },
    { text: "Rwanda", value: "RW" },
    { text: "Saint Helena", value: "SH" },
    { text: "Saint Kitts and Nevis", value: "KN" },
    { text: "Saint Lucia", value: "LC" },
    { text: "Saint Pierre and Miquelon", value: "PM" },
    { text: "Saint Vincent and the Grenadines", value: "VC" },
    { text: "Samoa", value: "WS" },
    { text: "San Marino", value: "SM" },
    { text: "Sao Tome and Principe", value: "ST" },
    { text: "Saudi Arabia", value: "SA" },
    { text: "Senegal", value: "SN" },
    { text: "Serbia and Montenegro", value: "CS" },
    { text: "Seychelles", value: "SC" },
    { text: "Sierra Leone", value: "SL" },
    { text: "Singapore", value: "SG" },
    { text: "Slovakia", value: "SK" },
    { text: "Slovenia", value: "SI" },
    { text: "Solomon Islands", value: "SB" },
    { text: "Somalia", value: "SO" },
    { text: "South Africa", value: "ZA" },
    { text: "South Georgia and the South Sandwich Islands", value: "GS" },
    { text: "Spain", value: "ES" },
    { text: "Sri Lanka", value: "LK" },
    { text: "Sudan", value: "SD" },
    { text: "Suriname", value: "SR" },
    { text: "Svalbard and Jan Mayen", value: "SJ" },
    { text: "Swaziland", value: "SZ" },
    { text: "Sweden", value: "SE" },
    { text: "Switzerland", value: "CH" },
    { text: "Syrian Arab Republic", value: "SY" },
    { text: "Taiwan, Province of China", value: "TW" },
    { text: "Tajikistan", value: "TJ" },
    { text: "Tanzania, United Republic of", value: "TZ" },
    { text: "Thailand", value: "TH" },
    { text: "Timor-Leste", value: "TL" },
    { text: "Togo", value: "TG" },
    { text: "Tokelau", value: "TK" },
    { text: "Tonga", value: "TO" },
    { text: "Trinidad and Tobago", value: "TT" },
    { text: "Tunisia", value: "TN" },
    { text: "Turkey", value: "TR" },
    { text: "Turkmenistan", value: "TM" },
    { text: "Turks and Caicos Islands", value: "TC" },
    { text: "Tuvalu", value: "TV" },
    { text: "Uganda", value: "UG" },
    { text: "Ukraine", value: "UA" },
    { text: "United Arab Emirates", value: "AE" },
    { text: "United Kingdom", value: "GB" },
    { text: "United States Minor Outlying Islands", value: "UM" },
    { text: "United States of America", value: "US" },
    { text: "Uruguay", value: "UY" },
    { text: "Uzbekistan", value: "UZ" },
    { text: "Vanuatu", value: "VU" },
    { text: "Venezuela", value: "VE" },
    { text: "Viet Nam", value: "VN" },
    { text: "Virgin Islands, British", value: "VG" },
    { text: "Virgin Islands, U.S.", value: "VI" },
    { text: "Wallis and Futuna", value: "WF" },
    { text: "Western Sahara", value: "EH" },
    { text: "Yemen", value: "YE" },
    { text: "Zambia", value: "ZM" },
    { text: "Zimbabwe", value: "ZW" },
  ];

  @Action({ rawError: true })
  public getCountryListData(removeCountries: string[] | null): SelectData[] {
    if (!removeCountries) {
      return this.countryListData;
    }
    let filteredCountries = this.countryListData;
    removeCountries.filter(function (countryCode) {
      filteredCountries = filteredCountries.filter(function (countryObj) {
        return countryObj.value !== countryCode;
      });
    });
    return filteredCountries;
  }

  public disaOrgData: SelectData[] = [
    {
      text: "Assistant to the Director (DD)",
      value: "ASSISTANT_TO_THE_DIRECTOR",
    },
    {
      text: "Chaplain Program Management Office (DDCH)",
      value: "CHAPLAIN_PROGRAM_MANAGEMENT_OFFICE",
    },
    {
      text: "Chief Financial Officer / Comptroller (CP)",
      value: "CHIEF_FINANCIAL_OFFICER_COMPTROLLER",
    },
    {
      text: "Chief of Staff (DDC)",
      value: "CHIEF_OF_STAFF",
    },
    {
      text: "Combined Action Group (DDCG)",
      value: "COMBINED_ACTION_GROUP",
    },
    {
      text: "Component Acquisition Executive (CAE)",
      value: "COMPONENT_ACQUISITION_EXECUTIVE",
    },
    {
      text: "DCSC Cyber Security & Analytics (ID)",
      value: "DCSC_CYBER_SECURITY_AND_ANALYTICS",
    },
    {
      text: "DCSC Defense Spectrum Organization (DSO)",
      value: "DCSC_DEFENSE_SPECTRUM_ORGANIZATION",
    },
    {
      text: "DCSC Joint Enterprise Services (SD)",
      value: "DCSC_JOINT_ENTERPRISE_SERVICES",
    },
    {
      text: "DCSC Joint Enterprise Services DoD Enterprise Mobility (SD5)",
      value: "DCSC_JOINT_ENTERPRISE_SERVICES_DOD_ENTERPRISE_MOBILITY",
    },
    {
      text: "DCSC Joint Interop Test Command (JITC)",
      value: "DCSC_JOINT_INTEROP_TEST_COMMAND",
    },
    {
      text: "DCSC National Background Investigative System Directorate (NBIS)",
      value: "DCSC_NATIONAL_BACKGROUND_INVESTIGATIVE_SYSTEM_DIRECTORATE",
    },
    {
      text: "DCSC Resource Management (BD)",
      value: "DCSC_RESOURCE_MANAGEMENT",
    },
    {
      text: "DISA Director Group (DD)",
      value: "DISA_DIRECTOR_GROUP",
    },
    {
      text: "EC Chief Data Officer (OD)",
      value: "EC_CHIEF_DATA_OFFICER",
    },
    {
      text: "EC Chief Information Officer (IO)",
      value: "EC_CHIEF_INFORMATION_OFFICER",
    },
    {
      text: "EC Emerging Technology (EM)",
      value: "EC_EMERGING_TECHNOLOGY",
    },
    {
      text: "EC Enterprise Engineering & Governance (OE)",
      value: "EC_ENTERPRISE_ENGINEERING_AND_GOVERNANCE",
    },
    {
      text: "EC Resource Management (EC)",
      value: "EC_RESOURCE_MANAGEMENT",
    },
    {
      text: "EC Risk Management (RE)",
      value: "EC_RISK_MANAGEMENT",
    },
    {
      text: "Executive Deputy Director (DDE)",
      value: "EXECUTIVE_DEPUTY_DIRECTOR",
    },
    {
      text: "General Counsel (GC)",
      value: "GENERAL_COUNSEL",
    },
    {
      text: "HC Compute Operations Office (HC3)",
      value: "HC_COMPUTE_OPERATIONS_OFFICE",
    },
    {
      text: "HC Operations Support Office (HC1)",
      value: "HC_OPERATIONS_SUPPORT_OFFICE",
    },
    {
      text: "HC Product Management Office (HC2)",
      value: "HC_PRODUCT_MANAGEMENT_OFFICE",
    },
    {
      text: "Inspector General (IG)",
      value: "INSPECTOR_GENERAL",
    },
    {
      text: "Joint Artificial Intelligence Center (JAIC)",
      value: "JOINT_ARTIFICIAL_INTELLIGENCE_CENTER",
    },
    {
      text: "Joint Forces Headquarters (JFHQ)",
      value: "JOINT_FORCES_HEADQUARTERS",
    },
    {
      text: "Joint Services Provider (JSP)",
      value: "JOINT_SERVICES_PROVIDER",
    },
    {
      text: "Joint Support Group (JSG)",
      value: "JOINT_SUPPORT_GROUP",
    },
    {
      text: "OC Cyberspace-Operations (CE)",
      value: "OC_CYBERSPACE_OPERATIONS",
    },
    {
      text: "OC Cyberspace-Operations DISA Pacific (PC)",
      value: "OC_CYBERSPACE_OPERATIONS_DISA_PACIFIC",
    },
    {
      text: "OC Cyberspace-Operations Joint Staff Support Center (JC)",
      value: "OC_CYBERSPACE_OPERATIONS_JOINT_STAFF_SUPPORT_CENTER",
    },
    {
      text: "OC Endpoint Services & Customer Support (FE)",
      value: "OC_ENDPOINT_SERVICES_AND_CUSTOMER_SUPPORT",
    },
    {
      text: "OC Resource Management (OC)",
      value: "OC_RESOURCE_MANAGEMENT",
    },
    {
      text: "OC Transport Services (IE)",
      value: "OC_TRANSPORT_SERVICES",
    },
    {
      text: "Office of Equality, Diversity & Inclusion (OEDI)",
      value: "OFFICE_OF_EQUALITY_DIVERSITY_AND_INCLUSION",
    },
    {
      text: "Office of Strategic Communications & Public Affairs (DDCP)",
      value: "OFFICE_OF_STRATEGIC_COMMUNICATIONS_AND_PUBLIC_AFFAIRS",
    },
    {
      text: "Pentagon Liaison Officer / Congressional Affairs Coordinator (DDC)",
      value: "PENTAGON_LIAISON_OFFICER_CONGRESSIONAL_AFFAIRS_COORDINATOR",
    },
    {
      text: "Procurement Services (PSD)",
      value: "PROCUREMENT_SERVICES",
    },
    {
      text: "Procurement Services DITCO EUR (PL5)",
      value: "PROCUREMENT_SERVICES_DITCO_EUR_PL5",
    },
    {
      text: "Procurement Services DITCO EUR (PL6)",
      value: "PROCUREMENT_SERVICES_DITCO_EUR_PL6",
    },
    {
      text: "Procurement Services DITCO PAC (PL7)",
      value: "PROCUREMENT_SERVICES_DITCO_PAC",
    },
    {
      text: "Procurement Services DITCO Scott (PL8)",
      value: "PROCUREMENT_SERVICES_DITCO_SCOTT",
    },
    {
      text: "Program Director for Culture & Employee Engagement",
      value: "PROGRAM_DIRECTOR_FOR_CULTURE_AND_EMPLOYEE_ENGAGEMENT",
    },
    {
      text: "Protocol (DDCA)",
      value: "PROTOCOL",
    },
    {
      text: "Secretary of Defense Communications",
      value: "SECRETARY_OF_DEFENSE_COMMUNICATIONS",
    },
    {
      text: "Senior Enlisted Advisor (DDS)",
      value: "SENIOR_ENLISTED_ADVISOR",
    },
    {
      text: "Small Business Programs (DDC4)",
      value: "SMALL_BUSINESS_PROGRAMS",
    },
    {
      text: "White House Communications Agency (WHCA)",
      value: "WHITE_HOUSE_COMMUNICATIONS_AGENCY",
    },
    {
      text: "White House Situations Support Staff (WHSSS)",
      value: "WHITE_HOUSE_SITUATION_SUPPORT_STAFF",
    },
    {
      text: "Workforce Services and Development Directorate (WSD)",
      value: "WORKFORCE_SERVICES_AND_DEVELOPMENT_DIRECTORATE",
    },
  ];

  //mapping of store properties to api endpoints 
  private apiEndpointMap: Record<string, TableApiBase<BaseTableDTO>> = {
    [StoreProperties.ContractType]: api.contractTypeTable,
    [StoreProperties.CurrentContract]: api.currentContractTable,
    [StoreProperties.FairOpportunity]: api.fairOpportunityTable,
    [StoreProperties.GFEOverview]: api.gfeOverviewTable,
    [StoreProperties.Organization]: api.organizationTable,
    [StoreProperties.ProjectOverview]: api.projectOverviewTable,
    [StoreProperties.PeriodOfPerformance]: api.periodOfPerformanceTable,
    [StoreProperties.RequirementsCostEstimate]: api.requirementsCostEstimateTable,
    [StoreProperties.SensitiveInformation]: api.sensitiveInformationTable,
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
    [StoreProperties.RequirementsCostEstimate]: "requirements_const_estimate",
    [StoreProperties.SensitiveInformation]: "sensitive_information",
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

  @Action({ rawError: true })
  async loadFairOpportunity(): Promise<FairOpportunityDTO> {
    try {
      await this.ensureInitialized();

      const sys_id = this.fairOpportunity?.sys_id || "";

      if (sys_id.length > 0) {
        const fairOpportunityData = await api.fairOpportunityTable.retrieve(
          sys_id as string
        );
        this.setFairOpportunity(fairOpportunityData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          fair_opportunity: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.fairOpportunity as FairOpportunityDTO;
    } catch (error) {
      throw new Error(`error occurred loading fair opportunity info ${error}`);
    }
  }

  @Action({ rawError: true })
  /**
   * Saves Fair Opportunity data to backend
   */
  async saveFairOpportunity(data: FairOpportunityDTO): Promise<void> {
    try {
      const sys_id = this.fairOpportunity?.sys_id || "";
      const savedFairOpportunity =
        sys_id.length > 0
          ? await api.fairOpportunityTable.update(sys_id, { ...data, sys_id })
          : await api.fairOpportunityTable.create(data);
      this.setFairOpportunity(savedFairOpportunity);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        fair_opportunity: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving fair opportunity info ${error}`);
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

  /**
   * Loads Period of Performance data from backend
   */
  @Action({ rawError: true })
  async loadPeriodOfPerformance(): Promise<PeriodOfPerformanceDTO> {
    try {
      await this.ensureInitialized();

      const sys_id = this.periodOfPerformance?.sys_id || "";

      if (sys_id.length > 0) {
        const periodOfPerformanceData =
          await api.periodOfPerformanceTable.retrieve(sys_id as string);
        this.setPeriodOfPerformance(periodOfPerformanceData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          period_of_performance: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.periodOfPerformance as PeriodOfPerformanceDTO;
    } catch (error) {
      throw new Error(`error occurred loading PoP info data ${error}`);
    }
  }

  /**
   * Saves Period of Performance Information (FOIA) data to backend
   */
  @Action({ rawError: true })
  async savePeriodOfPerformance(data: PeriodOfPerformanceDTO): Promise<void> {
    try {
      const sys_id = this.periodOfPerformance?.sys_id || "";
      const savedPeriodOfPerformance =
        sys_id.length > 0
          ? await api.periodOfPerformanceTable.update(sys_id, {
            ...data,
            sys_id,
          })
          : await api.periodOfPerformanceTable.create(data);
      this.setPeriodOfPerformance(savedPeriodOfPerformance);
      this.setAcquisitionPackage({
        ...this.periodOfPerformance,
        period_of_performance: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving PoP data ${error}`);
    }
  }

  @Action({ rawError: true })
  async loadGFEOverview(): Promise<GFEOverviewDTO> {
    try {
      await this.ensureInitialized();
      const sys_id = this.GFEOverview?.sys_id || "";

      if (sys_id.length > 0) {
        const GFEOverviewData = await api.gfeOverviewTable.retrieve(
          sys_id as string
        );
        this.setGFEOverview(GFEOverviewData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          gfe_overview: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.GFEOverview as GFEOverviewDTO;
    } catch (error) {
      throw new Error(`error occurred loading GFE info ${error}`);
    }
  }

  @Action({ rawError: true })
  async saveGFEOverview(data: GFEOverviewDTO): Promise<void> {
    try {
      const sys_id = this.GFEOverview?.sys_id || "";
      const savedGFEOverviewData =
        sys_id.length > 0
          ? await api.gfeOverviewTable.update(sys_id, { ...data, sys_id })
          : await api.gfeOverviewTable.create(data);
      this.setGFEOverview(savedGFEOverviewData);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        gfe_overview: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving GFE data ${error}`);
    }
  }
  /**
   * Loads Contract Type data from backend
   */
  @Action({ rawError: true })
  async loadContractType(): Promise<ContractTypeDTO> {
    try {
      await this.ensureInitialized();
      const sys_id = this.contractType?.sys_id || "";

      if (sys_id.length > 0) {
        const contractTypeData = await api.contractTypeTable.retrieve(
          sys_id as string
        );
        this.setContractType(contractTypeData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          contract_type: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.contractType as ContractTypeDTO;
    } catch (error) {
      throw new Error(`error occurred loading Contract Type data ${error}`);
    }
  }


  @Action({rawError: true})
  async loadContractConsiderations():Promise<ContractConsiderationsDTO> {

    try {
      await this.ensureInitialized();
      const sys_id = this.contractConsiderations?.sys_id || "";

      if (sys_id.length > 0) {
        const contractConsiderationsData = await api.contractConsiderationsTable.retrieve(
          sys_id as string
        );
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

  @Action({rawError: true})
  async saveContractConsiderations(data: ContractConsiderationsDTO): Promise<void>{

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
            ...data});
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

  /**
   * Loads Requirements Cost Estimate data from backend
   */
  @Action({ rawError: true })
  async loadRequirementsCostEstimate(): Promise<RequirementsCostEstimateDTO> {
    try {
      await this.ensureInitialized();
      const sys_id = this.requirementsCostEstimate?.sys_id || "";

      if (sys_id.length > 0) {
        const data = await api.requirementsCostEstimateTable.retrieve(
          sys_id as string
        );
        this.setRequirementsCostEstimate(data);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          requirements_cost_estimate: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.requirementsCostEstimate as RequirementsCostEstimateDTO;
    } catch (error) {
      throw new Error(`error occurred loading Contract Type data ${error}`);
    }
  }

  /**
   * Saves Requirements Cost Estimate data to backend
   */
  @Action({ rawError: true })
  async saveRequirementsCostEstimate(
    data: RequirementsCostEstimateDTO
  ): Promise<void> {
    try {
      const sys_id = this.requirementsCostEstimate?.sys_id || "";
      const savedData =
        sys_id.length > 0
          ? await api.requirementsCostEstimateTable.update(sys_id, {
            ...data,
            sys_id,
          })
          : await api.requirementsCostEstimateTable.create(data);
      this.setRequirementsCostEstimate(savedData);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        requirements_cost_estimate: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(
        `error occurred saving Requirements Cost Estimate data ${error}`
      );
    }
  }

  /**
   * Saves Contract Type data to backend
   */
  @Action({ rawError: true })
  async saveContractType(data: ContractTypeDTO): Promise<void> {
    try {
      const sys_id = this.contractType?.sys_id || "";
      const savedContractType =
        sys_id.length > 0
          ? await api.contractTypeTable.update(sys_id, { ...data, sys_id })
          : await api.contractTypeTable.create(data);
      this.setContractType(savedContractType);
      this.setAcquisitionPackage({
        ...this.contractType,
        contract_type: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving PoP data ${error}`);
    }
  }
}

const AcquisitionPackage = getModule(AcquisitionPackageStore);
export default AcquisitionPackage;


