<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">Tell us more about the scope of your project</h1>

          <ATATAlert type="info" :showIcon="false" class="copy-max-width mt-10">
            <template v-slot:content>
              <h2>Surge Capabilities</h2>
              <p class="mt-2">
                The Government may require surge capabilities during the base or
                any option period, and surge modifications will be within the
                scope of the contract for the defined task areas in the
                description of work.
              </p>
              <p class="mb-0">
                Surge capabilities over the life of the task
                order cannot exceed between 1-50% of the contractor’s total
                proposed price for the base and all option periods, excluding any
                six-month extension of services pursuant to Federal Acquisition
                Regulation (FAR) 52.217-8.
              </p>
            </template>
          </ATATAlert>
          <p class="mt-8 mb-2">
            If surge capabilities are required, what percentage of the contractor’s total proposed price will not be exceeded?
          </p>
          <ATATTextField 
            label="" 
            id="ContractPricePercentage"
            placeHolder="1-50" 
            class="width-20" 
            suffix="%"
            :rules="contractPricePercentageRules"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ATATAlert from "../../components/ATATAlert.vue";
import ATATTextField from "../../components/ATATTextField.vue";

import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATAlert,
    ATATTextField
  },
})
export default class ProjectScope extends Vue {

  get contractPricePercentageRules(): unknown[] {
    const validationRules = [];
    validationRules.push(
      (v:number) => v > 0 && v <= 50  ||  "Enter a number between 1-50"
    );
    validationRules.push(
      (v:string) => /[0-9]/.test(v)  ||  "Enter a number between 1-50"
    );
    
    return validationRules; 
  }
}
</script>

