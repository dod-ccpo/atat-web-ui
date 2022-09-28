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
    managerEmails?: string,
    branch?: string,
    lastModified?: string,
    currentPoP?: string,
    totalObligated?: string,
    fundsSpent?: string,
    fundsSpentPercent?: string,
  ): Promise<PortfolioCardData> {
    return {
      title, status, csp, managerEmails, branch, lastModified, currentPoP, 
      totalObligated, fundsSpent, fundsSpentPercent
    }
  }

  // delete this function when backend hooked up with actual data
  public async generateDummyData(): Promise<void> {
    const cardObjValues = [
      /* eslint-disable max-len */
      ["ABC123 portfolio", "Processing", "aws", "foo@mail.mil,bar@mail.mil", "Joint Force", "Started 23 minutes ago"],
      ["Army-Navy Game", "Active", "azure", "foo@mail.mil,bar@mail.mil,baz@mail.mil", "Army", "Last modified Sept. 1, 2022", "Oct. 1, 2022 - Sept. 31, 2023", "$1,000,000.00", "$500,000", "50"],
      ["DEF456 portfolio", "At-Risk", "google", "foo@mail.mil", "Navy", "Last modified Sept. 2, 2022"],
      ["GHI789 portfolio", "Delinquent", "oracle", "qux@mail.mil", "Marine Corps", "Last modified Sept. 3, 2022"]
      /* eslint-enable max-len */
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

