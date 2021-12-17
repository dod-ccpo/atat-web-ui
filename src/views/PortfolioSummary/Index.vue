<template>
  <div>
    <div class="body-lg pt-3">
      <h1 tabindex="-1" class="h2 mb-0 ml-14">{{ portfolioName }}</h1>
      <v-tabs class="atat-tabbar dense">
        <v-tab
          href="#fundingTracker"
          class="h5 font-weight-bold body atat-tabbar-content ml-14"
          ><div class="tabname">Funding Tracker</div></v-tab
        >
        <v-tab-item value="fundingTracker">
          <funding-tracker></funding-tracker>
        </v-tab-item>
        <v-tab
          class="h5 font-weight-bold body atat-tabbar-content"
          disabled
          tabindex="-1"
          ><div class="tabname">Task Orders</div></v-tab
        >
        <v-tab
          class="h5 font-weight-bold body atat-tabbar-content"
          disabled
          tabindex="-1"
          ><div class="tabname">Applications</div></v-tab
        >
        <v-tab
          class="h5 font-weight-bold body atat-tabbar-content"
          disabled
          tabindex="-1"
          ><div class="tabname">Settings</div></v-tab
        >
      </v-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Portfolio } from "types/Portfolios";
import { Component, Vue } from "vue-property-decorator";
import FundingTracker from "../PortfolioSummary/FundingTracker/views/FundingTracker.vue";
@Component({
  components: {
    FundingTracker,
  },
})
export default class App extends Vue {
  private portfolioName = "";
  mounted(): void {
    const portfolio = this.$store.state.portfolios.portfolioDrafts.filter(
      (portfolio: any) =>
        portfolio.id == this.$store.state.wizard.currentPortfolioId
    );
    this.portfolioName = portfolio[0].name;
  }
}
</script>
