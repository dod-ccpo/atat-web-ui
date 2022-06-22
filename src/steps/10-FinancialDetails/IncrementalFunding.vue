<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s create an incremental funding plan for your base period
        </h1>
        <div class="copy-max-width">
          <p>
            To fund the award of this effort, your organization will need to provide 
            an initial increment of funds to the Contracting Office. The remaining 
            funds needed to fully fund your cost estimate for non-optional line items 
            may be provided in subsequent increments. In the fields below, add funding 
            increments and specify the projected date (on a fiscal year quarterly 
            basis) for which funds will be provided. A projected funding schedule 
            will be generated.
          </p>

          <div class="d-flex">
            <div style="width: 450px;">
              <div class="d-flex justify-space-between align-center">
                <label for="InitialAmount">
                  Initial funding increment
                </label>
                <ATATTextField
                  id="InitialAmount"
                  :value.sync="initialPaymentStr"
                  :alignRight="true"
                  :isCurrency="true"
                  :showErrorMessages="false"
                  width="190"
                  class="mr-2"
                  :rules="[
                    $validators.required('', true)
                  ]"
                  @blur="calcAmounts('initialIncrement')"
                />
                <span class="d-block" style="width: 9px"></span>
              </div>
              <div 
                v-if="errorMissingInitialIncrement" 
                class="d-flex justify-start align-top atat-text-field-error mb-1 mt-3"
                id="InitialIncrementError"
              >
                <ATATSVGIcon 
                  style="margin-top: 2px;"
                  name="exclamationMark" 
                  :width="18" 
                  :height="18" 
                  color="error" 
                />
                <div class="field-error ml-2">{{ errorMissingInitialIncrementMessage }}</div>
              </div>

              <hr class="my-6" />

              <div
                v-for="(payment, index) in payments"
                :key="index"              
              >

                <div class="d-flex justify-space-between align-center mb-4">
                  <ATATSelect
                    :id="'IncrementPeriod' + index"
                    :items="getIncrementPeriodsForDropdown(index)"
                    width="190"
                    :selectedValue.sync="payments[index].qtr"
                    class="mr-4"
                    @onChange="incrementSelected(index)"
                  />
                  <ATATTextField
                    :id="'Amount' + index"
                    :value.sync="payments[index].amt"
                    :alignRight="true"
                    :isCurrency="true"
                    :showErrorMessages="false"
                    width="190"
                    class="mr-2"
                    @blur="calcAmounts('increment' + index)"
                    :rules="[
                      $validators.required('', true)
                    ]"

                  />
                  <v-btn
                    icon
                    @click="deletePayment(index)"
                    :disabled="payments.length === 1"
                  >
                    <v-icon> delete </v-icon>
                  </v-btn>
                </div>    

                <div 
                  v-if="errorMissingFirstIncrement" 
                  class="d-flex justify-start align-top atat-text-field-error mb-1 mt-3"
                  id="FirstIncrementError"
                >
                  <ATATSVGIcon 
                    style="margin-top: 2px;"
                    name="exclamationMark" 
                    :width="18" 
                    :height="18" 
                    color="error" 
                  />
                  <div class="field-error ml-2">{{ errorMissingFirstIncrementMessage }}</div>
                </div>

              </div>

              <v-btn
                id="AddIncrementButton"
                v-if="payments.length < maxPayments"
                plain
                text
                class="_text-link mt-5"
                :ripple="false"
                @click="addIncrement()"
              >
                <v-icon color="primary" class="mr-2">control_point</v-icon>
                <span>Add funding increment</span>
              </v-btn>

              <hr class="my-6" />

              <div class="d-flex justify-end align-center">
                <label for="TotalAmount" class="mr-4">
                  Total
                </label>

                <ATATTextField
                  id="TotalAmount"
                  :value.sync="totalAmount"
                  :alignRight="true"
                  :isCurrency="true"
                  width="190"
                  class="mr-2"
                  :disabled="true"
                />
                <span class="d-block" style="width: 36px"></span>
              </div>
            </div>

            <div class="ml-10 width-100">
              <div class="bg-primary-lighter width-100 border-rounded-more pa-6">

                <div class="d-flex">
                  <div class="pr-5">
                    <ATATSVGIcon name="calendar" :width="34" :height="37" color="primary" />
                  </div>
                  <div>
                    <span class="h3">Base period length: {{ periodLengthStr }}</span>
                    <p class="mb-0">
                      Your funding plan may not exceed this PoP.
                    </p>
                    <hr class="base my-4" />
                  </div>
                </div>

                <div class="d-flex">
                  <div class="pr-5">
                    <ATATSVGIcon name="monetizationOn" :width="34" :height="34" color="primary" />
                  </div>
                  <div>
                    <span class="h3">Total cost estimate: ${{ costEstimateStr }}</span>
                    <p class="mb-0">
                      You need to add <strong>${{ amountRemainingStr }}</strong> 
                      to fully fund your base period.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import FinancialDetails from "@/store/financialDetails";
