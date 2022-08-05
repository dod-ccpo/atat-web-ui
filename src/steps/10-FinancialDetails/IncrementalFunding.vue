<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s create an incremental funding plan for your base period
        </h1>
        <div class="copy-max-width">
          <p>
            To fund the award of this effort, your organization will need to
            provide an initial increment of funds to the Contracting Office. The
            remaining funds needed to fully fund your cost estimate for
            non-optional line items may be provided in subsequent increments. In
            the fields below, add funding increments and specify the projected
            date (on a fiscal year quarterly basis) for which funds will be
            provided. A projected funding schedule will be generated.
          </p>

          <div class="d-flex">
            <div style="width: 450px">
              <div class="d-flex justify-space-between align-center">
                <label for="InitialAmount"> Initial funding increment </label>
                <ATATTextField
                  id="InitialAmount"
                  :value.sync="initialAmountStr"
                  :alignRight="true"
                  :isCurrency="true"
                  :showErrorMessages="false"
                  width="190"
                  class="mr-2"
                  :rules="[$validators.required('', true)]"
                  @blur="calcAmounts('initialIncrement')"
                />
                <span class="d-block" style="width: 9px"></span>
              </div>
              <div
                v-if="errorMissingInitialIncrement"
                class="
                  d-flex
                  justify-start
                  align-top
                  atat-text-field-error
                  mb-1
                  mt-3
                "
                id="InitialIncrementError"
              >
                <ATATSVGIcon
                  style="margin-top: 2px"
                  name="exclamationMark"
                  :width="18"
                  :height="18"
                  color="error"
                />
                <div class="field-error ml-2">
                  {{ errorMissingInitialIncrementMessage }}
                </div>
              </div>

              <hr class="my-6" />
              <transition-group name="funding-increments" tag="div">
                <div
                  v-for="(fundingIncrement, index) in fundingIncrements"
                  :key="fundingIncrement.qtr"
                  :id="'Increment' + index"
                  class="funding-increments-item"
                >
                  <div class="mb-4">
                    <div class="d-flex justify-space-between align-center mb-4">
                      <span class="d-block font-weight-500 text-base mr-4 ml-1 font-size-14">
                        {{ index + 1 }}
                      </span>

                      <ATATSelect
                        :id="'IncrementPeriod' + index"
                        :items="getSelectData(index)"
                        width="190"
                        :selectedValue.sync="quarterSelectData[index]"
                        class="mr-4"
                        :showErrorMessages="false"
                        @selectValueChange="quarterChange"
                        :returnObject="true"
                      />
                        <!-- @blur="onPeriodChange(index)" -->
                        <!-- :selectedValue.sync="fundingIncrements[index]" -->

                      <ATATTextField
                        :id="'Amount' + index"
                        :value.sync="fundingIncrements[index].amt"
                        :alignRight="true"
                        :isCurrency="true"
                        :showErrorMessages="false"
                        width="190"
                        class="mr-2"
                        @blur="calcAmounts('increment' + index)"
                        :rules="[$validators.required('', true)]"
                      />
                      <v-btn
                        icon
                        :id="'DeleteIncrement' + index"
                        @click="deleteFundingIncrement(index)"
                        :disabled="fundingIncrements.length === 1"
                      >
                        <v-icon> delete </v-icon>
                      </v-btn>
                    </div>
                    <div>
                      <!-- error validation for duped quarters -->
                      <ATATErrorValidation
                        :id="'isDuplicated_' + index"
                        class="atat-text-field-error"
                        :errorMessages="[duplicateErrorMessage]"
                        v-if="
                          duplicateListingsIndices.some(
                            (erroredIdx) => erroredIdx - 1 === index
                          ) && index === duplicateListingsIndices[duplicateListingsIndices.length-1]-1
                        "
                      />

                      <!-- error validation for missing first increment -->
                      <ATATErrorValidation
                        :id="'isDuplicated_' + index"
                        class="atat-text-field-error"
                        :errorMessages="[errorMissingFirstIncrementMessage]"
                        v-if="errorMissingFirstIncrement && index === 0"
                      />
                    </div>
                  </div>
                </div>
              </transition-group>
              <v-btn
                id="AddIncrementButton"
                v-if="fundingIncrements.length < maxAllowedIncrements"
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
                <label for="TotalAmount" class="mr-4"> Total </label>

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
              <div
                class="bg-primary-lighter width-100 border-rounded-more pa-6"
              >
                <div class="d-flex">
                  <div class="pr-5">
                    <ATATSVGIcon
                      name="calendar"
                      :width="34"
                      :height="37"
                      color="primary"
                    />
                  </div>
                  <div>
                    <span id="PeriodLength" class="h3">
                      Base period length: {{ periodLengthStr }}
                    </span>
                    <p class="mb-0">
                      Your funding plan may not exceed this PoP.
                    </p>
                    <hr class="base my-4" />
                  </div>
                </div>

                <div class="d-flex">
                  <div class="pr-5">
                    <ATATSVGIcon
                      name="monetizationOn"
                      :width="34"
                      :height="34"
                      color="primary"
                    />
                  </div>
                  <div>
                    <span id="TotalCostEstimate" class="h3">
                      Total cost estimate: ${{ costEstimateStr }}
                    </span>
                    <p class="mb-0" v-if="!isFundingMet">
                      <!-- adjust message for overfunded or funding met -->
                      You need to add
                      <span id="AmountRemaining" class="bold">
                        ${{ amountRemainingStr }}
                      </span>
                      to fully fund your base period.
                    </p>
                    <p class="mb-0" v-else>
                      Your funding plan accounts for the total cost estimate for
                      your base period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ATATAlert
          id="OverUnderFundedAlert"
          class="width-70 mt-5"
          v-if=" isIFPOverfunded|| isIFPUnderfunded "
        >
          <template slot="content">
            <p class="mb-0">
              Based on your requirement’s cost estimate, your plan is
              <strong>{{ isIFPOverfunded ? 'over' : 'under'}}funded</strong>. 
              Please adjust your increments to ensure the total equals ${{ costEstimateStr }} 
            </p>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">

