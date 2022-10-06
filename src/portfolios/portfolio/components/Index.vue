
<template>
  <div  style="overflow: hidden;">
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <v-main
      class="_dashboard"
      :class="[tabItems[tabIndex] === 'Funding Tracker'? '_funding-dashboard':'']"
    >
      <PortfolioSummaryPageHead
        headline="Portfolio Summary"
        :items ="tabItems"
        :value.sync="tabIndex"
        :title.sync="title"
        :portfolioStatus="portfolioStatus"
      />
      <v-container
        :class="[tabItems[tabIndex] === 'Task Orders'?
         'container-max-width-wide':'container-max-width'
         ]"
        style="margin-bottom:300px !important"
      >
          <FundingTracker v-if="tabItems[tabIndex] === 'Funding Tracker'" />
          <TaskOrder v-if="tabItems[tabIndex] === 'Task Orders'"/>
          <CSPPortalAccess
            v-if="tabItems[tabIndex] === 'CSP Portal Access'"
            :portfolioCSP="portfolioCSP"
          />
      </v-container>
      <ATATFooter/>

    </v-main>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATFooter from "@/components/ATATFooter.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATToast from "@/components/ATATToast.vue";
import PortfolioSummaryPageHead from
  "@/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.vue";
import CSPPortalAccess from "@/portfolios/portfolio/components/CSPPortalAccess/CSPPortalAccess.vue";
import FundingTracker from "@/portfolios/portfolio/components/FundingTracker/FundingTracker.vue";
import TaskOrder from "@/portfolios/portfolio/components/TaskOrder/TaskOrder.vue";
import PortfolioData from "@/store/portfolio";
import AppSections from "@/store/appSections";

@Component({
  components: {
    CSPPortalAccess,
    TaskOrder,
    FundingTracker,
    PortfolioSummaryPageHead,
    ATATFooter,
    ATATSlideoutPanel,
    ATATToast,
  }
})
export default class PortfolioSummary extends Vue {

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public tabIndex = 0;
  public tabItems = [
    "Funding Tracker",
    "Task Orders",
    "CSP Portal Access"
  ]
  public title = ""
  public portfolioStatus = ""
  public portfolioDescription = ""
  public portfolioCSP = ""

  public async loadOnEnter(): Promise<void>  {
    // grab data from store
    await PortfolioData.initialize()
    const portfolio = PortfolioData.portfolio
    if(portfolio){
      this.title = portfolio.title || "";
      this.portfolioStatus = portfolio.status || "";
      this.portfolioDescription = portfolio.description || "";
      this.portfolioCSP = portfolio.csp || "";
    }
  }
  public async mounted(): Promise<void>{
    await this.loadOnEnter();
    const activeTabIndex = AppSections.activeTabIndex;
    if (activeTabIndex > 0) {
      this.tabIndex = activeTabIndex;
      await AppSections.setActiveTabIndex(0);
    }
  }
}
</script>

