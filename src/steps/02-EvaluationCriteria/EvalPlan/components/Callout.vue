
<template>
  <ATATAlert 
    id="Callout"
    type="callout"
    calloutBackground="primary-lighter"
    class="max-width-840 mb-10"
  >
    <template v-slot:content>
      <h2 class="mb-2">
        Compliance Standards
      </h2>
      <p id="IntroP" class="mb-4">
         {{ calloutData.introP }}
      </p>
      <p class="font-weight-700 mb-2" id="Subhead">
        {{ calloutData.subhead }}
      </p>
      <div style="border-left: 4px solid #544496">
        <div 
          v-for="(item, index) in calloutData.listItems"
          :key="index"
          class="d-flex"
        >
          <div 
            class="font-weight-700 nowrap mr-4 pl-3 align-top"
            :class="{ 'pb-2' : index < calloutData.listItems.length - 1 }"
            style="width: 100px;"
          >
            {{ calloutData.listType }} #{{ index + 1 }}
          </div>
          <div class="align-top">
            {{ item }}
          </div>
        </div>
      </div>


    </template>

  </ATATAlert>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
  }
})

export default class Callout extends Vue {
  public calloutData: Record<string, string | string[]> = {
    heading: "Compliance Standards",
    introP: `Your Contracting Officer (KO) will request CSPs to provide a price 
      quote that includes the total price and a complete list of cloud service 
      offerings with catalog item numbers/SKUs, the unit price, unit of issue, 
      and quantities calculated on a monthly basis for each catalog item number/SKU 
      required to meet the criteria in your Description of Work.`,
    subhead: `Award will be made to the lowest priced offeror meeting the following 
      compliance standards:`,
    listType: "Standard",
    listItems: [
      "Each requirement element has one or more specific catalog item number/SKU specified.",
      "The CSP mapped the catalog item numbers/SKUs to the requirement element(s)."
    ]
  };
}
</script>

