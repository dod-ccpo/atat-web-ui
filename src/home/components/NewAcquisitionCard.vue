<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-3">
      Start building your JWCC acquisition package
    </h2>
    <p>
      We’ll guide you through steps to prepare procurement documents based on 
      your project’s specific needs.
    </p>
    <div class="mb-4">
      <StartNewAcquisition
          :id="'StartNewAcquisition'"
          :label="'Start a new acquisition'"
      />
    </div>
    <v-btn 
      id="LearnMoreBuilding"
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

import { scrollToId } from "@/helpers";
import StartNewAcquisition from "@/packages/components/StartNewAcquisition.vue";

@Component({
  components: {
    StartNewAcquisition
  }
})

// TODO: This component is imported by NewUser component but not used. Not defined or imported
//  elsewhere. Could probably be deleted
export default class NewAcquisitionCard extends Vue {

  public async startNewAcquisition(): Promise<void> {
    this.$emit("startNewAcquisition");
  }

  public scrollToLearnMore(): void {
    scrollToId("SectionPreparePackage");
  }

}

</script>
