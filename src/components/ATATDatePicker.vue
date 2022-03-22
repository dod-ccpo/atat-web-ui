<template>
  <div :id="id + 'DatePickerContainer'" class="d-flex align-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :attach="'#' + id + 'DatePickerContainer'"
      :return-value.sync="date"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          ref="atatDatePicker"
          v-model="date"
          :value.sync="_value"
          :id="id + 'DatePicker'"
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
          <v-icon :id="id + 'DatePickerButtonIcon'">calendar_today </v-icon>
        </v-btn>
      </template>
      <v-date-picker 
        v-model="date" 
        @input="menu = false" 
        :show-adjacent-months="showAdjacentMonths"
        no-title 
        scrollable></v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import { props } from "cypress/types/bluebird";

@Component({})
export default class ATATDatePicker extends Vue {
  //props
  @Prop({ default: "" }) private id!: string;
  @PropSync("value", { default: "" }) private _value!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  private date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10);
  private menu = false;

  //functions
  private toggleMenu(): void {
    this.menu = !this.menu;
  }

  //Events
}
</script>
