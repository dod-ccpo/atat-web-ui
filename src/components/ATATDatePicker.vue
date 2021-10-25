<template>
  <v-row>
    <v-col>
      <div
        class="d-flex justify-start width-100"
        :id="getId('clin-datepicker-text-boxes')"
      >
        <!-- todo give id a more meaningful name -->

        <v-text-field
          ref="startDate"
          outlined
          dense
          :id="getId('start-date-text-box')"
          :success="isFieldValid"
          :error="isFieldValid"
          hide-details
          placeholder="YYYY-MM-DD"
          v-model="startDate"
          :value="startDate"
          :rules="_startDateRules"
          @focus="setFocus"
          @blur="blurTextField"
          @update:error="getErrorMessages(true)"
          :class="[
            isStartTextBoxFocused ? 'focused' : '',
            'datepicker-text-box start-date',
          ]"
        ></v-text-field>
        <v-btn icon :ripple="false" :id="getId('start-date-text-box-button')">
          <v-icon class="black--text date-picker-icon">calendar_today</v-icon>
        </v-btn>
        <v-text-field
          ref="endDate"
          outlined
          dense
          :id="getId('end-date-text-box')"
          :success="isFieldValid"
          :error="isFieldValid"
          hide-details
          placeholder="YYYY-MM-DD"
          v-model="endDate"
          :value="endDate"
          @focus="setFocus"
          :rules="_endDateRules"
          @blur="blurTextField"
          @update:error="getErrorMessages(false)"
          :class="[
            isEndTextBoxFocused ? 'focused' : '',
            'datepicker-text-box end-date',
          ]"
        ></v-text-field>
        <v-btn icon :ripple="false" :id="getId('end-date-text-box-button')">
          <v-icon class="black--text date-picker-icon">calendar_today</v-icon>
        </v-btn>
      </div>
      <v-menu
        v-model="menu"
        id="CLIN-datepicker-menu"
        :attach="'#clin-datepicker-text-boxes-' + this.id"
        origin="top left"
        :nudge-left="-10"
        :nudge-top="410"
        absolute
        :close-on-content-click="false"
        :close-on-click="!menu"
      >
        <div class="two-date-pickers pa-6">
          <div class="h4">
            {{ _title }}
          </div>
          <hr class="mt-6 mb-4" />
          <div class="d-flex align-start">
            <!-- todo add :allowed-dates="allowedDates" -->
            <v-date-picker
              ref="firstMonth"
              :min="min"
              :max="max"
              v-model="getDateRange"
              :show-current="true"
              range
              no-title
              :id="getId('firstMonthDatePicker')"
              scrollable
              tabindex="0"
              @click:date="setDate"
              :picker-date.sync="firstMonth"
              transition="false"
              class="width-50"
            />

            <v-date-picker
              ref="secondMonth"
              :min="min"
              :max="max"
              :show-current="true"
              v-model="getDateRange"
              range
              tabindex="0"
              no-title
              @click:date="setDate"
              :id="getId('secondMonthDatePicker')"
              scrollable
              :picker-date.sync="secondMonth"
              transition="false"
              class="width-50"
            />
          </div>
        </div>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { CustomErrorMessage } from "types/Wizard";

