
<template>
  <div 
    :id="id + 'DatePickerContainer'" 
    class="atat-date-picker">
    <v-menu
      ref="date-picker-menu"
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
        <div class="d-flex align-center" v-if="label">
          <label
            :id="id + 'DatePickerLabel'"
            class="form-field-label mb-2 mr-2"
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
          class="text-primary input-max-width d-flex align-center"
          :hide-details="true"
          outlined
          v-model="dateFormatted"
          :style="'width: ' + width"
          dense
          v-bind="attrs"
          v-on="on"
          :rules="rules"
          validate-on-blur
          @blur = "onBlur"
          @update:error="setErrorMessage"
        >
        <!-- todo:  validate-on-blur -->
          <template slot="append-outer">
            <v-btn
              icon
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
        :min="min"
        :max="max"
        @click:date="datePickerClick"
        scrollable
      ></v-date-picker>
    </v-menu>
     <ATATErrorValidation :errorMessages="errorMessages" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";
import { add, format, isValid } from "date-fns";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

@Component({
  components: {
    ATATTooltip,
    ATATErrorValidation,
  },
})
export default class ATATDatePicker extends Vue {
  // refs
  $refs!: {
    atatDatePicker: Vue & { errorBucket: string[]; errorCount: number };
  };
/**
 * key in/tab off no error only red outlined
 * clicking date works
 */


  /**
   * DATA
   */
  private date = "";
  private dateFormatted = "";
  private menu = false;
  private errorMessages: string[] = [];

  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  @Prop({ default: "220px" }) private width!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: format(new Date(), "yyyy-MM-dd") }) private min!: Date;
  @Prop({ default: format(add(new Date(), { years: 1 }), "yyyy-MM-dd") })
  private max!: Date;
  @Prop({ default: [] }) private rules!: Array<unknown>;

  /**
   * WATCHERS
   */
  @Watch("date")
  protected formatDateWatcher(): void {
    this.dateFormatted = this.reformatDate(this.date);
  }

  /**
   * EVENTS
   */

  private onBlur() : void {
    
    if (isValid(new Date(this.dateFormatted))){
       this.date = this.reformatDate(this.dateFormatted)
       this.updateDateProperty();
    }
    Vue.nextTick(()=>{
      this.setErrorMessage();
    }) 
  }

  /**
   * emits 'update:date' value when dp is clicked or
   * textbox value is changed
   */
  private updateDateProperty(): void {
    if (isValid(this.dateFormatted)) {
      this.$emit("update:date", this.dateFormatted);
    }
  }

  private datePickerClick(selectedDate: string){
    this.dateFormatted = this.reformatDate(selectedDate);
    this.date = this.reformatDate(selectedDate);
    this.updateDateProperty();
    Vue.nextTick(()=>{
      this.setErrorMessage();
    })
    
   
  }

  /**
   * FUNCTIONS
   */

  /**
   * mask input date text boxes with MM/DD/YYYY
   */
  private addMasks(): void {
    [this.id + "DatePickerTextField"].forEach((tbId) => {
      Inputmask({
        alias: "datetime",
        inputFormat: "mm/dd/yyyy",
        placeholder: "MM/DD/YYYY",
        outputFormat: "MM/DD/YYYY",
        nullable: true,
        min: format(new Date(this.min), "MM/dd/yyyy"),
        max: format(new Date(this.max), "MM/dd/yyyy"),
      }).mask(document.getElementById(tbId) as HTMLElement);
    });
    // todo add min and max
  }

  /**
   * @date (string)
   * returns formatted date as yyyy-MM-dd if date isValid
   */
  private reformatDate(date: string): string {
    let formattedDate = "";
    if (isValid(new Date(date))) {
      let month="", day="", year="";
      if (date.indexOf('-') > 0) {
        [year, month, day] = date.split("-");
        formattedDate = `${month}/${day}/${year}`;
      }else if (date.indexOf('/') > 0) {
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

  /**
   * returns menutop based on if label
   */
  get getMenutop(): string {
    return this.label !== "" ? "80" : "40";
  }

  private async setErrorMessage(): Promise<void> {
    this.errorMessages = await this.$refs.atatDatePicker.errorBucket;
    console.log(this.errorMessages)
  }

  /**
   * LIFECYCLE HOOKS
   */
  private mounted(): void {
    this.addMasks();
  }
}
</script>