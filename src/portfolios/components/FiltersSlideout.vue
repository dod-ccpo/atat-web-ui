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
import PortfolioStore from "@/store/portfolio";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
  }
})

export default class FilterSlideout extends Vue {  
  public selectedPortfolioRole = "ALL";
  public portfolioRoles: FilterOption[] = PortfolioStore.summaryFilterRoles;
  public selectedFundingStatuses: string[] = []; 
  private fundingStatuses: FilterOption[] = PortfolioStore.summaryFilterFundingStatuses;
  public selectedCSPs: string[] = []; 
  private cspOptions: FilterOption[] = PortfolioStore.summaryFilterCSPs;

  public get resetDisabled(): boolean {
    return this.selectedPortfolioRole === "ALL"
      && this.selectedCSPs.length === 0
      && this.selectedFundingStatuses.length === 0;
  }

  public portfolioSummaryQueryParams = PortfolioStore.portfolioSummaryQPs;

  @Watch("portfolioSummaryQueryParams", { deep: true })
  public queryParamsUpdated(newParams: PortfolioSummaryQueryParams): void {
    this.selectedPortfolioRole = newParams.role || "ALL";
    this.selectedFundingStatuses = newParams.fundingStatuses?.map(obj => obj.value) || [];
    this.selectedCSPs = newParams.csps?.map(obj => obj.value) || [];
  }

  public async resetFilters(): Promise<void> {
    PortfolioStore.resetFilters();
  }

  public async applyFilters(): Promise<void> {
    const selectedFundingStatusObjs = this.fundingStatuses.filter(
      obj => this.selectedFundingStatuses.includes(obj.value)
    );
    const selectedCSPObjs = this.cspOptions.filter(
      obj => this.selectedCSPs.includes(obj.value)
    );
    PortfolioStore.setPortfolioSummaryQueryParams({
      role: this.selectedPortfolioRole,
      fundingStatuses: selectedFundingStatusObjs,
      csps: selectedCSPObjs,
    })
  }

}

</script>
