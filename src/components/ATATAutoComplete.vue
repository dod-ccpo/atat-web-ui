<template>
  <div :id="id + '_AutoComplete_Wrapper'">
    <label :for="id" :class="{ 'd-sr-only': labelSrOnly }" class="mb-2 d-block">
      {{ label }}
      <span v-if="optional" class="optional"> Optional </span>
    </label>
    <v-autocomplete
      ref="atatAutoComplete"
      :id="id"
      v-model="_selectedItem"
      :class="inputClass"
      :items="items"
      :search-input.sync="searchText"
      :placeholder="placeholder"
      :append-icon="icon"
      :item-text="titleKey"
      :hide-details="true"
      :filter="customFilter"
      :rules="rules"
      return-object
      clearable
      outlined
      attach
      dense
      @blur="onBlur"
      @update:search-input="updateSearchInput"
    >
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title
            v-text="item[titleKey]"
            :class="{ 'font-weight-normal': !subtitleKey }"
          ></v-list-item-title>
          <v-list-item-subtitle v-if="subtitleKey" v-text="item[subtitleKey]">
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>

      <template v-slot:no-data>
        <v-list-item v-show="searchText !== null" class="no-results">
          <v-list-item-title>
            No results found.
            <a
              v-if="noResultsText"
              @click="noResultsAction"
              class="_text-link"
              role="button"
              tabindex="0"
              :id="'NoResults_' + id"
            >
              {{ noResultsText }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
    <ATATErrorValidation :errorMessages="errorMessages" />
  </div>
</template>

<script lang="ts">
/* eslint vue/no-v-text-v-html-on-component: 1 */
import Vue from "vue";
import { AutoCompleteItem } from "types/Global";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATErrorValidation
  }
})

export default class ATATAutoComplete extends Vue {
  // refs
  $refs!: {
    atatAutoComplete: Vue &
    {
      errorBucket: string[];
      errorCount: number;
      blur: ()=> void;
      focus: ()=> void;
      validate: () => boolean;
    };
  };
  // data
  private errorMessages: string[] = [];
  private searchText = null;
  private isReset = false;

  // props

  @Prop({ default: "", required: true }) private id!: string;
  @Prop({ default: "", required: true }) private label!: string;
  @Prop({ default: false }) private labelSrOnly!: string;
  @Prop({ default: "" }) private icon!: string;
  @Prop({ default: () => [] }) private rules!: Array<unknown>;
  @Prop({ default: "", required: true }) private titleKey!: string;
  @Prop({ default: "" }) private subtitleKey!: string;
  @Prop({ default: [], required: true }) private searchFields!: [];
  @Prop({  default: () => [] , required: true }) private items!: [];
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "" }) private noResultsText!: string;
  @PropSync("selectedItem") private _selectedItem!: AutoCompleteItem;

  // computed

  get inputClass(): string {
    let inputClass = this.icon.length ? "is-" + this.icon + "-icon" : "";
    if (this.icon === "search") {
      inputClass += " icon-no-rotate";
    }
    return inputClass;
  }

  // methods

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    if(!this.$refs.atatAutoComplete.validate())
      this.setErrorMessage();
  }

  private customFilter(item: AutoCompleteItem, queryText: string) {
    let text = "";
    this.searchFields.forEach((key) => {
      text += item[key] + " ";
    });
    const searchText = queryText.toLowerCase();
    return text.toLowerCase().indexOf(searchText) > -1;
  }

  private noResultsAction() {
    this._selectedItem = {};
    this.searchText = null;
    this.isReset = true;
    this.$emit("noAutoCompleteResultsAction");
  }

  private setErrorMessage(): void {
    setTimeout(()=>{
      this.errorMessages = this.$refs.atatAutoComplete?.errorBucket;
    })
  }
  //@Events
  private onBlur(value: string) : void{
    this.setErrorMessage();
    this.$emit('blur', value);
  }

  private updateSearchInput(): void {
    if (this.isReset) {
      this._selectedItem = {};
      this.searchText = null;
      this.$emit("autocompleteInputUpdate", this.isReset);
    }
    this.setErrorMessage();
    this.isReset = false;
  }
}
</script>