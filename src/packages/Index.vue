<template>
  <div>
    <ATATToast />
    <v-main>
      <v-app-bar
        id="PageHeader"
        flat
        class="_atat-page-header _acquisitions"
      >
        <div id="NameHeader" tabindex="-1" class="mt-1">
          <div class="d-flex align-center">
            <h1 class="mt-4">Acquisitions</h1>
          </div>
          <div>
            <v-tabs class="_header-tab" v-model="tabIndex">
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
            class="_primary"
            :ripple="false"
            @click="toAcquisitions"
          >
            Start New Acquisition
          </v-btn>
        </div>
        <div class="d-flex justify-end align-center"></div>
      </v-app-bar>

      <div class="_app-content" style="padding-top: 80px;">
        <div class="_app-content-wrap">  

          <PackageSearch
            class="_package-search-wrapper"
            id="SearchPackages"
            :searchString="searchString"
            @update:searchString="searchString = $event"
            :selectedSort="selectedSort"
            @update:selectedSort="selectedSort = $event"
            @search="search"
            @clear="clear"
          />
          <div
            v-if="packageData.length" 
            id="PackageCards" 
            class="d-flex flex-column align-center pt-5"
            :class="{ '_is-paginated' : packageCount > recordsPerPage}"
          >
            <PackageCard
              v-for="(cardData, index) in packageData"
              :key="cardData.sys_id"
              :cardData="cardData"
              :index="index"
              :isLastCard="index === packageData.length - 1"
              @updateStatus="updateStatus"
              @openTOSearchModal="openTOSearchModal"
            />

            <div class="_table-pagination" v-show="packageCount > recordsPerPage">
              <span class="mr-11 font-weight-400 font-size-14">
                Showing {{ startingNumber }}-{{ endingNumber }} of {{ packageCount }}
              </span>

              <v-pagination
                v-model="page"
                :length="numberOfPages"
                rounded
              ></v-pagination>     
            </div>

          </div>
          <div 
            v-if="!packageData.length && !isLoading"
            id="NoRecords" 
            class="width-100 py-10 text-center"
          >
            <h2 class="mb-2">{{ noRecordsHeading }}</h2>
            <p>{{ noRecordsMessage }}</p>
          </div>

          <ATATNoResults
            v-show="packageData.length === 0 && searchString && !isLoading"
            :searchString="searchedString"
            @clear="clear"
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
import { Component, Watch, Vue, toNative } from "vue-facing-decorator";
import { getIdText, scrollToMainTop } from "@/helpers";
import PortfoliosSummary from "@/portfolios/components/PortfoliosSummary.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import ATATToast from "@/components/ATATToast.vue";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";
import PackageCard from "@/packages/components/Card.vue";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";
import Steps from "@/store/steps";
import {
  AcquisitionPackageSummaryDTO,
  AcquisitionPackageSummaryMetadataAndDataDTO,
  AcquisitionPackageSummarySearchDTO,
} from "@/api/models";

import AcquisitionPackageSummary, { PackageSort } from "@/store/acquisitionPackageSummary";
import PackageSearch from "@/packages/components/Search.vue";
import ATATNoResults from "@/components/ATATNoResults.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import PortfolioStore from "@/store/portfolio";
import { provWorkflowRouteNames } from "@/router/provisionWorkflow";

@Component({
  components: {
    PortfoliosSummary,
    ATATFooter,
    ATATToast,
    ATATNoResults,
    PackageCard,
    PackageSearch,
    TaskOrderSearchModal
  }
})

class Packages extends Vue {
  public page = 1;
  public recordsPerPage = 10;
  public numberOfPages = 0;
  public packageCount = 0;
  public offset = 0;
  public paging = false;
  public isLoading = false;
  public isSearchSortFilter = false;

  public noRecordsHeading = "";
  public noRecordsMessage = "";

  public showTOSearchModal = false;
  public TONumber = "";
  public resetValidationNow = false;
  public selectedAcquisitionPackageSysId = "";

  public setNoRecordsText(index: number): void {
    switch (index) {
    case 0:
      this.noRecordsHeading = "No open packages";
      this.noRecordsMessage = `Draft acquisitions or those waiting for task order 
        award will appear here`;
      break;
    case 1:
      this.noRecordsHeading = "No awarded task orders";
      this.noRecordsMessage = "Acquisitions that have been awarded a task order will appear here";
      break
    case 2:
      this.noRecordsHeading = "No archived packages";
      this.noRecordsMessage = "Acquisitions that have been archived will appear here"
      break
    case 3:
      this.noRecordsHeading = "No packages";
      this.noRecordsMessage = "All of your acquisition packages will appear here"
      break    
    }
  }

