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
import { Component } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { Checkbox, RadioButton } from "types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
    ATATRadioGroup,
  }
})

export default class FilterSlideout extends Vue {  
  public selectedPortfolioRole = "all";
  public portfolioRoles: RadioButton[] = [
    {
      label: "All of my portfolios",
      value: "all",
      id: "All",
    },
    {
      label: "Managed by me",
      value: "managed",
      id: "Managed"
    },
  ];

  public selectedFundingStatuses: string[] = []; 
  private fundingStatuses: Checkbox[] = [
    {
      label: "On track",
      value: "OnTrack",
      id: "OnTrack"
    },
    {
      label: "Expiring soon",
      value: "ExpiringSoon",
      id: "ExpiringSoon",
    },
    {
      label: "Funding at-risk",
      value: "AtRisk",
      id: "AtRisk",
    },
    {
      label: "Delinquent",
      value: "Delinquent",
      id: "Delinquent",
    },
  ];

  public selectedCSPs: string[] = []; 
  private cspOptions: Checkbox[] = [
    {
      label: "Amazon Web Services",
      value: "aws",
      id: "Amazon"
    },
    {
      label: "Azure",
      value: "azure",
      id: "Azure"
    },
    {
      label: "Google Cloud Platform",
      value: "google",
      id: "GoogleCloud"
    },
    {
      label: "Oracle",
      value: "oracle",
      id: "Oracle"
    },
  ];

  public get resetDisabled(): boolean {
    return this.selectedPortfolioRole === "all"
      && this.selectedCSPs.length === 0
      && this.selectedFundingStatuses.length === 0;
  }

  public applyFilters(): void {
    // EJY - make api call to retrieve new records
  }

  public resetFilters(): void {
    //
    this.selectedPortfolioRole = "all";
    this.selectedFundingStatuses = [];
    this.selectedCSPs = [];
    // EJY - make api call to retrieve new records
  }

}

</script>
