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
                  :class="[{ 'error--text': errorMissingInitialIncrement },]"
                  style="margin-left: 39px;"
                  :validateOnBlur="false"
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
                  :key="fundingIncrement.text"
                  :id="'Increment' + index"
                  class="funding-increments-item"
                >
                  <div class="mb-4">
                    <div class="d-flex justify-space-between align-center mb-4 position-relative">
                      <span class="_insert-increment">
                        <v-btn
                          :id="'InsertIncrement' + index"
                          class="_icon-only _plus position-relative"
                          v-if="fundingIncrement.hasPeriodGap"
                          @click="insertIncrement(index)"
                        >
                          <ATATSVGIcon color="base" :height="12" :width="12" name="plusSign" />
                          <div
                            :id="'AddIncrementTooltipText' + index"
                            class="_button-help"
                          >
                            Add increment below
                          </div>
                        </v-btn>

                      </span>
                      <span class="d-block font-weight-500 text-base mr-4 ml-1 font-size-14">
                        {{ index + 1 }}
                      </span>

                      <ATATSelect
                        :id="'IncrementPeriod' + index"
                        :items="getFiscalQuarters(index)"
                        width="190"
                        :selectedValue.sync="selectedQuarters[index]"
                        class="mr-4"
                        :class="{
                          'customized-error-control error--text': index === outOfRangeIndex
                        }"
                        :showErrorMessages="false"
                        @selectValueChange="quarterChange"
                        :returnObject="true"
                      />

                      <ATATTextField
                        :id="'Amount' + index"
                        :ref="'Amount' + index"
                        :value.sync="fundingIncrements[index].amt"
                        :alignRight="true"
                        :isCurrency="true"
                        :showErrorMessages="false"
                        :validateOnBlur="false"
                        width="190"
                        class="mr-2"
                        :class="[{ 'error--text': errorMissingFirstIncrement && index === 0},]"
                        @blur="calcAmounts('increment' + index)"
                        :rules="[$validators.required('', true)]"
                      />
                      <v-btn
                        :id="'DeleteIncrement' + index"
                        class="_icon-only"
                        @click="deleteFundingIncrement(index)"
                        :disabled="fundingIncrements.length === 1"
                      >
                        <v-icon> delete </v-icon>
                      </v-btn>
                    </div>
                    <div>
                      <!-- error validation for last quarter out of range -->
                      <ATATErrorValidation
                        id="OutOfRangeAlert"
                        class="atat-text-field-error"
                        :errorMessages="[outOfRangeErrorMessage]"
                        v-if="outOfRangeIndex && index === outOfRangeIndex"
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
                v-if="showAddIncrementButton"
                plain
                text
                class=" link-button no-border mt-5"
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
                  style="margin-right: -10px;"
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
                      Your funding plan may not exceed this period.
                    </p>
                    <!-- <hr class="base my-4" /> -->
                  </div>
                </div>

                <!-- <div class="d-flex">
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
                </div> -->
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

