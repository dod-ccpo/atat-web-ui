<template>
  <div :id="id + 'DatePickerContainer'" class="d-flex align-center">
    <v-menu
      ref="date-picker-menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      min-width="auto"
      :attach="'#' + id + 'DatePickerTextField'"
      :nudge-top="0"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          ref="atat-date-picker"
          :id="id + 'DatePickerTextField'"
          :height="42"
          :placeholder="placeHolder"
          class="text-primary input-max-width"
          :hide-details="true"
          v-model="getSelectedDate"
          outlined
          dense
          v-bind="attrs"
          v-on="on"
          @input="$emit('update:date', $event.target.value)"
          @focus="toggleMenu"
        ></v-text-field>
        <v-btn
          icon
          :id="id + 'DatePickerButton'"
          aria-label="Open calendar to select date"
          @click="toggleMenu"
        >
          <v-icon 
            :id="id + 'DatePickerButtonIcon'" 
            class="icon-28">
              calendar_today 
          </v-icon>
        </v-btn>
        <div id="datepickerSelector" />
      </template>
      <v-date-picker 
        :id="id + 'DatePicker'"
        v-model="selectedDate"
        @click:date="updateDateProperty"
        :show-adjacent-months="showAdjacentMonths"
        no-title 
        scrollable>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";
import { format, isValid } from 'date-fns';

@Component({})
export default class ATATDatePicker extends Vue {
  //props
  @Prop({ default: "" }) private id!: string;
  @PropSync("date", { default: format(new Date(new Date().valueOf() + new Date().getTimezoneOffset() * 60000), "yyyy-MM-dd")}) private _date!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  
  // data
  private menu = false;
  private selectedDate = "";
  private dateFormat = "MM/dd/yyyy";

  //getters
  set getSelectedDate(value: string){
    this.selectedDate = isValid(value) ? format(new Date(value), this.dateFormat) : "";
  }

  get getSelectedDate():string {
    let selectedDate = new Date(this.selectedDate);
    const dt =  isValid(selectedDate) 
      ? new Date(selectedDate.valueOf() + selectedDate.getTimezoneOffset() * 60000)
      : new Date();
    return this.formatDate(dt);
  };

  //events
  private updateDateProperty(): void{
    this.$emit('update:date', this.formatDate(new Date(this.selectedDate)));
  }

  //functions
  /**
   * toggle menus based on value of this.menu
   */
  private toggleMenu(): void {
    this.menu = !this.menu;
  }
  
  private formatDate(date: Date): string{
    return format(new Date(date.valueOf() + date.getTimezoneOffset() * 60000), this.dateFormat);
  }

  /**
   * mask input date text boxes with MM/DD/YYYY
   */
  private addMasks(): void {
    [
      this.id + "DatePickerTextField"
    ].forEach((tbId) => {
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
