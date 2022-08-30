
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import PortfolioData, {PortfolioDataStore} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import storeHelperFunctions  from "../helpers";
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
    expect(portfolioStore.portfolio.title).toBe("Mock Title")
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
    const updateEmailObj = {
      members:[{email:"testemail@test.mil"}]
    }
    
    await portfolioStore.setPortfolioData(mockData);
    expect(portfolioStore.initialized).toBe(true)
    await portfolioStore.setPortfolioData(updateEmailObj);
    expect(portfolioStore.portfolio.title).toBe("some title to test")
  })

})


