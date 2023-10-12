import {createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";
import { PortfolioApi, APINAME } from './index';
import { PortfolioSummaryObj, UserDTO } from "@/api/models";
import MockAdapter from "axios-mock-adapter";
import { PortfolioDetailsDTO } from "types/Global";

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
];
const mockPortfolioDetails: PortfolioDetailsDTO ={
  portfolio:{
    agency: 'Agency',
    agencyDisplay: 'AGC',
    available_funds: '1000.00',
    clins: [
      {
        active: true,
        actual_funds_spent: 1000,
        classification_level: 'U',
        clin_number: '0001',
        clin_status: 'ON_TRACK',
        costs: [
          { clin: '0001',
            clin_number: '0001',
            year_month:'2023-11-01',
            task_order_number:'3578',
            portfolio: '1234',
            organization: 'org1',
            is_actual: true,
            value: '1000.000',
            'clin.clin_number': '0001',
            csp: 'test'
          }
        ],
        funds_obligated: 1000000,
        funds_total: 1000000,
        idiq_clin: 'clin',
        idiq_clin_label: 'clin',
        pop_end_date: '2023-11-01',
        pop_start_date: '2023-10-01',
        sys_id: '7896',
        type: 'type',
      }
    ],
    current_user_is_manager: false,
    current_user_is_owner: true,
    description: 'good description',
    environments: [
      {
        classification_level: 'U',
        cloud_distinguisher: '',
        environment_status: 'ACTIVE',
        csp: 'test',
        csp_id: '1234',
        csp_display: 'test',
        name: 'test',
        dashboard_link: 'google.com',
        portfolio: '',
        provisioned: '',
        provisioned_date: '',
        provisioning_failure_cause: '',
        provisioning_request_date: '',
      }
    ], 
    estimated_funds_available: '1000.00',
    estimated_funds_to_be_invoiced: '10000.00',
    funding_status: 'PROCESSING',
    inPeriodClins:['3456'],
    is_archived:false,
    last_cost_data_sync: '2023-10-01',
    last_modified: '2023-10-01',
    last_updated: '2023-10-01',
    period_funds_spent: '500.00',
    pop_end_date: '2023-11-01',
    pop_start_date: '2023-10-01',
    portfolio_name: 'Test port',
    portfolio_status: 'ACTIVE',
    portfolio_users:{
      creator: {} as UserDTO,
      managers: [] as UserDTO[],
      owner:{} as UserDTO,
      viewers: [] as UserDTO[]
    },
    spend_end_of_month_xaas_forecast: '500.00',
    spend_end_of_month_xaas_forecast_trend: '500.00',
    spend_end_of_period_forecast: '500.00',
    spend_last_month: '500.00',
    spend_last_month_trend: '500.00',
    spend_monthly_average: '500.00',
    task_order: {
      sys_id: '3467',
      task_order_number: '3578',
      total_funds_spent: '1000.000',
      total_lifecycle_amount: '100000.00',
      total_obligated_funds: '100000.00',
      total_task_order_value: '100000.00',
    },
    total_portfolio_funds: '1000000.00',
    vendor: 'AWS',
    sysId: '1234'
  },
  portfolioId: '1234'
}

/* eslint-enable camelcase */
  

describe("Portfolio Api",
  () => {
    const portfolioApi = new PortfolioApi()
    // pass in the api instance
    const mockAxios= new MockAdapter(portfolioApi.instance)

    afterEach(() => {
      jest.clearAllMocks();
      mockAxios.reset()
    })

    it('Test getPortfolioSummaryList()', async () => {
      const userId = '1234'
      mockAxios.onGet(`${APINAME}/summary`, {params: {userId: userId}})
        .reply(200, {result: portfolios})
      const data = await portfolioApi.getPortfolioSummaryList(userId)
      expect(data).toStrictEqual(portfolios)
    })


    it('Test getPortfolioDetails()', async () => {
      const userId = '1234'
      const portfolioSysId = '5678'
      mockAxios.onGet(`${APINAME}/details`, {params: {userId: userId, portfolioId: portfolioSysId}})
        .reply(200, {result: mockPortfolioDetails})
      const data = await portfolioApi.getPortfolioDetails(userId, portfolioSysId)
      expect(data).toStrictEqual(mockPortfolioDetails)
    })

    it('Test getPortfolioDetails() errors', async () => {
      const userId = '1234'
      const portfolioSysId = '5678'
      mockAxios.reset()
      mockAxios.onGet(`${APINAME}/details`, {params: {userId: userId, portfolioId: portfolioSysId}})
        .reply(404, {result: {error: 'error'}})
      const data = await portfolioApi.getPortfolioDetails(userId, portfolioSysId)
      expect(data).toStrictEqual({})
    })

    it('Test getPortfolioDetails() not 200 error', async () => {
      const userId = '1234'
      const portfolioSysId = '5678'
      mockAxios.reset()
      mockAxios.onGet(`${APINAME}/details`, {params: {userId: userId, portfolioId: portfolioSysId}})
        .reply(201, {error: 'error'})
      const data = await portfolioApi.getPortfolioDetails(userId, portfolioSysId)
      expect(data).toBe('error')
    })

    it('Test getPortfolioDetails() throws error', async () => {
      const userId = '1234'
      const portfolioSysId = '5678'
      mockAxios.reset()
      mockAxios.onGet(`${APINAME}/details`, {params: {userId: userId, portfolioId: portfolioSysId}})
        .reply(400, {result: {error: 'error'}})
      expect(async () => await portfolioApi.getPortfolioDetails(userId, portfolioSysId)).rejects
        .toThrowError()
    })

  })

