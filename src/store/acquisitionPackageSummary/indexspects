/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {AcquisitionPackageSummaryStore} from "@/store/acquisitionPackageSummary/index";
import {
  AcquisitionPackageSummaryDisplay,
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummarySearchDTO
} from "@/api/models";
import Vue from "vue";
import {api} from "@/api";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("AcquisitionPackageSummary Store",
  () => {
    let acquisitionPackageSummaryStore: AcquisitionPackageSummaryStore;
    let aqPackageSummaryDisplay1: AcquisitionPackageSummaryDisplay;
    let aqPackageSummaryDisplayList: AcquisitionPackageSummaryDisplay[];
    let aqPackageSummary1: AcquisitionPackageSummaryDTO;
    let aqPackageSummaryList: AcquisitionPackageSummaryDTO[];

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ acquisitionPackageSummary: any }> => new Vuex.Store({...storeOptions});
      acquisitionPackageSummaryStore = getModule(AcquisitionPackageSummaryStore, createStore());
      aqPackageSummaryDisplay1 = {
        "sys_id": {
          "display_value": "12",
          "value": "12"
        },
        "sys_created_by": {
          "display_value": "tony.sumner-ctr@ccpo.mil",
          "value": "tony.sumner-ctr@ccpo.mil"
        },
        "sys_updated_on": {
          "display_value": "2022-10-14 14:32:04",
          "value": "2022-10-14 14:32:04"
        },
        "project_overview": {
          "display_value": "Alpha Project",
          "value": "13"
        },
        "secondary_reviewers": {
          "display_value": "",
          "value": ""
        },
        "package_status": {
          "display_value": "Waiting for Task Order",
          "value": "WAITING_FOR_TASK_ORDER"
        },
        "mission_owners": {
          "display_value": "Maria Missionowner ",
          "value": "14"
        },
        "contract_award": {
          "display_value": "",
          "value": ""
        }
      }
      aqPackageSummaryDisplayList = [aqPackageSummaryDisplay1];

      aqPackageSummary1 = {
        "sys_id": "12",
        "sys_created_by": "tony.sumner-ctr@ccpo.mil",
        "sys_updated_on": "2022-10-14 14:32:04",
        "project_overview": {
          "display_value": "Alpha Project",
          "value": "13"
        },
        "secondary_reviewers": {
          "display_value": "",
          "value": ""
        },
        "package_status": {
          "display_value": "Waiting for Task Order",
          "value": "WAITING_FOR_TASK_ORDER"
        },
        "mission_owners": {
          "display_value": "Maria Missionowner ",
          "value": "14"
        },
        "contract_award": {
          "display_value": "",
          "value": ""
        }
      }
      aqPackageSummaryList = [aqPackageSummary1];
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })

    it('Test setInitialized()- sets initialized to true', async () => {
      await acquisitionPackageSummaryStore.initialize();
      expect(acquisitionPackageSummaryStore.initialized).toBe(true)
    })

    it('Test ensureInitialized()- should call initialize function', async () => {
      jest.spyOn(acquisitionPackageSummaryStore, "initialize");
      await acquisitionPackageSummaryStore.ensureInitialized();
      expect(acquisitionPackageSummaryStore.initialize).toHaveBeenCalled();
    })

    it('Test setStoreData()- should set appropriate session data to store', async () => {
      jest.spyOn(Vue, "set");
      acquisitionPackageSummaryStore.setStoreData(
        JSON.stringify(aqPackageSummaryList));
      await expect(Vue.set).toHaveBeenCalled();
    })

    it('Test setStoreData()- should catch the error', async () => {
      jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(Vue, "set");
      try {
        acquisitionPackageSummaryStore.setStoreData(
          JSON.stringify(aqPackageSummaryList));
      } catch {
        await expect(Vue.set).not.toHaveBeenCalled();
      }
    })

    it('Test getAllAcquisitionPackageSummaryList()- should get the list from store', async () => {
      acquisitionPackageSummaryStore.setAcquisitionPackageSummaryList(
        aqPackageSummaryList);
      const acquisitionPackageSummaryList =
        await acquisitionPackageSummaryStore.getAllAcquisitionPackageSummaryList();
      await expect(acquisitionPackageSummaryList?.length).toBe(1)
    })

    it('Test searchAcquisitionPackageSummaryList()- should return empty array', async () => {
      const searchDTO: AcquisitionPackageSummarySearchDTO = {
        acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER",
        sort: "project_overview",
        searchString: ""
      }
      jest.spyOn(api.acquisitionPackagesSummaryTable, "getQuery").mockReturnValue(
        Promise.resolve([])
      );
      const acquisitionPackageSummaryMetadataAndDataDTO =
        await acquisitionPackageSummaryStore.searchAcquisitionPackageSummaryList(searchDTO);
      expect(acquisitionPackageSummaryMetadataAndDataDTO.total_count).toBe(0);
    })

    it('Test searchAcquisitionPackageSummaryList()- should return the full list', async () => {
      const searchDTO: AcquisitionPackageSummarySearchDTO = {
        acquisitionPackageStatus: "TASK_ORDER_AWARDED",
        sort: "project_overview",
        searchString: "Alpha"
      }
      aqPackageSummaryDisplay1.sys_id = undefined; // should handle the undefined values
      aqPackageSummaryDisplay1.sys_created_by = undefined;
      aqPackageSummaryDisplay1.sys_updated_on = undefined;
      jest.spyOn(api.acquisitionPackagesSummaryTable, "getQuery").mockReturnValue(
        Promise.resolve(aqPackageSummaryDisplayList)
      );
      const acquisitionPackageSummaryMetadataAndDataDTO =
        await acquisitionPackageSummaryStore.searchAcquisitionPackageSummaryList(searchDTO);
      expect(acquisitionPackageSummaryMetadataAndDataDTO.total_count).toBe(1);
    })

    it('Test searchAcquisitionPackageSummaryList()- should compile expected ' +
      'search query', async () => {
      const searchDTO: AcquisitionPackageSummarySearchDTO = {
        acquisitionPackageStatus: "TASK_ORDER_AWARDED",
        sort: "project_overview",
        searchString: "Alpha"
      }
      jest.spyOn(api.acquisitionPackagesSummaryTable, "getQuery").mockReturnValue(
        Promise.resolve(aqPackageSummaryDisplayList)
      );
      await acquisitionPackageSummaryStore.searchAcquisitionPackageSummaryList(searchDTO);
      expect(api.acquisitionPackagesSummaryTable.getQuery).toHaveBeenCalledWith({
        "params": {
          "sysparm_fields": "package_status",
          "sysparm_query": "^package_statusINTASK_ORDER_AWARDED^project_overviewLIKEAlpha^" +
            "mission_ownersLIKEe0c4c728875ed510ec3b777acebb356f^" +
            "mission_ownersISNOTEMPTY^ORDERBYproject_overview"
        }
      });
      expect(api.acquisitionPackagesSummaryTable.getQuery).toHaveBeenCalledTimes(2);
    })

    it('Test updateAcquisitionPackageStatus()- should update the status', async () => {
      jest.spyOn(api.acquisitionPackagesSummaryTable, "update").mockReturnValue(
        Promise.resolve(aqPackageSummaryDisplay1)
      )
      const isUpdateSuccessful =
        await acquisitionPackageSummaryStore.updateAcquisitionPackageStatus({
          acquisitionPackageSysId: "12",
          newStatus: "ARCHIVED"
        });
      expect(isUpdateSuccessful).toBe(true);
      expect(api.acquisitionPackagesSummaryTable.update).toHaveBeenCalled()
    })

  })
