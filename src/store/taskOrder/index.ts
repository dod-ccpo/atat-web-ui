/* eslint-disable camelcase */
import api from "@/api";
import { TaskOrderDTO } from "@/api/models";
import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import Vue from "vue";
import {
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

  @Action
  public async getTaskOrder(): Promise<TaskOrderDTO> {
    return this.value;
  }

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
    if (this.initialized) {
      const sessionRestored = retrieveSession(ATAT_TASK_ORDER_KEY);
      if (sessionRestored) {
        this.setStoreData(sessionRestored);
        this.setInitialized(true);
      }
    }
    if (!this.initialized) {
      const taskOrder = {
        ...initial,
        acquisition_package: acquisitionPackageId,
      };
      this.taskOrder = await this.save(taskOrder);
      this.setInitialized(true);
    }
  }

  @Action({ rawError: true })
  public async save(value: TaskOrderDTO): Promise<TaskOrderDTO> {
    try {
      // this converts any references columns to strings
      value = convertColumnReferencesToValues(value);

      const sysId = this.taskOrder?.sys_id || "";

      const saveTaskOrder =
        sysId.length > 0
          ? api.taskOrderTable.update(sysId, value)
          : api.taskOrderTable.create(value);

      const savedTaskOrder = await saveTaskOrder;

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
    return this.value.incrementally_funded;
  }

}

const TaskOrder = getModule(TaskOrderStore);
export default TaskOrder;
