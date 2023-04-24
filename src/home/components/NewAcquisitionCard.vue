<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-5">
      Start building your JWCC acquisition package
    </h2>
    <p class="mb-8">
      We’ll guide you through steps to prepare procurement documents based on 
      your project’s specific needs.
    </p>
    <v-btn
      id="StartNewAcquisition"
      class="primary mb-4"
      @click="startNewAcquisition"
      @keydown.enter="startNewAcquisition"
      @keydown.space="startNewAcquisition"
    >
      Start a new acquisition
    </v-btn>

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { scrollToId } from "@/helpers";

@Component({})

export default class NewAcquisitionCard extends Vue {

  public async startNewAcquisition(): Promise<void> {
    this.$emit("startNewAcquisition");
  }

  public scrollToLearnMore(): void {
    scrollToId("SectionPreparePackage");
  }

}

</script>