// .list-enter, .list-leave-to {
//   opacity: 0;
// }
// .list-enter-active, .list-leave-active {
//   transition: opacity 0.5s ease;
// }
.funding-increments-item {
  transition: all 0.5s ease;
  display: inline-block;
}
.funding-increments-enter, .funding-increments-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  // transform: translateY(30px);
}
.funding-increments-leave-active {
  position: absolute;
}

.funding-increments-move {
  transition: transform 0.5s ease;
}
</style>


<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATAlert from "@/components/ATATAlert.vue";

import FinancialDetails from "@/store/financialDetails";
import Periods from "@/store/periods";
import PeriodOfPerformance from "@/store/periods";

import { PeriodDTO, PeriodOfPerformanceDTO } from "@/api/models";
import { SelectData, fundingIncrement, IFPData } from "../../../types/Global";
import { toCurrencyString, currencyStringToNumber } from "@/helpers";

import SaveOnLeave from "@/mixins/saveOnLeave";
import { hasChanges } from "@/helpers";
import { add, format, isValid } from "date-fns";
import { parseISO } from "date-fns/fp";
import formatISO from "date-fns/formatISO"
import _ from "lodash";

@Component({
  components: {
    ATATSelect,
    ATATSVGIcon,
    ATATTextField,
    ATATErrorValidation,
    ATATAlert
  },
})
export default class IncrementalFunding extends Mixins(SaveOnLeave) {
  public today = new Date();
  public currentYear = this.today.getFullYear();

  public periods: PeriodDTO[] | null = [];
  public maxAllowedIncrements = 1;
  public periodLengthStr = "";
  public requestedPopStartDate =
    Periods.periodOfPerformance?.requested_pop_start_date;
  public periodOfPerformance!: PeriodOfPerformanceDTO; 
  public startDate = new Date();//(): Date => {

  public currentQuarter():number {
    const currentMonth = this.startDate.getMonth() + 1;
    return Math.ceil((currentMonth <= 9 ? currentMonth + 3 : currentMonth - 9)/3);
  };

  public ordinals = ["1st", "2nd", "3rd", "4th"];

  public costEstimate = 0;
  public costEstimateStr = "";
  public amountRemaining = 0;
  public amountRemainingStr = "";
  public initialAmount = 0;
  public initialAmountStr = "";
  private currentSelectedValue = "";
  private isIFPUnderfunded = false;
  private isIFPOverfunded = false;

  public totalAmount = 0;

  private errorMessages: string[] = [];
  public errorMissingInitialIncrement = false;
  public errorMissingInitialIncrementMessage =
    "Please enter the amount of your initial funding.";
  public errorMissingFirstIncrement = false;
  public errorMissingFirstIncrementMessage =
    "Please enter the amount of your first increment.";
  public duplicateListingsIndices: number[] = [];
  public duplicateErrorMessage =
    "Adjust your projected increment date to remove duplicate increments.";

  // use in future ticket for validation returning to page to show error messages
  public hasReturnedToPage = false;

