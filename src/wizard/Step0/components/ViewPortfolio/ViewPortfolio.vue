<template>
  <v-container fluid class="view-portfolio">
    <v-row>
      <v-col cols="12">
        <h1 tabindex="-1" class="mb-3">My Porfolios</h1>
      </v-col>
    </v-row>
    <v-row class="portfolio-banner">
      <v-col class="d-flex justify-space-between align-center">
        <div class="h2">My Portfolios</div>
        <div>
          <v-btn
            id="btn-create-new-portfolio"
            class="primary"
            :ripple="false"
            @click="onCreatePortfolio"
            role="link"
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
import { State, Action } from "vuex-class";
import { PortfoliosState } from "@/store/types";

const namespace = "portfolios";

@Component({
  components: {
    PortfolioSummary,
  },
})
export default class ViewPortfolio extends Vue {
  @State("portfolios") portfoliosState!: PortfoliosState;
  @Action("loadPortfolioDrafts", { namespace })
  loadPortfolioDrafts!: (n: void) => Promise<void>;
  @Action("deletePortfolioDraft", { namespace })
  deletePortfolioDraft!: (draftId: string) => Promise<void>;

  get portfolios(): PortfolioDraft[] {
    return this.portfoliosState.portfolioDrafts
      ? this.portfoliosState.portfolioDrafts
      : [];
  }

  private async mounted(): Promise<void> {
    await this.loadPortfolioDrafts();
  }

  private async onDeletePortfolio(id: string) {
    if (id != "") {
      await this.deletePortfolioDraft(id);
      await this.loadPortfolioDrafts();
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
