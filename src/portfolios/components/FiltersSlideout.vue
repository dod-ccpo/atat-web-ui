<template>
  <div class="pa-5 _has-sticky-footer">
    <ATATRadioGroup 
      id="PortfolioRole"
      name="PortfolioRole"
      legend="Role"
      :items="portfolioRoles"
      :value.sync="selectedPortfolioRole"
    />

    <ATATCheckboxGroup
      class="mt-6"
      id="FundingStatus"
      groupLabel="Funding status"
      groupLabelId="FundingStatusLabel"
      :card="false"
      :items="fundingStatuses"
      :value.sync="selectedFundingStatuses"
    />

    <ATATCheckboxGroup
      class="mt-8"
      id="CSPOptions"
      groupLabel="Cloud Service Provider"
      groupLabelId="CSPOptionsLabel"
      :card="false"
      :items="cspOptions"
      :value.sync="selectedCSPs"
    />

    <div class="_sticky-slideout-footer">
      <div class="d-flex justify-space-between">
        <v-btn
          id="ResetFilters"
          class="tertirary"
          :disabled="resetDisabled"
          @click="resetFilters"
        >
          Reset filters
        </v-btn>

        <v-btn
          id="ApplyFilters"
          class="primary"
          @click="applyFilters"
        >
          Apply filters
        </v-btn>
        
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { FilterOption, PortfolioSummaryQueryParams } from "types/Global";
import PortfolioData from "@/store/portfolio";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
  }
})

export default class FilterSlideout extends Vue {  
  public selectedPortfolioRole = "all";
  public portfolioRoles: FilterOption[] = PortfolioData.summaryFilterRoles;
  public selectedFundingStatuses: string[] = []; 
  private fundingStatuses: FilterOption[] = PortfolioData.summaryFilterFundingStatuses;
  public selectedCSPs: string[] = []; 
  private cspOptions: FilterOption[] = PortfolioData.summaryFilterCSPs;

  public get resetDisabled(): boolean {
    return this.selectedPortfolioRole === "all"
      && this.selectedCSPs.length === 0
      && this.selectedFundingStatuses.length === 0;
  }

  public portfolioSummaryQueryParams = PortfolioData.portfolioSummaryQPs;

  @Watch("portfolioSummaryQueryParams", { deep: true })
  public queryParamsUpdated(newParams: PortfolioSummaryQueryParams): void {
    this.selectedPortfolioRole = newParams.role || "all";
    this.selectedFundingStatuses = newParams.fundingStatuses?.map(obj => obj.value) || [];
    this.selectedCSPs = newParams.csps?.map(obj => obj.value) || [];
  }

  public async resetFilters(): Promise<void> {
    this.selectedPortfolioRole = "all";
    this.selectedFundingStatuses = [];
    this.selectedCSPs = [];
    this.applyFilters();
  }

  public async applyFilters(): Promise<void> {
    const selectedFundingStatusObjs = this.fundingStatuses.filter(
      obj => this.selectedFundingStatuses.includes(obj.value)
    );
    const selectedCSPObjs = this.cspOptions.filter(
      obj => this.selectedCSPs.includes(obj.value)
    );
    PortfolioData.setportfolioSummaryQueryParams({
      role: this.selectedPortfolioRole,
      fundingStatuses: selectedFundingStatusObjs,
      csps: selectedCSPObjs,
    })
  }

}

</script>
