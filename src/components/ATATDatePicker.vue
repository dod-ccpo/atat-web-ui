<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        id="CLIN-datepicker-menu"
        attach="#clin-datepicker-text-boxes"
        origin="top left"
        :nudge-left="-10"
        :nudge-top="387"
        absolute
        :close-on-content-click="false"
        :close-on-click="!menu"
        class="datepicker-element"
      >
        <div class="two-date-pickers pa-6 height-100">
          <div class="width-100 h4 pb-7">
            {{ _title }}
            <hr />
          </div>
          <div class="d-flex align-center justify-space-between">
            <div class="width-50">
              <v-date-picker
                ref="firstMonth"
                :min="min"
                :max="max"
                v-model="getDateRange"
                :show-current="true"
                class="mr-5 mt-4 datepicker-element"
                range
                no-title
                id="firstMonthDatePicker"
                :allowed-dates="allowedDates"
                scrollable
                tabindex="0"
                @click:date="setDate"
                :picker-date.sync="firstMonth"
                transition="false"
              />
            </div>
            <div class="width-50">
              <v-date-picker
                ref="secondMonth"
                :min="min"
                :max="max"
                :show-current="true"
                v-model="getDateRange"
                class="ml-5 mt-4 datepicker-element"
                range
                tabindex="0"
                no-title
                @click:date="setDate"
                id="secondMonthDatePicker"
                scrollable
                :picker-date.sync="secondMonth"
                transition="false"
              />
            </div>
          </div>
        </div>
      </v-menu>
      <div class="d-flex align-start width-100" id="clin-datepicker-text-boxes">
        <!-- todo give id a more meaningful name -->

        <v-text-field
          ref="startDate"
          outlined
          dense
          :success="isFieldValid"
          :error="isFieldValid"
          :height="42"
          hide-details
          placeholder="YYYY-MM-DD"
          v-model="startDate"
          :value="startDate"
          :rules="_startDateRules"
          @focus="setFocus"
          @blur="blurTextField"
          @update:error="getErrorMessages"
          :class="[
            isStartTextBoxFocused ? 'focused' : '',
            'datepicker-text-box start-date',
          ]"
        ></v-text-field>
        <v-btn icon :ripple="false" class="ml-2">
          <v-icon class="icon-32 black--text date-picker-icon"
            >calendar_today</v-icon
          >
        </v-btn>

        <v-text-field
          ref="endDate"
          outlined
          dense
          :success="isFieldValid"
          :error="isFieldValid"
          :height="42"
          hide-details
          placeholder="YYYY-MM-DD"
          v-model="endDate"
          :value="endDate"
          @focus="setFocus"
          :rules="_endDateRules"
          @blur="blurTextField"
          @update:error="getErrorMessages"
          :class="[
            isEndTextBoxFocused ? 'focused' : '',
            'datepicker-text-box end-date',
          ]"
        ></v-text-field>
        <v-btn icon :ripple="false" class="ml-2">
          <v-icon class="icon-32 black--text date-picker-icon"
            >calendar_today</v-icon
          >
        </v-btn>
      </div>
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

  private toggleMenu(event: Event): void {
    //todo make more descriptive to accommodate multiple clins datepickers
    //todo OCT not showing all rows....
    //todo set getter name for this function...
    // accommodates for all items in div #clin-datepicker-text-boxes" being clicked
    // menu to remain open if any components within this component are clicked and
    // closed if user clicks elsewhere
    const element = event.target as HTMLElement;
    const isDatePickerElement =
      element.closest("#clin-datepicker-text-boxes") !== null;
    this.menu = isDatePickerElement ? true : false;
    if (!this.menu) {
      this.isStartTextBoxFocused = false;
      this.isEndTextBoxFocused = false;
    }

    // accommodates for datepicker date being selected

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

  public getErrorMessages(): void {
    let newMessages: (CustomErrorMessage | undefined)[] = [];
    let oldMessages: (CustomErrorMessage | undefined)[] = [];
    let errorBucket = this.$refs.startDate
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
