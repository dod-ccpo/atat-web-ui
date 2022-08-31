/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import {PortfolioDataStore} from "@/store/portfolio/index";
import { getModule } from 'vuex-module-decorators';
import storeHelperFunctions  from "../helpers";
import Vue from "vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
const localVue = createLocalVue();
localVue.use(Vuex);


describe("Portfolio Store", () => {
  let portfolioStore: PortfolioDataStore;

  beforeEach(() => {
    const createStore = (storeOptions: any = {}):
        Store<{ portfolio: any }> => new Vuex.Store({ ...storeOptions });
    portfolioStore = getModule(PortfolioDataStore, createStore());
  })
  afterEach(()=>{
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
    await portfolioStore.initialize();
    expect(portfolioStore.initialized).toBe(true)
    expect(portfolioStore.portfolio.title).toBe("Mock Title")
  })

  it('Test initialize()- sets portfolio to the AcquisitionPackage data', async () => {
    AcquisitionPackage.setProjectOverview({
      title: "test title",
      scope: "testing scope",
      emergency_declaration:""
    })
    AcquisitionPackage.setOrganization({service_agency: "FBI"})
    AcquisitionPackage.setAcquisitionPackage({
      classification_level: "",
      contact: "",
      contract_considerations: "",
      contract_type: "",
      current_contract: "",
      current_environment: "",
      docusign_envelope_id: "",
      environment_instance: "",
      fair_opportunity: "",
      funding_plans: "",
      gfe_overview: "",
      number: "",
      organization: "",
      period_of_performance: "",
      periods: "",
      project_overview: "",
      required_services: "",
      requirements_const_estimate: "",
      sensitive_information: "",
      status: "",
      sys_created_by: "Johnnny test",
      sys_created_on: "Today",
      sys_updated_on: "Tomorrow"})

    await portfolioStore.initialize();
    Vue.nextTick(() => {
      expect(portfolioStore.portfolio.createdBy).toBe("Johnnny test")
    })
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
    await portfolioStore.setPortfolioData(updateEmailObj);
    expect(portfolioStore.portfolio.title).toBe("some title to test")
  })

  it('Test setStoreData- sets portfolio to the passed in value', async () => {
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

    await portfolioStore.setStoreData(JSON.stringify(mockData));
    Vue.nextTick(() => {
      expect(portfolioStore.portfolio.title).toBe("some title to test")
    })
  })

})


