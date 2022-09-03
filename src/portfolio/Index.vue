
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
      />
      <v-container class="container-max-width bg-base-lightest">
        {{ tabItems[tabIndex] }}
      </v-container>
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

@Component({
  components: {
    PortfolioSummaryPageHead,
    ATATFooter,
    ATATSlideoutPanel,
  }
})
export default class Portfolio extends Vue {

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  };

  public tabIndex = 0;
  public tabItems = [
    "Funding Tracker",
    "Task Order",
    "CSP Portal Access"
  ]

  public selectedTab = this.tabItems[this.tabIndex]

  public async mounted(): Promise<void>{
    // const slideoutPanelContent: SlideoutPanelContent = {
    //   component: FinancialDataLearnMore,
    //   title: "Learn More",
    // }
    // await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    // await this.loadOnEnter();
  }
}
</script>

