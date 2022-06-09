<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s create an incremental funding plan for your base period
        </h1>
        <div class="copy-max-width">
          <p>
            To fund the award of this effort, your organization will need to provide 
            an initial increment of funds to the Contracting Office. The remaining 
            funds needed to fully fund your cost estimate for non-optional line items 
            may be provided in subsequent increments. In the fields below, add funding 
            increments and specify the projected date (on a fiscal year quarterly 
            basis) for which funds will be provided. A projected funding schedule 
            will be generated.
          </p>

          <div style="width: 450px;">
            <div class="d-flex justify-space-between align-center">
              <label for="InitialAmount">
                Initial funding increment
              </label>
              <ATATTextField
                id="InitialAmount"
                :value.sync="initialIncrementAmount"
                width="190"
                class="mr-9"
              />
            </div>
            <hr />
            <div class="d-flex justify-space-between align-center">
              <ATATSelect
                id="IncrementPeriod1"
                :items="timePeriods"
                width="190"
                :selectedValue.sync="optionPeriods[index].unitOfTime"
                class="mr-4"
              />
              

              <ATATTextField
                id="InitialAmount"
                :value.sync="initialIncrementAmount"
                width="190"
                class="mr-9"
              />
            </div>            

          </div>
          
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

import { SelectData } from "../../../types/Global";

@Component({
  components: {
    ATATSelect,
    ATATTextField,
  }
})

export default class IncrementalFunding extends Vue {

  public incrementPeriods: SelectData[] = [
    { text: "3rd QTR FY22", value: "3rd QTR FY22" },
    { text: "", value: "" },
    { text: "", value: "" },
    { text: "", value: "" },
    { text: "", value: "" },
    { text: "", value: "" },
  ];
  public costEstimate = AcquisitionPackage.estimatedTaskOrderValue;
  public initialIncrementAmount = undefined;



}
</script>

