<template>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Next, tell us about how your estimates were developed
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            Contracting officers rely on the IGCE to assist in the determination 
            of the acquisition strategy, as well as an estimated cost for the 
            proposed effort. Along with your cost breakdown, the contracting 
            office needs to clearly understand the methodology that you used to 
            determine your price estimates. 
          </p>

          <ATATCheckboxGroup
            id="UsedForEstimatingCheckboxes"
            :value.sync="selectedOptions"
            :hasOtherValue="true"
            :items="checkboxItems"
            name="checkboxes"
            :card="false"
            class="copy-max-width"
            :rules="[
              $validators.required(`Please select at least one type of information
                or tool used to estimate your costs.`)
            ]"
          />

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { RadioButton } from "../../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATCheckboxGroup
  }
})

export default class EstimatesDeveloped extends Vue {

}
</script>

