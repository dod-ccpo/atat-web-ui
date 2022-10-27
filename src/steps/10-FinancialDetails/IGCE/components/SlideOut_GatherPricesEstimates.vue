
<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Requirements Cost Estimate FAQs
    </h2>
    <p>
      Use the following Frequently Asked Questions (FAQs) to help you complete
      the Requirements Cost Estimate section.
    </p>
    <p class="mb-3">
      The following methods of evaluation are available under the JWCC Contract.
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
@Component({
  components: {},
})
// eslint-disable-next-line camelcase
export default class SlideOut_GatherPricesEstimates extends Vue {
  public expansionPanelData: Record<string, string>[] = [
    {
      headerText: " How do I determine a monthly price for each of my cloud" +
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
        <p>
          The CSP shall map each quoted or proposed catalog item number/SKU to
          the specific requirement element(s).
        </p>
        <p>
          Depending on your basis of evaluation, the KO may request the CSPs
          propose a technical solution.
        </p>
        <p class="font-weight-700 mb-2">
          Award will be made to the lowest priced offeror meeting the
          compliance standards.
        </p>
      `
    },
    {
      headerText: "Best Value Trade-Off (BVTO)",
      id: "BVTO",
      content: `
        <p>
          Your KO will request the CSPs propose a technical solution and
          provide a price proposal that includes the total price and a complete
          list of cloud service offerings with catalog item numbers/SKUs, the
          unit price, unit of issue, and quantities calculated on a monthly
          basis for each catalog item number/SKU.
        </p>
        <p class="font-weight-700 mb-2">
          Award will be made to the CSP providing the best value.
        </p>
      `
    },
    {
      headerText: "“Best Use” Solution",
      id: "BestUse",
      content: `
        <p>
          Your KO will request CSPs submit a white paper identifying a strategy
          and approach that will meet or exceed the requirements within the proposed
          costs; must provide a price proposal which includes a complete list of
          cloud service offerings with catalog item numbers/SKUs and quantities to
          meet the requirements.
        </p>
        <p class="font-weight-700 mb-2">
          Award will be made to the CSP whose white paper offers the “best use” solution.
        </p>
      `
    },
    {
      headerText: "“Lowest Risk” Solution",
      id: "LowestRisk",
      content: `
        <p>
          Your KO will request CSPs submit a white paper identifying a strategy
          and approach that will meet or exceed the requirements within the
          proposed costs; must provide a price proposal which includes a complete
          list of cloud service offerings with catalog item numbers/SKUs and
          quantities to meet the requirements.
        </p>
        <p class="font-weight-700 mb-2">
          Award will be made to the CSP whose white paper offers the “lowest risk” solution.
        </p>
      `
    },
    {
      headerText: "Equal award to all interested CSPs",
      id: "EqualAward",
      content: `
        <p>
          Your KO will issue a Request for Quote (RFQ) and ask CSPs to respond
          if they are “interested” or “not interested.” Task orders will be issued
          to all interested CSPs.
        </p>
        <p class="font-weight-700 mb-2">
          Award will be made in equal parts to each CSP that responded to the RFQ as “interested.”
        </p>
      `
    },
  ];

}
</script>

