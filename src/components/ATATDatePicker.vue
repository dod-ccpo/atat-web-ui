
<template>
   <div :id="id + 'DatePickerContainer'" class="atat-date-picker">

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
              ref="atat-date-picker"
              :id="id + 'DatePickerTextField'"
              :height="42"
               :placeholder="placeHolder"
              class="text-primary input-max-width d-flex align-center"
              :hide-details="true"
              v-model="dateFormatted"
              
              outlined
              :style="'width: ' + width + 'px'"
              dense
              v-bind="attrs"
              @blur="onBlur"
              v-on="on"
            >
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
                class="icon-28 text-base-darkest">
                calendar_today
              </v-icon>
            </v-btn>
          </template></v-text-field>
          </template>
          <v-date-picker
            :id="id + 'DatePicker'"
            v-model="date"
            :show-adjacent-months="showAdjacentMonths"
            no-title
            @click:date="updateDateProperty"
            @input="menu = false"
            scrollable
          ></v-date-picker>
        </v-menu>
   </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";
import { format, isValid, parse, parseISO } from "date-fns";
import ATATTooltip from "@/components/ATATTooltip.vue";

@Component({
  components: {
    ATATTooltip,
  },
})
export default class ATATDatePicker extends Vue {
  private date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
  private dateFormatted = this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10));
  private menu = false;
  private vuetifyDatePickerFormat = "yyyy-MM-dd";

  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  @Prop({ default: "" }) private width!: string;
  
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  

  get computedDateFormatted (): string {
    return this.formatDate(this.date)
  }

    // watch: {
  @Watch("date")
  protected formatDateWatcher(newVal: string): void {
    this.dateFormatted = this.formatDate(this.date)
  }
    

  
  private formatDate (date: string): string {
    // if (!date) return ''
    // const [year, month, day] = date.split('-')
    // return `${month}/${day}/${year}`
    return format(new Date( isValid(new Date(date)) ? date : ""), "MM/dd/yyyy");
  }

  private parseDate (date: string): string {
    return format(new Date( isValid(new Date(date)) ? date : ""), this.vuetifyDatePickerFormat);
  }

   //functions
  /**
   * toggle menus based on value of this.menu
   */
  private toggleMenu(): void {
    this.menu = !this.menu;
  }

   get getMenutop(): string{
    return this.label !== "" ? "80" : "40";
  }

  private onBlur(){
    console.log(this.dateFormatted);
    console.log(isValid(new Date(this.dateFormatted)));
    this.date = isValid(new Date(this.dateFormatted)) ? this.parseDate(this.dateFormatted) : this.parseDate(format(new Date(), "MM/dd/yyyy"));
    this.updateDateProperty();
    
  }

  private updateDateProperty(): void {
    if (isValid(this.dateFormatted)){
      this.$emit("update:date", this.dateFormatted);
    }
  }

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
      }).mask(document.getElementById(tbId) as HTMLElement);
    });
  }

    //lifecycle hooks
  private mounted(): void {
    this.addMasks();
  }
    
  }
</script>