<template>
  <div>
  
    <div class="
      bg-base-lightest mt-10 pa-4 border-rounded 
      d-flex justify-space-between align-center
    ">
      <ATATSearch 
        id="SearchPortfolios"
        placeHolder="Search portfolios"
        width="450"
      />
      <div class="d-flex align-center">
        <div>
          <ATATSelect
            id="PortfolioSort"
            class="_small _alt-style-clean _invite-members-modal"
            :items="sortOptions"
            width="170"
            :selectedValue.sync="selectedSort"
            iconType="chevron"
          />
        </div>
        <div>
          <v-btn
            class="_icon-only mr-2"
            id="FilterButton"
            @click="openFilterSlideout"
            @keydown.enter="openFilterSlideout"
            @keydown.space="openFilterSlideout"
          >
            <ATATSVGIcon
              name="filters"
              width="14"
              height="14"
              color="base-dark"
            />
          </v-btn>
          
        </div>
      </div>

    </div>
    
    <div class="mt-10">
      <PortfolioCard
        v-for="(cardData, index) in portfolioCardData"
        :key="index"
        :cardData="cardData"
        :index="index"
        :isLastCard="index === portfolioCardData.length - 1"
      />
    </div>

  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATSearch from "@/components/ATATSearch.vue"
import ATATSelect from "@/components/ATATSelect.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import FilterSlideout from "./FiltersSlideout.vue";
import PortfolioCard from "./PortfolioCard.vue";

import { PortfolioCardData, SelectData, SlideoutPanelContent } from "types/Global";
import SlideoutPanel from "@/store/slideoutPanel";

@Component({
  components: {
    ATATSearch,
    ATATSelect,
    ATATSVGIcon,
    PortfolioCard,
  }
})

export default class AllPortfolios extends Vue {
  public portfolioCardData: PortfolioCardData[] = []

  public selectedSort = "alpha";
  public sortOptions: SelectData[] = [
    { text: "Portfolio name A-Z", value: "alpha" },
    { text: "Recently modified", value: "modified" },
  ];
  public showFilters = false;
  public async openFilterSlideout(e: Event): Promise<void> {
    debugger;
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      const slideoutPanelContent: SlideoutPanelContent = {
        component: FilterSlideout,
      }
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
      this.showFilters = true;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  // delete this function when backend hooked up with actual data
  public async generateDummyObj(
    title?: string,
    status?: string,
    csp?: string,
    branch?: string,
    lastModified?: string,
    currentPoP?: string,
    totalObligated?: string,
    fundsSpent?: string,
    fundsSpentPercent?: string,
  ): Promise<PortfolioCardData> {
    return {
      title, status, csp, branch, lastModified, currentPoP, 
      totalObligated, fundsSpent, fundsSpentPercent
    }
  }

  // delete this function when backend hooked up with actual data
  public async generateDummyData(): Promise<void> {
    const cardObjValues = [
      ["ABC123 portfolio", "Processing", "aws", "Joint Force", "Started 23 minutes ago"],
      // eslint-disable-next-line max-len
      ["Army-Navy Game", "Active", "azure", "Army", "Last modified Sept. 1, 2022", "Oct. 1, 2022 - Sept. 31, 2023", "$1,000,000.00", "$500,000", "50"],
      ["DEF456 portfolio", "At-Risk", "google", "Navy", "Last modified Sept. 2, 2022"],
      ["GHI789 portfolio", "Delinquent", "oracle", "Marine Corps", "Last modified Sept. 3, 2022"]
    ]
    cardObjValues.forEach(async (values) => {
      const obj = await this.generateDummyObj(...values);
      this.portfolioCardData.push(obj);
    });
  }

  public async mounted(): Promise<void> {
    // delete next line when backend hooked up with actual data
    await this.generateDummyData();
  }
}
</script>

