import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { PortfolioDataStore} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import Vue from "vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import UserStore from "@/store/user";
import {AlertDTO, PortfolioSummaryDTO, UserDTO} from '@/api/models';
import { Portfolio, PortfolioDTO, PortfolioDetailsDTO, User} from 'types/Global';
import CurrentUserStore from '@/store/user';
import api from '@/api';
const localVue = createLocalVue();
localVue.use(Vuex);

/* eslint-disable camelcase */
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

const mockPortfolioDTO: PortfolioDTO = {
  /* eslint-disable camelcase */
  portfolio_users: {
    creator: {
      name: "Adam", 
      sys_id: "123",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      role: "Creator"
    },
    owner: {
      name: "Jane", 
      sys_id: "456",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      role: "Owner"
    },
    managers: [{name: "Carl", role: "Manager"}, {name: "Bart", role: "Manager"}],
    viewers: [{name: "Adam", role: "Viewer"}, {name: "Carl", role: "Viewer"}], 
  }
  /* eslint-enable camelcase */    
}

const mockPortfolio: Portfolio = {
  /* eslint-disable */
  sysId: "132345",
  portfolio_owner: "11111",
  portfolio_managers: "22222,33333",
  portfolio_viewers: "44444,555555",
  clins: [
    {
      clin_number: "0001",
      clin_status: "",
      costs: [],
      funds_obligated: 0,
      funds_total: 0,
      idiq_clin: "01",
      pop_end_date: "",
      pop_start_date: "",
      sys_id: "8978798"
    }
  ]
  /* eslint-enable */       
}

const mockPortfolioDetailsDTO: PortfolioDetailsDTO = {
  portfolio: mockPortfolioDTO,
  portfolioId: "123456789"
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
    jest.spyOn(api.portfolioTable, 'update')
      .mockImplementation(() => Promise.resolve(mockPortfolioSummary));
    jest.spyOn(portfolioStore, "updatePortfolioMembers")
      .mockImplementation(() => Promise.resolve());
    jest.spyOn(portfolioStore, "getSelectedPortfolioData")
      .mockImplementation(() => Promise.resolve(mockPortfolioDetailsDTO));

    const memberDetailMock = jest.spyOn(portfolioStore, "populatePortfolioMembersDetail")
      .mockImplementation(() => Promise.resolve())

    await portfolioStore.setCurrentPortfolioMembers(mockPortfolio)
    Vue.nextTick(() => {
      expect(memberDetailMock).toBeCalled();      
    })
  });

  it ("updatePortfolioMembers()", async () => {
    const updateMock = jest.spyOn(api.portfolioTable, 'update')
      .mockImplementation(() => Promise.resolve(mockPortfolioSummary));
    const members = {} as PortfolioSummaryDTO;
    await portfolioStore.updatePortfolioMembers({sysId: "1234", members });
    Vue.nextTick(()=> {
      expect(updateMock).toBeCalled();
    })
  })


  it ("populatePortfolioMembersDetail()", async() => {
    await portfolioStore.populatePortfolioMembersDetail(mockPortfolioDTO);
    Vue.nextTick(() => {
      const members = portfolioStore.currentPortfolio.members;
      if (members?.length) {
        expect(members[0].fullName).toBe("Jane");
        expect(members[1].fullName).toBe("Adam");
      }
      const setMembersMock = jest.spyOn(portfolioStore, "doSetPortfolioMembers")
        .mockImplementation();
      Vue.nextTick(() => {
        expect(setMembersMock).toBeCalled();
      })
    });

  });

  it ("inviteMembers()", async () => {
    const newMembers: User[] = [];
    const updateMock = jest.spyOn(api.portfolioTable, 'update')
      .mockImplementation(() => Promise.resolve(mockPortfolioSummary));
    await portfolioStore.inviteMembers(newMembers);

    const portfolioDetailsMock = jest.spyOn(portfolioStore, "getSelectedPortfolioData")
      .mockImplementation(() => Promise.resolve(mockPortfolioDetailsDTO));

    const memberDetailMock = jest.spyOn(portfolioStore, "populatePortfolioMembersDetail")
      .mockImplementation(() => Promise.resolve())

    Vue.nextTick(() => {
      expect(updateMock).toBeCalled();
      expect(portfolioDetailsMock).toBeCalled();
      expect(memberDetailMock).toBeCalled();
    });
  });

});


