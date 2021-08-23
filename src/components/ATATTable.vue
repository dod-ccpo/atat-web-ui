<template>
  <div>
    title: hola
    <VDataTable
      class="ATATTable"
      :items="data.items"
      :headers="data.headers"
      :must-sort="sorting"
    >
    </VDataTable>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { VDataTable } from "vuetify/lib/components";

export interface DataTableHeader {
  text: string;
  value: string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  divider?: boolean;
  class?: string | string[];
  cellClass?: string | string[];
  width?: string | number;
  filter?: (value: any, search: string, item: any) => boolean;
  sort?: (a: any, b: any) => number;
}

export interface ATATTableData {
  headers?: DataTableHeader[];
  items: any[];
  title?: string;
}

@Component({})
export default class ATATTable extends VDataTable {
  @Prop({ default: true }) private sorting!: boolean;
  @Prop({ default: [] }) private data!: ATATTableData;
}
</script>
