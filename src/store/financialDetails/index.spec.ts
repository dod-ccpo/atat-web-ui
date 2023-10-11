/* eslint-disable camelcase */
import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import { getModule } from "vuex-module-decorators";
import { FinancialDetailsStore } from "@/store/financialDetails/index";
import {
  FundingRequestDTO,
  FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO,
  FundingRequirementDTO,
} from "@/api/models";
import { api } from "@/api";
jest.mock("@/store/helpers");

const localVue = createLocalVue();
localVue.use(Vuex);

describe("FinancialDetails Store", () => {
  let financialDetailsStore: FinancialDetailsStore;
  let fundingRequest: FundingRequestDTO;
  let fundingRequestFSFormDTO: FundingRequestFSFormDTO;
  let fundingRequestMIPRFormDTO: FundingRequestMIPRFormDTO;
  let fundingRequirement: FundingRequirementDTO;

<<<<<<< HEAD
  beforeEach(() => {
    const createStore = (
      storeOptions: any = {}
    ): Store<{ financialDetails: any }> => new Vuex.Store({ ...storeOptions });
    financialDetailsStore = getModule(FinancialDetailsStore, createStore());
    fundingRequest = {
      fs_form: "",
      funding_request_type: "",
      mipr: "",
    };
    fundingRequestFSFormDTO = {
      fs_form_7600a_filename: "Test 7600",
      fs_form_7600a_attachment: "123",
      fs_form_7600a_use_g_invoicing: "",
      fs_form_7600b_attachment: "",
      fs_form_7600b_filename: "",
      fs_form_7600b_use_g_invoicing: "",
      use_g_invoicing: "",
      order_number: "",
      gt_c_number: "",
    };
    fundingRequestMIPRFormDTO = {
      mipr_number: "A12",
      mipr_filename: "Test MIPR",
      mipr_attachment: "",
    };
    fundingRequirement = {
      acquisition_package: "",
      financial_poc: "",
      funding_plan: "",
      funding_request: "",
      funds_obligated: "",
      funds_total: "",
      has_funding: "",
      incrementally_funded: "",
      pop_end_date: "",
      pop_start_date: "",
      sys_created_by: "",
      sys_created_on: "",
      sys_id: "",
      sys_mod_count: "",
      sys_tags: "",
      sys_updated_by: "",
      sys_updated_on: "",
      task_order_number: "",
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
=======
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
        fs_form_7600a_use_g_invoicing: '',
        fs_form_7600b_filename: "",
        fs_form_7600b_attachment: "",
        fs_form_7600b_use_g_invoicing: '',
        use_g_invoicing: "",
        order_number: "",
        gt_c_number: ""
      }
      fundingRequestMIPRFormDTO = {
        mipr_number: "A12",
        mipr_filename: "Test MIPR",
        mipr_attachment: ""
      }
      fundingRequirement = {
        acquisition_package: "",
        financial_poc: "",
        funding_plan: "",
        funding_request: "",
        funds_obligated: "",
        funds_total: "",
        has_funding: "",
        incrementally_funded: "",
        pop_end_date: "",
        pop_start_date: "",
        sys_created_by: "",
        sys_created_on: "",
        sys_id: "",
        sys_mod_count: "",
        sys_tags: "",
        sys_updated_by: "",
        sys_updated_on: "",
        task_order_number: ""
      };
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })
>>>>>>> c8476f437 (added more tests)

  it("Test setInitialized()- sets initialized to true", async () => {
    await financialDetailsStore.initialize();
    expect(financialDetailsStore.initialized).toBe(true);
  });

  it("Test ensureInitialized()- should call initialize function", async () => {
    jest.spyOn(financialDetailsStore, "initialize");
    await financialDetailsStore.ensureInitialized();
    expect(financialDetailsStore.initialize).toHaveBeenCalled();
  });

  it("Test loadFundingRequestFSForm()- should load req cost estimate from api", async () => {
    jest
      .spyOn(api.fundingRequestFSFormTable, "create")
      .mockImplementation((): Promise<FundingRequestFSFormDTO> => {
        return Promise.resolve(fundingRequestFSFormDTO);
      });
    jest
      .spyOn(financialDetailsStore, "loadFundingRequest")
      .mockImplementation((): Promise<void> => {
        return Promise.resolve();
      });
    jest
      .spyOn(financialDetailsStore, "saveFundingRequestToDISA")
      .mockImplementation((): Promise<FundingRequestDTO> => {
        return Promise.resolve(fundingRequest);
      });
    financialDetailsStore.setFundingRequest(fundingRequest);
    financialDetailsStore.setFundingRequestFSForm(
      null as unknown as FundingRequestFSFormDTO
    );
    await financialDetailsStore.loadFundingRequestFSForm();
    expect(api.fundingRequestFSFormTable.create).toHaveBeenCalled();
  });

  it("Test loadFundingRequestFSForm()- should catch the error", async () => {
    financialDetailsStore.setFundingRequestFSForm(fundingRequestFSFormDTO);
    jest
      .spyOn(api.fundingRequestFSFormTable, "retrieve")
      .mockImplementation(() => {
        throw Error;
      });
    jest.spyOn(financialDetailsStore, "setFundingRequestFSForm");
    try {
      await financialDetailsStore.loadFundingRequestFSForm();
    } catch {
      await expect(
        financialDetailsStore.setFundingRequestFSForm
      ).not.toHaveBeenCalled();
    }
  });

  it("Test loadFundingRequestMIPRForm()- should load req cost estimate from api", async () => {
    jest
      .spyOn(api.fundingRequestMIPRFormTable, "create")
      .mockImplementation((): Promise<FundingRequestMIPRFormDTO> => {
        return Promise.resolve(fundingRequestMIPRFormDTO);
      });
    jest
      .spyOn(financialDetailsStore, "loadFundingRequest")
      .mockImplementation((): Promise<void> => {
        return Promise.resolve();
      });
    jest
      .spyOn(financialDetailsStore, "saveFundingRequestToDISA")
      .mockImplementation((): Promise<FundingRequestDTO> => {
        return Promise.resolve(fundingRequest);
      });
    financialDetailsStore.setFundingRequest(fundingRequest);
    financialDetailsStore.setFundingRequestMIPRForm(
      null as unknown as FundingRequestMIPRFormDTO
    );
    await financialDetailsStore.loadFundingRequestMIPRForm();
    expect(api.fundingRequestMIPRFormTable.create).toHaveBeenCalled();
  });

  it("Test loadFundingRequestMIPRForm()- should catch the error", async () => {
    financialDetailsStore.setFundingRequestMIPRForm(fundingRequestMIPRFormDTO);
    jest
      .spyOn(api.fundingRequestMIPRFormTable, "retrieve")
      .mockImplementation(() => {
        throw Error;
      });
    jest.spyOn(financialDetailsStore, "setFundingRequestMIPRForm");
    try {
      await financialDetailsStore.loadFundingRequestMIPRForm();
    } catch {
      await expect(
        financialDetailsStore.setFundingRequestMIPRForm
      ).not.toHaveBeenCalled();
    }
  });

  it("Test setHasFunding() - should set hasFunding", async () => {
    financialDetailsStore.setFundingRequirement(fundingRequirement);
    await financialDetailsStore.setHasFunding("HAS_FUNDING");
    expect(financialDetailsStore.hasFunding).toBe("HAS_FUNDING");
    expect(financialDetailsStore.fundingRequirement?.has_funding).toBe(
      "HAS_FUNDING"
    );
  });

  describe("Test saveFundingRequestFormAndGInvoicing()", () => {
    it("- throw on first api call", async () => {
      jest
        .spyOn(api.fundingRequestFSFormTable, "getQuery")
        .mockImplementation(() => {
          throw Error;
        });

      try {
        await financialDetailsStore.saveFundingRequestFormAndGInvoicing({
          sys_id: "123",
          gt_c_number: "12345678",
          use_g_invoicing: "YES",
        });
      } catch {
        expect(api.fundingRequestFSFormTable.getQuery).toThrow();
      }
    });

    it("- throw on second api call", async () => {
      jest
        .spyOn(api.fundingRequestFSFormTable, "getQuery")
        .mockImplementation(async () => {
          return Promise.resolve([fundingRequestFSFormDTO]);
        });
      jest
        .spyOn(api.fundingRequestFSFormTable, "update")
        .mockImplementation(() => {
          throw Error;
        });

      try {
        await financialDetailsStore.saveFundingRequestFormAndGInvoicing({
          sys_id: "123",
          gt_c_number: "12345678",
          use_g_invoicing: "YES",
        });
      } catch {
        expect(api.fundingRequestFSFormTable.getQuery).toHaveBeenCalledTimes(1);
        expect(api.fundingRequestFSFormTable.update).toThrow();
      }
    });

    it("- successfully and properly updates data pt.1 (set g invoicing status)", async () => {
      jest
        .spyOn(api.fundingRequestFSFormTable, "getQuery")
        .mockImplementation(async () => {
          return Promise.resolve([fundingRequestFSFormDTO]);
        });
      jest
        .spyOn(api.fundingRequestFSFormTable, "update")
        .mockImplementation(
          async (sys_id: string, data: FundingRequestFSFormDTO) => {
            return Promise.resolve(data);
          }
        );

      const response =
        await financialDetailsStore.saveFundingRequestFormAndGInvoicing({
          fs_form_7600a_filename: "", // these should NOT overwrite existing data
          fs_form_7600a_attachment: "", // these should NOT overwrite existing data
          fs_form_7600a_use_g_invoicing: "YES",
          sys_id: "123",
          gt_c_number: "12345678",
        });

      expect(api.fundingRequestFSFormTable.getQuery).toHaveBeenCalledTimes(1);
      expect(api.fundingRequestFSFormTable.update).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        ...fundingRequestFSFormDTO,
        gt_c_number: "12345678",
        fs_form_7600a_use_g_invoicing: "YES",
      });
      expect(financialDetailsStore.fundingRequestFSForm).toEqual({
        ...fundingRequestFSFormDTO,
        gt_c_number: "12345678",
        fs_form_7600a_use_g_invoicing: "YES",
      });
    });

    it("- successfully and properly updates data pt.2 (undefineds and new file)", async () => {
      jest
        .spyOn(api.fundingRequestFSFormTable, "getQuery")
        .mockImplementation(async () => {
          return Promise.resolve([
            {
              ...fundingRequestFSFormDTO,
              fs_form_7600b_filename:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600b_filename"],
              fs_form_7600b_attachment:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600b_attachment"],
              fs_form_7600b_use_g_invoicing:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600b_use_g_invoicing"],
              order_number:
                undefined as unknown as FundingRequestFSFormDTO["order_number"],
              use_g_invoicing: undefined,
            },
          ]);
        });
      jest
        .spyOn(api.fundingRequestFSFormTable, "update")
        .mockImplementation(
          async (sys_id: string, data: FundingRequestFSFormDTO) => {
            return Promise.resolve(data);
          }
        );

      const response =
        await financialDetailsStore.saveFundingRequestFormAndGInvoicing({
          fs_form_7600a_filename: "new_file", // these should overwrite existing data
          fs_form_7600a_attachment: "new_attachment", // these should overwrite existing data
          fs_form_7600a_use_g_invoicing: "YES",
          sys_id: "123",
          gt_c_number: "12345678",
        });

      expect(api.fundingRequestFSFormTable.getQuery).toHaveBeenCalledTimes(1);
      expect(api.fundingRequestFSFormTable.update).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        ...fundingRequestFSFormDTO,
        fs_form_7600a_filename: "new_file",
        fs_form_7600a_attachment: "new_attachment",
        gt_c_number: "12345678",
        fs_form_7600a_use_g_invoicing: "YES",
      });
      expect(financialDetailsStore.fundingRequestFSForm).toEqual({
        ...fundingRequestFSFormDTO,
        fs_form_7600a_filename: "new_file",
        fs_form_7600a_attachment: "new_attachment",
        gt_c_number: "12345678",
        fs_form_7600a_use_g_invoicing: "YES",
      });
    });

    it("- successfully and properly updates data pt.3 (all undefined)", async () => {
      jest
        .spyOn(api.fundingRequestFSFormTable, "getQuery")
        .mockImplementation(async () => {
          return Promise.resolve([
            {
              ...fundingRequestFSFormDTO,
              fs_form_7600a_filename:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600a_filename"],
              fs_form_7600a_attachment:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600a_attachment"],
              fs_form_7600b_filename:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600b_filename"],
              fs_form_7600b_attachment:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600b_attachment"],
              fs_form_7600b_use_g_invoicing:
                undefined as unknown as FundingRequestFSFormDTO["fs_form_7600b_use_g_invoicing"],
              order_number:
                undefined as unknown as FundingRequestFSFormDTO["order_number"],
              use_g_invoicing: undefined,
            },
          ]);
        });
      jest
        .spyOn(api.fundingRequestFSFormTable, "update")
        .mockImplementation(
          async (sys_id: string, data: FundingRequestFSFormDTO) => {
            return Promise.resolve(data);
          }
        );

      const response =
        await financialDetailsStore.saveFundingRequestFormAndGInvoicing({
          fs_form_7600a_use_g_invoicing: "YES",
          sys_id: "123",
          gt_c_number: "12345678",
        });

      expect(api.fundingRequestFSFormTable.getQuery).toHaveBeenCalledTimes(1);
      expect(api.fundingRequestFSFormTable.update).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        ...fundingRequestFSFormDTO,
        fs_form_7600a_filename: "",
        fs_form_7600a_attachment: "",
        gt_c_number: "12345678",
        fs_form_7600a_use_g_invoicing: "YES",
      });
      expect(financialDetailsStore.fundingRequestFSForm).toEqual({
        ...fundingRequestFSFormDTO,
        fs_form_7600a_filename: "",
        fs_form_7600a_attachment: "",
        gt_c_number: "12345678",
        fs_form_7600a_use_g_invoicing: "YES",
      });
    });
  });
});
