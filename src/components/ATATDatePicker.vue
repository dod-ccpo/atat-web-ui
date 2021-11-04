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
    startDate: Vue & { errorBucket: string[]; errorCount: number };
    endDate: Vue & { errorBucket: string[]; errorCount: number };
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

  @PropSync("isDatePickerBlurred") private _isDatePickerBlurred!: boolean;
  @PropSync("isTextBoxFocused") private _isTextBoxFocused!: boolean;
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

  public isStartDateBeforeEndDate(start?: string, end?: string): boolean {
    return moment(start || this.startDate).isBefore(
      moment(end || this.endDate)
    );
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
    this._isTextBoxFocused = true;
    this._title = "What is the PoP " + (isStart ? "Start" : "End") + " Date?";
  }

  private getId(prependString: string): string {
    return prependString + "-" + this.id;
  }

  public isDateValid(dateString: string): boolean {
    return (
      /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(dateString) &&
      moment(dateString).isValid()
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
    this.calendarClicked = this.menu;

    if (this.menu) {
      // set Style For StartDate And EndDate Buttons
      // if calendar is initialized
      if (
        this.isDateValid(this.startDate) &&
        this.isDateValid(this.endDate) &&
        this.startDate !== this.endDate
      ) {
        this.setStartDate(this.startDate);
        this.setEndDate(this.endDate);
        const firstMonthToDisplay =
          this.firstMonth ===
          moment(this.startDate).startOf("month").format("YYYY-MM-DD")
            ? this.startDate
            : this.firstMonth;

        this.setStyleForStartDateAndEndDateButtons(
          moment(firstMonthToDisplay).startOf("month").format("YYYY-MM-DD"),
          moment(firstMonthToDisplay)
            .add(1, "M")
            .endOf("month")
            .format("YYYY-MM-DD")
        );
      }
    } else {
      // when component is closed
      this.isStartTextBoxFocused = false;
      this.isEndTextBoxFocused = false;
      this._isTextBoxFocused = false;
      // reset firstmonth so calendar will open to the start date
      this.firstMonth = this.startDate;
    }

    // if calendars were clicked
    const datePickerButtonElement =
      element.closest(".v-date-picker-table") !== null;
    if (datePickerButtonElement) {
      this.toggleTextboxes(element);
    }

    Vue.nextTick(() => {
      this.calendarClicked = false;
      this.setDatePickerHoverButtons();
      this.getErrorMessages();
    });
  }

  public toggleTextboxes(element: HTMLElement): void {
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
    this._isDatePickerBlurred = true;
    const dateToBeSet = this.isStartTextBoxFocused
      ? this.startDate
      : this.endDate;
    if (this.isDateValid(dateToBeSet)) {
      this.setDate(dateToBeSet);
    } else {
      this.clearDates();
    }
    Vue.nextTick(() => {
      this.getErrorMessages();
      this._isDatePickerBlurred = this._errorMessages.length > 0;
    });
  }

  public setDate(selectedDate: string): void {
    if (this.isStartTextBoxFocused) {
      this.setStartDate(selectedDate);
    } else {
      this.setEndDate(selectedDate);
    }
  }

  public setStartDate(selectedDate: string): void {
    this.startDate = selectedDate;
    this.setDateRange;
    if (!this.isDateRangeValid()) {
      this.dateRange[0] = "";
    }
  }

  public setEndDate(selectedDate: string): void {
    this.endDate = selectedDate;
    this.setDateRange;
    if (!this.isDateRangeValid()) {
      this.dateRange[1] = "";
    }
  }

  get setDateRange(): string[] {
    this.dateRange[0] = this.isDateValid(this.startDate)
      ? moment(this.startDate).format("YYYY-MM-DD")
      : "";
    this.dateRange[1] = this.isDateValid(this.endDate)
      ? moment(this.endDate).format("YYYY-MM-DD")
      : "";
    return this.dateRange;
  }

  private clearDates(): void {
    this.dateRange[0] = "";
    this.dateRange[1] = "";
  }

  private isDateRangeValid(): boolean {
    return (
      this.dateRange.every((d) => this.isDateValid(d)) &&
      this.isStartDateBeforeEndDate(this.dateRange[0], this.dateRange[1])
    );
  }

  // applies daterange when menu is opened
  get getDateRange(): string[] {
    if (this.isDateRangeValid() && this.isStartDateBeforeEndDate()) {
      if (moment(this.startDate).isBefore(moment(this.endDate))) {
        this.dateRange[0] = this.startDate;
        this.dateRange[1] = this.endDate;
      }
    } else {
      this.clearDates();
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
          if (isStartDateDisplayed) {
            activeDatePickerButtons[0].classList.add("date-picker-start-date");
          }
          const isEndDateDisplayed = moment(this.endDate).isBetween(
            firstDayLeftMonth,
            lastDayRightMonth,
            undefined,
            "[]"
          );
          if (isEndDateDisplayed) {
            activeDatePickerButtons[
              activeDatePickerButtons.length - 1
            ].classList.add("date-picker-end-date");
          }
        }
      }
    }, 500);
  }

  public getErrorMessages(): void {
    let newMessages: (CustomErrorMessage | undefined)[] = [];
    let oldMessages: (CustomErrorMessage | undefined)[] = [];
    let errorBucket = [""];
    if (this.$refs.startDate.errorBucket.length > 0) {
      errorBucket = this.$refs.startDate.errorBucket;
    } else if (this.$refs.endDate.errorBucket.length > 0) {
      errorBucket = this.$refs.endDate.errorBucket;
    }
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
    let customErrorMessages: CustomErrorMessage[] = [];
    errorMessages.forEach((em, idx) => {
      if (em !== "") {
        customErrorMessages.push({
          key: idx,
          message: em,
          description: origin,
        });
      }
    });
    return customErrorMessages;
  }

  @Watch("firstMonth")
  protected getFirstMonth(newVal: string, oldVal: string): void {
    newVal = moment(newVal).startOf("month").format("YYYY-MM-DD");
    oldVal = moment(newVal).add(1, "M").format("YYYY-MM-DD");
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
