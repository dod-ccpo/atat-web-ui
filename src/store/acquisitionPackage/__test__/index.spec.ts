/* eslint-disable indent */
/* eslint-disable camelcase */
import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { AcquisitionPackageStore } from "..";
import { getModule } from "vuex-module-decorators";
import {
  CurrentContractDTO,
  OrganizationDTO,
  ProjectOverviewDTO,
} from "@/api/models";

const currentContract: CurrentContractDTO = {
  current_contract_exists: "",
  incumbent_contractor_name: "",
  contract_number: "1234567",
  task_delivery_order_number: "",
  contract_order_expiration_date: "",
};

const projectOverview: ProjectOverviewDTO = {
  sys_id: "123u5u5u4u5",
  title: "",
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

describe("Classification Requirements Store", () => {
  let AcquisitionStore: AcquisitionPackageStore;

  beforeAll(() => {
    console.log = jest.fn;

    // sessionStorage = new MockSessionStorage();
  });

  beforeEach(() => {
    const createStore = (
      storeOptions: any = {}
    ): Store<{ AcquisitionStore: any }> => new Vuex.Store({ ...storeOptions });
    AcquisitionStore = getModule(AcquisitionPackageStore, createStore());
    AcquisitionStore.initializeModules = jest.fn();
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
});
