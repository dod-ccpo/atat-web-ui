<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Let’s gather some details about your current contract
          </h1>
          <div class="copy-max-width">
              <p class="mb-10">
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
                  ['^([0-9A-Z]{0,13})?$'],
                  `Your contract number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
              :value.sync="contractNumber" 
              class="_input-max-width mb-9" 
              label="Contract number" 
              tooltipText="This is a 13-character alphanumeric value (no hyphens, dashes or spaces) 
              found on your awarded contract." />

            <TaskOrderNumber 
            id="TaskOrderNumber" 
            :value.sync="taskDeliveryOrderNumber" 
            :optional="true"
            class="_input-max-width mb-10" 
            label="Task order number" 
            :rules="[
                $validators.isMaskValid(
                  ['^([0-9A-Z]{13})?$'],
                  `Your contract number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
            tooltipText="This is a 13-character alphanumeric value (no hyphens, dashes or 
                spaces). Leave this field empty if your previous acquisition was only a contract, 
                not an order placed under a contract." />

            <LevelOfCompetition legend="What level of competition was used in this procurement?"
              classes="copy-max-width mb-4 mt-3" 
              :competitiveStatus.sync="competitiveStatus"
              :rules="[$validators.required('Please select a level of competition.')]">
            </LevelOfCompetition>

            <hr class="ma-8" />

            <h2 class=" mt-10">
              2. Period of Performance (PoP)
            </h2>
            <span class="text-base">
              Your PoP date range should include all option periods. If you do not have a 
              task order, use your contract PoP.
            </span>
            <div class="d-flex mt-4">
              <ATATDatePicker 
                ref="startDatepicker"
                id="Start" 
                :value.sync="contractOrderStartDate" 
                label="Start date" 
                max="2024-01-01"
                placeHolder="MM/DD/YYYY"
                class="mr-5"
                @isDatePickerValid="isStartDatePickerValid"
                :rules="[
                  $validators.required(
                    'Please enter your PoP start date.'
                  ),
                  $validators.isDateValid('Please enter a valid date.'),
                  ...startDateRules
                ]" 
                />
                

              <!-- NOTE: max date to be determined -->
              <ATATDatePicker id="Expiration" 
                :value.sync="contractOrderExpirationDate" 
                label="Expiration date" 
                max="2024-01-01"
                placeHolder="MM/DD/YYYY" 
                :rules="[
                  $validators.required(
                    'Please enter your PoP expiration date.'
                  ),
                  $validators.isDateValid('Please enter a valid date.'),
                  ...expirationDateRules
                ]"
                />
            </div>
            <ATATErrorValidation
                  :errorMessages="DPSharedErrorMessages"
                  :showAllErrors="false"
                ></ATATErrorValidation>
            <hr />

            <h2 class="mb-4">
              3. Contractor details
            </h2>
            <IncumbentContractorName 
            id="IncumbentContractorName" :rules="[
                $validators.required(
                  'Please enter the incumbent contractor’s name.'
                ),
              ]" 
              :value.sync="incumbentContractorName" 
              class="_input-max-width mb-10"
              label="Contractor name" />

              <BusinessSize 
                legend="What business size is this contractor?"
                classes="copy-max-width mt-3" 
                :businessSize.sync="businessSize"
                :rules="[$validators.required('Please select an option')]">
              </BusinessSize>

          </div>
          <div v-else class="copy-max-width">
            <IncumbentContractorName 
            id="IncumbentContractorName" 
              :rules="[
                $validators.required(
                  'Please enter the incumbent contractor’s name.'
                ),
              ]" 
              :value.sync="incumbentContractorName" 
              class="_input-max-width mb-10"
              label="Incumbent contractor name" />

            <ContractNumber id="ContractNumber" :rules="[
                $validators.required('Please enter your contract number.'),
              ]" :value.sync="contractNumber" 
              class="_input-max-width mb-10" 
              label="Contract number" />

            <TaskOrderNumber id="TaskDeliveryOrderNumber" 
            :value.sync="taskDeliveryOrderNumber" 
            :optional="true"
              class="_input-max-width mb-10" 
              label="Task/Delivery order number" 
              tooltipText="Leave this field empty if your previous acquisition
              was only a contract, not an order placed under a contract." />

            <ATATDatePicker id="Expiration" :rules="[
                $validators.required(
                  'Please enter your contract/order expiration date.'
                ),
                $validators.isDateValid('Please enter a valid date.'),
              ]" 
              :value.sync="contractOrderExpirationDate" 
              abel="Contract/Order expiration date" 
              max="2024-01-01"
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
import { Component, Mixins } from "vue-property-decorator";

