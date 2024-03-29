
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
      class="_dashboard _scroll-y"
      :class="[
        {'_funding-dashboard': tabItems[tabIndex] === 'Funding Tracker'},
        {'bg-white': isPortfolioProvisioning},
      ]"
    >
        <PortfolioSummaryPageHead
          headline="Portfolio Summary"
          :items ="tabItems"
          :environmentLinks="environmentLinks"
          :value="tabIndex"
          @update:value="tabIndex = $event"
          :title="title"
          @update:title="title = $event"
          :isPortfolioProvisioning="isPortfolioProvisioning"
          @leavePortfolio="openLeavePortfolioModal"
        />
        
        <v-container
          v-if="!isPortfolioProvisioning"
          :class="[tabItems[tabIndex] === 'Task Orders'?
          'container-max-width-wide':'container-max-width'
          ]"
          style="margin-bottom:300px !important"
        >
            <FundingTracker v-if="tabItems[tabIndex] === 'Funding Tracker'" />
            <TaskOrder 
            v-if="tabItems[tabIndex] === 'Task Orders'" 
            :portfolioSysId="portfolioSysId"
            :taskOrder = "taskOrder"
            @update:taskOrder = "taskOrder = $event"
            />
        </v-container>

        <PortfolioProvisioned v-else style="margin-bottom: 100px;"/>
        <LeavePortfolioModal
          :showModal="showLeavePortfolioModal" 
          :portfolioName="getCurrentPortfolioTitle"
          @okClicked="leavePortfolio"
          @cancelClicked="closeLeavePortfolioModal"
          :showLeaveModalSpinner="showLeaveModalSpinner"
        />
      <ATATFooter/>

    </v-main>
  </div>
</template>
<script lang="ts">
import { Component, Watch,  Vue, toNative } from "vue-facing-decorator";
import ATATFooter from "@/components/ATATFooter.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"
import ATATToast from "@/components/ATATToast.vue";
import PortfolioSummaryPageHead from
  "@/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.vue";
import FundingTracker from "@/portfolios/portfolio/components/FundingTracker/FundingTracker.vue";
import TaskOrder from "@/portfolios/portfolio/components/TaskOrder/TaskOrder.vue";

import PortfolioProvisioned from "@/portfolios/provisioning/PortfolioProvisioned.vue";

import PortfolioStore from "@/store/portfolio";
import AppSections from "@/store/appSections";
import {getIdText} from "@/helpers";
import { Statuses } from "@/store/acquisitionPackage";
import _ from "lodash";
import { ToastObj, EnvironmentLink, PortfolioTaskOrder } from "types/Global";
import Toast from "@/store/toast";
import LeavePortfolioModal from "./shared/LeavePortfolioModal.vue";

@Component({
  components: {
    TaskOrder,
    FundingTracker,
    PortfolioSummaryPageHead,
    ATATFooter,
    ATATSlideoutPanel,
    ATATSVGIcon,
    ATATToast,
    PortfolioProvisioned,
    LeavePortfolioModal
  }
})

class PortfolioSummary extends Vue {

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }
  public showLeaveModalSpinner = false;
  public isPortfolioProvisioning = true;
  public taskOrder!: PortfolioTaskOrder;
  public environmentLinks:EnvironmentLink[] = []
  public tabIndex = 0;
  public tabItems = [
    "Funding Tracker",
    "Task Orders"
  ];

  public get showLeavePortfolioModal(): boolean {
    return PortfolioStore.showLeavePortfolioModal;
  }

  public openLeavePortfolioModal():void {
    PortfolioStore.setShowLeavePortfolioModal(true);
  }

  public get getCurrentPortfolioTitle(){
    return PortfolioStore.currentPortfolio.title;
  }

  public closeLeavePortfolioModal(): void {
    PortfolioStore.setShowLeavePortfolioModal(false);
  }

  public async leavePortfolio(): Promise<void> {
    this.showLeaveModalSpinner = true;
    await PortfolioStore.leavePortfolio()
    this.showLeaveModalSpinner = false;
    this.closeLeavePortfolioModal()
    AppSections.changeActiveSection(AppSections.sectionTitles.Home);
    
    const accessRemovedToast: ToastObj = {
      type: "success",
      message: "Portfolio access removed",
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };

    Toast.setToast(accessRemovedToast);
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public get showSecondaryTabs(): boolean {
    return this.tabIndex === 2 && this.secondaryTabItems.length > 1;
  } 
  public secondaryTabItems: Record<string, string>[] = [];

  public title = ""
  public portfolioDescription = ""
  public portfolioCSP = ""
  public portfolioSysId = ""

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
      this.title = portfolio.title ?? "";
      this.portfolioDescription = portfolio.description ?? "";
      this.portfolioCSP = portfolio.csp ?? "";
      this.portfolioSysId = portfolio.sysId;
      this.taskOrder = portfolio.taskOrder as PortfolioTaskOrder;
      portfolio.environments?.forEach((environment) =>{
        if(environment.dashboard_link && environment.classification_level === "U"){
          const linkDisplay = environment.csp_display.split("_")[1].toUpperCase();
          this.environmentLinks.push({
            display: linkDisplay,
            link: environment.dashboard_link
          })
        }
      })
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
            const envStatus = env.environment_status;
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
      this.title = provisioningData.portfolioTitle ?? "Untitled Portfolio"
    }
    
  }
  public async mounted(): Promise<void>{
    await this.loadOnEnter();
    const activeTabIndex = AppSections.activeTabIndex;
    if (activeTabIndex > 0) {
      this.tabIndex = activeTabIndex;
    }
  }
}
export default toNative(PortfolioSummary)
</script>