<script lang="ts">
/*eslint prefer-const: 1 */
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
import { format } from "date-fns";
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

  public costEstimate = 250000;
  public costEstimateStr = toCurrencyString(this.costEstimate);
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
  public outOfRangeIndex: number | null = null;
  public outOfRangeErrorMessage = `Your funding plan exceeds your base period length.
    Remove this increment or adjust the 1st increment date to ensure your plan does
    not exceed 1 year.`;

  // use in future ticket for validation returning to page to show error messages
  public hasReturnedToPage = false;

  public fundingIncrements: fundingIncrement[] = [];
  public selectedQuarters: SelectData[] = [];

  public quarterSelectData: SelectData[][] = [];

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

  public fiscalQuarters: {
    text: string;
    multiSelectOrder: number,
    disabled: false,
    hidden: false,
  }[] = [];

  public hasValidatedOnContinue = false;
  public allowContinue = true;

  public async validateOnContinue(): Promise<void> {
    this.calcAmounts("initialIncrement");
    this.calcAmounts("increment0");
    // this.isUnderfunded(); 
    // this.isOverfunded();

    // if (!this.hasValidatedOnContinue && (this.outOfRangeIndex && this.outOfRangeIndex >= 0
    //   || this.isIFPUnderfunded || this.isIFPOverfunded)
    // ) {
    //   this.allowContinue = false;
    // } else {
    //   this.allowContinue = true;
    // }
  }

  public quarterChange(args: Record<string, SelectData>): void {
    const newVal = args.newSelectedValue;
    const oldVal = args.selectedBeforeChange;
    const changedItemIndex = this.fundingIncrements.findIndex(
      incr => incr.text === oldVal.text
    );

    this.fundingIncrements[changedItemIndex].text = newVal.text;
    if (newVal.multiSelectOrder) {
      this.fundingIncrements[changedItemIndex].qtrOrder = newVal.multiSelectOrder;
    }
    const currentSort = this.fundingIncrements.map(incr => incr.qtrOrder);
    for (let i = 0; i < currentSort.length - 1; i++) {
      const a = currentSort[i] || 0;
      const b = currentSort[i+1] || 0;
      if (a > b) {
        this.fundingIncrements.sort((a, b) => a.qtrOrder > b.qtrOrder ? 1 : -1);
        this.selectedQuarters.sort((a, b) => {
          if (a.multiSelectOrder && b.multiSelectOrder) {
            return a.multiSelectOrder > b.multiSelectOrder ? 1 : -1;
          }
          return 1;
        });

        break;
      }
    }

    this.fundingIncrements.forEach((incr, i) => incr.order = i + 1);

    const newIncrIndex = this.fundingIncrements.findIndex(incr => incr.text === newVal.text);
    this.focusInput(newIncrIndex);

    this.shouldShowAddIncrementButton();
  }

  public focusInput(index: number): void {
    setTimeout(() => {
      const id = "Amount" + index + "_text_field";
      const amountInput = document.getElementById(id) as HTMLInputElement;
      amountInput.focus();
    }, 600);
  }

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
          hidden: false,
        });

        if (i === 0 && (this.fundingIncrements.length === 0)) {
          // default to 1st option if no store data
          this.fundingIncrements.push({
            text: periodStr,
            amt: "",
            order: 1,
            sysId: "",
            qtrOrder: 1,
            hasPeriodGap: false,
          });
          this.selectedQuarters.push({
            text: periodStr,
            multiSelectOrder: 1,
          });
        }
      }
    }
  }

  public removedIncrements: fundingIncrement[] = [];

  public deleteFundingIncrement(index: number): void {
    if (this.savedData.fundingIncrements && this.fundingIncrements[index].sysId) {
      const incr = this.savedData.fundingIncrements[index];
      if (incr) {
        this.removedIncrements.push(incr);
      }
    }
    this.fundingIncrements.splice(index, 1);
    this.selectedQuarters.splice(index, 1);
    this.quarterSelectData.splice(index, 1);
    this.calcAmounts("");
    this.shouldShowAddIncrementButton();
  }

  public isOverfunded():void{
    this.isIFPOverfunded = this.costEstimate < this.totalAmount;
  }

  public isUnderfunded():void{
    this.isIFPUnderfunded = this.costEstimate > this.totalAmount;
  }

  public showAddIncrementButton = true;

  public shouldShowAddIncrementButton(): void {
    if (this.quarterSelectData.length && this.selectedQuarters.length) {
      const lastIncrementDropdown = this.quarterSelectData[this.quarterSelectData.length - 1];
      if (lastIncrementDropdown.length) {
        const lastIncrementQuarter = lastIncrementDropdown[lastIncrementDropdown.length - 1].text;
        const lastQuarterSelected = this.selectedQuarters[this.selectedQuarters.length - 1].text;
        const outOfRange = this.outOfRangeIndex && this.outOfRangeIndex >= 0;
        this.showAddIncrementButton
          = lastQuarterSelected !== lastIncrementQuarter && !outOfRange ? true : false;
      }
    }
  }

  public addIncrement(): void {
    const lastFundingIncrement = this.fundingIncrements.at(-1);
    const lastSelectedQtr = lastFundingIncrement?.text;
    //eslint-disable-next-line prefer-const
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
        text: nextQtr,
        amt: "",
        order: nextQtrOrder,
        sysId: "",
        qtrOrder: nextQtrOrder,
        hasPeriodGap: false,
      };
      this.fundingIncrements.push(newIncrement);

      const qtrSelectData: SelectData = {
        text: nextQtr,
        multiSelectOrder: nextQtrOrder,
      }
      this.selectedQuarters.push(qtrSelectData);
    }
    const newIncrIndex = this.fundingIncrements.length - 1;
    this.focusInput(newIncrIndex);

    this.shouldShowAddIncrementButton();
  }

  public insertIncrement(index: number): void {
    const insertAfterIncrementText = this.fundingIncrements[index].text;
    const nextFiscalQuarterIndex = this.fiscalQuarters.findIndex(
      q => q.text === insertAfterIncrementText
    ) + 1;

    const nextPeriod = this.fiscalQuarters[nextFiscalQuarterIndex];
    const nextIncrement: fundingIncrement = {
      text: nextPeriod.text,
      qtrOrder: nextPeriod.multiSelectOrder,
      amt: "",
      hasPeriodGap: false,
      order: 0,
    };
    this.fundingIncrements.splice(index +1, 0, nextIncrement);
    this.fundingIncrements.forEach((incr, i) => incr.order = i + 1);

    const nextSelectData: SelectData = {
      text: nextPeriod.text,
      multiSelectOrder: nextPeriod.multiSelectOrder,
    }
    this.selectedQuarters.splice(index + 1, 0, nextSelectData);

    this.focusInput(index + 1);

    this.shouldShowAddIncrementButton();
  }

  public isFundingMet = false;

  public calcAmounts(field: string): void {
    //eslint-disable-next-line prefer-const
    let incrementsTotal = this.fundingIncrements.reduce(
      (accumulator, current) =>
        accumulator + Number(currencyStringToNumber(current.amt)),
      0
    );
    this.initialAmount = currencyStringToNumber(this.initialAmountStr);
    this.totalAmount = this.initialAmount
      ? this.initialAmount + incrementsTotal
      : incrementsTotal;
    // this.isFundingMet = this.totalAmount >= this.costEstimate;

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
    // this.isOverfunded();
  }

  public checkIfHasPeriodGap(index: number): boolean {
    const thisIncrement = this.fundingIncrements[index];
    const fundingIncrementCount = this.fundingIncrements.length;

    // last 2 funding increments will never have a gap, so no + button
    if (index < fundingIncrementCount - 1) {
      const nextIncrement = this.fundingIncrements[index + 1];
      const dif = nextIncrement.qtrOrder - thisIncrement.qtrOrder;
      if (dif > 1) {
        return true;
      }
    }
    return false;
  }

  public lastAllowedQuarterIndex = 0;

  public getFiscalQuarters(index: number): SelectData[] {
    if (this.fiscalQuarters.length === 0) {
      this.initializeIncrements();
    }
    const fundingIncrements = _.cloneDeep(this.fundingIncrements);
    let optionsArr = _.cloneDeep(this.fiscalQuarters);

    if (index === 0 && fundingIncrements.length === 0) {
      this.quarterSelectData[0] = optionsArr;
      return optionsArr;
    }

    const firstSelectedQtr = fundingIncrements[0].text;
    const firstSelectedQtrIndex = this.fiscalQuarters.findIndex(
      (qtr) => qtr.text === firstSelectedQtr
    );

    const lastFiscalQtrIndex = this.fiscalQuarters.length - 1;
    const lastAllowedQuarterIndex = firstSelectedQtrIndex + this.maxAllowedIncrements;
    const lastPastMax = lastAllowedQuarterIndex > lastFiscalQtrIndex;

    if (index > 0) {
      const sliceEnd = lastPastMax ? lastFiscalQtrIndex + 1 : lastAllowedQuarterIndex;
      optionsArr = optionsArr.slice(
        firstSelectedQtrIndex + 1,
        sliceEnd
      );
    }

    const alreadySelectedQuarters = fundingIncrements.map(obj => obj.text);
    const thisDropdownValue = fundingIncrements[index].text;

    let lastSelectionOutOfRange: boolean | null = null;

    optionsArr.forEach((option: SelectData) => {
      const isAlreadySelected = alreadySelectedQuarters.includes(option.text);
      const isThisOption = thisDropdownValue === option.text;
      option.disabled = isAlreadySelected && !isThisOption ? true : false;
      option.hidden = false;

      const thisDropdownValueIndex = optionsArr.findIndex(o => o.text === thisDropdownValue);
      lastSelectionOutOfRange = thisDropdownValueIndex === -1 ? true : false;
    });

    if (lastSelectionOutOfRange && (index === this.selectedQuarters.length - 1)) {
      const thisFiscalQtr = this.fiscalQuarters.find(q => q.text === thisDropdownValue);
      if (thisFiscalQtr) {
        optionsArr.push(thisFiscalQtr);
        optionsArr[optionsArr.length - 1].hidden = lastSelectionOutOfRange;
        this.outOfRangeIndex = index;
      }
    } else if (index === this.selectedQuarters.length - 1) {
      this.outOfRangeIndex = null;
    }

    this.fundingIncrements[index].hasPeriodGap = this.checkIfHasPeriodGap(index);

    this.quarterSelectData[index] = optionsArr;
    this.shouldShowAddIncrementButton();

    return optionsArr;
  }

  public async loadOnEnter(): Promise<void> {
    const estimatedTOValue =
      await FinancialDetails.getEstimatedTaskOrderValue();
    if (estimatedTOValue) {
      this.costEstimate = currencyStringToNumber(estimatedTOValue);
      this.costEstimateStr = toCurrencyString(this.costEstimate);
    }

    this.initializeIncrements();

    const storeData = await FinancialDetails.loadIFPData();
    if (storeData) {
      this.savedData = storeData;
      this.initialAmountStr = storeData.initialFundingIncrementStr;
      this.initialAmount = currencyStringToNumber(this.initialAmountStr);

      // use below for future validation ticket
      this.hasReturnedToPage = this.fundingIncrements.length > 0;

      if (storeData.fundingIncrements.length) {
        this.fundingIncrements = [...storeData.fundingIncrements];
        this.fundingIncrements.forEach((incr: fundingIncrement, index: number) => {
          const fiscalQuarter = this.fiscalQuarters.find((qtr) => qtr.text === incr.text);
          if (fiscalQuarter) {
            incr.qtrOrder = fiscalQuarter.multiSelectOrder;
            const selectData: SelectData = {
              text: incr.text,
              multiSelectOrder: incr.qtrOrder,
            }
            this.selectedQuarters[index] = selectData;
            this.quarterSelectData[index] = this.getFiscalQuarters(index);
          }
        });
      }
    }

    this.calcAmounts("");
    
    this.periodOfPerformance = await PeriodOfPerformance.loadPeriodOfPerformance();
    const requestedPopStartDate = this.periodOfPerformance.requested_pop_start_date;
    this.startDate = 
      await new Date(
        format(parseISO(requestedPopStartDate !== "" 
          ? requestedPopStartDate : formatISO(new Date())
        ), 'MM/dd/yyyy')
      );

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
        //eslint-disable-next-line prefer-const
        let sortedIncrements: fundingIncrement[] = [];
        this.fundingIncrements.forEach((incr) => {
          incr.order =
            this.fiscalQuarters.findIndex((q) => q.text === incr.text) + 1;
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
