<template>
  <div>
    <div class="body-lg pt-3">
      <h3 class="h3 mb-0 ml-14">{{ portfolioName }}</h3>
      <v-tabs class="atat-tabbar dense">
        <v-tab
          href="#fundingTracker"
          class="h5 font-weight-bold body px-0 atat-tabbar-content ml-14"
          ><div class="tabname pb-4">Funding Tracker</div></v-tab
        >
        <v-tab-item value="fundingTracker">
          <funding-tracker></funding-tracker>
        </v-tab-item>
        <v-tab
          class="h5 font-weight-bold body px-0 atat-tabbar-content"
          disabled
          ><div class="tabname pb-4">Task Orders</div></v-tab
        >
        <v-tab
          class="h5 font-weight-bold body px-0 atat-tabbar-content"
          disabled
          ><div class="tabname pb-4">Applications</div></v-tab
        >
        <v-tab
          class="h5 font-weight-bold body px-0 atat-tabbar-content"
          disabled
          ><div class="tabname pb-4">Settings</div></v-tab
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
    this.portfolioName = this.$store.getters["wizard/getPortfolioName"]();
  }
}
</script>
