<template>
 <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          Let’s see if you have any supporting documentation
        </h1>
        <p class="page-intro">
          If you have any reference materials to support how your estimates 
          were calculated, you can provide links or upload attachments below. 
          Your contracting officer will rely on these resources as evidence 
          of the realism of your IGCE.
        </p>
        <h2 class="mb-5">1. Share a link to your custom cost estimate report</h2>
        <ATATTextField
          label="CSP pricing calculator link"
          id="CSPPricingCalculatorLink"
          :optional="true"
          class="_input-max-width"
          :value.sync="CSPPricingCalculatorLink"
          tooltipText="If available, enter your share link from the CSP calculator 
          website, so a contracting officer can access your custom cost estimate 
          report."
          :rules="[
              $validators.isURL('Please enter a valid URL.')
          ]"
        />
        
        
      
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue"
@Component({
  components:{
    ATATTextField
  }
})
export default class SupportingDocumentation extends Vue {
  private CSPPricingCalculatorLink = "";
}
</script>

