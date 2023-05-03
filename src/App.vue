<template>
  <v-app id="app">
    <ATATTopNavBar />
    <div v-if="appContentComponent">
      <component :is="appContentComponent" />
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Component as VueComponent } from "vue";

import AppPackageBuilder from "@/AppPackageBuilder.vue";
import TaskOrderLookup from "@/TaskOrderLookup.vue";
import PortfolioSummary from "./portfolios/portfolio/components/Index.vue"
import JWCCDashboard from "@/dashboards/JWCC.vue";
import PortfolioDashboard from "@/portfolios/portfolio/Portfolio.vue";
import ATATTopNavBar from "./components/ATATTopNavBar.vue";
import AppSections from "@/store/appSections";
import DocumentReview from "@/documentReview/Index.vue";
import Portfolios from "@/portfolios/Index.vue";
import Packages from "@/packages/Index.vue";
import Home from "@/home/Index.vue";
import ProvisionWorkflow from "@/portfolios/provisioning/ProvisionWorkflow.vue";
import CurrentUserStore from "./store/user";
import AcquisitionPackage from "./store/acquisitionPackage";

@Component({
  components: {
    ATATTopNavBar,
  },
})
export default class App extends Vue {
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
    case this.sectionTitles.JWCCDashboard:
      AppSections.setAppContentComponent(JWCCDashboard);
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
    await AcquisitionPackage.setIsProdEnv();
    if (process.env.NODE_ENV === "development") {
      // NOTE: add `userId` to .env file with your snow sys_id to view 
      // your packages etc. when running locally
      const snowUserSysId = process.env.SNOW_USER_SYSID || "";
      sessionStorage.setItem("userId", snowUserSysId)
    }

    window.addEventListener("storage", async (e) => {
      if (e.storageArea === sessionStorage && e.key === "userId") {
        await CurrentUserStore.resetUser();
      }
    })

    setTimeout(() => {
      CurrentUserStore.resetUser();
    }, 1000)

    await this.loadOnEnter();
  }

  public async beforeMount(): Promise<void> {
    await AppSections.setAppContentComponent(Home);
  }
}
</script>
