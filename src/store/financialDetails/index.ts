/* eslint-disable camelcase */
import Vue from "vue";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { baseGInvoiceData, fundingIncrement, IFPData } from "types/Global";
import { nameofProperty, retrieveSession, storeDataToSession } from "../helpers";
import { FundingIncrementDTO, FundingPlanDTO, FundingRequestDTO, FundingRequestFSFormDTO, 
  FundingRequestMIPRFormDTO, TaskOrderDTO } from "@/api/models";
import TaskOrder from "../taskOrder";
import api from "@/api";

const ATAT_FINANCIAL_DETAILS__KEY = "ATAT_FINANCIAL_DETAILS__KEY";

const saveIncrement = async (increment: fundingIncrement): Promise<FundingIncrementDTO> => {
  try {
    const fundingIncrement = {
      amount: increment.amt,
      description: increment.qtr,
      order: increment.order + "",
    }
    const incrementSysId = increment.sysId;
    const savedIncrement = incrementSysId?.length ?
      await api.fundingIncrementTable.update(incrementSysId, fundingIncrement) :
      await api.fundingIncrementTable.create(fundingIncrement);

    return savedIncrement;

  } catch (error) {
    throw new Error(`an error occurred saving period ${error}`)
  }
}

const initialFundingPlan: FundingPlanDTO = {
  attachment: "",
  extension: "",
  file_name: "",
  initial_amount: "",
  estimated_task_order_value: "",
  remaining_amount_increments: "",
}

