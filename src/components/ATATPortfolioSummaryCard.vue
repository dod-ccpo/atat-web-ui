<template>
  <div class="portfolio-summary-cards-wrapper mb-10">
    <v-card
      v-for="(card, index) in data.cards"
      :key="index"
      class="width-100 py-5 px-6 d-flex"
      :class="{ first: index === 0, last: index === data.cards.length - 1 }"
      elevation="0"
    >
      <div class="pr-5">
        <div class="logo">
          CSP logo
        </div>
      </div>
      <div class="pr-5 flex-grow-1">
        <div class="d-flex mb-1 flex-row-reverse flex-md-row flex-column-reverse">
          <div class="card-header flex-grow-1 foo-border">
            <a role="button" @click="editPortfolio(card)" class="h3 d-block">
              {{ card.title }}
            </a>
          </div>
          <div
            v-if="tempPortfolioStatus !== ''"
            class="
              status-alert-banner-wrapper
              foo-border
              ml-md-5
              text-md-right
              mb-2 mb-md-0
            "
          >
            <span
              class="status-alert-banner"
              :class="{
                info: tempPortfolioType === 'draft',
                archived: tempPortfolioType === 'archived'
              }"
            >
              {{ tempPortfolioType === "draft" ? "Draft" : "" }}
              {{ tempPortfolioType === "archived" ? "Archived" : "" }}
            </span>
            <!-- TODO add class "warning", "error", "info" (for drafts), or "archived" to status-alert-banner for different colored backgrounds -->
          </div>
        </div>
        <div class="text--base-dark mb-4">
          <a role="button">Maria Missionowner</a>
          <atat-separator-bullet />
          <span>Army, Navy</span>

          <span v-if="tempPortfolioType === 'archived'">
            <atat-separator-bullet />
              <span class="text-no-wrap">Archived on
              Sept. 12, 2021</span>
          </span>
        </div>

        <div v-if="tempPortfolioType === 'draft'" class="text--base-dark">
          <v-icon>task_alt</v-icon>
          2 of 5 steps complete
          <atat-separator-bullet />
          Last updated Oct. 1, 2022
        </div>

        <v-row v-if="tempPortfolioType === 'active'">
          <v-col class="col-12 col-md-4 col-lg-3 col-xl-2">
            <span class="data-header">Total Obligated</span>
            <span class="data-primary d-block">
              $15,000,000.00
            </span>

          </v-col>
          <v-col class="col-12 col-md-4 col-lg-3">
            <span class="data-header">Funds Spent (%)</span>
            <span class="data-primary d-block">
              <span class="funds-spent mr-2">$10,000,000.00</span>
              <span class="funds-percent">(67%)</span>
            </span>
            <span class="data-secondary d-block">
              $5,000,000.00 remaining
            </span>
          </v-col>
          <v-col class="col-12 col-md-4 col-lg-6">
            <span class="data-header">Current Period of Performance</span>
            <span class="data-primary d-block">
              <span class="text-no-wrap">Oct. 1, 2021 &ndash;</span>&nbsp;
              <span class="text-no-wrap">Sept. 31, 2022</span>
            </span>
            <span class="data-secondary d-block">
              5 days until next period of performance
            </span>

          </v-col>
        </v-row>

      </div>
      <div>
        <v-icon>more_horiz</v-icon>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ATATSummaryCardItem, ATATSummaryCards } from "types/Wizard";
import ATATSeparatorBullet from "@/components/ATATSeparatorBullet.vue"

@Component({
  components: {
    "atat-separator-bullet": ATATSeparatorBullet,
  }
})
export default class ATATPortfolioSummaryCard extends Vue {
  @Prop({
    default: {
      cards: [],
    },
    required: false,
  })
  private data!: ATATSummaryCards;

  // EJY temp props to show draft v active cards
  @Prop({ default: "" }) private tempPortfolioType?: string;
  @Prop({ default: "" }) private tempPortfolioStatus?: string;

  public editPortfolio(card: ATATSummaryCardItem): void {
    // EJY different emits for Active and Archived portfolios?
    this.$emit("portfolio-edit", card.id);
  }
}
</script>

<style scoped>
  /* .foo-border {
    border: 1px solid blue;
  } */
</style>