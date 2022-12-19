
<template>
  <div :id="id + 'DatePickerContainer'" class="atat-date-picker">
    <v-menu
      ref="atatDatePickerMenu"
      v-model="menu"
      :close-on-content-click="false"
      min-width="auto"
      nudge-bottom="getMenuTop"
      :attach="'#' + id + 'DatePickerContainer'"
      absolute
      :nudge-top="0"
      :nudge-left="0"
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex align-center mb-2" v-if="label">
          <label
            :id="id + 'DatePickerLabel'"
            class="form-field-label mr-1"
            :for="id + 'DatePickerTextField'"
          >
            {{ label }}
            <span v-if="optional" class="optional"> Optional </span>
          </label>
          <ATATTooltip
            :tooltipText="tooltipText"
            :tooltipTitle="tooltipTitle"
            :id="id"
            :label="label"
          />
        </div>
        <v-text-field
          ref="atatDatePicker"
          :id="id + 'DatePickerTextField'"
          :height="42"
          :placeholder="placeHolder"
          class="text-primary _input-max-width d-flex align-center"
          :hide-details="true"
          outlined
          @input="onInput"
          v-model="dateFormatted"
          :style="'width: ' + width + 'px'"
          dense
          v-bind="attrs"
          v-on="on"
          :rules="rules"
          @blur="onBlur($event)"
          :validate-on-blur="validateOnBlur"
          autocomplete="off"
        >
          <template slot="append-outer">
            <v-btn
              icon
              tabindex="-1"
              :id="id + 'DatePickerButton'"
              aria-label="Open calendar to select date"
              @click="toggleMenu"
              class="pa-0 icon-28 ml-2"
            >
              <v-icon
                :id="id + 'DatePickerButtonIcon'"
                class="icon-28 text-base-darkest"
              >
                calendar_today
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        :id="id + 'DatePicker'"
        v-model="date"
        :show-adjacent-months="showAdjacentMonths"
        no-title
        :active-picker.sync="activePicker"
        type="date"
        :min="min"
        :max="max"
        @click:date="datePickerClicked"
        scrollable
      ></v-date-picker>
    </v-menu>
    <ATATErrorValidation v-if="menu === false" :errorMessages="errorMessages" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";
import { add, format, isValid } from "date-fns";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATTooltip,
    ATATErrorValidation,
  },
})
export default class ATATDatePicker extends Vue {
  // refs
  $refs!: {
    atatDatePicker: Vue & { 
      errorBucket: string[]; 
      errorCount: number; 
      validate: () => boolean;
    };
    atatDatePickerMenu: Vue & {
      save: (selectedDate: string) => Record<string, never>;
    };
  };

  /**
   * DATA
   */
  private date = "";
  private dateFormatted = "";
  private menu = false;
  private errorMessages: string[] = [];
  private activePicker = "";

