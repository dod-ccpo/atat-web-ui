<template>
  <div>
    <v-autocomplete
      v-model="model"
      :class="inputClass"
      :items="items"
      :search-input.sync="search"
      :placeholder="placeholder"
      :append-icon="icon"
      :item-text="titleKey"
      :filter="customFilter"
      @change="onChange"
      return-object
      clearable
      outlined
      attach
      dense
    >
      <template v-slot:item="{item}">
        <v-list-item-content>
          <v-list-item-title v-text="item[titleKey]"></v-list-item-title>
          <v-list-item-subtitle v-if="subtitleKey" v-text="item[subtitleKey]"></v-list-item-subtitle>
        </v-list-item-content>
      </template>

      <template v-slot:no-data>
        <v-list-item v-show="search !== null">
          <v-list-item-title>
            No results found.
            <a v-if="noResultsText" @click="noResultsAction">
              {{ noResultsText }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </template>

    </v-autocomplete>
  </div>

</template>

<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";

@Component({})

export default class ATATAutoComplete extends Vue {
  // data
  private model = null;
  private search = null;

  // props
  @Prop({ default: "" }) private icon!: string;
  @Prop({ default: "" }) private titleKey!: string;
  @Prop({ default: "" }) private subtitleKey!: string;
  @Prop({ default: () => [], required: true }) private searchFields!: [];
  @Prop({ default: () => [] }) private items!: [];
  @Prop({ default: "" }) private placeholder!: string;
  @PropSync("selectedValue") private _selectedValue!: unknown;
  @Prop({ default: "" }) private noResultsText!: string;

  // computed
  get hasSearchText(): boolean {
    return (this.search !== null && this.search !== "");
  }

  get inputClass(): string {
    let inputClass = this.icon.length ? "is-" + this.icon + "-icon" : "";
    if (this.icon === "search") {
      inputClass += " icon-no-rotate";
    }
    return inputClass;
  }

  // methods
  private onChange(val: any): void {
    this._selectedValue = val;
  }

  private customFilter(item: any, queryText:string) {
    let text = "";
    this.searchFields.forEach((key) => {
      text += item[key] + " ";
    });
    const searchText = queryText.toLowerCase();
    return text.toLowerCase().indexOf(searchText) > -1;
  }

  private noResultsAction() {
    this.$emit("noResultsAction");
  }

}
</script>
