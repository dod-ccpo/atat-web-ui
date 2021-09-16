<template>
  <atat-summary-card
    emptyCard="Portfolio"
    cardWidth="120"
    :data="cardsData"
  ></atat-summary-card>
</template>

<script lang="ts">
import { Portfolio } from "types/Portfolios";
import {
  ATATSummaryCardGroupedItems,
  ATATSummaryCardItem,
  ATATSummaryCards,
} from "types/Wizard";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class PortfolioSummary extends Vue {
  @Prop()
  portfolios!: Portfolio[];

  private cardsData: ATATSummaryCards = {
    cards: [],
  };

  // maps from portfolio to summary grouped items
  private mapItems(portfolio: Portfolio): ATATSummaryCardGroupedItems[] {
    const items: ATATSummaryCardGroupedItems[] = [];

    if (portfolio.portfolio_managers.length > 0) {
      items.push({
        title: "Portfolio Managers",
        value: portfolio.portfolio_managers.length,
      });
    }

    if (portfolio.applications.length > 0) {
      items.push({
        title: "Applications",
        value: portfolio.applications.length,
      });

      if (portfolio.applications[0].environments) {
        items.push({
          title: "Environments",
          value: portfolio.applications[0].environments.length,
        });
      }
    }

    if (portfolio.taskOrders && portfolio.taskOrders.length > 0) {
      items.push({
        title: "Task Orders",
        value: portfolio.taskOrders.length,
      });
    }

    return items;
  }

  // maps portfolio data to summary card
  private mapToSummaryCard(portfolio: Portfolio): ATATSummaryCardItem {
    const cardItem: ATATSummaryCardItem = {
      type: "PORTFOLIO",
      title: portfolio.name,
      description: portfolio.description,
      showChevronRight: true,
      items: this.mapItems(portfolio),
      leftButtonText: "OPEN",
    };

    return cardItem;
  }

  @Watch("portfolios")
  onPortfoliosChanged() {
    const cards = this.portfolios.map<ATATSummaryCardItem>((portfolio) =>
      this.mapToSummaryCard(portfolio)
    );

    this.cardsData.cards = cards;
  }
}
</script>
