<template>
  <div>
    <ATATSlideoutPanel v-if="panelContent">
      <component :is="panelContent"></component>
    </ATATSlideoutPanel>

    <ATATToast />

    <v-main>
      <v-app-bar
        id="PageHeader"
        app
        flat
        class="_atat-page-header _portfolios"
        clipped-right
        height="118"
      >
        <div id="NameHeader" tabindex="-1" class="mt-1">
          <h1 class="mb-2 mt-5 pl-1">Portfolios</h1>
          <div>
            <v-tabs class="_header-tab "
              v-model="tabIndex">
              <v-tab
                v-for="(tab, index) in tabItems"
                :key="index"
                :id="getIdText(tab.text) + '_Tab'"
                @click="tabClicked(tab.type)"
                class="font-size-14 pa-1 pt-2 pb-4 mr-3"
              >{{ tab.text }}</v-tab>
            </v-tabs>
          </div>
        </div>
        <div class="d-flex justify-end align-center"></div>
      </v-app-bar>
      <v-container
        class="container-max-width"
      >
        <PortfoliosSummary :active-tab="activeTab" default-sort="name" />

      </v-container>
      <ATATFooter/>
    </v-main>

  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfoliosSummary from "@/portfolios/components/PortfoliosSummary.vue";
import ATATFooter from "@/components/ATATFooter.vue";
import { getIdText } from "@/helpers";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATToast from "@/components/ATATToast.vue";

@Component({
  components: {
    PortfoliosSummary,
    ATATSlideoutPanel,
    ATATFooter,
    ATATToast,
  }
})

export default class Portfolios extends Vue {
  public tabIndex = 0;
  public tabItems: Record<string, string>[] = [
    {
      type: "ALL",
      text: "All portfolios",
    },
    {
      type: "PROCESSING",
      text: "Processing",
    },
    {
      type: "ACTIVE",
      text: "Active",
    },
  ];
  public activeTab = this.tabItems[0].type;

  private getIdText(string: string) {
    return getIdText(string);
  }

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public tabClicked(tabType: string): void {
    this.activeTab = tabType;
  }

}

</script>

