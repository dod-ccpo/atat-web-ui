/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule, } from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import { OtherServiceOfferingData, SingleMultiple, TrainingEstimate } from "../../../types/Global";
import _ from "lodash";
import Periods from "@/store/periods";
import DescriptionOfWork, { 
  createDOWTaskNumber, 
  stringifyPeriodsForIGCECostEstimates 
} from "@/store/descriptionOfWork";
import AcquisitionPackage from "../acquisitionPackage";
import { AxiosRequestConfig } from "axios";
import {
  IgceEstimateDTO,
  RequirementsCostEstimateFlat,
  RequirementsCostEstimateDTO,
  ContractTypeDTO,
  TrainingEstimateDTO, ReferenceColumn, CrossDomainSolutionDTO
} from "@/api/models";
import { currencyStringToNumber } from "@/helpers";

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
      estimated_values: ""
    }
  }
}

export const defaultTrainingEstimate = (): TrainingEstimate => {
  return {
    costEstimateType: "",
    estimate: {
      estimated_values: "",
    },
    estimatedTrainingPrice: "",
    trainingOption: "",
    cloudSupportEnvironmentInstance: "",
    dow_task_number: ""  
  };
}

export const defaultIgceEstimate = (): IgceEstimateDTO => {
  return {
    acquisition_package: "",
    classification_instance: "",
    classification_level: "",
    contract_type: "",
    cross_domain_solution: "",
    cross_domain_pair: "",
    description: "",
    dow_task_number: "",
    environment_instance: "",
    title: "",
    unit: "",
    unit_price: null,
    unit_quantity: "",
    updated_description: "NO",
  }
}

export interface CostEstimate {
  labelShort: string,
  classificationInstanceSysId: string,
  classificationLevelSysId: string,
  offerings: Record<string, string|string[]|boolean|number|null>[]
}

export const getContractType = (): IgceEstimateDTO["contract_type"] =>{
  let contractTypeChoice: IgceEstimateDTO["contract_type"] = "TBD";
  const contractType: ContractTypeDTO = AcquisitionPackage.contractType as ContractTypeDTO;
  if (contractType?.firm_fixed_price === "true") {
    contractTypeChoice = "FFP";
  } else if (contractType?.time_and_materials === "true") {
    contractTypeChoice = "T&M";
  }
  return contractTypeChoice;
}

