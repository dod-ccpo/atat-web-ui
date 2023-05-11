<template>
  <div class="_panel-padding">
    <h2 class="mb-5">Understanding market research for the JWCC Contract</h2>
    <p>
      Market research was conducted and resulted in a signed market research report
      on 9 Nov 2021 for the basic JWCC contracts. After a survey of the market, it was
      concluded that the JWCC Contract is in the Government’s best interest due to
      technical feasibility and cost to the Government.
    </p>
    <ATATAlert
        id="MarketResearchEffortsLearnMoreAlert"
        type="info"
        :showIcon="true"
        class="mt-5"
    >
      <template v-slot:content>
        <p class="mb-4">
          The above statement will be included in the Market Research section of your
          completed J&A, along with any details that you provide about research that
          you conducted for your task order.
        </p>
        <p>
          For more information about market research procedures, reference
          <a href="https://www.acquisition.gov/far/10.002"
             id="MarketResearchEffortsLearnMoreLink"
             class="_text-link" target="_blank">
            <span class="_external-link">FAR 10.002</span></a>.
        </p>
      </template>
    </ATATAlert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component} from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert
  },
})

export default class MarketResearchEffortsLearnMore extends Vue {
}
</script>
