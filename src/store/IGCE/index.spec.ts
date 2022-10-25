/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { OrganizationDataStore } from "@/store/organizationData/index";
import { getModule } from 'vuex-module-decorators';
import api from "@/api"
import {IGCEStore, SurgeRequirements, TravelEstimateNeeds} from '.';
const localVue = createLocalVue();
localVue.use(Vuex);

describe("Organization Store", () => {
  let igceStore: IGCEStore;

  const travelEstimateNeeds: TravelEstimateNeeds = {
    ceilingPrice: 'single',
    estimatedTravelCosts: ['1234.56']
  }

  const surgeRequirements: SurgeRequirements = {
    capacity: 'YES',
    capabilities: '13'
  }

  beforeEach(() => {
    const createStore = (storeOptions = {}): Store<{ igceStore: IGCEStore }> => 
      new Vuex.Store({ ...storeOptions });
    igceStore = getModule(IGCEStore, createStore());
  })

  afterEach(()=>{
    jest.clearAllMocks();
  })

  describe("IGCE Store", ()=>{
    it("setTravelEstimateNeeds(needs) to set store properties", async()=>{
      igceStore.setTravelEstimateNeeds(travelEstimateNeeds);
      expect(igceStore.travelEstimateNeeds.ceilingPrice).toBe(
        "single"
      )
    });

    it("setTravelEstimateNeeds(needs) to set store properties", async()=>{
      igceStore.setSurgeRequirements(surgeRequirements);
      expect(igceStore.surgeRequirements.capabilities).toBe(
        "13"
      )
    })

    it("getTravelEstimateNeeds(needs) and successfully retrieve store properties", async()=>{
      igceStore.setTravelEstimateNeeds(travelEstimateNeeds);
      const teNeeds = await igceStore.getTravelEstimateNeeds();
      expect(teNeeds.ceilingPrice).toBe('single');
    })

    it("getSurgeRequirements(needs) and successfully retrieve store properties", async()=>{
      igceStore.setSurgeRequirements(surgeRequirements);
      const surge = await igceStore.getSurgeRequirements();
      expect(surge.capabilities).toBe('13');
    })


  })

 

})


