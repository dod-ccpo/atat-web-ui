import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import {PortfolioSummaryStore} from "@/store/portfolioSummary/index";
import {
  AlertDTO,
  ClinDisplayDTO, CostsDTO, PortfolioSummaryDTO, PortfolioSummarySearchDTO,
  TaskOrderDTO
} from "@/api/models";
import Vue from "vue";
import portfolioSummaryListMock from "@/store/portfolioSummary/mocks/portfolioSummaryListMock.json"
import taskOrderListMock from "@/store/portfolioSummary/mocks/taskOrderListMock.json"
import clinListMock from "@/store/portfolioSummary/mocks/clinListMock.json"
import costListMock from "@/store/portfolioSummary/mocks/costListMock.json"
import alertListMock from "@/store/portfolioSummary/mocks/alertListMock.json"
import {api} from "@/api";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("PortfolioSummary Store",
  () => {
    let portfolioSummaryStore: PortfolioSummaryStore;

    beforeEach(() => {
      const createStore = (storeOptions: any = {}):
        Store<{ portfolioSummary: any }> => new Vuex.Store({...storeOptions});
      portfolioSummaryStore = getModule(PortfolioSummaryStore, createStore());
    })
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    })

    it('Test setInitialized()- sets initialized to true', async () => {
      await portfolioSummaryStore.initialize();
      expect(portfolioSummaryStore.initialized).toBe(true)
    })

    it('Test ensureInitialized()- should call initialize function', async () => {
      jest.spyOn(portfolioSummaryStore, "initialize");
      await portfolioSummaryStore.ensureInitialized();
      expect(portfolioSummaryStore.initialize).toHaveBeenCalled();
    })

    it('Test setStoreData()- should set appropriate session data to store', async () => {
      jest.spyOn(Vue, "set");
      portfolioSummaryStore.setStoreData(JSON.stringify(portfolioSummaryListMock));
      await expect(Vue.set).toHaveBeenCalled();
    })

    it('Test setStoreData()- should catch the error', async () => {
      jest.spyOn(JSON, "parse").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(Vue, "set");
      try {
        portfolioSummaryStore.setStoreData(JSON.stringify(portfolioSummaryListMock));
      } catch {
        await expect(Vue.set).not.toHaveBeenCalled();
      }
    })

    it('Test getAllPortfolioSummaryList()- should get the list from store', async () => {
      portfolioSummaryStore.setPortfolioSummaryList(
        portfolioSummaryListMock as PortfolioSummaryDTO[]);
      const portfolioSummaryList = await portfolioSummaryStore.getAllPortfolioSummaryList();
      await expect(portfolioSummaryList?.length).toBe(1)
    })

    it('Test searchPortfolioSummaryList()- should not make additional calls if there are no ' +
      'portfolios', async () => {
      const searchDTO: PortfolioSummarySearchDTO = {
        portfolioStatus: "",
        sort: "name",
        searchString: "",
        role: "ALL",
        fundingStatuses: [],
        csps: []
      }
      jest.spyOn(api.portfolioTable, "getQuery").mockReturnValue(
        Promise.resolve([])
      );
      jest.spyOn(api.alertsTable, "getQuery").mockReturnValue(
        Promise.resolve([])
      );
      const portfolioSummaryMetadataAndDataDTO = await portfolioSummaryStore
        .searchPortfolioSummaryList(searchDTO);
      expect(portfolioSummaryMetadataAndDataDTO.total_count).toBe(0);
      expect(api.alertsTable.getQuery).not.toHaveBeenCalled();
    })

    // it('Test searchPortfolioSummaryList()- should make other calls if ' +
    //   'there are portfolios ', async () => {
    //   const searchDTO: PortfolioSummarySearchDTO = {
    //     portfolioStatus: "",
    //     sort: "name",
    //     searchString: "",
    //     role: "ALL",
    //     fundingStatuses: [],
    //     csps: []
    //   }
    //   jest.spyOn(api.portfolioTable, "getQuery").mockReturnValue(
    //     Promise.resolve(portfolioSummaryListMock as PortfolioSummaryDTO[])
    //   );
    //   jest.spyOn(api.alertsTable, "getQuery").mockReturnValue(Promise.resolve([]));
    //   jest.spyOn(api.cloudServiceProviderTable, "getQuery").mockReturnValue(Promise.resolve([]));
    //   jest.spyOn(api.taskOrderTable, "getQuery").mockReturnValue(Promise.resolve([]));
    //   jest.spyOn(api.clinDisplayTable, "getQuery").mockReturnValue(Promise.resolve([]));
    //   jest.spyOn(api.costsTable, "getQuery").mockReturnValue(Promise.resolve([]));
    //   const portfolioSummaryMetadataAndDataDTO = await portfolioSummaryStore
    //     .searchPortfolioSummaryList(searchDTO);
    //   expect(portfolioSummaryMetadataAndDataDTO.total_count).toBe(1);
    //   expect(api.alertsTable.getQuery).toHaveBeenCalled();
    //   expect(api.cloudServiceProviderTable.getQuery).toHaveBeenCalled();
    //   expect(api.taskOrderTable.getQuery).toHaveBeenCalled();
    //   expect(api.clinDisplayTable.getQuery).toHaveBeenCalled();
    //   expect(api.costsTable.getQuery).toHaveBeenCalled();
    // })

    // it('Test searchPortfolioSummaryList()- should call portfolio api with expected query ' +
    //   'and funding status search should not be done as an api query ', async () => {
    //   const searchDTO: PortfolioSummarySearchDTO = {
    //     portfolioStatus: "", sort: "name", searchString: "Air Force", role: "ALL",
    //     fundingStatuses: ["AT_RISK", "EXPIRING_SOON"], csps: []
    //   }
    //   jest.spyOn(api.portfolioTable, "getQuery").mockReturnValue(
    //     Promise.resolve([])
    //   );
    //   await portfolioSummaryStore.searchPortfolioSummaryList(searchDTO);
    //   expect(api.portfolioTable.getQuery).toHaveBeenCalledWith({
    //     "params": {
    //       "sysparm_fields": "name",
    //       "sysparm_query": "^portfolio_funding_statusINAT_RISK,EXPIRING_SOON" +
    //         "^nameLIKEAir Force^portfolio_managersLIKE" +
    //         "e0c4c728875ed510ec3b777acebb356^ORportfolio_viewersLIKEe0c4c728875ed510ec3b777" +
    //         "acebb356^portfolio_status!=ARCHIVED^ORDERBYname",
    //     }
    //   });
    // })

    it('Test searchPortfolioSummaryList()- should catch the error while searching for ' +
      'portfolio summary list ', async () => {
      const searchDTO: PortfolioSummarySearchDTO = {
        portfolioStatus: "", sort: "name", searchString: "Air Force", role: "ALL",
        fundingStatuses: ["AT_RISK", "EXPIRING_SOON"], csps: []
      }
      jest.spyOn(api.portfolioTable, "getQuery").mockImplementation(() => {
        throw Error;
      })
      jest.spyOn(api.alertsTable, "getQuery").mockReturnValue(Promise.resolve([]));
      try {
        await portfolioSummaryStore.searchPortfolioSummaryList(searchDTO);
      } catch {
        await expect(api.alertsTable.getQuery).not.toHaveBeenCalled();
      }
    })

    it('Test searchPortfolioSummaryList()- compute aggregations ', async () => {
      const searchDTO: PortfolioSummarySearchDTO = {
        portfolioStatus: "",
        sort: "name",
        searchString: "",
        role: "ALL",
        fundingStatuses: ["EXPIRING_SOON"],
        csps: []
      }
      jest.spyOn(api.portfolioTable, "getQuery").mockReturnValue(
        Promise.resolve(portfolioSummaryListMock as PortfolioSummaryDTO[])
      );
      jest.spyOn(api.alertsTable, "getQuery").mockReturnValue(Promise.resolve(
        alertListMock as unknown as AlertDTO[]));
      jest.spyOn(api.cloudServiceProviderTable, "getQuery").mockReturnValue(Promise.resolve([]));
      jest.spyOn(api.taskOrderTable, "getQuery").mockReturnValue(Promise.resolve(
        taskOrderListMock as TaskOrderDTO[]));
      jest.spyOn(api.clinDisplayTable, "getQuery").mockReturnValue(Promise.resolve(
        clinListMock as ClinDisplayDTO[]));
      jest.spyOn(api.costsTable, "getQuery").mockReturnValue(Promise.resolve(
        costListMock as unknown as CostsDTO[]));
      const portfolioSummaryMetadataAndDataDTO = await portfolioSummaryStore
        .searchPortfolioSummaryList(searchDTO);
      expect(portfolioSummaryMetadataAndDataDTO.portfolioSummaryList[0].funds_obligated)
        .toBe(1000);
      expect(portfolioSummaryMetadataAndDataDTO.portfolioSummaryList[0].funds_spent).toBe(267004);
      expect(portfolioSummaryMetadataAndDataDTO.portfolioSummaryList[0].portfolio_funding_status)
        .toStrictEqual("EXPIRING_SOON");
    })

  })
