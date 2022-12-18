/* eslint-disable camelcase */

import Vuex, {Store} from 'vuex';
import {createLocalVue} from '@vue/test-utils';
import {getModule} from 'vuex-module-decorators';
import {IGCEStore} from '.';
import {RequirementsCostEstimateDTO} from "@/api/models";
import {api} from "@/api";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("IGCE Store", () => {
  let igceStore: IGCEStore;

  const requirementsCostEstimate: RequirementsCostEstimateDTO = {
    acquisition_package: "",
    has_DOW_and_PoP: "",
    architectural_design_current_environment: {
      option: "",
      estimated_values: []
    },
    architectural_design_performance_requirements: {
      option: "",
      estimated_values: []
    },
    fee_specs: {
      is_charged: "",
      percentage: null
    },
    how_estimates_developed: {
      cost_estimate_description: "",
      previous_cost_estimate_comparison: {
        options: "",
        percentage: null
      },
      tools_used: "",
      other_tools_used: ""
    },
    optimize_replicate: {
      option: "",
      estimated_values: []
    },
    surge_requirements: {
      capabilities: "",
      capacity: null
    },
    training: [],
    travel: {
      option: "",
      estimated_values: []
    }
  }

  beforeEach(() => {
    const createStore = (storeOptions = {}): Store<{ igceStore: IGCEStore }> =>
      new Vuex.Store({...storeOptions});
    igceStore = getModule(IGCEStore, createStore());
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe("IGCE Store", () => {
    describe("set functions", () => {
      it('Test loadRequirementsCostEstimate()- should load req cost estimate from api',
        async () => {
          jest.spyOn(api.requirementsCostEstimateTable, "retrieve").mockImplementation( () => {
            return Promise.resolve(requirementsCostEstimate)
          })
          await igceStore.loadRequirementsCostEstimateDataById("some_sys_id");
          expect(api.requirementsCostEstimateTable.retrieve).toHaveBeenCalled();
        })

      // it('Test loadRequirementsCostEstimate()- should catch the error', async () => {
      //   await igceStore.setRequirementsCostEstimate(requirementsCostEstimate);
      //   jest.spyOn(api.requirementsCostEstimateTable, "retrieve").mockImplementation(() => {
      //     throw Error;
      //   })
      //   jest.spyOn(igceStore, "setRequirementsCostEstimate");
      //   try {
      //     await igceStore.loadRequirementsCostEstimateDataById("some_id");
      //   } catch {
      //     await expect(igceStore.setRequirementsCostEstimate).not.toHaveBeenCalled();
      //   }
      // })
    })
  })
})
