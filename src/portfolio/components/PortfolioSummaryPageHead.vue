<template>
  <v-app-bar
    id="PageHeader"
    app
    flat
    class="_atat-page-header _portfolio-summary"
  >
    <div class=" d-flex justify-space-between width-100 align-center">

        <div id="NameHeader" tabindex="-1" class="h2 pt-1">
          <v-text-field
            id="HeaderTextField"
            dense
            placeholder="Portfolio Title"
            class=" h2 _headerTextField "
            hide-details
            autocomplete="off"
          >
          </v-text-field>

        <div>
          <v-tabs class="_header-tab"
          v-model="_selectedTab">
            <v-tab
              v-for="tab in items"
              :key="tab"
              class="font-size-14 pa-0 mr-6">{{tab}}</v-tab>

          </v-tabs>
        </div>
      </div>
      <div class="d-flex justify-end align-center">
        <v-btn
          v-if="activeAppSection === 'Portfolio Summary'"
          icon
          class="mr-5 icon-24 _header-button"
          id="Person_Button">
          <v-icon class="text-base-dark">info_outline</v-icon>
        </v-btn>
        <v-btn v-else icon class="mr-5 icon-24 _header-button" id="Person_Button">
          <v-icon class="text-base-dark">person_add_alt_1</v-icon>
        </v-btn>

        <v-menu
          :offset-y="true"
          nudge-left="170"
          id="MoreMenu"
          class="_more-menu _header-menu"
          attach
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              id="MoreMenuButton"
              class="_more-menu-button _header-button"
            >
              <v-icon class="text-base-dark">more_horiz</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in moreMenuItems"
              :key="index"
              @click="moreMenuClick(index)"
              :class="{active : item.title === activeAppSection}"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import AppSections from "@/store/appSections";
import SlideoutPanel from "@/store/slideoutPanel";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField
  }
})

export default class PortfolioSummaryPageHead extends Vue {
  @Prop({ default: "Headline" }) private headline!: string;
  @Prop({ default: [""], required: true }) private items!: string[];
  @PropSync("value") private _selectedTab = 0;

  public moreMenuOpen = false;
  public moreMenuItems = AppSections.appSectionMenuItems;
  public activeAppSection = AppSections.activeAppSection;


  public async moreMenuClick(index: number): Promise<void> {
    SlideoutPanel.closeSlideoutPanel()
    const selectedSection = this.moreMenuItems[index].title;
    AppSections.changeActiveSection(selectedSection);
  }

}
</script>
