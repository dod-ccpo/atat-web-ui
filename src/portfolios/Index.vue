<template>
  <div>
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>
    <v-main>
      <v-app-bar
        id="PageHeader"
        app
        flat
        class="_atat-page-header _portfolios"
        clipped-right
        height="83"
      >
        <div id="NameHeader" tabindex="-1" class="mt-1">
          <h1 class="mb-2 mt-5 pl-1">Portfolios</h1>
          <div>
            <v-tabs class="_header-tab "
              v-model="tabIndex">
              <v-tab
                v-for="tab in tabItems"
                :key="tab"
                :id="getIdText(tab) + '_Tab'"
                class="font-size-14 pa-1 pt-2 pb-4 mr-3">{{tab}}</v-tab>

            </v-tabs>
          </div>
        </div>
        <div class="d-flex justify-end align-center"></div>
      </v-app-bar>
      <v-container
        class="container-max-width"
        style="margin-bottom:300px !important"
      >
        <AllPortfolios v-if="tabItems[tabIndex] === 'All portfolios'" />
        <ProcessingPortfolios v-if="tabItems[tabIndex] === 'Processing'"/>
        <ActivePortfolios
          v-if="tabItems[tabIndex] === 'Active'"
        />

        <v-btn @click="changeSection" class="my-10">
          link portfolio Summary
        </v-btn>

      </v-container>
      <ATATFooter/>
    </v-main>

  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import AppSections from "@/store/appSections";
import AllPortfolios from "@/portfolios/components/AllPortfolios.vue";
import ActivePortfolios from "@/portfolios/components/ActivePortfolios.vue";
import ProcessingPortfolios from "@/portfolios/components/ProcessingPortfolios.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import { getIdText } from "@/helpers";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";

@Component({
  components: {
    AllPortfolios,
    ActivePortfolios,
    ProcessingPortfolios,
    ATATSlideoutPanel,
    ATATFooter,
  }
})

export default class Portfolios extends Vue {
  public tabIndex = 0;
  public tabItems = [
    "All portfolios",
    "Processing",
    "Active"
  ]
  public async changeSection(): Promise<void> {
    AppSections.changeActiveSection("Portfolio Summary")
  }
  private getIdText(string: string) {
    return getIdText(string);
  }
  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }
}

</script>

