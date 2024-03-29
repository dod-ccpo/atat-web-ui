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
            <ContractNumber 
              id="ContractNumber" 
              ref="ContractNumberRef"
              :rules="[
                $validators.required('Please enter a contract number.'),
                $validators.isMaskValid(
                  ['^([0-9a-zA-Z]{13})?$'],
                  `Your contract number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
              :value="currentContract.contract_number" 
              @update:value="currentContract.contract_number = $event"
              class="_input-max-width mb-9" 
              label="Contract number" 
              tooltipText="This is a 13-character alphanumeric value (no hyphens, dashes or spaces) 
              found on your awarded contract." />

            <TaskOrderNumber 
            id="TaskOrderNumber"
            ref="TaskOrderNumberRef"
            :value="currentContract.task_delivery_order_number" 
            @update:value="currentContract.task_delivery_order_number = $event"
            :optional="true"
            class="_input-max-width mb-10" 
            label="Task order number" 
            :rules="[
                $validators.isMaskValid(
                  ['^([0-9a-zA-Z]{13})?$'],
                  `Your task order number must be 13 alphanumeric characters.`,
                  true
                ),
              ]" 
            tooltipText="This is a 13-character alphanumeric value (no hyphens, dashes or 
                spaces). Leave this field empty if your previous acquisition was only a contract, 
                not an order placed under a contract." />

            <LevelOfCompetition 
              ref="LevelOfCompetitionRef"
              legend="What level of competition was used in this procurement?"
              classes="copy-max-width mb-4 mt-3" 
              :competitiveStatus="currentContract.competitive_status"
              @update:competitiveStatus="currentContract.competitive_status = $event"
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
                ref="StartRef"
                id="Start" 
                :value="currentContract.contract_order_start_date" 
                @update:value="currentContract.contract_order_start_date = $event"
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
                ref="ExpirationARef"
                id="Expiration" 
                :value="currentContract.contract_order_expiration_date" 
                @update:value="currentContract.contract_order_expiration_date = $event"
                label="Expiration date"
                :min = "expMinDate"
                :max = "expMaxDate"
                placeHolder="MM/DD/YYYY"
                :class="{'error--text':expirationDPSharedErrorMessages.length>0}"
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
              id="PoPValidation"
              :errorMessages=" [
                ...startDPSharedErrorMessages, 
                ...expirationDPSharedErrorMessages
              ]"
              :showAllErrors="false"
            >
            </ATATErrorValidation>
            <hr />

            <h2 class="mb-4">
              3. Contractor details
            </h2>
            <IncumbentContractorName 
              id="IncumbentContractorName"
              ref="IncumbentContractorNameRef"
              :rules="[
                $validators.required(
                  'Please enter the contractor’s name.'
                ),
              ]" 
              :value="currentContract.incumbent_contractor_name" 
              @update:value="currentContract.incumbent_contractor_name = $event"
              class="_input-max-width mb-10"
              label="Contractor name" />

              <BusinessSize 
                legend="What business size is this contractor?"
                classes="copy-max-width mt-3" 
                :businessSize="currentContract.business_size"
                @update:businessSize="currentContract.business_size = $event"
                :rules="[$validators.required('Please select a business size.')]">
              </BusinessSize>

          </div>
          <div v-else class="copy-max-width">
            <IncumbentContractorName 
              id="IncumbentContractorName"
              ref="IncumbentContractorNameRef"
              :rules="[
                $validators.required(
                  'Enter the contractor’s name.'
                ),
              ]" 
              :value="currentContract.incumbent_contractor_name" 
              @update:value="currentContract.incumbent_contractor_name = $event"
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
              :value="currentContract.contract_number" 
              @update:value="currentContract.contract_number = $event"
              class="_input-max-width mb-10" 
              label="Contract number" />

            <TaskOrderNumber 
              id="TaskDeliveryOrderNumber"
              ref="TaskDeliveryOrderNumberRef"
              :value="currentContract.task_delivery_order_number" 
              @update:value="currentContract.task_delivery_order_number = $event"
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
              was only a contract, not an order placed under a contract."
            />

            <ATATDatePicker 
              id="Expiration"
              ref="ExpirationBRef"
              :key="'Expiration'+rerenderExpirationComponent"
              :rules="[
                $validators.required(
                  'Please enter your contract/order expiration date.'
                ),
                $validators.isDateValid('Please enter a valid date.'),
                $validators.compareDatesAsc(
                  new Date().toISOString(), 
                  'The expiration date must be after today.',
                  false,
                ),
              ]" 
              :value="currentContract.contract_order_expiration_date" 
              @update:value="currentContract.contract_order_expiration_date = $event"
              label="Contract/Order expiration date" 
              :min="tomorrowDateISO"
              placeHolder="MM/DD/YYYY" 
              tooltipText="Use the period of performance end date for your task order. If you
                  do not have a task order, use your contract end date." 
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import LevelOfCompetition from "@/steps/03-Background/components/LevelOfCompetition.vue";
import BusinessSize from "@/steps/03-Background/components/BusinessSize.vue";
import AcquisitionPackage, {initialCurrentContract, } from "@/store/acquisitionPackage";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { CurrentContractDTO } from "@/api/models";
import { formatDate, hasChanges } from "@/helpers";
import { add, compareAsc, format, formatISO, subDays } from "date-fns";
import TaskOrderNumber from "@/steps/03-Background/components/TaskOrderNumber.vue";
import { SaveOnLeaveRefs } from "types/Global";

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

class CurrentContract extends Vue {
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as unknown as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  private currentContracts:CurrentContractDTO[] = [];
  private currentContract:CurrentContractDTO = {};
  private startMinDate = "";
  private startMaxDate = "";
  private expMinDate = "";
  private expMaxDate = "";
  private isCurrent = false;
  private headline = "";
  private saveOnLeaveError: string| unknown = "";
  private rerenderExpirationComponent = '';

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
    const d = this.currentContract?.contract_order_start_date || "";
    return d !=="" ? formatISO(new Date(d), { representation: 'date' }) : "" 
  }

  get expirationDate():string{
    const d = this.currentContract?.contract_order_expiration_date || "";
    return d !=="" ? formatISO(new Date(d), { representation: 'date' }) : "" 
  }

  get tomorrowDateISO():string{
    const tomorrow = add (new Date(), {days: 1})
    return formatISO(tomorrow, { representation: 'date' }) 
  }

  private startDPSharedErrorMessages:string[] = [];
  private expirationDPSharedErrorMessages: string[] = [];

  private setStartDateErrorMessages(value:string[]): void{
    this.removeSharedErrorMessages();
    setTimeout(()=>{
      this.expirationDPSharedErrorMessages = this.isDatePickersEmpty && value.length>0
        ? ["Please enter your PoP start and expiration dates."]
        : value;
    })
  };

  private setExpirationDateErrorMessages(value:string[]): void{
    this.removeSharedErrorMessages();
    
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

  private removeSharedErrorMessages():void{    
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
    this.currentContract = this.currentContracts?.filter(
      (c) => {
        return c.instance_number?.toString()=== contractToLoadInstanceNumber.toString()
      }
    )[0] || initialCurrentContract();
    if (this.currentContract.is_current){
      this.isCurrent = this.currentContract.is_current as boolean;
    }
    this.setMinAndMaxDates();
    this.rerenderExpirationComponent = 'rerender'
  }

  public async sortDataSource():Promise<void>{
    if (this.currentContracts){
      this.currentContracts.sort((a,b)=> {
        const dateA = new Date(a.sys_created_on || "");
        const dateB = new Date(b.sys_created_on || "");
        return dateA.getTime()-dateB.getTime()
      })
    }
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
        const _key = key as keyof CurrentContractDTO
        if (Object.prototype.hasOwnProperty.call(this.currentContract, _key)){

          //dates need to be formatted from iso to mmddyyyy
          if ((_key as string).includes("_date") && this.currentContract[_key] !== ""){
            const tempDate = formatDate(this.currentContract[_key] as string, "MMDDYYYY");
            if (tempDate){
              (this.currentContract[_key] as string)  = tempDate;
            }
          }

          // @ts-expect-error ts can't check for this.savedData properly here
          // and this code works as expected.
          this.savedData[_key] = this.currentContract[_key];
        }
      });
      console.table(this.savedData)
    } 
    this.setHeadline();
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        this.currentData.acquisition_package = AcquisitionPackage.packageId;
        this.currentData.is_valid = 
          (await(await this.$refs.form as SaveOnLeaveRefs["form"]).validate()).valid
        if (this.currentData.contract_order_expiration_date !== ""){
          this.currentData.is_current = compareAsc(
            new Date(),
            new Date(this.currentData.contract_order_expiration_date as string)
          )=== -1
        }
        this.currentContract.current_contract_exists = "YES"
        // if this.isExceptiontoFairOpp save valid data to Store &&
        // save to SNOW on next page > ProcurementHistory page
        // if !this.isExceptiontoFairOpp save to SNOW now
        if (!this.isExceptiontoFairOpp) {
          if (this.currentData.is_valid) {
            await AcquisitionPackage.setSingleCurrentContract(this.currentData);
            const currentContracts = AcquisitionPackage.currentContracts || [];
            await AcquisitionPackage.updateCurrentContractsSNOW(currentContracts);
          }
        } else {
          if (this.currentData.is_valid) {
            await AcquisitionPackage.setCurrentContract(this.currentData);
          }
        }
      }
    } catch (error) {
      this.saveOnLeaveError = error as string;
      console.log(error);
    }
    console.log('saveonleave-current-contract-details: ', AcquisitionPackage.currentContracts)
    return true;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
}

export default toNative(CurrentContract)
</script>