@Component({})
export default class ATATDatePicker extends Vue {
  $refs!: {
    startDate: Vue & { errorBucket: string[] };
    endDate: Vue & { errorBucket: string[] };
  };

  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: "color" }) private color!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;
  @PropSync("date") private _date!: string;
  @PropSync("daterange", { default: ["", ""] }) private dateRange!: string[];
  @PropSync("title") private _title!: string;
  @Prop() private nudgeleft!: string;
  @Prop() private allowedDates!: string[];
  @PropSync("pop_start_date", { default: "" }) private startDate!: string;
  @PropSync("pop_end_date", { default: "" }) private endDate!: string;
  @PropSync("startDateRules") private _startDateRules!: any[];
  @PropSync("endDateRules") private _endDateRules!: any[];
  @PropSync("errormessages") private _errorMessages!: (
    | CustomErrorMessage
    | undefined
  )[];
  @Prop({ default: "2020-10-01" }) private min!: string;
  @Prop({ default: "2021-10-01" }) private max!: string;

  private menu = false;
  private firstMonth = moment(new Date()).format("YYYY-MM-DD");
  private secondMonth = moment(this.firstMonth)
    .add(1, "M")
    .format("YYYY-MM-DD");
  private isFieldValid = false;
  private isStartTextBoxFocused = false;
  private isEndTextBoxFocused = false;
  private startDatePickerButton: any;
  private endDatePickerButton: any;

  private setFocus(event: Event): void {
    const focusedElement = event.target as HTMLElement;
    const isElementStartTextBox =
      focusedElement.closest(".start-date") !== null;
    this.isStartTextBoxFocused = isElementStartTextBox;
    this.isEndTextBoxFocused = !isElementStartTextBox;
    this._title =
      "What is the PoP " + (isElementStartTextBox ? "Start" : "End") + " Date?";
  }

  private getId(prependString: string): string {
    return prependString + "-" + this.id;
  }

  private toggleMenu(event: Event): void {
    //todo make more descriptive to accommodate multiple clins datepickers
    //todo OCT not showing all rows....
    //todo set better name for this function...
    // accommodates for all items in div #clin-datepicker-text-boxes" being clicked
    // menu to remain open if any components within this component are clicked and
    // closed if user clicks elsewhere
    const element = event.target as HTMLElement;
    this.menu =
      element.closest("#" + this.getId("clin-datepicker-text-boxes")) !== null;
    if (this.menu) {
      // debugger;
      // this.$nextTick(() => {
      //   this.setStyleForStartDateAndEndDateButtons();
      // });
    } else {
      this.isStartTextBoxFocused = false;
      this.isEndTextBoxFocused = false;
    }

    // if datepicker was clicked
    const datePickerButtonElement =
      element.closest(".v-date-picker-table") !== null;
    if (datePickerButtonElement) {
      if (this.isStartTextBoxFocused) {
        this.startDatePickerButton = element.parentElement as HTMLButtonElement;
        this.styleDatePickerButton(this.startDatePickerButton, true);
      } else if (this.isEndTextBoxFocused) {
        this.endDatePickerButton = element.parentElement as HTMLButtonElement;
        this.styleDatePickerButton(this.endDatePickerButton, false);
      }
    }
    Vue.nextTick(() => {
      this.setDatePickerHoverButtons;
    });
  }

  get setDatePickerHoverButtons(): void {
    // restores datepicker table to default classes
    if (this.menu) {
      const datepickerTables = document.getElementsByClassName(
        "v-date-picker-table"
      );
      Array.from(datepickerTables).forEach((table) => {
        table.classList.remove("hover-start", "hover-end");
      });

      const classToAdd = this.isStartTextBoxFocused
        ? "hover-start"
        : "hover-end";
      Array.from(datepickerTables).forEach((table) => {
        table.classList.add(classToAdd);
      });
    }
    return undefined;
  }

  private styleDatePickerButton(
    button: HTMLButtonElement,
    isStartButton: boolean
  ): void {
    // restore already selected start/end datepicker buttons to default state
    const classToRemove = isStartButton
      ? "date-picker-start-date"
      : "date-picker-end-date";
    const elementsWithOutdatedClass =
      document.getElementsByClassName(classToRemove);
    if (elementsWithOutdatedClass.length > 0) {
      Array.from(elementsWithOutdatedClass).forEach((el) => {
        el.classList.remove(classToRemove);
      });
    }

    //add necessary class
    const classToAdd = isStartButton
      ? "date-picker-start-date"
      : "date-picker-end-date";
    button.classList.add(classToAdd);
  }

  get getDate(): string {
    return this._date;
  }

  private isDatePickerAdvancing = false;

  public getSelectedDate(selectedDate: string): void {
    this._date = selectedDate;
  }

  public setDate(selectedDate: string): void {
    if (this.isStartTextBoxFocused) {
      this.setStartDate(selectedDate);
    } else {
      this.setEndDate(selectedDate);
    }
  }

  public setStartDate(selectedDate: string): void {
    if (this.isDateRangeValid(selectedDate, true)) {
      this.startDate = selectedDate;
      this.setDateRange;
    } else {
      this.clearDates(true);
      this.startDate = selectedDate;
    }
  }

  public setEndDate(selectedDate: string): void {
    if (this.isDateRangeValid(selectedDate, false)) {
      this.endDate = selectedDate;
      this.setDateRange;
    } else {
      this.clearDates(false);
      this.endDate = selectedDate;
    }
  }

  get setDateRange(): string[] {
    if (this.startDate !== "") {
      this.dateRange[0] = this.startDate;
    }
    if (this.endDate !== "") {
      this.dateRange[1] = this.endDate;
    }
    return this.dateRange;
  }

  private clearDates(isStart: boolean): void {
    this.dateRange = ["", ""];
    // this.startDate = isStart ? this.startDate : "";
    // this.endDate = isStart ? "" : this.endDate;
  }

  private isDateRangeValid(tempDate: string, isStartDate: boolean): boolean {
    const start = isStartDate ? tempDate : this.startDate;
    const end = isStartDate ? this.endDate : tempDate;
    if (this.startDate === "" || this.endDate === "") {
      return true;
    } else if (moment(start).isBefore(moment(end))) {
      return true;
    }
    return false;
  }

  // applies daterange when menu is opened
  get getDateRange(): string[] {
    if (moment(this.startDate).isBefore(moment(this.endDate))) {
      this.dateRange[0] = this.startDate;
      this.dateRange[1] = this.endDate;
    }
    return this.dateRange;
  }

  set getDateRange(value: string[]) {
    this.dateRange = value;
  }

  public setStyleForStartDateAndEndDateButtons(): void {
    if (this.startDate !== "" || this.endDate !== "") {
      // const activeDateRangeButtons = Array.from(
      //   document.getElementsByClassName("v-date-picker-table")
      // ).map((dp) => {
      //   return dp.getElementsByClassName("v-btn--active");
      // });

      const datepicker = document.getElementById(
        this.getId("firstMonthDatePicker")
      ) as HTMLTableElement;
      const activeDateRangeButtons =
        datepicker.getElementsByClassName("v-btn--active");

      if (activeDateRangeButtons.length > 0) {
        // collect all necessary end date artifacts
        debugger;
        let startDateButton = activeDateRangeButtons[0] as HTMLButtonElement;
        const selectedStartDateDiv = startDateButton
          .children[0] as HTMLDivElement;
        const selectedStartDate = selectedStartDateDiv.innerText;

        // collect all necessary end date artifacts
        // let endDateButton =
        //   activeDateRangeButtons[activeDateRangeButtons.length - 1];
        // const selectedEndDateDiv = endDateButton.children[0] as HTMLDivElement;
        // const selectedEndDate = selectedEndDateDiv.innerText;

        if (this.isDateDisplayedCurrently(selectedStartDate, true)) {
          console.log(startDateButton);
          startDateButton.classList.remove("date-picker-start-date");
          startDateButton.classList.add("date-picker-start-date");
        } //else if (this.isDateDisplayedCurrently(selectedEndDate, false)) {
        //   console.log(endDateButton);
        //   this.$nextTick(() => {
        //     endDateButton.classList.remove("date-picker-end-date");
        //     endDateButton.classList.add("date-picker-end-date");
        //   });
        // }
      }
    }
  }

  // when user dispalys menu with already set date range
  // ensure selected start date and end date on datepicker
  // is styled as styled as expected.
  public isDateDisplayedCurrently(
    selectedDate: string,
    isStart: boolean
  ): boolean {
    const dateToCompare = isStart ? this.startDate : this.endDate;

    // determines if day of selected date is currently displayed
    const isSelectedDateDayDisplayed =
      parseInt(selectedDate) === moment(dateToCompare).get("date");
    //console.log("isStart:" + isStart);
    // console.log(isSelectedDateDayDisplayed);
    if (!isSelectedDateDayDisplayed) {
      return false;
    }

    const dateToCompareMonth = moment(dateToCompare).get("month");
    const leftDatePickerMonth = moment(this.firstMonth).get("month");
    const rightDatePickerMonth = moment(this.secondMonth).get("month");
    //determines if month of selected date is
    //currently displayed in first datepicker
    //console.log(dateToCompareMonth + ":" + leftDatePickerMonth);
    if (dateToCompareMonth === leftDatePickerMonth) {
      return true;
    }

    //determines if month of selected date is
    //currently displayed in second datepicker
    if (dateToCompareMonth === rightDatePickerMonth) {
      return true;
    }

    return false;
  }

  public getErrorMessages(isStart: boolean): void {
    let newMessages: (CustomErrorMessage | undefined)[] = [];
    let oldMessages: (CustomErrorMessage | undefined)[] = [];
    let errorBucket = isStart
      ? this.$refs.startDate.errorBucket
      : this.$refs.endDate.errorBucket;
    let errorMessagesToKeep: string = this.$refs.startDate ? "end" : "start";
    let newMessageDescription: string = this.$refs.startDate ? "start" : "end";
    newMessages = this.convertToCustomErrorMessage(
      errorBucket,
      newMessageDescription
    );
    oldMessages = this._errorMessages.filter(
      (em) => em?.description === errorMessagesToKeep
    );
    this._errorMessages = [];
    this._errorMessages = [...newMessages, ...oldMessages];
  }

  private convertToCustomErrorMessage(
    errorMessages: string[],
    origin: string
  ): CustomErrorMessage[] {
    let customErrorMessages: CustomErrorMessage[] = errorMessages.map(
      (em, idx) => {
        return {
          key: idx,
          message: em,
          description: origin,
        };
      }
    );
    return customErrorMessages;
  }

  private blurTextField(): void {
    this.getSelectedDate(this._date);
    this.getErrorMessages;
    this.menu = true;
  }

  @Watch("firstMonth")
  protected getFirstMonth(newVal: string, oldVal: string): void {
    newVal = newVal.length === 7 ? newVal + "-01" : newVal;
    oldVal = oldVal.length === 7 ? oldVal + "-01" : oldVal;
    if (newVal !== oldVal) {
      this.isDatePickerAdvancing = newVal > oldVal;
      if (!this.isDatePickerAdvancing) {
        this.firstMonth = moment(newVal).format("YYYY-MM-DD");
        if (newVal !== oldVal) {
          this.secondMonth = moment(oldVal).format("YYYY-MM-DD");
        }
      }
    }
  }

  @Watch("secondMonth")
  protected getSecondMonth(newVal: string, oldVal: string): void {
    newVal = newVal.length === 7 ? newVal + "-01" : newVal;
    oldVal = oldVal.length === 7 ? oldVal + "-01" : oldVal;
    if (newVal !== oldVal) {
      this.isDatePickerAdvancing = newVal > oldVal;
      if (this.isDatePickerAdvancing) {
        this.secondMonth = moment(newVal).format("YYYY-MM-DD");
        if (oldVal !== this.secondMonth) {
          this.firstMonth = moment(oldVal).format("YYYY-MM-DD");
        }
      }
    }
  }

  private getStatusIcon() {
    // if the rules property isn't set we won't display an icon
    // when the rules property is populated (i.e when the parent form is saved)
    // we evalute the rules to determine what icon to display
    if (this.$props["rules"].length > 0) {
      let date = this._date;

      this.isFieldValid = this.$props["rules"].every(
        (rule: (a: string) => string | boolean) => rule(date) === true
      );
    }
  }

  private mounted(): void {
    document.addEventListener("click", this.toggleMenu);
  }

  private destroyed(): void {
    document.removeEventListener("click", this.toggleMenu);
  }
}
</script>
