<template>
  <div>
    <div class="mt-10">
      <PortfolioCard
        v-for="(cardData, index) in portfolioCardData"
        :key="index"
        :cardData="cardData"
        :index="index"
        :isLastCard="index === portfolioCardData.length - 1"
        :isHaCCAdmin="isHaCCAdmin"
        @leavePortfolio="leavePortfolio"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import PortfolioCard from "./PortfolioCard.vue";
import { PortfolioCardData, ToastObj } from "types/Global";
import Toast from "@/store/toast";

@Component({
  components: {
    PortfolioCard
  }
})

export default class AllPortfolios extends Vue {
  public portfolioCardData: PortfolioCardData[] = []
  public isHaCCAdmin = false;

  public leavePortfolio(sysId: string): void {
    this.portfolioCardData = this.portfolioCardData.filter(
      obj => obj.sys_id !== sysId
    );
    const accessRemovedToast: ToastObj = {
      type: "success",
      message: "Portfolio access removed",
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };

    Toast.setToast(accessRemovedToast);

    // future ticket, remove member from portfolio table in snow
    // after removed, make new call to reload portfolio list if > 10 portfolios
    // to ensure 10 listed on page
  }

  // delete this function when backend hooked up with actual data
  public async generateDummyObj(
    // eslint-disable-next-line camelcase
    sys_id?: string,
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
      // eslint-disable-next-line camelcase
      sys_id, title, status, csp, branch, lastModified, currentPoP, 
      totalObligated, fundsSpent, fundsSpentPercent
    }
  }

  // delete this function when backend hooked up with actual data
  public async generateDummyData(): Promise<void> {
    const cardObjValues = [
      /* eslint-disable max-len */
      ["1234567890", "ABC123 portfolio", "Processing", "aws", "Joint Force", "Started 23 minutes ago"],
      ["2345678901", "Army-Navy Game", "Active", "azure", "Army", "Last modified Sept. 1, 2022", "Oct. 1, 2022 - Sept. 31, 2023", "$1,000,000.00", "$500,000", "50"],
      ["3456789012", "DEF456 portfolio", "At-Risk", "google", "Navy", "Last modified Sept. 2, 2022"],
      ["4567890123", "GHI789 portfolio", "Delinquent", "oracle", "Marine Corps", "Last modified Sept. 3, 2022"]
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
    
    // future ticket - set isHaCCAdmin value with data from backend when implemented
    this.isHaCCAdmin = true; 
  }
}
</script>

