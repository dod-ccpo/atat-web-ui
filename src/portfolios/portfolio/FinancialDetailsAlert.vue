<template>
  <ATATAlert
    id="InaccurateFinancialDetails"
    type="error"
    class="mb-10"
  >
    <template v-slot:content>
      <h3 class="mb-1">Financial details may be inaccurate</h3>
      <p class="mb-0">
        We are currently experiencing an issue with retrieving cost data from
        {{ cspLongName() }}. In the meantime, administrators can login to your
        CSP console directly to get detailed cost analyses and breakdowns. We
        apologize for this inconvenience.
      </p>
    </template>
  </ATATAlert>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-facing-decorator;
import ATATAlert from "@/components/ATATAlert.vue";
import PortfolioStore from "@/store/portfolio";

@Component({
  components: {
    ATATAlert,
  },
})
export default class FinancialDetailsAlert extends Vue {

  public cspLongName(): string {
    const cspName = PortfolioStore.currentPortfolio.csp ?? "";
    let longName = "";
    switch (cspName.toLowerCase()) {
    case "aws":
      longName = "Amazon Web Services";
      break;
    case "azure":
      longName = "Microsoft Azure";
      break;
    case "gcp":
      longName = "Google Cloud";
      break;
    case "oracle":
      longName = "Oracle Cloud";
      break;
    default:
      break;
    }
    return longName;
  }
}
</script>
