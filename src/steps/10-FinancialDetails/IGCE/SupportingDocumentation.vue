<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Let’s see if you have any supporting documentation
        </h1>
        <div class="copy-max-width">
          <p id="IntroP" class="mb-7">
            If you have any reference materials to support how your estimates were 
            calculated, you can provide links or upload attachments below. Your 
            contracting officer will rely on these resources as evidence of the 
            realism of your IGCE.
          </p>
          <h2 id="Section1Header" class="mb-5">
            1. Share a link to your custom cost estimate report
          </h2>
          <ATATTextField 
            label="CSP pricing calculator link"
            id="CSPPriceCalcLink"
            :optional="true"
            :tooltipText="cspLinkTooltip"
            :value.sync="cspCalculatorLink"
            placeHolder="https://example.com"
          />

          <ATATDivider badgeText="AND/OR" />

          <h2 id="Section2Header" class="mb-0">
            2. Upload supporting documentation
          </h2>
          <p class="font-size-14 text-base">
            Attach any files to support your estimated prices (e.g., an export of 
            your cost estimate report, a screenshot from the CSP pricing calculator 
            website, vendor invoices from a similar requirement, etc.)
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATDivider from "@/components/ATATDivider.vue";
import ATATFileUpload from "../../components/ATATFileUpload.vue";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATDivider,
    ATATFileUpload,
    ATATTextField,
  }
})

export default class SupportingDocumentation extends Vue {
  public cspCalculatorLink = "";
  public cspLinkTooltip = `If available, enter your share link from the CSP 
    calculator website, so a contracting officer can access your custom cost 
    estimate report.`;
}
</script>

