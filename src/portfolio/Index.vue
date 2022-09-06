
<template>
  <div  style="overflow: hidden;">
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>
    <v-main class="_dashboard bg-base-lightest">
      <PortfolioSummaryPageHead
        headline="Portfolio Summary"
        :items ="tabItems"
        :value.sync="tabIndex"
        :title.sync="title"
        :portfolioStatus="portfolioStatus"
      />
      <v-container class="container-max-width bg-base-lightest">
            <FundingTracker v-if="tabItems[tabIndex] === 'Funding Tracker'" />
            <TaskOrder v-if="tabItems[tabIndex] === 'Task Order'"/>
            <CSPPortalAccess v-if="tabItems[tabIndex] === 'CSP Portal Access'" />
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
import PortfolioSummaryPageHead from "@/portfolio/components/PortfolioSummaryPageHead.vue";
import CSPPortalAccess from "@/portfolio/CSPPortalAccess.vue";
import FundingTracker from "@/portfolio/FundingTracker.vue";
import TaskOrder from "@/portfolio/TaskOrder.vue";
import PortfolioDrawer from "@/portfolio/components/PortfolioDrawer.vue";
import { SlideoutPanelContent } from "../../types/Global";
import PortfolioData from "@/store/portfolio";

@Component({
  components: {
    CSPPortalAccess,
    TaskOrder,
    FundingTracker,
    PortfolioSummaryPageHead,
    ATATFooter,
    ATATSlideoutPanel,
  }
})
export default class Portfolio extends Vue {

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public tabIndex = 0;
  public tabItems = [
    "Funding Tracker",
    "Task Order",
    "CSP Portal Access"
  ]
  public title = ""
  public portfolioStatus = ""


  public async loadOnEnter(): Promise<void>  {
    // grab data from store
    await PortfolioData.initialize()
    const portfolio = PortfolioData.portfolio
    console.log(portfolio)
    if(portfolio){
      this.title = portfolio.title || "";
      this.portfolioStatus = portfolio.status || "";
    }
  }
  public async mounted(): Promise<void>{
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PortfolioDrawer,
      title: "Learn More",
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    await this.loadOnEnter();
  }
}
</script>

