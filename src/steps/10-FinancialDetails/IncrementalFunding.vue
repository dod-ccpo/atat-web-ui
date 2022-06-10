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

            <div 
              class="d-flex justify-space-between align-center"
              v-for="(increment, index) in increments"
              :key="index"
            >
              <ATATSelect
                :id="'IncrementPeriod' + index"
                :items="incrementPeriods"
                width="190"
                :selectedValue.sync="increments[index].qtr"
                class="mr-4"
                @
              />
              

              <ATATTextField
                :id="'Amount' + index"
                :value.sync="increments[index].amt"
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
    { text: "4th QTR FY22", value: "4th QTR FY22" },
    { text: "1st QTR FY23", value: "1st QTR FY23" },
    { text: "2nd QTR FY23", value: "2nd QTR FY23" },
    { text: "3rd QTR FY23", value: "3rd QTR FY23" },
    { text: "4th QTR FY23", value: "4th QTR FY23" },
    { text: "1st QTR FY24", value: "1st QTR FY24" },
    { text: "2nd QTR FY24", value: "2nd QTR FY24" },
  ];
  public costEstimate = AcquisitionPackage.estimatedTaskOrderValue;
  public initialIncrementAmount = 0;

  public increments: { qtr: string, amt: string }[] = [
    { qtr: "3rd QTR FY22", amt: "0" }
  ];



}
</script>

