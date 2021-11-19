<template>
  <div class="wizard-content">
    <h2 aria-label="A paginated list of draft portfolios">
      <v-icon class="text--base-darkest">expand_less</v-icon>
      Drafts
      <span class="font-size-19 text--base ml-1">15</span>
    </h2>
    <atat-portfolio-summary-card
      :data="cardsData"
      tempPortfolioStatus="draft"
      tempPortfolioType="draft"
      @portfolio-edit="(id) => $emit('portfolio-edit', id)"
      @portfolio-delete="(id) => $emit('portfolio-delete', id)"
      return-focus-element-id-ok="btn-create-new-portfolio"
    />

    <h2 aria-label="A paginated list of active portfolios">
      <v-icon class="text--base-darkest">expand_less</v-icon>
      Active
      <span class="font-size-19 text--base ml-1">15</span>
    </h2>
    <atat-portfolio-summary-card
      :data="cardsData"
      tempPortfolioType="active"
      tempPortfolioStatus="testing only"
      @portfolio-edit="(id) => $emit('portfolio-edit', id)"
      @portfolio-delete="(id) => $emit('portfolio-delete', id)"
      return-focus-element-id-ok="btn-create-new-portfolio"
    />

    <h2 aria-label="A paginated list of archived portfolios">
      <v-icon class="text--base-darkest">expand_less</v-icon>
      Archived
      <span class="font-size-19 text--base ml-1">15</span>
    </h2>
    <atat-portfolio-summary-card
      :data="cardsData"
      tempPortfolioType="archived"
      tempPortfolioStatus="archived"
      @portfolio-edit="(id) => $emit('portfolio-edit', id)"
      @portfolio-delete="(id) => $emit('portfolio-delete', id)"
      return-focus-element-id-ok="btn-create-new-portfolio"
    />
  </div>
</template>

<script lang="ts">
import { PortfolioDraft } from "types/Portfolios";
import {
  ATATSummaryCardGroupedItems,
  ATATSummaryCardItem,
  ATATSummaryCards,
} from "types/Wizard";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import ATATPortfolioSummaryCard from "@/components/ATATPortfolioSummaryCard.vue";

@Component({
  components: {
    "atat-portfolio-summary-card": ATATPortfolioSummaryCard,
  },
})
export default class PortfolioSummary extends Vue {
  @Prop()
  portfolioDrafts!: PortfolioDraft[];

  private cardsData: ATATSummaryCards = {
    cards: [],
  };

  private itemToDelete = "";

  // maps from portfolio to summary grouped items
  private mapItems(
    portfolioDraft: PortfolioDraft
  ): ATATSummaryCardGroupedItems[] {
    const items: ATATSummaryCardGroupedItems[] = [];

    if (portfolioDraft.num_portfolio_managers > 0) {
      items.push({
        title: "Portfolio Managers",
        value: portfolioDraft.num_portfolio_managers,
      });
    }

    if (portfolioDraft.num_applications > 0) {
      items.push({
        title: "Applications",
        value: portfolioDraft.num_applications,
      });

      if (portfolioDraft.num_environments > 0) {
        items.push({
          title: "Environments",
          value: portfolioDraft.num_environments,
        });
      }
    }

    if (portfolioDraft.num_task_orders > 0) {
      items.push({
        title: "Task Orders",
        value: portfolioDraft.num_task_orders,
      });
    }

    return items;
  }

  // maps portfolio data to summary card
  private mapToSummaryCard(
    portfolioDraft: PortfolioDraft
  ): ATATSummaryCardItem {
    const cardItem: ATATSummaryCardItem = {
      id: portfolioDraft.id,
      type: "PORTFOLIO",
      title: portfolioDraft.name || "Untitled",
      description: portfolioDraft.description,
      showChevronRight: true,
      items: this.mapItems(portfolioDraft),
      leftButtonText: "OPEN",
      rightButtonText: "DELETE",
    };

    return cardItem;
  }

  @Watch("portfolioDrafts")
  onPortfoliosChanged(): void {
    if (!this.portfolioDrafts) return;

    this.updateSummaryCards();
  }

  mounted(): void {
    this.updateSummaryCards();
  }

  private updateSummaryCards(): void {
    const cards = this.portfolioDrafts.map<ATATSummaryCardItem>((draft) =>
      this.mapToSummaryCard(draft)
    );

    this.cardsData.cards = cards;
  }
}
</script>
