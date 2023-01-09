<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-3">
      Already have an existing JWCC task order?
    </h2>
    <p>
      We’ll gather details about your task order to start provisioning your cloud resources.
    </p>

    <ATATSearch 
      buttonText="Search"
      placeHolder="Search Task Order Number"
      class="text-left mb-4 d-inline-block"
      helpText="Format: Must be 13 or 19 digits"
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
  }
})

export default class ExistingTaskOrderCard extends Vue {

  public scrollToLearnMore(): void {
    scrollToId("SectionProvisionResources");
  }

}

</script>
