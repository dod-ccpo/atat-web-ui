import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {
  nameofProperty,
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import Vue from "vue";

import { ClassificationLevelDTO, EnvironmentInstanceDTO, ReferenceColumn } from "@/api/models";
import { SecurityRequirement } from "../../../types/Global";

const ATAT_CLASSIFICATION_LEVELS_KEY = "ATAT_CLASSIFICATION_LEVELS_KEY";

@Module({
  name: "ClassificationRequirements",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class ClassificationRequirementsStore extends VuexModule {
  public initialized = false;
  public classificationLevels: ClassificationLevelDTO[] = [];
  public selectedClassificationLevels: ClassificationLevelDTO[] = [];
  public currentEnvClassificationLevels: ClassificationLevelDTO[] = [];
  public environmentInstances: EnvironmentInstanceDTO[] = [];
  public securityRequirements: SecurityRequirement[] = [];

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.classificationLevels),
    nameofProperty(this, (x)=> x.selectedClassificationLevels),
    nameofProperty(this, (x)=> x.currentEnvClassificationLevels),
    nameofProperty(this, (x)=> x.environmentInstances),
    nameofProperty(this, (x)=> x.securityRequirements)
  ];

  @Mutation
  public setClassifications(value: ClassificationLevelDTO[]) {
    this.classificationLevels = value;
  }

  @Mutation
  public async setSelectedClassificationLevels(value: ClassificationLevelDTO[]): Promise<void> {
    this.selectedClassificationLevels = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_CLASSIFICATION_LEVELS_KEY
    );

  }

  @Mutation
  public async setCurrentENVClassificationLevels(value: ClassificationLevelDTO[]): Promise<void> {
    this.currentEnvClassificationLevels = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_CLASSIFICATION_LEVELS_KEY
    );

  }

  @Mutation
  public async setEnvironmentInstance(value: EnvironmentInstanceDTO[]): Promise<void> {
    this.environmentInstances = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_CLASSIFICATION_LEVELS_KEY
    );

  }
  @Mutation
  public async setSecurityRequirements(value: SecurityRequirement[]): Promise<void> {
    this.securityRequirements = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_CLASSIFICATION_LEVELS_KEY
    );

  }

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for contact data store");
    }
  }

  @Action({ rawError: true })
  public async getSelectedClassificationLevels(): Promise<ClassificationLevelDTO[]> {
    return this.selectedClassificationLevels;
  }

  // EJY - IS THIS NEEDED? ONLY USED FOR CURRENT ENVIRONMENT WHICH WILL BE HANDLED DIFFERENTLY?
  // @Action({ rawError: true })
  // public async getCurrentENVClassificationLevels(): Promise<ClassificationLevelDTO[]> {
  //   return this.currentEnvClassificationLevels;
  // }

  @Action({ rawError: true })
  public async getAllClassificationLevels(): Promise<ClassificationLevelDTO[]> {
    await this.ensureInitialized();
    return this.classificationLevels;
  }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    } 
    
     
    const sessionRestored = retrieveSession(ATAT_CLASSIFICATION_LEVELS_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    } else {
      try {
        await Promise.all([
          this.loadClassificationLevels(),
          // this.loadEnvironmentInstances(),
        ]);
        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_CLASSIFICATION_LEVELS_KEY
        );
        this.setInitialized(true);
      } catch (error) {
        console.error(error);
      }
    }
  }

  @Mutation
  public setInitialized(value: boolean) {
    this.initialized = value;
  }

  @Action({ rawError: true })
  public async loadClassificationLevels(): Promise<void> {
    try {
      const classificationLevels = await api.classificationLevelTable.all();
      this.setClassifications(classificationLevels);
    } catch (error) {
      throw new Error(`error loading Classification Levels ${error}`);
    }
  }


  @Action({ rawError: true })
  public async loadEnvironmentInstances(): Promise<void> {
    try {
      const environmentInstance = await api.environmentInstanceTable.all();
      await this.setEnvironmentInstance(environmentInstance);
    } catch (error) {
      throw new Error(`error loading Environment Instances ${error}`);
    }
  }


  @Action({ rawError: true })
  public async saveSelectedClassificationInstances(selected: ClassificationLevelDTO[] ):
      Promise<void> {
    const toBeSaved = selected.filter(cl => this.environmentInstances
      .findIndex(ev => ev.classification_level === cl.sys_id) < 0).map(sel => {
      const ei: EnvironmentInstanceDTO = {
        /* eslint-disable camelcase */
        storage_amount: "",
        storage_type: "",
        instance_name: "",
        classification_level: sel.sys_id || "",
        number_of_vcpus: "",
        data_egress_monthly_amount: "",
        performance_tier: "",
        pricing_model_expiration: "",
        csp_region: "",
        memory_unit: "",
        storage_unit: "",
        pricing_model: "",
        instance_location: "",
        memory_amount: "",
        operating_system_licensing: "",
        data_egress_monthly_unit: ""
      }
      return ei;
    });
    const environmentInstancesToDelete: EnvironmentInstanceDTO[] = [];
    this.currentEnvClassificationLevels.forEach(cl => {
      const isFound = selected.find(sel => sel.sys_id === cl.sys_id);
      if (!isFound) {
        const envIToDelete = this.environmentInstances
          .find(ei =>
            (ei.classification_level as unknown as ReferenceColumn).value === cl.sys_id);
        if (envIToDelete) {
          environmentInstancesToDelete.push(envIToDelete);
        }
      }
    });
    //delete from SNOW
    const deleteCalls = environmentInstancesToDelete
      .map(ei=> {
        api.environmentInstanceTable.remove(ei.sys_id || "")
      } );
    await Promise.all(deleteCalls);

    // save to SNOW
    const saveToSNOW = async (ei:EnvironmentInstanceDTO) => {
      const found = this.environmentInstances.find(instance=>
        (instance.classification_level as unknown as ReferenceColumn).value
          === ei.classification_level)
      if(found){
        found.classification_level = (found.classification_level as unknown as ReferenceColumn)
          .value
        ei = found
      }
      const sysId = ei.sys_id || ""
      const saveCall = sysId.length > 0 ?
        api.environmentInstanceTable.update(sysId,ei) :
        api.environmentInstanceTable.create(ei)
    }
    const saveCalls = toBeSaved.map(ei=> saveToSNOW(ei));
    await Promise.all(saveCalls);
    this.setCurrentENVClassificationLevels(selected)
  }
}
const ClassificationRequirements = getModule(ClassificationRequirementsStore);
export default ClassificationRequirements;
