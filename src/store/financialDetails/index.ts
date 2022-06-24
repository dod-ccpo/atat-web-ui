import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { fundingIncrements, IFPData } from "types/Global";
import { nameofProperty, retrieveSession, storeDataToSession } from "../helpers";
import Vue from "vue";

const ATAT_FINANCIAL_DETAILS__KEY = "ATAT_FINANCIAL_DETAILS__KEY";


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

  initialFundingIncrementStr = "";
  initialFundingIncrement = 0; // EJY save number or string in store?
  fundingIncrements: fundingIncrements[] = [];

  gtcNumber: string | null = null;
  orderNumber: string | null = null;

    // store session properties
    protected sessionProperties: string[] = [
      nameofProperty(this, (x) => x.estimatedTaskOrderValue),
      nameofProperty(this, (x) => x.fundingRequestType),
      nameofProperty(this, (x)=> x.initialFundingIncrement),
      nameofProperty(this, (x)=> x.initialFundingIncrementStr),
      nameofProperty(this, (x)=> x.fundingIncrements),
      nameofProperty(this, (x)=> x.gtcNumber),
      nameofProperty(this, (x)=> x.orderNumber),
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
    public async getIFPData(): Promise<IFPData> {
      return {
        initialFundingIncrementStr: this.initialFundingIncrementStr,
        fundingIncrements: this.fundingIncrements,
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


  @Mutation
  public async setIFPData(data: IFPData): Promise<void> {
    this.initialFundingIncrementStr = data.initialFundingIncrementStr;
    this.fundingIncrements = data.fundingIncrements;

    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_FINANCIAL_DETAILS__KEY
    );
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
