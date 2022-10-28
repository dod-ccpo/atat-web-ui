/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {FinancialDetailsStore} from "@/store/financialDetails/index";
import {RequirementsCostEstimateDTO} from "@/api/models";
import Vue from "vue";
import {api} from "@/api";
jest.mock('@/store/helpers')

const localVue = createLocalVue();
localVue.use(Vuex);

describe("FinancialDetails Store",
  () => {
    let financialDetailsStore: FinancialDetailsStore;
    let requirementsCostEstimateDTO: RequirementsCostEstimateDTO;

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ financialDetails: any }> => new Vuex.Store({...storeOptions});
      financialDetailsStore = getModule(FinancialDetailsStore, createStore());
      requirementsCostEstimateDTO = {
        surge_capabilities: "Test SC",
        estimatedTaskOrderValue: "",
        feePercentage: "",
        feeCharged: "",
        surge_capacity: ""
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

    it('Test setStoreData()- should set appropriate session data to store', async () => {
      jest.spyOn(Vue, "set");
      financialDetailsStore.setStoreData(
        JSON.stringify(requirementsCostEstimateDTO));
      await expect(Vue.set).toHaveBeenCalled();
    })

    it('Test setStoreData()- should catch the error', async () => {
      jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(Vue, "set");
      try {
        financialDetailsStore.setStoreData(
          JSON.stringify(requirementsCostEstimateDTO));
      } catch {
        await expect(Vue.set).not.toHaveBeenCalled();
      }
    })

    it('Test loadRequirementsCostEstimate()- should not load requirements' +
      'cost estimate from the api if not already created', async () => {
      jest.spyOn(api.requirementsCostEstimateTable, "retrieve");
      await financialDetailsStore.loadRequirementsCostEstimate();
      expect(api.requirementsCostEstimateTable.retrieve).not.toHaveBeenCalled();
    })

    it('Test loadRequirementsCostEstimate()- should load req cost estimate from api', async () => {
      jest.spyOn(api.requirementsCostEstimateTable, "retrieve").mockReturnValue(
        Promise.resolve(requirementsCostEstimateDTO)
      )
      financialDetailsStore.setRequirementsCostEstimate(requirementsCostEstimateDTO);
      await financialDetailsStore.loadRequirementsCostEstimate();
      expect(api.requirementsCostEstimateTable.retrieve).toHaveBeenCalled();
    })

    it('Test loadRequirementsCostEstimate()- should catch the error', async () => {
      financialDetailsStore.setRequirementsCostEstimate(requirementsCostEstimateDTO);
      jest.spyOn(api.requirementsCostEstimateTable, "retrieve").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(financialDetailsStore, "setRequirementsCostEstimate");
      try {
        await financialDetailsStore.loadRequirementsCostEstimate();
      } catch {
        await expect(financialDetailsStore.setRequirementsCostEstimate).not.toHaveBeenCalled();
      }
    })

    it('Test saveRequirementsCostEstimate()- should create the requirements' +
      'cost estimate record if the sys_id is null in the store', async () => {
      jest.spyOn(api.requirementsCostEstimateTable, "create").mockReturnValue(
        Promise.resolve(requirementsCostEstimateDTO)
      );
      jest.spyOn(api.requirementsCostEstimateTable, "update").mockReturnValue(
        Promise.resolve(requirementsCostEstimateDTO)
      );
      await financialDetailsStore.saveRequirementsCostEstimate(requirementsCostEstimateDTO);
      expect(api.requirementsCostEstimateTable.create).toHaveBeenCalled();
      expect(api.requirementsCostEstimateTable.update).not.toHaveBeenCalled();
    })

    it('Test saveRequirementsCostEstimate()- should update the requirements' +
      'cost estimate record if the sys_id is not null in the store', async () => {
      requirementsCostEstimateDTO.sys_id = "12" // this should force the update
      jest.spyOn(api.requirementsCostEstimateTable, "create").mockReturnValue(
        Promise.resolve(requirementsCostEstimateDTO)
      );
      jest.spyOn(api.requirementsCostEstimateTable, "update").mockReturnValue(
        Promise.resolve(requirementsCostEstimateDTO)
      );
      await financialDetailsStore.saveRequirementsCostEstimate(requirementsCostEstimateDTO);
      expect(api.requirementsCostEstimateTable.create).not.toHaveBeenCalled();
      expect(api.requirementsCostEstimateTable.update).toHaveBeenCalled();
    })
  })
