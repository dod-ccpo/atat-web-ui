<template>
  <div>
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <v-main>
    
      <v-app-bar
        id="PageHeader"
        flat
        class="_atat-page-header _portfolios"
      >
        <div id="NameHeader" tabindex="-1">
          <h1 class="mt-5">Portfolios</h1>
          <!-- ATAT TODO AT-9553 - ABORT API calls in progress when switching between tabs -->
            <v-tabs class="_header-tab "
              v-model="tabIndex">
              <v-tab
                v-for="(tab, index) in tabItems"
                :key="index"
                :id="getIdText(tab.text) + '_Tab'"
                @click="tabClicked(tab.type)"
                class="font-size-14 pa-1 pt-2 pb-4 mr-3"
              >{{ tab.text }}</v-tab>
            </v-tabs>

        </div>
        <div class="d-flex justify-end align-center"></div>
      </v-app-bar>

      <div class="_app-content" style="padding-top: 80px;">
        <div class="_app-content-wrap">  
          <PortfoliosSummary 
            :active-tab="activeTab" 
            default-sort="name" 
            :isHomeView="false"
            @openTOModal="openTOModal"
          />
          <ATATFooter/>
        </div>
      </div>

    </v-main>
    <TaskOrderSearchModal
      :showTOSearchModal="showTOSearchModal"
      @update:showTOSearchModal="showTOSearchModal = $event"
      :TONumber="TONumber"
      @update:TONumber="TONumber = $event" 
      :resetValidationNow="resetValidationNow"
      @update:resetValidationNow="resetValidationNow = $event"
      @TOSearchCancelled="TOSearchCancelled"
      @startProvisionWorkflow="startProvisionWorkflow"
    />  
  </div>
</template>
<script lang="ts">
import { Component,  Vue, toNative } from "vue-facing-decorator";
import PortfoliosSummary from "@/portfolios/components/PortfoliosSummary.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import { getIdText } from "@/helpers";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATToast from "@/components/ATATToast.vue";
import AppSections from "@/store/appSections";
import Steps from "@/store/steps";
import TaskOrderSearchModal from "./components/TaskOrderSearchModal.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import PortfolioStore from "@/store/portfolio";
import CurrentUserStore from "@/store/user";

@Component({
  components: {
    PortfoliosSummary,
    ATATSlideoutPanel,
    ATATFooter,
    ATATToast,
    TaskOrderSearchModal
  }
})

class Portfolios extends Vue {
  public tabIndex = 0;
  public tabItems: Record<string, string>[] = [
    {
      type: "ALL",
      text: "All portfolios",
    },
    {
      type: "PROCESSING",
      text: "Processing",
    },
    {
      type: "ACTIVE",
      text: "Active",
    },
    {
      type: "ARCHIVED",
      text: "Archived",
    },
  ];
  
  public provWorkflowRouteNames = {
    AwardedTaskOrder: "Awarded_Task_Order"
  };

  public activeTab = this.tabItems[0].type;
  public showTOSearchModal = false;
  public TONumber = "";
  public resetValidationNow = false;
  public portfolioSysId = '';

  public async TOSearchCancelled(): Promise<void> {
    this.TONumber = "";
    this.resetValidationNow = true;
    this.showTOSearchModal = false;
    await PortfolioStore.setProvisioningTOFollowOn(false)
  }

  public async openTOModal(): Promise<void> {
    this.portfolioSysId = PortfolioStore.getSelectedPortfolioPackageSysId;
    this.showTOSearchModal = true;
  }

  public async startProvisionWorkflow(): Promise<void>{
    await AcquisitionPackage.reset();
    if (this.portfolioSysId) {
      await PortfolioStore.setShowTOPackageSelection(false);
    }
    this.$router.push({
      name: this.provWorkflowRouteNames.AwardedTaskOrder,
      query: {
        direction: "next"
      },
      replace: true
    })
    AppSections.changeActiveSection(AppSections.sectionTitles.ProvisionWorkflow);
  }


  private getIdText(string: string) {
    return getIdText(string);
  }

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public async tabClicked(tabType: string):Promise<void> {
    this.activeTab = tabType;
  }
  public async mounted(){
    await Steps.setAltBackDestination(AppSections.sectionTitles.Portfolios);
    await CurrentUserStore.setUserPortfolios(CurrentUserStore.currentUser.sys_id as string)
  }

}
export default toNative(Portfolios)
</script>

