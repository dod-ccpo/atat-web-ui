
<template>
  <div  style="overflow: hidden;">
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <div class="_secondary-page-tabs" v-if="showSecondaryTabs">
      <v-tabs v-model="selectedSecondaryTab">
        <v-tab 
          v-for="(tabItem, index) in secondaryTabItems" 
          :key="index"
          :id="getIdText(tabItem + 'Tab')"
          @click="secondaryTabClick(index)"
        >
          {{ tabItem.tabText }}
          <span v-if="showWarningIcon(tabItem.status)" class="pl-2">
            <ATATSVGIcon 
              name="warning"
              color="warning-dark2"
              width="16"
              height="16"
            />
          </span>
        </v-tab>
      </v-tabs>
    </div>

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
              :environmentIndex.sync="selectedSecondaryTab"
            />
        </v-container>

        <Provisioned v-else style="margin-bottom: 100px;"/>

      <ATATFooter/>

    </v-main>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";
import ATATFooter from "@/components/ATATFooter.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import ATATToast from "@/components/ATATToast.vue";
import PortfolioSummaryPageHead from
  "@/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.vue";
import CSPPortalAccess from "@/portfolios/portfolio/components/CSPPortalAccess/CSPPortalAccess.vue";
import FundingTracker from "@/portfolios/portfolio/components/FundingTracker/FundingTracker.vue";
import TaskOrder from "@/portfolios/portfolio/components/TaskOrder/TaskOrder.vue";

import Provisioned from "@/portfolios/provisioning/Provisioned.vue";

import PortfolioStore from "@/store/portfolio";
import AppSections from "@/store/appSections";
import {getIdText} from "@/helpers";
import { Statuses } from "@/store/acquisitionPackage";
import _ from "lodash";

@Component({
  components: {
    CSPPortalAccess,
    TaskOrder,
    FundingTracker,
    PortfolioSummaryPageHead,
    ATATFooter,
    ATATSlideoutPanel,
    ATATSVGIcon,
    ATATToast,
    Provisioned,
  }
})
export default class PortfolioSummary extends Vue {

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }
  public isPortfolioProvisioning = true;
  public tabIndex = 0;
  public tabItems = [
    "Funding Tracker",
    "Task Orders",
    "CSP Portal Access"
  ];

  private getIdText(string: string) {
    return getIdText(string);
  }

  public get showSecondaryTabs(): boolean {
    return this.tabIndex === 2 && this.secondaryTabItems.length > 1;
  } 
  public secondaryTabItems: Record<string, string>[] = [];

  public title = ""
  public portfolioStatus = ""
  public portfolioDescription = ""
  public portfolioCSP = ""

  public selectedSecondaryTab = 0;
  public secondaryTabClick(index: number): void {
    this.selectedSecondaryTab = index;
  }
  public showWarningIcon(status: string): boolean {
    return status === Statuses.ProvisioningIssue.value;
  }
 
  public get activeTabIndex(): number {
    return AppSections.activeTabIndex;
  }
  @Watch("activeTabIndex")
  public activeTabIndexChanged(newVal: number): void {
    this.tabIndex = newVal;
  }

  public async loadOnEnter(): Promise<void>  {
    const portfolio = _.cloneDeep(PortfolioStore.currentPortfolio);
    if(portfolio.sysId){
      this.isPortfolioProvisioning = false;
      this.title = portfolio.title || "";
      this.portfolioStatus = portfolio.status || "";
      this.portfolioDescription = portfolio.description || "";
      this.portfolioCSP = portfolio.csp || "";

      const envs = portfolio.environments;

      if (envs?.length) {
        const classificationLevels: Record<string, string> = {
          U: "Unclassified",
          S: "Secret",
          TS: "Top Secret",
        }

        envs.forEach(env => {
          const c = env.classification_level;
          if (c) {
            const classificationLevel = classificationLevels[c];
            const envStatus = env.environmentStatus;
            this.secondaryTabItems.push({
              tabText: classificationLevel,
              status: envStatus as string,
            });
          }
        })
      }

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

