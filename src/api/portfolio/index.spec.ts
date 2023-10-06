import {createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";
import { PortfolioApi, APINAME } from './index';
import { PortfolioSummaryObj } from "@/api/models";
import MockAdapter from "axios-mock-adapter";

const localVue = createLocalVue();
localVue.use(Vuex);
const portfolios: PortfolioSummaryObj[] = [
  /* eslint-disable camelcase */
  {
    portfolio_name: "test 2000",
    portfolio_status: "ACTIVE",
    agency: "BRITISH EMBASSY",
    last_updated: "2023-09-27 11:17:01",
    current_user_is_owner: true,
    current_user_is_manager: false,
    vendor: "GCP",
    pop_start_date: "2023-12-08",
    pop_end_date: "2028-10-07",
    total_obligated: 1919000,
    funds_spent: 0,
    active_task_order: "2000000000000",
    owner_full_name: "Test User2",
    funding_status: "ON_TRACK",
    csp_portal_links: [
      {
        csp: "google_il5_dev",
        dashboard_link: ""
      },
      {
        csp: "google_il6_dev",
        dashboard_link: ""
      }
    ]
  }
  /* eslint-enable camelcase */
];
  

describe("Portfolio Api",
  () => {
    const portfolioApi = new PortfolioApi()
    // pass in the api instance
    const mockAxios= new MockAdapter(portfolioApi.instance)

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('Test getPortfolioSummaryList()', async () => {
      const userId = '1234'
      mockAxios.onGet(`${APINAME}/summary`, {params: {userId: userId}})
        .reply(200, {result: portfolios})
      const data = await portfolioApi.getPortfolioSummaryList(userId)
      expect(data).toStrictEqual(portfolios)
    })

  })

