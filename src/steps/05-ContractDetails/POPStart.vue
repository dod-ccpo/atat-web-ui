<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Do you want to request a PoP start date?
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              Due to project requirements and/or contractual obligations, your PoP may need to start
              on a specific date. If no date is specified, then your PoP will begin based upon the
              execution date of your task order.
            </p>
            <ATATRadioGroup
              class="copy-max-width max-width-740"
              id="PoPStartDate"
              :card="true"
              :items="startDateOptions"
              :value.sync="selectedStartDateOption"
            />
          </div>
          <div>
            <hr class="my-9"/>
            <p class="mb-10">
              Requested start date
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import {RadioButton} from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class POPStart extends Vue {
  private selectedStartDateOption = "";
  private startDateOptions: RadioButton[] = [
    {
      id: "YesStartDate",
      label: "Yes.",
      value: "YesStartDate",
    },
    {
      id: "NoStartDate",
      label: "No. The PoP should start upon execution of the task order.",
      value: "NoStartDate",
    },
  ];
}
</script>
