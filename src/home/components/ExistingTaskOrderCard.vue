<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-3">
      Already have an existing JWCC task order?
    </h2>
    <p>
      We’ll gather details about your task order to start provisioning your
      cloud resources.
    </p>

    <!-- <ATATSearch
      buttonText="Search"
      placeHolder="Search Task Order Number"
      class="text-left mb-4 d-inline-block"
      helpText="Format: Must be 13 or 19 digits"
      :value.sync="searchString"
      @search="startProvisionWorkflow"
    /> -->

    <ATATSearch
      id="SearchTaskOrderNumber"
      buttonText="Search"
      helpText="Format: Must be either 13 or 19 digits"
      placeHolder="Search Task Order Number"
      class="text-left mb-4 d-inline-block"
      searchType="EDA"
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
import { Component } from "vue-property-decorator";

import ATATSearch from "@/components/ATATSearch.vue";

import { scrollToId } from "@/helpers";

@Component({
  components: {
    ATATSearch,
  },
})
export default class ExistingTaskOrderCard extends Vue {
  public searchString = "";
  public scrollToLearnMore(): void {
    scrollToId("SectionProvisionResources");
  }

  public async startProvisionWorkflow(): Promise<void> {
    this.$emit("startProvisionWorkflow", this.searchString);
  }
}
</script>
