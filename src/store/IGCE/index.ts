/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule,} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {IgceEstimateDTO, ReferenceColumn, RequirementsCostEstimateDTO} from "@/api/models";
import _ from "lodash";
import Periods from "@/store/periods";
import DescriptionOfWork from "@/store/descriptionOfWork";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ClassificationRequirements from "@/store/classificationRequirements";
import {AxiosRequestConfig} from "axios";

export const defaultRequirementsCostEstimate = (): RequirementsCostEstimateDTO => {
  return {
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
}

export interface CostEstimate {
  labelShort: string,
  sysId: string,
  offerings: Record<string, string|number|boolean>[]
}

@Module({
  name: "IGCEStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class IGCEStore extends VuexModule {
  public requirementsCostEstimate: RequirementsCostEstimateDTO | null = null;
  public igceEstimateList: IgceEstimateDTO[] = [];

  @Action({rawError: true})
  public async reset(): Promise<void> {
    this.doReset();
  }

  costEstimates : CostEstimate[] = []

  @Mutation
  public doReset(): void {
    this.requirementsCostEstimate = _.cloneDeep(defaultRequirementsCostEstimate());
    this.igceEstimateList = [];
  }

  @Action
  public async getRequirementsCostEstimate(): Promise<RequirementsCostEstimateDTO> {
    return this.requirementsCostEstimate as RequirementsCostEstimateDTO;
  }

  @Action
  public async setRequirementsCostEstimate(value: RequirementsCostEstimateDTO): Promise<void> {
    await this.doSetRequirementsCostEstimate(value);
    await this.saveRequirementsCostEstimate();
  }

  @Mutation
  public async doSetRequirementsCostEstimate(value: RequirementsCostEstimateDTO): Promise<void> {
    this.requirementsCostEstimate = this.requirementsCostEstimate
      ? Object.assign(this.requirementsCostEstimate, value)
      : value;
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
    this.requirementsCostEstimate = await api.requirementsCostEstimateTable
      .create(defaultRequirementsCostEstimate());
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
   * Saves requirements cost estimate record that is in the store and sets the context. The
   * caller has to ensure that the store data is updated before calling this function.
   */
  @Action({rawError: true})
  public async saveRequirementsCostEstimate(): Promise<boolean> {
    return true;
    /*try {
      // TODO: perform any data transformation using spread construct.
      // TODO: uncomment below 4 statements after SNOW table update
      /!*const storeRequirementsCostEstimate = await this.getRequirementsCostEstimate();
      const updatedReqCostEstimate = await api.requirementsCostEstimateTable
        .update(storeRequirementsCostEstimate.sys_id as string, storeRequirementsCostEstimate);
      storeRequirementsCostEstimate.sys_updated_on = updatedReqCostEstimate.sys_updated_on;
      storeRequirementsCostEstimate.sys_updated_by = updatedReqCostEstimate.sys_updated_by;*!/
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving requirements cost estimate ${error}`);
    }*/
  }

  /**
   * Loads the Requirements cost estimate data using the acquisition package sys id.
   * And then sets the context such that the data could be retrieved using the
   * getters (getRequirementsCostEstimate)
   * @param packageId - sys_id of the acquisition package table record
   */
  @Action({rawError: true})
  public async loadRequirementsCostEstimateDataByPackageId(packageId: string): Promise<void> {
    const rceRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + packageId
      }
    };
    const reqCostEstimateList = await api.requirementsCostEstimateTable.getQuery(rceRequestConfig);
    if(reqCostEstimateList.length > 0){
      const sysId = typeof reqCostEstimateList[0].acquisition_package === "object"
        ? reqCostEstimateList[0].acquisition_package.value as string
        : reqCostEstimateList[0].acquisition_package as string;
      await this.doSetRequirementsCostEstimate({
        ...reqCostEstimateList[0],
        acquisition_package: sysId
      });
    } else {
      await this.initializeRequirementsCostEstimate();
    }
  }

  /**
   * Loads the igce estimate data using the acquisition package sys id.
   * And then sets the context such that the data could be retrieved using the
   * getters (getIgceCostEstimate)
   * @param packageId - sys_id of the acquisition package table record
   */
  @Action({rawError: true})
  public async loadIgceEstimateByPackageId(packageId: string): Promise<void> {
    const rceRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + packageId
      }
    };
    const igceEstimateList = await api.igceEstimateTable.getQuery(rceRequestConfig);
    this.doSetIgceEstimate(igceEstimateList);
  }

  @Action({rawError: true})
  public async setCostEstimate(value: CostEstimate[]): Promise<void> {
    console.log("Setting igce estimate...");
    console.log(value);
    const aqPackageSysId = AcquisitionPackage.acquisitionPackage?.sys_id as string;
    const crossDomainSysId = ClassificationRequirements.cdsSolution?.sys_id as string;
    const contractTypeSysId =
      AcquisitionPackage.acquisitionPackage?.contract_type === "object"
        ? (AcquisitionPackage.acquisitionPackage?.contract_type as unknown as ReferenceColumn)
          .value as string
        : AcquisitionPackage.acquisitionPackage?.contract_type as string;
    const periods = Periods.periods;
    let quantityCalculated = 0;
    periods.forEach(period => {
      if(period.period_unit === "MONTH") {
        quantityCalculated = quantityCalculated + Number(period.period_unit_count);
      } else if (period.period_unit === "YEAR") {
        quantityCalculated = quantityCalculated + (Number(period.period_unit_count) * 12);
      }
    })
    await this.saveIgceEstimates(
      {
        costEstimatList: value,
        aqPackageSysId: aqPackageSysId,
        crossDomainSysId: crossDomainSysId,
        contractTypeSysId: contractTypeSysId,
        quantity: quantityCalculated
      });
    await this.loadIgceEstimateByPackageId(aqPackageSysId);
  }

  @Mutation
  public async doSetIgceEstimate(igceEstimateList: IgceEstimateDTO[]): Promise<void> {
    this.igceEstimateList = igceEstimateList;
  }

  @Action({rawError: true})
  public async saveIgceEstimates(saveIgceObject: {
    costEstimatList: CostEstimate[],
    aqPackageSysId: string,
    crossDomainSysId: string,
    contractTypeSysId: string,
    quantity: number
  }): Promise<void>{
    const apiCallList: Promise<IgceEstimateDTO>[] = [];
    saveIgceObject.costEstimatList.forEach(costEstimate => {
      costEstimate.offerings.forEach(offering => {
        const igceEstimateSysId = offering.igceEstimateSysId as string;
        const igceEstimate: IgceEstimateDTO = {
          acquisition_package: saveIgceObject.aqPackageSysId,
          classification_instance: costEstimate.sysId,
          contract_type: saveIgceObject.contractTypeSysId,
          cross_domain_solution: saveIgceObject.crossDomainSysId,
          quantity: saveIgceObject.quantity,
          selected_service_offering: offering.sysId as string,
          title: offering.IGCE_title as string,
          unit: "MONTHLY",
          unit_price: offering.monthly_price as number
        }
        if(igceEstimateSysId && igceEstimateSysId.length > 0) {
          apiCallList.push(api.igceEstimateTable.update(igceEstimateSysId, igceEstimate));
        } else {
          apiCallList.push(api.igceEstimateTable.create(igceEstimate));
        }
      })
    })
    await Promise.all(apiCallList);
  }
}

const IGCE = getModule(IGCEStore);
export default IGCE;
