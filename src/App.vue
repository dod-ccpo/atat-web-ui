<template>
  <v-app>
    <div v-if="appContentComponent">
      <component :is="appContentComponent" />
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import AppPackageBuilder from "@/AppPackageBuilder.vue";
import TaskOrderLookup from "@/TaskOrderLookup.vue";

import AppSections from "@/store/appSections";

@Component({})

export default class App extends Vue {

  public get activeAppSection(): string {
    return AppSections.activeAppSection;
  }

  @Watch("activeAppSection")
  public activeAppSectionChanged(newActiveSection: string): void {
    switch (newActiveSection) {
    case this.sectionTitles.AcquisitionPackage:
      AppSections.setAppContentComponent(AppPackageBuilder);
      break;
    case this.sectionTitles.TOLookup:
      AppSections.setAppContentComponent(TaskOrderLookup);
      break;
    }
  }

  public get appContentComponent() {
    return AppSections.appContentComponent;
  }

  public sectionTitles: Record<string, string> = {};

  public async loadOnEnter(): Promise<void> {
    const storeData = await AppSections.getSectionData();
    if (storeData) {
      // this.activeAppSection = storeData.activeAppSection;
      this.sectionTitles = storeData.sectionTitles;
    }
  }

  public async mounted(): Promise<void> {
    await AppSections.setAppContentComponent(AppPackageBuilder);
    await this.loadOnEnter();
  }

}

</script>