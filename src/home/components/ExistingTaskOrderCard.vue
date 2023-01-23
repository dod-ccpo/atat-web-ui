<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-5">
      Already have an existing JWCC task order?
    </h2>
    <p class="mb-8">
      We’ll gather details about your task order to start provisioning your cloud resources.
    </p>

    <ATATSearch 
      buttonText="Search"
      id="TOSearchNewUser"
      :value.sync="TONumber"
      placeHolder="Search Task Order Number"
      class="mb-0 d-inline-block"
      helpText="Format: Must be 13 or 19 digits"
      :rules="rules"
      searchType="EDA"
      wrapperWidth="320px"
      :validateOnBlur="true"
      :searchButtonDisabled="searchButtonDisabled"   
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
  }
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

}

</script>
