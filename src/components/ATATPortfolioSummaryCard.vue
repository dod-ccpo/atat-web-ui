<template>
  <div class="portfolio-summary-cards-wrapper">
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
        <div class="d-flex mb-4 flex-row-reverse flex-md-row flex-column-reverse">
          <div class="card-header flex-grow-1 foo-border">
            <a role="button" class="h3 d-block">
              {{ card.title }}
            </a>
            <a role="button" class="mr-2">Maria Missionowner</a>
            <span class="text--base-light">
              &bull;
            </span>
            <span class="text--base-dark ml-2">Army, Navy</span>
          </div>
          <div class="status-alert-banner-wrapper foo-border ml-md-5 text-md-right mb-2 mb-md-0">
              <span class="status-alert-banner warn">status banner</span>
              <!-- EJY add class "warn" for orange and "error" for red background -->
          </div>
        </div>

        <v-row>
          <v-col class="col-12 col-md-4 col-lg-3">
            <span class="data-header">Total Obligated</span>
            <span class="data-primary d-block">
              $1,000,000.00
            </span>

          </v-col>
          <v-col class="col-12 col-md-4 col-lg-3">
            <span class="data-header">Funds Spent (%)</span>
            <span class="data-primary d-block">
              $500,000.00
              <span class="funds-percent">(50%)</span>
            </span>
            <span class="data-secondary d-block">
              $500,000.00 remaining
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
import { PortfolioDraft } from "types/Portfolios";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ATATSummaryCardItem, ATATSummaryCards } from "types/Wizard";

@Component({})
export default class ATATPortfolioSummaryCard extends Vue {
  @Prop({
    default: {
      cards: [],
    },
    required: false,
  })
  private data!: ATATSummaryCards;
}
</script>

<style scoped>
  /* .foo-border {
    border: 1px solid blue;
  } */
</style>