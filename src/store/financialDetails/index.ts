import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { 
  baseGInvoiceData, 
  fundingIncrements, 
  IFPData,  
} from "types/Global";
import { nameofProperty, retrieveSession, storeDataToSession } from "../helpers";
import Vue from "vue";
import { FundingIncrementDTO, FundingPlanAmountsDTO, TaskOrderDTO } from "@/api/models";
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

@Module({
  name: 'FinancialDetails',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class FinancialDetailsStore extends VuexModule {
  
  initialized = false;

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


  @Action
  public async getIFPData(): Promise<IFPData> {
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

  @Action({ rawError: true })
  public async saveIFPData(
    { data, removed }: { data: IFPData, removed: fundingIncrements[]}
  ): Promise<void> {
    try {
      const fundingIncrements: fundingIncrements[] = data.fundingIncrements;

      const removeIncrements = removed.map(
        incr => api.fundingIncrementTable.remove(incr.sysId || "")
      );
      if (removeIncrements) {
        await Promise.all(removeIncrements);
      }

      const saveIncrements = fundingIncrements.map(incr => saveIncrement(incr));
      const savedIncrements = await Promise.all(saveIncrements);

      const incrementSysIds = savedIncrements.map(incr => incr.sys_id);

      const fundingPlandata: FundingPlanAmountsDTO = {
        // eslint-disable-next-line camelcase
        remaining_amount: data.remainingAmountStr,
        // eslint-disable-next-line camelcase
        initial_amount: data.initialFundingIncrementStr,
        // eslint-disable-next-line camelcase
        remaining_amount_increments: incrementSysIds,
      }

      await AcquisitionPackage.saveData({
        fundingPlanData,
        storeProperty: StoreProperties.FundingPlan

      })


      this.setIFPData(data);

      storeDataToSession(
        this,
        this.sessionProperties,
        ATAT_FINANCIAL_DETAILS__KEY
      );

    } catch(error) {
      throw new Error(`error occurred saving Incremental Funding Data: ${error}`);
    }

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

  @Mutation
  public setEstimatedTaskOrderValue(value: string): void {
    this.estimatedTaskOrderValue = value;

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
