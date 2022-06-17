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
                  width="190"
                  class="mr-2"
                  :rules="[
                    $validators.required('Please enter an initial funding increment.')
                  ]"
                  @blur="calcAmount"
                />
                <span class="d-block" style="width: 9px"></span>
              </div>
              <hr />

              <div 
                class="d-flex justify-space-between align-center mb-4"
                v-for="(payment, index) in payments"
                :key="index"
              >
                <ATATSelect
                  :id="'IncrementPeriod' + index"
                  :items="incrementPeriodsForDropdowns"
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
                  width="190"
                  class="mr-2"
                  @blur="calcAmount"
                />

                <v-btn
                  icon
                  @click="deletePayment(index)"
                  :disabled="payments.length === 1"
                >
                  <v-icon> delete </v-icon>
                </v-btn>

              </div>            

              <v-btn
                id="AddIncrementButton"
                v-if="payments.length < maxIncrements"
                plain
                text
                class="_text-link mt-5"
                :ripple="false"
                @click="addIncrement()"
              >
                <v-icon color="primary" class="mr-2">control_point</v-icon>
                <span>Add funding increment</span>
              </v-btn>

              <hr />

              <div class="d-flex justify-end align-center">
                <label for="TotalAmount" class="mr-4">
                  Total
                </label>

                <ATATTextField
                  id="TotalAmount"
                  :value.sync="totalAmountStr"
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
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import Periods from "@/store/periods";

import { PeriodDTO } from "@/api/models";
import { SelectData } from "../../../types/Global";
import _ from "lodash";

@Component({
  components: {
    ATATSelect,
    ATATSVGIcon,
    ATATTextField,
  }
})

export default class IncrementalFunding extends Vue {

  public today = new Date();
  public currentQuarter = Math.floor((this.today.getMonth() + 3) / 3);
  public currentYear = this.today.getFullYear();

  public periods: PeriodDTO[] | null = [];
  public maxIncrements = 1;
  public periodLengthStr = "";

  public ordinals = ["1st", "2nd", "3rd", "4th"];

  public incrementPeriods: SelectData[] = [];
  public incrementPeriodsForDropdowns: SelectData[] = [];

  public costEstimate = 0;
  public costEstimateStr = "";
  public amountRemaining = 0;
  public amountRemainingStr = "";
  public initialPayment = 0;
  public initialPaymentStr = "0.00";
  public totalAmount = 0;
  public totalAmountStr = "0.00";

  public payments: { qtr: string, amt: string }[] = [];

  public async initializeIncrements(): Promise<void> {
    let qtr = this.currentQuarter;
    let year = parseInt(this.currentYear.toString().slice(-2));
    for (let i = 0; i < 8; i++) {
      const ordinal = this.ordinals[qtr - 1];
      // increment year if at first quarter and not first in the loop
      year = qtr === 1 && i !== 0 ? year + 1 : year;
      // increment quarter
      qtr = qtr === 4 ? 1 : qtr + 1;
      const periodStr = ordinal + " QTR FY" + year;
      this.incrementPeriods.push({ text: periodStr, value: periodStr});

      if (i === 0) {
        // default to 1st option if no store data
        this.payments.push({qtr: periodStr, amt: "0.00"})
      }
    }
  }

  @Watch("payments", { deep: true })
  public paymentsChanged(): void {
    this.calcAmount();
  }

  public deletePayment(index: number): void {
    this.payments.splice(index, 1);
    this.calcAmount();
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
      const newIncrement = { qtr: nextQtr, amt: "0.00" }
      this.payments.push(newIncrement);
    }


    debugger;
  }

  public incrementSelected(index: number): void {
    debugger;
    if (this.payments.length > 1) {
      const firstSelectedQtr = this.payments[0].qtr;
      
    } else {
      this.incrementPeriodsForDropdowns = this.incrementPeriods;
    }
  }


  public calcAmount(): void {
    let incrementsTotal = this.payments.reduce(
      (accumulator, current) =>  
        accumulator + Number(this.strToNum(current.amt)), 0
    );
    this.initialPayment = this.strToNum(this.initialPaymentStr);
    this.totalAmount = this.initialPayment 
      ? this.initialPayment + incrementsTotal
      : incrementsTotal;
    this.totalAmountStr = this.numToStr(this.totalAmount);

    this.amountRemaining = this.costEstimate - this.totalAmount;
    this.amountRemainingStr = this.numToStr(this.amountRemaining);
  }

  public numToStr(num: number): string {
    return num.toLocaleString("en-US");
  }

  public strToNum(str: string): number {
    return parseFloat(str.replaceAll(",",""));
  }

  public async loadOnEnter(): Promise<void> {
    await this.initializeIncrements();
    this.incrementPeriodsForDropdowns = _.clone(this.incrementPeriods);

    if (AcquisitionPackage.estimatedTaskOrderValue) {
      this.costEstimate = this.strToNum(AcquisitionPackage.estimatedTaskOrderValue);

      this.costEstimateStr = this.numToStr(this.costEstimate);
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
        case "year":
          this.maxIncrements = 5;
          break;
        case "months": 
          this.maxIncrements = (unitCount / 3) + 1;
          break;
        case "weeks":
          this.maxIncrements = (unitCount / 12) + 1;
          break;
        case "days":
          this.maxIncrements = (unitCount / 91) + 1;
          break;
        default:
          this.maxIncrements = 1;
        }
      }
    }

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
