<template>
  <ATATSearch
    id="SearchTaskOrderNumber"
    buttonText="Search"
    helpText="Format: Must be 13 or 19 characters"
    placeHolder="Search task order number"
    class="text-left mb-0 d-inline-block"
    searchType="EDA"
    :wrapperWidth="wrapperWidth"
    :width="width"
    :validate-on-blur="true"
    :value="_TONumber"
    @update:value="_TONumber = $event"
    :searchButtonDisabled="searchButtonDisabled"
    @search="startProvisionWorkflow"
    :rules="rules"
    :mask="['^([0-9A-Za-z]{13})([0-9A-Za-z]{6})?$']"
    :isMaskRegex="true"
    :label="label"
    :labelClass="labelClass"
    :tooltipText="tooltipText"
    :resetValidationNow="_resetValidationNow"
    @update:resetValidationNow="_resetValidationNow = $event"
    :isModal="isModal"
  />
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATSearch from "@/components/ATATSearch.vue";

@Component({
  components: {
    ATATSearch,
  },
})
class TaskOrderSearch extends Vue {

  @Prop() public label?: string;
  @Prop() public labelClass?: string;
  @Prop() public tooltipText?: string;
  @Prop({default: false}) public isModal?: boolean;
  @Prop({default: '320px'}) public wrapperWidth?: string;
  @Prop({default: '320px'}) public width?: boolean;

  @PropSync("TONumber") public _TONumber?: string;
  @PropSync("resetValidationNow") public _resetValidationNow!: boolean;

  public rules = [
    // this.$validators.allowedLengths(
    //   [13,19], 
    //   'Your task order number must be either 13 or 19 characters.'
    // ),
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
export default toNative(TaskOrderSearch)
</script>