import Periods from "@/store/periods";

import { PeriodDTO } from "@/api/models";
import { SelectData, fundingIncrements, IFPData } from "../../../types/Global";
import { toCurrencyString, currencyStringToNumber } from "@/helpers";

import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATSelect,
    ATATSVGIcon,
    ATATTextField,
  }
})

export default class IncrementalFunding extends Mixins(SaveOnLeave) {

  public today = new Date();
  public currentQuarter = Math.floor(((this.today.getMonth() + 3) / 3) + 1);
  public currentYear = this.today.getFullYear();

  public periods: PeriodDTO[] | null = [];
  public maxPayments = 1;
  public periodLengthStr = "";

  public ordinals = ["1st", "2nd", "3rd", "4th"];

  public incrementPeriods: SelectData[] = [];

  public costEstimate = 0;
  public costEstimateStr = "";
  public amountRemaining = 0;
  public amountRemainingStr = "";
  public initialPayment = 0;
  public initialPaymentStr = "";
  public totalAmount: number | null = null;

  public errorMissingInitialIncrement = false;
  public errorMissingInitialIncrementMessage = "Please enter the amount of your initial funding.";
  public errorMissingFirstIncrement = false;
  public errorMissingFirstIncrementMessage = "Please enter the amount of your first increment.";

  // use in future ticket for validation returning to page to show error messages
  public hasReturnedToPage = false;

  public payments: { qtr: string, amt: string }[] = [];

  private get currentData(): IFPData {
    return {
      initialFundingIncrementStr: this.initialPaymentStr,
      fundingIncrements: this.payments,
    };
  };

  private savedData: IFPData = {
    initialFundingIncrementStr: "",
    fundingIncrements: [],
  }

  public async initializeIncrements(): Promise<void> {
    let qtr = this.currentQuarter;
    let year = parseInt(this.currentYear.toString().slice(-2));
    for (let i = 0; i < 6; i++) {
      const ordinal = this.ordinals[qtr - 1];
      // increment year if at first quarter and not first in the loop
      year = qtr === 1 && i !== 0 ? year + 1 : year;
      // increment quarter
      qtr = qtr === 4 ? 1 : qtr + 1;
      const periodStr = ordinal + " QTR FY" + year;
      this.incrementPeriods.push({ text: periodStr, value: periodStr});

      if (i === 0 && this.payments.length === 0) {
        // default to 1st option if no store data
        this.payments.push({qtr: periodStr, amt: ""})
      }
    }
  }

  public deletePayment(index: number): void {
    this.payments.splice(index, 1);
    this.calcAmounts("");
  }

  public addIncrement(): void {
    const lastPayment = this.payments.at(-1);
    const lastSelectedQtr = lastPayment?.qtr;
    let selectedQtrIndex = this.incrementPeriods.findIndex(p => p.text === lastSelectedQtr);
    let nextQtr;
    if (selectedQtrIndex > -1 && selectedQtrIndex !== this.incrementPeriods.length) {
      nextQtr = this.incrementPeriods[selectedQtrIndex + 1].text;
    }
    if (nextQtr) {
      const newIncrement = { qtr: nextQtr, amt: "" }
      this.payments.push(newIncrement);
    }
  }

