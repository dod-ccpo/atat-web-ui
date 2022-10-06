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
import PortfolioSummary, {PortfolioSummaryStore} from "@/store/portfolioSummary";
import Toast from "@/store/toast";
import { StatusTypes } from "@/store/acquisitionPackage";

import { createDateStr } from "@/helpers";
import { formatDistanceToNow } from "date-fns";



@Component({
  components: {
    PortfolioCard
  }
})

export default class PortfoliosSummary extends Vue {
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
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioSummary.loadPortfolioSummaryList();
    debugger;
    
    // below used to map stub CSPs to actual CSPs until have actual data
    const cspStubs = ["CSP_A", "CSP_B", "CSP_C", "CSP_D", "CSP_Mock"];
    const csps = ["aws", "azure", "google", "oracle", "oracle"];

    storeData.forEach((portfolio) => {
      let cardData: PortfolioCardData = {};
      cardData.csp = csps[cspStubs.indexOf(portfolio.csp_display)];
      cardData.sysId = portfolio.sys_id;
      cardData.title = portfolio.name;
      cardData.status = portfolio.portfolio_status;
      cardData.branch = portfolio.dod_component;
      // lastModified - if status is "Processing" use "Started ... ago" string
      if (cardData.status.toLowerCase() === StatusTypes.Processing.toLowerCase()) {
        const agoString = formatDistanceToNow(new Date(portfolio.sys_updated_on));
        cardData.lastModified = "Started " + agoString + " ago";
      } else {
        const updatedDate = createDateStr(portfolio.sys_updated_on, true);
        cardData.lastModified = "Last modified " + updatedDate;
      }
      if (portfolio.task_orders && portfolio.task_orders.length) {
        cardData.taskOrderNumber = portfolio.task_orders[0].task_order_number;
      }

      this.portfolioCardData.push(cardData);

    });

    console.log('Store data in PortfoliosSummary Vue');
    console.log(JSON.stringify(storeData));
    // future ticket - set isHaCCAdmin value with data from backend when implemented
    this.isHaCCAdmin = true;
  }
}
</script>