  public fundingIncrements: fundingIncrement[] = [];
  public quarterSelectData: SelectData[] = [];

  public selectData: SelectData[][] = [];

  private get currentData(): IFPData {
    return {
      initialFundingIncrementStr: this.initialAmountStr,
      fundingIncrements: this.fundingIncrements,
    };
  }

  private savedData: IFPData = {
    initialFundingIncrementStr: "",
    fundingIncrements: [],
  };

  public fiscalQuarters: { text: string; multiSelectOrder: number, disabled: false }[] = [];

  public hasValidatedOnContinue = false;
  public allowContinue = true;

  public async validateOnContinue(): Promise<void> {
    this.calcAmounts("initialIncrement");
    this.calcAmounts("increment0");
    this.isUnderfunded(); 
    this.isOverfunded();

    if (!this.hasValidatedOnContinue && (this.duplicateListingsIndices.length > 0 
      || this.isIFPUnderfunded || this.isIFPOverfunded)
    ) {
      this.allowContinue = false;
    } else {
      this.allowContinue = true;
    }
  }

  public changedItemIndex = -1;

  public quarterChange(args: Record<string, SelectData>): void {
    const newVal = args.newSelectedValue;
    const oldVal = args.selectedBeforeChange;
    this.changedItemIndex = this.fundingIncrements.findIndex(
      incr => incr.qtr === oldVal.text
    );
    this.fundingIncrements[this.changedItemIndex].qtr = newVal.text;
    debugger;
    if (newVal.multiSelectOrder) {
      this.fundingIncrements[this.changedItemIndex].qtrOrder = newVal.multiSelectOrder;
      // this.quarterSelectData[this.changedItemIndex].multiSelectOrder = newVal.multiSelectOrder;

      debugger;

      this.fundingIncrements.sort((a, b) => a.qtrOrder > b.qtrOrder ? 1 : -1);
      this.quarterSelectData.sort((a, b) => a.text > b.text ? 1 : -1);
      debugger;

      // const incrCount = this.fundingIncrements.length;
      // for (let index = 0; index < incrCount; index++) {
      //   this.getSelectData(index);
      // }

      // EJY do sorting of this.fundingIncrements here

      // EJY run getSelectData after to reset the menus?

    }
  }
  
  public quarterJustAdded = ""; // EJY move this somewhere better

  public initializeIncrements(): void {
    if (this.fiscalQuarters.length === 0) {
      let qtr = this.currentQuarter();
      let year = parseInt(format(this.startDate, "yy"));
      for (let i = 0; i < 6; i++) {
        const ordinal = this.ordinals[qtr-1];
        // increment year if at first quarter and not first in the loop
        year = qtr === 1 ? year + 1 : year;
      
        // increment quarter
        qtr = qtr === 4 ? 1 : qtr + 1;
        const periodStr = ordinal + " QTR FY" + year;
        this.fiscalQuarters.push({ 
          text: periodStr, 
          multiSelectOrder: i + 1,
          disabled: false,
        });

        if (i === 0 && (this.fundingIncrements.length === 0)) {
          // default to 1st option if no store data
          this.fundingIncrements.push({
            qtr: periodStr,
            amt: "",
            order: 1,
            sysId: "",
            qtrOrder: 1,
          });
          this.quarterSelectData.push({
            text: periodStr,
            multiSelectOrder: 1,
          });
        } else if (
          i === 0 
          && this.fundingIncrements[0].sysId 
          && this.quarterSelectData.length === 0
        ) {
          const qtrStr = this.fundingIncrements[0].qtr;
          this.quarterSelectData.push({
            text: qtrStr,
            multiSelectOrder: 1,
          });
        }
      }
    }
  }

  public removedIncrements: fundingIncrement[] = [];

  public deleteFundingIncrement(index: number): void {
    if (
      this.savedData.fundingIncrements &&
      this.fundingIncrements[index].sysId
    ) {
      const incr = this.savedData.fundingIncrements[index];
      if (incr) {
        this.removedIncrements.push(incr);
      }
    }
    debugger;
    this.fundingIncrements.splice(index, 1);
    this.quarterSelectData.splice(index, 1);
    this.calcAmounts("");
  }

  public isOverfunded():void{
    this.isIFPOverfunded = this.costEstimate < this.totalAmount;
  }

  public isUnderfunded():void{
    this.isIFPUnderfunded = this.costEstimate > this.totalAmount;
  }

