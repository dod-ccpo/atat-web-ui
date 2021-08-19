<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        :close-on-content-click="true"
        :nudge-right="40"
        transition="scale-transition"
        class="two-date-pickers"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <label
            :id="id + '_text_field_label'"
            class="form-field-label font-weight-bold my-1"
            :for="id + '_text_field'"
          >
            {{ label }}
            <span v-show="optional">Optional</span>
          </label>
          <v-text-field
            outlined
            dense
            append-outer-icon="calendar_today"
            :success="isFieldValid"
            :error="isFieldValid"
            :height="42"
            v-model="_date"
            readonly
            v-bind="attrs"
            v-on="on"
            :value="getDate"
          />
        </template>
        <v-date-picker
          ref="firstMonth"
          :min="minDate"
          :max="maxDate"
          v-model="_date"
          picker-date.sync="_date"
          @input="menu = false"
          no-title
          scrollable
          :reactive="true"
          :picker-date.sync="firstMonth"
        />
        <v-date-picker
          ref="secondMonth"
          :min="minDate"
          :max="maxDate"
          :show-current="false"
          v-model="_date"
          @input="menu = false"
          no-title
          :reactive="true"
          scrollable
          :picker-date.sync="secondMonth"
        />
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

  private menu = false;
  private minDate = "2020-09-01";
  private maxDate = "2022-10-31";

  private firstMonth = moment(new Date()).format("YYYY-MM-DD");
  private secondMonth = moment(this.firstMonth)
    .add(1, "M")
    .format("YYYY-MM-DD");
  private isFieldValid = false;

  get getDate(): string {
    return this._date;
  }

  private firstMonthComp: any = this.$refs["firstMonth"];
  private secondMonthComp: any = this.$refs["secondMonth"];

  @Watch("firstMonth")
  protected getFirstMonth(newVal: string, oldVal: string): void {
    newVal = newVal.length === 7 ? newVal + "-01" : newVal;
    oldVal = oldVal.length === 7 ? oldVal + "-01" : oldVal;

    console.log("FirstMonth> new Val" + newVal);
    console.log("FirstMonth> old Val" + oldVal);

    this.firstMonth = moment(newVal).format("YYYY-MM-DD");
    if (newVal !== oldVal) {
      this.secondMonth = moment(oldVal).format("YYYY-MM-DD");
    }
    console.log(this.firstMonth);
    console.log(this.secondMonth);
  }

  // @Watch("secondMonth")
  //   protected getSecondMonth (newVal: string, oldVal: string): void {
  //     newVal = newVal.length === 7 ? newVal + "-01" : newVal;
  //     oldVal = oldVal.length === 7 ? oldVal + "-01" : oldVal;

  //     console.log("secondMonth> new Val" + newVal );
  //     console.log("SecondMonth> old Val" + oldVal );

  //       this.secondMonth = moment(newVal).format("YYYY-MM-DD");
  //     if (oldVal !== this.secondMonth){
  //       this.firstMonth = moment(oldVal).format("YYYY-MM-DD");
  //     }
  //     console.log(this.firstMonth);
  //     console.log(this.secondMonth);
  //   }

  // @Watch("secondMonth")
  // protected getSecondMonth (newVal: string, oldVal: string): void {
  //   newVal = newVal.length === 7 ? newVal + "-01" : newVal;
  //   oldVal = oldVal.length === 7 ? oldVal + "-01" : oldVal;
  //   console.log("secondMOnth" + newVal + ":" + oldVal);
  //   console.log(this.firstMonth);
  //   debugger;
  //   if (moment().month(this.secondMonth).isSame(moment().month(oldVal))){
  //     this.firstMonth = moment(oldVal).format("YYYY-MM-DD");
  //   }
  //   // firstMonthComp.$props["picker-date"] = this.firstMonth;
  // }

  // @Watch("selectedDate")
  // protected(newVal: string, oldVal: string): void {
  //   newVal = newVal.length === 7 ? newVal + "-01" : newVal;
  //   oldVal = oldVal.length === 7 ? oldVal + "-01" : oldVal;

  //   let firstMonthComp: any = this.$refs["firstMonth"];
  //   let secondMonthComp: any = this.$refs["secondMonth"];

  //   if (newVal < oldVal) {
  //     this.firstMonth = moment(newVal).format("YYYY-MM-DD");
  //     this.secondMonth = moment(oldVal).format("YYYY-MM-DD");

  //     // this.selectedDate = moment(new Date()).format("YYYY-MM-DD");
  //   } else if (newVal > oldVal) {
  //     this.firstMonth = moment(oldVal).format("YYYY-MM-DD");
  //     this.secondMonth = moment(newVal).format("YYYY-MM-DD");

  //   }
  //   firstMonthComp.$props["picker-date"] = this.firstMonth;
  //   secondMonthComp.$props["picker-date"] = this.secondMonth;

  //   console.log(this.firstMonth);
  //   console.log(this.secondMonth);
  //   // debugger;
  //   console.log(firstMonthComp);
  //   console.log(secondMonthComp);
  // }

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

<style scoped></style>
