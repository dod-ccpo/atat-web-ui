import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import { ClassificationLevelDTO, ServiceOfferingDTO, SystemChoiceDTO } from "@/api/models";
import {TABLENAME as ServiceOfferingTableName } from "@/api/serviceOffering"
import {
  nameofProperty,
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import Vue from "vue";


const ATAT_DESCRIPTION_OF_WORK_KEY = "ATAT_DESCRIPTION_OF_WORK_KEY";

@Module({
  name: "DescriptionOfWork",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class DescriptionOfWorkStore extends VuexModule {
  classificationLevels: ClassificationLevelDTO[] = [];
  initialized = false;
  serviceOfferings: ServiceOfferingDTO[] = [];
  serviceOfferingGroups: SystemChoiceDTO[] = [];

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.classificationLevels),
    nameofProperty(this, (x) => x.serviceOfferings),
    nameofProperty(this, (x) => x.serviceOfferingGroups),
  ];

  @Mutation
  private setClassifications(value: ClassificationLevelDTO[]) {
    this.classificationLevels = value;
  }

  @Mutation
  private setInitialized(value: boolean) {
    this.initialized = value;
  }

  @Mutation
  private setServiceOfferings(value: ServiceOfferingDTO[]) {
    this.serviceOfferings = value;
  }

  @Mutation
  private setServiceOfferingGroups(value: SystemChoiceDTO[]) {
    this.serviceOfferingGroups = value;
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
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({ rawError: true })
  public async getClassificationLevels(): Promise<ClassificationLevelDTO[]> {
    await this.ensureInitialized();
    return this.classificationLevels;
  }

  @Action({ rawError: true })
  public async getServiceOfferingGroups(): Promise<SystemChoiceDTO[]> {
    await this.ensureInitialized();
    return this.serviceOfferingGroups;
  }


  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if (this.initialized) {
      const sessionRestored = retrieveSession(ATAT_DESCRIPTION_OF_WORK_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
      }
    } else {
      try {
        await Promise.all([
          this.loadClassificationLevels(),
          this.loadServiceOfferings(),
          this.LoadServiceOfferingGroups(),
        ]);
        this.setInitialized(true);
        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_DESCRIPTION_OF_WORK_KEY
        );
      } catch (error) {
        console.error(error);
      }
    }
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
  public async loadServiceOfferings(): Promise<void> {
    try {
      const serviceOfferings = await api.serviceOfferingTable.all();
      this.setServiceOfferings(serviceOfferings);
    } catch (error) {
      throw new Error(`error loading Service Offerings ${error}`);
    }
  }

  @Action({rawError: true})
  public async LoadServiceOfferingGroups(): Promise<void> {
    try {
      const serviceOfferingGroups = await api.systemChoices
        .getChoices(ServiceOfferingTableName, "service_offering_group");
      this.setServiceOfferingGroups(serviceOfferingGroups);  
    } catch (error) {
      throw new Error(`error loading Service Offering Groups ${error}`);
    }
  }
}

const DescriptionOfWork = getModule(DescriptionOfWorkStore);
export default DescriptionOfWork;
