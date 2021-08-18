<template>
  <v-row>
    <v-col>
      <v-menu
        v-model="menu"
        :close-on-content-click="true"
        :nudge-right="40"
        transition="scale-transition"
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
            v-model="date"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker
          :min="minDate"
          :max="maxDate"
          v-model="date"
          @change="$emit('update:date', date)"
          @input="menu = false"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { TaskOrderFile } from "../../types/Wizard";
@Component({})
export default class ATATDatePicker extends Vue {
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: true }) private dense!: boolean;
  @Prop({ default: "color" }) private color!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: "" }) private date!: string;

  private menu = false;
  private minDate = "2020-09-01";
  private maxDate = "2022-10-31";
  private isFieldValid = false;
  private showDate = this.date;
  private getStatusIcon() {
    // if the rules property isn't set we won't display an icon
    // when the rules property is populated (i.e when the parent form is saved)
    // we evalute the rules to determine what icon to display
    if (this.$props["rules"].length > 0) {
      let date = this.date;

      this.isFieldValid = this.$props["rules"].every(
        (rule: (a: string) => string | boolean) => rule(date) === true
      );
    }
  }
}
</script>

<style scoped></style>
