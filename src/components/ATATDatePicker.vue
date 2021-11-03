<template>
  <v-row>
    <v-col>
      <div
        class="clin-datepicker-control"
        :id="getId('clin-datepicker-text-boxes')"
      >
        <div class="width-100 d-flex justify-start">
          <label
            id="start_date_text_field_label"
            :class="[
              _errorMessages.length > 0 ? 'font-weight-bold' : '',
              'form-field-label',
            ]"
            :for="getId('start-date-text-box')"
          >
            Start Date
          </label>
          <label
            id="end_date_text_field_label"
            :class="[
              _errorMessages.length > 0 ? 'font-weight-bold' : '',
              'form-field-label',
            ]"
            :for="getId('end-date-text-box')"
          >
            End Date
          </label>
        </div>
        <div v-if="_errorMessages.length > 0" class="mt-0 width-100">
          <div class="error--text">
            <div class="v-messages__message">
              {{ _errorMessages[0].message }}
            </div>
          </div>
        </div>
        <div
          class="width-100 d-flex justify-start mt-2"
          :id="getId('datepicker-text-boxes')"
        >
          <div class="textbox-button d-flex justify-start">
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
              validate-on-blur
              :class="[
                isStartTextBoxFocused ? 'focused' : '',
                'datepicker-text-box start-date',
              ]"
            ></v-text-field>
            <v-btn
              icon
              :ripple="false"
              :id="getId('start-date-text-box-button')"
            >
              <v-icon class="black--text date-picker-icon"
                >calendar_today</v-icon
              >
            </v-btn>
          </div>

          <div class="textbox-button d-flex justify-start">
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
              validate-on-blur
              :class="[
                isEndTextBoxFocused ? 'focused' : '',
                'datepicker-text-box end-date',
              ]"
            ></v-text-field>
            <v-btn icon :ripple="false" :id="getId('end-date-text-box-button')">
              <v-icon class="black--text date-picker-icon"
                >calendar_today</v-icon
              >
            </v-btn>
          </div>
        </div>
      </div>
      <v-menu
        v-model="menu"
        id="CLIN-datepicker-menu"
        :attach="'#datepicker-text-boxes-' + this.id"
        origin="top left"
        :nudge-left="2"
        :nudge-top="menuTop"
        absolute
        :close-on-content-click="false"
        :close-on-click="!menu"
      >
        <div class="two-date-pickers pa-6">
          <div class="h3">
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
              :allowed-dates="allowedDates"
              range
              no-title
              :id="getId('firstMonthDatePicker')"
              scrollable
              tabindex="0"
              @click:date="setDate"
              :picker-date.sync="firstMonth"
              value="firstMonth"
              transition="false"
              class="first-month"
            />

            <v-date-picker
              ref="secondMonth"
              :min="min"
              :max="max"
              v-model="getDateRange"
              :show-current="true"
              :allowed-dates="allowedDates"
              range
              no-title
              :id="getId('secondMonthDatePicker')"
              scrollable
              tabindex="0"
              @click:date="setDate"
              :picker-date.sync="secondMonth"
              value="secondMonth"
              transition="false"
              class="second-month"
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
  @PropSync("daterange", { default: ["", ""] }) private dateRange!: string[];
  @PropSync("title") private _title!: string;
  @Prop() private nudgeleft!: string;
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
  private firstMonth: string =
    moment(this.startDate).format("YYYY-MM-DD") ||
    moment(new Date()).format("YYYY-MM-DD");
  private secondMonth = moment(this.startDate).add(1, "M").format("YYYY-MM-DD");
  // get firstMonth(): string {
  //   return (
  //     moment(this.startDate).format("YYYY-MM-DD") ||
  //     moment(new Date()).format("YYYY-MM-DD")
  //   );
  // }

  // set firstMonth(value: string) {
  //   this.firstMonth = value;
  // }

  // get secondMonth(): string {
  //   return moment(this.firstMonth).add(1, "M").format("YYYY-MM-DD");
  // }
  // set secondMonth(value: string) {
  //   this.secondMonth = value;
  // }

  private isFieldValid = false;
  private isStartTextBoxFocused = false;
  private isEndTextBoxFocused = false;
  private startDatePickerButton: any;
  private endDatePickerButton: any;
  private menuTop = 375;
  private calendarClicked = false;
  private startDateFormatted = this.formatDate(this.startDate);
  private endDateFormatted = this.formatDate(this.endDate);

  @Watch("startDate")
  protected processStartDate(newVal: string, oldVal: string): void {
    this.startDateFormatted = this.formatDate(this.startDate);
    if (this.formatDate(newVal) === this.formatDate(this.endDate)) {
      this.startDate = oldVal;
    }
  }

  @Watch("endDate")
  protected processEndDate(newVal: string, oldVal: string): void {
    this.endDateFormatted = this.formatDate(this.endDate);
    if (this.formatDate(newVal) === this.formatDate(this.startDate)) {
      this.endDate = oldVal;
    }
  }

  private formatDate(dateToBeFormatted: string): string {
    return moment(dateToBeFormatted).format("MM/DD/YYYY");
  }

  private setFocus(event: Event): void {
    const focusedElement = event.target as HTMLElement;
    this.focusElement(focusedElement);
  }

  private focusElement(textBox: HTMLElement): void {
    const isStart = textBox.closest(".start-date") !== null;
    this.isStartTextBoxFocused = isStart;
    this.isEndTextBoxFocused = !isStart;
    this._title = "What is the PoP " + (isStart ? "Start" : "End") + " Date?";
  }

  private getId(prependString: string): string {
    return prependString + "-" + this.id;
  }

  public isDateValid(dateString: string): boolean {
    return /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
      dateString
    );
  }

  public allowedDates(val: string): boolean {
    if (this.isEndTextBoxFocused && this.isDateValid(this.startDate)) {
      return moment(val).isSameOrAfter(moment(this.startDate));
    } else if (this.isStartTextBoxFocused && this.isDateValid(this.endDate)) {
      return moment(val).isSameOrBefore(moment(this.endDate));
    }
    return true;
  }

  @Watch("calendarClicked")
  protected getMenuTop(newVal: boolean): void {
    if (newVal) {
      if (this.menu || this.calendarClicked) {
        setTimeout(() => {
          this.adjustMenu(Array.from(document.getElementsByTagName("tbody")));
        }, 500);
        this.calendarClicked = false;
      }
    }
  }

  private adjustMenu(tableBodies: HTMLTableSectionElement[]) {
    let hasSixRows = false;
    tableBodies.forEach((tb) => {
      let tableRows = tb.children;
      if (tableRows.length === 6) {
        if (tableRows[5].children[0].innerHTML !== "") {
          hasSixRows = true;
        } else {
          let lastTableRow = tableRows[5] as HTMLTableRowElement;
          lastTableRow.style.display = "none";
        }
      }
    });
    this.menuTop = hasSixRows ? 415 : 375;
  }

  private async datepickerControlClicked(event: Event): Promise<void> {
    // accommodates for all items in div #clin-datepicker-text-boxes" being clicked
    // menu to remain open if any components within this component are clicked and
    // closed if user clicks elsewhere
    const element = event.target as HTMLElement;
    //if control (textboxes, icons, calendars, menu) was clicked
    this.menu =
      element.closest("#" + this.getId("clin-datepicker-text-boxes")) !== null;

    // if calendars were clicked
    const datePickerButtonElement =
      element.closest(".v-date-picker-table") !== null;
    //modify this so it is picking up click from calendar advancing button
    console.log("datePickerButtonElement > " + datePickerButtonElement);
    if (this.menu && !datePickerButtonElement) {
      if (
        this.isDateValid(this.startDate) &&
        this.isDateValid(this.endDate) &&
        this.startDate !== this.endDate
      ) {
        //set the style for start and end date buttons when datepicker is clicked
        this.setStyleForStartDateAndEndDateButtons(
          moment(this.startDate).startOf("month").format("YYYY-MM-DD"),
          moment(this.startDate).add(1, "M").endOf("month").format("YYYY-MM-DD")
        );
      }
    } else if (this.menu) {
      this.calendarClicked = true;
    } else {
      this.isStartTextBoxFocused = false;
      this.isEndTextBoxFocused = false;
    }

    if (datePickerButtonElement) {
      const button = element.parentElement as HTMLButtonElement;
      if (this.isStartTextBoxFocused) {
        this.startDatePickerButton = button;
        this.styleDatePickerButton(this.startDatePickerButton, true);
        (
          document.querySelector(
            "#" + this.getId("end-date-text-box")
          ) as HTMLElement
        ).click();
      } else if (this.isEndTextBoxFocused) {
        this.endDatePickerButton = button;
        this.styleDatePickerButton(this.endDatePickerButton, false);
        (
          document.querySelector(
            "#" + this.getId("start-date-text-box")
          ) as HTMLElement
        ).click();
      }
    }
    Vue.nextTick(() => {
      this.calendarClicked = false;
      this.setDatePickerHoverButtons();
      this.getErrorMessages(this.isStartTextBoxFocused);
    });
  }

  private setDatePickerHoverButtons(): void {
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

  private isDatePickerAdvancing = false;

  private blurTextField(): void {
    const dateToBeSet = this.isStartTextBoxFocused
      ? this.startDate
      : this.endDate;

    this.setDate(dateToBeSet);
    this.getErrorMessages(this.isStartTextBoxFocused);
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
    this.dateRange[0] = this.startDate;
    this.dateRange[1] = this.endDate;
    return this.dateRange;
  }

  private clearDates(isStart: boolean): void {
    this.dateRange = ["", ""];
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

  public setStyleForStartDateAndEndDateButtons(
    firstDayLeftMonth: string,
    lastDayRightMonth: string
  ): void {
    //console.log(firstDayLeftMonth + " --- " + lastDayRightMonth);
    setTimeout(() => {
      if (this.isDateValid(this.startDate) && this.isDateValid(this.endDate)) {
        const displayedDPs = document.getElementsByClassName(
          "two-date-pickers"
        )[0] as HTMLElement;
        if (displayedDPs) {
          const activeDatePickerButtons =
            displayedDPs.getElementsByClassName("v-btn--active");

          const isStartDateDisplayed = moment(this.startDate).isBetween(
            firstDayLeftMonth,
            lastDayRightMonth,
            undefined,
            "[]"
          );
          console.log("firstDayLeftMonth > " + firstDayLeftMonth);
          console.log("lastDayRightMonth > " + lastDayRightMonth);
          console.log("isStartDateDisplayed > " + isStartDateDisplayed);
          if (isStartDateDisplayed) {
            activeDatePickerButtons[0].classList.add("date-picker-start-date");
          }
          const isEndDateDisplayed = moment(this.endDate).isBetween(
            firstDayLeftMonth,
            lastDayRightMonth,
            undefined,
            "[]"
          );
          console.log("isEndDateDisplayed > " + isEndDateDisplayed);
          if (isEndDateDisplayed) {
            activeDatePickerButtons[
              activeDatePickerButtons.length - 1
            ].classList.add("date-picker-end-date");
          }
        }
      }
    }, 500);
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

  @Watch("firstMonth")
  protected getFirstMonth(newVal: string, oldVal: string): void {
    newVal = moment(newVal).startOf("month").format("YYYY-MM-DD");
    oldVal = moment(newVal).add(1, "M").format("YYYY-MM-DD");
    // console.log("firstMonth: (new) " + newVal + " (old) " + oldVal);
    if (newVal !== oldVal) {
      this.isDatePickerAdvancing = newVal > oldVal;
      if (!this.isDatePickerAdvancing) {
        this.firstMonth = moment(newVal).format("YYYY-MM-DD");
        if (newVal !== oldVal) {
          this.secondMonth = moment(oldVal).format("YYYY-MM-DD");
          this.calendarClicked = true;
          this.setStyleForStartDateAndEndDateButtons(
            newVal,
            moment(oldVal).endOf("month").format("YYYY-MM-DD")
          );
        }
      }
    }
  }

  @Watch("secondMonth")
  protected getSecondMonth(newVal: string, oldVal: string): void {
    newVal = moment(newVal).startOf("month").format("YYYY-MM-DD");
    oldVal = moment(newVal).subtract(1, "M").format("YYYY-MM-DD");
    if (newVal !== oldVal) {
      this.isDatePickerAdvancing = newVal > oldVal;
      if (this.isDatePickerAdvancing) {
        this.secondMonth = moment(newVal).format("YYYY-MM-DD");
        if (oldVal !== this.secondMonth) {
          this.firstMonth = moment(oldVal).format("YYYY-MM-DD");
          this.calendarClicked = true;
          this.setStyleForStartDateAndEndDateButtons(
            oldVal,
            moment(newVal).endOf("month").format("YYYY-MM-DD")
          );
        }
      }
    }
  }

  private mounted(): void {
    document.addEventListener("click", this.datepickerControlClicked);
    if (this.isDateValid(this.startDate)) {
      this.firstMonth = moment(
        this.isDateValid(this.startDate) ? this.startDate : new Date()
      ).format("YYYY-MM-DD");
      this.secondMonth = moment(this.startDate)
        .add(1, "M")
        .format("YYYY-MM-DD");
    }
  }

  private destroyed(): void {
    document.removeEventListener("click", this.datepickerControlClicked);
  }
}
</script>
