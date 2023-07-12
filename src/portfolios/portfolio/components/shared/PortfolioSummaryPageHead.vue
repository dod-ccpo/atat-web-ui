<template>
  <div>
    <div id="AutoInputWidth" ref="autoInputWidth" class="_auto-input-width _portfolio-title">
      {{ _title }}
    </div>

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
            id="PortfolioTitleInput"
            dense
            placeholder="Portfolio Title"
            class="h2 _portfolio-title-input my-1"
            hide-details
            autocomplete="off"
            v-model="_title"
            @blur="titleBlurred()"
            @focus="setTitleBeforeEdit"
            maxlength="60"
            :readonly="titleIsReadOnly"
            :disabled="titleIsReadOnly"
          />
        <div>
          <v-tabs 
            class="_header-tab "
            v-model="_selectedTab"
            v-if="!isPortfolioProvisioning"
          >
            <v-tab
              v-for="(tab, index) in items"
              :key="index"
              :id="getIdText(tab) + '_Tab'"
              class="font-size-14 pa-1 pt-2  pb-5 mr-3"
              @click="tabClicked(index)"
            >{{tab}}</v-tab>
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
        <!-- ATAT TODO: Reinstate menu in future ticket when functionality complete -->
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
      </div>
    </div>
  </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

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

  public get titleIsReadOnly(): boolean {
    return PortfolioStore.currentUserIsViewer;;
  }

  public titleBeforeEdit = "";
  public setTitleBeforeEdit(): void {
    this.titleBeforeEdit = this._title;
  }

  public moreMenuOpen = false;
  public activeAppSection = AppSections.activeAppSection;
  public showDrawer = false;

  public get slideoutPanelIsOpen(): boolean {
    return SlideoutPanel.getSlideoutPanelIsOpen;
  }
  @Watch("slideoutPanelIsOpen")
  public slideoutPanelIsOpenChanged(newVal: boolean): void {
    this.showDrawer = newVal;
  }

  public openModal():void {
    PortfolioStore.setShowAddMembersModal(true);
  }
  public async tabClicked(index: number): Promise<void> {
    await AppSections.setActiveTabIndex(index);
  }
  public titleBlurred(): void {
    if (this._title !== this.titleBeforeEdit && this._title.length > 0) {
      PortfolioStore.updatePortfolioTitle(this._title);
    } else {
      this._title = this.titleBeforeEdit;
      this.$nextTick(() => {
        this.setInputWidth();
      })
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
          title: "About Portfolio"
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
    if (this.titleInput){
      this.titleInput.focus()
    }
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  get autoInputWidth(): HTMLElement {
    return this.$refs.autoInputWidth as HTMLElement;
  }

  public addInputEventListeners(vm: unknown, input: HTMLInputElement): void {
    input.addEventListener("input", () => {
      this.setInputWidth();
    });
  }

  /**
   * AutoInputWidth notes: 
   * Auto-grows and -shrinks input width as user types. Event listener addInputEventListeners
   * calls this method on each keystroke on the Portfolio Title input. There is a div
   * with id "AutoInputWidth" that is set to the same font size/weight with the html
   * of this._title - the div is abs positioned off-screen, and the width grows/shrinks as 
   * this._title is edited bc display inline-block. The width of this div is then set on
   * the input, and the vuetify input wrapper.
   */
  public setInputWidth() {
    this.autoInputWidth.innerHTML = this.titleInput.value;
    const w = this.autoInputWidth.offsetWidth > 130 
      ? this.autoInputWidth.offsetWidth : 130;
    const inputWidth = w + "px";
    const wrapperWidth = (w + 20) + "px"
    this.titleInput.style.width = inputWidth;
    this.titleInput.style.minWidth = inputWidth;
    this.titleInputWrap.style.width = wrapperWidth;
    this.titleInputWrap.style.minWidth = wrapperWidth;
  }

  public get titleInput(): HTMLInputElement {
    return document.getElementById("PortfolioTitleInput") as HTMLInputElement;
  }
  public get titleInputWrap(): HTMLElement {
    const collection = document.getElementsByClassName("_portfolio-title-input");
    return collection[0] as HTMLElement;
  }

  public async mounted(): Promise<void> {
    if (this.titleInput) {
      this.$nextTick(() => {
        this.setInputWidth();
        this.addInputEventListeners(this, this.titleInput);
      })
    }
  
    const slideoutPanelContent: SlideoutPanelContent = {
      component: PortfolioDrawer,
    }
    await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
  }

}
</script>