import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import LevelOfCompetition from "@/steps/03-Background/components/LevelOfCompetition.vue";
import BusinessSize from "@/steps/03-Background/components/BusinessSize.vue";
import AcquisitionPackage, { StoreProperties, } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { CurrentContractDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import { add, compareAsc, format } from "date-fns";
import TaskOrderNumber from "@/steps/03-Background/components/TaskOrderNumber.vue";
import { JSDocUnknownType } from "typescript";

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
    startDatepicker: Vue & { 
      resetValidation: () => void;
      reset: () => void;
      validate: () => boolean;
      blur:() => void;
    };
  
  };

  private incumbentContractorName =
    AcquisitionPackage.currentContract?.incumbent_contractor_name || "";

  private contractNumber =
    AcquisitionPackage.currentContract?.contract_number || "";

  private taskDeliveryOrderNumber =
    AcquisitionPackage.currentContract?.task_delivery_order_number || "";
  
  private contractOrderStartDate =
    AcquisitionPackage.currentContract?.contract_order_start_date || "";

  private contractOrderExpirationDate =
    AcquisitionPackage.currentContract?.contract_order_expiration_date || "";


  private competitiveStatus =
    AcquisitionPackage.currentContract?.competitive_status || "";

  private businessSize =
    AcquisitionPackage.currentContract?.business_size || "";

  private isStartDatePickerValid = true;

  private startDPSharedErrorMessages:string[] = [];
  private expirationDPSharedErrorMessages: string[] = [];
  private get DPSharedErrorMessages():string[]{
    const errorMessage = [
      ...this.startDPSharedErrorMessages, 
      ...this.expirationDPSharedErrorMessages
    ].find(item => item !== "" || item !== undefined) as string;
    return [errorMessage]
  }

  private get isExceptiontoFairOpp(): boolean {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity !== "NO_NONE";
  }

  private get startDateRules():((v:string)=> string | true | undefined) []{
    
    const rulesArray: ((v: string) => string | true | undefined)[] = [];
    try{
      this.startDPSharedErrorMessages=[];
      const startDate = new Date(this.contractOrderStartDate as string);
      const expirationDate = new Date(this.getDateTextboxValue("Expiration") as string);
      if (compareAsc(startDate,expirationDate)>-1 
          && this.expirationDPSharedErrorMessages.length===0){
        rulesArray.push((() => {return (false|| '')}))
        this.startDPSharedErrorMessages.push(`The start date must be before the expiration date.`)
      }} catch(ex:unknown){
      console.log("")
    }
    return rulesArray;
  }
 
  private get expirationDateRules():((v:string)=> string | true | undefined) []{
    const rulesArray: ((v: string) => string | true | undefined)[] = [];
    try{
      this.expirationDPSharedErrorMessages=[];
      const startDate = new Date(this.getDateTextboxValue("Start") as string);
      const expirationDate = new Date(this.contractOrderExpirationDate as string);
      if (compareAsc(expirationDate,startDate) < 1 && this.startDPSharedErrorMessages.length===0){
        rulesArray.push((() => 
        {return (false|| '')}))
        this.expirationDPSharedErrorMessages.push(
          `The expiration date must be after the start date.`
        )
      }} catch(ex:unknown){
      console.log("")
    }
    return rulesArray;
  }

  private getDateTextboxValue(dateType: string):string{
    return (document.getElementById(dateType + "DatePickerTextField") as HTMLInputElement)?.value
     || "";
  }


  private minDate: string = format(add(new Date(), { days: 1 }), "yyyy-MM-dd");
  private savedData = {
    incumbent_contractor_name: "",
    contract_number: "",
    task_delivery_order_number: "",
    contract_order_expiration_date: "",
    competitive_status: "",
  } as Record<string, string>;

  private get currentData(): CurrentContractDTO {
    return {
      incumbent_contractor_name: this.incumbentContractorName,
      contract_number: this.contractNumber,
      task_delivery_order_number: this.taskDeliveryOrderNumber,
      contract_order_expiration_date: this.contractOrderExpirationDate,
      contract_order_start_date: this.contractOrderStartDate,
      competitive_status: this.competitiveStatus,
      business_size: this.businessSize,
    };
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {

    const storeData = (await AcquisitionPackage.loadData<CurrentContractDTO>({
      storeProperty: StoreProperties.CurrentContract,
    })) as CurrentContractDTO;

    if (storeData) {
      const keys: string[] = [
        "incumbent_contractor_name",
        "contract_number",
        "task_delivery_order_number",
        "contract_order_expiration_date",
        "contract_order_start_date",
        "competitive_status",
        "business size"
      ];
      keys.forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(storeData, key)) {
          this.savedData[key] = storeData[key];
        }
      });
    } else {
      AcquisitionPackage.setCurrentContract(this.currentData);
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData<CurrentContractDTO>({
          data: this.currentData,
          storeProperty: StoreProperties.CurrentContract,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
}
</script>
