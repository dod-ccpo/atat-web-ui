/* eslint-disable camelcase */
import Vue from "vue";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { baseGInvoiceData, fundingIncrement, IFPData } from "types/Global";
import { nameofProperty, retrieveSession, storeDataToSession } from "../helpers";
import {
  FundingIncrementDTO, FundingPlanDTO, FundingRequestDTO, FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO, ReferenceColumn, TaskOrderDTO
} from "@/api/models";
import TaskOrder from "../taskOrder";
import api from "@/api";
import { convertColumnReferencesToValues } from "@/api/helpers";

const ATAT_FINANCIAL_DETAILS__KEY = "ATAT_FINANCIAL_DETAILS__KEY";

const saveIncrement = async (increment: fundingIncrement): Promise<FundingIncrementDTO> => {
  try {
    const fundingIncrement = {
      amount: increment.amt,
      description: increment.text,
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

export const initialFundingRequestFSForm: FundingRequestFSFormDTO = {

  fs_form_7600a_filename: "",
  fs_form_7600a_attachment: "",
  fs_form_7600b_attachment: "",
  fs_form_7600b_filename: "",
  use_g_invoicing: "",
  order_number: "",
  gt_c_number: "",
}

export const initialFundingRequestMIPRForm: FundingRequestMIPRFormDTO = {
  mipr_number: "",
  mipr_filename: "",
  mipr_attachment: "",
}

const saveFundingRequestToDISA = async (data: FundingRequestDTO):
 Promise<FundingRequestDTO>=>{
  const saveFundingRequest = (data.sys_id && data.sys_id.length > 0) ?
    api.fundingRequestTable.update(data.sys_id, data) :
    api.fundingRequestTable.create(data);
  const savedFundingRequest = await saveFundingRequest;
  return savedFundingRequest;
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
  miprNumber: string | null = null;
  isIncrementallyFunded: string | undefined = "";
  initialFundingIncrementStr: string | undefined = "";
  fundingIncrements: fundingIncrement[] = [];

  gtcNumber: string | null = null;
  orderNumber: string | null = null;
  taskOrder: TaskOrderDTO | null = null;
  fundingRequest: FundingRequestDTO | null = null;
  fundingRequestFSForm: FundingRequestFSFormDTO | null = null;
  fundingRequestMIPRForm: FundingRequestMIPRFormDTO | null = null;

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.estimatedTaskOrderValue),
    nameofProperty(this, (x)=>x.fundingRequest),
    nameofProperty(this, (x)=>x.fundingRequestFSForm),
    nameofProperty(this, (x)=>x.fundingRequestMIPRForm),
    nameofProperty(this, (x)=> x.initialFundingIncrementStr),
    nameofProperty(this, (x)=> x.fundingIncrements),
    nameofProperty(this, (x)=> x.fundingPlan),
    nameofProperty(this, (x)=> x.gtcNumber),
    nameofProperty(this, (x)=> x.orderNumber),
  ];


  public get fundingRequestType(): string {

    if(this.fundingRequest == null)
    {
      return "";
    }

    return this.fundingRequest.funding_request_type.length > 0 ?
    this.fundingRequest?.funding_request_type : "";
  }

  public get gInvoicingData(): baseGInvoiceData {

    if(this.fundingRequestFSForm == null)
    {
      return {

        useGInvoicing: "",
        gInvoiceNumber: "",
      }
    }

    const {use_g_invoicing, gt_c_number} = this.fundingRequestFSForm;
    return  {

      useGInvoicing: use_g_invoicing,
      gInvoiceNumber: gt_c_number,
    }
  }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const sessionRestored = retrieveSession(ATAT_FINANCIAL_DETAILS__KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
    }

    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
    this.setInitialized(true);

  }

  @Action
  public async saveGInvoiceData(data: baseGInvoiceData): Promise<void> {
    const fsForm: FundingRequestFSFormDTO = this.fundingRequestFSForm
    || initialFundingRequestFSForm

    const formToSave = {
      ...fsForm,
      use_g_invoicing: data.useGInvoicing,
      gt_c_number: data.gInvoiceNumber,
    }

    const savedForm = await this.saveFundingRequestFSForm(formToSave);
    this.setFundingRequestFSForm(savedForm);
  }

  @Action({ rawError: true })
  public async setFundingPlanData(fundingPlanSysId: string): Promise<void> {
    let fundingPlan = await api.fundingPlanTable.retrieve(fundingPlanSysId as string);
    fundingPlan = convertColumnReferencesToValues(fundingPlan);
    this.setFundingPlan(fundingPlan);

    this.setEstimatedTaskOrderValue(fundingPlan.estimated_task_order_value);
    this.setInitialAmount(fundingPlan.initial_amount);
    
    const remainingAmountIncrements = fundingPlan.remaining_amount_increments;
    await this.setFundingIncrements(remainingAmountIncrements);
  }

  @Action({ rawError: true })
  public async setIsIncrementallyFunded(val: string): Promise<void> {
    this.doSetIsIncrementallyFunded(val);
  }

  @Mutation
  public doSetIsIncrementallyFunded(val: string): void {
    this.isIncrementallyFunded = val;
  }

  @Mutation
  public async setFundingIncrements(remainingAmountIncrements: string): Promise<void> {
    this.fundingIncrements = [];
    if (remainingAmountIncrements.length) {
      const incrementSysIds = remainingAmountIncrements.split(',');
      const requests = incrementSysIds.map(sysId => api.fundingIncrementTable.retrieve(sysId));
      const results = await Promise.all(requests);

      results.forEach((incr) => {
        const incrObj: fundingIncrement = {
          text: incr.description,
          amt: incr.amount,
          order: parseInt(incr.order),
          sysId: incr.sys_id,
          qtrOrder: 0,
        }
        this.fundingIncrements.push(incrObj);
      });

      storeDataToSession(
        this,
        this.sessionProperties,
        ATAT_FINANCIAL_DETAILS__KEY
      );
    }
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
      let incrementSysIds = "";
      if(fundingIncrements.length) {
        const createOrUpdateIncrements = fundingIncrements.map(incr => saveIncrement(incr));
        const savedIncrements = await Promise.all(createOrUpdateIncrements);
        // NOTE: pass "List" data type to SNOW as comma-delimited string, not array
        incrementSysIds = savedIncrements.map(incr => incr.sys_id).join(",");
      }
      const IFPData = {
        initial_amount: data.initialFundingIncrementStr,
        remaining_amount_increments: incrementSysIds,
      }

      Object.assign(this.fundingPlan, IFPData);
      let savedFundingPlan = await this.saveFundingPlan();
      savedFundingPlan = convertColumnReferencesToValues(savedFundingPlan);
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
          // since only update is performed here, need to check for task order sys id
          // before calling save. Otherwise, record gets created and may be undesirable
          await TaskOrder.save(taskOrder);
        }
      }

    } catch(error) {
      throw new Error(`error occurred saving Incremental Funding Data: ${error}`);
    }

  }

  @Action({ rawError: true })
  public async saveFundingPlan(): Promise<FundingPlanDTO> {

    const sysId = this.fundingPlan.sys_id || "";
    const saveFundingPlan = sysId
      ? api.fundingPlanTable.update(sysId, this.fundingPlan)
      : api.fundingPlanTable.create(this.fundingPlan);

    let savedFundingPlan = await saveFundingPlan;
    savedFundingPlan = convertColumnReferencesToValues(savedFundingPlan);

    this.setFundingPlan(savedFundingPlan)
    return savedFundingPlan;
  }

  @Action({ rawError: true })
  public async save7600({gtcNumber, orderNumber}: {gtcNumber: string, 
    orderNumber: string}): Promise<void> {
    this.setGTCNumber(gtcNumber);
    this.setOrderNumber(orderNumber);
  }

  @Action({ rawError: true })
  public async load7600():Promise<{gtcNumber: string, 
    orderNumber: string}>{

    return {
      gtcNumber: this.gtcNumber || "",
      orderNumber: this.orderNumber || ""
    }
  }

  @Action({ rawError: true })
  public async getMIPRNumber(): Promise<string>  {
    return this.miprNumber || '';
  }

  @Action({ rawError: true })
  public async getEstimatedTaskOrderValue(): Promise<string> {
    this.ensureInitialized();
    return this.estimatedTaskOrderValue || "";
  }

  @Action({ rawError: true })
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

 @Action({rawError: true})
  public async saveFundingRequest(data: FundingRequestDTO): Promise<void> {

    try {
      const savedFundingRequest = await saveFundingRequestToDISA(data);
      this.setFundingRequest(savedFundingRequest);
    } catch (error) {

      throw new Error(`error saving funding request ${error}`);

    }

  }

  @Action({rawError: true})
 async loadFundingRequest():Promise<FundingRequestDTO>{
   this.ensureInitialized();

   try {
     if(this.fundingRequest == null){
       const fundingRequest: FundingRequestDTO = {
         fs_form: "",
         funding_request_type: "",
         mipr: ""
       }

       return fundingRequest;
     }

     const fundingRequest = await api.fundingRequestTable
       .retrieve(this.fundingRequest.sys_id);
     this.setFundingRequest(fundingRequest);
     return fundingRequest;
   } catch (error) {
     throw new Error(`error occurred retrieving funding request ${error}`);
   }
 }

 @Action({rawError: true})
  async loadFundingRequestFSForm():Promise<FundingRequestFSFormDTO>{
    this.ensureInitialized();

    try {
      if(this.fundingRequestFSForm == null){
        return initialFundingRequestFSForm;
      }
      const fundingRequestForm = await api.fundingRequestFSFormTable
        .retrieve(this.fundingRequestFSForm.sys_id);
      this.setFundingRequestFSForm(fundingRequestForm);
      this.setGTCNumber(fundingRequestForm.gt_c_number);
      this.setOrderNumber(fundingRequestForm.order_number);
      return fundingRequestForm;
    } catch (error) {
      throw new Error(`error occurred retrieving funding request form ${error}`);
    }
  }

  @Action({rawError: true})
 async loadFundingRequestMIPRForm():Promise<FundingRequestMIPRFormDTO>{
   this.ensureInitialized();

   try {
     if(this.fundingRequestMIPRForm == null){
       return initialFundingRequestMIPRForm;
     }
     const fundingRequestForm = await api.fundingRequestMIPRFormTable
       .retrieve(this.fundingRequestMIPRForm.sys_id);
     this.setFundingRequestMIPRForm(fundingRequestForm);
     return fundingRequestForm;
   } catch (error) {
     throw new Error(`error occurred retrieving funding request form ${error}`);
   }
 }

 @Action({rawError: true})
  async saveFundingRequestType(value: string): Promise<void> {

    const fundingRequest = this.fundingRequest === null ?
      {
        fs_form: "",
        funding_request_type: value,
        mipr: ""
      } : {
        ...this.fundingRequest,
        funding_request_type: value,
      }

    const savedFundingRequest = await saveFundingRequestToDISA(fundingRequest);
    this.setFundingRequest(savedFundingRequest);
  }

  @Action({rawError: true})
 public async saveFundingRequestFSForm(data:
  FundingRequestFSFormDTO): Promise<FundingRequestFSFormDTO>{

   try {

     const saveFundingRequestFSForm = (data.sys_id && data.sys_id.length > 0) ?
       api.fundingRequestFSFormTable.update(data.sys_id, data) :
       api.fundingRequestFSFormTable.create(data);
     const savedFundingRequestFSForm = await saveFundingRequestFSForm;
     this.setFundingRequestFSForm(savedFundingRequestFSForm);

     return savedFundingRequestFSForm;

   } catch (error) {
     throw new Error( `error occurred saving funding request form ${error}`);
   }
 }

  @Action({rawError: true})
  public async saveFundingRequestMIPRForm(data:
  FundingRequestMIPRFormDTO): Promise<FundingRequestMIPRFormDTO>{

    try {

      const saveFundingRequesMIPRForm = (data.sys_id && data.sys_id.length > 0) ?
        api.fundingRequestMIPRFormTable.update(data.sys_id, data) :
        api.fundingRequestMIPRFormTable.create(data);
      const savedFundingRequestMIPRForm = await saveFundingRequesMIPRForm;
      this.setFundingRequestMIPRForm(savedFundingRequestMIPRForm);

      return savedFundingRequestMIPRForm;

    } catch (error) {
      throw new Error( `error occurred saving funding request form ${error}`);
    }
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
  public setFundingRequestFSForm(value: FundingRequestFSFormDTO): void {
    this.fundingRequestFSForm = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
  }

  @Mutation
  public setFundingRequestMIPRForm(value: FundingRequestMIPRFormDTO): void {
    this.fundingRequestMIPRForm = value;
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

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_FINANCIAL_DETAILS__KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.initialized = false;
    this.fundingPlan = initialFundingPlan;
    this.estimatedTaskOrderValue = "";
    this.miprNumber = null;
    this.initialFundingIncrementStr = "";
    this.fundingIncrements = [];
    this.gtcNumber = null;
    this.orderNumber = null;
    this.taskOrder = null;
    this.fundingRequest = null;
    this.fundingRequestFSForm = null;
    this.fundingRequestMIPRForm = null;
  }

}

const FinancialDetails = getModule(FinancialDetailsStore);
export default FinancialDetails;
