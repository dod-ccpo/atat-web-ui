<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Tell us more about your Section 508 Accessibility requirements
          </h1>
          <ATATAlert
            id="FairOpportunityAlert"
            type="callout"
            :showIcon="false"
            class="copy-max-width my-10"
          >
            <template v-slot:content>
              <h2>Determining your accessibility requirements</h2>
              <p class="mt-2 mb-0">
                The <a
                href="https://app.buyaccessible.gov/art/home"
                target="_blank"
                class="_text-link"
                id="508AccessibilityExternalLink"
              >
                <span class="_external-link">Accessibility Requirements Tool (ART)</span>
              </a> is a step-by-step guide that helps you
                determine and properly document IT accessibility requirements in contracting
                documents. From the ART website, you can
                <span class="h6">choose from pre-packaged sample procurements</span>
                for standard ICT products and services or
                <span class="h6">start a new procurement</span>
                to identify your relevant accessibility requirements.
                ART will guide you through a series of questions about your procurement, beginning
                with potential exceptions. If no exceptions apply, the tool will walk you through
                the criteria for each item in your procurement, then produce a comprehensive
                report
                detailing all the applicable standards and exceptions that apply to your
                procurement. <span class="h6">Copy and paste the ICT procurement language</span>
                from this report into the
                field below, and we will customize the Section 508 requirements in your Description
                of Work.
              </p>
            </template>
          </ATATAlert>
          <ATATTextArea
            id="OperationToBePerformed"
            label="What accessibility requirements do you need to include in your solicitation?"
            helpText="Copy/paste the procurement language from your
            custom ART report or from one of the sample procurements."
            class="width-100 copy-max-width"
            :rows="10"
            :value.sync="accessibilityReqs"
            :rules="[
                $validators.required(
                  'Please enter your accessibility requirements.'
                ),
              ]"
          />

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
    ATATAlert,
  },
})

export default class AccessibilityReq extends Vue {
  private accessibilityReqs = "";

}
</script>
