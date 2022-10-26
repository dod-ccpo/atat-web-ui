/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {EvaluationCriteriaStore} from "@/store/evaluationCriteria/index";
import {EvaluationCriteriaDTO} from "@/api/models";
import Vue from "vue";
import storeHelperFunctions from "@/store/helpers";
jest.mock('@/store/helpers')

const localVue = createLocalVue();
localVue.use(Vuex);

describe("EvaluationCriteria Store",
  () => {
    let evaluationCriteriaStore: EvaluationCriteriaStore;
    let evaluationCriteria: EvaluationCriteriaDTO;

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ evaluationCriteria: any }> => new Vuex.Store({...storeOptions});
      evaluationCriteriaStore = getModule(EvaluationCriteriaStore, createStore());
      evaluationCriteria = {
        evaluation_plan: {
          source_selection: "NoTechProposal",
          method: "BVTO",
          standard_specifications: ["Test BVTO differentiators"],
          custom_specifications: []
        },
        fair_opportunity: {
          exception_to_fair_opportunity: "Test exception to fair opportunity"
        }
      }
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })

    it('Test setInitialized()- sets initialized to true', async () => {
      await evaluationCriteriaStore.initialize();
      expect(evaluationCriteriaStore.initialized).toBe(true)
    })

    it('Test initialize()- should set store data if not already initialized' +
      'and store data available in session', async () => {
      evaluationCriteriaStore.setInitialized(false);
      jest.spyOn(storeHelperFunctions, "retrieveSession").mockReturnValue(
        JSON.stringify(evaluationCriteria)
      );
      jest.spyOn(evaluationCriteriaStore, "setStoreData");
      await evaluationCriteriaStore.initialize();
      expect(evaluationCriteriaStore.setStoreData).toHaveBeenCalled();
    })

    it('Test ensureInitialized()- should call initialize function', async () => {
      jest.spyOn(evaluationCriteriaStore, "initialize");
      await evaluationCriteriaStore.ensureInitialized();
      expect(evaluationCriteriaStore.initialize).toHaveBeenCalled();
    })

    it('Test setStoreData()- should set appropriate session data to store', async () => {
      jest.spyOn(Vue, "set");
      evaluationCriteriaStore.setStoreData(
        JSON.stringify(evaluationCriteria));
      await expect(Vue.set).toHaveBeenCalled();
    })

    it('Test setStoreData()- should catch the error', async () => {
      jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(Vue, "set");
      try {
        evaluationCriteriaStore.setStoreData(
          JSON.stringify(evaluationCriteria));
      } catch {
        await expect(Vue.set).not.toHaveBeenCalled();
      }
    })

    it('Test getEvaluationCriteria()- should get the eval criteria from store', async () => {
      evaluationCriteriaStore.setEvaluationCriteria(
        evaluationCriteria);
      const evaluationCriteriaL =
        await evaluationCriteriaStore.getEvaluationCriteria();
      await expect(evaluationCriteriaL?.evaluation_plan.standard_specifications)
        .toStrictEqual(["Test BVTO differentiators"])
    })

    it('Test loadEvaluationCriteria()- should load the evaluation criteria', async () => {
      await evaluationCriteriaStore.loadEvaluationCriteria("testAqId");
      const loadedEvaluationCriteria = await evaluationCriteriaStore.getEvaluationCriteria();
      expect(loadedEvaluationCriteria?.evaluation_plan.method).toBe("BVTO");
    })

    it('Test saveEvaluationCriteria()- should save the evaluation criteria', async () => {
      evaluationCriteriaStore.setEvaluationCriteria(evaluationCriteria);
      const isSaveSuccessful = await evaluationCriteriaStore.saveEvaluationCriteria();
      expect(isSaveSuccessful).toBe(true);
    })
  })
