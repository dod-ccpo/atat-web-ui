
<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      Understanding the source selection process for JWCC task orders
    </h2>
    <p>
      As part of a competitive acquisition strategy, it is important to establish
      criteria for selecting a source based on submission of a 
      quote/proposal/white paper.
    </p>
    <h3 class="mb-5">What factors should be considered when deciding whether 
      or not to require a technical proposal?</h3>
      <v-expansion-panels accordion flat>
        <v-expansion-panel
          v-for="(item, index) in factorsPanelData"
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
    <hr/>
    <h3 class="mb-5">Methods of evaluation
    </h3>
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
export default class CreateEvalPlanSlideOut extends Vue {
  public expansionPanelData: Record<string, string>[] = [
    {
      headerText: "Lowest Price Technically Acceptable (LPTA)",
      id: "LPTA",
      content: `
        <p>
          Your Contracting Officer (KO) will request CSPs provide a price
          quote or proposal that includes the total price and a complete list
          of cloud service offerings with catalog item numbers/SKUs, the unit
          price, unit of issue, and quantities calculated on a monthly basis
          for each catalog item number/SKU required to meet the criteria in
          the Description of Work.
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
  public factorsPanelData: Record<string, string>[] = [
    {
      headerText: "Technical proposal required",
      id: "techProposalRequiredExpandCollapse",
      content: `
      A technical proposal is required when the CSP needs to clearly describe how their proposed 
      solution combines offerings to meet the Government’s need. A CSP would respond to the 
      solicitation by providing a detailed written technical proposal that includes a list of 
      offerings with proposed pricing.
      `
    },
    {
      headerText: "No technical proposal required",
      id: "noTechProposalRequiredExpandCollapse",
      content: `
      A technical proposal is not required when the CSP can clearly demonstrate their understanding 
      of the requirements by providing a comprehensive listing of all offerings that is sufficient 
      to meet the Government’s need. A CSP would respond to the solicitation by only providing a 
      list of offerings with proposed pricing.
      `
    }
  ];
}
</script>

