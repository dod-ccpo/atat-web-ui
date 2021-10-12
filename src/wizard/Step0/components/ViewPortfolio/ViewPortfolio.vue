<template>
  <v-container fluid class="view-portfolio">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-3 h1 font-weight-bold">My Porfolios</h1>
      </v-col>
    </v-row>
    <v-row class="portfolio-banner">
      <v-col class="d-flex justify-space-between align-center">
        <div class="h3">My Portfolios</div>
        <div>
          <v-btn
            id="btn-create-new-portfolio"
            class="primary"
            :ripple="false"
            @click="onCreatePortfolio"
          >
            Create a New Portfolio
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-if="portfolios.length > 0">
        <portfolio-summary
          :portfolioDrafts="portfolios"
          v-on:delete="onDeletePortfolio"
          v-on:edit="onEditPortfolio"
        ></portfolio-summary>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PortfolioDraft } from "types/Portfolios";
import PortfolioSummary from "./PortfolioSummary.vue";

@Component({
  components: {
    PortfolioSummary,
  },
})
export default class ViewPortfolio extends Vue {
  get portfolios(): PortfolioDraft[] {
    return this.$store.state.portfolioDrafts;
  }
  private async loadPortfolioDrafts() {
    // this.portfolios = await await this.getPortfolios();
    await this.$store.dispatch("loadPortfolioDrafts");
  }

  private async mounted(): Promise<void> {
    await this.loadPortfolioDrafts();
  }

  private async onDeletePortfolio(id: string) {
    if (id != "") {
      await this.$store.dispatch("deletePortfolioDraft", id);
      await this.loadPortfolioDrafts();
    }
  }

  private async onCreatePortfolio(): Promise<void> {
    await this.$store.dispatch("createPortfolioDraft");
    this.$router.push({ name: "addportfolio" });
  }

  private async onEditPortfolio(draftId: string): Promise<void> {
    debugger;
    this.$store.dispatch("setIsProgressBarDisplayed", true);
    await this.$store.dispatch("loadPortfolioDraft", draftId);
    await this.$store.dispatch("setIsProgressBarDisplayed", false);
    debugger;
    this.$router.push({ name: "addportfolio" });
    
    
  }
}
</script>
