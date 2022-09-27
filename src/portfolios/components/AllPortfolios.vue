<template>
  <div>
  
    Future page for All Portfolios

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
import PortfolioCard from "./PortfolioCard.vue";
import { PortfolioCardData } from "types/Global";

@Component({
  components: {
    PortfolioCard
  }
})

export default class AllPortfolios extends Vue {
  public portfolioCardData: PortfolioCardData[] = []

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