  public addIncrement(): void {
    const lastFundingIncrement = this.fundingIncrements.at(-1);
    const lastSelectedQtr = lastFundingIncrement?.qtr;
    let selectedQtrIndex = this.fiscalQuarters.findIndex(
      (p) => p.text === lastSelectedQtr
    );

    let nextQtr;
    let nextQtrOrder = 0;
    if (
      selectedQtrIndex > -1 &&
      selectedQtrIndex !== this.fiscalQuarters.length
    ) {
      nextQtr = this.fiscalQuarters[selectedQtrIndex + 1].text;
      nextQtrOrder = this.fiscalQuarters[selectedQtrIndex + 1].multiSelectOrder;
    }

    if (nextQtr && nextQtrOrder) {
      const newIncrement = {
        qtr: nextQtr,
        amt: "",
        order: nextQtrOrder,
        sysId: "",
        qtrOrder: nextQtrOrder,
      };
      this.fundingIncrements.push(newIncrement);

      const qtrSelectData: SelectData = {
        text: nextQtr,
        multiSelectOrder: nextQtrOrder,
      }
      this.quarterSelectData.push(qtrSelectData);
      this.quarterJustAdded = nextQtr;
      
    }
  }

  public isFundingMet = false;

  public calcAmounts(field: string): void {
    let incrementsTotal = this.fundingIncrements.reduce(
      (accumulator, current) =>
        accumulator + Number(currencyStringToNumber(current.amt)),
      0
    );
    this.initialAmount = currencyStringToNumber(this.initialAmountStr);
    this.totalAmount = this.initialAmount
      ? this.initialAmount + incrementsTotal
      : incrementsTotal;
    this.isFundingMet = this.totalAmount >= this.costEstimate;

    this.amountRemaining = this.costEstimate - this.totalAmount;
    this.amountRemainingStr = this.amountRemaining
      ? toCurrencyString(this.amountRemaining)
      : "";
    this.initialAmountStr = this.initialAmount
      ? toCurrencyString(this.initialAmount)
      : "";
    this.$nextTick(() => {
      this.fundingIncrements.forEach((incr) => {
        return (incr.amt =
          incr.amt && incr.amt !== "0.00"
            ? toCurrencyString(currencyStringToNumber(incr.amt))
            : "");
      });
    });

    // validation on blur for initial and first increments required
    let amt;
    if (field === "initialIncrement") {
      amt = parseFloat(this.initialAmountStr);
      this.errorMissingInitialIncrement = amt === 0 || isNaN(amt);
    } else if (field === "increment0") {
      amt = parseFloat(this.fundingIncrements[0].amt);
      this.errorMissingFirstIncrement = amt === 0 || isNaN(amt);
    }
    this.isOverfunded();
  }


  public getSelectData(index: number): SelectData[] {
    if (this.fiscalQuarters.length === 0) {
      this.initializeIncrements();
    }
    const firstSelectedQtr = this.fundingIncrements[0].qtr;
    const firstSelectedQtrIndex = this.fiscalQuarters.findIndex(
      (qtr) => qtr.text === firstSelectedQtr
    );

    let lastPossibleIndex = firstSelectedQtrIndex + this.maxAllowedIncrements;
    lastPossibleIndex =
      lastPossibleIndex > this.fiscalQuarters.length
        ? this.fiscalQuarters.length
        : lastPossibleIndex;

    let optionsArr = _.cloneDeep(this.fiscalQuarters);
    if (index > 0) {
      optionsArr = optionsArr.slice(
        firstSelectedQtrIndex + 1,
        lastPossibleIndex
      );
    }
    if (index === 0 && this.selectData.length === 0) {
      this.selectData[0] = _.cloneDeep(this.fiscalQuarters);
      return this.selectData[0];
    }
    debugger;
    // check if we are past changedItemIndex
    // if (this.changedItemIndex !== -1 
    //   && index > this.changedItemIndex
    //   && this.quarterSelectData[this.changedItemIndex].multiSelectOrder
    // ) {
    //   const changedItemQtrOrder = this.quarterSelectData[this.changedItemIndex].multiSelectOrder;
    //   const thisItemQtrOrder = this.quarterSelectData[index].multiSelectOrder;
    //   const amountPastChangedItem = index - this.changedItemIndex;
    //   const nextIndex = firstSelectedQtrIndex + amountPastChangedItem;
    //   if (nextIndex <= lastPossibleIndex) {
    //     if (changedItemQtrOrder && thisItemQtrOrder && (changedItemQtrOrder > thisItemQtrOrder)) {
    //       const nextQtr = this.fiscalQuarters[nextIndex];
    //       // EJY don't change them if the multiSelectOrder is fine
    //       const thisQtrOrder = this.quarterSelectData[index].multiSelectOrder || false;
    //       debugger;
    //       // yeah this isn't working 
    //       if (thisQtrOrder && (thisQtrOrder < nextQtr.multiSelectOrder)) {
    //         this.quarterSelectData[index].multiSelectOrder = nextQtr.multiSelectOrder;
    //         this.quarterSelectData[index].text = nextQtr.text;
    //         this.fundingIncrements[index].qtr = nextQtr.text;
    //         this.fundingIncrements[index].qtrOrder = nextQtr.multiSelectOrder;
    //         debugger;
    //       }
    //     }
    //   } else {
    //     // remove any increments past lastPossibleIndex
    //     this.quarterSelectData.splice(index, 1);
    //     this.fundingIncrements.splice(index, 1);
    //   }
    // }

    const alreadySelectedQuarters = this.fundingIncrements.map(obj => obj.qtr);
    const thisDropdownValue = this.quarterSelectData[index].text;
    optionsArr.forEach((option: SelectData) => {
      const isAlreadySelected = alreadySelectedQuarters.includes(option.text);
      const isThisOption = thisDropdownValue === option.text;
      option.disabled = isAlreadySelected && !isThisOption ? true : false;
    });
    this.selectData[index] = optionsArr;
    // debugger;
    return this.selectData[index];
  }