  // Flash of red border on date text field when validateOnBlur is true and user
  // clicks a date in the picker to be addressed in future milestone.
  // Leave commented out code for validateOnBlur in place for now.
  private validateOnBlur = true;

  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: "" }) private value!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: false }) private showAdjacentMonths!: boolean;
  @Prop({ default: "220" }) private width!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: format(new Date(), "yyyy-MM-dd") }) private min!: Date;
  @Prop({ default: format(add(new Date(), { years: 1 }), "yyyy-MM-dd") })
  private max!: Date;
  @Prop({ default: () => [] }) private rules!: Array<unknown>;
  @Prop({ default: false }) private isRequired!: boolean;

  /**
   * WATCHERS
   */
  @Watch("date")
  protected formatDateWatcher(): void {
    this.dateFormatted = this.reformatDate(this.date);
  }

  /**
   * restores standar calendar view when popup menu is displayed
   * if previous view was month or year view
   */

  @Watch("menu")
  protected showStandardCalendar(val: boolean): void {
    if (val) {
      setTimeout(() => (this.activePicker = "DATE"));
    }
  }

  /**
   * EVENTS
   */

  /**
   * onBlur event of the textbox.
   *
   * if textbox value is a valid date
   * [x] reformat textbox value date for datepicker
   * [x] update date value property
   * [x] remove any errors
   */

  private onBlur(): void {
    if (isValid(new Date(this.dateFormatted))) {
      this.date = this.reformatDate(this.dateFormatted);
      this.updateDateValueProperty();
      this.removeErrors();
    }
    Vue.nextTick(() => {
      this.setErrorMessage();
    });
  }

  /**
   * sets validateOnBlur to true while user is typing
   * so as validation occurs only onBlur
   *
   * if textbox is cleared manually, resets necessary
   * date attribs
   */
  private onInput(date: string): void {
    // this.validateOnBlur = true;
    if (date === "") {
      this.dateFormatted = "";
      this.date = "";
      this.menu = false;
    }
  }

  /**
   * @param selectedDate (string) - selected Datepicker date
   */
  private datePickerClicked(selectedDate: string): void {
    //must be set to false to prevent unnecessary validation
    // this.validateOnBlur = false;

    this.removeErrors();

    // saves selectedDate to necessary atatDatePickerMenu attribs
    this.$refs.atatDatePickerMenu.save(selectedDate);

    Vue.nextTick(() => {
      this.updateDateValueProperty();
    });
  }

  /**
   * emits 'update:date' value when dp is clicked or
   * textbox value is changed
   */
  private updateDateValueProperty(): void {
    if (isValid(new Date(this.dateFormatted))) {
      this.$emit("update:value", this.dateFormatted);
    }
  }

  /**
   * utility function that removes errors from
   * Vuetify's errorBucket & this.errorMessages
   */
  private removeErrors(): void {
    this.$refs.atatDatePicker.errorBucket = [];
    this.errorMessages = [];
  }

  /**
   * FUNCTIONS
   */

  /**
   * mask input date text boxes with MM/DD/YYYY, min/max
   */
  private addMasks(): void {
    [this.id + "DatePickerTextField"].forEach((tbId) => {
      Inputmask({
        alias: "datetime",
        inputFormat: "mm/dd/yyyy",
        placeholder: "MM/DD/YYYY",
        outputFormat: "MM/DD/YYYY",
        nullable: true,
        min: format(add(new Date(this.min), { days: 1 }), "MM/dd/yyyy"),
        max: format(add(new Date(this.max), { days: 1 }), "MM/dd/yyyy"),
      }).mask(document.getElementById(tbId) as HTMLElement);
    });
  }

  /**
   * @date (string)
   * returns formatted date as yyyy-MM-dd if date isValid
   */
  private reformatDate(date: string): string {
    let formattedDate = "";
    if (isValid(new Date(date))) {
      let month = "",
        day = "",
        year = "";
      if (date.indexOf("-") > 0) {
        [year, month, day] = date.split("-");
        formattedDate = `${month}/${day}/${year}`;
      } else if (date.indexOf("/") > 0) {
        [month, day, year] = date.split("/");
        formattedDate = `${year}-${month}-${day}`;
      }
    }
    return formattedDate;
  }

  /**
   * toggle menus based on value of this.menu
   */
  private toggleMenu(): void {
    this.menu = !this.menu;
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    if(!this.$refs.atatDatePicker.validate())
      this.setErrorMessage();
  }

  /**
   * returns menutop based on if label
   */
  get getMenutop(): string {
    return this.label !== "" ? "80" : "40";
  }

  private async setErrorMessage(): Promise<void> {
    this.errorMessages = await this.$refs.atatDatePicker.errorBucket;
  }

  /**
   * LIFECYCLE HOOKS
   */
  private mounted(): void {
    if (this.value && this.value.indexOf("-") > -1) {
      this.date = this.value;
    } else if (this.value && this.value.indexOf("/") > -1) {
      this.date = this.reformatDate(this.value);
    }

    this.formatDateWatcher();

    this.$nextTick(() => {
      this.addMasks();
    });
    this.removeErrors();
  }

}
</script>