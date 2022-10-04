<template>
  <div>
  
    <div class="
      bg-base-lightest mt-10 pa-4 border-rounded 
      d-flex justify-space-between align-center
    ">
      <ATATSearch 
        id="SearchPortfolios"
        placeHolder="Search portfolios"
        width="450"
        @search="searchPortfolios"
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
    
    <div class="mt-10">
      <PortfolioCard
        v-for="(cardData, index) in portfolioCardData"
        :key="index"
        :cardData="cardData"
        :index="index"
        :isLastCard="index === portfolioCardData.length - 1"
        :isHaCCAdmin="isHaCCAdmin"
        @leavePortfolio="leavePortfolio"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";
import ATATSearch from "@/components/ATATSearch.vue"
import ATATSelect from "@/components/ATATSelect.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import FilterSlideout from "./FiltersSlideout.vue";
import PortfolioCard from "./PortfolioCard.vue";

import { PortfolioCardData, ToastObj, SelectData, SlideoutPanelContent } from "types/Global";
import Toast from "@/store/toast";
import SlideoutPanel from "@/store/slideoutPanel";
import PortfolioData from "@/store/portfolio";

@Component({
  components: {
    ATATSearch,
    ATATSelect,
    ATATSVGIcon,
    PortfolioCard,
  }
})

export default class AllPortfolios extends Vue {
  public portfolioCardData: PortfolioCardData[] = [];
  public isHaCCAdmin = false;
  public searchString = "";
  public selectedSort = "alpha";
  public sortOptions: SelectData[] = [
    { text: "Portfolio name A-Z", value: "alpha" },
    { text: "Recently modified", value: "modified" },
  ];

  public sortPortfolios(valObj: Record<string, string>): void {
    this.setQueryParams("sort", valObj.newSelectedValue);
  }

  public searchPortfolios(value: string): void {
    debugger;
    this.setQueryParams("searchString", value);
  }

  public async setQueryParams(key: string, value: string): Promise<void> {
    debugger;
    PortfolioData.setPortfolioListQueryParams({
      [key]: value
    })
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

  // delete this function when backend hooked up with actual data
  public async generateDummyObj(
    // eslint-disable-next-line camelcase
    sys_id?: string,
    title?: string,
    status?: string,
    csp?: string,
    branch?: string,
    lastModifiedStr?: string,
    lastModifiedDate?: string,
    currentPoP?: string,
    totalObligated?: string,
    fundsSpent?: string,
    fundsSpentPercent?: string,
  ): Promise<PortfolioCardData> {
    return {
      // eslint-disable-next-line camelcase
      sys_id, title, status, csp, branch, lastModifiedStr, lastModifiedDate, currentPoP, 
      totalObligated, fundsSpent, fundsSpentPercent
    }
  }

  // delete this function when backend hooked up with actual data
  public async generateDummyData(): Promise<void> {
    const cardObjValues = [
      /* eslint-disable max-len */
      ["1234567890", "ABC123 portfolio", "Processing", "aws", "Joint Force", "Started 23 minutes ago", "09/30/2022"],
      ["2345678901", "Army-Navy Game", "Active", "azure", "Army", "Last modified Sept. 1, 2022", "09/01/2022", "Oct. 1, 2022 - Sept. 31, 2023", "$1,000,000.00", "$500,000", "50"],
      ["3456789012", "DEF456 portfolio", "At-Risk", "google", "Navy", "Last modified Sept. 2, 2022", "09/02/2022"],
      ["4567890123", "GHI789 portfolio", "Delinquent", "oracle", "Marine Corps", "Last modified Sept. 3, 2022", "09/03/2022"]
      /* eslint-enable max-len */
    ]
    cardObjValues.forEach(async (values) => {
      const obj = await this.generateDummyObj(...values);
      this.portfolioCardData.push(obj);
    });
  }

  public async mounted(): Promise<void> {
    // delete next line when backend hooked up with actual data
    await this.generateDummyData();
    
    // future ticket - set isHaCCAdmin value with data from backend when implemented
    this.isHaCCAdmin = true; 
  }
}
</script>

