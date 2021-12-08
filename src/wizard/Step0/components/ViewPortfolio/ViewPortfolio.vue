<template>
  <div>
    <div class="view-portfolio bg-white px-14 py-6">
      <div class="d-flex">
        <h1 tabindex="-1" class="mb-0">Portfolios</h1>
        <div class="ml-auto">
          <v-btn
            id="btn-create-new-portfolio"
            outlined
            class="secondary-btn mr-4"
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
            aria-label="Search Term"
            v-model="searchTerm"
          />
          <v-btn
            class="input-search-bar"
            color="primary"
            aria-label="Search Portfolio"
            @click="searchPortfolios"
          >
            <v-icon>search</v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-center">
          <span class="text--base mb-0 pr-1">Sort:</span>
          <a
            role="button"
            tabindex="0"
            class="mb-0 mr-5 toggle-content"
            @click="toggleSortMenu($event)"
            @keydown.enter="toggleSortMenu($event)"
            @keydown.space="toggleSortMenu($event)"
            :class="open ? 'open' : 'closed'"
          >
            Portfolio Name A-Z
          </a>
          <v-btn
            aria-label="Open panel to filter portfolio results"
            id="PortfolioFilter"
            class="filter px-0"
            outlined
            @click="openFilterPanel"
          >
            <v-icon class="icon-24">filter_alt</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <v-row>
      <v-col v-show="showNoSearchResults" class="no-portfolio-search-results">
        <!-- temporary logic to show the no search results content -->
        <div class="wizard-content">
          <v-icon>search</v-icon>
          <h2>No results for &ldquo;{{ searchTermNoResultsDisplay }}&rdquo;</h2>
          <p>
            Please try another search term or modify filters to be less
            specific.
          </p>
          <v-btn class="primary" @click="clearSearch">
            {{ noResultsButtonText }}
          </v-btn>
        </div>
      </v-col>
      <!-- temporary logic to show the no search results content
           remove !showNoSearchResults when search logic is completed -->
      <v-col v-if="portfolios && portfolios.length > 0 && !showNoSearchResults">
        <portfolio-summary
          :portfolioDrafts="portfolios"
          v-on:delete="onDeletePortfolio"
          v-on:edit="onEditPortfolio"
          @portfolio-edit="onEditPortfolio"
          @portfolio-delete="onDeletePortfolio"
        ></portfolio-summary>
      </v-col>
    </v-row>
  </div>
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
  private open = false;
  private showNoSearchResults = false;
  private searchTerm = "";
  private searchTermNoResultsDisplay = "";
  private noResultsButtonText = "Clear Search";

  get portfolios(): PortfolioDraft[] {
    return this.portfoliosState.portfolioDrafts;
  }

  private async mounted(): Promise<void> {
    await this.loadPortfolioDrafts();
  }

  private openFilterPanel(): void {
    this.$store.dispatch("openSideDrawer", [
      "portfoliofilter",
      "PortfolioFilter",
    ]);
  }

  private toggleSortMenu(event: KeyboardEvent) {
    if (event.code !== undefined) {
      event.preventDefault();
    }
    // complete functionality in future task, for now, just toggle this.open
    this.open = !this.open;
  }

  private clearSearch(): void {
    this.showNoSearchResults = false;
    this.searchTerm = "";
  }

  private searchPortfolios(): void {
    // temporary logic until search functionality is implemented
    this.showNoSearchResults = this.searchTerm ? true : false;
    this.searchTermNoResultsDisplay = this.searchTerm;
    this.noResultsButtonText = "Clear Search";
    // when applying filters, button text will be "Clear Filters"
  }

  private async onDeletePortfolio(id: string) {
    if (id != "") {
      await this.deletePortfolioDraft(id);
      await this.loadPortfolioDrafts();
    }
  }

  private async onCreatePortfolio(): Promise<void> {
    await this.$store.dispatch("wizard/createPortfolioDraft");
    this.$router.push({ name: "addportfolio" });
  }

  private async onEditPortfolio(draftId: string): Promise<void> {
    await this.$store.dispatch("wizard/loadPortfolioDraft", draftId);
    this.$router.push({ name: "addportfolio" });
  }
}
</script>
