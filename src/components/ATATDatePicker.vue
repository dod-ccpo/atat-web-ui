<template>
  <div :id="id + 'DatePickerContainer'" class="d-flex align-center">
         <v-menu
      ref="date-picker-menu"
      v-model="menu"
      :close-on-content-click="false"
      
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
    <!-- :return-value.sync="date" -->
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          ref="atat-date-picker"
          :id="id + 'DatePickerTextField'"
          :height="42"
          :placeholder="placeHolder"
          class="text-primary input-max-width"
          :hide-details="true"
          outlined
          dense

          v-bind="attrs"
          v-on="on"
        ></v-text-field>
        <v-btn
          icon
          :id="id + 'DatePickerButton'"
          aria-label="Open calendar to select date"
          @click="toggleMenu"
        >
          <v-icon :id="id + 'DatePickerButtonIcon'" class="icon-28">calendar_today </v-icon>
        </v-btn>
      </template>
      <v-date-picker 
        :id="id + 'DatePicker'"
        @click:date="setDate"
        :show-adjacent-months="showAdjacentMonths"
        no-title 
        scrollable></v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";
import { format, compareAsc } from 'date-fns'

@Component({})
export default class ATATDatePicker extends Vue {
  //props
  @Prop({ default: "" }) private id!: string;
  @PropSync("date", { default: format(new Date(Date.now() - new Date().getTimezoneOffset() * 60000),"MM/dd/yyyy")}) private _date!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  
  // data
  private menu = false;
  private date = "";
  //functions
  /**
   * toggle menus based on value of this.menu
   */
  private toggleMenu(): void {
    this.menu = !this.menu;
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

  //events
  private async setDate(selectedDate: string): Promise<void>{
debugger;
    this.date= selectedDate;
  }

  //lifecycle hooks
  private mounted(): void {
    this.addMasks();
  }

  //Watches
  @Watch("date")
  protected dateChanged(newVal: string): void{
    
    this.date=newVal;
  }
}
</script>
