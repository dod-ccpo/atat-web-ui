<template>
  <div>
    <!-- ATAT TODO * Q1 FY24 - reinstate after MVP when new single portfolio 
      summary API is available that prevents multiple calls per portfolio

    <div v-if="!isHomeView" class="bg-base-lightest pa-4 border-rounded">
      <div class="d-flex justify-space-between align-center">
        <ATATSearch 
          id="SearchPortfolios"
          placeHolder="Search portfolios"
          width="450px"
          @search="searchPortfolios"
          @clear="clearSearch"
          :value.sync="searchString"
        />
        <div class="d-flex align-center">
          <div>
            <ATATSelect
              id="PortfolioSort"
              class="_small _alt-style-clean _search-bar-sort"
              :items="sortOptions"
              width="167"
              :selectedValue.sync="selectedSort"
              iconType="chevron"
              @selectValueChange="sortPortfolios"
            />
          </div>
          <div>
            <v-btn
              class="_icon-only mr-2"
              id="FilterButton"
              @click="openFilterSlideout"
              @keydown.enter="openFilterSlideout"
              @keydown.space="openFilterSlideout"
            >
              <ATATSVGIcon
                name="filters"
                width="14"
                height="14"
                color="base-dark"
              />
            </v-btn>
            
          </div>
        </div>
      </div>

      <div class="mt-3" v-show="hasFilters">
        <v-chip
          v-for="(chip, index) in filterChips"
          :key="index"
          :id="'FilterChip_' + chip.id"
          class="_pill"
          close
          close-icon="close"
          @click:close="removeFilter(index)"
          @keydown.enter="removeFilter(index)"
          @keydown.space="removeFilter(index)"
          :aria-label="'Filtered by ' + chip.label"
        >
          {{ chip.abbreviation || chip.label }}
        </v-chip>

        <a 
          role="button" 
          tabindex="0"
          @click="clearAllFilters"
          @keydown.enter="clearAllFilters"
          @keydown.space="clearAllFilters"
          class="font-size-14 ml-2 _text-decoration-none _hover-underline"
        >Clear all filters</a>
      </div>
    </div> 
    
    -->

    <ATATLoader 
      v-show="isLoading" 
      loadingText="Loading your portfolios" 
    />


    <div 
      id="PortfolioCards" 
      v-show="portfolioCardData.length && !isLoading" 
      :style="{ 'margin-bottom: 200px;' : !isHomeView }"
    >
    <!-- ATAT TODO * Q1 FY24 - add back to div above after search is reinstated
      :class="{ 'mt-10' : !isHomeView }"  
    -->
      <transition-group name="_portfolio-card" tag="div">
        <PortfolioCard
          v-for="(cardData, index) in portfolioCardData"
          :key="cardData.sysId"
          :cardData="cardData"
          :index="index"
          :isLastCard="index === portfolioCardData.length - 1"
          :isHaCCAdmin="isHaCCAdmin"
          @leavePortfolio="leavePortfolio"
          @openArchivePortfolioModal="openArchivePortfolioModal"
          @openLeavePortfolioModal="openLeavePortfolioModal"
          @openTOModal="openTOModal"
          :isHomeView="isHomeView"
        />
      </transition-group>
<!--  add back when pagination is added
      <div class="_table-pagination mt-5" v-show="showPagination">
        <span class="mr-11 font-weight-400 font-size-14">
          Showing {{ startingNumber }}-{{ endingNumber }} of {{ portfolioCount }}
        </span>

        <v-pagination
          v-model="page"
          :length="numberOfPages"
          circle
        ></v-pagination>     
      </div> -->

    </div>

    <ATATNoResults 
      v-show="portfolioCardData.length === 0 && !isLoading && !isHomeView" 
      :searchString="searchedString"
      :hasFilters="hasFilters"
      @clear="clearSearchOrFilters"
    />

    <ArchivePortfolioModal
      :portfolioName="portfolioName"
      :showArchivePortfolioModal="showArchivePortfolioModal"
      :csp="csp"
      @okClicked="archivePortfolio"
      @cancelClicked="closeArchivePortfolioModal"
    />

    <LeavePortfolioModal
      :showModal="showLeavePortfolioModal" 
      :portfolioName="getCurrentPortfolioTitle"
      @okClicked="leavePortfolio"
      @cancelClicked="closeLeavePortfolioModal"
      :showLeaveModalSpinner="showLeaveModalSpinner"
    />

  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