  @Watch('tabIndex')
  public async tabIndexChanged(newVal:number): Promise<void> {
    let acquisitionPackageStatus = ""
    switch(newVal){
    case 0:
      acquisitionPackageStatus = "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER";
      break
    case 1:
      acquisitionPackageStatus = "TASK_ORDER_AWARDED";
      break
    case 2:
      acquisitionPackageStatus = "ARCHIVED";
      break
    case 3:
      acquisitionPackageStatus =
        "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER,TASK_ORDER_AWARDED,ARCHIVED"
      break
    }
    this.setNoRecordsText(newVal);
    await this.updateSearchDTO('acquisitionPackageStatus',acquisitionPackageStatus)
  }
  public tabIndex = 0;
  public searchString = ""
  public searchedString = ""
  public selectedSort: PackageSort = "project_overview"
  public packageData:AcquisitionPackageSummaryDTO[] = []
  public allPackageData:AcquisitionPackageSummaryMetadataAndDataDTO = {
    // eslint-disable-next-line camelcase
    total_count:0,
    acquisitionPackageSummaryList:[]
  }
  @Watch('selectedSort')
  public async sortingChanged(newVal: PackageSort): Promise<void> {
    await this.updateSearchDTO('sort', newVal);
    AcquisitionPackageSummary.setSelectedSort(newVal);
  }

  @Watch("page")
  public paged(): void {
    if (!this.isSearchSortFilter) {
      this.paging = true;
      this.loadPackageData();
    }
  }

  public searchDTO:AcquisitionPackageSummarySearchDTO = {
    acquisitionPackageStatus: "DRAFT,WAITING_FOR_SIGNATURES,WAITING_FOR_TASK_ORDER",
    searchString: "",
    sort: this.selectedSort,
    limit: this.recordsPerPage,
    offset: this.offset
  };

  public async updateSearchDTO(key:string, value:string): Promise<void> {
    this.searchDTO = Object.assign(this.searchDTO,{[key]:value})
    this.paging = false;
    this.isSearchSortFilter = true;    
    await this.loadPackageData();
  }

  public async loadPackageData(): Promise<void> {
    this.isLoading = true;

    this.page = !this.paging ? 1 : this.page;
    this.offset = (this.page - 1) * this.recordsPerPage;
    this.searchDTO.offset = this.offset;
  
    const packageResults = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO)
    this.packageData = packageResults?.acquisitionPackageSummaryList || [];
    this.packageCount = packageResults?.total_count || 0;

    this.numberOfPages = Math.ceil(this.packageCount / this.recordsPerPage);

    scrollToMainTop();

    this.paging = false;
    this.isSearchSortFilter = false;
    this.isLoading = false;
  }

  public get endingNumber(): number {
    const ending = this.page * this.recordsPerPage;
    if (ending > this.packageCount) {
      return this.packageCount;
    }
    return ending;
  }
  public get startingNumber():number {
    const starting = (this.page - 1) * this.recordsPerPage + 1;
    return starting;
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
    await acquisitionPackage.setIsNewPackage(true)
    await AcquisitionPackage.reset();
    this.$router.push({
      name: routeNames.DAPPSChecklist,
      query: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }
  private getIdText(string: string) {
    return getIdText(string);
  }

  public async updateStatus(): Promise<void> {
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


  public openTOSearchModal(acqPackageSysId: string): void {
    if(acqPackageSysId){
      this.selectedAcquisitionPackageSysId = acqPackageSysId;
    }
    this.showTOSearchModal = true;
  }

  public async TOSearchCancelled(): Promise<void> {
    this.TONumber = "";
    this.resetValidationNow = true;
    this.showTOSearchModal = false;
    this.selectedAcquisitionPackageSysId = "";
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
    await PortfolioStore.setShowTOPackageSelection(true);
    await PortfolioStore.setProvisioningFromMeatballMenu(false);
  }

  public async startProvisionWorkflow(): Promise<void>{
    await AcquisitionPackage.reset();
    if (this.selectedAcquisitionPackageSysId) {
      await PortfolioStore.setShowTOPackageSelection(false);
    }
    await PortfolioStore.setSelectedAcquisitionPackageSysId(this.selectedAcquisitionPackageSysId);

    this.$router.push({
      name: provWorkflowRouteNames.AwardedTaskOrder,
      query: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.ProvisionWorkflow);
  }

  private async loadOnEnter(){
    this.selectedSort = AcquisitionPackageSummary.selectedSort;
    this.loadPackageData();
    this.setNoRecordsText(0);
    const sectionData = await AppSections.getSectionData();
    AcquisitionPackage.doSetCancelLoadDest(sectionData.sectionTitles.Packages);
  }

  public async mounted():Promise<void>{
    await AcquisitionPackage.setHideNavigation(false);
    await PortfolioStore.setProvisioningFromMeatballMenu(false);
    this.loadOnEnter();
  }

}
export default toNative(Packages)
</script>

