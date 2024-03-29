<template>
  <v-layout 
    class="_center-content"
    :class="[
      { '_is-home': isHome },
    ]">
    <ATATTopNavBar />
    <div v-if="appContentComponent">
      <component :is="appContentComponent" />
    </div>
  </v-layout>
</template>
<style lang="scss">
	@import './sass/atat.scss';
</style>
<script lang="ts">
import { Component as VueComponent } from "vue";
import { Component, Watch, Vue, toNative } from "vue-facing-decorator";

import AppPackageBuilder from "@/AppPackageBuilder.vue";
import TaskOrderLookup from "@/TaskOrderLookup.vue";
import PortfolioSummary from "./portfolios/portfolio/components/Index.vue"
import PortfolioDashboard from "@/portfolios/portfolio/Portfolio.vue";
import ATATTopNavBar from "./components/ATATTopNavBar.vue";
import AppSections from "@/store/appSections";
import DocumentReview from "@/documentReview/Index.vue";
import Portfolios from "@/portfolios/Index.vue";
import CreateFirstPortfolio from '@/portfolios/portfolio/CreateFirstPortfolio.vue';
import Packages from "@/packages/Index.vue";
import Home from "@/home/Index.vue";
import ProvisionWorkflow from "@/portfolios/provisioning/ProvisionWorkflow.vue";
import AcquisitionPackage from "./store/acquisitionPackage";

import Steps from '@/store/steps';

@Component({
  components: {
    ATATTopNavBar,
  },
})
class App extends Vue {

  public get activeAppSection(): string {
    return AppSections.activeAppSection;
  }

  @Watch("activeAppSection")
  public activeAppSectionChanged(newActiveSection: string): void {
    switch (newActiveSection) {
    case this.sectionTitles.Home:
      AppSections.setAppContentComponent(Home);
      break;
    case this.sectionTitles.ProvisionWorkflow:
      AppSections.setAppContentComponent(ProvisionWorkflow);
      break;
    case this.sectionTitles.AcquisitionPackage:
      AppSections.setAppContentComponent(AppPackageBuilder);
      break;
    case this.sectionTitles.PortfolioDashboard:
      AppSections.setAppContentComponent(PortfolioDashboard);
      break;
    case this.sectionTitles.TOLookup:
      AppSections.setAppContentComponent(TaskOrderLookup);
      break;
    case this.sectionTitles.Portfolios:
      AppSections.setAppContentComponent(Portfolios);
      break;
    case this.sectionTitles.CreateFirstPortfolio:
      AppSections.setAppContentComponent(CreateFirstPortfolio);
      break;
    case this.sectionTitles.PortfolioSummary:
      AppSections.setAppContentComponent(PortfolioSummary);
      break;
    case this.sectionTitles.DocumentReview:
      AppSections.setAppContentComponent(DocumentReview);
      break;  
    case this.sectionTitles.Packages:
      AppSections.setAppContentComponent(Packages);
      break;
    }
  }

  public get appContentComponent(): VueComponent {
    return AppSections.appContentComponent || {};
  }

  public sectionTitles: Record<string, string> = {};

  public async loadOnEnter(): Promise<void> {
    const storeData = await AppSections.getSectionData();
    if (storeData) {
      this.sectionTitles = storeData.sectionTitles;
    }
  }

  public async mounted(): Promise<void> {
    Steps.initialize();

    await AcquisitionPackage.setIsProdEnv();
    if (process.env.NODE_ENV === "development") {
      // NOTE: add `userId` to .env file with your snow sys_id to view 
      // your packages etc. when running locally
      const snowUserSysId = process.env.SNOW_USER_SYSID || "";
      sessionStorage.setItem("userId", snowUserSysId)
    }
    
    await this.loadOnEnter();
  }

  public get centerContent(): boolean {
    return this.activeAppSection === AppSections.sectionTitles.Home;
  }
  public get isHome(): boolean {
    return this.activeAppSection === AppSections.sectionTitles.Home;
  }

  public async beforeMount(): Promise<void> {
    await AppSections.setAppContentComponent(Home);
  }
}
export default toNative(App)
</script>
