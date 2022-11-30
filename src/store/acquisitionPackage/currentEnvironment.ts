/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {CurrentEnvironmentDTO, CurrentEnvironmentInstanceDTO} from "@/api/models";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import _ from "lodash";
import any = jasmine.any;

const ATAT_CURRENT_ENVIRONMENT_KEY = "ATAT_CURRENT_ENVIRONMENT_KEY";

export const defaultCurrentEnvironment: CurrentEnvironmentDTO = {
  additional_growth: "" as const,
  anticipated_yearly_additional_capacity: null,
  applications_need_architectural_design: "",
  current_environment_replicated_optimized: "" as const,
  data_classifications_impact_levels: undefined as unknown as string[],
  env_classifications_cloud: undefined as unknown as string[],
  env_classifications_onprem: undefined as unknown as string[],
  env_instances: undefined as unknown as string[],
  env_location: "" as const,
  external_factors_architectural_design: "",
  has_phased_approach: "" as const,
  needs_architectural_design_services: "" as const,
  phased_approach_schedule: "",
  statement_architectural_design: "",
  statement_replicated_optimized: "",
  current_environment_exists: "" as const,
  has_system_documentation: "" as const,
  has_migration_documentation: "" as const
}

export const defaultCurrentEnvironmentInstance: CurrentEnvironmentInstanceDTO = {
  instance_location: "",
  deployed_regions: [],
  classification_level: "", // classification level sys_id
  current_usage_description: "",
  is_traffic_spike_event_based: "",
  is_traffic_spike_period_based: "",
  traffic_spike_event_description: "",
  traffic_spike_period_description: "",
  users_per_region: "", // json stringified sys_id/count pairs
  operating_system: "",
  licensing: "",
  number_of_VCPUs: null,
  processor_speed: null, 
  memory_amount: null,
  memory_unit: "GB",
  storage_type: "",
  storage_amount: null,
  storage_unit: "GB",
  performance_tier: "",
  number_of_instances: null, 
  data_egress_monthly_amount: null,   
  data_egress_monthly_unit: "GB",
  current_payment_arrangement: "",
  pricing_period_expiration_date: "",
  additional_information: "", 
}


/**
 * This module contains all the store and api support that is needed for "Background -
 * current environment" of a new Acquisition
 */
