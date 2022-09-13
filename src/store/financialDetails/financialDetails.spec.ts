/* eslint-disable camelcase */
import Vuex, { Store } from "vuex";
import { FinancialDetailsStore } from ".";
import { getModule } from "vuex-module-decorators";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { FundingRequestDTO, FundingRequestFSFormDTO, 
  FundingRequestMIPRFormDTO } from "@/api/models";

const fundingRequest: FundingRequestDTO = {
  fs_form: "",
  funding_request_type: "",
  mipr: "",
  sys_id: "funding_request_123456"
}

const fundingRequestFSForm: FundingRequestFSFormDTO = {
  fs_form_7600a_filename: "",
  fs_form_7600a_attachment: "",
  fs_form_7600b_attachment: "",
  fs_form_7600b_filename: "",
  use_g_invoicing: "",
  order_number: "",
  gt_c_number: "",
  sys_id: "funding_request_fs_form_123455"
}

const fundingRequestMIPRForm: FundingRequestMIPRFormDTO = {
  mipr_number: "",
  mipr_filename: "",
  mipr_attachment: "",
  sys_id: "funding_request_mipr_12345"
}

const buildSnowApITableMock = <TMockDTO>(data: TMockDTO) => ({
  create: (): Promise<TMockDTO> => {
    return new Promise((resolve) => resolve(data));
  },
  update: (sysId: string, data: TMockDTO): Promise<TMockDTO> => {
    return new Promise((resolve) => resolve(data));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retrieve: (sysId: string): Promise<TMockDTO> => {
    return new Promise((resolve) => resolve(data));
  },
});

jest.mock("@/api", () => ({
  ...jest.requireActual("@/api"),
  fundingRequestTable: buildSnowApITableMock<FundingRequestDTO>(fundingRequest),
  fundingRequestFSFormTable: buildSnowApITableMock<FundingRequestFSFormDTO>(fundingRequestFSForm),
  fundingRequestMIPRFormTable: 
  buildSnowApITableMock<FundingRequestMIPRFormDTO>(fundingRequestMIPRForm)
}));

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

  test('Test saveFundingRequest', async ()=>{
    await FinancialDetails.initialize();
    await FinancialDetails.saveFundingRequest(fundingRequest);
    expect(FinancialDetails.fundingRequest).toBe(fundingRequest);
  });

  test('Test loadFundingRequest', async ()=>{
    await FinancialDetails.initialize();
    await FinancialDetails.loadFundingRequest();
    expect(FinancialDetails.fundingRequest).toBe(fundingRequest);
  });
  
  test('Test saveFundingRequestFSForm', async ()=>{
    await FinancialDetails.initialize();
    await FinancialDetails.saveFundingRequestFSForm(fundingRequestFSForm);
    expect(FinancialDetails.fundingRequestFSForm).toBe(fundingRequestFSForm);
  });

  test('Test loadFundingRequestFSForm', async ()=>{
    await FinancialDetails.initialize();
    await FinancialDetails.loadFundingRequestFSForm();
    expect(FinancialDetails.fundingRequestFSForm).toBe(fundingRequestFSForm);
  });

    
  test('Test saveFundingRequesMIPRForm', async ()=>{
    await FinancialDetails.initialize();
    await FinancialDetails.saveFundingRequestMIPRForm(fundingRequestMIPRForm);
    expect(FinancialDetails.fundingRequestMIPRForm).toBe(fundingRequestMIPRForm);
  });

  test('Test loadFundingRequesMIPRForm', async ()=>{
    await FinancialDetails.initialize();
    await FinancialDetails.loadFundingRequestMIPRForm();
    expect(FinancialDetails.fundingRequestMIPRForm).toBe(fundingRequestMIPRForm);
  });

});
