<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        :close-on-content-click="true"
        :position-x="0"
        :position-y="0"
        origin="top left"
        :nudge-left="nudgeleft"
        :nudge-top="40"
        top
      >
        <!-- 11 -->
        <template v-slot:activator="{ on, attrs }">
          <div class="d-flex align-start width-70 datepicker-text-box">
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
              :value="_textBoxValue"
              :rules="_rules"
              @blur="getErrorMessages"
              @update:error="getErrorMessages"
            ></v-text-field>
            <v-btn icon :ripple="false" class="ml-2">
              <v-icon v-bind="attrs" v-on="on" class="icon-32 black--text"
                >calendar_today</v-icon
              >
            </v-btn>
          </div>
        </template>
        <div class="two-date-pickers pa-6">
          <div class="h4 pb-7">{{ title }}</div>
          <hr />
          <v-date-picker
            ref="firstMonth"
            :min="minDate"
            :max="maxDate"
            v-model="_dateRange"
            @input="menu = false"
            class="mr-5 mt-4"
            range
            no-title
            id="firstMonthDatePicker"
            scrollable
            :reactive="true"
            :picker-date.sync="firstMonth"
          />
          <v-date-picker
            ref="secondMonth"
            :min="minDate"
            :max="maxDate"
            :show-current="false"
            v-model="_dateRange"
            class="ml-5 mt-4"
            range
            @input="menu = false"
            no-title
            :reactive="true"
            id="secondMonthDatePicker"
            scrollable
            :picker-date.sync="secondMonth"
          />
        </div>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

@Component({})
export default class ATATDatePicker extends Vue {
  $refs!: {
    startDate: Vue & { errorBucket: () => string[] };
    endDate: Vue & { errorBucket: () => string[] };
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
  @PropSync("errormessages") private _errorMessages!: string[];

  private menu = false;
  private minDate = "2020-10-01";
  private maxDate = "2021-10-02";
  private dateRange: string[] = ["2021-05-27", "2021-08-01"];

  private firstMonth = moment(new Date()).format("YYYY-MM-DD");
  private secondMonth = moment(this.firstMonth)
    .add(1, "M")
    .format("YYYY-MM-DD");
  private isFieldValid = false;

  get getDate(): string {
    return this._date;
  }

  private isDatePickerAdvancing = false;

  get isDateRangeValid(): boolean {
    return this.dateRange.every((d) => d !== "");
  }

  public getErrorMessages(): void {
    let _messages = [];
    if (this.$refs.startDate) {
      const startDate: any = this.$refs.startDate.errorBucket;
      messages = startDate;
      // this._errorMessages = startDate.map((em: string) => {
      //   // em is not in this._errorMessages
      //   return this._errorMessages.indexOf(em) === -1;
      // });
    }
    if (this.$refs.endDate) {
      const endDate: any = this.$refs.endDate.errorBucket;
      messages = endDate;
      this._errorMessages = endDate;
    }
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