/*eslint prefer-const: 1 */
import {Component, Prop, Watch, Vue, toNative} from "vue-facing-decorator";
// eslint-disable-next-line max-len
import ArchivePortfolioModal from "@/portfolios/portfolio/components/shared/ArchivePortfolioModal.vue";
import ATATLoader from "@/components/ATATLoader.vue";
import ATATNoResults from "@/components/ATATNoResults.vue";
import ATATSearch from "@/components/ATATSearch.vue"
import ATATSelect from "@/components/ATATSelect.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import FilterSlideout from "./FiltersSlideout.vue";
import PortfolioCard from "./PortfolioCard.vue";

import {
  FilterOption,
  Portfolio,
  PortfolioCardData,
  PortfolioSummaryQueryParams,
  SelectData,
  SlideoutPanelContent,
  ToastObj,
} from "types/Global";

import PortfolioSummary from "@/store/portfolioSummary";
import Toast from "@/store/toast";
import SlideoutPanel from "@/store/slideoutPanel";
import PortfolioStore from "@/store/portfolio";

import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import { createDateStr, toCurrencyString } from "@/helpers";
import { differenceInDays, formatDistanceToNow, isAfter } from "date-fns";
import { PortfolioSummarySearchDTO, UserDTO } from "@/api/models";
import _ from "lodash";
import CurrentUserStore from "@/store/user";
import LeavePortfolioModal from "@/portfolios/portfolio/components/shared/LeavePortfolioModal.vue";
import ATATDialog from "@/components/ATATDialog.vue";

@Component({
  components: {
    ATATDialog,
    LeavePortfolioModal,
    ArchivePortfolioModal,
    ATATLoader,
    ATATNoResults,
    ATATSearch,
    ATATSelect,
    ATATSVGIcon,
    PortfolioCard,
  }
})

class PortfoliosSummary extends Vue {
  @Prop({ default: "ALL" }) public activeTab!: "ALL" | "ACTIVE" | "PROCESSING" | "ARCHIVED";
  @Prop({ default: false }) public isHomeView?: boolean;
  @Prop({ default: "name" }) public defaultSort?: "name" | "DESCsys_updated_on";

  public isHaCCAdmin = CurrentUserStore.currentUserIsHaCCAdmin;
  public page = 1;
  public get recordsPerPage(): number {
    return this.isHomeView ? 5 : 10;
  };
  public numberOfPages = 0;
  public portfolioCount = 0;
  public offset = 0;
  public paging = false;
  public showLeaveModalSpinner = false;
  public portfolioCardData: PortfolioCardData[] = [];
  public isLoading = false;
  public searchString = "";
  public searchedString = "";
  public selectedSort = "";
  public sortOptions: SelectData[] = [
    { text: "Portfolio name A-Z", value: "name" },
    { text: "Recently modified", value: "DESCsys_updated_on" },
  ];
  public isSearchSortFilter = false;

  public filterChips: FilterOption[] = []

  public roles = PortfolioStore.summaryFilterRoles; // EJY figure this out

  public async generateFilterChips(): Promise<void> {
    this.filterChips = [];
    if (this.queryParams.role && this.queryParams.role.toLowerCase() !== "all") {
      const role = this.roles.find(
        (obj: FilterOption) => obj.value.toLowerCase() === this.queryParams.role?.toLowerCase()
      );
      if (role) {
        this.filterChips.push(role);
      }
    }
    if (this.queryParams.fundingStatuses) {
      this.filterChips = [...this.filterChips, ...this.queryParams.fundingStatuses];
    }
    if (this.queryParams.csps) {
      this.filterChips = [...this.filterChips, ...this.queryParams.csps];
    }
  }

  public get hasFilters(): boolean {
    return this.filterChips.length > 0;
  }

  public get showPagination(): boolean {
    return !this.isHomeView && (this.portfolioCount > this.recordsPerPage);
  }