@Module({
  name: 'FinancialDetails',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class FinancialDetailsStore extends VuexModule {
  initialized = false;

  fundingPlan: FundingPlanDTO = this.fundingPlanValue;

  estimatedTaskOrderValue: string | undefined = "";
  fundingRequestType: string | null =  null;
  miprNumber: string | null = null;
  initialFundingIncrementStr: string | undefined = "";
  fundingIncrements: fundingIncrement[] = [];

  useGInvoicing = "";
  gInvoiceNumber = "";

  gtcNumber: string | null = null;
  orderNumber: string | null = null;
  taskOrder: TaskOrderDTO | null = null;
  fundingRequest: FundingRequestDTO | null = null;
  fundingRequestFSForm: FundingRequestFSFormDTO | null = null;
  fundingRequestMIPRForm: FundingRequestMIPRFormDTO | null = null;

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.estimatedTaskOrderValue),
    nameofProperty(this, (x) => x.fundingRequestType),
    nameofProperty(this, (x)=>x.fundingRequest),
    nameofProperty(this, (x)=> x.initialFundingIncrementStr),
    nameofProperty(this, (x)=> x.fundingIncrements),
    nameofProperty(this, (x)=> x.fundingPlan),
    nameofProperty(this, (x)=> x.gtcNumber),
    nameofProperty(this, (x)=> x.orderNumber),
    nameofProperty(this, (x) => x.useGInvoicing),
    nameofProperty(this, (x) => x.gInvoiceNumber),      
  ];
  
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
    await this.loadFundingPlanData();

    const sessionRestored = retrieveSession(ATAT_FINANCIAL_DETAILS__KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
    }
    this.setInitialized(true);

  }
  
  @Action
  public async getGInvoiceData(): Promise<baseGInvoiceData> {
    return {
      useGInvoicing: this.useGInvoicing,
      gInvoiceNumber: this.gInvoiceNumber,
    }
  }

  @Mutation
  public async saveGInvoiceData(data: baseGInvoiceData): Promise<void> {
    this.useGInvoicing = data.useGInvoicing;
    this.gInvoiceNumber = data.gInvoiceNumber;
    
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
    return;
  }

  @Action({ rawError: true })
  public async loadFundingPlanData(): Promise<void> {
    // get funding plan sysID from taskorder table if it exists
    if (!this.fundingPlan.sys_id) {
      const taskOrder = await TaskOrder.getTaskOrder();
      const fundingPlanSysId = taskOrder.funding_plan;

      if (fundingPlanSysId) {
        const fundingPlan = await api.fundingPlanTable.retrieve(fundingPlanSysId as string);
        this.setFundingPlan(fundingPlan);

        this.setEstimatedTaskOrderValue(fundingPlan.estimated_task_order_value);
        this.setInitialAmount(fundingPlan.initial_amount);
        
        const remainingAmountIncrements = fundingPlan.remaining_amount_increments;
        await this.setFundingIncrements(remainingAmountIncrements);

        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_FINANCIAL_DETAILS__KEY
        );      
      } 
    }
    return;
  }

  @Mutation
  public async setFundingIncrements(remainingAmountIncrements: string): Promise<void> {
    const incrementSysIdsStr = remainingAmountIncrements;
    const incrementSysIds = incrementSysIdsStr.split(',');

    const requests = incrementSysIds.map(sysId => api.fundingIncrementTable.retrieve(sysId));
    const results = await Promise.all(requests);
    this.fundingIncrements = [];

    results.forEach((incr) => {
      const incrObj: fundingIncrement = {
        qtr: incr.description,
        amt: incr.amount,
        order: parseInt(incr.order),
        sysId: incr.sys_id,
      }
      this.fundingIncrements.push(incrObj);
    });
    return;
  }

  @Action({ rawError: true })
  public async loadIFPData(): Promise<IFPData> {
    await this.ensureInitialized();

    return {
      initialFundingIncrementStr: this.initialFundingIncrementStr || "",
      fundingIncrements: this.fundingIncrements,
    }
  }

  @Mutation
  public setIFPData(data: IFPData): void {
    this.initialFundingIncrementStr = data.initialFundingIncrementStr;
    this.fundingIncrements = data.fundingIncrements;
  }

  public get fundingPlanValue(): FundingPlanDTO {
    return this.fundingPlan || initialFundingPlan;
  }

  @Mutation
  public setFundingPlan(value: FundingPlanDTO): void {
    this.fundingPlan = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Action({ rawError: true })
  public async saveIFPData(
    { data, removed }: { data: IFPData, removed: fundingIncrement[]}
  ): Promise<void> {
    try {
      this.setIFPData(data);

      const removeIncrements = removed.map(
        incr => api.fundingIncrementTable.remove(incr.sysId || "")
      );
      if (removeIncrements) {
        await Promise.all(removeIncrements);
      }

      const fundingIncrements: fundingIncrement[] = data.fundingIncrements;
      const createOrUpdateIncrements = fundingIncrements.map(incr => saveIncrement(incr));
      const savedIncrements = await Promise.all(createOrUpdateIncrements);

      // NOTE: pass "List" data type to SNOW as comma-delimited string, not array
      const incrementSysIds = savedIncrements.map(incr => incr.sys_id).join(",");

      const IFPData = {
        initial_amount: data.initialFundingIncrementStr,
        remaining_amount_increments: incrementSysIds,
      }

      Object.assign(this.fundingPlan, IFPData);
      const savedFundingPlan = await this.saveFundingPlan();

      // add sysIds to this.fundingIncrements
      const remainingAmountIncrements = savedFundingPlan.remaining_amount_increments
      this.setFundingIncrements(remainingAmountIncrements);

      storeDataToSession(
        this,
        this.sessionProperties,
        ATAT_FINANCIAL_DETAILS__KEY
      );

      // save funding plan sys_id to TaskOrder table
      const fundingPlanSysId = savedFundingPlan.sys_id;
      const taskOrder = TaskOrder.taskOrder;
      if (taskOrder) {
        Object.assign(taskOrder, { funding_plan: fundingPlanSysId });
        const taskOrderSysId = taskOrder.sys_id;
        if (taskOrderSysId) {
          api.taskOrderTable.update(taskOrderSysId, taskOrder);
        }
      }

    } catch(error) {
      throw new Error(`error occurred saving Incremental Funding Data: ${error}`);
    }

  }

  @Action
  public async saveFundingPlan(): Promise<FundingPlanDTO> {
    const sysId = this.fundingPlan.sys_id || "";
    const saveFundingPlan = sysId
      ? api.fundingPlanTable.update(sysId, this.fundingPlan)
      : api.fundingPlanTable.create(this.fundingPlan);

    const savedFundingPlan = await saveFundingPlan;
    this.setFundingPlan(savedFundingPlan)
    return savedFundingPlan;
  }

  @Action
  public async save7600({gtcNumber, orderNumber}: {gtcNumber: string, 
    orderNumber: string}): Promise<void> {
    this.setGTCNumber(gtcNumber);
    this.setOrderNumber(orderNumber);
  }

  @Action
  public async load7600():Promise<{gtcNumber: string, 
    orderNumber: string}>{

    return {
      gtcNumber: this.gtcNumber || "",
      orderNumber: this.orderNumber || ""
    }
  }

  @Action
  public async getMIPRNumber(): Promise<string>  {
    return this.miprNumber || '';
  }

  @Action
  public async getEstimatedTaskOrderValue(): Promise<string> {
    this.ensureInitialized();
    return this.estimatedTaskOrderValue || "";
  }

  @Action
  public async saveEstimatedTaskOrderValue(value: string): Promise<void> {
    this.setEstimatedTaskOrderValue(value);

    Object.assign(this.fundingPlan, 
      { estimated_task_order_value: value }
    );
    await this.saveFundingPlan();

    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );  
  }

  @Action async saveFundingRequest(data: FundingRequestDTO): Promise<void> {
     
    const saveFundingRequest = (data.sys_id && data.sys_id.length > 0) ?
      api.fundingRequestTable.update(data.sys_id, data) :
      api.fundingRequestTable.create(data);

    const savedFundingRequest = await saveFundingRequest;


  }


  @Mutation
  public setEstimatedTaskOrderValue(value: string | undefined): void {
    this.estimatedTaskOrderValue = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setInitialAmount(value: string): void {
    this.initialFundingIncrementStr = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setMIPRNumber(value: string): void {
    this.miprNumber = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setFundingRequestType(value: string): void {
    this.fundingRequestType = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setGTCNumber(value: string): void {
    this.gtcNumber = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setOrderNumber(value: string): void {
    this.orderNumber = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setFundingRequest(value: FundingRequestDTO): void {
    this.fundingRequest = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  private setInitialized(value: boolean) {
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
      throw new Error("error saving session data");
    }
  }

}

const FinancialDetails = getModule(FinancialDetailsStore);
export default FinancialDetails;
