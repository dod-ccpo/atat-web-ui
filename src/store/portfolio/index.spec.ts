
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import PortfolioData, {PortfolioDataStore} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import storeHelperFunctions  from "../helpers";
import { User } from "../../../types/Global";
const localVue = createLocalVue();
localVue.use(Vuex);


describe("Portfolio Store", () => {
  let portfolioStore: PortfolioDataStore;

  beforeEach(() => {
    const createStore = (storeOptions: any = {}):
        Store<{ taskOrder: any }> => new Vuex.Store({ ...storeOptions });
    portfolioStore = getModule(PortfolioDataStore, createStore());
  })
  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  it('Test setInitialized()- sets initialized to the passed in value', async () => {
    //mocks sessionStorage retrieval
    jest.spyOn(storeHelperFunctions, "retrieveSession").mockReturnValue(
      JSON.stringify({
        "title": "Mock Title",
      })
    );
    await portfolioStore.initialize();
    expect(portfolioStore.initialized).toBe(true)
    expect(portfolioStore.title).toBe("Mock Title")
  })

  it('Test setPortfolioData- sets portfolio to the passed in value', async () => {
    const mockData = {
      title: "some title to test",
      description: "a description",
      status: "active",
      csp: "",
      serviceAgency: "mock Agency",
      createdBy: "jefferey tester",
      provisioned: "today",
      members: []
    }
    
    await portfolioStore.setPortfolioData(mockData);
    expect(portfolioStore.initialized).toBe(true)
    expect(portfolioStore.title).toBe("some title to test")
  })

})