  public async removeFilter(index: number): Promise<void> {
    const removedFilter = this.filterChips[index];
    this.filterChips.splice(index,1);
    const key = removedFilter.type;
    switch (key) {
    case "role":
      await this.setQueryParams("role", "ALL");
      break;
    case "fundingStatuses": 
    case "csps": {
      if (this.queryParams) {
        const filters = this.queryParams[key]?.filter(
          obj => obj.value !== removedFilter.value
        ) || [];
        await PortfolioStore.setPortfolioSummaryQueryParams({[key]: filters });
      }
      break;
    }
    }
  }

  public async clearSearchOrFilters(whatToClear: string): Promise<void> {
    switch(whatToClear) {
    case "both":
      await PortfolioStore.resetQueryParams();
      this.searchString = "";
      this.searchedString = "";
      break;
    case "search":
      await this.clearSearch();
      break;
    case "filters":
      await this.clearAllFilters();
    }
  }
  public get getCurrentPortfolioTitle(){
    return PortfolioStore.currentPortfolio.title;
  }

  public async clearAllFilters(): Promise<void> {
    this.filterChips = [];
    PortfolioStore.resetFilters();
  }

  public get queryParams(): PortfolioSummaryQueryParams {
    return PortfolioStore.portfolioSummaryQueryParams;
  }

  public getValuesFromFilterOptions(objects: FilterOption[] | undefined): string[] {
    const values: string[] = [];
    if (objects && objects.length) {
      objects.forEach(obj => values.push(obj.value));
    }
    return values;
  }

  public async setPortfolioSummaryDTO(): Promise<void> {
    const params = this.queryParams;
    const fundingStatuses = this.getValuesFromFilterOptions(params.fundingStatuses);
    const csps = this.getValuesFromFilterOptions(params.csps);
    const newQPs: Record<string, string | string[] | undefined> = {
      role: params.role,
      sort: params.sort,
      portfolioStatus: params.portfolioStatus,
      searchString: params.searchString,
      fundingStatuses: fundingStatuses,
      csps: csps,
    };
    Object.assign(this.portfolioSearchDTO, newQPs);
    this.paging = false;
    this.isSearchSortFilter = true;
    await this.loadPortfolioData(); // 
    this.isSearchSortFilter = false;
    this.isLoading = false;
    this.searchedString = this.searchString;
  }

  @Watch("page")
  public paged(): void {
    if (!this.isSearchSortFilter) {
      this.paging = true;
      this.loadPortfolioData();
    }
  }

  @Watch("activeTab")
  public async activeTabChanged(newVal: string): Promise<void> {
    await this.setQueryParams("portfolioStatus", newVal !== "ALL" ? newVal : "");
  }

  @Watch("queryParams", { deep: true })
  public async queryParamsChange(): Promise<void> {
    this.generateFilterChips();
    await this.setPortfolioSummaryDTO();
  }

  public async sortPortfolios(valObj: Record<string, string>): Promise<void> {
    await this.setQueryParams("sort", valObj.newSelectedValue);
  }

  public async searchPortfolios(): Promise<void> {
    await this.setQueryParams("searchString", this.searchString);
  }

  public async clearSearch(): Promise<void> {
    await this.setQueryParams("searchString", "");
    this.searchString = "";
    this.searchedString = "";
  }

  public async setQueryParams(key: string, value: string): Promise<void> {
    await PortfolioStore.setPortfolioSummaryQueryParams({
      [key]: value
    });
  }

  public openTOModal(){
    this.$emit("openTOModal");
  }

