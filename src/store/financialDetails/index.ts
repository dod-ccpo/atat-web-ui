/* eslint-disable camelcase */
import Vue from "vue";
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";

import { baseGInvoiceData, fundingIncrement, IFPData } from "types/Global";
import { nameofProperty, retrieveSession, storeDataToSession } from "../helpers";
import {
  AcquisitionPackageDTO,
  FundingIncrementDTO, FundingPlanDTO, FundingRequestDTO, FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO, FundingRequirementDTO, ReferenceColumn
} from "@/api/models";
import api from "@/api";
import { convertColumnReferencesToValues } from "@/api/helpers";
import {AxiosRequestConfig} from "axios";
import AcquisitionPackage from "@/store/acquisitionPackage";
import _ from "lodash";

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
  fundingRequest: FundingRequestDTO | null = null;
  fundingRequestFSForm: FundingRequestFSFormDTO | null = null;
  fundingRequestMIPRForm: FundingRequestMIPRFormDTO | null = null;
  fundingRequirement: FundingRequirementDTO | null = null;

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

  @Action
  public async getFundingRequest(): Promise<FundingRequestDTO> {
    return this.fundingRequest as FundingRequestDTO;
  }

  @Action
  public async getFundingRequirement(): Promise<FundingRequirementDTO> {
    return this.fundingRequirement as FundingRequirementDTO;
  }

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
    if (this.fundingRequirement) {
      this.fundingRequirement.incrementally_funded = val;
    }
  }

  @Mutation
  public async setFundingIncrements(remainingAmountIncrementsSysIds: string): Promise<void> {
    this.fundingIncrements = [];
    if (remainingAmountIncrementsSysIds.length) {
      const incrementSysIds = remainingAmountIncrementsSysIds.split(',');
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
    return this.fundingPlan || _.cloneDeep(initialFundingPlan);
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
      await this.setFundingIncrements(remainingAmountIncrements);

      storeDataToSession(
        this,
        this.sessionProperties,
        ATAT_FINANCIAL_DETAILS__KEY
      );

      // save funding plan sys_id to Funding Requirement table if doesn't exist yet
      const fundingPlanSysId = savedFundingPlan.sys_id;      
      if (fundingPlanSysId && this.fundingRequirement && !this.fundingRequirement.funding_plan) {
        this.fundingRequirement.funding_plan = fundingPlanSysId;
        this.saveFundingRequirement();
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
      const savedFundingRequest = await this.saveFundingRequestToDISA(data);
      this.setFundingRequest(savedFundingRequest);
    } catch (error) {

      throw new Error(`error saving funding request ${error}`);

    }

  }

  @Action({rawError: true})
 async saveFundingRequestToDISA(data: FundingRequestDTO): Promise<FundingRequestDTO> {
   data = convertColumnReferencesToValues(data);
   const saveFundingRequest = (data.sys_id && data.sys_id.length > 0) ?
     api.fundingRequestTable.update(data.sys_id, data) :
     api.fundingRequestTable.create(data);
   const savedFundingRequest = await saveFundingRequest;
   return savedFundingRequest;
 }

  /**
   * Gets the acquisition package from the acquisition package store. Then
   * uses the funding request sys_id to load the funding request. If the
   * funding request reference is null and tied to acquisition, then loads
   * the funding request.
   *
   * Otherwise, if funding request is null and NOT tied to acquisition, then
   * initializes the funding request and ties that to the acquisition.
   *
   * This function takes out the burden of doing all the above steps in several places
   * of the acquisition package store. Also helps performance by loading data from the
   * API on demand. Acquisition package store impl should be refactored to this approach.
   */
  @Action({rawError: true})
  public async loadFundingRequest(): Promise<void> {
    try {
      const acquisitionPackageDTO: AcquisitionPackageDTO =
        AcquisitionPackage.acquisitionPackage as AcquisitionPackageDTO;
      const fundingRequestDTO = await this.getFundingRequest();
      if (fundingRequestDTO === null && acquisitionPackageDTO.funding_request) {
        // load funding request
        const fundingRequestSysId = typeof acquisitionPackageDTO.funding_request === "object"
          ? acquisitionPackageDTO.funding_request.value as string
          : acquisitionPackageDTO.funding_request as string;
        const fundingRequest = await api.fundingRequestTable
          .retrieve(fundingRequestSysId);
        this.setFundingRequest(fundingRequest);
      } else if (fundingRequestDTO === null && !acquisitionPackageDTO.funding_request) {
        // initialize funding request and set it to acquisition package
        const defaultFundingRequest: FundingRequestDTO = {
          fs_form: "",
          funding_request_type: "",
          mipr: ""
        }
        const fundingRequest = await api.fundingRequestTable
          .create(defaultFundingRequest);
        acquisitionPackageDTO.funding_request = fundingRequest.sys_id;
        await AcquisitionPackage.updateAcquisitionPackage();
        this.setFundingRequest(fundingRequest);
      }
    } catch (error) {
      throw new Error(`Error occurred loading funding request ${error}`);
    }
  }

  /**
   * Gets the funding request. Then uses the fs_form reference value to load the 
   * FS Form data (FSF). If the FSF is null and tied to acquisition, then loads FSF.
   *
   * Otherwise, if FSF is null and NOT tied to funding request, then
   * initializes FSF and ties that to the funding request.
   */
  @Action({rawError: true})
  public async loadFundingRequestFSForm(): Promise<FundingRequestFSFormDTO> {
    try {
      await this.loadFundingRequest();
      const fundingRequestDTO = await this.getFundingRequest();
      const fsFormDTO = this.fundingRequestFSForm;
      if (fsFormDTO === null && fundingRequestDTO.fs_form) {
        // load funding request
        const fsFormSysId = typeof fundingRequestDTO.fs_form === "object"
          ? (fundingRequestDTO.fs_form as unknown as ReferenceColumn).value as string
          : fundingRequestDTO.fs_form;
        const fsForm = await api.fundingRequestFSFormTable.retrieve(fsFormSysId);
        this.setFundingRequestFSForm(fsForm);
      } else if (fsFormDTO === null && !fundingRequestDTO.fs_form) {
        // initialize funding request and set it to acquisition package
        const fsForm = await api.fundingRequestFSFormTable
          .create(initialFundingRequestFSForm);
        fundingRequestDTO.fs_form = fsForm.sys_id as string;
        await this.saveFundingRequestToDISA(fundingRequestDTO);
        this.setFundingRequestFSForm(fsForm);
      }
      this.setGTCNumber((this.fundingRequestFSForm as FundingRequestFSFormDTO).gt_c_number);
      this.setOrderNumber((this.fundingRequestFSForm as FundingRequestFSFormDTO).order_number);
      return this.fundingRequestFSForm as FundingRequestFSFormDTO;
    } catch (error) {
      throw new Error(`Error occurred loading funding request FS Form data ${error}`);
    }
  }

  /**
   * Gets the funding request. Then uses the mipr_form reference value to load the
   * MIPR Form data (MIPRF). If the MIPRF is null and tied to acquisition, then loads MIPRF.
   *
   * Otherwise, if MIPRF is null and NOT tied to funding request, then
   * initializes MIPRF and ties that to the funding request.
   */
  @Action({rawError: true})
  public async loadFundingRequestMIPRForm(): Promise<FundingRequestMIPRFormDTO> {
    try {
      await this.loadFundingRequest();
      const fundingRequestDTO = await this.getFundingRequest();
      const miprFormDTO = this.fundingRequestMIPRForm;
      if (miprFormDTO === null && fundingRequestDTO.mipr) {
        // load funding request
        const miprFormSysId = typeof fundingRequestDTO.mipr === "object"
          ? (fundingRequestDTO.mipr as unknown as ReferenceColumn).value as string
          : fundingRequestDTO.mipr;
        const miprForm = await api.fundingRequestMIPRFormTable.retrieve(miprFormSysId);
        this.setFundingRequestMIPRForm(miprForm);
      } else if (miprFormDTO === null && !fundingRequestDTO.mipr) {
        // initialize funding request and set it to acquisition package
        const miprForm = await api.fundingRequestMIPRFormTable
          .create(initialFundingRequestMIPRForm);
        fundingRequestDTO.mipr = miprForm.sys_id as string;
        await this.saveFundingRequestToDISA(fundingRequestDTO);
        this.setFundingRequestMIPRForm(miprForm);
      }
      return this.fundingRequestMIPRForm as FundingRequestMIPRFormDTO;
    } catch (error) {
      throw new Error(`Error occurred loading funding request MIPR Form data ${error}`);
    }
  }


  /**
   * Gets the acquisition package from the acquisition package store and uses the
   * acquisition package sys_id to load the funding requirements.
   *
   * If the funding requirements list comes back as empty array, then initializes
   * the funding requirement
   *
   * If the funding requirements list comes back as array with size 1, then sets the
   * funding requirement to this store
   */
  @Action({rawError: true})
  public async loadFundingRequirement(): Promise<void> {
    try {
      const fundingRequirement = await this.getFundingRequirement();
      if (!fundingRequirement) {
        const acquisitionPackageDTO: AcquisitionPackageDTO =
          AcquisitionPackage.acquisitionPackage as AcquisitionPackageDTO;
        const fundingRequirementRequestConfig: AxiosRequestConfig = {
          params: {
            sysparm_query: "^acquisition_packageIN" + acquisitionPackageDTO?.sys_id
          }
        };
        const fundingRequirementList = await api.fundingRequirementTable
          .getQuery(fundingRequirementRequestConfig);
        if(fundingRequirementList.length > 0) {
          const fundingRequirement = convertColumnReferencesToValues(fundingRequirementList[0]);
          this.setFundingRequirement(fundingRequirement);
          await this.setIsIncrementallyFunded(fundingRequirement.incrementally_funded);
          if (fundingRequirement.funding_plan) {
            await this.setFundingPlanData(fundingRequirement.funding_plan)
          }
          // load the financial Poc  of the funding requirement and store
          // the contact to the "financialPocInfo" property in Acquisition Package store
          if(fundingRequirement.financial_poc) {
            const financialPocInfo = await api.contactsTable.retrieve(
              fundingRequirement.financial_poc
            );
            if (financialPocInfo) {
              AcquisitionPackage.setContact({ data: financialPocInfo, type: "Financial POC"});
            }
          }
        } else {
          // initialize funding request and set it to acquisition package
          await this.loadFundingRequest()
          const defaultFundingRequirement: FundingRequirementDTO = {
            acquisition_package: acquisitionPackageDTO?.sys_id as string,
            funding_plan: "",
            funding_request: this.fundingRequest?.sys_id as string,
            funds_obligated: "",
            funds_total: "",
            incrementally_funded: "",
            pop_end_date: "",
            pop_start_date: "",
            task_order_number: ""
          }
          const fundingRequirementResp = await api.fundingRequirementTable
            .create(defaultFundingRequirement);
          this.setFundingRequirement(convertColumnReferencesToValues(fundingRequirementResp));
        }
      }
    } catch (error) {
      throw new Error(`Error occurred loading funding requirement ${error}`);
    }
  }

  /**
   * Uses the latest store data and makes an api call to save. The caller should
   * ensure that the store data is up-to-date before calling this function.
   */
  @Action
  public async saveFundingRequirement(): Promise<void> {
    const fundingReq 
      = convertColumnReferencesToValues(this.fundingRequirement as FundingRequirementDTO);
    const savedFundingRequirement = await api.fundingRequirementTable
      .update(fundingReq.sys_id as string, fundingReq);
    this.setFundingRequirement(convertColumnReferencesToValues(savedFundingRequirement));
  }

 @Action({rawError: true})
  async saveFundingRequestType(value: string): Promise<void> {
    const savedFundingRequest =
      await this.saveFundingRequestToDISA({
        ...this.fundingRequest as FundingRequestDTO,
        funding_request_type: value
      });
    this.setFundingRequest(savedFundingRequest);
  }

  /**
   * Since @loadFundingRequestFSForm function handles the loading/ initializing, this
   * function is just responsible for updating the record.
   */
  @Action({rawError: true})
 public async saveFundingRequestFSForm(data:
  FundingRequestFSFormDTO): Promise<FundingRequestFSFormDTO>{
   try {
     const savedFundingRequestFSForm =
       await api.fundingRequestFSFormTable.update(data.sys_id as string, data);
     this.setFundingRequestFSForm(savedFundingRequestFSForm);
     return savedFundingRequestFSForm;
   } catch (error) {
     throw new Error( `error occurred saving funding request form ${error}`);
   }
 }

  /**
   * Since @loadFundingRequestMIPRForm function handles the loading/ initializing, this
   * function is just responsible for updating the record.
   */
  @Action({rawError: true})
  public async saveFundingRequestMIPRForm(data:
  FundingRequestMIPRFormDTO): Promise<FundingRequestMIPRFormDTO>{
    try {
      const savedFundingRequestMIPRForm =
        await api.fundingRequestMIPRFormTable.update(data.sys_id as string, data);
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
  public setFundingRequirement(value: FundingRequirementDTO): void {
    this.fundingRequirement = value;
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
    this.fundingRequirement = null;
    this.fundingPlan = _.cloneDeep(initialFundingPlan);
    this.estimatedTaskOrderValue = "";
    this.miprNumber = null;
    this.initialFundingIncrementStr = "";
    this.fundingIncrements = [];
    this.gtcNumber = null;
    this.orderNumber = null;
    this.fundingRequest = null;
    this.fundingRequestFSForm = null;
    this.fundingRequestMIPRForm = null;
  }

}

const FinancialDetails = getModule(FinancialDetailsStore);
export default FinancialDetails;
