<template>
  <div>
    <v-main>
      <v-app-bar
        id="PageHeader"
        app
        flat
        class="_atat-page-header _acquisitions"
        clipped-right
        height="83"
      >
        <div id="NameHeader" tabindex="-1" class="mt-1">
          <div class="d-flex align-center">
            <h1 class="mb-2 mt-5 pl-1">Acquisitions</h1>
          </div>
          <div>
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
        </div>
        <div class="d-flex ml-auto">
          <v-btn
            class="primary"
            :ripple="false"
            @click="toAcquisitions"
          >
            Start New Acquisition
          </v-btn>
        </div>
        <div class="d-flex justify-end align-center"></div>
      </v-app-bar>
      <v-container
        class="container-max-width"
      >
        <div v-if="activeTab === 'OPEN'">
          <div class="d-flex flex-column align-center pt-5">
            <Card
              v-for="(cardData, index) in packageData"
              :key="index"
              :cardData="cardData"
              :index="index"
              :isLastCard="index === packageData.length - 1"
            />
          </div>
        </div>
        <div v-if="activeTab === 'AWARDEDTASKORDERS'">
          <div class="d-flex flex-column align-center">
            <h1>No packages with awarded task orders.</h1>
            <p>Acquisitions that have been awarded task orders will appear here</p>
          </div>
        </div>
        <div v-if="activeTab === 'ARCHIVE'">
          <div class="d-flex flex-column align-center">
            <h1>No archived packages.</h1>
            <p>Acquisitions that have been archived will appear here</p>
          </div>
        </div>
        <div v-if="activeTab === 'ALL'">
          <div class="d-flex flex-column align-center">
            <h1>No packages.</h1>
            <p>Acquisitions will appear here</p>
          </div>
        </div>

      </v-container>
      <ATATFooter/>
    </v-main>

  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import { getIdText } from "@/helpers";
import PortfoliosSummary from "@/portfolios/components/PortfoliosSummary.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import ATATToast from "@/components/ATATToast.vue";
import AppSections from "@/store/appSections";
import PackageSummaryStore from "@/store/packageSummary";
import { routeNames } from "@/router/stepper";
import Card from "@/packages/components/Card.vue";
import Steps from "@/store/steps";
import { PackageSummaryDTO } from "@/api/models";
@Component({
  components: {
    PortfoliosSummary,
    ATATFooter,
    ATATToast,
    Card,
  }
})
export default class Packages extends Vue {
  public tabIndex = 0;
  public packageData:PackageSummaryDTO[] = []
  public tabItems: Record<string, string>[] = [
    {
      type: "OPEN",
      text: "Open packages",
    },
    {
      type: "AWARDEDTASKORDERS",
      text: "Awarded task orders",
    },
    {
      type: "ARCHIVE",
      text: "Archive",
    },
    {
      type: "ALL",
      text: "All packages",
    },
  ];
  public activeTab = this.tabItems[0].type;

  public tabClicked(tabType: string): void {
    this.activeTab = tabType;
  }
  public async toAcquisitions(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Packages);
    this.$router.push({
      name: routeNames.ProjectOverview,
      params: {
        direction: "next"
      }
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }
  private getIdText(string: string) {
    return getIdText(string);
  }

  private async loadOnEnter(){
    this.packageData = await PackageSummaryStore.getPackageData()
  }

  public mounted():void{
    this.loadOnEnter();
  }

}
</script>

