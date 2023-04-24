<template>
  <v-app-bar
    id="PageHeader"
    app
    flat
    class="_atat-page-header _portfolio-summary"
    clipped-right
    height="83"
  >
    <div class=" d-flex justify-space-between width-100 align-center">

        <div id="NameHeader" tabindex="-1" class="mt-1">
          <v-text-field
            id="HeaderTextField"
            dense
            placeholder="Portfolio Title"
            class=" h2 _headerTextField my-1"
            hide-details
            autocomplete="off"
            v-model="_title"
            @blur="saveTitle()"
          >
          </v-text-field>

        <div>
          <v-tabs 
            class="_header-tab "
            v-model="_selectedTab"
            v-if="!isPortfolioProvisioning"
          >
            <v-tab
              v-for="tab in items"
              :key="tab"
              :id="getIdText(tab) + '_Tab'"
              class="font-size-14 pa-1 pt-2  pb-5 mr-3">{{tab}}</v-tab>

          </v-tabs>
        </div>
      </div>
      <div 
        class="d-flex justify-end align-center"
        v-if="!isPortfolioProvisioning"      
      >
        <v-btn
          class="_icon-only mr-2"
          id="Info_Button"
          @click="openSlideoutPanel"
          @keydown.enter="openSlideoutPanel"
          @keydown.space="openSlideoutPanel"
        >
          <ATATSVGIcon
            name="infoOutline"
            width="20"
            height="20"
            color="base-dark"
          />
        </v-btn>
        <!-- TODO: Reinstate menu in future ticket when functionality complete
        <v-menu
          :offset-y="true"
          left
          id="MoreMenu"
          class="_more-menu _header-menu _portfolio"
          attach
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              id="MoreMenuButton"
              class="_more-menu-button _header-button _icon-only"
            >
              <v-icon class="text-base-dark">more_horiz</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              @click="openModal"
              id="InviteMembers_MenuItem"
            >
              <v-list-item-title
              >Invite members to portfolio
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="moveToInput()"
              id="RenamePortfolio_MenuItem"            
            >
              <v-list-item-title
              >Rename portfolio
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              id="LeavePortfolio_MenuItem"            
            >
              <v-list-item-title>
                Leave this portfolio
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="portfolioStatus.toLowerCase() !== 'expired'"
              id="ArchivePortfolio_MenuItem"            
            >
              <v-list-item-title>
                Archive portfolio
              </v-list-item-title>
            </v-list-item>
            <hr class="my-2" />
            <v-list-item
              id="LoginToCSPConsole_MenuItem"            
            >
              <v-list-item-title
                class="d-flex align-center"
              > Login to the CSP console
                  <ATATSVGIcon
                    class="ml-2"
                    name="launch"
                    width="15"
                    height="15"
                    color="primary"
                  />
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        -->
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import AppSections from "@/store/appSections";
import ATATTextField from "@/components/ATATTextField.vue";
import AddMembersModal from "@/portfolios/portfolio/components/shared/AddMembersModal.vue";
import PortfolioDrawer from "@/portfolios/portfolio/components/shared/PortfolioDrawer.vue";

import SlideoutPanel from "@/store/slideoutPanel";
import PortfolioStore from "@/store/portfolio";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { SlideoutPanelContent } from "../../../../../types/Global";
import {getIdText, hasChanges} from "@/helpers";

@Component({
  components: {
    ATATTextField,
    AddMembersModal,
    ATATSVGIcon
  }
})

export default class PortfolioSummaryPageHead extends Vue {
  @Prop({ default: "Headline" }) private headline!: string;
  @Prop() private portfolioStatus!: string;
  @Prop() public isPortfolioProvisioning!: boolean;
  @Prop({ default: [""], required: true }) private items!: string[];
  @PropSync("value") private _selectedTab!: number ;
  @PropSync("title") private _title!: string;

  public moreMenuOpen = false;
  public activeAppSection = AppSections.activeAppSection;
  public showDrawer = false;

  public openModal():void {
    PortfolioStore.setShowAddMembersModal(true);
  }

  public saveTitle(): void {
    if(hasChanges(PortfolioStore.currentPortfolio.title, this._title)) {
      PortfolioStore.updatePortfolioTitle(this._title);
    }
  }
  
  public async openSlideoutPanel(e: Event): Promise<void> {
    const currentSlideoutComponent = SlideoutPanel.slideoutPanelComponent;
    if (e && e.currentTarget) {
      e.preventDefault();
      e.cancelBubble = true;
    }

    if (!this.showDrawer || currentSlideoutComponent !== PortfolioDrawer) {
      if (e && e.currentTarget) {
        const opener = e.currentTarget as HTMLElement;
        const slideoutPanelContent: SlideoutPanelContent = {
          component: PortfolioDrawer,
        }
        await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
        this.showDrawer = true;
        SlideoutPanel.openSlideoutPanel(opener.id);
      }
    } else {
      this.showDrawer = false
      SlideoutPanel.closeSlideoutPanel()
    }
  }
  public moveToInput(): void {
    const input = document.getElementById('HeaderTextField');
    if(input){
      input.focus()
    }
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public async mounted(): Promise<void> {
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PortfolioDrawer,
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

}
</script>
