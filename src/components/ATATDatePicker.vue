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
          v-model="_date"
          
          :id="id + 'DatePickerTextField'"
          :height="42"
          :placeholder="placeHolder"
          class="text-primary input-max-width"
          :hide-details="true"
          outlined
          dense
          v-bind="attrs"
          v-on="on"
          @input = "onInput"
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
        @input = "onInput"
        :show-adjacent-months="showAdjacentMonths"
        no-title 
        scrollable></v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";

@Component({})
export default class ATATDatePicker extends Vue {
  //props
  @Prop({ default: "" }) private id!: string;
  @PropSync("date", { default: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)}) private _date!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  
  // data
  private menu = false;
  // private date = "";
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
  private onInput(d:string){
    this._date = d;
  }

  //lifecycle hooks
  private mounted(): void {
    this.addMasks();
  }
}
</script>
