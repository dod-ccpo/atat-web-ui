/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {RequirementsCostEstimateDTO} from "@/api/models";
import _ from "lodash";
import Periods from "@/store/periods";
import DescriptionOfWork from "@/store/descriptionOfWork";

export const defaultRequirementsCostEstimate = (): RequirementsCostEstimateDTO => {
  return {
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
      tools_used: {
        AWS: "",
        GOOGLE_CLOUD: "",
        MICROSOFT_AZURE: "",
        ORACLE_CLOUD: "",
        PREVIOUSLY_PAID_PRICES: "",
        OTHER: "",
        OTHER_TOOLS: "",
      }
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
}

@Module({
  name: "IGCEStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class IGCEStore extends VuexModule {
  public requirementsCostEstimate: RequirementsCostEstimateDTO | null = null;

  @Action({rawError: true})
  public async reset(): Promise<void> {
    this.doReset();
  }

  @Mutation
  public doReset(): void {
    this.requirementsCostEstimate = _.cloneDeep(defaultRequirementsCostEstimate());
  }

  @Action
  public async getRequirementsCostEstimate(): Promise<RequirementsCostEstimateDTO> {
    return this.requirementsCostEstimate as RequirementsCostEstimateDTO;
  }

  @Action
  public async setRequirementsCostEstimate(value: RequirementsCostEstimateDTO): Promise<void> {
    await this.doSetRequirementsCostEstimate(value);
  }

  @Mutation
  public async doSetRequirementsCostEstimate(value: RequirementsCostEstimateDTO): Promise<void> {
    this.requirementsCostEstimate = value;
  }

  @Mutation
  public setHasDOWandPop(): void {
    const requirementCostEstimate = this.requirementsCostEstimate as RequirementsCostEstimateDTO;
    if ((Periods.periods && Periods.periods.length > 0) && !DescriptionOfWork.isIncomplete) {
      requirementCostEstimate.has_DOW_and_PoP = "YES";
    } else {
      requirementCostEstimate.has_DOW_and_PoP = "NO";
    }
  }

  // TODO: write other setters and getters as needed.

  @Action
  public async initializeRequirementsCostEstimate(): Promise<void> {
    await this.doInitializeRequirementsCostEstimate();
  }

  @Mutation
  public async doInitializeRequirementsCostEstimate(): Promise<void> {
    // TODO: need to initialize this in SNOW by making api call. Then set the response from snow
    this.requirementsCostEstimate = _.cloneDeep(defaultRequirementsCostEstimate());
    // TODO: other initializations outside of requirements cost estimate
  }

  /**
   * Loads the Requirements cost estimate data using the acquisition package sys id.
   * And then sets the context such that the data could be retrieved using the
   * getters (getRequirementsCostEstimate)
   * @param reqCostEstimateSysId - sys_id of the acquisition package table record
   */
  @Action({rawError: true})
  public async loadRequirementsCostEstimateDataById(reqCostEstimateSysId: string): Promise<void> {
    const requirementsCostEstimate = await api.requirementsCostEstimateTable
      .retrieve(reqCostEstimateSysId);
    if (requirementsCostEstimate) {
      await this.doSetRequirementsCostEstimate(requirementsCostEstimate);
    } else {
      await this.initializeRequirementsCostEstimate();
    }
  }

  /**
   * Saves requirements cost estimate record and sets the context.
   */
  @Action({rawError: true})
  public async saveRequirementsCostEstimate(
    requirementCostEstimate: RequirementsCostEstimateDTO)
    : Promise<boolean> {
    try {
      // TODO: perform any data transformation using spread construct.
      const updatedReqCostEstimate = await api.requirementsCostEstimateTable
        .update(requirementCostEstimate.sys_id as string, requirementCostEstimate);
      const storeRequirementsCostEstimate = await this.getRequirementsCostEstimate();
      storeRequirementsCostEstimate.sys_updated_on = updatedReqCostEstimate.sys_updated_on;
      storeRequirementsCostEstimate.sys_updated_by = updatedReqCostEstimate.sys_updated_by;
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving requirements cost estimate ${error}`);
    }
  }
}

const IGCE = getModule(IGCEStore);
export default IGCE;
