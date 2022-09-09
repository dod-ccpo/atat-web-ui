/* eslint-disable indent */
/* eslint-disable camelcase */
import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { AcquisitionPackageStore, saveSessionData } from "..";
import { getModule } from "vuex-module-decorators";
import {
    AcquisitionPackageDTO,
  ClassificationLevelDTO,
  ContactDTO,
  CurrentContractDTO,
  EnvironmentInstanceDTO,
  FairOpportunityDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
  RequiredServicesDTO,
} from "@/api/models";
import { SessionData } from "../models";
import { AcquisitionPackagesApi } from "@/api/acquisitionPackages";
import { ClassificationLevelApi } from "@/api/classificationLevels";
import ContactData from "@/store/contactData";
import { FairOpportunityApi } from "@/api/fairOpportunity";
import exp from "constants";
import api from "@/api";

jest.mock('@/api', () => ({
    ...jest.requireActual('@/api'),
    acquisitionPackageTable: {
        create: ():Promise<AcquisitionPackageDTO>=>{
            
            return new Promise(resolve=>{
                 return {
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
                    environment_instance: ""
                }
            })
     },
        update:(sysId: string, data: AcquisitionPackageDTO): Promise<AcquisitionPackageDTO>=>{

             return new Promise(resolve=> data);
        }
        }
  }));

jest.mock('@/store/attachments');
jest.mock('@/store/contactData');
jest.mock('@/store/descriptionOfWork');
jest.mock('@/store/financialDetails');
jest.mock('@/store/portfolio');
jest.mock("@/store/organizationData");


//   await ContactData.initialize();
//   await OrganiationData.initialize();
//   await DescriptionOfWork.initialize();
//   await Attachments.initialize();
//   await FinancialDetails.initialize();
//   await Portfolio.initialize()

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

const contractConsiderations = {
  packaging_shipping_other: "false",
  contractor_required_training: "",
  packaging_shipping_other_explanation: "",
  conflict_of_interest_explanation: "",
  potential_conflict_of_interest: "",
  required_training_courses: "",
  packaging_shipping_none_apply: "false",
  contractor_provided_transfer: "false",
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

    // sessionStorage = new MockSessionStorage();
    api.acquisitionPackageTable.update = jest.fn((sys_id: string, 
        acquisition: AcquisitionPackageDTO)=> new Promise(()=>{
            return acquisition;
        }));
    });

  beforeEach(() => {
    const createStore = (
      storeOptions: any = {}
    ): Store<{ AcquisitionStore: any }> => new Vuex.Store({ ...storeOptions });
    AcquisitionStore = getModule(AcquisitionPackageStore, createStore());
    // AcquisitionStore.initializeModules = jest.fn();
  });
  test("Test ensureInitialized ", () => {
    AcquisitionStore.ensureInitialized();
    expect(AcquisitionStore.initialized).toBe(false);
  });

  test("Test setCurrentContract", () => {
    AcquisitionStore.setCurrentContract(currentContract);
    expect(AcquisitionStore.currentContract).toBe(currentContract);
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
    expect(AcquisitionStore.sensitiveInformation).toBe(sensitiveInformation);
  });

  test("Test setPeriods", () => {
    AcquisitionStore.setPeriodOfPerformance(periodOfPerformance);
    expect(AcquisitionStore.periodOfPerformance).toBe(periodOfPerformance);
  });

  test("Test setClassificationLevel", () => {
    AcquisitionStore.setClassificationLevel(classificationLevel);
    expect(AcquisitionStore.classificationLevel).toBe(classificationLevel);
  });

  test("Test setContactConsiderations", () => {
    AcquisitionStore.setContractConsiderations(contractConsiderations);
    expect(AcquisitionStore.contractConsiderations).toBe(
      contractConsiderations
    );
  });

  test("Test setContactConsiderations", () => {
    AcquisitionStore.setContractConsiderations(contractConsiderations);
    expect(AcquisitionStore.contractConsiderations).toBe(
      contractConsiderations
    );
  });

  test("Test setProjectTitle", () => {
    AcquisitionStore.setProjectTitle("TestTitle");
    expect(AcquisitionStore.projectTitle).toBe(
      "TestTitle"
    );

  });

  test("Test setContractType", () => {
    AcquisitionStore.setContractType(contractType);
    expect(AcquisitionStore.contractType).toBe(
      contractType
    );
  });

  test("Test setDataFromSession", async ()=> {

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
          environment_instance: ""
      }

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
          manually_entered: ""
      }

      const contactData:ContactDTO = {
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

      const fairOpportunity: FairOpportunityDTO = {
          exception_to_fair_opportunity: ""
      }

      const projectOverview: ProjectOverviewDTO = {
          title: "",
          scope: "",
          emergency_declaration: ""
      }

      const requiredServices: RequiredServicesDTO = {
          usage_description: "",
          applicable_classification_levels: "",
          need_for_entire_to_duration: "",
          applicable_periods: "",
          select_service_offerings: "",
          other_service_offering: ""
      }

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
          data_egress_monthly_unit: ""
      }
      
      const sessionData: SessionData=  {
          acquisitionPackage:  acquisitionPackage,
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
          environmentInstance: environmentInstance
      }

      AcquisitionStore.setDataFromSession(sessionData);
      expect(AcquisitionStore.acquisitionPackage).toBe(acquisitionPackage);
      
  })

  
//   test("Test saveAcquisitionPackage", async () => {
   
//     const acquisitionPackage: AcquisitionPackageDTO = {
//         sys_id: "acquisitionPackage_1234556677",
//         status: "",
//         number: "",
//         project_overview: "",
//         organization: "",
//         contact: "",
//         fair_opportunity: "",
//         current_contract: "",
//         docusign_envelope_id: "",
//         sensitive_information: "",
//         period_of_performance: "",
//         periods: "",
//         gfe_overview: "",
//         contract_type: "",
//         requirements_const_estimate: "",
//         contract_considerations: "",
//         funding_plans: "",
//         funding_request: "",
//         classification_level: "",
//         required_services: "",
//         current_environment: "",
//         environment_instance: ""
//     }
//     await AcquisitionStore.saveAcquisitionPackage(acquisitionPackage);
//     expect(AcquisitionStore.acquisitionPackage).toBe(acquisitionPackage);
//   });


test("Test initializeFromSession", async ()=> {

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
        environment_instance: ""
    }

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
        manually_entered: ""
    }

    const contactData:ContactDTO = {
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

    const fairOpportunity: FairOpportunityDTO = {
        exception_to_fair_opportunity: ""
    }

    const projectOverview: ProjectOverviewDTO = {
        title: "",
        scope: "",
        emergency_declaration: ""
    }

    const requiredServices: RequiredServicesDTO = {
        usage_description: "",
        applicable_classification_levels: "",
        need_for_entire_to_duration: "",
        applicable_periods: "",
        select_service_offerings: "",
        other_service_offering: ""
    }

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
        data_egress_monthly_unit: ""
    }
    
    const sessionData: SessionData=  {
        acquisitionPackage:  acquisitionPackage,
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
        environmentInstance: environmentInstance
    }

    saveSessionData(AcquisitionStore);
    await AcquisitionStore.initialize();
    expect(AcquisitionStore.acquisitionPackage).toStrictEqual(acquisitionPackage);
    
})

});
