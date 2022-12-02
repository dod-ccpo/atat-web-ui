/* eslint-disable camelcase */
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import rootStore from "@/store";
import {
  EvalPlanAssessmentAreaDTO, 
  EvalPlanDifferentiatorDTO, 
  EvaluationPlanDTO
} from "@/api/models";
import {nameofProperty} from "@/store/helpers";
import Vue from "vue";
import {api} from "@/api";
import { AxiosRequestConfig } from "axios";

const ATAT_EVALUATION_PLAN_KEY = "ATAT_EVALUATION_PLAN_KEY";

export const defaultEvaluationPlan = (): EvaluationPlanDTO => {
  return {
    source_selection: "",
    method: "",
    has_custom_specifications: "",
    standard_specifications: "",
    custom_specifications: "",
    standard_differentiators: "",
    custom_differentiators: ""
  };
}

/**
 * This module contains all the store and api support that is needed for "Background -
 * evaluation plan" of a new Acquisition
 */
@Module({
  name: "EvaluationPlanStore",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class EvaluationPlanStore extends VuexModule {
  initialized = false;
  evaluationPlan: EvaluationPlanDTO | null = null;
  currentEnvInstanceNumber = 0;

  differentiatorData: EvalPlanDifferentiatorDTO[] = [];
  assessmentAreaData: EvalPlanAssessmentAreaDTO[] = [];

  @Action({rawError: true})
  public async getEvaluationPlan(): Promise<EvaluationPlanDTO | null> {
    await this.ensureInitialized();
    return this.evaluationPlan;
  }

  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.evaluationPlan)
  ];

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for evaluation plan data store");
    }
  }

  @Mutation
  public setDifferentiatorData(value: EvalPlanDifferentiatorDTO[]): void {
    this.differentiatorData = value;
  }

  @Action({rawError: true})
  private async getDifferentiatorData(): Promise<void>{
    const differentiatorRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "ORDERBYsequence",
        sysparm_fields: "name,description,sys_id",
      },
    };

    const differentiatorData = 
      await api.evalPlanDifferentiatorTable.all(differentiatorRequestConfig);

    this.setDifferentiatorData(differentiatorData);
  }

  @Mutation
  public setAssessmentAreaData(value: EvalPlanAssessmentAreaDTO[]): void {
    this.assessmentAreaData = value;
  }

  @Action({rawError: true})
  private async getAssessmentAreaData(): Promise<void>{
    const assessmentAreaRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "ORDERBYsequence",
        sysparm_fields: "name,description,sys_id",
      },
    };

    const assessmentAreaData = 
      await api.evalPlanAssessmentAreaTable.all(assessmentAreaRequestConfig);

    this.setAssessmentAreaData(assessmentAreaData);
  }


  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Action({rawError: true})
  public async setEvaluationPlan(value: EvaluationPlanDTO): Promise<void> {
    this.doSetEvaluationPlan(value);
  }

  @Mutation
  private doSetEvaluationPlan(value: EvaluationPlanDTO): void {
    this.evaluationPlan = value;
  }

  @Action({rawError: true})
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    
    const evaluationPlanDTO = await this.initialEvaluationPlan();
    await this.getAssessmentAreaData();
    await this.getDifferentiatorData();
    await this.setEvaluationPlan(evaluationPlanDTO);
    this.setInitialized(true);
  }

  @Action({rawError: true})
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  /**
   * Creates a evaluation plan object with default values and makes an API
   * call to create the default record in the BE
   */
  @Action({rawError: true})
  public async initialEvaluationPlan():
    Promise<EvaluationPlanDTO> {
    try {
      const evaluationPlanDTO = await api.evaluationPlanTable
        .create(defaultEvaluationPlan());
      return evaluationPlanDTO;
    } catch (error) {
      throw new Error(`an error occurred while initializing evaluation plan ${error}`);
    }
  }

  /**
   * Loads the evaluation plan by making BE api calls and sets it to this store
   */
  @Action({rawError: true})
  async loadEvaluationPlan(): Promise<EvaluationPlanDTO> {
    try {
      const evaluationPlanDTO = await api.evaluationPlanTable
        .retrieve(this.evaluationPlan?.sys_id);
      this.setEvaluationPlan(evaluationPlanDTO);
      return Promise.resolve(evaluationPlanDTO);
    } catch (error) {
      throw new Error(`an error occurred while loading evaluation plan ${error}`);
    }
  }

  /**
   * Gets the evaluation plan from this store and makes the api calls to save.
   */
  @Action({rawError: true})
  async saveEvaluationPlan(): Promise<boolean> {
    try {
      const evaluationPlan = await this.getEvaluationPlan() as EvaluationPlanDTO;
      await api.evaluationPlanTable
        .update(evaluationPlan?.sys_id as unknown as string, evaluationPlan);
      return true;
    } catch (error) {
      throw new Error(`an error occurred saving evaluation plan ${error}`);
    }
  }

  @Action({rawError: true})
  public async loadEvalPlanFromId(sysId: string): Promise<void> {
    const evalPlan = await api.evaluationPlanTable.retrieve(sysId);

    if(evalPlan){
      await this.setEvaluationPlan(evalPlan);
    } else {
      await this.setEvaluationPlan(
        await this.initialEvaluationPlan()
      );
    }

    await this.getAssessmentAreaData();
    await this.getDifferentiatorData();
    this.setInitialized(true);
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_EVALUATION_PLAN_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.evaluationPlan = defaultEvaluationPlan();
    this.currentEnvInstanceNumber = 0;
  }
}

const EvaluationPlan = getModule(EvaluationPlanStore);
export default EvaluationPlan;
