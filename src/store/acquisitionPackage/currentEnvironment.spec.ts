/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {CurrentEnvironmentStore} from "@/store/acquisitionPackage/currentEnvironment";
import {CurrentEnvironmentDTO} from "@/api/models";
import Vue from "vue";
import storeHelperFunctions from "@/store/helpers";
import {api} from "@/api";

jest.mock('@/store/helpers')

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CurrentEnvironment Store",
  () => {
    let currentEnvironmentStore: CurrentEnvironmentStore;
    let currentEnvironmentMock: CurrentEnvironmentDTO;

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ currentEnvironment: any }> => new Vuex.Store({...storeOptions});
      currentEnvironmentStore = getModule(CurrentEnvironmentStore, createStore());
      currentEnvironmentMock = {
        current_environment_exists: "YES",
        environments: [],
        has_system_documentation: "NO",
        has_migration_documentation: "NO"
      }
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })

    it('Test setInitialized()- sets initialized to true', async () => {
      await currentEnvironmentStore.initialize();
      expect(currentEnvironmentStore.initialized).toBe(true)
    })

    it('Test initialize()- should set store data if not already initialized' +
      'and store data available in session', async () => {
      currentEnvironmentStore.setInitialized(false);
      jest.spyOn(storeHelperFunctions, "retrieveSession").mockReturnValue(
        JSON.stringify(currentEnvironmentMock)
      );
      jest.spyOn(currentEnvironmentStore, "setStoreData");
      await currentEnvironmentStore.initialize();
      expect(currentEnvironmentStore.setStoreData).toHaveBeenCalled();
    })

    it('Test ensureInitialized()- should call initialize function', async () => {
      jest.spyOn(currentEnvironmentStore, "initialize");
      await currentEnvironmentStore.ensureInitialized();
      expect(currentEnvironmentStore.initialize).toHaveBeenCalled();
    })

    it('Test setStoreData()- should set appropriate session data to store', async () => {
      jest.spyOn(Vue, "set");
      currentEnvironmentStore.setStoreData(
        JSON.stringify(currentEnvironmentMock));
      await expect(Vue.set).toHaveBeenCalled();
    })

    it('Test setStoreData()- should catch the error', async () => {
      jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(Vue, "set");
      try {
        currentEnvironmentStore.setStoreData(
          JSON.stringify(currentEnvironmentMock));
      } catch {
        await expect(Vue.set).not.toHaveBeenCalled();
      }
    })

    it('Test getCurrentEnvironment()- should get the eval criteria from store', async () => {
      currentEnvironmentStore.setCurrentEnvironment(
        currentEnvironmentMock);
      const currentEnvironmentL =
        await currentEnvironmentStore.getCurrentEnvironment();
      await expect(currentEnvironmentL?.has_system_documentation)
        .toBe("NO")
    })

    it('Test loadCurrentEnvironment()- should load the evaluation criteria', async () => {
      jest.spyOn(api.currentEnvironmentTable, "retrieve").mockReturnValue(
        Promise.resolve(currentEnvironmentMock)
      )
      await currentEnvironmentStore.loadCurrentEnvironment("testAqId");
      const loadedCurrentEnvironment = await currentEnvironmentStore.getCurrentEnvironment();
      expect(loadedCurrentEnvironment?.current_environment_exists).toBe("YES");
    })

    it('Test saveCurrentEnvironment()- should save the evaluation criteria', async () => {
      currentEnvironmentStore.setCurrentEnvironment(currentEnvironmentMock);
      const isSaveSuccessful = await currentEnvironmentStore.saveCurrentEnvironment();
      expect(isSaveSuccessful).toBe(true);
    })
  })
