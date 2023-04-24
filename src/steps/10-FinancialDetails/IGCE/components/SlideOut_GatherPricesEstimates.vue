
<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Requirements Cost Estimate FAQs
    </h2>
    <p>
      Use the following Frequently Asked Questions (FAQs) to help you complete
      the Requirements Cost Estimate section.
    </p>
    <v-expansion-panels accordion flat>
      <v-expansion-panel
        v-for="(item, index) in expansionPanelData"
        :key="index"
      >
        <v-expansion-panel-header :id="item.id + '_Button'">
          {{ item.headerText }}
        </v-expansion-panel-header>
        <v-expansion-panel-content :id="item.id + '_Content'">
          <div v-html="item.content"></div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { routeNames} from "@/router/stepper";

@Component({
  components: {
    ATATSVGIcon
  },
})
// eslint-disable-next-line camelcase
export default class SlideOut_GatherPricesEstimates extends Vue {
  private route = routeNames.RequirementCategories

  public expansionPanelData: Record<string, string>[] = [
    {
      headerText: " How do I determine a price for each of my cloud" +
        " services and/or support?",
      id: "MPC",
      content: `
        <p>
          Each Cloud Service Provider (CSP) provides a pricing calculator for
          the JWCC Contract to help you calculate your estimate monthly cost
          for cloud services and support. To get started, choose one or more
          of the CSP calculators below as a tool for developing your cost
          estimate.
        </p>
        <div class="mb-2 font-weight-500">CSP Pricing Calculators</div>
        <div class="pl-3">
        <div class="d-flex align-center mb-2">
        <svg viewBox="0 0 9 9" height="8px" width="8px"  xmlns="http://www.w3.org/2000/svg">
         <circle cx="4.3" cy="4.3" r="4.3" fill="transparent"/>
         <circle cx="4.15" cy="4.15" r="2.15" fill="#544496"/></svg>
        <a
           id="OpenAWSPricing"
           tabindex="0"
           href="https://calculator.aws/#/addService?nc2=h_ql_pr_calc"
           class="ml-1"
        >
            AWS Pricing Calculator
        </a>
        </div>
        <div class="d-flex align-center mb-2">
        <svg viewBox="0 0 9 9" height="8px" width="8px"  xmlns="http://www.w3.org/2000/svg">
         <circle cx="4.3" cy="4.3" r="4.3" fill="transparent"/>
         <circle cx="4.15" cy="4.15" r="2.15" fill="#544496"/></svg>
        <a
           id="OpenGooglePricing"
           tabindex="0"
           href="https://cloud.google.com/products/calculator"
           class="ml-1"
        >
            Google Cloud
        </a>
        </div>
        <div class="d-flex align-center mb-2">
        <svg viewBox="0 0 9 9" height="8px" width="8px"  xmlns="http://www.w3.org/2000/svg">
         <circle cx="4.3" cy="4.3" r="4.3" fill="transparent"/>
         <circle cx="4.15" cy="4.15" r="2.15" fill="#544496"/></svg>
        <a
           id="OpenAzurePricing"
           tabindex="0"
           href="https://azure.microsoft.com/en-us/pricing/calculator/"
           class="ml-1"
        >
            Microsoft Azure
        </a>
        </div>
        <div class="d-flex align-center mb-2">
        <svg viewBox="0 0 9 9" height="8px" width="8px"  xmlns="http://www.w3.org/2000/svg">
         <circle cx="4.3" cy="4.3" r="4.3" fill="transparent"/>
         <circle cx="4.15" cy="4.15" r="2.15" fill="#544496"/></svg>
        <a
           id="OpenOraclePricing"
           tabindex="0"
           href="https://www.oracle.com/cloud/costestimator.html"
           class="ml-1"
        >
            Oracle Cloud
        </a>
        </div>
        </div>
        <p>
          From each pricing calculator website you will be able to add
          CSP-specific offerings and customize configurations that fit your
          unique project requirements. This will generate a report of your
          projected monthly prices for each configuration.
        </p>
        <p class="mb-2">
          Be sure to export a copy of your estimate or save a unique link to
          revisit it directly through your browser. You will use this report
          throughout this section to complete a cost estimate and provide
          supporting documentation for how your estimate was developed.
        </p>
      `
    },
    {
      headerText: "Will changes to my estimate titles and descriptions affect" +
        " my performance requirements?",
      id: "ChangeEstimates",
      content: `
        <p>
          No. Details that you provided in the Performance Requirements section
          will be used to generate your Description of Work, which helps CSPs
          to prepare an adequate proposal for your project’s unique requirements.
        </p>
        <p>
          Any details provided in your Independent Government Cost Estimate (IGCE) will be used 
          internally by your office for budgeting purposes and by the contracting office to assist
          in proposal evaluations and price reasonableness determinations.
        </p>
        <p>
          We encourage you to edit any of the pre-filled details to provide a
          more accurate description about each requirement that you estimate.
          For example, you may choose to enter the name of a CSP-specific
          product, or copy and paste the configuration summary generated by a
          CSP’s pricing calculator.
        </p>
        <p class="mb-2">
          Remember, this is for estimating purposes only and unless an exception
          to fair opportunity is approved, your actual requirement will be
          competed amongst all JWCC CSPs.
        </p>
      `
    },
    {
      headerText: "How do I add or remove an item from my IGCE?",
      id: "AddMore",
      content: `
        <p>
          Your IGCE should mirror the performance requirements outlined in the
          Description of Work as much as possible. If you need to add or remove
          items from this cost estimate breakdown, then you will need to
          <a
            id="LinkToStep5"
            href="/#/performance-requirements"
          >
            revisit the Performance Requirements
          </a>
           section to make any changes to your required cloud services and support packages.
        </p>`
    },
  ];

}
</script>

