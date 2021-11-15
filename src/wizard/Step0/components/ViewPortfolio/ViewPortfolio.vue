<template>
  <div>
    <div class="view-portfolio bg-white px-14 py-6">
      <div class="d-flex">
        <h1 tabindex="-1" class="mb-3">Portfolios</h1>
        <div class="ml-auto">
          <v-btn
            id="btn-create-new-portfolio"
            outlined
            class="primary mr-4"
            :ripple="false"
            role="link"
          >
            Export
          </v-btn>
          <v-btn
            id="btn-create-new-portfolio"
            class="primary"
            :ripple="false"
            @click="onCreatePortfolio"
            role="link"
          >
            Create Portfolio
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-space-between pt-6">
        <div class="d-flex width-40">
          <v-text-field
            class="search-bar"
            placeholder="Search all portfolios"
            dense
            outlined
            single-line
            hide-details
            clearable
            aria-label="Search"
          />
          <v-btn
            class="input-search-bar"
            color="primary"
            aria-label="Search Portfolio"
          >
            <v-icon>search</v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-center">
          <p class="body-lg text--base mb-0 pr-1">Sort:</p>
          <a role="button" class="body-lg text--primary-dark mb-0 pr-5">
            Portfolio Name A-Z
            <v-icon class="text--primary-dark">expand_more</v-icon>
          </a>
          <v-btn class="filter" outlined>
            <v-icon class="icon-24">filter_alt</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div>
      <v-divider />
    </div>
    <!--    <v-row class="portfolio-banner">-->
    <!--      <v-col class="d-flex justify-space-between align-center">-->
    <!--        <div class="h2">My Portfolios</div>-->
    <!--        <div>-->
    <!--          <v-btn-->
    <!--            id="btn-create-new-portfolio"-->
    <!--            class="primary"-->
    <!--            :ripple="false"-->
    <!--            @click="onCreatePortfolio"-->
    <!--            role="link"-->
    <!--          >-->
    <!--            Create a New Portfolio-->
    <!--          </v-btn>-->
    <!--        </div>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <v-row>-->
    <!--      <v-col cols="6" v-if="portfolios && portfolios.length > 0">-->
    <!--        <portfolio-summary-->
    <!--          :portfolioDrafts="portfolios"-->
    <!--          v-on:delete="onDeletePortfolio"-->
    <!--          v-on:edit="onEditPortfolio"-->
    <!--        ></portfolio-summary>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PortfolioDraft } from "types/Portfolios";
import PortfolioSummary from "./PortfolioSummary.vue";
import { State, Action } from "vuex-class";
import { PortfoliosState } from "@/store/types";
import ATATDivider from "@/components/ATATDivider.vue";

const namespace = "portfolios";

@Component({
  components: {
    ATATDivider,
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
    return this.portfoliosState.portfolioDrafts;
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
