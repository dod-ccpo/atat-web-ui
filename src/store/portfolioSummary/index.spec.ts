import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import storeHelperFunctions from "@/store/helpers";
import {PortfolioSummaryStore} from "@/store/portfolioSummary/index";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("PortfolioSummary Store", () => {
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
    //mocks sessionStorage retrieval
    jest.spyOn(storeHelperFunctions, "retrieveSession").mockReturnValue(
      JSON.stringify({
        "clins": "",
      })
    );
    await portfolioSummaryStore.initialize();
    expect(portfolioSummaryStore.initialized).toBe(true)
    expect(portfolioSummaryStore.portfolioSummaryList).toBe([])
  })

})
