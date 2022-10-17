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
              class="_small _alt-style-clean _portfolio-sort"
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
import PortfolioData from "@/store/portfolio";

import { StatusTypes } from "@/store/acquisitionPackage";
import { createDateStr, toCurrencyString } from "@/helpers";
import { formatDistanceToNow } from "date-fns";
import { PortfolioSummarySearchDTO } from "@/api/models";

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

  public portfolioCardData: PortfolioCardData[] = [];
  public totalPortfolioCount = 0;
  public isLoading = false;
  public searchString = "";
  public searchedString = "";
  public selectedSort = "name";
  public sortOptions: SelectData[] = [
    { text: "Portfolio name A-Z", value: "name" },
    { text: "Recently modified", value: "DESCsys_updated_on" },
  ];

  public filterChips: FilterOption[] = []

  public roles = PortfolioData.summaryFilterRoles;

  public async generateFilterChips(): Promise<void> {
    this.filterChips = [];
    if (this.queryParams.role && this.queryParams.role.toLowerCase() !== "all") {
      const role = this.roles.find(
        obj => obj.value.toLowerCase() === this.queryParams.role?.toLowerCase()
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
        await PortfolioData.setPortfolioSummaryQueryParams({[key]: filters });
      }
      break;
    }
    }
  }

  public async clearSearchOrFilters(whatToClear: string): Promise<void> {
    switch(whatToClear) {
    case "both":
      await PortfolioData.resetQueryParams();
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
    PortfolioData.resetFilters();
  }

  public get queryParams(): PortfolioSummaryQueryParams {
    return PortfolioData.portfolioSummaryQueryParams;
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
    await this.loadPortfolioData();
    this.isLoading = false;
    this.searchedString = this.searchString;
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
    await PortfolioData.setPortfolioSummaryQueryParams({
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
    this.isLoading = false;
  }

  public portfolioSearchDTO: PortfolioSummarySearchDTO = {
    role: "ALL",
    sort: "name",
    portfolioStatus: "",
    searchString: "",
    fundingStatuses: [],
    csps: [],
    limit: 5,
  }
  
  // TEMP hard-coded logged-in user Maria Missionowner
  public currentUserSysId = "e0c4c728875ed510ec3b777acebb356f"; // pragma: allowlist secret

  public async loadPortfolioData(): Promise<void> {
    this.isLoading = true;
    this.portfolioCardData = [];

    // below used to map stub CSPs to actual CSPs until have actual CSP data
    const cspStubs = ["CSP_A", "CSP_B", "CSP_C", "CSP_D", "CSP_Mock"];
    const csps = ["aws", "azure", "google", "oracle", "oracle"];

    if (this.activeTab) {
      this.portfolioSearchDTO.portfolioStatus = this.activeTab === "ALL" ? "" : this.activeTab;
    }

    if (this.defaultSort) {
      this.portfolioSearchDTO.sort = this.defaultSort;
    }

    const storeData = await PortfolioSummary.searchPortfolioSummaryList(this.portfolioSearchDTO);
    this.totalPortfolioCount = storeData.total_count;
    this.$emit("totalCount", storeData.total_count);
  

    if (this.isHomeView) {
      storeData.portfolioSummaryList = storeData.portfolioSummaryList.slice(0,5);
    }
    storeData.portfolioSummaryList.forEach((portfolio) => {
      let cardData: PortfolioCardData = {};
      cardData.isManager = portfolio.portfolio_managers.indexOf(this.currentUserSysId) > -1;
      cardData.csp = csps[cspStubs.indexOf(portfolio.csp_display)];
      cardData.sysId = portfolio.sys_id;
      cardData.title = portfolio.name;
      cardData.status = portfolio.portfolio_status;
      cardData.fundingStatus = portfolio.funding_status;
      cardData.serviceAgency = portfolio.dod_component;
      // lastModified - if status is "Processing" use "Started ... ago" string
      if (cardData.status.toLowerCase() === StatusTypes.Processing.toLowerCase()) {
        const agoString = formatDistanceToNow(new Date(portfolio.sys_updated_on));
        cardData.lastModifiedStr = "Started " + agoString + " ago";
      } else {
        const updatedDate = createDateStr(portfolio.sys_updated_on, true);
        cardData.lastModifiedStr = "Last modified " + updatedDate;
      }
      if (portfolio.task_orders && portfolio.task_orders.length) {
        cardData.taskOrderNumber = portfolio.task_orders[0].task_order_number;

        const popStart = createDateStr(portfolio.task_orders[0].pop_start_date, true);
        const popEnd = createDateStr(portfolio.task_orders[0].pop_end_date, true);
        cardData.currentPoP = popStart + " - " + popEnd;
      }

      if (portfolio.portfolio_status.toLowerCase() !== StatusTypes.Processing.toLowerCase()) {
        cardData.totalObligated = "$" + toCurrencyString(portfolio.funds_obligated);
        cardData.fundsSpent = "$" + toCurrencyString(portfolio.funds_spent);
        cardData.fundsSpentPercent = String(Math.round(
          portfolio.funds_spent / portfolio.funds_obligated * 100
        ));
      }

      this.portfolioCardData.push(cardData);
    });

    // future ticket - set isHaCCAdmin value with data from backend when implemented
    this.isHaCCAdmin = true;
  }
}
</script>
