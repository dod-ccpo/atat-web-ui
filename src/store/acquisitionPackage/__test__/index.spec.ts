/* eslint-disable indent */
/* eslint-disable camelcase */
import Vuex, { Store } from "vuex";
import { AcquisitionPackageStore, ATAT_ACQUISTION_PACKAGE_KEY, getStoreDataTableProperty, 
  saveSessionData} from "..";
import { getModule } from "vuex-module-decorators";
import {
  AcquisitionPackageDTO,
  ContactDTO,
  ContractConsiderationsDTO,
  CurrentContractDTO,
  EnvironmentInstanceDTO,
  FairOpportunityDTO,
  FundingRequestDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  RequiredServicesDTO,
  SensitiveInformationDTO,
} from "@/api/models";
import { SelectData } from "types/Global";
import { SessionData } from "../models";
import { StoreProperties } from "../storeproperties";

jest.mock("@/api", () => ({
  ...jest.requireActual("@/api"),
  acquisitionPackageTable: {
    create: (): Promise<AcquisitionPackageDTO> => {
      return new Promise((resolve) =>
        resolve({
          sys_id: "acquisitionPackage_1234556677",
          status: "",
          number: "",
          project_overview: "",
          organization: organization.sys_id || "",
          contact: "",
          fair_opportunity: "",
          current_contract: "",
          docusign_envelope_id: "",
          sensitive_information: "",
          period_of_performance: "",
          periods: "",
          gfe_overview: "",
          contract_type: "",
          requirements_const_estimate: "",
          contract_considerations: "",
          funding_plans: "",
          funding_request: "",
          classification_level: "",
          required_services: "",
          current_environment: "",
          environment_instance: "",
        })
      );
    },
    update: (
      sysId: string,
      data: AcquisitionPackageDTO
    ): Promise<AcquisitionPackageDTO> => {
      return new Promise((resolve) => resolve(data));
    },
  },
  sensitiveInformationTable: {
    create: ():Promise<SensitiveInformationDTO> => {

      return new Promise(resolve=> resolve(
        sensitiveInformation
      ));
    },
    update: (
      sysId: string,
      data: SensitiveInformationDTO
    ): Promise<SensitiveInformationDTO> => {
      return new Promise((resolve) => resolve(data));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    retrieve: (sysId: string): Promise<SensitiveInformationDTO> => {
       return new Promise((resolve)=> resolve (sensitiveInformation));
    }
  },
  contractConsiderationsTable: {
    create: ():Promise<ContractConsiderationsDTO> => {

      return new Promise(resolve=> resolve(
        contractConsiderations
      ));
    },
    update: (
      sysId: string,
      data: ContractConsiderationsDTO
    ): Promise<ContractConsiderationsDTO> => {
      return new Promise((resolve) => resolve(data));
    },
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retrieve: (sysId: string): Promise<ContractConsiderationsDTO> => {
     return new Promise((resolve)=> resolve (contractConsiderations));
  }},
  contactsTable: {
    create: (): Promise<ContactDTO> => {
      
      return new Promise(resolve=> resolve(
     {
          type: "",
          role: "",
          rank_components: "",
          salutation: "",
          first_name: "",
          last_name: "",
          middle_name: "",
          suffix: "",
          title: "",
          phone: "",
          phone_extension: "",
          email: "",
          grade_civ: "",
          dodaac: "",
          can_access_package: "",
          manually_entered: "",
          sys_id:"contact_123456"
        } 
      ))
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    retrieve: (sysId: string): Promise<ContactDTO> => {
      return new Promise((resolve)=> resolve (contact));
   }},
   update: (
    sysId: string,
    data: ContactDTO
  ): Promise<ContactDTO> => {
    return new Promise((resolve) => resolve(data));
  },
  }
));

jest.mock("@/store/attachments");
jest.mock("@/store/contactData");
jest.mock("@/store/descriptionOfWork");
jest.mock("@/store/financialDetails");
jest.mock("@/store/portfolio");
jest.mock("@/store/organizationData");
jest.mock("@/store/taskOrder");
jest.mock("@/store/periods");

const currentContract: CurrentContractDTO = {
  current_contract_exists: "",
  incumbent_contractor_name: "",
  contract_number: "1234567",
  task_delivery_order_number: "",
  contract_order_expiration_date: "",
};

const projectOverview: ProjectOverviewDTO = {
  sys_id: "123u5u5u4u5",
  title: "TestOverview",
  scope: "",
  emergency_declaration: "",
};

const organization: OrganizationDTO = {
  country: "",
  address_type: "",
  city: "",
  dodaac: "",
  street_address_1: "",
  street_address_2: "",
  zip_code: "",
  sys_id: "organization_123456",
  disa_organization: "",
  organization_name: "",
  service_agency: "",
  state: "",
};

const contractType = {
  firm_fixed_price: "",
  time_and_materials: "",
  contract_type_justification: "",
};

const contact = {
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

const contractConsiderations: ContractConsiderationsDTO = {
  packaging_shipping_other: "false",
  contractor_required_training: "",
  packaging_shipping_other_explanation: "",
  conflict_of_interest_explanation: "",
  potential_conflict_of_interest: "",
  required_training_courses: "",
  packaging_shipping_none_apply: "false",
  contractor_provided_transfer: "false",
  sys_id: "contract_considerations_123455"
};

const initialFairOpportunity = {
  exception_to_fair_opportunity: "",
};

const initialGFE = {
  dpas_unit_identification_code: "",
  gfe_gfp_furnished: "",
  dpas_custodian_number: "",
  property_accountable: "",
  property_custodian_name: "",
};

const periodOfPerformance = {
  pop_start_request: "",
  requested_pop_start_date: "",
  time_frame: "",
  recurring_requirement: "",
  base_and_options: "",
  sys_id: "periodofperformance_12345678",
};

const sensitiveInformation = {
  sys_id: "sensativeInformation_123456",
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
};

const classificationLevel = {
  impact_level: "",
  classification: "",
  sys_id: "classificationLevel123456",
};

const initialCurrentEnvironment = () => {
  return {
    current_environment_exists: "",
    environment_instances: "",
    additional_information: "",
  };
};

describe("Acquistition Packages Store", () => {
  let AcquisitionStore: AcquisitionPackageStore;

  beforeAll(() => {
    console.log = jest.fn;
  });

  beforeEach(() => {
    const createStore = (
      storeOptions: any = {}
    ): Store<{ AcquisitionStore: any }> => new Vuex.Store({ ...storeOptions });
    AcquisitionStore = getModule(AcquisitionPackageStore, createStore());
  });
  test("Test Initialized ", async () => {
   await AcquisitionStore.initialize();
    expect(AcquisitionStore.initialized).toBe(true);
  });

  test("Test ensure modules initialized", async () => {
    await AcquisitionStore.initializeModules();
    expect(AcquisitionStore.modules_initialized).toBe(true);
  });

  test("Test Initialized Sets Store Data", async () => {
    await AcquisitionStore.initialize();
    expect(AcquisitionStore.initialized).toBe(true);
    const storeData = sessionStorage.getItem(ATAT_ACQUISTION_PACKAGE_KEY);
    await AcquisitionStore.initialize();
    expect(storeData?.length).toBeGreaterThan(0);
  });

  //  test("Test Initialized Should throw error when API calls fails", async () => {
  //      api.acquisitionPackageTable.create = 
  //      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //      (data?:AcquisitionPackageDTO | undefined)=>
  //       {return new Promise(reject=>{throw new Error('')});}
  //       sessionStorage.clear();
  //       expect(async ()=> {
  //         await AcquisitionStore.initialize();
  //       }).toThrow();

  //  });
 

  test("Test setCurrentContract", () => {
    AcquisitionStore.setCurrentContract(currentContract);
    expect(AcquisitionStore.currentContract).toStrictEqual(currentContract);
  });

  test("Test setProjectOverview", () => {
    AcquisitionStore.setProjectOverview(projectOverview);
    expect(AcquisitionStore.projectOverview).toBe(projectOverview);
  });

  test("Test setOrganization", () => {
    AcquisitionStore.setOrganization(organization);
    expect(AcquisitionStore.organization).toBe(organization);
  });

  test("Test setSenstiveInformation", () => {
    AcquisitionStore.setSensitiveInformation(sensitiveInformation);
    expect(AcquisitionStore.sensitiveInformation).toStrictEqual(sensitiveInformation);
  });

  test("Test doSetSelectedServiceOrAgency", () => {
    const data:SelectData = {
       value: "value",
       text: "Text"

    };

    AcquisitionStore.doSetSelectedServiceOrAgency(data);
    expect(AcquisitionStore.selectedServiceOrAgency).toStrictEqual(data);
  });

  test("Test setSelectedServiceOrAgency", async () => {
    const data:SelectData = {
       value: "value",
       text: "Text"

    };

    await AcquisitionStore.setSelectedServiceOrAgency(data);
    expect(AcquisitionStore.selectedServiceOrAgency).toStrictEqual(data);
  });

  test("Test doSetSelectedContactBranch", () => {
    const data:SelectData = {
       value: "value",
       text: "Text"

    };

    AcquisitionStore.doSetSelectedContactBranch(data);
    expect(AcquisitionStore.selectedContactBranch).toStrictEqual(data);
  });

  test("Test setSelectedContactBranch", async () => {
    const data:SelectData = {
       value: "value",
       text: "Text"

    };

    await AcquisitionStore.setSelectedContactBranch(data);
    expect(AcquisitionStore.selectedContactBranch).toStrictEqual(data);
  });





  test("Test setPeriodofPerformance", () => {
    AcquisitionStore.setPeriodOfPerformance(periodOfPerformance);
    expect(AcquisitionStore.periodOfPerformance).toStrictEqual(periodOfPerformance);
  });

  test("Test setClassificationLevel", () => {
    AcquisitionStore.setClassificationLevel(classificationLevel);
    expect(AcquisitionStore.classificationLevel).toBe(classificationLevel);
  });

  test("Test setContactConsiderations", () => {
    AcquisitionStore.setContractConsiderations(contractConsiderations);
    expect(AcquisitionStore.contractConsiderations).toStrictEqual(
      contractConsiderations
    );
  });

  test("Test setProjectTitle", () => {
    AcquisitionStore.setProjectOverview(projectOverview);
    AcquisitionStore.setProjectTitle("TestTitle");
    expect(AcquisitionStore).not.toBeNull();
    expect(AcquisitionStore.projectOverview?.title).toBe("TestTitle");
  });

  test("Test setContractType", () => {
    AcquisitionStore.setContractType(contractType);
    expect(AcquisitionStore.contractType).toStrictEqual(contractType);
  });

  test("Test setClassficiationLevel", () => {
    AcquisitionStore.setClassificationLevel(classificationLevel);
    expect(AcquisitionStore.classificationLevel).toStrictEqual(classificationLevel);
  });

  test("Test setBasePop", () => {
    AcquisitionStore.setBasePoPDuration(2);
    expect(AcquisitionStore.totalBasePoPDuration).toStrictEqual(2);
  });

  test("Test setHasAltCor", () => {
    AcquisitionStore.setHasAlternateCOR(true);
    expect(AcquisitionStore.hasAlternativeContactRep).toStrictEqual(true);
  });

  test("Test setGFEOverview", () => {
    const gfe_overview = {
      dpas_unit_identification_code: "",
      gfe_gfp_furnished: "",
      dpas_custodian_number: "",
      property_accountable: "",
      property_custodian_name: "",
    };

    AcquisitionStore.setGFEOverview(gfe_overview);
    expect(AcquisitionStore.gfeOverview).toStrictEqual(gfe_overview);
  });

  
  test("Test setContact", () => {
    const data:ContactDTO ={
      type: "",
      role: "",
      rank_components: "",
      salutation: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      title: "",
      phone: "",
      phone_extension: "",
      email: "",
      grade_civ: "",
      dodaac: "",
      can_access_package: "",
      manually_entered: "",
      sys_id: "contact_123456"
    } 
    AcquisitionStore.setContact({ data:data, type: "Mission Owner"});
    expect(AcquisitionStore.contactInfo).toStrictEqual(data);
  });


  test("Test setDataFromSession", async () => {
    const acquisitionPackage: AcquisitionPackageDTO = {
      status: "",
      number: "",
      project_overview: "",
      organization: "",
      contact: "",
      fair_opportunity: "",
      current_contract: "",
      docusign_envelope_id: "",
      sensitive_information: "",
      period_of_performance: "",
      periods: "",
      gfe_overview: "",
      contract_type: "",
      requirements_const_estimate: "",
      contract_considerations: "",
      funding_plans: "",
      funding_request: "",
      classification_level: "",
      required_services: "",
      current_environment: "",
      environment_instance: "",
    };

    const acorInfo: ContactDTO = {
      type: "",
      role: "",
      rank_components: "",
      salutation: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      title: "",
      phone: "",
      phone_extension: "",
      email: "",
      grade_civ: "",
      dodaac: "",
      can_access_package: "",
      manually_entered: "",
    };

    const contactData: ContactDTO = {
      type: "",
      role: "",
      rank_components: "",
      salutation: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      title: "",
      phone: "",
      phone_extension: "",
      email: "",
      grade_civ: "",
      dodaac: "",
      can_access_package: "",
      manually_entered: "",
    };

    const fairOpportunity: FairOpportunityDTO = {
      exception_to_fair_opportunity: "",
    };

    const projectOverview: ProjectOverviewDTO = {
      title: "",
      scope: "",
      emergency_declaration: "",
    };

    const requiredServices: RequiredServicesDTO = {
      usage_description: "",
      applicable_classification_levels: "",
      need_for_entire_to_duration: "",
      applicable_periods: "",
      select_service_offerings: "",
      other_service_offering: "",
    };

    const environmentInstance: EnvironmentInstanceDTO = {
      storage_amount: "",
      storage_type: "",
      instance_name: "",
      classification_level: "",
      number_of_vcpus: "",
      data_egress_monthly_amount: "",
      performance_tier: "",
      pricing_model_expiration: "",
      csp_region: "",
      memory_unit: "",
      storage_unit: "",
      pricing_model: "",
      instance_location: "",
      memory_amount: "",
      operating_system_licensing: "",
      data_egress_monthly_unit: "",
    };

    const sessionData: SessionData = {
      acquisitionPackage: acquisitionPackage,
      acorInfo: acorInfo,
      classificationLevel: classificationLevel,
      contactInfo: contactData,
      contractConsiderations: {},
      corInfo: acorInfo,
      contractType: contractType,
      currentContract: currentContract,
      fairOpportunity: fairOpportunity,
      gfeOverview: {},
      organization: {},
      periodOfPerformance: {},
      periods: "",
      projectOverview: projectOverview,
      requiredServices: requiredServices,
      requirementsCostEstimate: {},
      sensitiveInformation: {},
      currentEnvironment: {},
      environmentInstance: environmentInstance,
    };

    AcquisitionStore.setDataFromSession(sessionData);
    expect(AcquisitionStore.acquisitionPackage).toBe(acquisitionPackage);
  });

  test("Test setRequirementsCostEstimate", () => {
    const rce= { surge_capabilities: "", estimatedTaskOrderValue: "" };
    AcquisitionStore.setRequirementsCostEstimate(rce);
    expect(AcquisitionStore.requirementsCostEstimate).toStrictEqual(rce);
  });

  test("Test setCurrentEnvironment", () => {
    AcquisitionStore.setCurrentEnvironment(initialCurrentEnvironment());
    expect(AcquisitionStore.currentEnvironment).toStrictEqual(initialCurrentEnvironment());
  });

  test("Test saveAcquisitionPackage", async () => {
    const acquisitionPackage: AcquisitionPackageDTO = {
      sys_id: "acquisitionPackage_1234556677",
      status: "",
      number: "",
      project_overview: "",
      organization: "",
      contact: "",
      fair_opportunity: "",
      current_contract: "",
      docusign_envelope_id: "",
      sensitive_information: "",
      period_of_performance: "",
      periods: "",
      gfe_overview: "",
      contract_type: "",
      requirements_const_estimate: "",
      contract_considerations: "",
      funding_plans: "",
      funding_request: "",
      classification_level: "",
      required_services: "",
      current_environment: "",
      environment_instance: "",
    };
    await AcquisitionStore.saveAcquisitionPackage(acquisitionPackage);
    expect(AcquisitionStore.acquisitionPackage).toBe(acquisitionPackage);
  });

  test("Test initializeFromSession", async () => {
    const acquisitionPackage: AcquisitionPackageDTO ={
      sys_id: "acquisitionPackage_1234556677",
      status: "",
      number: "",
      project_overview: "",
      organization: "",
      contact: "",
      fair_opportunity: "",
      current_contract: "",
      docusign_envelope_id: "",
      sensitive_information: "",
      period_of_performance: "",
      periods: "",
      gfe_overview: "",
      contract_type: "",
      requirements_const_estimate: "",
      contract_considerations: "",
      funding_plans: "",
      funding_request: "",
      classification_level: "",
      required_services: "",
      current_environment: "",
      environment_instance: "",
    };

    const acorInfo: ContactDTO = {
      type: "",
      role: "",
      rank_components: "",
      salutation: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      title: "",
      phone: "",
      phone_extension: "",
      email: "",
      grade_civ: "",
      dodaac: "",
      can_access_package: "",
      manually_entered: "",
    };

    const contactData: ContactDTO = {
      type: "",
      role: "",
      rank_components: "",
      salutation: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      title: "",
      phone: "",
      phone_extension: "",
      email: "",
      grade_civ: "",
      dodaac: "",
      can_access_package: "",
      manually_entered: "",
    };

    const fairOpportunity: FairOpportunityDTO = {
      exception_to_fair_opportunity: "",
    };

    const projectOverview: ProjectOverviewDTO = {
      title: "",
      scope: "",
      emergency_declaration: "",
    };

    const requiredServices: RequiredServicesDTO = {
      usage_description: "",
      applicable_classification_levels: "",
      need_for_entire_to_duration: "",
      applicable_periods: "",
      select_service_offerings: "",
      other_service_offering: "",
    };

    const environmentInstance: EnvironmentInstanceDTO = {
      storage_amount: "",
      storage_type: "",
      instance_name: "",
      classification_level: "",
      number_of_vcpus: "",
      data_egress_monthly_amount: "",
      performance_tier: "",
      pricing_model_expiration: "",
      csp_region: "",
      memory_unit: "",
      storage_unit: "",
      pricing_model: "",
      instance_location: "",
      memory_amount: "",
      operating_system_licensing: "",
      data_egress_monthly_unit: "",
    };

    const sessionData: SessionData = {
      acquisitionPackage: acquisitionPackage,
      acorInfo: acorInfo,
      classificationLevel: classificationLevel,
      contactInfo: contactData,
      contractConsiderations: {},
      corInfo: acorInfo,
      contractType: contractType,
      currentContract: currentContract,
      fairOpportunity: fairOpportunity,
      gfeOverview: {},
      organization: {},
      periodOfPerformance: {},
      periods: "",
      projectOverview: projectOverview,
      requiredServices: requiredServices,
      requirementsCostEstimate: {},
      sensitiveInformation: {},
      currentEnvironment: {},
      environmentInstance: environmentInstance,
    };

    saveSessionData(AcquisitionStore);
    await AcquisitionStore.initialize();
    expect(AcquisitionStore.acquisitionPackage).toStrictEqual(
      acquisitionPackage
    );
  });

  test("Test getPackageData", async ()=>{
     AcquisitionStore.setInitialized(false);
     sessionStorage.clear();
      const org = await AcquisitionStore.
      getPackageData<OrganizationDTO>({property : 'organization'}); 
      expect(org).toBe(organization.sys_id);
      
  });

  test("Test setStoreData", async ()=>{
    await AcquisitionStore.initialize();
    AcquisitionStore.setStoreData({data: organization, 
      storeProperty: StoreProperties.Organization});
     const org = getStoreDataTableProperty('organization', AcquisitionStore);
     expect(org).toBe(organization);
     
 });


  test("Test getStoreProperty", async ()=>{
    await AcquisitionStore.initialize();
    AcquisitionStore.setOrganization(organization);
     const org = getStoreDataTableProperty('organization', AcquisitionStore);
     expect(org).toBe(organization);
     
 });

 test("Test loadStoreData", async ()=>{
  await AcquisitionStore.initialize();
  AcquisitionStore.setSensitiveInformation(sensitiveInformation)
  const data = await AcquisitionStore.
  loadData<SensitiveInformationDTO>({storeProperty: StoreProperties.SensitiveInformation});
  expect(data).toBe(sensitiveInformation);
});

test("Test saveStoreData", async ()=>{
  await AcquisitionStore.initialize();
  await AcquisitionStore.saveData<SensitiveInformationDTO>({data: sensitiveInformation, 
    storeProperty: StoreProperties.SensitiveInformation});
  expect(AcquisitionStore.sensitiveInformation).toBe(sensitiveInformation);
});

 test("Test getStoreProperty_ShouldErrorForNoneExistentProperty", async ()=>{
  await AcquisitionStore.initialize();
  expect(() => {
    const org = getStoreDataTableProperty('o', AcquisitionStore);
  }).toThrow(new Error(`unable to locate store property : o`));
});


  test("Test setPackageFundingRequest", async ()=>{
    
    await AcquisitionStore.initialize();

    const fundingRequest: FundingRequestDTO = {
      fs_form: "",
      funding_request_type: "",
      mipr: "",
      sys_id: "fundingRequest_123456"
    }

    await AcquisitionStore.setPackageFundingRequest(fundingRequest);
    expect(AcquisitionStore.acquisitionPackage?.funding_request).toBe(fundingRequest.sys_id);

 });

 test("Test loadSensativeInformation", async ()=>{
  await AcquisitionStore.initialize();
  AcquisitionStore.setSensitiveInformation(sensitiveInformation);
  await AcquisitionStore.loadSensitiveInformation();
  expect(AcquisitionStore.sensitiveInformation).toStrictEqual(sensitiveInformation);

});
test("Test saveSensativeInformation", async ()=>{
  await AcquisitionStore.initialize();
  await AcquisitionStore.saveSensitiveInformation(sensitiveInformation);
  expect(AcquisitionStore.sensitiveInformation).toStrictEqual(sensitiveInformation);

});

test("Test loadContractConsiderations", async ()=>{
  await AcquisitionStore.initialize();
  AcquisitionStore.setContractConsiderations(contractConsiderations);
  await AcquisitionStore.loadContractConsiderations();
  expect(AcquisitionStore.contractConsiderations).toStrictEqual(contractConsiderations);

});
test("Test saveContractConsiderations", async ()=>{
  await AcquisitionStore.initialize();
  await AcquisitionStore.saveContractConsiderations(contractConsiderations);
  expect(AcquisitionStore.contractConsiderations).toStrictEqual(contractConsiderations);

});

test("Test saveContactInfo", async ()=>{
  await AcquisitionStore.initialize();
  const data:ContactDTO ={
    type: "",
    role: "",
    rank_components: "",
    salutation: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    title: "",
    phone: "",
    phone_extension: "",
    email: "",
    grade_civ: "",
    dodaac: "",
    can_access_package: "",
    manually_entered: "",
    sys_id:"contact_123456"
  } 
  await AcquisitionStore.saveContactInfo({ data:data, type: "Mission Owner"});
  expect(AcquisitionStore.contactInfo).toStrictEqual(data);

});

test("Test loadContactInfo", async ()=>{
  await AcquisitionStore.initialize();
  const data:ContactDTO ={
    type: "",
    role: "",
    rank_components: "",
    salutation: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    title: "",
    phone: "",
    phone_extension: "",
    email: "",
    grade_civ: "",
    dodaac: "",
    can_access_package: "",
    manually_entered: ""
  } 
  AcquisitionStore.setContact({ data:data, type: "Mission Owner"});
  expect(AcquisitionStore.contactInfo).toStrictEqual(data);
  await AcquisitionStore.loadContactInfo("");
  expect(AcquisitionStore.contactInfo).toStrictEqual(contact);

});




});
