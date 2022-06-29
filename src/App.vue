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

import Sections from "@/store/sections";

@Component({})

export default class App extends Vue {

  public get activeSection(): string {
    return Sections.activeSection;
  }

  @Watch("activeSection")
  public activeSectionChanged(newActiveSection: string): void {
    switch (newActiveSection) {
    case this.sectionTitles.AcquisitionPackage:
      Sections.setAppContentComponent(AppPackageBuilder);
      break;
    case this.sectionTitles.TOLookup:
      Sections.setAppContentComponent(TaskOrderLookup);
      break;
    }
  }

  public get appContentComponent() {
    return Sections.appContentComponent;
  }

  public sectionTitles: Record<string, string> = {};

  public async loadOnEnter(): Promise<void> {
    const storeData = await Sections.getSectionData();
    if (storeData) {
      // this.activeSection = storeData.activeSection;
      this.sectionTitles = storeData.sectionTitles;
    }
  }

  public async mounted(): Promise<void> {
    await Sections.setAppContentComponent(AppPackageBuilder);
    await this.loadOnEnter();
  }

}

</script>