<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Will this be a future recurring requirement?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              DISA has developed a tracking system for expiring contracts. Responding YES to this 
              question will enable contract specialists to populate the tracking system.
            </p>
            <ATATRadioGroup
              class="copy-max-width mb-10 textarea-max-width"
              id="RecurringOptions"
              :card="true"
              :items="recurringOptions"
              :value.sync="selectedRecurringOption"
            />
          </div>


        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class PeriodOfPerformance extends Vue {
  private selectedRecurringOption = "";
  private recurringOptions: RadioButton[] = [
    {
      id: "YesRecurring",
      label: "Yes. This requirement should be tracked for similar efforts in the future.",
      value: "YesRecurring",
    },
    {
      id: "NoRecurring",
      label: "No. This is a temporary requirement.",
      value: "NoRecurring",
    },
  ];
}
</script>
