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
                  :value.sync="initialIncrementAmount"
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
                class="d-flex justify-space-between align-center"
                v-for="(increment, index) in increments"
                :key="index"
              >
                <ATATSelect
                  :id="'IncrementPeriod' + index"
                  :items="incrementPeriods"
                  width="190"
                  :selectedValue.sync="increments[index].qtr"
                  class="mr-4"
                  @onChange="incrementSelected(index)"
                />
                
                <ATATTextField
                  :id="'Amount' + index"
                  :value.sync="increments[index].amt"
                  :alignRight="true"
                  :isCurrency="true"
                  width="190"
                  class="mr-2"
                  @blur="calcAmount"
                />

                <v-btn
                  icon
                >
                  <v-icon> delete </v-icon>
                </v-btn>

              </div>            

            </div>

            <div class="bg-primary-lighter ml-10 width-100 border-rounded-more pa-6">
              <div class="d-flex">
                <div class="pr-5">
                  <ATATSVGIcon name="calendar" :width="34" :height="37" color="primary" />
                </div>
                <div>
                  <span class="h3">Base period length: xxxxx</span>
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { SelectData } from "../../../types/Global";

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

  public ordinals = ["1st", "2nd", "3rd", "4th"];

  public incrementPeriods: SelectData[] = [];

  public costEstimate = 0;
  public costEstimateStr = "";
  public amountRemaining = 0;
  public amountRemainingStr = "";
  public initialIncrementAmount = "";

  public increments: { qtr: string, amt: string }[] = [];

  public setIncrements(): void {
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
        this.increments.push({qtr: periodStr, amt: "0.00"})
      }
    }
  }

  public incrementSelected(index: number): void {
    debugger;

  }


  public calcAmount(): void {
    let incrementsTotal = this.increments.reduce(
      (accumulator, current) =>  accumulator + Number(parseFloat(current.amt.replace(",",""))), 0
    );
    let totalEntered = this.initialIncrementAmount 
      ? parseFloat(this.initialIncrementAmount.replace(",","")) + incrementsTotal
      : incrementsTotal;
    this.amountRemaining = this.costEstimate - totalEntered;
    debugger;
    this.amountRemainingStr = this.amountRemaining.toLocaleString("en-US");

  }


  public async loadOnEnter(): Promise<void> {
    this.setIncrements();
    if (AcquisitionPackage.estimatedTaskOrderValue) {
      this.costEstimate = parseFloat(AcquisitionPackage.estimatedTaskOrderValue.replace(",",""));
      this.costEstimateStr = this.costEstimate.toLocaleString("en-US");
      this.amountRemaining = this.costEstimate;
      this.amountRemainingStr = this.amountRemaining.toLocaleString("en-US");
    }

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
