<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            {{ headline }}
          </h1>
          <div class="copy-max-width">
            <p>
              If you have more than one contract for this effort, 
              we will walk through them one at a time.
            </p>
          </div>
          <div v-if="isExceptiontoFairOpp" class="copy-max-width">
            <h2 class="mb-5">
              1. Contract overview
            </h2>
            <ContractNumber id="ContractNumber" 
              :rules="[
                $validators.required('Please enter a contract number.'),
                $validators.isMaskValid(
                  ['^([0-9a-zA-Z]{13})?$'],
                  `Your contract number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
              :value.sync="currentContract.contract_number" 
              class="_input-max-width mb-9" 
              label="Contract number" 
              tooltipText="This is a 13-character alphanumeric value (no hyphens, dashes or spaces) 
              found on your awarded contract." />

            <TaskOrderNumber 
            id="TaskOrderNumber" 
            :value.sync="currentContract.task_delivery_order_number" 
            :optional="true"
            class="_input-max-width mb-10" 
            label="Task order number" 
            :rules="[
                $validators.isMaskValid(
                  ['^([0-9a-zA-Z]{13})?$'],
                  `Your contract number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
            tooltipText="This is a 13-character alphanumeric value (no hyphens, dashes or 
                spaces). Leave this field empty if your previous acquisition was only a contract, 
                not an order placed under a contract." />

            <LevelOfCompetition legend="What level of competition was used in this procurement?"
              classes="copy-max-width mb-4 mt-3" 
              :competitiveStatus.sync="currentContract.competitive_status"
              :rules="[$validators.required('Please select a level of competition.')]">
            </LevelOfCompetition>

            <hr />

            <h2 class=" mt-10">
              2. Period of Performance (PoP)
            </h2>
            <span class="text-base">
              Your PoP date range should include all option periods. If you do not have a 
              task order, use your contract PoP.
            </span>
            <div class="d-flex mt-4">
              <ATATDatePicker 
                ref="startDatePicker"
                id="Start" 
                :value.sync="currentContract.contract_order_start_date" 
                label="Start date" 
                placeHolder="MM/DD/YYYY"
                :min = "startMinDate"
                :max = "startMaxDate"
                :class="[
                    {'error--text':startDPSharedErrorMessages.length>0 },
                    'mr-5']"
                :showErrors="false"
                @hasErrorMessages="setStartDateErrorMessages"
                :rules="[
                  $validators.required(
                    'Please enter your PoP start date.'
                  ),
                  $validators.isDateValid('Please enter a valid PoP start date.'),
                  $validators.compareDatesDesc(
                    expirationDate,
                    `The start date must be before the expiration date.`,
                    false
                  )
                ]" 
                />
                
               <!-- NOTE: max date to be determined -->
              <ATATDatePicker 
                id="Expiration" 
                :value.sync="currentContract.contract_order_expiration_date" 
                label="Expiration date"
                :min = "expMinDate"
                :max = "expMaxDate"
                placeHolder="MM/DD/YYYY"
                :class="{'error--text':expirationDPSharedErrorMessages.length>0}"
                ref="expirationDatePicker"
                :showErrors="false"
                @hasErrorMessages="setExpirationDateErrorMessages"
                :rules="[
                  $validators.required(
                    'Please enter your PoP expiration date.'
                  ),
                  $validators.isDateValid('Please enter a valid PoP expiration date.'),
                  $validators.compareDatesAsc(
                    startDate,
                    `The start date must be before the expiration date.`,
                    false
                  )
                ]"  
                />
                
                
            </div>
            <ATATErrorValidation
                  :errorMessages=" [
                    ...startDPSharedErrorMessages, 
                    ...expirationDPSharedErrorMessages
                  ]"
                  :showAllErrors="false"
                ></ATATErrorValidation>
            <hr />

            <h2 class="mb-4">
              3. Contractor details
            </h2>
            <IncumbentContractorName 
            id="IncumbentContractorName" :rules="[
                $validators.required(
                  'Please enter the contractor’s name.'
                ),
              ]" 
              :value.sync="currentContract.incumbent_contractor_name" 
              class="_input-max-width mb-10"
              label="Contractor name" />

              <BusinessSize 
                legend="What business size is this contractor?"
                classes="copy-max-width mt-3" 
                :businessSize.sync="currentContract.business_size"
                :rules="[$validators.required('Please select a business size.')]">
              </BusinessSize>

          </div>
          <div v-else class="copy-max-width">
            <IncumbentContractorName 
            id="IncumbentContractorName" 
              :rules="[
                $validators.required(
                  'Enter the contractor’s name.'
                ),
              ]" 
              :value.sync="currentContract.incumbent_contractor_name" 
              class="_input-max-width mb-10"
              label="Incumbent contractor name" />

            <ContractNumber id="ContractNumber" 
              :rules="[
                $validators.required('Enter your contract number.'),
                $validators.isMaskValid(
                  ['^([0-9a-zA-Z]{13})?$'],
                 `Your contract number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
              :value.sync="currentContract.contract_number" 
              class="_input-max-width mb-10" 
              label="Contract number" />

            <TaskOrderNumber id="TaskDeliveryOrderNumber" 
            :value.sync="currentContract.task_delivery_order_number" 
            :optional="true"
            class="_input-max-width mb-10" 
            label="Task/Delivery order number" 
            :rules="[
                $validators.isMaskValid(
                  ['^([0-9a-zA-Z]{13})?$'],
                  `Your task order number must be 13 alphanumeric characters.`,
                  true
                ),
              ]"
            tooltipText="Leave this field empty if your previous acquisition
            was only a contract, not an order placed under a contract." />

            <ATATDatePicker id="Expiration" 
              :rules="[
                $validators.required(
                  'Please enter your contract/order expiration date.'
                ),
                $validators.isDateValid('Please enter a valid date.'),
              ]" 
              :value.sync="currentContract.contract_order_expiration_date" 
              label="Contract/Order expiration date" 
              :min="tomorrowDateISO"
              placeHolder="MM/DD/YYYY" 
              tooltipText="Use the period of performance end date for your task order. If you
                  do not have a task order, use your contract end date." />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Vue } from "vue-property-decorator";

import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import LevelOfCompetition from "@/steps/03-Background/components/LevelOfCompetition.vue";
import BusinessSize from "@/steps/03-Background/components/BusinessSize.vue";
import AcquisitionPackage, {initialCurrentContract, } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { CurrentContractDTO, ReferenceColumn } from "@/api/models";
import { formatDate, hasChanges } from "@/helpers";
import { add, compareAsc, format, formatISO, isValid, subDays } from "date-fns";
import TaskOrderNumber from "@/steps/03-Background/components/TaskOrderNumber.vue";
import _, { isString } from "lodash";
import { thisExpression, throwStatement } from "@babel/types";

@Component({
  components: {
    ATATDatePicker,
    ContractNumber,
    IncumbentContractorName,
    TaskOrderNumber,
    LevelOfCompetition,
    BusinessSize,
    ATATTextField,
    ATATErrorValidation
  },
})
export default class CurrentContract extends Mixins(SaveOnLeave) {
  $refs!: {
    form: Vue & { 
      resetValidation: () => void;
      reset: () => void;
      validate: () => boolean;
    };
    startDatePicker: Vue & { 
      validate: () => boolean;
    };
    expirationDatePicker: Vue & { 
      validate: () => boolean;
    };
  };

  private currentContracts:CurrentContractDTO[] = [];
  private currentContract:CurrentContractDTO = {};
  private startMinDate = "";
  private startMaxDate = "";
  private expMinDate = "";
  private expMaxDate = "";
  private isCurrent = false;
  private headline = "";
  private saveOnLeaveError: string| unknown = "";

  private setHeadline(): void {
    let contractState = "previous or current";

    if (this.currentContract.contract_order_expiration_date){
      contractState = this.isCurrent ? "current" : "previous"
    }

    this.headline =  "Let’s gather some details about your " + contractState + " contract";
  }

  get todaysDateISO():string{
    return formatISO(new Date(new Date()), { representation: 'date' }) 
  }

  get todaysDateMMDDYYYY():string{
    return format(new Date(new Date()), 'P');
  }

  get startDate():string{
    const d = this.currentContract.contract_order_start_date || "";
    return d !=="" ? formatISO(new Date(d), { representation: 'date' }) : "" 
  }

  get expirationDate():string{
    const d = this.currentContract.contract_order_expiration_date || "";
    return d !=="" ? formatISO(new Date(d), { representation: 'date' }) : "" 
  }

  get tomorrowDateISO():string{
    const tomorrow = add (new Date(), {days: 1})
    const d = format(tomorrow, 'P');
    return formatISO(tomorrow, { representation: 'date' }) 
  }

  private startDPSharedErrorMessages:string[] = [];
  private expirationDPSharedErrorMessages: string[] = [];

  private setStartDateErrorMessages(value:string[]): void{
    this.removeSharedErrorMessages(true);
    setTimeout(()=>{
      this.expirationDPSharedErrorMessages = this.isDatePickersEmpty && value.length>0
        ? ["Please enter your PoP start and expiration dates."]
        : value;
    })
  };

  private setExpirationDateErrorMessages(value:string[]): void{
    this.removeSharedErrorMessages(false);
    
    setTimeout(()=>{
      this.expirationDPSharedErrorMessages = this.isDatePickersEmpty && value.length>0
        ? ["Please enter your PoP start and expiration dates."]
        : value;
    })
  }

  get isDatePickersEmpty():boolean{
    return this.currentData.contract_order_start_date === "" 
      && this.currentData.contract_order_expiration_date === "";
  }

  private removeSharedErrorMessages(isStart: boolean):void{
    const startTextBox = (this.$refs.startDatePicker as unknown as ATATDatePicker)
      .$refs["atatDatePicker"];

    const expirationTextBox = (this.$refs.expirationDatePicker as unknown as ATATDatePicker)
      .$refs["atatDatePicker"];
    
    this.startDPSharedErrorMessages = [];
    this.expirationDPSharedErrorMessages = [];
  }

  private get isExceptiontoFairOpp(): boolean {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity !== "NO_NONE";
  }

  private savedData = {
    incumbent_contractor_name: "",
    contract_number: "",
    task_delivery_order_number: "",
    contract_order_expiration_date: "",
    contract_order_start_date: "",
    competitive_status: "",
    business_size: "",
    instance_number: 0,
    current_contract_exists: "",
    acquisition_package: "",
    is_valid: false, 
  } as CurrentContractDTO;

  private get currentData(): CurrentContractDTO {
    return this.currentContract ? this.currentContract : initialCurrentContract();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadContract(): Promise<void>{
    const contractToLoadInstanceNumber = AcquisitionPackage.currentContractInstanceNumber;
    this.currentContracts = await AcquisitionPackage.currentContracts as CurrentContractDTO[];
    await this.sortDataSource();
    this.currentContract = this.currentContracts.filter(
      (c) => {
        return c.instance_number?.toString()=== contractToLoadInstanceNumber.toString()
      }
    )[0] || initialCurrentContract();
    if (this.currentContract.is_current){
      this.isCurrent = this.currentContract.is_current as boolean;
    }
    this.setMinAndMaxDates();
  }

  public async sortDataSource():Promise<void>{
    this.currentContracts.sort((a,b)=> {
      const dateA = new Date(a.sys_created_on || "");
      const dateB = new Date(b.sys_created_on || "");
      return dateA.getTime()-dateB.getTime()
    })
  }

  public setMinAndMaxDates():void{
    this.startMinDate = "";
    this.startMaxDate = formatISO(subDays(new Date(),1), { representation: 'date' });
    this.expMinDate = "";
    this.expMaxDate = "";
  }

  public async loadOnEnter(): Promise<void> {
    await this.loadContract();
    if (this.currentContract) {
      const keys: string[] = [
        "incumbent_contractor_name",
        "contract_number",
        "task_delivery_order_number",
        "contract_order_expiration_date",
        "contract_order_start_date",
        "competitive_status",
        "business_size",
        "instance_number",
        "current_contract_exists",
        "sys_id",
        "sys_created_by",
      ];
      keys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(
          this.currentContract, key as keyof CurrentContractDTO)){
          this.savedData[key] = this.currentContract[key as keyof CurrentContractDTO];
        }
      });
    } 
    this.setHeadline();
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        this.currentData.acquisition_package = AcquisitionPackage.packageId;
        this.currentData.is_valid = await this.$refs.form.validate();
        if (this.currentData.contract_order_expiration_date !== ""){
          this.currentData.is_current = compareAsc(
            new Date(),
            new Date(this.currentData.contract_order_expiration_date as string)
          )=== -1
        }
        this.currentContract.current_contract_exists = "YES"
        // if this.isExceptiontoFairOpp save to Store now &&
        // save to SNOW on next page > ProcurementHistory page
        AcquisitionPackage.setCurrentContract(
          this.currentData
        )
        // if !this.isExceptiontoFairOpp save to Store/SNOW now
        if (!this.isExceptiontoFairOpp){
          const currentContracts = await AcquisitionPackage.currentContracts || [];
          await AcquisitionPackage.updateCurrentContractsSNOW(currentContracts);
        }
      }
    } catch (error) {
      this.saveOnLeaveError = error as string;
      console.log(error);
    }
    return true;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
}
</script>
