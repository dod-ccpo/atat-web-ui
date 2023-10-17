/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, shallowMount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import Portfolio from "./Portfolio.vue";
import ATATCharts from "@/store/charts";
import PortfolioStore, { FundingAlertTypes } from "@/store/portfolio";
import { PortfolioDetailsDTO } from "types/Global";
import { UserDTO } from "@/api/models";

Vue.use(Vuetify);
const costs= [
  {
    is_actual: "true",
    value: "10",
  },
  {
    is_actual: "true",
    value: "20",
  },
  {
    is_actual: "true",
    value: "30",
  },
  {
    is_actual: "true",
    value: "40",
  },
  {
    is_actual: "true",
    value: "50",
  },
  {
    is_actual: "true",
    value: "60",
  },
  {
    is_actual: "true",
    value: "70",
  },
  {
    is_actual: "true",
    value: "80",
  },
  {
    is_actual: "true",
    value: "90",
  },
  {
    is_actual: "true",
    value: "100",
  },
];

const mockPortfolioCardData: PortfolioDetailsDTO ={
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
        sys_created_on: '',
        sys_id: ''
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

describe("Testing Portfolio", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Portfolio, {
      vuetify,
      localVue,
    });
  });

  afterEach(()=>{
    jest.clearAllMocks();
  })


  describe("testing Portfolio", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("Test chartDataColorsTranslucent ", () => {

      const colorMadTranslucense = wrapper.vm.$data.chartDataColorsTranslucent;

      const dataColors = ATATCharts.chartDataColors;
      Object.values(dataColors).forEach((color, index) => {
        expect(colorMadTranslucense[index]).toBe(color + "33");
      });
    });


    it("Test loadOnEnter", async () => {
      vuetify = new Vuetify();

      wrapper = shallowMount(Portfolio, {
        vuetify,
        localVue,
      });
      await PortfolioStore.setCurrentPortfolioDetails(mockPortfolioCardData)
      await wrapper.vm.loadOnEnter();

    });

    it("Test portfolioSyncDate() => returns empty string",async () =>{
      const dateStr = wrapper.vm.portfolioSyncDate;
      expect(dateStr).toBe("")
    })

    it("Test portfolioSyncDate() => returns date string",async () =>{
      PortfolioStore.currentPortfolio.lastCostDataSync = "2023-08-23 01:44:18"
      const dateStr = wrapper.vm.portfolioSyncDate;
      expect(dateStr).toBe("Last sync: Aug. 23 at 0144")
    })

    it("Test calculateBurndown() => uniqueClinNumbersInCostsData.length && this.endOfMonthForecast",
      async () =>{
        await wrapper.setData({
          costs: costs,
          totalPortfolioFunds: 9000,
          endOfMonthForecast: 900
        })
        await wrapper.vm.calculateBurnDown();
        expect(Math.round(wrapper.vm.$data.estimatedRemainingPercent)).toBeCloseTo(94)
        expect(Math.round(wrapper.vm.$data.estimatedFundsToBeInvoicedPercent)).toBeCloseTo(6)
      })
    it(`Test calculateBurndown() => uniqueClinNumbersInCostsData.length && this.endOfMonthForecast
      with full funds spent`, async () =>{
      await wrapper.setData({
        costs: costs,
        totalPortfolioFunds: 9000,
        endOfMonthForecast: 900,
        fundsSpentPercent: 50
      })
      await wrapper.vm.calculateBurnDown();
      expect(Math.round(wrapper.vm.$data.estimatedRemainingPercent)).toBeCloseTo(44)
      expect(Math.round(wrapper.vm.$data.estimatedFundsToBeInvoicedPercent)).toBeCloseTo(6)
    })
    
    it(`Test calculateBurndown() => uniqueClinNumbersInCostsData.length && this.monthsInPoP`, 
      async () =>{
        await wrapper.setData({
          costs: costs,
          totalPortfolioFunds: 9000,
          endOfMonthForecast: 0,
          fundsSpentPercent: 50,
          monthsInPoP: 10
        })
        await wrapper.vm.calculateBurnDown();
        expect(Math.round(wrapper.vm.$data.estimatedRemainingPercent)).toBeCloseTo(44)
      })

    it(`Test calculateBurndown() => full funds spent`, async () =>{
      await wrapper.setData({
        costs: costs,
        totalPortfolioFunds: 9000,
        endOfMonthForecast: 0,
        fundsSpentPercent: 100
      })
      await wrapper.vm.calculateBurnDown();
      expect(wrapper.vm.$data.estimatedRemainingPercent).toBe(0)
      expect(wrapper.vm.$data.estimatedFundsToBeInvoicedPercent).toBe(0)
      expect(wrapper.vm.$data.zeroFundsRemaining).toBe(true)
    })

    it(`Test fundingAlertType() => FundingAlert zerofundsremaining`, async () =>{
      await wrapper.setData({
        isLoading: false,
        zeroFundsRemaining: true
      })
      expect(wrapper.vm.fundingAlertType).toBe(FundingAlertTypes.POPZeroFundsRemaining)
    })

    it(`Test endOfMonthTrendIconName() => endOfMonthXaaSForecastTrendPercent > 0`, async () =>{
      await wrapper.setData({
        endOfMonthXaaSForecastTrendPercent: 1
      })
      expect(wrapper.vm.endOfMonthTrendIconName).toBe('trendingUp')
    })

    it(`Test endOfMonthTrendIconName() => endOfMonthXaaSForecastTrendPercent = 0`, async () =>{
      await wrapper.setData({
        endOfMonthXaaSForecastTrendPercent: 0
      })
      expect(wrapper.vm.endOfMonthTrendIconName).toBe('trendingDown')
    })
    
    it(`Test endOfMonthTrendIconColor() => endOfMonthXaaSForecastTrendPercent > 0`, async () =>{
      await wrapper.setData({
        endOfMonthXaaSForecastTrendPercent: 1
      })
      expect(wrapper.vm.endOfMonthTrendIconColor).toBe('error')
    })

    it(`Test endOfMonthTrendIconColor() => endOfMonthXaaSForecastTrendPercent = 0`, async () =>{
      await wrapper.setData({
        endOfMonthXaaSForecastTrendPercent: 0
      })
      expect(wrapper.vm.endOfMonthTrendIconColor).toBe('success-dark')
    })

    it(`Test endOfMonthTrendTextColor() => endOfMonthXaaSForecastTrendPercent > 0`, async () =>{
      await wrapper.setData({
        endOfMonthXaaSForecastTrendPercent: 1
      })
      expect(wrapper.vm.endOfMonthTrendTextColor).toBe('text-error')
    })

    it(`Test endOfMonthTrendTextColor() => endOfMonthXaaSForecastTrendPercent = 0`, async () =>{
      await wrapper.setData({
        endOfMonthXaaSForecastTrendPercent: 0
      })
      expect(wrapper.vm.endOfMonthTrendTextColor).toBe('text-success-dark')
    })

  });

});