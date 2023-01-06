/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {FinancialDetailsStore} from "@/store/financialDetails/index";
import {
  FundingRequestDTO,
  FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO
} from "@/api/models";
import {api} from "@/api";
jest.mock('@/store/helpers')

const localVue = createLocalVue();
localVue.use(Vuex);

describe("FinancialDetails Store",
  () => {
    let financialDetailsStore: FinancialDetailsStore;
    let fundingRequest: FundingRequestDTO;
    let fundingRequestFSFormDTO: FundingRequestFSFormDTO
    let fundingRequestMIPRFormDTO: FundingRequestMIPRFormDTO

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ financialDetails: any }> => new Vuex.Store({...storeOptions});
      financialDetailsStore = getModule(FinancialDetailsStore, createStore());
      fundingRequest = {
        fs_form: "", funding_request_type: "", mipr: ""
      }
      fundingRequestFSFormDTO = {
        fs_form_7600a_filename: "Test 7600",
        fs_form_7600a_attachment: "123",
        fs_form_7600b_attachment: "",
        fs_form_7600b_filename: "",
        use_g_invoicing: "",
        order_number: "",
        gt_c_number: ""
      }
      fundingRequestMIPRFormDTO = {
        mipr_number: "A12",
        mipr_filename: "Test MIPR",
        mipr_attachment: ""
      }
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })

    it('Test setInitialized()- sets initialized to true', async () => {
      await financialDetailsStore.initialize();
      expect(financialDetailsStore.initialized).toBe(true)
    })

    it('Test ensureInitialized()- should call initialize function', async () => {
      jest.spyOn(financialDetailsStore, "initialize");
      await financialDetailsStore.ensureInitialized();
      expect(financialDetailsStore.initialize).toHaveBeenCalled();
    })

    it('Test loadFundingRequestFSForm()- should load req cost estimate from api', async () => {
      jest.spyOn(api.fundingRequestFSFormTable, "create")
        .mockImplementation((): Promise<FundingRequestFSFormDTO> => {
          return Promise.resolve(fundingRequestFSFormDTO)
        })
      jest.spyOn(financialDetailsStore, "loadFundingRequest")
        .mockImplementation((): Promise<void> => {
          return Promise.resolve()
        })
      jest.spyOn(financialDetailsStore, "saveFundingRequestToDISA")
        .mockImplementation((): Promise<FundingRequestDTO> => {
          return Promise.resolve(fundingRequest)
        })
      financialDetailsStore.setFundingRequest(fundingRequest);
      financialDetailsStore.setFundingRequestFSForm(null as unknown as FundingRequestFSFormDTO);
      await financialDetailsStore.loadFundingRequestFSForm();
      expect(api.fundingRequestFSFormTable.create).toHaveBeenCalled();
    })

    it('Test loadFundingRequestFSForm()- should catch the error', async () => {
      financialDetailsStore.setFundingRequestFSForm(fundingRequestFSFormDTO);
      jest.spyOn(api.fundingRequestFSFormTable, "retrieve").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(financialDetailsStore, "setFundingRequestFSForm");
      try {
        await financialDetailsStore.loadFundingRequestFSForm();
      } catch {
        await expect(financialDetailsStore.setFundingRequestFSForm).not.toHaveBeenCalled();
      }
    })

    it('Test loadFundingRequestMIPRForm()- should load req cost estimate from api', async () => {
      jest.spyOn(api.fundingRequestMIPRFormTable, "create")
        .mockImplementation((): Promise<FundingRequestMIPRFormDTO> => {
          return Promise.resolve(fundingRequestMIPRFormDTO)
        })
      jest.spyOn(financialDetailsStore, "loadFundingRequest")
        .mockImplementation((): Promise<void> => {
          return Promise.resolve()
        })
      jest.spyOn(financialDetailsStore, "saveFundingRequestToDISA")
        .mockImplementation((): Promise<FundingRequestDTO> => {
          return Promise.resolve(fundingRequest)
        })
      financialDetailsStore.setFundingRequest(fundingRequest);
      financialDetailsStore.setFundingRequestMIPRForm(null as unknown as FundingRequestMIPRFormDTO);
      await financialDetailsStore.loadFundingRequestMIPRForm();
      expect(api.fundingRequestMIPRFormTable.create).toHaveBeenCalled();
    })

    it('Test loadFundingRequestMIPRForm()- should catch the error', async () => {
      financialDetailsStore.setFundingRequestMIPRForm(fundingRequestMIPRFormDTO);
      jest.spyOn(api.fundingRequestMIPRFormTable, "retrieve").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(financialDetailsStore, "setFundingRequestMIPRForm");
      try {
        await financialDetailsStore.loadFundingRequestMIPRForm();
      } catch {
        await expect(financialDetailsStore.setFundingRequestMIPRForm).not.toHaveBeenCalled();
      }
    })
  })
