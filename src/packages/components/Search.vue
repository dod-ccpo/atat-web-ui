<template>
  <div class="bg-base-lightest mt-4 pa-4 border-rounded">
    <div class="d-flex justify-space-between align-center">
      <ATATSearch
        id="SearchPackages"
        placeHolder="Search packages"
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
            width="167"
            iconType="chevron"
          />
        </div>
      </div>
    </div>
  </div>

</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import { PackageSummaryStore } from "@/store/packageSummary";
@Component({
  components:{
    ATATSearch,
    ATATSelect
  }
})
export default class Search extends Vue {

  // public async searchPortfolios(): Promise<void> {
  //   await this.setQueryParams("searchString", this.searchString);
  // }
  // public async sortPortfolios(valObj: Record<string, string>): Promise<void> {
  //   await this.setQueryParams("sort", valObj.newSelectedValue);
  // }
  // public async clearSearch(): Promise<void> {
  //   await this.setQueryParams("searchString", "");
  //   this.searchString = "";
  //   this.searchedString = "";
  // }
  // public async setQueryParams(key: string, value: string): Promise<void> {
  //   await PackageSummaryStore.setPortfolioSummaryQueryParams({
  //     [key]: value
  //   });
  // }
}
</script>

