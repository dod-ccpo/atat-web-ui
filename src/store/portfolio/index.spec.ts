/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {FundingAlertTypes, PortfolioDataStore,
  getThresholdAmount, thresholdAtOrAbove} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import Vue from "vue";
import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import UserStore from "@/store/user";
import { AlertDTO } from '@/api/models';
import { MemberInvites, Portfolio } from 'types/Global';
const localVue = createLocalVue();
localVue.use(Vuex);


describe("Portfolio Store", () => {
  let portfolioStore: PortfolioDataStore;

  beforeEach(() => {
    UserStore.setCurrentUser(UserStore.getInitialUser);
    UserStore.setInitialized(true);
    const createStore = (storeOptions: any = {}):
        Store<{ portfolio: any }> => new Vuex.Store({ ...storeOptions });
    portfolioStore = getModule(PortfolioDataStore, createStore());
    AcquisitionPackage.setProjectOverview({
      title: "",
      scope: "",
      emergency_declaration:"",
      project_disclaimer: ""
    })
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

  it('Test setPortfolioData- sets portfolio to the passed in value', async () => {
    const mockData = {
      title: "some title to test",
      description: "a description",
      status: Statuses.Active.value,
      csp: "",
      agency: "mock Agency",
      createdBy: "jefferey tester",
      provisioned: "today",
      members: []
    }
    const updateEmailObj = {
      members:[{email:"testemail@test.mil"}]
    }
    
    await portfolioStore.setPortfolioData(mockData);
    await portfolioStore.setPortfolioData(updateEmailObj);
    expect(portfolioStore.currentPortfolio.title).toBe("some title to test")
  })

  it('getStatus() returns default result', async()=>{
    expect(await portfolioStore.getStatus).toBe(Statuses.Active.value);
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

    await portfolioStore.setPortfolioData(mockData);
    Vue.nextTick(() => {
      expect(portfolioStore.currentPortfolio.title).toBe("some title to test")
    })
  })

  it('Test getFundingTrackerAlerts', async () => {
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
    
    jest.spyOn(portfolioStore, "getAlerts").mockReturnValue(
      new Promise(resolve=>resolve(mockAlerts))
    );
    const fundingAlertData = await portfolioStore.getFundingTrackerAlert('');
    Vue.nextTick(() => {
      expect(fundingAlertData.fundingAlertType).toBe(FundingAlertTypes.POPExpiresSoonWithLowFunds);
      expect(fundingAlertData.hasLowFundingAlert).toBe(true);
      expect(fundingAlertData.daysRemaining).toBe(60);
      expect(fundingAlertData.spendingViolation).toBe(75);
    })
  })


  it('Test setAlerts- sets alerts to the passed in value', async () => {
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
    portfolioStore.setAlerts(mockAlerts);
    Vue.nextTick(() => {
      expect(portfolioStore.alerts).toBe(mockAlerts);
    })
  })

  it('Test getFundingTrackerAlerts Alerts Detect Delinquint', async () => {
    const mockAlerts: AlertDTO[] = [
      {
        clin: "",
        task_order: "tsk_12345678",
        active: "true",
        alert_type: "SPENDING_ACTUAL",
        threshold_violation_amount: "100",
        last_notification_date: "",
        portfolio: "",
      }
    ];
    
    jest.spyOn(portfolioStore, "getAlerts").mockReturnValue(
      new Promise(resolve=>resolve(mockAlerts))
    );
    const fundingAlertData = await portfolioStore.getFundingTrackerAlert('');
    Vue.nextTick(() => {
      expect(fundingAlertData.fundingAlertType).toBe(FundingAlertTypes.POPFundsAt100Percent);
      expect(fundingAlertData.hasLowFundingAlert).toBe(true);
    })
  })

  it('saveMembers() add members to Portfolio.portflio.members', async()=>{
    const memberInvites: MemberInvites = {
      emails:["dummyemail01@mail.mil", "dummyemail02@mail.mil"],
      role: "Viewer"
    } 
    portfolioStore.currentPortfolio.members = [];
    await portfolioStore.saveMembers(memberInvites)
    expect(portfolioStore.currentPortfolio.members?.length).toBe(2)
  })

  it('getPortolioData()', async()=>{
    const dummyTitle = "dummy Title";
    portfolioStore.setPortfolioData(
      {
        title: dummyTitle
      }
    )
    const portfolio = await portfolioStore.getPortfolioData();
    expect(portfolio.title).toBe(dummyTitle)
  })

  it('Test getFundingTrackerAlerts Alerts Detect Expired', async () => {
    const mockAlerts: AlertDTO[] = [
      {
        clin: "",
        task_order: "tsk_12345678919",
        active: "true",
        alert_type: "TIME_REMAINING",
        threshold_violation_amount: "-30",
        last_notification_date: "",
        portfolio: "",
      },
    ];
    
    jest.spyOn(portfolioStore, "getAlerts").mockReturnValue(
      new Promise(resolve=>resolve(mockAlerts))
    );
    const fundingAlertData = await portfolioStore.getFundingTrackerAlert('');
    Vue.nextTick(() => {
      expect(fundingAlertData.fundingAlertType).toBe(FundingAlertTypes.POPExpired);
      expect(fundingAlertData.hasLowFundingAlert).toBe(true);
    })
  })

  it('Test getThreshold Amount', async () => {
    const spendingViolation = "75%";
    const amount = getThresholdAmount(spendingViolation);
    expect(amount).toBe(75);
  })

  
  it('Test thresholdAtOrAbove or above Amount', async () => {
    const spendingViolation = "75%";
    const metThreshold = thresholdAtOrAbove(spendingViolation, 75);
    expect(metThreshold).toBe(true);
  })

})


