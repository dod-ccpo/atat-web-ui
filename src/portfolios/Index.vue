<template>
  <v-main class="pb-20">
    <div>
      Future Portfolios page
    </div>
    <v-btn @click="changeSection">
      link portfolio Summary
    </v-btn>

    <div class="mt-10" style="padding-bottom: 100px;">
      <PortfolioCard
        v-for="(cardData, index) in portfolioCardData"
        :key="index"
        :cardData="cardData"
        :index="index"
        :isLastCard="index === portfolioCardData.length - 1"
      />
    </div>

  </v-main>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import PortfolioCard from "./components/PortfolioCard.vue";

import AppSections from "@/store/appSections";
import { PortfolioCardData } from "types/Global";

@Component({
  components: {
    PortfolioCard
  }
})

export default class Portfolios extends Vue {
  public async changeSection(): Promise<void> {
    AppSections.changeActiveSection("Portfolio Summary")
  }

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

