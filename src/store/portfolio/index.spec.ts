import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { PortfolioDataStore} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import Vue from "vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import UserStore from "@/store/user";
import {AlertDTO, PortfolioSummaryDTO, UserDTO} from '@/api/models';
import { Portfolio, PortfolioDetailsDTO} from 'types/Global';
import CurrentUserStore from '@/store/user';
import api from '@/api';
const localVue = createLocalVue();
localVue.use(Vuex);

/* eslint-disable camelcase */
const mockPortfolioDetails: PortfolioDetailsDTO = {
  name: "test portfolio",
  csp:"",
  csp_display:"",
  vendor: "",
  active_task_order:"",
  agency:"",
  agency_display:"",
  dod_component:"",
  last_cost_data_sync:"",
  task_order_number:"", // "1000000001234  << portfolio.active_task_order >>",
  sys_updated_on:"", // "2022-09-26 15:50:20 << portfolio.sys_updated_on >>",
  task_order_status:"", // "EXPIRED << task_order.task_order_status >>",
  pop_end_date:"", // "2022-12-31 << task_order.pop_end_date >>",
  pop_start_date:"", // "2022-01-01 << task_order.pop_start_date >>",
  funds_obligated: 0, // "<< sum of obligated values in all qualifying clins >>",
  portfolio_status:"", // "PROCESSING << portfolio.portfolio_status >>",
  portfolio_funding_status:"",
  portfolio_owner:"",
  portfolio_managers:"", // "a8f98bb0e1a5115206fe3a << portfolio.portfolio_managers>>",
  portfolio_viewers:"",
  funds_spent: 0, // "<< sum of value in cost table queried with task order number >>"
  task_orders: [],
  alerts: [],
  title:"",
  description:"",
  environments: [],
  last_updated:"",

}

const mockPortfolioSummary: PortfolioSummaryDTO =   {
  sys_id: "1234564869",
  name: "mock portfolio",
  csp: "",
  csp_display: "CSP_A",
  agency: "ARMY",
  vendor: "AWS",
  dod_component: "ARMY", // EJY - DOUBLE-CHECK this is still needed
  task_order_number: "123456",
  sys_updated_on: "2022-09-26 15:50:20", 
  task_order_status: "ACTIVE",
  pop_end_date: "2022-12-31",
  pop_start_date: "2022-01-01",
  funds_obligated: 10000,
  portfolio_status: "PROCESSING",
  portfolio_owner: "",
  portfolio_managers: "4567,1234",
  portfolio_viewers: "7890,5432",
  funds_spent: 5000,
  task_orders: [],
  active_task_order: "",
  alerts: [],
  portfolio_funding_status: "",
  last_cost_data_sync: ""
  /* eslint-enable camelcase */
}



