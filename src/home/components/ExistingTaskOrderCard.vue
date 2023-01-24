<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-5">
      Already have an existing JWCC task order?
    </h2>
    <p class="mb-8">
      We’ll gather details about your task order to start provisioning your cloud resources.
    </p>

    <ATATSearch
      id="SearchTaskOrderNumber"
      buttonText="Search"
      helpText="Format: Must be either 13 or 19 digits"
      placeHolder="Search Task Order Number"
      class="text-left mb-4 d-inline-block"
      searchType="EDA"
      wrapperWidth="320px"
      :validate-on-blur="true"
      :value.sync="searchString"
      @search="startProvisionWorkflow"
      :rules="[
        $validators.required('Please enter your awarded task order number.'),
        $validators.isMaskValid(
          ['^([0-9A-Z]{13})([0-9A-Z]{4})?$'],
          `Your task order number must be either 13 or 19 characters.`,
          true
        ),
      ]"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATSearch from "@/components/ATATSearch.vue";

@Component({
  components: {
    ATATSearch,
  },
})
export default class ExistingTaskOrderCard extends Vue {

public TONumber = "";

  public rules = [
    this.$validators.allowedLengths(
      [13,19], 
      'Your task order number must be either 13 or 19 characters.'
    ),
  ];

  public searchButtonDisabled = true;

  @Watch("TONumber")
  public TONumberChanged(newVal: string): void {
    this.searchButtonDisabled = newVal.length !== 13 && newVal.length !== 19;
  }
  public searchString = "";

  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow", this.searchString);
  }
}
</script>
