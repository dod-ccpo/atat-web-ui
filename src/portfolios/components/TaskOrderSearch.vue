<template>
  <ATATSearch
    id="SearchTaskOrderNumber"
    buttonText="Search"
    helpText="Format: Must be 13 or 19 characters"
    placeHolder="Search Task Order Number"
    class="text-left mb-0 d-inline-block"
    searchType="EDA"
    :wrapperWidth="wrapperWidth"
    :width="width"
    :validate-on-blur="true"
    :value.sync="_TONumber"
    :searchButtonDisabled="searchButtonDisabled"
    @search="startProvisionWorkflow"
    :rules="rules"
    :mask="['^([0-9A-Za-z]{13})([0-9A-Za-z]{6})?$']"
    :isMaskRegex="true"
    :label="label"
    :labelClass="labelClass"
    :tooltipText="tooltipText"
    :resetValidationNow.sync="_resetValidationNow"
    :isModal="isModal"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATSearch from "@/components/ATATSearch.vue";

@Component({
  components: {
    ATATSearch,
  },
})
export default class TaskOrderSearch extends Vue {

  @Prop() public label?: string;
  @Prop() public labelClass?: string;
  @Prop() public tooltipText?: string;
  @Prop({default: false}) public isModal?: boolean;
  @Prop({default: '320px'}) public wrapperWidth?: string;
  @Prop({default: '320px'}) public width?: boolean;

  @PropSync("TONumber") public _TONumber?: string;
  @PropSync("resetValidationNow") public _resetValidationNow!: boolean;

  public rules = [
    this.$validators.allowedLengths(
      [13,19], 
      'Your task order number must be either 13 or 19 characters.'
    ),
  ];

  public searchButtonDisabled = true;

  @Watch("_TONumber")
  public TONumberChanged(newVal: string): void {
    if (newVal) {
      if (this._TONumber !== newVal.toUpperCase()) {
        this._TONumber = newVal.toUpperCase();
      }
      this.searchButtonDisabled = newVal.length !== 13 && newVal.length !== 19;
    }
  }

  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow");
  }
}
</script>
