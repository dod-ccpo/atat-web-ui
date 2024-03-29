<template>
  <div>
    <div id="AutoInputWidth" ref="autoInputWidth" class="_auto-input-width _portfolio-title">
      {{ _title }}
    </div>

    <v-app-bar
      id="PageHeader"
      flat
      class="_atat-page-header _portfolio-summary"
      height="83"
    > 
      <div class=" d-flex justify-space-between width-100 align-center">       
        <div id="NameHeader" tabindex="-1" class="mt-1">
          <v-text-field
            id="PortfolioTitleInput"
            density="compact"
            placeholder="Portfolio title"
            hide-details
            autocomplete="off"
            v-model="_title"
            @blur="titleBlurred()"
            @focus="setTitleBeforeEdit"
            maxlength="60"
            :readonly="portfolioIsReadOnly"
            :disabled="portfolioIsReadOnly"
            variant="plain"
          />
        <div>
          <v-tabs 
            class="_header-tab "
            v-model="_selectedTab"
            height="33"
            density="compact"
            v-if="!isPortfolioProvisioning"
          >
            <v-tab
              v-for="(tab, index) in items"
              :key="index"
              :id="getIdText(tab) + '_Tab'"
              class="font-size-14 pa-0 pt-2 pb-7 mr-3"
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
          id="PortfolioDrawerOpenerButton"
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
        <v-menu
          id="MoreMenu"
          class="_more-menu _header-menu _portfolio"
          attach
          location="bottom right"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              id="MoreMenuButton"
              class="_more-menu-button _header-button _icon-only"
            >
              <v-icon class="text-base-dark">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list>
            
            <v-list-item 
            v-for="(menuItem, index) in getMoreMenuItems"  
            :id="menuItem.id"
            :key="index"
            @click="handleMoreMenuClick(menuItem.action)"
            >
              <v-list-item-title>
                {{ menuItem.title }}
              </v-list-item-title>
            </v-list-item>
            <hr class="my-2" v-if="hasCspLinks" />
            <v-list-subheader id="LoginToCSPConsole_MenuItem" v-if="hasCspLinks">
              <v-list-item-title class="_csp-console-text"> 
                {{cspLoginText}}
              </v-list-item-title>
            </v-list-subheader>
            <v-list-item
              class="text-decoration-none"
              v-for="(linkItem, index) in environmentLinks" 
              :key="index"
              @click="handleLinkClick(linkItem.link)"
            >
              <v-list-item-title class="d-flex align-center">
                Unclassified <span class="_csp-console-text-link">{{ linkItem.display }}</span>
                <ATATSVGIcon
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
    <ArchivePortfolioModal
      :portfolioName="_title"
      :showArchivePortfolioModal="showArchivePortfolioModal"
      :csp="csp"
      @okClicked="archivePortfolio"
      @cancelClicked="closeArchivePortfolioModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch,  Vue, toNative } from "vue-facing-decorator";
import { PropSync } from '@/decorators/custom'
import AppSections from "@/store/appSections";
import ATATTextField from "@/components/ATATTextField.vue";
import PortfolioDrawer from "@/portfolios/portfolio/components/shared/PortfolioDrawer.vue";

import SlideoutPanel from "@/store/slideoutPanel";
import PortfolioStore from "@/store/portfolio";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { 
  SlideoutPanelContent, 
  MeatballMenuItem, 
  EnvironmentLink
} from "../../../../../types/Global";
import { getIdText } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
// eslint-disable-next-line max-len
import ArchivePortfolioModal from "@/portfolios/portfolio/components/shared/ArchivePortfolioModal.vue";
import InviteMembersModal from "@/portfolios/portfolio/components/shared/InviteMembersModal.vue";

@Component({
  methods: {
    PortfolioStore() {
      return PortfolioStore
    }
  },
  components: {
    InviteMembersModal,
    ATATTextField,
    ArchivePortfolioModal,
    ATATSVGIcon
  }
})

class PortfolioSummaryPageHead extends Vue {
  @Prop() public isPortfolioProvisioning!: boolean;
  @Prop({ default: [""], required: true }) private items!: string[];
  @Prop({ default: [] }) private environmentLinks!: EnvironmentLink[];
  @PropSync("value") private _selectedTab!: number ;
  @PropSync("title") private _title!: string;

