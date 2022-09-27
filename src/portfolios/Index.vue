<template>
  <v-main>
    <div>
      Future Portfolios page
    </div>
    <v-btn @click="changeSection">
      link portfolio Summary
    </v-btn>
  </v-main>
</template>
<script lang="ts">
import Vue from "vue";


import { Component } from "vue-property-decorator";
import AppSections from "@/store/appSections";
@Component({
})
export default class Portfolios extends Vue {
  public async changeSection(): Promise<void> {
    const sectionData = await AppSections.getSectionData();
    AppSections.changeActiveSection("Portfolio Summary")
  }
}
</script>

