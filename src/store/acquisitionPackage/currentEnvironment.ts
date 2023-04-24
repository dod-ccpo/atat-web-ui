/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {
  ArchitecturalDesignRequirementDTO,
  CurrentEnvironmentDTO, 
  CurrentEnvironmentInstanceDTO, 
  ReferenceColumn
} from "@/api/models";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import _ from "lodash";
import any = jasmine.any;
import { AxiosRequestConfig } from "axios";
import AcquisitionPackage from ".";

const ATAT_CURRENT_ENVIRONMENT_KEY = "ATAT_CURRENT_ENVIRONMENT_KEY";

export const defaultCurrentEnvironment: CurrentEnvironmentDTO = {
  current_environment_exists: "",
  has_system_documentation: "",
  system_documentation: [],
  has_migration_documentation: "",
  migration_documentation: [],
  env_location: "",
  env_classifications_cloud: [],
  env_classifications_onprem: [],
  env_instances: [],
  current_environment_replicated_optimized: "", // radio - YES_REPLICATE | YES_OPTIMIZE | NO
  statement_replicated_optimized: "",
  additional_growth: "", // "YES" | "NO"
  anticipated_yearly_additional_capacity: null, // number | null
  has_phased_approach: "", // "YES" | "NO"
  phased_approach_schedule: "",
  needs_architectural_design_services: "", // "YES" | "NO"
  statement_architectural_design: "",
  applications_need_architectural_design: "",
  data_classifications_impact_levels: [],
  external_factors_architectural_design: "",
}