  public async loadOnEnter(): Promise<void> {
    const estimatedTOValue =
      await FinancialDetails.getEstimatedTaskOrderValue();
    if (estimatedTOValue) {
      this.costEstimate = currencyStringToNumber(estimatedTOValue);
      this.costEstimateStr = toCurrencyString(this.costEstimate);
    }

    const storeData = await FinancialDetails.loadIFPData();
    if (storeData) {
      this.savedData = storeData;
      this.fundingIncrements = [...storeData.fundingIncrements];
      this.initialAmountStr = storeData.initialFundingIncrementStr;
      this.initialAmount = currencyStringToNumber(this.initialAmountStr);

      this.calcAmounts("");

      // use below for future validation ticket
      this.hasReturnedToPage = this.fundingIncrements.length > 0;

      // EJY need to set qtrOrder on this.fundingIncrements

    }
    
    this.periodOfPerformance = await PeriodOfPerformance.loadPeriodOfPerformance();
    const requestedPopStartDate = this.periodOfPerformance.requested_pop_start_date;
    this.startDate = 
      await new Date(
        format(parseISO(requestedPopStartDate !== "" 
          ? requestedPopStartDate : formatISO(new Date())
        ), 'MM/dd/yyyy')
      );
    
    await this.initializeIncrements();

    this.periods = await Periods.loadPeriods();
    if (this.periods) {
      const basePeriod = this.periods.find((p) => p.period_type === "BASE");
      if (basePeriod) {
        const unitCount: number = parseInt(basePeriod.period_unit_count);
        let unit = basePeriod.period_unit.toLowerCase();
        if (unitCount) {
          unit = unitCount > 1 ? unit + "s" : unit;
        }
        this.periodLengthStr = unitCount + " " + unit;
        switch (unit) {
        case "days":
          this.maxAllowedIncrements = unitCount > 270 ? 5 : 4;
          break;
        case "weeks":
          this.maxAllowedIncrements = unitCount > 36 ? 5 : 4;
          break;
        case "months":
          this.maxAllowedIncrements = unitCount > 9 ? 5 : 4;
          break;
        case "year":
          this.maxAllowedIncrements = 5;
          break;
        default:
          this.maxAllowedIncrements = 1;
        }
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (!this.hasValidatedOnContinue) {
        await this.validateOnContinue();
        this.hasValidatedOnContinue = true;
      } else {
        this.allowContinue = true;
      }

      if (this.allowContinue) {
        // Set chronological order of fiscal quarters in fundingIncrements
        let sortedIncrements: fundingIncrement[] = [];
        this.fundingIncrements.forEach((incr) => {
          incr.order =
            this.fiscalQuarters.findIndex((q) => q.text === incr.qtr) + 1;
          sortedIncrements.push(incr);
        });
        sortedIncrements.sort((a, b) => {
          return a.order > b.order ? 1 : -1;
        });
        sortedIncrements.forEach((incr, i) => {
          incr.order = i + 1;
        });

        this.fundingIncrements = sortedIncrements;

        if (this.hasChanged()) {
          FinancialDetails.saveIFPData({
            data: this.currentData,
            removed: this.removedIncrements,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    return this.allowContinue;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
}
</script>
