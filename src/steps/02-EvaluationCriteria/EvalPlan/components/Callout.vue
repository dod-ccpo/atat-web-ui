
<template>
  <ATATAlert
    id="Callout"
    type="callout"
    calloutBackground="primary-lighter"
    class="max-width-840 mb-10"
  >
    <template v-slot:content>
      <h2 class="mb-2">
        {{ heading }}
      </h2>
      <p id="IntroP" class="mb-4">
        {{ introP }}
      </p>
      <p
        v-if="subhead"
        class="font-weight-700"
        :class="listItems.length ? 'mb-2' : 'mb-0'"
        id="Subhead"
      >
        {{ subhead }}
      </p>
      <div v-if="listItems.length" style="border-left: 4px solid #544496">
        <div
          v-for="(item, index) in listItems"
          :key="index"
          class="d-flex"
          :class="{ 'pb-3': index < listItems.length - 1 }"
        >
          <div class="font-weight-700 nowrap pl-4 align-top">
            {{ listType }} #{{ index + 1 }}
          </div>
          <div class="align-top pl-6 width-100">
            {{ item }}
          </div>
        </div>
      </div>
    </template>
  </ATATAlert>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
  },
})
export default class Callout extends Vue {
  @Prop() public sourceSelection!: string;
  @Prop() public method?: string;

  public get isStandards(): boolean {
    return this.sourceSelection.indexOf("TECH_PROPOSAL") > -1;
  }

  public get noRequiredStandards(): boolean {
    return this.sourceSelection === "EQUAL_SET_LUMP_SUM";
  }

  public get heading(): string {
    if (this.noRequiredStandards) {
      return "Why are there no required standards?";
    }
    return this.isStandards ? "Compliance Standards" : "Assessment Areas";
  }

  public get listType(): string {
    return this.isStandards ? "Standard" : "Criteria";
  }

  public get introP(): string {
    if (!this.isStandards) {
      if (this.sourceSelection === "SET_LUMP_SUM") {
        return `Your Contracting Officer (KO) will request Contractors submit a white paper
          identifying a strategy and approach that will meet or exceed the requirements 
          within the proposed costs. Contractors must also provide a price proposal which 
          includes a complete list of cloud service offerings with catalog item 
          numbers/Stock Keeping Units (SKUs) and quantities to meet the requirements.`;
      }
      return `Since you would like to purchase an equal dollar amount from each Contractor,
        your Contracting Officer (KO) will issue a Request for Quote (RFQ) and ask 
        Contractors to respond if they are “interested” or “not interested.” Task orders 
        will be issued to all interested Contractors.`;
    }
    const substr1 =
      this.sourceSelection === "NO_TECH_PROPOSAL"
        ? "to provide a price quote"
        : "propose a technical solution and provide a price proposal";
    const substr2 =
      this.sourceSelection === "NO_TECH_PROPOSAL"
        ? " required to meet the criteria in your Description of Work"
        : "";
    return `Your Contracting Officer (KO) will request Contractors ${substr1} that 
      includes the total price and a complete list of cloud service offerings 
      with catalog item numbers/Stock Keeping Units (SKUs), the unit price, unit of issue, 
      and quantities calculated on a monthly basis for each catalog item number/SKU${substr2}.`;
  }

  public get subhead(): string {
    if (this.sourceSelection === "NO_TECH_PROPOSAL" || this.method === "LPTA") {
      return `Award will be made to the lowest priced offeror meeting the following 
        compliance standards:`;
    } else if (this.method === "BVTO") {
      return `Award will be made to the Contractor providing the best value and meets the 
        following compliance standards:`;
    } else if (this.sourceSelection === "SET_LUMP_SUM") {
      const methodStr =
        this.method === "LOWEST_RISK" ? "lowest risk" : "best use";
      return `Award will be made to the Contractor whose white paper offers the “${methodStr}” 
        solution and meets the following assessment areas:`;
    }
    return `Award will be made in equal parts to each Contractor that responds to the 
      RFQ as “interested.”`;
  }

  public get listItems(): string[] {
    let listItems: string[] = [];
    switch (this.sourceSelection) {
    case "NO_TECH_PROPOSAL":
      listItems = [
        "Each requirement element has one or more specific catalog item number/SKU specified.",
        "The Contractor mapped the catalog item numbers/SKUs to the requirement element(s).",
      ];
      break;
    case "TECH_PROPOSAL":
      listItems = [
        "The proposed solution fully addresses each requirement element.",
        `The proposed solution identifies all catalog items (and quantity) necessary 
          to meet the requirements.`,
        `Each catalog item is mapped to a specific requirement and an explanation 
          of how the item will contribute to the solution is provided.`,
      ];
      break;
    case "SET_LUMP_SUM":
      listItems = [
        `Solution adequately addresses each requirement element or identifies any 
          requirement elements which are not explicitly identified in the strategy 
          or approach.`,
        `The proposed solution identifies all cloud service offerings with catalog 
          item numbers/SKUs (and quantities) that are required.`,
        `Each catalog item is mapped to a specific requirement and an explanation 
          of how the item will contribute to the solution is provided.`,
        `The proposed solution addresses how the Contractor will facilitate the described need.`,
      ];
    }
    if (
      this.method === "LOWEST_RISK" &&
      this.sourceSelection === "SET_LUMP_SUM"
    ) {
      listItems.push("Risk to the Government.");
    }
    if (this.method === "BVTO" && this.sourceSelection === "TECH_PROPOSAL") {
      listItems[1] = `The proposed solution identifies all catalog items (and quantity) 
        that are required.`;
    }
    return listItems;
  }
}
</script>

