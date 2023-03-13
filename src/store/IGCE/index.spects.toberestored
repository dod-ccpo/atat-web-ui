/* eslint-disable camelcase */

import Vuex, {Store} from 'vuex';
import {createLocalVue} from '@vue/test-utils';
import {getModule} from 'vuex-module-decorators';
import {IGCEStore} from '.';
import {RequirementsCostEstimateFlat} from "@/api/models";
import {api} from "@/api";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("IGCE Store", () => {
  let igceStore: IGCEStore;

  const requirementsCostEstimate: RequirementsCostEstimateFlat = {
    acquisition_package: "",
    architectural_design_current_environment_estimated_values: "",
    architectural_design_current_environment_option: "",
    architectural_design_performance_requirements_estimated_values: "",
    architectural_design_performance_requirements_option: "",
    contracting_office_other_charges_fee: "",
    contracting_office_other_fee_percentage: null,
    has_dow_and_pop: "",
    how_est_dev_cost_estimate_description: "",
    how_est_dev_other_tools_used: "",
    how_est_dev_prev_cost_estimate_comp_option: "",
    how_est_dev_prev_cost_estimate_comp_percentage: null,
    how_est_dev_tools_used: "",
    optimize_replicate_estimated_values: "",
    optimize_replicate_option: "",
    surge_requirement_capabilities: "",
    surge_requirement_capacity: null,
    training: "",
    travel_estimated_values: "",
    travel_option: "",
    how_est_dev_contracting_office_other_charges_fee: '',
    how_est_dev_contracting_office_other_fee_percentage: null
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
          jest.spyOn(api.requirementsCostEstimateTable, "getQuery").mockImplementation(
            () => {
              return Promise.resolve([requirementsCostEstimate])
            })
          await igceStore.loadRequirementsCostEstimateDataByPackageId("some_sys_id");
          expect(api.requirementsCostEstimateTable.getQuery).toHaveBeenCalled();
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
