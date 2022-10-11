<template>
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
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import PortfolioCard from "./PortfolioCard.vue";
import { PortfolioCardData, ToastObj } from "types/Global";
import PortfolioSummary from "@/store/portfolioSummary";
import Toast from "@/store/toast";
import { StatusTypes } from "@/store/acquisitionPackage";
import { createDateStr, toCurrencyString } from "@/helpers";
import { formatDistanceToNow } from "date-fns";
import {PortfolioSummarySearchDTO} from "@/api/models";

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

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    let portfolioSearchDTO: PortfolioSummarySearchDTO = {
      role: "ALL",
      // csps: ['CSP_D'],
      csps: [],
      sort: "name",
      portfolioStatus: "",
      fundingStatuses: ["AT_RISK","DELINQUENT","ON_TRACK", "EXPIRING_SOON"],
      searchString: ""
    }
    const storeData = await PortfolioSummary.searchPortfolioSummaryList(portfolioSearchDTO);
    
    // below used to map stub CSPs to actual CSPs until have actual CSP data
    const cspStubs = ["CSP_A", "CSP_B", "CSP_C", "CSP_D", "CSP_Mock"];
    const csps = ["aws", "azure", "google", "oracle", "oracle"];

    storeData.portfolioSummaryList.forEach((portfolio) => {
      // NOTE: ARCHIVED status is post MVP
      if (portfolio.portfolio_status.toLowerCase() !== StatusTypes.Archived.toLowerCase()) {
        let cardData: PortfolioCardData = {};
        cardData.csp = csps[cspStubs.indexOf(portfolio.csp_display)];
        cardData.sysId = portfolio.sys_id;
        cardData.title = portfolio.name;
        cardData.status = portfolio.portfolio_status;
        cardData.serviceAgency = portfolio.dod_component;
        // lastModified - if status is "Processing" use "Started ... ago" string
        if (cardData.status.toLowerCase() === StatusTypes.Processing.toLowerCase()) {
          const agoString = formatDistanceToNow(new Date(portfolio.sys_updated_on));
          cardData.lastModifiedStr = "Started " + agoString + " ago";
        } else {
          const updatedDate = createDateStr(portfolio.sys_updated_on, true);
          cardData.lastModifiedStr = "Last modified " + updatedDate;
        }
        if (portfolio.task_orders && portfolio.task_orders.length) {
          cardData.taskOrderNumber = portfolio.task_orders[0].task_order_number;

          const popStart = createDateStr(portfolio.task_orders[0].pop_start_date, true);
          const popEnd = createDateStr(portfolio.task_orders[0].pop_end_date, true);
          cardData.currentPoP = popStart + " - " + popEnd;
        }

        if (portfolio.portfolio_status.toLowerCase() !== StatusTypes.Processing.toLowerCase()) {
          cardData.totalObligated = "$" + toCurrencyString(portfolio.funds_obligated);
          cardData.fundsSpent = "$" + toCurrencyString(portfolio.funds_spent);
          cardData.fundsSpentPercent = String(Math.round(
            portfolio.funds_spent / portfolio.funds_obligated * 100
          ));
        }

        this.portfolioCardData.push(cardData);
      }
    });

    // future ticket - set isHaCCAdmin value with data from backend when implemented
    this.isHaCCAdmin = true;
  }
}
</script>

