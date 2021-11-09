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
        <div
          v-if="_errorMessages.length > 0"
          role="alert"
          class="mt-0 width-100"
        >
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
              placeholder="MM/DD/YYYY"
              v-model="startDate"
              v-mask="dateFormatMMDDYY"
              :value="formatStartDateMMDDYYYY"
              :rules="_startDateRules"
              hide-details
              @focus="setFocus"
              @blur="blurTextField"
              validate-on-blur
              clearable
              @click:clear="clearTextBox"
              :class="[
                isStartTextBoxFocused ? 'focused' : '',
                'datepicker-text-box start-date',
              ]"
            ></v-text-field>
            <v-btn
              icon
              :ripple="false"
              :id="getId('start-date-text-box-button')"
              aria-label="Open calendar to select Start Date"
            >
              <v-icon class="black--text date-picker-icon start-date-icon"
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
              placeholder="MM/DD/YYYY"
              v-model="endDate"
              v-mask="dateFormatMMDDYY"
              :value="formatEndDateMMDDYYYY"
              @focus="setFocus"
              :rules="_endDateRules"
              hide-details
              @blur="blurTextField"
              clearable
              @click:clear="clearTextBox"
              validate-on-blur
              :class="[
                isEndTextBoxFocused ? 'focused' : '',
                'datepicker-text-box end-date',
              ]"
            ></v-text-field>
            <v-btn
              icon
              :ripple="false"
              :id="getId('end-date-text-box-button')"
              aria-label="Open calendar to select End Date"
            >
              <v-icon class="black--text date-picker-icon end-date-icon"
                >calendar_today</v-icon
              >
            </v-btn>
          </div>
        </div>
        <div class="width-100 d-flex justify-start mt-2 text--base">
          <div class="">
            <span>Month, Day, Year (e.g. MM/DD/YYYY)</span>
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
  private secondMonth = moment(this.firstMonth)
    .add(1, "M")
    .format("YYYY-MM-DD");
  private isFieldValid = false;
  private isStartTextBoxFocused = false;
  private isEndTextBoxFocused = false;
  private menuTop = 375;
  private calendarClicked = false;
  private startDateFormatted = this.formatDate(this.startDate);
  private endDateFormatted = this.formatDate(this.endDate);
  private isDatePickerAdvancing = false;

  @Watch("startDate")
  protected processStartDate(newVal: string, oldVal: string): void {
    // prevents startDate === endDate
    if (!newVal) {
      this.startDate = "";
    } else if (this.formatDate(newVal) === this.formatDate(this.endDate)) {
      this.startDate = oldVal;
    }
  }

  @Watch("endDate")
  protected processEndDate(newVal: string, oldVal: string): void {
    // prevents endDate === startDate
    if (!newVal) {
      this.endDate = "";
    } else if (this.formatDate(newVal) === this.formatDate(this.startDate)) {
      this.endDate = oldVal;
    }
  }

  //todo use this often
  private formatDate(dateToBeFormatted: string): string {
    const formattedDate = moment(dateToBeFormatted).format("YYYY-MM-DD");
    return formattedDate.toLowerCase() !== "invalid date" ? formattedDate : "";
  }

  /**
   * returns Start Date Textbox value formatted as MM/DD/YYYY
   */
  get formatStartDateMMDDYYYY(): string {
    if (this.isDateValid(this.startDate)) {
      console.log(moment(this.startDate).format("MM/DD/YYYY"));
      this.startDate = moment(this.startDate).format("MM/DD/YYYY");
      return this.startDate;
    }
    return "";
  }

  /**
   * returns End Date Textbox value formatted as MM/DD/YYYY
   */
  get formatEndDateMMDDYYYY(): string {
    if (this.isDateValid(this.endDate)) {
      this.endDate = moment(this.endDate).format("MM/DD/YYYY");
      return this.endDate;
    }
    return "";
  }

  /**
   * setFocus event on both textboxes
   * 1 - toggles this.isStartTextBoxFocused && this.isEndTextBoxFocused
   * 2 - sets title
   */
  private setFocus(event: Event): void {
    const textBox = event.target as HTMLElement;
    const isStart = textBox.closest(".start-date") !== null;
    this.isStartTextBoxFocused = isStart;
    this.isEndTextBoxFocused = !isStart;
    this._isTextBoxFocused = true;
    this._title = "What is the PoP " + (isStart ? "Start" : "End") + " Date?";
    this.menu = true;
  }

  /**
   * creates id with custom string && this.id
   */
  private getId(prependString: string): string {
    return prependString + "-" + this.id;
  }

  /**
   * textboxes date mask
   */
  public dateFormatMMDDYY = [
    /[01]?/,
    /[0-9]/,
    "/",
    /[0-3]?/,
    /[0-9]/,
    "/",
    /[2]/,
    /[0]/,
    /[1-3]/,
    /[0-9]/,
  ];

  /**
   * @param dateString - date string
   * validates date in 'YYYY-MM-DD' format (Vuetify calculations)
   * or MM/DD/YYYY format (display)
   *
   * also, dateString is validated with moment
   */
  public isDateValid(dateString: string): boolean {
    return (
      (/((0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/[12]\d{3})$/.test(
        dateString
      ) ||
        /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
          dateString
        )) &&
      moment(dateString).isValid()
    );
  }

  /**
   * @param val: value clicked in datepicker
   * determines allowed & disabled dates for each datepicker
   * based upon which textbox is focused
   */
  public allowedDates(val: string): boolean {
    if (this.isEndTextBoxFocused && this.isDateValid(this.startDate)) {
      return moment(val).isSameOrAfter(moment(this.startDate));
    } else if (this.isStartTextBoxFocused && this.isDateValid(this.endDate)) {
      return moment(val).isSameOrBefore(moment(this.endDate));
    }
    return true;
  }

  /**
   * 1 - clears textbox when textbox 'x' button is clicked
   * 2 - re-setDatePickerHoverButton after textbox is cleared
   */
  public clearTextBox(event: PointerEvent): void {
    const clearButtonClicked = event.target as HTMLButtonElement;
    const isStartDateClearButton = clearButtonClicked.closest(".start-date");
    if (isStartDateClearButton) {
      this.isStartTextBoxFocused = true;
      this.setStartDate("");
    } else {
      this.isEndTextBoxFocused = true;
      this.setEndDate("");
    }
    this.setDatePickerHoverButtons();
  }

  /**
   * readjusts top of menu as user navigates datepickers backwards/forwards
   */
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

  /**
   * adjusts menu based on number of calendar table rows
   */
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

  /**
   * removes focus from both textboxes
   */
  private removeTextBoxFocus(): void {
    this.isStartTextBoxFocused = false;
    this.isEndTextBoxFocused = false;
  }

  /**
   * 1 - adds Event Listener for control
   * 2 - sets first and secondMonth
   */
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

  /** page click event listener */
  private async datepickerControlClicked(event: Event): Promise<void> {
    // accommodates for all items in div #clin-datepicker-text-boxes" being clicked
    // menu to remain open if any components within this component are clicked and
    // closed if user clicks elsewhere
    const element = event.target as HTMLElement;
    //if control (textboxes, icons, calendars, menu) was clicked
    this.menu =
      element.closest("#" + this.getId("clin-datepicker-text-boxes")) !== null;

    // if icon is clicked
    const isIconClicked = element.classList.contains("date-picker-icon");

    if (this.menu) {
      //menu & calendar are opened
      this.calendarClicked = this.menu;
      this.setStartDate(this.startDate);
      this.setEndDate(this.endDate);

      //determine month to display in calendars
      const firstMonthToDisplay =
        this.firstMonth ===
        moment(this.startDate).startOf("month").format("YYYY-MM-DD")
          ? this.startDate
          : this.firstMonth;

      //set style for start/end datepicker buttons
      this.setStyleForStartDateAndEndDateButtons(
        moment(firstMonthToDisplay).startOf("month").format("YYYY-MM-DD"),
        moment(firstMonthToDisplay)
          .add(1, "M")
          .endOf("month")
          .format("YYYY-MM-DD")
      );

      //if start date or end date icon was clicked
      if (isIconClicked) {
        const isStartIcon = element.classList.contains("start-date-icon");
        this.isStartTextBoxFocused = isStartIcon;
        this.isEndTextBoxFocused = !isStartIcon;
      }

      // if calendars were clicked
      const isCalendarClicked =
        element.closest(".v-date-picker-table") !== null;
      if (isCalendarClicked) {
        // if both textboxes have valid dates, close menu
        const button = element.parentElement as HTMLButtonElement;
        this.styleDatePickerButton(button, this.isStartTextBoxFocused);
        if (!this.isDateRangeValid) {
          this.toggleTextBoxes(this.isStartTextBoxFocused);
        } else {
          this.removeTextBoxFocus();
        }
        this.menu = !this.isDateRangeValid;
      }
    } else {
      //menu and calendar are closed
      this.removeTextBoxFocus();
      this._isTextBoxFocused = false;

      // reset firstmonth so calendar will open to the start date
      this.firstMonth = this.startDate;
    }

    Vue.nextTick(() => {
      //todo review calendarclicked
      this.calendarClicked = false;
      this.setDatePickerHoverButtons();
      this.getErrorMessages();
    });
  }

  /**
   * toggles textboxes as user selects start/end dates on calendar
   */
  public toggleTextBoxes(isStart: boolean): void {
    const textBoxId = isStart ? "end-date-text-box" : "start-date-text-box";
    (
      document.querySelector("#" + this.getId(textBoxId)) as HTMLInputElement
    ).click();
  }

  /**
   * toggles classes on each datepicker as necessary to
   * determine hover styles
   */
  private setDatePickerHoverButtons(): void {
    if (this.menu) {
      // restores datepicker table to default classes
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

  /**
   * sets datapicker start/end selected button styles
   */
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

  /**
   * event listener for text box blur
   */
  private blurTextField(): void {
    this._isDatePickerBlurred = true;
    const dateToBeSet = this.isStartTextBoxFocused
      ? this.startDate
      : this.endDate;
    this.setDate(dateToBeSet);
    Vue.nextTick(() => {
      this.getErrorMessages();
      this._isDatePickerBlurred = this._errorMessages.length > 0;
    });
  }

  /**
   * @selectedDate: date string
   * sets start/end date as necessary
   */
  public setDate(selectedDate: string): void {
    if (this.isStartTextBoxFocused) {
      this.setStartDate(selectedDate);
    } else {
      this.setEndDate(selectedDate);
    }
  }

  /**
   * @selectedDate: date string
   * 1 - sets start date
   * 2 - sets dataRange
   */
  public async setStartDate(selectedDate: string): Promise<void> {
    this.startDate = selectedDate;
    this.setDateRange;
  }

  /**
   * @selectedDate: date string
   * 1 - sets end date
   * 2 - sets dataRange
   */
  public async setEndDate(selectedDate: string): Promise<void> {
    this.endDate = selectedDate;
    this.setDateRange;
  }

/**
   * 1 - sets this.dateRange[0] && this.dateRange[1] as necessary
   * 2 - adjusts size of dateRange as necessary to accommodate the
   *     calendar's range selection
   */
  get setDateRange(): string[] {
    this.dateRange[0] = this.formatDate(this.startDate);
    this.dateRange[1] = this.formatDate(this.endDate);

    // remove dateRange[1] if === ""
    if (this.dateRange[1] === "") {
      this.dateRange.splice(1, 1);
    }
    // remove dateRange[1] if === ""
    if (this.dateRange[0] === "") {
      this.dateRange.splice(0, 1);
    }

    /***** final result ****************
     * if (startDate: 2021-08-01 && endDate: 2021-10-05){
     * this.dataRange = ['2021-08-01','2021-10-05']}
     *
     * if (startDate: 2021-08-01 && endDate: ""){
     * this.dataRange = ['2021-08-01']}
     *
     * if (startDate: "" && endDate: 2021-10-05){
     * this.dataRange = ['2021-10-05']}
     *
     * datepickers v-model is this.dataRange.  Combinations above allow for the
     * appropriate date(s) be highlighted on each datepicker calendar
     */
    return this.dateRange;
  }

  /**
   * returns if this.dateRange contains 2
   * legitimate dates
   */
  get isDateRangeValid(): boolean {
    return (
      this.dateRange.length === 2 &&
      this.dateRange.every((d) => this.isDateValid(d))
    );
  }

  /**
   * applies daterange when menu is opened
   */
  get getDateRange(): string[] {
    this.setDateRange;
    return this.dateRange;
  }

  set getDateRange(value: string[]) {
    this.dateRange = value;
  }

  /**
   * @firstDayLeftMonth: string - first day of left month in datepicker
   * @lastDayRightMonth: string - last day of right month in datepicker
   * 
   * add appropriate classnames to the startdate and enddate in the calendars
   */
  public setStyleForStartDateAndEndDateButtons(
    firstDayLeftMonth: string,
    lastDayRightMonth: string
  ): void {
    // setTimeout to display style for start/end buttons 
    // when user navigates calendars
    setTimeout(() => {
      const displayedDPs = document.getElementsByClassName(
        "two-date-pickers"
      )[0] as HTMLElement;
      if (displayedDPs) {
        const activeDatePickerButtons =
          displayedDPs.getElementsByClassName("v-btn--active");

        // if this.startDate is between the firstDayLeftMonth and lastDayRightMonth
        // then add correct class to the right calendar button
        const isStartDateDisplayed = moment(this.startDate).isBetween(
          firstDayLeftMonth,
          lastDayRightMonth,
          undefined,
          "[]"
        );
        if (isStartDateDisplayed) {
          activeDatePickerButtons[0].classList.add("date-picker-start-date");
        }

        // if this.endDate is between the firstDayLeftMonth and lastDayRightMonth
        // then add correct class to the right calendar button
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
    }, 500);
  }

  /*
   * combines the errors message of both textboxes controls
   * to a single array
   */
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

  /*
   * converts Vuetify error messages to ATAT custom error message
   */
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

  /**
   * sync'ed with left datepicker navigation button
   */
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

  /**
   * sync'ed with right datepicker navigation button
   */
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
}
</script>
