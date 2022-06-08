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

import { ClassificationLevelDTO } from "@/api/models";

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

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.classificationLevels),
  ];

  @Mutation
  private setClassifications(value: ClassificationLevelDTO[]) {
    this.classificationLevels = value;
  }

  @Mutation
  public async setSelectedClassificationLevels(value: ClassificationLevelDTO[]): Promise<void> {
    this.selectedClassificationLevels = value;
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
      const sessionRestored = retrieveSession(ATAT_CLASSIFICATION_LEVELS_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      }
    } else {
      try {
        await Promise.all([
          this.loadClassificationLevels(),
        ]);
        this.setInitialized(true);
        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_CLASSIFICATION_LEVELS_KEY
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  @Mutation
  private setInitialized(value: boolean) {
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

}
const ClassificationRequirements = getModule(ClassificationRequirementsStore);
export default ClassificationRequirements;