<template>
  <div :id="id + '_AutoComplete_Wrapper'">
    <label
      :for="id"
      :class="{ 'd-sr-only': labelSrOnly }"
      class="mb-2 d-block"
    >
      {{ label }}
      <span v-if="optional" class="optional">
        Optional
      </span>
    </label>
    <v-autocomplete
      :id="id"
      v-model="_selectedItem"
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
          <v-list-item-title 
            v-text="item[titleKey]"
            :class="{'font-weight-normal': !subtitleKey}"
          ></v-list-item-title>
          <v-list-item-subtitle v-if="subtitleKey" v-text="item[subtitleKey]"></v-list-item-subtitle>
        </v-list-item-content>
      </template>

      <template v-slot:no-data>
        <v-list-item v-show="search !== null" class="no-results">
          <v-list-item-title>
            No results found.
            <a v-if="noResultsText" @click="noResultsAction" class="text-link">
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
  private search = null;

  // props
  @Prop({ default: "", required: true }) private id!: string;
  @Prop({ default: "", required: true }) private label!: string;
  @Prop({ default: false }) private labelSrOnly!: string;
  @Prop({ default: "" }) private icon!: string;
  @Prop({ default: "", required: true }) private titleKey!: string;
  @Prop({ default: "" }) private subtitleKey!: string;
  @Prop({ default: () => [], required: true }) private searchFields!: [];
  @Prop({ default: () => [], required: true }) private items!: [];
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "" }) private noResultsText!: string;
  @PropSync("selectedItem") private _selectedItem!: unknown;

  // computed
  get inputClass(): string {
    let inputClass = this.icon.length ? "is-" + this.icon + "-icon" : "";
    if (this.icon === "search") {
      inputClass += " icon-no-rotate";
    }
    return inputClass;
  }

  // methods
  private onChange(val: any): void {
    this._selectedItem = val;
  }

  private customFilter(item: any, queryText: string) {
    let text = "";
    this.searchFields.forEach((key) => {
      text += item[key] + " ";
    });
    const searchText = queryText.toLowerCase();
    return text.toLowerCase().indexOf(searchText) > -1;
  }

  private noResultsAction() {
    this.$emit("noAutoCompleteResultsAction");
  }

}
</script>