@Module({
  name: "CurrentEnvironmentStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class CurrentEnvironmentStore extends VuexModule {
  initialized = false;
  public currentEnvironment: CurrentEnvironmentDTO | null = null;
  public currentEnvInstances: CurrentEnvironmentInstanceDTO[] = [];
  public currentEnvInstanceNumber = 0;

  @Action
  public async getCurrentEnvironment():
    Promise<CurrentEnvironmentDTO | null> {
    return this.currentEnvironment;
  }

  @Action
  public async getCurrentEnvironmentInstances(): 
    Promise<CurrentEnvironmentInstanceDTO[]>
  {
    return this.currentEnvInstances;
  }

  @Mutation
  public setCurrentEnvironmentInstances(value: CurrentEnvironmentInstanceDTO[]): void {
    this.currentEnvInstances = value;
  }

  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.currentEnvironment)
  ];

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for acquisition package summary data store");
    }
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Action
  public async setCurrentEnvironment(value: CurrentEnvironmentDTO): Promise<void> {
    await this.doSetCurrentEnvironment(value);
    await this.saveCurrentEnvironment();
  }

  @Mutation
  public async doSetCurrentEnvironment(value: CurrentEnvironmentDTO): Promise<void> {
    this.currentEnvironment = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_CURRENT_ENVIRONMENT_KEY
    );
  }

  @Action
  public async createNewEnvInstance(): Promise<void> {
    await this.doSetCurrentEnvInstanceNumber(this.currentEnvInstances.length + 1);
  }

  @Action
  public async setCurrentEnvInstanceNumber(num: number): Promise<void> {
    await this.doSetCurrentEnvInstanceNumber(num);
  }
  @Mutation
  public async doSetCurrentEnvInstanceNumber(num: number): Promise<void> {
    this.currentEnvInstanceNumber = num;
  }

  @Action
  public async deleteEnvironmentInstance(sysId: string): Promise<void> {
    const i = this.currentEnvInstances.findIndex(obj => obj.sys_id === sysId);
    if (i > -1) {
      await this.doDeleteEnvironmentInstance(i);
    }
  }

  /**
   * Makes an API call to delete the instance. And then sets all the context
   * including making another function call out to update the current environment.
   */
  @Action({rawError: true})
  public async doDeleteEnvironmentInstance(index: number): Promise<void> {
    const instanceSysId = this.currentEnvInstances[index].sys_id;
    await api.currentEnvironmentInstanceTable.remove(instanceSysId as string);
    this.currentEnvInstances.splice(index, 1);
    const currentEnvInstanceIndex = this.currentEnvironment?.env_instances
      .indexOf(instanceSysId as string);
    this.currentEnvironment?.env_instances.splice(currentEnvInstanceIndex as number, 1);
    await this.saveCurrentEnvironment();
  }

  @Action
  public async clearEnvClassifications(type: string): Promise<void> {
    await this.doClearEnvClassifications(type);
  }
  @Mutation
  public async doClearEnvClassifications(type: string): Promise<void> {
    if (type === "CLOUD" && this.currentEnvironment) {
      this.currentEnvironment.env_classifications_cloud = [];
    } else if (type === "ON_PREM" && this.currentEnvironment) {
      this.currentEnvironment.env_classifications_onprem = [];
    }
  }

  @Action 
  public async setCurrentEnvironmentInstanceNumber(sysId: string): Promise<void> {
    const i = this.currentEnvInstances.findIndex(obj => obj.sys_id === sysId);
    if (i > -1) {
      this.setCurrentEnvInstanceNumber(i);
    }
  }

  @Action
  public async saveCurrentEnvironmentInstance(
    value: CurrentEnvironmentInstanceDTO
  ): Promise<void> {
    await this.doSaveCurrentEnvironmentInstance(value);
    await this.saveCurrentEnvironment();
  }

  /**
   * Makes an API call to either create or update the instance and then using the response
   * from the API, sets all the other context. Also makes a function call out to update the
   * base current environment table with the updated instance id.\
   */
  @Mutation
  public async doSaveCurrentEnvironmentInstance(
    value: CurrentEnvironmentInstanceDTO
  ): Promise<void> {
    const instance = _.cloneDeep(value);
    if (!instance.sys_id) {
      const currEnvInstanceResp = await api.currentEnvironmentInstanceTable
        .create(instance);
      // setting individual properties instead of the whole object is required
      // because certain reference types have a different structure and needs mapping
      instance.sys_id = currEnvInstanceResp.sys_id as string;
      instance.sys_updated_on = currEnvInstanceResp.sys_updated_on;
      instance.sys_updated_by = currEnvInstanceResp.sys_updated_by;
      this.currentEnvInstances.push(instance);
      this.currentEnvironment?.env_instances.push(instance.sys_id);
    } else {
      const currEnvInstanceResp = await api.currentEnvironmentInstanceTable
        .update(instance.sys_id as unknown as string, instance);
      const instanceIndex = this.currentEnvInstances
        .findIndex(obj => obj.sys_id === currEnvInstanceResp.sys_id);
      if (instanceIndex > -1) {
        const currentInstance = this.currentEnvInstances[instanceIndex];
        currentInstance.sys_updated_on = currEnvInstanceResp.sys_updated_on;
        currentInstance.sys_updated_by = currEnvInstanceResp.sys_updated_by;
      }
    }
  }

  @Action({rawError: true})
  public async getCurrentEnvInstance(): Promise<CurrentEnvironmentInstanceDTO | null> {
    return this.currentEnvInstances[this.currentEnvInstanceNumber];
  }

  @Action({rawError: true})
  public async isNewInstance(): Promise<boolean> {
    return this.currentEnvInstances[this.currentEnvInstanceNumber] === undefined
      ? true : false;
  }

  @Action({rawError: true})
  async initialize(): Promise<void> {
    if (!this.initialized) {
      const sessionRestored = retrieveSession(ATAT_CURRENT_ENVIRONMENT_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      } else {
        this.setInitialized(true);
        storeDataToSession(this, this.sessionProperties, ATAT_CURRENT_ENVIRONMENT_KEY);
      }
    }
  }

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  /**
   * Some data types in the response are not compatible with the types defined in the ui.
   * This function maps the response from the API to the type defined in the UI
   *
   * Repetitive logic can be consolidated by using "keyof" and "typeof" types. Leaving it
   * for now in the essence of time for release.
   */
  @Mutation
  private mapCurrentEnvironmentFromResponse(currentEnvResponse: CurrentEnvironmentDTO) {
    currentEnvResponse.env_instances = (currentEnvResponse.env_instances as unknown as string)
      .split(",").filter(nonEmptyVal => nonEmptyVal);
    currentEnvResponse.system_documentation =
      (currentEnvResponse.system_documentation as unknown as string)
        .split(",").filter(nonEmptyVal => nonEmptyVal);
    currentEnvResponse.migration_documentation =
      (currentEnvResponse.migration_documentation as unknown as string)
        .split(",").filter(nonEmptyVal => nonEmptyVal);
    currentEnvResponse.env_classifications_cloud =
      (currentEnvResponse.env_classifications_cloud as unknown as string)
        .split(",").filter(nonEmptyVal => nonEmptyVal);
    currentEnvResponse.env_classifications_onprem =
      (currentEnvResponse.env_classifications_onprem as unknown as string)
        .split(",").filter(nonEmptyVal => nonEmptyVal);
    currentEnvResponse.data_classifications_impact_levels =
      (currentEnvResponse.data_classifications_impact_levels as unknown as string)
        .split(",").filter(nonEmptyVal => nonEmptyVal);
  }

  /**
   * Some data types on the UI side are not compatible with the types defined in the
   * database.This function transforms the UI type to the type defined in the table
   */
  @Action({rawError: true})
  private transformCurrentEnvironmentForSave(currentEnvResponse: CurrentEnvironmentDTO):
    CurrentEnvironmentDTO {
    const currEnvForSave = _.cloneDeep(currentEnvResponse);
    currEnvForSave.env_instances =
      currentEnvResponse.env_instances.toString() as unknown as string[];
    currEnvForSave.system_documentation =
      currentEnvResponse.system_documentation?.toString() as unknown as string[];
    currEnvForSave.migration_documentation =
      currentEnvResponse.migration_documentation?.toString() as unknown as string[];
    currEnvForSave.env_classifications_cloud =
      currentEnvResponse.env_classifications_cloud.toString() as unknown as string[];
    currEnvForSave.env_classifications_onprem =
      currentEnvResponse.env_classifications_onprem.toString() as unknown as string[];
    currEnvForSave.data_classifications_impact_levels =
      currentEnvResponse.data_classifications_impact_levels.toString() as unknown as string[];
    return currEnvForSave;
  }

  /**
   * Creates a current environment object with default values and makes an API
   * call to create the default record in the BE
   */
  @Action({rawError: true})
  public async initialCurrentEnvironment():
    Promise<CurrentEnvironmentDTO> {
    try {
      const currentEnvironmentDTO = await api.currentEnvironmentTable
        .create(defaultCurrentEnvironment);
      this.mapCurrentEnvironmentFromResponse(currentEnvironmentDTO);
      this.setCurrentEnvironment(currentEnvironmentDTO);
      this.setCurrentEnvironmentInstances([]);
      return currentEnvironmentDTO;
    } catch (error) {
      throw new Error(`an error occurred while initializing current environment ${error}`);
    }
  }

  /**
   * Loads the current environment by making BE api calls and sets it to this store
   */
  @Action({rawError: true})
  async loadCurrentEnvironment(): Promise<CurrentEnvironmentDTO> {
    try {
      const currentEnvironmentDTO = await api.currentEnvironmentTable
        .retrieve(this.currentEnvironment?.sys_id);
      // TODO: add orchestration to load records from current environment instance table
      this.setCurrentEnvironment(currentEnvironmentDTO);
      return Promise.resolve(currentEnvironmentDTO);
    } catch (error) {
      throw new Error(`an error occurred while loading current environment ${error}`);
    }
  }

  /**
   * Gets the current environment from this store and makes the api calls to save.
   */
  @Action({rawError: true})
  async saveCurrentEnvironment(): Promise<boolean> {
    try {
      const currentEnvironment = await this.getCurrentEnvironment() as CurrentEnvironmentDTO;
      console.log(currentEnvironment)
      const transformedCurrEnv = await this.transformCurrentEnvironmentForSave(
        currentEnvironment as CurrentEnvironmentDTO);
      console.log(transformedCurrEnv);
      await api.currentEnvironmentTable
        .update(currentEnvironment?.sys_id as unknown as string, transformedCurrEnv);
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving current environment ${error}`);
    }
  }
}

const CurrentEnvironment = getModule(CurrentEnvironmentStore);
export default CurrentEnvironment;