export const createCostEstimateDescription = (
  serviceName: string,
  service: OtherServiceOfferingData
): string => {
  switch (serviceName) {
  case "compute":
    return (
      service.numberOfInstances +
      " x (" +
      service.environmentType +
      ", " +
      service.operatingEnvironment?.toLowerCase() +
      ", " +
      service.operatingSystemAndLicensing +
      ", " +
      service.numberOfVCPUs +
      " vCPUs, " +
      service.memoryAmount +
      " GB RAM, " +
      service.storageType?.toLowerCase() +
      " storage: " +
      service.storageAmount +
      " " +
      service.storageUnit +
      ", " +
      service.performanceTier +
      ")"
    );
  case "database":
    return (
      service.numberOfInstances +
      " x (" +
      service.databaseType +
      ", " +
      service.operatingSystemAndLicensing +
      ", " +
      service.databaseLicensing +
      ", " +
      service.numberOfVCPUs +
      " vCPUs, " +
      service.memoryAmount +
      " GB RAM, " +
      service.storageType?.toLowerCase() +
      " storage: " +
      service.storageAmount +
      " " +
      service.storageUnit +
      ")"
    );
  case "storage":
    return (
      service.numberOfInstances +
      " x (" +
      service.storageType?.toLowerCase() +
      " storage: " +
      service.storageAmount +
      " " +
      service.storageUnit +
      ")"
    );
  default:
    return service.usageDescription || service.descriptionOfNeed || "";
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
  public initialized = false;
  public igceTrainingIndex = -1;
  public trainingItems: TrainingEstimate[] = [];
  public igceEstimateList: IgceEstimateDTO[] = [];


  @Action({rawError: true})
  public async reset(): Promise<void> {
    this.doReset();
  }

  costEstimates : CostEstimate[] = []

  @Mutation
  public doReset(): void {
    this.requirementsCostEstimate = null;
    this.igceTrainingIndex = -1;
    this.initialized = false;
    this.trainingItems = [];
    this.requirementsCostEstimate = _.cloneDeep(defaultRequirementsCostEstimate());
    this.igceEstimateList = [];
  }

  @Action({rawError: true})
  public async loadTrainingEstimatesFromPackage(packageId: string): Promise<void> {
    const requestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + packageId + "^ORDERBYsys_created_on",
        sysparm_display_value: "false"
      }
    };
    const trainingEstimates = await api.trainingEstimateTable.getQuery(requestConfig);

    trainingEstimates.forEach(item => {
      const estimatesFormatted = item.training_estimated_values?.replaceAll("{", "")
        .replaceAll("}", "").replaceAll("\"", "").split(",");
      const estimates:Record<string, string>[] = [];
      estimatesFormatted?.forEach(
        (item) => {
          const est = item.split(":");
          if (est[0] !== ""){
            estimates.push({[est[0]] : est[1]})
          }
        }
      )
      const trainingItem: TrainingEstimate = {
        sysId: item.sys_id,
        costEstimateType: item.training_unit,
        estimate: {
          option: estimates.length > 1 ? "MULTIPLE" : "SINGLE",
          estimated_values: JSON.stringify(estimates)
        },
        estimatedTrainingPrice: item.estimated_price_per_training_unit,
        trainingOption: item.training_option as SingleMultiple,
        cloudSupportEnvironmentInstance: 
          typeof item.cloud_support_environment_instance === "string"
            ? item.cloud_support_environment_instance as string
            : item.cloud_support_environment_instance.value as string
      };

      this.trainingItems.push(trainingItem);
    });
  }

  @Action({rawError: true})
  public async setTrainingEstimate(value: TrainingEstimate): Promise<void> {
    const objSysId = await this.saveTrainingEstimate(value);
    this.doSetTrainingEstimate({
      ...value,
      sysId: objSysId
    });
  }

  @Mutation
  private doSetTrainingEstimate(value: TrainingEstimate): void {
    if(this.trainingItems.length < this.igceTrainingIndex + 1)
      this.trainingItems.push(value);
    else
      this.trainingItems[this.igceTrainingIndex] = value;
  }

  @Action({rawError: true})
  public async saveTrainingEstimate(value: TrainingEstimate): Promise<string> {
    let objSysId = "";
    const trainingDTOItem: TrainingEstimateDTO = {
      acquisition_package: AcquisitionPackage.packageId,
      estimated_price_per_training_unit: value.estimatedTrainingPrice,
      training_option: value.trainingOption,
      training_estimated_values: value.estimate.estimated_values || "",
      training_unit: value.costEstimateType,
      cloud_support_environment_instance: value.cloudSupportEnvironmentInstance,
      dow_task_number: await this.getDOWTaskNumber(value.cloudSupportEnvironmentInstance as string)
    };

    if(value.sysId){
      await api.trainingEstimateTable.update(
        value.sysId,
        {
          ...trainingDTOItem,
          sys_id: value.sysId
        }
      );
      objSysId = value.sysId;
    } else {
      const savedObject = await api.trainingEstimateTable.create(
        trainingDTOItem
      );

      objSysId = savedObject.sys_id as string;
    }

    return objSysId;
  }

  @Action
  public async getDOWTaskNumber(cloudSupportSysId: string): Promise<string>{
    
    const trainingEnvironmentInstance = await api.cloudSupportEnvironmentInstanceTable.getQuery({
      params: {sysparm_query: "^sys_id=" + cloudSupportSysId}
    });

    let dowTaskNumber =  "";
    if (trainingEnvironmentInstance.length>0){
      const training = trainingEnvironmentInstance[0];
      const classificationLevel = typeof training.classification_level === "object"
        ? (training.classification_level as ReferenceColumn).value as string
        : training.classification_level as string;
      dowTaskNumber = await createDOWTaskNumber(
        classificationLevel, 
        "TRAINING", 
        training.instance_number
      )
    }
    return dowTaskNumber;
  }

  @Action
  public async getRequirementsCostEstimate(): Promise<RequirementsCostEstimateDTO> {
    return this.requirementsCostEstimate as RequirementsCostEstimateDTO;
  }

  @Action
  public async getRequirementsCostEstimateFlat(): Promise<RequirementsCostEstimateFlat> {
    return this.transformRequirementsCostEstimateFromTreeToFlat(
      this.requirementsCostEstimate as RequirementsCostEstimateDTO);
  }

  @Action
  public async setRequirementsCostEstimate(value: RequirementsCostEstimateDTO): Promise<void> {
    await this.doSetRequirementsCostEstimate(value);
    await this.saveRequirementsCostEstimate();
  }

  @Action
  public async setRequirementsCostEstimateFlat(value: RequirementsCostEstimateFlat): Promise<void> {
    await this.doSetRequirementsCostEstimate(
      await this.transformRequirementsCostEstimateFromFlatToTree(value));
    await this.saveRequirementsCostEstimate();
  }

  @Mutation
  public setIgceTrainingIndex(value: number): void {
    this.igceTrainingIndex = value;
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
    if ((Periods.periods && Periods.periods.length > 0) && DescriptionOfWork.isDOWComplete) {
      requirementCostEstimate.has_DOW_and_PoP = "YES";
    } else {
      requirementCostEstimate.has_DOW_and_PoP = "NO";
    }
  }

  @Action
  private async transformRequirementsCostEstimateFromFlatToTree(
    rceFlat: RequirementsCostEstimateFlat): Promise<RequirementsCostEstimateDTO> {
    return {
      acquisition_package: rceFlat.acquisition_package,
      architectural_design_current_environment: {
        option: rceFlat.architectural_design_current_environment_option,
        estimated_values:
          rceFlat.architectural_design_current_environment_estimated_values?.split(",")
      },
      architectural_design_performance_requirements: {
        option: rceFlat.architectural_design_performance_requirements_option as SingleMultiple,
        estimated_values:
          rceFlat.architectural_design_performance_requirements_estimated_values?.split(",")
      },
      fee_specs: {
        is_charged: rceFlat.how_est_dev_contracting_office_other_charges_fee,
        percentage: rceFlat.how_est_dev_contracting_office_other_fee_percentage
      },
      has_DOW_and_PoP: rceFlat.has_dow_and_pop,
      how_estimates_developed: {
        tools_used: rceFlat.how_est_dev_tools_used,
        other_tools_used: rceFlat.how_est_dev_other_tools_used,
        cost_estimate_description: rceFlat.how_est_dev_cost_estimate_description,
        previous_cost_estimate_comparison: {
          options: rceFlat.how_est_dev_prev_cost_estimate_comp_option,
          percentage: rceFlat.how_est_dev_prev_cost_estimate_comp_percentage
        },
      },
      optimize_replicate: {
        option: rceFlat.optimize_replicate_option,
        estimated_values: rceFlat.optimize_replicate_estimated_values?.split(",")
      },
      surge_requirements: {
        capabilities: rceFlat.surge_requirement_capabilities,
        capacity: rceFlat.surge_requirement_capacity},
      training: rceFlat.training ? JSON.parse(rceFlat.training) : [],
      travel: {
        option: rceFlat.travel_option,
        estimated_values: rceFlat.travel_estimated_values,
      },
      sys_created_by: rceFlat.sys_created_by,
      sys_created_on: rceFlat.sys_created_on,
      sys_id: rceFlat.sys_id,
      sys_mod_count: rceFlat.sys_mod_count,
      sys_tags: rceFlat.sys_tags,
      sys_updated_by: rceFlat.sys_updated_by,
      sys_updated_on: rceFlat.sys_updated_on
    };
  }

  @Action({rawError: true })
  public async initializeRequirementsCostEstimate(acqPackageId: string): Promise<void> {
    const requirementsCostEstimateFlat =
      await api.requirementsCostEstimateTable
        .create(await this.transformRequirementsCostEstimateFromTreeToFlat(
          {...defaultRequirementsCostEstimate(), acquisition_package: acqPackageId }));
    const requirementsCostEstimateDTO =
      await this.transformRequirementsCostEstimateFromFlatToTree(
        requirementsCostEstimateFlat)
    await this.doSetRequirementsCostEstimate(requirementsCostEstimateDTO);

  }

  @Action({rawError: true })
  public async transformRequirementsCostEstimateFromTreeToFlat(
    rceTree: RequirementsCostEstimateDTO): Promise<RequirementsCostEstimateFlat> {
    return {
      acquisition_package: typeof rceTree.acquisition_package === "object"
        ? rceTree.acquisition_package.value as string
        : rceTree.acquisition_package as string,
      architectural_design_current_environment_option:
        rceTree.architectural_design_current_environment.option,
      architectural_design_current_environment_estimated_values:
        rceTree.architectural_design_current_environment.estimated_values
          ?.map(currency => currencyStringToNumber(currency)).toString(),
      architectural_design_performance_requirements_option:
        rceTree.architectural_design_performance_requirements.option,
      architectural_design_performance_requirements_estimated_values:
        rceTree.architectural_design_performance_requirements.estimated_values
          ?.map(currency => currencyStringToNumber(currency)).toString(),
      contracting_office_other_charges_fee: rceTree.fee_specs.is_charged,
      contracting_office_other_fee_percentage: rceTree.fee_specs.percentage || 0,
      has_dow_and_pop: rceTree.has_DOW_and_PoP,
      how_est_dev_contracting_office_other_charges_fee: rceTree.fee_specs.is_charged,
      how_est_dev_contracting_office_other_fee_percentage: rceTree.fee_specs.percentage || 0,
      how_est_dev_tools_used: rceTree.how_estimates_developed.tools_used,
      how_est_dev_other_tools_used: rceTree.how_estimates_developed.other_tools_used,
      how_est_dev_cost_estimate_description:
        rceTree.how_estimates_developed.cost_estimate_description,
      how_est_dev_prev_cost_estimate_comp_option:
        rceTree.how_estimates_developed.previous_cost_estimate_comparison.options,
      how_est_dev_prev_cost_estimate_comp_percentage:
        rceTree.how_estimates_developed.previous_cost_estimate_comparison.percentage,
      optimize_replicate_option: rceTree.optimize_replicate.option,
      optimize_replicate_estimated_values: rceTree.optimize_replicate.estimated_values
        ?.map(currency => currencyStringToNumber(currency)).toString(),
      surge_requirement_capacity: rceTree.surge_requirements.capacity || 0,
      surge_requirement_capabilities: rceTree.surge_requirements.capabilities,
      training: JSON.stringify(rceTree.training ? rceTree.training : []),
      travel_option: rceTree.travel.option,
      travel_estimated_values: rceTree.travel.estimated_values || "",
      sys_created_by: rceTree.sys_created_by,
      sys_created_on: rceTree.sys_created_on,
      sys_id: rceTree.sys_id,
      sys_mod_count: rceTree.sys_mod_count,
      sys_tags: rceTree.sys_tags,
      sys_updated_by: rceTree.sys_updated_by,
      sys_updated_on: rceTree.sys_updated_on
    }
  }

  /**
   * Saves requirements cost estimate record that is in the store and sets the context. The
   * caller has to ensure that the store data is updated before calling this function.
   */
  @Action({rawError: true})
  public async saveRequirementsCostEstimate(): Promise<boolean> {
    try {
      const storeRequirementsCostEstimate = await this.getRequirementsCostEstimate();
      const updatedReqCostEstimate = await api.requirementsCostEstimateTable
        .update(storeRequirementsCostEstimate.sys_id as string,
          await this.transformRequirementsCostEstimateFromTreeToFlat(
            storeRequirementsCostEstimate));
      storeRequirementsCostEstimate.sys_updated_on = updatedReqCostEstimate.sys_updated_on;
      storeRequirementsCostEstimate.sys_updated_by = updatedReqCostEstimate.sys_updated_by;
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving requirements cost estimate ${error}`);
    }
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
        ...await this.transformRequirementsCostEstimateFromFlatToTree(reqCostEstimateList[0]),
        acquisition_package: sysId
      });
    } else {
      await this.initializeRequirementsCostEstimate(packageId);
    }
  }

  /**
   * Creates the IGCEEstimate table record by sticking in the acquisition package sys_id to
   * the object that is passed in
   */
  @Action({ rawError: true })
  public async createIgceEstimateRecord(igceEstimateDTO: IgceEstimateDTO): Promise<void> {
    await api.igceEstimateTable.create({
      ...igceEstimateDTO,
      acquisition_package: AcquisitionPackage.acquisitionPackage?.sys_id as string,
      contract_type: getContractType()
    });
  }


  @Action({ rawError: true })
  public async updateIgceEstimateRecord(
    instanceRef: {
      environmentInstanceSysId?: string,
      classificationLevelSysId?: string,
      classificationInstanceSysId?: string, 
      unit_quantity: string,
      description:string,
      dow_task_number: string
    }
  ): Promise<void> {
    const isClassificationInstance = instanceRef.classificationInstanceSysId !== undefined;

    const instanceQueryString = isClassificationInstance
      ? "classification_instance=" + instanceRef.classificationInstanceSysId
      : "environment_instance=" + instanceRef.environmentInstanceSysId

    const instanceQuery: AxiosRequestConfig = {
      params: { sysparm_query: instanceQueryString },
    };
    const costEstimateRowData = await api.igceEstimateTable.getQuery(instanceQuery)
    const costEstimateSysId = costEstimateRowData[0]?.sys_id || "";

    if (costEstimateSysId) {
      await api.igceEstimateTable.update(
        costEstimateSysId, {
          classification_level: instanceRef.classificationLevelSysId,
          contract_type: getContractType(),
          unit_quantity: instanceRef.unit_quantity,
          description: costEstimateRowData[0].updated_description !== "YES"? instanceRef.description
            : costEstimateRowData[0].description,
          dow_task_number: instanceRef.dow_task_number
        });
    }
  }

  @Action({ rawError: true })
  public async updateIgceEstimateRecordWithContractType(): Promise<void> {
    const query: AxiosRequestConfig = {
      params: { sysparm_query: "acquisition_package=" + AcquisitionPackage.packageId },
    };
    const costEstimatesToBeUpdated = (await api.igceEstimateTable.getQuery(query));

    if (costEstimatesToBeUpdated.length > 0) {
      costEstimatesToBeUpdated.forEach(
        async (estimateRow) => {
          await api.igceEstimateTable.update(
            estimateRow.sys_id || "",
            { contract_type: getContractType() }
          );
        }
      )

    }
  }

  /**
   * user is to update unit_quantity when Period of Performance changes
   */

  @Action({ rawError: true })
  public async updateIgceEstimatePeriodOfPerformance(): Promise<void> {
    const query: AxiosRequestConfig = {
      params: { sysparm_query: "acquisition_package=" + AcquisitionPackage.packageId },
    };
    const popsToBeUpdated = (await api.igceEstimateTable.getQuery(query));

    if (popsToBeUpdated.length > 0) {
      popsToBeUpdated.forEach(
        async (estimateRow) => {
          await api.igceEstimateTable.update(
            estimateRow.sys_id || "",
            { unit_quantity: await stringifyPeriodsForIGCECostEstimates() }
          );
        }
      )

    }
  }


  /**
   * This is expected to be called whenever a record gets created in one of the child
   * tables of the Environment Instance table. Some child tables include "Current EI, Compute EI,
   * Database EI, Cloud Support EI, Storage EI, General Xass EI, Estimated EI"
   */
  @Action({ rawError: true })
  public async createIgceEstimateEnvironmentInstance(
    envInstanceRef: {
      environmentInstanceSysId: string,
      classificationLevelSysId: string | ReferenceColumn,
      title: string,
      description: string,
      unit: string,
      otherServiceOfferingData: OtherServiceOfferingData,
      offeringType: string,
      idiqClinType: string,
      unit_quantity: string,
      dowTaskNumber: string,
    }):
    Promise<void> {
    await this.createIgceEstimateRecord({
      ...defaultIgceEstimate(),
      environment_instance: envInstanceRef.environmentInstanceSysId,
      classification_level: typeof envInstanceRef.classificationLevelSysId === "object"
        ? envInstanceRef.classificationLevelSysId.value as string
        : envInstanceRef.classificationLevelSysId as string,
      title: envInstanceRef.title,
      description: createCostEstimateDescription(
        envInstanceRef.offeringType,
        envInstanceRef.otherServiceOfferingData
      ),
      dow_task_number: envInstanceRef.dowTaskNumber,
      unit: envInstanceRef.unit,
      idiq_clin_type: envInstanceRef.idiqClinType,
      unit_quantity: envInstanceRef.unit_quantity
    });
  }

  /**
   * This is expected to be called whenever a record gets created in the Classification Instance
   * or one of its child tables.
   */
  @Action({ rawError: true })
  public async createIgceEstimateClassificationInstance(
    classInstanceRef: {
      classificationInstanceSysId: string,
      classificationLevelSysId: string | ReferenceColumn
      title: string,
      description: string,
      idiqClinType: string,
      unit_quantity: string
      dow_task_number: string
    }):
    Promise<void> {
    await this.createIgceEstimateRecord({
      ...defaultIgceEstimate(),
      classification_instance: classInstanceRef.classificationInstanceSysId,
      classification_level: typeof classInstanceRef.classificationLevelSysId === "object"
        ? classInstanceRef.classificationLevelSysId.value as string
        : classInstanceRef.classificationLevelSysId as string,
      title: classInstanceRef.title,
      description: classInstanceRef.description,
      dow_task_number: classInstanceRef.dow_task_number,
      unit: "month",
      idiq_clin_type: classInstanceRef.idiqClinType,
      unit_quantity: classInstanceRef.unit_quantity,
    });
  }

  @Action({ rawError: true })
  public async getCDSRecord(): Promise<CrossDomainSolutionDTO | null> {
    const cdsRecord = await api.crossDomainSolutionTable.getQuery({
      params: {
        sysparm_query: "acquisition_package=" + AcquisitionPackage.packageId
      }
    });
    return cdsRecord.length>0 ? cdsRecord[0] : null
  }


  /**
   * Performs a query on the request config and deletes the first match from the IGCE Estimate
   * table. It is expected to always have a single match at most. If there are more than
   * one matching records, then there is an issue else where, that is creating multiple
   * records of the same instance
   */
  @Action({ rawError: true })
  public async deleteIgceEstimateByRequestConfig(deleteRequestConfig: AxiosRequestConfig):
    Promise<void> {
    const igceEstimateList = await api.igceEstimateTable.getQuery(deleteRequestConfig);
    if (igceEstimateList?.length > 0) {
      // TODO: double check which option is better. For CDS there could be multiple records
      //  per cross domain. So, may need to delete more than one record when user toggles from
      //  "YES" to a "NO"
      igceEstimateList.forEach(async igceEstimate => {
        api.igceEstimateTable.remove(igceEstimate.sys_id as string);
      })
    }
  }

  /**
   * This is expected to be called whenever a record gets deleted from Environment Instance
   * table and its child tables.
   */
  @Action({ rawError: true })
  public async deleteIgceEstimateEnvironmentInstance(
    instance:{
      envSysId: string, 
      serviceOfferingGroupId: string
    }
  ):
    Promise<void> {
    if (instance.serviceOfferingGroupId.toLowerCase() === "training"){
      await this.deleteIgceEstimateTrainingInstance (instance.envSysId);
    } else {
      await this.deleteIgceEstimateByRequestConfig({
        params: {
          sysparm_query: "environment_instance=" + instance.envSysId
        }
      })
    }
  }

  /**
   * This is expected to be called whenever a record gets deleted from Classification Instance
   * table and any of its child tables.
   */
  @Action({ rawError: true })
  public async deleteIgceEstimateClassificationInstance(classificationInstanceSysId: string):
    Promise<void> {
    await this.deleteIgceEstimateByRequestConfig({
      params: {
        sysparm_query: "classification_instance=" + classificationInstanceSysId
      }
    })
  }


  /**
  * This is expected to be called whenever a record gets deleted from Environment Instance
  * table and its child tables.
  */
  @Action({ rawError: true })
  public async deleteIgceEstimateTrainingInstance(environmentInstanceSysId: string):
    Promise<void> {
      
    // delete from IGCEStore.trainingItems
    const itemIdx = this.trainingItems.findIndex(
      trainingItem => trainingItem.cloudSupportEnvironmentInstance === environmentInstanceSysId
    )
    this.trainingItems.splice(itemIdx, 1);

    // delete from SNOW
    const query = {
      params: {
        sysparm_query: "cloud_support_environment_instance=" + environmentInstanceSysId
      }
    };
    const trainingEstimateRecord = await api.trainingEstimateTable.getQuery(query)
    if (trainingEstimateRecord.length>0){
      await api.trainingEstimateTable.remove(trainingEstimateRecord[0].sys_id as string);
    }
  }

  /**
   * Loads the igce estimate data using the acquisition package sys id.
   * And then sets the context such that the data could be retrieved using the
   * getters (getIgceCostEstimate)
   * @param packageId - sys_id of the acquisition package table record
   */
  @Action({ rawError: true })
  public async loadIgceEstimateByPackageId(packageId: string): Promise<void> {
    const rceRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + packageId
      }
    };
    const igceEstimateList = await api.igceEstimateTable.getQuery(rceRequestConfig);
    await this.doSetIgceEstimate(igceEstimateList);
  }

  /**
   * Gathers all the required reference column Ids, calculates the quantity based on periods, makes
   * a callout to save and the sets the igce estimate to this store.
   */
  @Action({ rawError: true })
  public async setCostEstimate(costEstimatList: IgceEstimateDTO[][]): Promise<void> {
    await this.saveIgceEstimates(costEstimatList);
    const aqPackageSysId = AcquisitionPackage.acquisitionPackage?.sys_id as string;
    await this.loadIgceEstimateByPackageId(aqPackageSysId);
  }

  @Action({rawError: true})
  public async setIgceEstimate(igceEstimateList: IgceEstimateDTO[]): Promise<void> {
    this.doSetIgceEstimate(igceEstimateList);
  }

  @Mutation
  public async doSetIgceEstimate(igceEstimateList: IgceEstimateDTO[]): Promise<void> {
    this.igceEstimateList = igceEstimateList;
  }

  @Action({rawError: true})
  public async setTrainingItems(items: TrainingEstimate[]): Promise<void> {
    this.doSetTrainingItems(items);
  }

  @Mutation
  public async doSetTrainingItems(items: TrainingEstimate[]): Promise<void> {
    this.trainingItems = items;
  }

  /**
   * Updates the IGCE Estimate records based on the values entered and or updated for each of the
   * IGCE record on the IGCE Estimate page.
   */
  @Action({ rawError: true })
  public async saveIgceEstimates(costEstimateList: IgceEstimateDTO[][]): Promise<void> {
    const apiCallList: Promise<IgceEstimateDTO>[] = [];
    for (const estimate in costEstimateList) {
      costEstimateList[estimate].forEach(async offering => {
        const igceEstimateSysId = offering.sys_id as string;
        offering.dow_task_number = await this.getCDSDowTaskNumber(offering);
        const igceEstimate: IgceEstimateDTO = {
          description: offering.description as string,
          title: offering.title as string,
          unit: offering.unit as string,
          unit_price: offering.unit_price as number,
          unit_quantity: offering.unit_quantity as string,
          updated_description: offering.updated_description,
          dow_task_number:  await this.getCDSDowTaskNumber(offering)
        }
        igceEstimateSysId !== undefined
          ? apiCallList.push(api.igceEstimateTable.update(igceEstimateSysId, igceEstimate))
          : apiCallList.push(api.igceEstimateTable.create(offering))
      })
    }
    await Promise.all(apiCallList);
  }

  @Action({ rawError: true })
  public async getCDSDowTaskNumber(offering:IgceEstimateDTO):Promise<string>{
    return await offering.title?.includes("Cross Domain Solution") 
      ? "4.2.6"
      : offering.dow_task_number as string;
  }

}

const IGCE = getModule(IGCEStore);
export default IGCE;
