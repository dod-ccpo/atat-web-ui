<template>
  <v-row>
    <!-- :position-x="menuCoordinates.x"
        :position-y="menuCoordinates.y" -->
    <v-col>
      <v-menu
        v-model="menu"
        id="CLIN-datepicker-menu"
        attach="#clin-datepicker-text-boxes"
        origin="top left"
        :nudge-left="-10"
        :nudge-top="387"
        absolute
        :close-on-click="false"
        :close-on-content-click="false"
        :value="menu"
      >
        <div class="two-date-pickers pa-6 height-100">
          <div class="width-100 h4 pb-7">
            {{ title }}
            <hr />
          </div>
          <div class="d-flex align-center justify-space-around">
            <div class="width-50">
              <v-date-picker
                ref="firstMonth"
                :min="min"
                :max="max"
                v-model="_dateRange"
                :show-current="false"
                class="mr-5 mt-4"
                range
                no-title
                id="firstMonthDatePicker"
                scrollable
                tabindex="0"
                @click:date="getSelectedDate"
                :picker-date.sync="firstMonth"
                transition="false"
              />
            </div>
            <div class="width-50">
              <v-date-picker
                ref="secondMonth"
                :min="min"
                :max="max"
                :show-current="false"
                v-model="_dateRange"
                class="ml-5 mt-4"
                range
                tabindex="0"
                no-title
                @click:date="getSelectedDate"
                id="secondMonthDatePicker"
                scrollable
                :picker-date.sync="secondMonth"
                transition="false"
              />
            </div>
          </div>
        </div>
      </v-menu>
      <div
        class="d-flex align-start width-100 datepicker-text-box"
        id="clin-datepicker-text-boxes"
      >
        <!-- todo give id a more meaningful name -->
        <v-text-field
          :ref="id"
          outlined
          dense
          :success="isFieldValid"
          :error="isFieldValid"
          :height="42"
          v-bind="attrs"
          v-on="on"
          hide-details
          placeholder="YYYY-DD-MM"
          v-model="_date"
          :value="_date"
          :rules="_rules"
          @focus="focusMenu"
          @mouseup="menu === true"
          @blur="blurTextField"
          @update:error="getErrorMessages"
          @update:return-value="menu === true"
        ></v-text-field>
        <v-btn icon :ripple="false" class="ml-2">
          <v-icon v-bind="attrs" v-on="on" class="icon-32 black--text"
            >calendar_today</v-icon
          >
        </v-btn>

        <v-text-field
          :ref="id"
          outlined
          dense
          :success="isFieldValid"
          :error="isFieldValid"
          :height="42"
          v-bind="attrs"
          v-on="on"
          hide-details
          placeholder="YYYY-DD-MM"
          v-model="_date"
          :value="_date"
          :rules="_rules"
          @focus="menu === true"
          @mouseup="menu === true"
          @blur="blurTextField"
          @update:error="getErrorMessages"
          @update:return-value="menu === true"
          @input="menu === true"
        ></v-text-field>
        <v-btn icon :ripple="false" class="ml-2">
          <v-icon v-bind="attrs" v-on="on" class="icon-32 black--text"
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
  @PropSync("daterange") private _dateRange!: string[];
  @Prop({ default: "title" }) private title!: string;
  @Prop() private nudgeleft!: string;
  @PropSync("textboxvalue") private _textBoxValue!: string;
  @PropSync("rules") private _rules!: any[];
  @PropSync("errormessages") private _errorMessages!: (
    | CustomErrorMessage
    | undefined
  )[];
  @Prop({ default: "2020-10-01" }) private min!: string;
  @Prop({ default: "2021-10-01" }) private max!: string;

  private menu = false;
  private dateRange: string[] = ["", ""];

  private firstMonth = moment(new Date()).format("YYYY-MM-DD");
  private secondMonth = moment(this.firstMonth)
    .add(1, "M")
    .format("YYYY-MM-DD");
  private isFieldValid = false;

  private focusMenu(event: Event): boolean {
    this.menu = true;
    // const clickedTextBox = event.currentTarget as HTMLInputElement;
    // this.menuCoordinates.x = clickedTextBox.offsetTop;
    // this.menuCoordinates.y = clickedTextBox.offsetLeft;
    return this.menu;
  }

  get getDate(): string {
    return this._date;
  }

  private isDatePickerAdvancing = false;
  private menuCoordinates = {
    x: 0,
    y: 0,
  };

  get isDateRangeValid(): boolean {
    return this.dateRange.every((d) => d !== "");
  }

  public getSelectedDate(selectedDate: string): void {
    this._date = selectedDate;
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
    this.menu === true;
    // setTimeout(() => (this.menu = false), 2000);
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
}
</script>
