/* eslint-disable camelcase */
import api from "@/api";
import {FundingRequirementDTO, TaskOrderDTO} from "@/api/models";
import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import Vue from "vue";
import storeHelperFunctions, {
  nameofProperty,
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import { convertColumnReferencesToValues } from "@/api/helpers";
import FinancialDetails from "../financialDetails";

const ATAT_TASK_ORDER_KEY = "ATAT_TASK_ORDER_KEY";

const initial: TaskOrderDTO = {
  clins: "",
  incrementally_funded: "",
  funds_obligated: "",
  acquisition_package: "",
  task_order_number: "",
  task_order_status: "",
  portfolio: "",
  funding_plan: "",
  pop_end_date: "",
  pop_start_date: "",
  funds_total: "",
};

@Module({
  name: "TaskOrder",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})
export class TaskOrderStore extends VuexModule {
  initialized = false;
  taskOrder: TaskOrderDTO | null = null;

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.taskOrder),
  ];

  public get value(): TaskOrderDTO {
    return this.taskOrder || initial;
  }

  @Mutation
  public setTaskOrder(value: TaskOrderDTO): void {
    this.taskOrder = value;
    storeDataToSession(this, this.sessionProperties, ATAT_TASK_ORDER_KEY);
  }

  @Mutation
  public setInitialized(value: boolean): void {
    this.initialized = value;
  }

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for Task Order store");
    }
  }

  @Action({ rawError: true })
  public async initialize(acquisitionPackageId: string): Promise<void> {

    const sessionRestored = storeHelperFunctions.retrieveSession(ATAT_TASK_ORDER_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    }else{
      const taskOrder = {
        ...initial,
        acquisition_package: acquisitionPackageId,
      };
      await this.save(taskOrder);
      this.setInitialized(true);
    }
  }

  @Action({ rawError: true })
  public async save(value: TaskOrderDTO): Promise<TaskOrderDTO> {
    try {
      // this converts any references columns to strings
      value = convertColumnReferencesToValues(value);
      // separate out into objects that need to be saved to task order & funding req tables
      const taskOrderForSave: any = {
        clins: value.clins,
        pop_start_date: value.pop_start_date,
        pop_end_date: value.pop_end_date,
        portfolio: value.portfolio,
        task_order_number: value.task_order_number,
        task_order_status: value.task_order_status
      }

      const fundingRequirementForSave: FundingRequirementDTO = {
        acquisition_package: value.acquisition_package,
        funding_plan: value.funding_plan,
        funding_request: "",
        funds_obligated: value.funds_obligated,
        funds_total: value.funds_total,
        incrementally_funded: value.incrementally_funded,
        pop_end_date: value.pop_end_date,
        pop_start_date: value.pop_start_date,
        task_order_number: value.task_order_number
      }

      const sysId = this.taskOrder?.sys_id || "";
      const saveTaskOrder =
        sysId.length > 0
          ? api.taskOrderTable.update(sysId, taskOrderForSave)
          : api.taskOrderTable.create(taskOrderForSave);
      const savedTaskOrder = await saveTaskOrder;

      const fundingReqSysId = this.taskOrder?.funding_requirement?.sys_id || "";
      const saveFundingRequirement =
        fundingReqSysId.length > 0
          ? api.fundingRequirementTable.update(sysId, fundingRequirementForSave)
          : api.fundingRequirementTable.create(fundingRequirementForSave);
      const savedFundingReq = await saveFundingRequirement;
      savedTaskOrder.funding_requirement = savedFundingReq;
      // set the funding properties of task order dto for backward compatibility
      savedTaskOrder.incrementally_funded = savedFundingReq.incrementally_funded;
      savedTaskOrder.funds_obligated = savedFundingReq.funds_obligated;
      savedTaskOrder.acquisition_package = savedFundingReq.acquisition_package;
      savedTaskOrder.funding_plan = savedFundingReq.funding_plan;
      savedTaskOrder.funds_total = savedFundingReq.funds_total;
      this.setTaskOrder(savedTaskOrder);
      if (savedTaskOrder.funding_plan) {
        await FinancialDetails.loadFundingPlanData();
      }
      return savedTaskOrder;
    } catch (error) {
      throw new Error(`error saving TaskOrder ${error}`);
    }
  }

  @Action
  public async isIncrementallyFunded(): Promise<string> {
    if (!this.value.sys_id) {
      const sessionData = retrieveSession(ATAT_TASK_ORDER_KEY);
      if (sessionData){
        const TOObj = JSON.parse(sessionData);
        if (Object.prototype.hasOwnProperty.call(TOObj, "taskOrder") && !this.taskOrder) {
          this.setTaskOrder(TOObj.taskOrder);
        }
      }
    }
    return this.value.incrementally_funded;
  }

}

const TaskOrder = getModule(TaskOrderStore);
export default TaskOrder;
