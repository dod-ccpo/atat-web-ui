<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        :close-on-content-click="true"
        :nudge-top="45"
        :top="true"
        min-width="auto"
        origin="top"
      >
        <template v-slot:activator="{ on, attrs }">
          <label
            :id="id + '_text_field_label'"
            class="form-field-label my-1"
            :for="id + '_text_field'"
          >
            {{ label }}
          </label>
          <div class="d-flex align-start width-70">
            <v-text-field
              outlined
              dense
              :success="isFieldValid"
              :error="isFieldValid"
              :height="42"
              v-model="dateRange[0]"
              v-bind="attrs"
              v-on="on"
              placeholder="YYYY-DD-MM"
              :value="dateRange[0]"
            ></v-text-field>
            <v-btn icon :ripple="false" class="ml-2">
              <v-icon v-bind="attrs" v-on="on" class="icon-32 black--text"
                >calendar_today</v-icon
              >
            </v-btn>
          </div>
        </template>
        <div class="two-date-pickers">
          <div class="h4 px-4 pt-7 pb-5">{{ title }}</div>
          <hr />
          <v-date-picker
            ref="firstMonth"
            :min="minDate"
            :max="maxDate"
            v-model="getVModel"
            @input="menu = false"
            range
            no-title
            id="firstMonthDatePicker"
            scrollable
            :reactive="true"
            :picker-date.sync="firstMonth"
          />
          <!-- range -->
          <!-- <div class="separator mt-14"></div> -->
          <!-- range="isDateRangeValid" -->
          <v-date-picker
            ref="secondMonth"
            :min="minDate"
            :max="maxDate"
            :show-current="false"
            v-model="getVModel"
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

  get getVModel(): any {
    return this.isDateRangeValid ? this._dateRange : this._date;
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
