<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Tell us about your property custodian
          </h1>
          <div class="copy-max-width">
  
            <ATATTextField 
              label="Full name" 
              id="FullName" 
              class="_input-max-width mb-10" 
              helpText="Include rank, if applicable"  
            />

            <ATATTextField 
              label="DPAS Unit Identification Code (UICs)" 
              id="UICs" 
              class="_input-max-width mb-10" 
              tooltipText="Lorem ipsum - awaiting tooltip text"
            />
            
            <ATATTextField 
              label="DPAS Custodian number" 
              id="DPASCustodianNumber" 
              class="_input-max-width mb-10" 
              tooltipText="This is a one-to-six character unique code used to identify an 
                individual responsible for assigned assets in all property functions. "
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

import ATATTextField from "@/components/ATATTextField.vue"

@Component({
  components: {
    ATATTextField,
  },
})

export default class PropertyCustodian extends Vue {

}
</script>
