
<template>
   <v-container>
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFormatted"
              label="Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>
        <p>Date in ISO format: <strong>{{ date }}</strong></p>
      </v-col>
    </v-row>
   </v-container>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
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
  private date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
  private dateFormatted = this.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10));
  private menu1 = false;

  get computedDateFormatted (): string {
    return this.formatDate(this.date)
  }

    // watch: {
  @Watch("date")
  protected formatDateWatcher(newVal: string): void {
    this.dateFormatted = this.formatDate(this.date)
  }
    

  
  private formatDate (date: string): string {
    if (!date) return ''

    const [year, month, day] = date.split('-')
    return `${month}/${day}/${year}`
  }

  private parseDate (date: string): string {
    if (!date) return "";

    const [month, day, year] = date.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
    
  }
</script>