describe("Portfolio Store", () => {
  let portfolioStore: PortfolioDataStore;

  beforeEach(() => {
    UserStore.setCurrentUser(UserStore.getInitialUser);
    UserStore.setInitialized(true);
    const createStore = (storeOptions: any = {}):
        Store<{ portfolio: any }> => new Vuex.Store({ ...storeOptions });
    portfolioStore = getModule(PortfolioDataStore, createStore());
    /* eslint-disable */ 
    AcquisitionPackage.setProjectOverview({
      title: "",
      scope: "",
      emergency_declaration:"",
      project_disclaimer: "",
      cjadc2: ""
    })
    /* eslint-enable */ 
    AcquisitionPackage.setOrganization({})
    // AcquisitionPackage.setAcquisitionPackage({
    //   contract_award: {
    //     link:"",
    //     value:"",
    //   },
    //   docgen_job_status: "",
    //   classification_level: {value: ""},
    //   contract_considerations: {value: ""},
    //   contract_type: {value: ""},
    //   current_contract: {value: ""},
    //   current_environment: {value: ""},
    //   docusign_envelope_id: "",
    //   environment_instance: "",
    //   fair_opportunity: {value: ""},
    //   funding_plans: "",
    //   gfe_overview: "",
    //   number: "",
    //   organization: {value: ""},
    //   period_of_performance: {value: ""},
    //   periods: "",
    //   project_overview: {value: ""},
    //   required_services: "",
    //   requirements_cost_estimate: {value: ""},
    //   sensitive_information: {value: ""},
    //   status: "",
    //   sys_created_by: "",
    //   sys_created_on: "",
    //   sys_updated_on: "",
    //   cor: "",
    //   acor: "",
    //   primary_contact: ""
    // })
  })
  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  it('getShowAddMembersModal() returns default result', async()=>{
    expect(await portfolioStore.getShowAddMembersModal).toBe(false);
  })

  it('setShowAddMembersModal() returns default result', async()=>{
    await portfolioStore.setShowAddMembersModal(false)
    expect(await portfolioStore.showAddMembersModal).toBe(false);
  })

  it('Test setStoreData- sets portfolio to the passed in value', async () => {
    const mockData: Portfolio = {
      title: "some title to test",
      description: "a description",
      status: "active",
      csp: "",
      agency: "mock Agency",
      createdBy: "jefferey tester",
      provisioned: "today",
      members: []
    }

    await portfolioStore.setCurrentPortfolio(mockData);
    Vue.nextTick(() => {
      expect(portfolioStore.currentPortfolio.title).toBe("some title to test")
    })
  })

  it('Test setAlerts- sets alerts to the passed in value', async () => {
    /* eslint-disable */ 
    const mockAlerts: AlertDTO[] = [
      {
        clin: "",
        task_order: "tsk_12345678",
        active: "true",
        alert_type: "SPENDING_ACTUAL",
        threshold_violation_amount: "75",
        last_notification_date: "",
        portfolio: "",
      },
      {
        clin: "",
        task_order: "tsk_12345678919",
        active: "true",
        alert_type: "TIME_REMAINING",
        threshold_violation_amount: "60",
        last_notification_date: "",
        portfolio: "",
      },
    ];
    /* eslint-enable */ 
    portfolioStore.setAlerts(mockAlerts);
    Vue.nextTick(() => {
      expect(portfolioStore.alerts).toBe(mockAlerts);
    })
  })

  it('getPortolioData()', async()=>{
    const dummyTitle = "dummy Title";
    await portfolioStore.setCurrentPortfolio({
      title: dummyTitle
    });
    const portfolio = await portfolioStore.getPortfolioData();
    expect(portfolio.title).toBe(dummyTitle)
  })

  it('setShowLeavePortfolioModal()', async()=>{
    portfolioStore.setShowLeavePortfolioModal(true)
    expect(portfolioStore.showLeavePortfolioModal).toBe(true)
  })

  it('leavePortfolio()', async()=>{
    /* eslint-disable */ 
    const mockUser: UserDTO = {
      last_login_time: "01/02/03",
      name: "Test User",
      first_name: "Test",
      last_name: "User",
      user_name: "TestUser",
      email: "Test@email.mil",
      company: "Rando company",
      mobile_phone: "123-456-7890",
      phone: "123-456-7890",
      home_phone: "123-456-7890",
      title: "User Title",
      sys_id: '1234'
    }
    /* eslint-enable */ 
    const mockSetCurrentPortfolioMembers = jest.spyOn(portfolioStore, "setCurrentPortfolioMembers")
      .mockImplementation()
    await portfolioStore.setCurrentPortfolio(mockPortfolioSummary)
    CurrentUserStore.setCurrentUser(mockUser)
    await portfolioStore.leavePortfolio()
    expect(mockSetCurrentPortfolioMembers).toBeCalled()
  })

  it ("setCurrentPortfolioMembers()", async() => {
    const portfolio: Portfolio = {
      /* eslint-disable */
      sysId: "132345",
      portfolio_owner: "11111",
      portfolio_managers: "22222,33333",
      portfolio_viewers: "44444,555555",
      /* eslint-enable */       
    }

    // await portfolioStore.setFooToTrue();
    // expect(portfolioStore.foo).toBeTruthy;

    
    const updateMock = jest.spyOn(api.portfolioTable, 'update').mockImplementation();
    // jest.spyOn(portfolioStore, "getSelectedPortfolioData").mockImplementation(
    //   ()=>Promise.resolve(mockPortfolioDetails)
    // )
    // const mockGetSelectedPortfolioData = jest.spyOn(portfolioStore, "getSelectedPortfolioData")
    //   .mockImplementation();     
    // const fooMock = jest.spyOn(portfolioStore, "setFooToTrue").mockImplementation(); 
    await portfolioStore.setCurrentPortfolioMembers(portfolio);
    // expect(fooMock).toBeCalled()
    // expect(updateMock).toBeCalled();
    Vue.nextTick(async()=> {
      expect(updateMock).toBeCalled();
    })
    // expect("getSelectedPortfolioData").toBeCalled();

  })



})


