/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";

import api from "@/api";
import ContactData from "@/store/contactData";
import OrganiationData from "../organizationData";
import {
  AcquisitionPackageDTO,
  RequirementsCostEstimateDTO,
} from "@/api/models";
import {  SelectData } from "types/Global";
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
import { CountryListData } from "@/data/regions";

const ATAT_ACQUISTION_PACKAGE_KEY = "ATAT_ACQUISTION_PACKAGE_KEY";

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

const saveSessionData = (store: AcquisitionPackageStore) => {
  sessionStorage.setItem(
    ATAT_ACQUISTION_PACKAGE_KEY,
    JSON.stringify({
      acquisitionPackage: store.acquisitionPackage,
      projectOverview: store.projectOverview,
      organization: store.organization,
      contactInfo: store.contactInfo,
      corInfo: store.corInfo,
      acorInfo: store.acorInfo,
      fairOpportunity: store.fairOpportunity,
      requirementsCostEstimate: store.requirementsCostEstimate,
      gfeOverview: store.GFEOverview,
    })
  );
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
  corInfo: ContactDTO | null = null;
  acorInfo: ContactDTO | null = null;
  hasAlternativeContactRep: boolean | null = null;
  fairOpportunity: FairOpportunityDTO | null = null;
  currentContract: CurrentContractDTO | null = null;
  sensitiveInformation: SensitiveInformationDTO | null = null;
  periodOfPerformance: PeriodOfPerformanceDTO | null = null;
  GFEOverview: GFEOverviewDTO | null = null;
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
  public setProjectTitle(value: string): void {
    this.projectTitle = value;
  }

  @Mutation
  public setFairOpportunity(value: FairOpportunityDTO): void {
    this.fairOpportunity = value;
  }
  @Mutation
  public setGFEOverview(value: GFEOverviewDTO): void {
    this.GFEOverview = value;
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
    this.projectOverview = sessionData.projectOverview;
    this.organization = sessionData.organization;
    this.contactInfo = sessionData.contactInfo;
    this.corInfo = sessionData.corInfo;
    this.acorInfo = sessionData.acorInfo;
    this.fairOpportunity = sessionData.fairOpportunity;
    this.requirementsCostEstimate = sessionData.requirementsCostEstimate;
    this.currentContract = sessionData.CurrentContract;
    this.sensitiveInformation = sessionData.SensitiveInformation;
    this.GFEOverview = sessionData.GFEOverview;
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
        await ContactData.initialize();
        await OrganiationData.initialize();
        if (acquisitionPackage) {
          this.setProjectOverview(initialProjectOverview());
          this.setOrganization(initialOrganization());
          this.setContact({ data: initialContact(), type: "Mission Owner" });
          this.setContact({ data: initialContact(), type: "COR" });
          this.setContact({ data: initialContact(), type: "ACOR" });
          this.setAcquisitionPackage(acquisitionPackage);
          this.setFairOpportunity(initialFairOpportunity());
          this.setRequirementsCostEstimate({ surge_capabilities: "" });
          this.setGFEOverview(initialGFE());
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

  @Action({ rawError: true })
  public getCountryListData(removeCountries: string[] | null): SelectData[] {
    if (!removeCountries) {
      return CountryListData;
    }
    let filteredCountries = CountryListData;
    removeCountries.filter(function (countryCode) {
      filteredCountries = filteredCountries.filter(function (countryObj) {
        return countryObj.value !== countryCode;
      });
    });
    return filteredCountries;
  }


  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({ rawError: true })
  /**
   * Loads project overview data from back end if a project overview
   * sys_id has been generated.
   */
  async loadProjectOverview(): Promise<ProjectOverviewDTO> {
    try {
      await this.ensureInitialized();

      const projectSysId = this.projectOverview?.sys_id || "";

      if (projectSysId.length > 0) {
        const projectOverviewData = await api.projectOverviewTable.retrieve(
          projectSysId as string
        );
        this.setProjectOverview(projectOverviewData);
        this.setProjectTitle(projectOverviewData.title);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          project_overview: projectSysId,
        } as AcquisitionPackageDTO);
      }
      return this.projectOverview as ProjectOverviewDTO;
    } catch (error) {
      throw new Error(`error occurred loading project overview ${error}`);
    }
  }

  @Action({ rawError: true })
  /**
   * Saves project overview data to backend
   */
  async saveProjectOverview(data: ProjectOverviewDTO): Promise<void> {
    try {
      const projectSysId = this.projectOverview?.sys_id || "";
      const savedProjectOverview =
        projectSysId.length > 0
          ? await api.projectOverviewTable.update(projectSysId, {
            ...data,
            sys_id: projectSysId,
          })
          : await api.projectOverviewTable.create(data);
      this.setProjectOverview(savedProjectOverview);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        project_overview: savedProjectOverview.sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving project overview ${error}`);
    }
  }

  @Action({ rawError: true })
  async loadOrganization(): Promise<OrganizationDTO> {
    try {
      await this.ensureInitialized();

      const sys_id = this.organization?.sys_id || "";
      if (sys_id.length > 0) {
        const organizationData = await api.organizationTable.retrieve(
          sys_id as string
        );
        this.setOrganization(organizationData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          organization: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.organization as OrganizationDTO;
    } catch (error) {
      throw new Error(`error occurred loading organization info ${error}`);
    }
  }

  @Action({ rawError: true })
  /**
   * Saves Organization data to backend
   */
  async saveOrganization(data: OrganizationDTO): Promise<void> {
    try {
      const sys_id = this.organization?.sys_id || "";
      const savedOrganization =
        sys_id.length > 0
          ? await api.organizationTable.update(sys_id, { ...data, sys_id })
          : await api.organizationTable.create(data);
      this.setOrganization(savedOrganization);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        organization: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving organization info ${error}`);
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

  @Action({ rawError: true })
  async loadCurrentContract(): Promise<CurrentContractDTO> {
    try {
      await this.ensureInitialized();
      const sys_id = this.currentContract?.sys_id || "";

      if (sys_id.length > 0) {
        const currentContractData = await api.currentContractTable.retrieve(
          sys_id as string
        );
        this.setCurrentContract(currentContractData);
        this.setAcquisitionPackage({
          ...this.acquisitionPackage,
          current_contract: sys_id,
        } as AcquisitionPackageDTO);
      }
      return this.currentContract as CurrentContractDTO;
    } catch (error) {
      throw new Error(`error occurred loading current contract info ${error}`);
    }
  }

  @Action({ rawError: true })
  /**
   * Saves Current Contract data to backend
   */
  async saveCurrentContract(data: CurrentContractDTO): Promise<void> {
    try {
      const sys_id = this.currentContract?.sys_id || "";
      const savedCurrentContract =
        sys_id.length > 0
          ? await api.currentContractTable.update(sys_id, { ...data, sys_id })
          : await api.currentContractTable.create(data);
      this.setCurrentContract(savedCurrentContract);
      this.setAcquisitionPackage({
        ...this.acquisitionPackage,
        current_contract: sys_id,
      } as AcquisitionPackageDTO);
    } catch (error) {
      throw new Error(`error occurred saving current contract info ${error}`);
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
