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
  // dummy data until backend ready
  public portfolioCardData: PortfolioCardData[] = [
    {
      title: "ABC123 portfolio",
      status: "Processing",
      csp: "aws",
      branch: "Joint Force",
      lastModified: "Started 23 minutes ago",
      currentPoP: "",
      totalObligated: "",
      fundsSpent: "",
      fundsSpentPercent: "",
    },
    {
      title: "Army-Navy Game",
      status: "Active",
      csp: "azure",
      branch: "Army",
      lastModified: "Last modified Sept. 1, 2022",
      currentPoP: "Oct. 1, 2022 - Sept. 31, 2023",
      totalObligated: "$1,000,000.00",
      fundsSpent: "$500,000",
      fundsSpentPercent: "50",
    },
    {
      title: "DEF456 portfolio",
      status: "At-Risk",
      csp: "google",
      branch: "Navy",
      lastModified: "Last modified Sept. 1, 2022",
      currentPoP: "",
      totalObligated: "",
      fundsSpent: "",
      fundsSpentPercent: "",
    },
    {
      title: "GHI789 portfolio",
      status: "Delinquent",
      csp: "oracle",
      branch: "Marine Corps",
      lastModified: "Last modified Sept. 1, 2022",
      currentPoP: "",
      totalObligated: "",
      fundsSpent: "",
      fundsSpentPercent: "",
    },
  ];

}
</script>

