<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-3">
      Already have an existing JWCC task order?
    </h2>
    <p>
      We’ll gather a few details about your task order and start provisioning 
      your cloud resources with your CSP.
    </p>

    <ATATSearch 
      buttonText="Search"
      placeholder="Search Task Order Number"
      class="mb-4 d-inline-block"
    />

    <v-btn 
      id="LearnMoreTOSearch"
      class="secondary"
      @click="scrollToLearnMore"
    >
      Learn More
    </v-btn>

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
