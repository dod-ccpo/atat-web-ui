/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {EvaluationCriteriaDTO} from "@/api/models";
import {nameofProperty, retrieveSession, storeDataToSession} from "@/store/helpers";
import Vue from "vue";
import AcquisitionPackage from "../acquisitionPackage";

const ATAT_EVALUATION_CRITERIA_KEY = "ATAT_EVALUATION_CRITERIA_KEY";

/**
 * This module contains all the store and api support that is needed for "Evaluation Criteria" of
 * a new Acquisition
 */
@Module({
  name: "EvaluationCriteriaStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class EvaluationCriteriaStore extends VuexModule {
  initialized = false;
  evaluationCriteria: EvaluationCriteriaDTO | null = null;

  @Action
  public async getEvaluationCriteria():
    Promise<EvaluationCriteriaDTO | null> {
    return this.evaluationCriteria;
  }

  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.evaluationCriteria)
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

  // @Mutation
  // public setInitialized(value: boolean): void {
  //   this.initialized = value;
  // }

  @Mutation
  public setEvaluationCriteria(value: EvaluationCriteriaDTO): void {
    this.evaluationCriteria = value;
    // storeDataToSession(
    //   this,
    //   this.sessionProperties,
    //   ATAT_EVALUATION_CRITERIA_KEY
    // );
  }

  get acquisitionPackageSysId(): string {
    return AcquisitionPackage.getAcquisitionPackageSysId();
  }

  @Action({rawError: true})
  async initialize(): Promise<void> {
    if (!this.initialized) {
      // const sessionRestored = retrieveSession(ATAT_EVALUATION_CRITERIA_KEY);
      // if (sessionRestored) {
      //   this.setStoreData(sessionRestored);
      // } else {
      //   this.setInitialized(true);
      //   storeDataToSession(this, this.sessionProperties, ATAT_EVALUATION_CRITERIA_KEY);
      // }
      await this.loadEvaluationCriteria(this.acquisitionPackageSysId) 
      this.initialized = true;
    }
  }

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  /**
   * Loads the evaluation criteria by making BE api calls and sets it to this store
   */
  @Action({rawError: true})
  async loadEvaluationCriteria(acquisitionSysId: string):
    Promise<EvaluationCriteriaDTO | undefined> {
    // TODO: map the store object to the DB tables and make proper API calls to either
    //  create or update the evaluation criteria.
    try {
      // TODO: figure out the tables to call to load the evaluation criteria
      //  if available, return the object or return undefined to indicate that evaluation
      //  needs to started

      // FIXME: delete below code after the api hookup
      const evaluationCriteria: EvaluationCriteriaDTO = {
        evaluation_plan: {
          source_selection: "NoTechProposal",
          method: "BVTO",
          standard_specifications: ["Test BVTO differentiators"],
          custom_specifications: []
        },
        fair_opportunity: {
          exception_to_fair_opportunity: "Test exception to fair opportunity"
        }
      }
      // FIXME: delete above code after the api hookup

      this.setEvaluationCriteria(evaluationCriteria);
      return Promise.resolve(evaluationCriteria);
    } catch (error) {
      throw new Error(`an error occurred while loading evaluation criteria ${error}`);
    }
  }

  /**
   * Gets the evaluation criteria from this store and makes the api calls to save.
   */
  @Action({rawError: true})
  async saveEvaluationCriteria(): Promise<boolean> {
    // TODO: map the store object to the DB tables and make proper API calls to either
    //  create or update the evaluation criteria.
    try {
      let isSaveSuccessfull = false;
      if (this.evaluationCriteria) {
        // TODO: update or create
        isSaveSuccessfull = true;
      }
      return isSaveSuccessfull;
    } catch (error) {
      throw new Error(`an error occurred saving evaluation criteria ${error}`);
    }
  }
}

const EvaluationCriteria = getModule(EvaluationCriteriaStore);
export default EvaluationCriteria;
