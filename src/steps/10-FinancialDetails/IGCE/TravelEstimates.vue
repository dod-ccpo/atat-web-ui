<template>
 <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            How do you want to estimate your travel needs?
          </h1>
          <p>
            Consider the travel requirements that you previously outlined (e.g., location, 
            duration, quantity, attendance, etc.). You may choose to set a ceiling price 
            and apply it to all periods. Or, if you know that your travel requirements will 
            change over time, then you may opt to set a different price for each period.
          </p>
          <div class="copy-max-width">
            <ATATRadioGroup
              class="copy-max-width mb-10 max-width-740"
              id="TravelEstimates"
              :card="true"
              :items="travelEstimateOptions"
              :value.sync="selectedTravelEstimate"
              :rules="[$validators.required('Please select an option')]"
            />
          </div>
        </v-col>
      </v-row>
 </v-container>
</template>
<script lang="ts">
import { RadioButton } from "types/Global";
import Vue from "vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import { Component } from "vue-property-decorator";
@Component({
  components:{
    ATATRadioGroup
  }
})
export default class TravelEstimates extends Vue {
  private selectedTravelEstimate = "";
   private travelEstimateOptions: RadioButton[] = [
     {
       id: "set-one-price-to-all-periods",
       label: 
        "I want to set a ceiling price and apply the same estimate to all base and option periods.",
       value: "set-one-price-to-all-periods",
     },
     {
       id: "customize-price-to-all-periods",
       label: "I want to customize my travel estimates for the base and each option period.",
       value: "customize-price-to-all-periods",
     },
   ];
}
</script>

