<template>
  <div>
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
    
    <div 
      :class="{ 'mt-10' : !isHomeView }" 
      id="PortfolioCards" 
      v-show="portfolioCardData.length" 
      :style="{ 'margin-bottom: 200px;' : !isHomeView }"
    >
      <PortfolioCard
        v-for="(cardData, index) in portfolioCardData"
        :key="index"
        :cardData="cardData"
        :index="index"
        :isLastCard="index === portfolioCardData.length - 1"
        :isHaCCAdmin="isHaCCAdmin"
        @leavePortfolio="leavePortfolio"
        :isHomeView="isHomeView"
      />

      <div class="_table-pagination mt-5" v-show="portfolioCount > recordsPerPage">
        <span class="mr-11 font-weight-400 font-size-14">
          Showing {{ startingNumber }}-{{ endingNumber }} of {{ portfolioCount }}
        </span>

        <v-pagination
          v-model="page"
          :length="numberOfPages"
          circle
        ></v-pagination>     
      </div>

    </div>

    <ATATNoResults 
      v-show="portfolioCardData.length === 0 && !isLoading && !isHomeView" 
      :searchString="searchedString"
      :hasFilters="hasFilters"
      @clear="clearSearchOrFilters"
    />

  </div>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";

import ATATNoResults from "@/components/ATATNoResults.vue";
import ATATSearch from "@/components/ATATSearch.vue"
import ATATSelect from "@/components/ATATSelect.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import FilterSlideout from "./FiltersSlideout.vue";
import PortfolioCard from "./PortfolioCard.vue";

import { 
  FilterOption,
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

import { Statuses } from "@/store/acquisitionPackage";
import { createDateStr, toCurrencyString } from "@/helpers";
import { differenceInDays, formatDistanceToNow, formatISO, isAfter, isBefore } from "date-fns";
import { PortfolioSummarySearchDTO } from "@/api/models";
import _ from "lodash";
import CurrentUserStore from "@/store/user";

@Component({
  components: {
    ATATNoResults,
    ATATSearch,
    ATATSelect,
    ATATSVGIcon,
    PortfolioCard,
  }
})

export default class PortfoliosSummary extends Vue {
  @Prop({ default: "ALL" }) public activeTab!: "ALL" | "ACTIVE" | "PROCESSING";
  @Prop({ default: false }) public isHomeView?: boolean;
  @Prop({ default: "name" }) public defaultSort?: "name" | "DESCsys_updated_on";
  public isHaCCAdmin = false;

  public page = 1;
  public recordsPerPage = 5;
  public numberOfPages = 0;
  public portfolioCount = 0;
  public offset = 0;
  public paging = false;

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
    this. isSearchSortFilter = true;
    await this.loadPortfolioData(); // 
    this. isSearchSortFilter = false;
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

  public leavePortfolio(sysId: string): void {
    this.portfolioCardData = this.portfolioCardData.filter(
      obj => obj.sys_id !== sysId
    );
    const accessRemovedToast: ToastObj = {
      type: "success",
      message: "Portfolio access removed",
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };

    Toast.setToast(accessRemovedToast);

    // future ticket, remove member from portfolio table in snow
    // after removed, make new call to reload portfolio list if > 10 portfolios
    // to ensure 10 listed on page
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

  public async loadPortfolioData(): Promise<void> {
    const currentUser = await CurrentUserStore.getCurrentUser();
    this.currentUserSysId = currentUser.sys_id as string;
    
    this.isLoading = true;
    this.portfolioCardData = [];

    if (this.activeTab) {
      this.portfolioSearchDTO.portfolioStatus = this.activeTab === "ALL" ? "" : this.activeTab;
    }

    if (!this.selectedSort && this.defaultSort) {
      this.selectedSort = this.defaultSort;
      this.portfolioSearchDTO.sort = this.defaultSort;
    }
    
    this.page = !this.paging ? 1 : this.page;
    this.offset = (this.page - 1) * this.recordsPerPage;
    this.portfolioSearchDTO.offset = this.offset;

    const storeData = await PortfolioSummary.searchPortfolioSummaryList(this.portfolioSearchDTO);

    this.portfolioCount = storeData.total_count;
    this.$emit("totalCount", storeData.total_count);
    this.numberOfPages = Math.ceil(this.portfolioCount / this.recordsPerPage);

    if (this.isHomeView) {
      storeData.portfolioSummaryList = storeData.portfolioSummaryList.slice(0,5);
    }
    storeData.portfolioSummaryList.forEach((portfolio) => {
      
      // TODO AT-8747 - populate Portfolio Members (managers/viewers) for card
      // from portfolio_managers and portfolio_viewers sysIds lists
      //eslint-disable-next-line prefer-const 
      let cardData: PortfolioCardData = {};
      cardData.isManager = portfolio.portfolio_managers.indexOf(this.currentUserSysId) > -1;
      
      cardData.csp = portfolio.vendor ?  portfolio.vendor.toLowerCase() : "";

      cardData.sysId = portfolio.sys_id;
      cardData.title = portfolio.name;
      cardData.description = portfolio.description;
      cardData.status = portfolio.portfolio_status;
      cardData.fundingStatus = portfolio.portfolio_funding_status;
      cardData.agency = portfolio.dod_component;

      const activeTaskOrderSysId = portfolio.active_task_order.value as string;
      const activeTaskOrder = portfolio.task_orders.find(
        obj => obj.sys_id === activeTaskOrderSysId
      );

      cardData.taskOrderNumber = activeTaskOrder ? activeTaskOrder.task_order_number : "";

      // lastModified - if status is "Processing" use "Started ... ago" string
      if (cardData.status.toLowerCase() === Statuses.Processing.value.toLowerCase()) {
        const agoString = formatDistanceToNow(new Date(portfolio.sys_updated_on));

        cardData.lastModifiedStr = "Started " + agoString + " ago";
      } else {
        const updatedDate = createDateStr(portfolio.sys_updated_on, true);
        cardData.lastModifiedStr = "Last modified " + updatedDate;

        if (portfolio.task_orders && portfolio.task_orders.length) {
          cardData.taskOrderNumber = portfolio.task_orders[0].task_order_number;
          const popStart = createDateStr(portfolio.task_orders[0].pop_start_date, true);
          const popEndISO = portfolio.task_orders[0].pop_end_date;
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
        cardData.totalObligated = "$" + toCurrencyString(portfolio.funds_obligated);
        cardData.fundsSpent = "$" + toCurrencyString(portfolio.funds_spent);
        cardData.fundsSpentPercent = String(Math.round(
          portfolio.funds_spent / portfolio.funds_obligated * 100
        ));
        const remainingAmt = portfolio.funds_obligated - portfolio.funds_spent;
        cardData.fundsRemaining 
          = "$" + toCurrencyString(Math.abs(remainingAmt)) 
          + (remainingAmt < 0 ? " overspent" : " remaining");
      }

      this.portfolioCardData.push(cardData);
      this.isLoading = false;
      this.paging = false;
      this. isSearchSortFilter = false;
    });

    // future ticket - set isHaCCAdmin value with data from backend when implemented
    this.isHaCCAdmin = true;
  }
}
</script>