  public showFilters = false;
  public async openFilterSlideout(e: Event): Promise<void> {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      const slideoutPanelContent: SlideoutPanelContent = {
        component: FilterSlideout,
        title: "Filter your results",
      }
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
      this.showFilters = true;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async leavePortfolio(): Promise<void> {
    this.showLeaveModalSpinner = true;
    await PortfolioStore.leavePortfolio()
    await this.loadPortfolioData();
    this.showLeaveModalSpinner = false;
    this.closeLeavePortfolioModal()
    

    const accessRemovedToast: ToastObj = {
      type: "success",
      message: "Portfolio access removed",
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };

    Toast.setToast(accessRemovedToast);
  }

  public get currentPortfolio(): Portfolio {
    return PortfolioStore.currentPortfolio;
  }
  public get portfolioName(): string {
    return this.currentPortfolio.title as string;
  }
  public getPortfolioStatus(portfolioStatus: string): string{
    const status = Object.keys(Statuses).find((status) =>
      Statuses[status].value === portfolioStatus
    ) ?? portfolioStatus;
    return Statuses[status].label
  }
  public get csp(): string {
    const cspKey = this.currentPortfolio.csp?.toUpperCase() as string;
    return AcquisitionPackage.csps[cspKey] as string;
  }
  public get showArchivePortfolioModal(): boolean {
    return PortfolioStore.showArchivePortfolioModal;
  }
  public get showLeavePortfolioModal(): boolean {
    return PortfolioStore.showLeavePortfolioModal;
  }
  public openArchivePortfolioModal():void {
    PortfolioStore.setShowArchivePortfolioModal(true);
  }
  public openLeavePortfolioModal():void {
    PortfolioStore.setShowLeavePortfolioModal(true);
  }
  public async archivePortfolio():Promise<void> {
    const index = this.portfolioCardData.findIndex(
      obj => obj.sysId === this.currentPortfolio.sysId
    );
    this.portfolioCardData[index].status = "ARCHIVED";
    const portfolioArchivedToast: ToastObj = {
      type: "success",
      message: "Portfolio archived",
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };
    Toast.setToast(portfolioArchivedToast);

    PortfolioStore.archivePortfolio();
    this.closeArchivePortfolioModal();
    if (this.activeTab !== "ALL" || this.isHomeView) {
      this.portfolioCardData.splice(index, 1);
    }
  }

  public closeArchivePortfolioModal(): void {
    PortfolioStore.setShowArchivePortfolioModal(false);
  }

  public closeLeavePortfolioModal(): void {
    PortfolioStore.setShowLeavePortfolioModal(false);
  }

  public async mounted(): Promise<void> {
    await this.loadPortfolioData();
  }

  get endingNumber(): number {
    const ending = this.page * this.recordsPerPage;
    if (ending > this.portfolioCount) {
      return this.portfolioCount;
    }
    return ending;
  }
  get startingNumber():number {
    const starting = (this.page - 1) * this.recordsPerPage + 1;
    return starting;
  }


  public portfolioSearchDTO: PortfolioSummarySearchDTO = {
    role: "ALL",
    sort: "name",
    portfolioStatus: "",
    searchString: "",
    fundingStatuses: [],
    csps: [],
    limit: this.recordsPerPage,
    offset: this.offset,
  }

  public currentUserSysId = "";

  public get currentUser(): UserDTO {
    return CurrentUserStore.getCurrentUserData;
  }
  @Watch("currentUser")
  public currentUserChange(): void {
    this.loadPortfolioData();
  }  

  public get summaryListLength(): number {
    return PortfolioSummary.portfolioSummaryList?.length as number
  }
  
  @Watch("summaryListLength")
  public async summaryListChanged(): Promise<void>{
    const summaryList = await PortfolioSummary.getPortfolioSummaryList(this.currentUserSysId);
    PortfolioSummary.setPortfolioSummaryList(summaryList.portfolios)
  }
  

  public filteredPortfolios(): string[] {
    const includedPortfolios = []
    if(this.activeTab === 'ALL' && this.isHomeView){
      includedPortfolios.push(
        Statuses.Active.value, 
        Statuses.Processing.value, 
        Statuses.ProvisioningIssue.value
      )
    } else if(this.activeTab === 'ACTIVE'){
      includedPortfolios.push(Statuses.Active.value)
    } else if(this.activeTab === 'PROCESSING'){
      includedPortfolios.push(Statuses.Processing.value)
    } else if(this.activeTab === 'ARCHIVED'){
      includedPortfolios.push(Statuses.Archived.value)
    } else {
      includedPortfolios.push(
        Statuses.Active.value, 
        Statuses.Processing.value, 
        Statuses.ProvisioningIssue.value,
        Statuses.Archived.value
      )
    }
    return includedPortfolios
  }

  public async loadPortfolioData(): Promise<void> {
    this.currentUserSysId = this.currentUser.sys_id as string;
    
    this.isLoading = true;
    this.portfolioCardData = [];

    if (this.activeTab) {
      this.portfolioSearchDTO.portfolioStatus = this.activeTab === "ALL" ? "" : this.activeTab;
    }
    
    // pagination will be added back
    // this.page = !this.paging ? 1 : this.page;
    // this.offset = (this.page - 1) * this.recordsPerPage;
    // this.portfolioSearchDTO.offset = this.offset;
    
    const storeData = await PortfolioSummary.getAllPortfolioSummaryList(
      this.isHomeView as boolean
    )
    this.portfolioCount = CurrentUserStore.getCurrentUserPortfolioCount;
    await CurrentUserStore.doSetPortfolioCount(this.portfolioCount)
    this.numberOfPages = Math.ceil(this.portfolioCount / this.recordsPerPage);
    const includedPortfolios = this.filteredPortfolios();
    storeData?.forEach((portfolio) => {
      if(includedPortfolios.includes(portfolio.portfolio_status)) {
        const cardData: PortfolioCardData = {};
        cardData.isOwner = portfolio.current_user_is_owner;
        cardData.isManager = portfolio.current_user_is_manager
        cardData.lastUpdated = portfolio.last_updated;      
        cardData.csp = portfolio.vendor ?  portfolio.vendor.toLowerCase() : "";
        cardData.vendor = portfolio.vendor?.toLowerCase();
        cardData.sysId = portfolio.sys_id;
        cardData.title = portfolio.portfolio_name;
        cardData.status = this.getPortfolioStatus(portfolio.portfolio_status);
        cardData.fundingStatus = portfolio.funding_status;
        cardData.portfolio_owner = portfolio.owner_full_name;
        cardData.createdBy = portfolio.sys_created_by;
        cardData.agency = portfolio.agency;
        cardData.taskOrderNumber = portfolio.active_task_order

        // lastModified - if status is "Processing" use "Started ... ago" string
        if (cardData.status.toLowerCase() === Statuses.Processing.value.toLowerCase()) {
          const agoString = formatDistanceToNow(new Date(portfolio.last_updated));

          cardData.lastModifiedStr = "Started " + agoString + " ago";
        } else {
          if (portfolio.last_updated) {
            const updatedDate = createDateStr(portfolio.last_updated, true);
            cardData.lastModifiedStr = "Last modified " + updatedDate;
          }

          if (portfolio.active_task_order) {
            const popStart = createDateStr(portfolio.pop_start_date, true);
            const popEndISO = portfolio.pop_end_date;
            const popEnd = createDateStr(popEndISO, true);
            cardData.currentPoP = popStart + " - " + popEnd;
            const difToEndDate = formatDistanceToNow(new Date(popEndISO));
            const difInDays = differenceInDays(new Date(popEndISO), new Date());
            const difInDaysAbs = Math.abs(difInDays);
            const difStr = difInDaysAbs > 60 ? difToEndDate : difInDaysAbs + " days";
            const isExpired = isAfter(new Date(), new Date(popEndISO));

            cardData.expiration 
            = _.capitalize(difStr + (isExpired ? " past" : " to") + " expiration");
          }
        }
        if (portfolio.portfolio_status.toLowerCase() !== Statuses.Processing.value.toLowerCase()) {
          cardData.totalObligated = "$" + toCurrencyString(portfolio.total_obligated);
          cardData.fundsSpent = "$" + toCurrencyString(portfolio.funds_spent);
          cardData.fundsSpentPercent = portfolio.funds_spent ? 
            String(Math.round(portfolio.funds_spent / portfolio.total_obligated * 100))
            : "0";
          const remainingAmt = portfolio.total_obligated - portfolio.funds_spent;
          cardData.fundsRemaining 
          = "$" + toCurrencyString(Math.abs(remainingAmt)) 
          + (remainingAmt < 0 ? " overspent" : " remaining");
        }

        this.portfolioCardData.push(cardData);
        this.isLoading = false;
        this.paging = false;
        this.isSearchSortFilter = false;
      }});
  }
}
export default toNative(PortfoliosSummary)
</script>