  public calcAmounts(field: string): void {
    let incrementsTotal = this.payments.reduce(
      (accumulator, current) =>  
        accumulator + Number(currencyStringToNumber(current.amt)), 0
    );
    this.initialPayment = currencyStringToNumber(this.initialPaymentStr);
    this.totalAmount = this.initialPayment 
      ? this.initialPayment + incrementsTotal
      : incrementsTotal;

    this.amountRemaining = this.costEstimate - this.totalAmount;
    this.amountRemainingStr = this.amountRemaining ? toCurrencyString(this.amountRemaining) : "";
    this.initialPaymentStr = this.initialPayment ? toCurrencyString(this.initialPayment) : "";
    this.$nextTick(() => {
      this.payments.forEach((pmt) => {
        return pmt.amt = pmt.amt && pmt.amt !== "0.00" 
          ? toCurrencyString(currencyStringToNumber(pmt.amt)) 
          : ""
      });
    });

    // validation on blur for initial and first increments required
    let amt;
    if (field === "initialIncrement") {
      amt = parseFloat(this.initialPaymentStr);
      this.errorMissingInitialIncrement = amt === 0 || isNaN(amt);
    } else if (field === "increment0") {
      amt = parseFloat(this.payments[0].amt);
      this.errorMissingFirstIncrement = amt === 0 || isNaN(amt);
    }
  }

  public getIncrementPeriodsForDropdown(index: number): SelectData[] {
    if (index === 0) {
      return this.incrementPeriods;
    } 

    const firstSelectedQtr = this.payments[0].qtr;
    const firstSelectedQtrIndex 
      = this.incrementPeriods.findIndex(p => p.text === firstSelectedQtr);

    let lastPossibleIndex = firstSelectedQtrIndex + this.maxPayments;
    lastPossibleIndex = lastPossibleIndex > this.incrementPeriods.length 
      ? this.incrementPeriods.length
      : lastPossibleIndex;
    let optionsArr = this.incrementPeriods.slice(firstSelectedQtrIndex + 1, lastPossibleIndex) 

    return optionsArr;
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await FinancialDetails.getIFPData();
    if (storeData) {
      this.initialPaymentStr = storeData.initialFundingIncrementStr;
      this.savedData.initialFundingIncrementStr = this.initialPaymentStr;
      this.payments = storeData.fundingIncrements;
      this.savedData.fundingIncrements = this.payments;
      this.hasReturnedToPage = this.payments.length > 0;
    }

    await this.initializeIncrements();

    if (FinancialDetails.estimatedTaskOrderValue) {
      this.costEstimate = currencyStringToNumber(FinancialDetails.estimatedTaskOrderValue);

      this.costEstimateStr = toCurrencyString(this.costEstimate);
      this.amountRemaining = this.costEstimate;
      this.amountRemainingStr = this.costEstimateStr;
    }

    this.periods = Periods.periods;
    if (this.periods) {
      const basePeriod = this.periods.find(p => p.period_type === "BASE");
      if (basePeriod) {
        const unitCount: number = parseInt(basePeriod.period_unit_count);
        let unit = basePeriod.period_unit.toLowerCase();
        if (unitCount) {
          unit = unitCount > 1 ? unit + "s" : unit;
        }
        this.periodLengthStr = unitCount + " " + unit;
        switch (unit) {
        case "days": 
          this.maxPayments = unitCount > 270 ? 5: 4;
          break;
        case "weeks":
          this.maxPayments = unitCount > 36 ? 5: 4;
          break;
        case "months":
          this.maxPayments = unitCount > 9 ? 5: 4;
          break;
        case "year":
          this.maxPayments = 5;
          break;
        default:
          this.maxPayments = 1;
        }
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      // FUTURE TICKET VALIDATION: first time user clicks continue:
      // • check if same quarter selected for more than one dropdown
      // • check if over/under funded - AC 4 which was crossed out
      // set a flag if error has been show. if so, user can continue

      if (this.hasChanged()) {
        FinancialDetails.setIFPData(this.currentData);
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
