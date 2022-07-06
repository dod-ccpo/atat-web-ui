/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { 
  baseGInvoiceData, 
  fundingIncrements, 
  IFPData,  
} from "types/Global";
import { nameofProperty, retrieveSession, storeDataToSession } from "../helpers";
import Vue from "vue";
import { FundingIncrementDTO,
  FundingPlanDTO,
  // FundingPlanAmountsDTO, 
  TaskOrderDTO } from "@/api/models";
import TaskOrder from "../taskOrder";

import api from "@/api";
import AcquisitionPackage, { StoreProperties } from "../acquisitionPackage";

const ATAT_FINANCIAL_DETAILS__KEY = "ATAT_FINANCIAL_DETAILS__KEY";

const saveIncrement = async (increment: fundingIncrements): Promise<FundingIncrementDTO> => {
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
  remaining_amount: "",
  initial_amount: "",
  estimated_task_order_value: "",
  remaining_amount_increments: [""],
}

@Module({
  name: 'FinancialDetails',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class FinancialDetailsStore extends VuexModule {
  
  initialized = false;
  // fundingPlan: FundingPlanDTO | null = null;
  fundingPlan: FundingPlanDTO = this.fundingPlanValue;

  estimatedTaskOrderValue: string | null =  null;
  fundingRequestType: string | null =  null;
  miprNumber: string | null = null;
  initialFundingIncrementStr = "";
  fundingIncrements: fundingIncrements[] = [];
  remainingAmountStr = "";

  useGInvoicing = "";
  gInvoiceNumber = "";

  gtcNumber: string | null = null;
  orderNumber: string | null = null;
  taskOrder: TaskOrderDTO | null = null;


  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.estimatedTaskOrderValue),
    nameofProperty(this, (x) => x.fundingRequestType),
    nameofProperty(this, (x)=> x.initialFundingIncrementStr),
    nameofProperty(this, (x)=> x.remainingAmountStr),
    nameofProperty(this, (x)=> x.fundingIncrements),
    nameofProperty(this, (x)=> x.fundingPlan),
    nameofProperty(this, (x)=> x.gtcNumber),
    nameofProperty(this, (x)=> x.orderNumber),
    nameofProperty(this, (x) => x.useGInvoicing),
    nameofProperty(this, (x) => x.gInvoiceNumber),      
  ];
  
  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    const sessionRestored = retrieveSession(ATAT_FINANCIAL_DETAILS__KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    }
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
  public async loadIFPData(): Promise<IFPData> {
    // const foo = StoreProperties.FundingPlanAmounts;
    // debugger;

    // const data = await AcquisitionPackage
    //   .loadData<FundingPlanDTO>({ storeProperty: StoreProperties.FundingPlan })
    // .loadData<FundingPlanAmountsDTO>({ storeProperty: StoreProperties.FundingPlanAmounts })
    // this.fundingPlanSysId = data.sys_id || "";
    // debugger;

    return {
      initialFundingIncrementStr: this.initialFundingIncrementStr,
      fundingIncrements: this.fundingIncrements,
      remainingAmountStr: this.remainingAmountStr,
    }
  }

  @Mutation
  public setIFPData(data: IFPData): void {
    this.initialFundingIncrementStr = data.initialFundingIncrementStr;
    this.fundingIncrements = data.fundingIncrements;
    this.remainingAmountStr = data.remainingAmountStr;
  }

  // @Action({ rawError: true })
  // public async loadIFPData(): Promise<void> {
  //   const data = await AcquisitionPackage
  //     .loadData<FundingPlanAmountsDTO>({ storeProperty: StoreProperties.FundingPlanAmounts })
  //   this.fundingPlanSysId = data.sys_id || "";
  //   debugger;
  //   // const savedIFPData: IFPData = {
  //   //   initialFundingIncrementStr: data.initial_amount,
  //   //   fundingIncrements: data.remaining_amount_increments,
  //   //   remainingAmountStr: data.remaining_amount,
  //   // }
    
  // }

  public get fundingPlanValue(): FundingPlanDTO {
    return this.fundingPlan || initialFundingPlan;
  }

  @Mutation
  public setFundingPlan(value: FundingPlanDTO): void {
    this.fundingPlan = value;
    storeDataToSession(this, this.sessionProperties, ATAT_FINANCIAL_DETAILS__KEY);
  }

  @Action({ rawError: true })
  public async saveIFPData(
    { data, removed }: { data: IFPData, removed: fundingIncrements[]}
  ): Promise<void> {
    try {
      this.setIFPData(data);

      const fundingIncrements: fundingIncrements[] = data.fundingIncrements;

      const removeIncrements = removed.map(
        incr => api.fundingIncrementTable.remove(incr.sysId || "")
      );
      if (removeIncrements) {
        await Promise.all(removeIncrements);
      }

      const saveIncrements = fundingIncrements.map(incr => saveIncrement(incr));
      const savedIncrements = await Promise.all(saveIncrements);
      debugger;
      const incrementSysIds = savedIncrements.map(incr => incr.sys_id);

      const IFPData = {
        remaining_amount: data.remainingAmountStr,
        initial_amount: data.initialFundingIncrementStr,
        remaining_amount_increments: incrementSysIds,
      }

      Object.assign(this.fundingPlan, IFPData);

      // const sysId = this.fundingPlan.sys_id || "";
      // const saveFundingPlan = sysId
      //   ? api.fundingPlanTable.update(sysId, this.fundingPlan)
      //   : api.fundingPlanTable.create(this.fundingPlan);

      // const savedFundingPlan = await saveFundingPlan;
      // this.setFundingPlan(savedFundingPlan)
      const savedFundingPlan = await this.saveFundingPlan();

      storeDataToSession(
        this,
        this.sessionProperties,
        ATAT_FINANCIAL_DETAILS__KEY
      );

      // save funding plan sys id to TaskOrder table
      const fundingPlanSysId = savedFundingPlan.sys_id;
      const taskOrder = TaskOrder.taskOrder;
      if (taskOrder) {
        Object.assign(taskOrder, { funding_plan: fundingPlanSysId })
        const taskOrderSysId = taskOrder.sys_id;
        if (taskOrderSysId) {
          api.taskOrderTable.update(taskOrderSysId, taskOrder);
        }
      }

      // await AcquisitionPackage.setFundingPlanAmounts(fundingPlanData);

      // await AcquisitionPackage.saveData({
      //   data: fundingPlanData,
      //   storeProperty: StoreProperties.FundingPlanAmounts
      // });


    } catch(error) {
      throw new Error(`error occurred saving Incremental Funding Data: ${error}`);
    }

  }

  @Action
  public async saveFundingPlan(): Promise<FundingPlanDTO> {
    debugger;

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
  public async saveEstimatedTaskOrderValue(value: string): Promise<void> {
    this.setEstimatedTaskOrderValue(value);

    Object.assign(this.fundingPlan, 
      { estimated_task_order_value: value }
    );
    debugger;
    
    const savedFundingPlan = await this.saveFundingPlan();
    debugger;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );

  }

  @Mutation
  public setEstimatedTaskOrderValue(value: string): void {
    this.estimatedTaskOrderValue = value;
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