export const defaultCurrentEnvironmentInstance: CurrentEnvironmentInstanceDTO = {
  instance_location: "",
  deployed_regions: [],
  classification_level: "",
  current_usage_description: "",
  is_traffic_spike_event_based: "",
  is_traffic_spike_period_based: "",
  traffic_spike_event_description: "",
  traffic_spike_period_description: "",
  users_per_region: "",
  operating_system: "",
  licensing: "",
  number_of_vcpus: null,
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
  pricing_model: "",
  pricing_model_expiration: "",
  additional_information: "",
  acquisition_package: "",
  instance_number: 0,
  instance_name: ""
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
  public currentEnvironment: CurrentEnvironmentDTO = defaultCurrentEnvironment;
  public currentEnvInstances: CurrentEnvironmentInstanceDTO[] = [];
  public currentEnvInstanceNumber = 0;

  @Action
  public async getCurrentEnvironment(): Promise<CurrentEnvironmentDTO | null> {
    return this.currentEnvironment;
  }

  @Action
  public async getCurrentEnvironmentInstances(): Promise<CurrentEnvironmentInstanceDTO[]> {
    return this.currentEnvInstances;
  }
  public get currEnvInstances(): CurrentEnvironmentInstanceDTO[] {
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
    this.currentEnvironment = this.currentEnvironment
      ? Object.assign(this.currentEnvironment, value)
      : value;

    if (this.currentEnvironment.current_environment_exists === "NO") {
      this.currentEnvironment.current_environment_replicated_optimized = "";
      // TODO - CREATE BUG TICKET - if user selects "No" after previously selecting "Yes"
      // for the question "do you have a current environment, need to remove all data 
      // from STORE and DATABASE associated with Current Environment, such as uploaded
      // support docs, environment instances, DOW replicate/optimize response, etc.
      // ALSO - if user had selected "Yes" for Current CONTRACT and returns to change
      // to "No", need to clear out all Current Environment data from STORE and DATABASE
    }

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

  @Action({rawError: true})
  public async saveCurrentEnvironmentInstance(
    instance: CurrentEnvironmentInstanceDTO
  ): Promise<void> {
    /**
     * Makes an API call to either create or update the instance and then using the response
     * from the API, sets all the other context. Also makes a function call out to update the
     * base current environment table with the updated instance id.\
     */
    if (!instance.sys_id) {
      if(Array.isArray(instance.deployed_regions)) {
        instance.deployed_regions = instance.deployed_regions.join(',')
      }
      const currEnvInstanceResp = await api.currentEnvironmentInstanceTable
        .create(instance);
      instance.sys_id = currEnvInstanceResp.sys_id as string;
      this.currentEnvInstances.push(instance);
      this.currentEnvironment?.env_instances.push(instance.sys_id);
    } else {
      if(Array.isArray(instance.deployed_regions)) {
        instance.deployed_regions = instance.deployed_regions.join(',')
      }
      const currEnvInstanceResp = await api.currentEnvironmentInstanceTable
        .update(instance.sys_id as unknown as string, instance);
      const instanceIndex = this.currentEnvInstances
        .findIndex(obj => obj.sys_id === currEnvInstanceResp.sys_id);
      if (instanceIndex > -1) {
        this.currentEnvInstances[instanceIndex] = instance;
      }
    }
    await this.saveCurrentEnvironment();
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



  /**
   * Some data types in the response are not compatible with the types defined in the ui.
   * This function maps the response from the API to the type defined in the UI
   *
   * Repetitive logic can be consolidated by using "keyof" and "typeof" types. Leaving it
   * for now in the essence of time for release.
   */
  @Mutation
  private mapCurrentEnvironmentFromResponse(currentEnvResponse: any) {
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
        ?.split(",").filter(nonEmptyVal => nonEmptyVal);
  }

  /**
   * Some data types on the UI side are not compatible with the types defined in the
   * database.This function transforms the UI type to the type defined in the table
   */
  @Action({rawError: true})
  private transformCurrentEnvironmentForSave(currentEnv: CurrentEnvironmentDTO):
    CurrentEnvironmentDTO {
    const currEnvForSave = _.cloneDeep(currentEnv);
    currEnvForSave.env_instances =
      currentEnv.env_instances.toString() as unknown as string[];
    currEnvForSave.system_documentation =
      currentEnv.system_documentation?.toString() as unknown as string[];
    currEnvForSave.migration_documentation =
      currentEnv.migration_documentation?.toString() as unknown as string[];
    currEnvForSave.env_classifications_cloud =
      currentEnv.env_classifications_cloud.toString() as unknown as string[];
    currEnvForSave.env_classifications_onprem =
      currentEnv.env_classifications_onprem.toString() as unknown as string[];
    currEnvForSave.data_classifications_impact_levels =
      currentEnv.data_classifications_impact_levels?.toString() as unknown as string[];
    return currEnvForSave;
  }

  /**
   * Creates a current environment object with default values and makes an API
   * call to create the default record in the BE
   */
  @Action({rawError: true})
  public async initializeCurrentEnvironment():
    Promise<CurrentEnvironmentDTO> {
    try {
      if (!this.initialized) {
        const currentEnvForSave 
          = this.transformCurrentEnvironmentForSave(defaultCurrentEnvironment);
        const currentEnvironmentDTO = await api.currentEnvironmentTable
          .create(currentEnvForSave);
        this.mapCurrentEnvironmentFromResponse(currentEnvironmentDTO);
        this.setCurrentEnvironment(currentEnvironmentDTO);
        this.setCurrentEnvironmentInstances([]);
        this.setInitialized(true);
        return currentEnvironmentDTO;
      }
      return this.currentEnvironment || defaultCurrentEnvironment;
    } catch (error) {
      throw new Error(`an error occurred while initializing current environment ${error}`);
    }
  }

  @Action({rawError: true})
  public async loadCurrentEnvFromId(sysId: string): Promise<void> {
    const currentEnvironment = await api.currentEnvironmentTable.retrieve(sysId);
    if(currentEnvironment){
      this.mapCurrentEnvironmentFromResponse(currentEnvironment);
      await this.setCurrentEnvironment(currentEnvironment);
      if(currentEnvironment.env_instances.length > 0){
        const queryString = "sys_id=" 
          + currentEnvironment.env_instances.join("^ORsys_id=")
          + "^ORDERBYinstance_number";

        const config: AxiosRequestConfig = {
          params: {
            sysparm_display_value: "all",
            sysparm_query: queryString
          }
        };

        const currentEnvInstances: CurrentEnvironmentInstanceDTO[] 
          = await api.currentEnvironmentInstanceTable.getQuery(config);

        if(currentEnvInstances.length) {
          // need to convert fields from a ReferenceColumn to its .value as string
          currentEnvInstances.forEach((instance: any) => {
            const keys = Object.keys(instance);
            keys.forEach(key => {
              instance[key] = typeof instance[key] === "object"
                ? (instance[key] as ReferenceColumn).value as string
                : instance[key] as string;
            });
          });
          this.setCurrentEnvironmentInstances(currentEnvInstances);
        }
      }

    } else {
      await this.setCurrentEnvironment(
        await this.initializeCurrentEnvironment()
      );
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
      // TODO: commented out call to set.. because set function is saving the record again...
      // await this.setCurrentEnvironment(currentEnvironmentDTO);
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
      const transformedCurrEnv = await this.transformCurrentEnvironmentForSave(
        currentEnvironment as CurrentEnvironmentDTO);
      await api.currentEnvironmentTable
        .update(currentEnvironment?.sys_id as unknown as string, transformedCurrEnv);
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving current environment ${error}`);
    }
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_CURRENT_ENVIRONMENT_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.currentEnvironment = defaultCurrentEnvironment;
    this.currentEnvInstances = [];
    this.currentEnvInstanceNumber = 0;
  }
}

const CurrentEnvironment = getModule(CurrentEnvironmentStore);
export default CurrentEnvironment;