  public moreMenuItemActions = {
    openArchivePortfolioModal: "openArchivePortfolioModal",
    moveToInput: "moveToInput",
    openModal: "openModal",
    leaveThisPortfolio: "leaveThisPortfolio"
  }
  public cspLoginText = "LOGIN TO YOUR CSP PORTAL";
  public hasCspLinks = false;

  public get portfolioStatus(): string {
    return PortfolioStore.currentPortfolio.status as string;
  }

  public get portfolioIsReadOnly(): boolean {
    return PortfolioStore.currentUserIsViewer || this.portfolioStatus === "ARCHIVED";
  }

  public titleBeforeEdit = "";
  public setTitleBeforeEdit(): void {
    this.titleBeforeEdit = this._title;
  }

  public activeAppSection = AppSections.activeAppSection;
  public showDrawer = false;

  public get isProdEnv(): boolean {
    return AcquisitionPackage.isProdEnv as boolean || AcquisitionPackage.emulateProdNav;
  }

  public get csp(): string {
    const csp = PortfolioStore.currentPortfolio.csp?.toUpperCase() as string;
    return AcquisitionPackage.csps[csp];
  }

  public get slideoutPanelIsOpen(): boolean {
    return SlideoutPanel.getSlideoutPanelIsOpen;
  }

  public get getMoreMenuItems(): MeatballMenuItem[]{
    const menuItems: MeatballMenuItem[] = [];
    const leavePortfolio = {
      id: "LeavePortfolio_MenuItem",
      title: "Leave this portfolio",
      action: 'leaveThisPortfolio'
    };
    const inviteMemebers = {
      id: "InviteMembers_MenuItem",
      title: "Invite members to portfolio",
      action: 'openModal'
    };
    const renamePortfolio = {
      id: "RenamePortfolio_MenuItem",
      title: "Rename portfolio",
      action: "moveToInput"
    }
    const archivePortfolio = {
      id: "ArchivePortfolio_MenuItem",
      title: "Archive portfolio",
      action: "openArchivePortfolioModal"
    }
    if(PortfolioStore.currentUserIsViewer){
      menuItems.push(leavePortfolio);
    } else if(PortfolioStore.currentUserIsManager){
      menuItems.push(
        leavePortfolio, 
        inviteMemebers, 
        renamePortfolio
      )
    } else{
      menuItems.push(
        inviteMemebers, 
        renamePortfolio,
        archivePortfolio
      )
    }
    

    return menuItems;
  }

  public handleMoreMenuClick(menuItem: string | undefined):void{
    switch(menuItem){
    case this.moreMenuItemActions.leaveThisPortfolio:
      this.$emit("leavePortfolio")
      break;
    case this.moreMenuItemActions.moveToInput:
      this.moveToInput();
      break;
    case this.moreMenuItemActions.openArchivePortfolioModal:
      this.openArchivePortfolioModal();
      break;
    case this.moreMenuItemActions.openModal: 
      this.openModal();
      break;
    default: 
      break;
    }
  }

  public handleLinkClick(link: string): void{
    window.open(link, "_blank")
  }

  @Watch("slideoutPanelIsOpen")
  public slideoutPanelIsOpenChanged(newVal: boolean): void {
    this.showDrawer = newVal;
  }

  public openModal():void {
    PortfolioStore.setShowAddMembersModal(true);
  }

  public get showArchivePortfolioModal(): boolean {
    return PortfolioStore.showArchivePortfolioModal;
  }

  public openArchivePortfolioModal():void {
    PortfolioStore.setShowArchivePortfolioModal(true);
  }

  public archivePortfolio():void {
    PortfolioStore.archivePortfolio();
    this.closeArchivePortfolioModal();
  }

  public closeArchivePortfolioModal(): void {
    PortfolioStore.setShowArchivePortfolioModal(false);
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
    if (e?.currentTarget) {
      e.preventDefault();
      e.stopPropagation()
    }

    if (!this.showDrawer || currentSlideoutComponent !== PortfolioDrawer) {
      if (e?.currentTarget) {
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
    const collection = document.getElementById("PortfolioTitleInput")
    return collection as HTMLElement;
  }
  public async loadOnEnter(): Promise<void> {
    
    this.hasCspLinks = this.environmentLinks.length > 0;
    if(this.environmentLinks.length > 1){
      this.cspLoginText = "LOGIN TO YOUR CSP PORTALS"
    }
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
    await this.loadOnEnter()
  }
}
export default toNative(PortfolioSummaryPageHead)
</script>
