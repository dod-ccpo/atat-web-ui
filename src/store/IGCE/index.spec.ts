/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { getModule } from 'vuex-module-decorators';
import {Fee, IGCEStore, SurgeRequirements, TravelEstimateNeeds} from '.';
import Periods from '../periods';
import DescriptionOfWork from '../descriptionOfWork';
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

  const feeSpecs: Fee = {
    isCharged: 'YES',
    percentage: '15'
  }

  const legitPeriod = [
    {
      "period_unit": "YEAR",
      "period_unit_count": "1",
      "period_type": "BASE",
      "option_order": "1"
    }
  ]

  beforeEach(() => {
    const createStore = (storeOptions = {}): Store<{ igceStore: IGCEStore }> => 
      new Vuex.Store({ ...storeOptions });
    igceStore = getModule(IGCEStore, createStore());
  })

  afterEach(()=>{
    jest.clearAllMocks();
  })

  describe("IGCE Store", ()=>{
    describe("set functions", ()=>{
      it("setTravelEstimateNeeds(needs) to set store properties", async()=>{
        igceStore.setTravelEstimateNeeds(travelEstimateNeeds);
        expect(igceStore.travelEstimateNeeds.ceilingPrice).toBe("single")
      });

      it("setTravelEstimateNeeds(needs) to set store properties", async()=>{
        igceStore.setSurgeRequirements(surgeRequirements);
        expect(igceStore.surgeRequirements.capabilities).toBe("13")
      })

      it("setFeeSpecs(fee) to set store properties", async()=>{
        igceStore.setFeeSpecs(feeSpecs);
        expect(igceStore.feeSpecs.percentage).toBe("15")
      })

      it("setHasDOWandPop() with undefined periods to return false", async()=>{
        igceStore.setHasDOWandPop();
        expect(igceStore.hasDOWandPoP).toBe(false)
      })

      it("setHasDOWandPop() to set store properties", async()=>{
        Periods.setPeriods(legitPeriod)
        DescriptionOfWork.setIsIncomplete(false);
        igceStore.setHasDOWandPop();
        expect(igceStore.hasDOWandPoP).toBe(true)
      })
    });

    describe("GET functions()", ()=>{
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

      it("getFeeSpecs() and successfully retrieve store properties", async()=>{
        igceStore.setFeeSpecs(feeSpecs);
        const fee = await igceStore.getFeeSpecs();
        expect(fee.percentage).toBe('15');
      })

      it("getHasDOWandPop() to retrieve store properties", async()=>{
        Periods.setPeriods(legitPeriod)
        DescriptionOfWork.setIsIncomplete(false);
        await igceStore.setHasDOWandPop();
        expect(await igceStore.getHasDOWandPoP()).toBe(true)
      })


    })
  })
})
