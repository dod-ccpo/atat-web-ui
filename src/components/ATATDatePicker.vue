<template>
  <div :id="id + 'DatePickerContainer'" class="atat-date-picker">
    <v-menu
      ref="date-picker-menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
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
          v-model="getSelectedDate"
          outlined
          :style="'width: ' + width + 'px'"
          dense
          v-bind="attrs"
          v-on="on"
          @input="$emit('update:date', $event.target.value)"
          @mousedown="toggleMenu"
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
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        :id="id + 'DatePicker'"
        v-model="selectedDate"
        @click:date="updateDateProperty"
        :show-adjacent-months="showAdjacentMonths"
        no-title
        scrollable
      >
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import Inputmask from "inputmask";
import { format, isValid } from "date-fns";
import ATATTooltip from "@/components/ATATTooltip.vue";

@Component({
  components: {
    ATATTooltip,
  },
})
export default class ATATDatePicker extends Vue {
  //props
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: false }) private optional!: boolean;
  @PropSync("date", {
    default: format(
      new Date(new Date().valueOf() + new Date().getTimezoneOffset() * 60000),
      "yyyy-MM-dd"
    ),
  })
  private _date!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: true }) private showAdjacentMonths!: boolean;
  @Prop({ default: "" }) private width!: string;

  // data
  private menu = false;
  private selectedDate = "";
  private dateFormat = "MM/dd/yyyy";
  private menuTop = "0";

  //getters
  set getSelectedDate(value: string) {
    this.selectedDate = isValid(value)
      ? format(new Date(value), this.dateFormat)
      : "";
  }

  get getSelectedDate(): string {
    let selectedDate = new Date(this.selectedDate);
    const dt = isValid(selectedDate)
      ? new Date(
          selectedDate.valueOf() + selectedDate.getTimezoneOffset() * 60000
        )
      : new Date();
    return this.formatDate(dt);
  }

  get getMenutop(): string{
    return this.label !== "" ? "80" : "40";
  }

  //events
  private updateDateProperty(): void {
    this.$emit("update:date", this.formatDate(new Date(this.selectedDate)));
  }

  //functions
  /**
   * toggle menus based on value of this.menu
   */
  private toggleMenu(): void {
    this.menu = !this.menu;
  }

  private formatDate(date: Date): string {
    return format(
      new Date(date.valueOf() + date.getTimezoneOffset() * 60000),
      this.dateFormat
    );
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
