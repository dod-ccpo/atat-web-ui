<template>
  <div class="bg-base-lightest mt-4 pa-4 _border-rounded">
    <div class="d-flex justify-space-between align-center">
      <ATATSearch
        id="SearchPackages"
        placeHolder="Search packages"
        width="450px"
        @search="searchPackages"
        @clear="clearSearch"
        :value="_searchString"
        @update:value="_searchString = $event"
      />
      <div class="d-flex align-center">
        <ATATSelect
          id="PackageSort"
          class="_small _alt-style-clean _search-bar-sort"
          width="167"
          iconType="chevron"
          :items="sortOptions"
          :selectedValue="_selectedSort"
          @update:selectedValue="_selectedSort = $event"
          variant="none"
        />
      </div>
    </div>
  </div>

</template>
<script lang="ts">

import { Component, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"

import ATATSelect from "@/components/ATATSelect.vue";
import ATATSearch from "@/components/ATATSearch.vue";
import { SelectData } from "../../../types/Global";
@Component({
  components:{
    ATATSearch,
    ATATSelect
  }
})
class PackageSearch extends Vue {
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

export default toNative(PackageSearch)

</script>

