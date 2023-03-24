
<template>
  <div  style="overflow: hidden;">
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <v-main
      class="_dashboard"
      :class="[
        {'_funding-dashboard': tabItems[tabIndex] === 'Funding Tracker'},
        {'bg-white': isPortfolioProvisioning}
      ]"
    >
        <PortfolioSummaryPageHead
          headline="Portfolio Summary"
          :items ="tabItems"
          :value.sync="tabIndex"
          :title.sync="title"
          :portfolioStatus="portfolioStatus"
          :isPortfolioProvisioning="isPortfolioProvisioning"
        />
        <v-container
          v-if="!isPortfolioProvisioning"
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

        <Provisioned v-else style="margin-bottom: 100px;"/>

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

import Provisioned from "@/portfolios/provisioning/Provisioned.vue";

import PortfolioStore from "@/store/portfolio";
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
    Provisioned,
  }
})
export default class PortfolioSummary extends Vue {

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }
  public isPortfolioProvisioning = false;
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
    const portfolio = PortfolioStore.currentPortfolio;
    if(portfolio.sysId){
      this.title = portfolio.title || "";
      this.portfolioStatus = portfolio.status || "";
      this.portfolioDescription = portfolio.description || "";
      this.portfolioCSP = portfolio.csp || "";
    } else {
      const provisioningData = await PortfolioStore.getPortfolioProvisioningObj();
      this.isPortfolioProvisioning = true;
      this.title = provisioningData.portfolioTitle || "Untitled Portfolio"
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

