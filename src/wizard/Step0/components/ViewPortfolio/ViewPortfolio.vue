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
      <v-col cols="6" v-if="portfolios">
        <portfolio-summary
          :portfolios="portfolios"
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
import { Portfolio } from "types/Portfolios";
import PortfolioSummary from "./PortfolioSummary.vue";

@Component({
  components: {
    PortfolioSummary,
  },
})
export default class ViewPortfolio extends Vue {

  get portfolios(): Portfolio[] {
     return this.$store.state.portfolios;
  }
  private async loadPortfolios() {
    // this.portfolios = await await this.getPortfolios();
    await this.$store.dispatch("loadPortfolios");
  }

  private async mounted(): Promise<void> {
    await this.loadPortfolios();
  }

  private async onDeletePortfolio(id: string) {
    if (id != "") {
      await this.$store.dispatch("deletePortfolioDraft", id);
      await this.loadPortfolios();
    }
  }

  private async onCreatePortfolio(): Promise<void> {
    await this.$store.dispatch("createPortfolioDraft");
    this.$router.push({ name: "addportfolio" });
  }

  private async onEditPortfolio(draftId: string): Promise<void> {
    await this.$store.dispatch("loadPortfolioDraft", draftId);
    this.$router.push({ name: "addportfolio" });
  }
}
</script>
