<template>
  <v-card id="StartBuildingPackageCard" class="text-center">
    <h2 class="h1 text-primary mb-3">
      Start building your JWCC acquisition package
    </h2>
    <p>
      We’ll guide you through steps to prepare procurement documents based on 
      your project’s specific needs.
    </p>
    <v-btn
      id="StartNewAcquisition"
      class="primary mb-4"
      @click="startNewAcquisition"
    >
      Start a new acquisition
    </v-btn>
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
import { routeNames } from "@/router/stepper";
import AppSections from "@/store/appSections";
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { scrollToId } from "@/helpers";
import Steps from "@/store/steps";

@Component({})

export default class NewAcquisitionCard extends Vue {

  public async startNewAcquisition(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    this.$router.push({name: routeNames.ProjectOverview });
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }

  public scrollToLearnMore(): void {
    scrollToId("SectionPreparePackage");
  }

}

</script>
