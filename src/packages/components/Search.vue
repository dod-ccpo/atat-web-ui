<template>
  <div class="bg-base-lightest mt-4 pa-4 border-rounded">
    <div class="d-flex justify-space-between align-center">
      <ATATSearch
        id="SearchPackages"
        placeHolder="Search packages"
        width="450px"
        @search="searchPackages"
        @clear="clearSearch"
        :value.sync="_searchString"
      />
      <div class="d-flex align-center">
        <div>
          <ATATSelect
            id="PackageSort"
            class="_small _alt-style-clean _search-bar-sort"
            width="167"
            iconType="chevron"
            :items="sortOptions"
            :selectedValue.sync="_selectedSort"
          />
        </div>
      </div>
    </div>
  </div>

</template>
<script lang="ts">
import Vue from "vue";

import { Component, PropSync } from "vue-property-decorator";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import { PackageSummaryStore } from "@/store/packageSummary";
import { SelectData } from "../../../types/Global";
@Component({
  components:{
    ATATSearch,
    ATATSelect
  }
})
export default class Search extends Vue {
  @PropSync("searchString") private _searchString!: string;
  @PropSync("selectedSort") private _selectedSort!: 'project_overview' | 'DESCsys_updated_on';

  public sortOptions: SelectData[] = [
    { text: "Package name A-Z", value: "project_overview" },
    { text: "Recently modified", value: "DESCsys_updated_on" },
  ];

  public clearSearch(): void {
    this._searchString = "";
    this.$emit("clear");
  }

  public searchPackages(): void {
    this.$emit("search");
  }
}
</script>

