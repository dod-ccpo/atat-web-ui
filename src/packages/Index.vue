<template>
  <div>
    <ATATToast />
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
        <Search
          :searchString.sync="searchString"
          :selectedSort.sync="selectedSort"
          @search="search"
          @clear="clear"
        />
        <div class="d-flex flex-column align-center pt-5">
          <Card
            v-for="(cardData, index) in packageData"
            :key="cardData.sys_id"
            :cardData="cardData"
            :index="index"
            :isLastCard="index === packageData.length - 1"
            @updateStatus="updateStatus"

          />
        </div>
        <ATATNoResults
          v-show="packageData.length === 0 && searchString"
          :searchString="searchedString"
          @clear="clear"
        />
      </v-container>
      <ATATFooter/>
    </v-main>

  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";
import { getIdText } from "@/helpers";
import PortfoliosSummary from "@/portfolios/components/PortfoliosSummary.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import ATATToast from "@/components/ATATToast.vue";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";
import Card from "@/packages/components/Card.vue";
import Steps from "@/store/steps";
import {
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummaryMetadataAndDataDTO,
  AcquisitionPackageSummarySearchDTO,
} from "@/api/models";
import { ToastObj } from "../../types/Global";
import Toast from "@/store/toast";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import Search from "@/packages/components/Search.vue";
import ATATNoResults from "@/components/ATATNoResults.vue";

@Component({
  components: {
    PortfoliosSummary,
    ATATFooter,
    ATATToast,
    ATATNoResults,
    Card,
    Search
  }
})
export default class Packages extends Vue {
  @Watch('tabIndex')
  public async tabIndexChanged(newVal:number): Promise<void> {
    let acquisitionPackageStatus = ""
    switch(newVal){
    case 0:
      acquisitionPackageStatus = "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER"
      break
    case 1:
      acquisitionPackageStatus = "TASK_ORDER_AWARDED"
      break
    case 2:
      acquisitionPackageStatus = "ARCHIVED"
      break
    case 3:
      acquisitionPackageStatus =
        "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER,TASK_ORDER_AWARDED,ARCHIVED"
      break
    }
    await this.updateSearchDTO('acquisitionPackageStatus',acquisitionPackageStatus)
  }
  public tabIndex = 0;
  public searchString = ""
  public searchedString = ""
  public selectedSort: 'DESCsys_updated_on'| 'project_overview' = "project_overview"
  public packageData:AcquisitionPackageSummaryDTO[] = []
  public allPackageData:AcquisitionPackageSummaryMetadataAndDataDTO = {
    // eslint-disable-next-line camelcase
    total_count:0,
    acquisitionPackageSummaryList:[]
  }
  @Watch('selectedSort')
  public async sortingChanged(newVal:string): Promise<void> {
    await this.updateSearchDTO('sort',newVal)
  }

  public searchDTO:AcquisitionPackageSummarySearchDTO = {
    acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER",
    searchString: "",
    sort: this.selectedSort,
    limit: 10,
    offset: 0
  };

  public async updateSearchDTO(key:string, value:string): Promise<void> {
    this.searchDTO = Object.assign(this.searchDTO,{[key]:value})
    const packageResults = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO)
    this.packageData = packageResults.acquisitionPackageSummaryList
  }
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

  public async updateStatus(sysId: string,newStatus: string): Promise<void> {
    let message = "";
    switch(newStatus){
    case 'DELETED':
      message = "Acquisition package deleted"
      break;
    case 'ARCHIVED':
      message = "Acquisition package archived"
      break;
    case 'DRAFT':
      message = "Acquisition package restored to draft"
      break;
    }
    await AcquisitionPackageSummary
      .updateAcquisitionPackageStatus({
        acquisitionPackageSysId: sysId,
        newStatus
      });

    const toastObj: ToastObj = {
      type: "success",
      message,
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };

    Toast.setToast(toastObj);
    await this.updateSearchDTO("","")
  }

  public async search(): Promise<void> {
    await this.updateSearchDTO('searchString',this.searchString)
    this.searchedString = this.searchString
  }

  public async clear(): Promise<void> {
    this.searchString = "";
    await this.updateSearchDTO('searchString',this.searchString)
  }

  private async loadOnEnter(){
    this.allPackageData = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO);
    this.packageData = this.allPackageData?.acquisitionPackageSummaryList
  }

  public mounted():void{
    this.loadOnEnter();
  }

}
</script>

