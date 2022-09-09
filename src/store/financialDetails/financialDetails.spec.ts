/* eslint-disable camelcase */
import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { FinancialDetailsStore } from ".";
import { getModule } from "vuex-module-decorators";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { FundingRequestDTO, FundingRequestFSFormDTO } from "@/api/models";
import { FundingRequestFSFormApi } from "@/api/fundingRequestFSForm";

jest.mock("@/store/acquisitionPackage", () => ({
  ...jest.requireActual("@/store/acquisitionPackage"),
  acquisitionPackage: {
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
  },
  saveAcquisitionPackage : jest.fn
}));


describe("Financial Detials Store", () => {
  let FinancialDetails: FinancialDetailsStore;
  
  beforeAll(() => {
    console.log = jest.fn;
  });
  
  beforeEach(() => {
    const createStore = (
      storeOptions: any = {}
    ): Store<{ FinancialDetails: any }> => new Vuex.Store({ ...storeOptions });
    FinancialDetails = getModule(FinancialDetailsStore, createStore());
      
  });

  test("Test ensureInitialized ", () => {
    FinancialDetails.ensureInitialized();
    expect(FinancialDetails.initialized).toBe(false);
  });

  test('Test updateAcquisitionPackageFundingRequest', async ()=> {
    const frf: FundingRequestFSFormDTO = {
      fs_form_7600a_filename: "",
      fs_form_7600a_attachment: "",
      fs_form_7600b_attachment: "",
      fs_form_7600b_filename: "",
      use_g_invoicing: "",
      order_number: "",
      gt_c_number: "",
      sys_id: 'fsf_123455'
    }
    await FinancialDetails.updateAcquisitionPackageFundingRequest(frf);
    expect(AcquisitionPackage.acquisitionPackage?.funding_request).toBe(frf.sys_id);
  });

});
