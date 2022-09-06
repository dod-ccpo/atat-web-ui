<template>
  <v-app-bar
    id="PageHeader"
    app
    flat
    class="_atat-page-header _portfolio-summary"
    clipped-right
  >
    <div class=" d-flex justify-space-between width-100 align-center">

        <div id="NameHeader" tabindex="-1" class=" pt-1">
          <v-text-field
            id="HeaderTextField"
            dense
            placeholder="Portfolio Title"
            class=" h2 _headerTextField "
            hide-details
            autocomplete="off"
            v-model="_title"
          >
          </v-text-field>

        <div>
          <v-tabs class="_header-tab ml-2"
          v-model="_selectedTab">
            <v-tab
              v-for="tab in items"
              :key="tab"
              class="font-size-14 pa-0 pb-2 mr-6">{{tab}}</v-tab>

          </v-tabs>
        </div>
      </div>
      <div class="d-flex justify-end align-center">
        <v-btn
          icon
          class="mr-5 icon-24 _header-button"
          id="Info_Button"
          @click="openSlideoutPanel"
          @keydown.enter="openSlideoutPanel"
          @keydown.space="openSlideoutPanel">
          <v-icon class="text-base-dark">info_outline</v-icon>
        </v-btn>

        <v-menu
          :offset-y="true"
          nudge-left="170"
          id="MoreMenu"
          class="_more-menu _header-menu _portfolio"
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
              :disabled="item === 'Archive portfolio'"
              @click="moreMenuClick(item)"
            >
              <v-list-item-title
              >{{ item }}
                  <v-icon
                    v-if="item === 'Login to the CSP console'"
                    aria-hidden="true"
                    class="
                      pl-1
                      inline-block
                      text-primary"
                    >
                    launch
                  </v-icon>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <AddMembersModal
        :showModal.sync="showMembersModal"
      />
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import AppSections from "@/store/appSections";
import ATATTextField from "@/components/ATATTextField.vue";
import AddMembersModal from "@/portfolio/components/AddMembersModal.vue";
import SlideoutPanel from "@/store/slideoutPanel";

@Component({
  components: {
    ATATTextField,
    AddMembersModal,
  }
})

export default class PortfolioSummaryPageHead extends Vue {
  @Prop({ default: "Headline" }) private headline!: string;
  @Prop({ default: [""], required: true }) private items!: string[];
  @PropSync("value") private _selectedTab = 0;
  @PropSync("title") private _title = "";



  public moreMenuOpen = false;
  public moreMenuItems = [
    "Invite members to portfolio",
    "Rename portfolio",
    "Leave this portfolio",
    "Archive portfolio",
    "Login to the CSP console"
  ];
  public activeAppSection = AppSections.activeAppSection;
  public showMembersModal = false;

  public openModal():void {
    this.showMembersModal = true;
  };
  public openSlideoutPanel(e: Event): void {
    if (e && e.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }

  public async moreMenuClick(item: string) {
    switch(item) {
    case "Invite members to portfolio":
      this.openModal();
      break;
    default:
      return
    }
  }

}
</script>
