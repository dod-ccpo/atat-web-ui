/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {FundingAlertTypes, PortfolioDataStore} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import Vue from "vue";
import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import UserStore from "@/store/user";
import {AlertDTO, PortfolioSummaryDTO} from '@/api/models';
import {MemberInvites, Portfolio, User} from 'types/Global';
import {api} from "@/api";
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
    const doSetCurrentUserRoleMock = 
      jest.spyOn(portfolioStore, "doSetCurrentUserRole").mockImplementation();

    await portfolioStore.setPortfolioData(mockData);
    expect(portfolioStore.currentPortfolio.title).toBe("some title to test")
    expect (doSetCurrentUserRoleMock).toHaveBeenCalled();
  })

  it('getStatus() returns default result', async()=>{
    expect(portfolioStore.getStatus).toBe(Statuses.Active.value);
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


  it('saveMembers() add members to Portfolio.portflio.members', async()=>{
    const memberInvites: User[] = [{
      firstName: "FN",
      lastName: "LN",
      fullName: "FN",
      email: "testemail@mail.mil",
      role: "Viewer",
      phoneNumber: "",
      phoneExt: "",
      designation: "",
      agency: "Test Agency",
      sys_id: "mem_abc"
    }]
    portfolioStore.currentPortfolio.members = [];
    jest.spyOn(api.portfolioTable, "update").mockImplementation(
      ()=>Promise.resolve({} as unknown as PortfolioSummaryDTO));
    await portfolioStore.inviteMembers(memberInvites)
    expect(portfolioStore.currentPortfolio.members?.length).toBe(1)
  })

  it('getPortolioData()', async()=>{
    const dummyTitle = "dummy Title";
    await portfolioStore.setPortfolioData({
      title: dummyTitle
    });
    const portfolio = await portfolioStore.getPortfolioData();
    expect(portfolio.title).toBe(dummyTitle)
  })

})


