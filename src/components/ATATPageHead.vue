<template>
  <v-app-bar 
    id="PageHeader" 
    app 
    flat 
    class="_atat-page-header"
  >
    <div class="d-flex justify-space-between width-100 align-center">
      <div id="PackageNameHeader" tabindex="-1" class="h3">{{ packageName }}</div>
      <div class="d-flex justify-end align-center">
        <v-tooltip
          transition="slide-y-reverse-transition"
          :id="'Contributor_Tooltip'"
          max-width="250px"
          bottom
          eager
        >
          <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            icon class="mr-5 _header-button _add-user-button" 
            id="InviteContributorButton"
            @click="openInviteContributorModal"
            @keydown.space="openInviteContributorModal"
            @keydown.enter="openInviteContributorModal"
          >
            <v-icon class="icon-20 text-base-dark">person_add_alt_1</v-icon>
          </v-btn>
          </template>
          <div id="ContributorTooltipText" class="_tooltip-content-wrap _no-pointer">
          <div v-html="contributorTooltipText">
          </div>
          </div>
        </v-tooltip>
        <v-menu
          :offset-y="true"
          left
          id="MoreMenu"
          class="_more-menu _header-menu"
          attach
        >
          <template v-slot:activator="{ on: onMenu, attrs }">
            <v-tooltip
              transition="slide-y-reverse-transition"
              :id="'Contributor_Tooltip'"
              max-width="250px"
              bottom
              eager
            >
              <template v-slot:activator="{ on: onTooltip }">
                <v-btn
                  v-bind="attrs"
                  v-on="{...onMenu, ...onTooltip}"
                  id="MoreMenuButton"
                  class="_more-menu-button _header-button"
                >
                  <v-icon class="text-base-dark">more_horiz</v-icon>
                </v-btn>
              </template>
              <div id="ContributorTooltipText" class="_tooltip-content-wrap _no-pointer">
                <div v-html="moreOptionsTooltipText">
                </div>
              </div>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in moreMenuItems"
              :key="index"
              :id="getIdText(item.title) + '_MenuItem'"
              @click="moreMenuClick(item.title)"
              :class="{active : item.title === activeAppSection}"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <DeletePackageModal
      v-if="isMissionOwner"
      :showModal.sync="showDeleteModal"
      :packageName="packageName"
      :hasContributor="hasContributor"
      :waitingForSignature="isWaitingForSignature"
      @okClicked="updateStatus('DELETED')"
    />
    <ArchiveModal
      v-if="isMissionOwner"
      :showModal.sync="showArchiveModal"
      :hasContributor="hasContributor"
      :packageName="packageName"
      :waitingForSignature="isWaitingForSignature"
      @okClicked="updateStatus('ARCHIVED')"
    />

    <ContributorInviteModal :showInviteModal.sync="showInviteModal" />

  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import AppSections from "@/store/appSections";
import SlideoutPanel from "@/store/slideoutPanel";
import { getIdText } from "@/helpers";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import ArchiveModal from "@/packages/components/ArchiveModal.vue";
import ContributorsPanel from "@/packages/components/ContributorsPanel.vue"
import ContributorInviteModal from "@/packages/components/ContributorInviteModal.vue";
import DeletePackageModal from "@/packages/components/DeletePackageModal.vue";

import { SlideoutPanelContent } from "types/Global";

@Component({
  components:{
    ArchiveModal,
    ContributorsPanel,
    ContributorInviteModal,
    DeletePackageModal,
  }
})

export default class ATATPageHead extends Vue {
  public moreMenuOpen = false;
  public activeAppSection = AppSections.activeAppSection;
  public contributorTooltipText = "Invite contributors"
  public moreOptionsTooltipText = "More options"
  public showDeleteModal = false
  public showArchiveModal = false
  public showInviteModal = false;

  public get showDrawer(): boolean {
    return SlideoutPanel.getSlideoutPanelIsOpen;
  } 

  public get packageName(): string {
    return acquisitionPackage.getProjectTitle || "New Acquisition";
  } 
  
  public hasContributor():boolean{
    if(AcquisitionPackage
      && AcquisitionPackage.acquisitionPackage
      && AcquisitionPackage.acquisitionPackage.contributors){
      return AcquisitionPackage.acquisitionPackage.contributors.length > 0
    }
    return false
  }
  public isWaitingForSignature():boolean{
    if(AcquisitionPackage && AcquisitionPackage.acquisitionPackage){
      return AcquisitionPackage.acquisitionPackage.package_status === 'WAITING_FOR_SIGNATURE'
    }
    return false
  }

  public get isMissionOwner(): boolean {
    return AcquisitionPackage.getCurrentUserIsMissionOwner;
  }   

  public async updateStatus(newStatus: string): Promise<void> {
    await AcquisitionPackageSummary
      .updateAcquisitionPackageStatus({
        acquisitionPackageSysId: acquisitionPackage.packageId,
        newStatus
      });
    const sectionData = await AppSections.getSectionData();
    AppSections.changeActiveSection(sectionData.sectionTitles.Home)
  }

  public get moreMenuItems(): Record<string, string>[] {
    const menuItems = [
      { title: "View package details" },
      { title: "Invite contributors" },
    ];
    if (this.isMissionOwner) {
      menuItems.push(
        { title: "Archive acquisition" },
        { title: "Delete acquisition package" }
      )
    }
    return menuItems;
  } 

  public async moreMenuClick(title: string ): Promise<void> {
    switch(title){
    case "View package details":
      if (!this.showDrawer) this.openSlideoutPanel();
      break;
    case "Invite contributors":
      this.openInviteContributorModal();
      break;
    case 'Archive acquisition':
      this.showArchiveModal = true
      break;
    case 'Delete acquisition package':
      this.showDeleteModal = true
      break;
    }
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public openInviteContributorModal(): void {
    AcquisitionPackage.setShowInviteContributorsModal(true);
  }

  public get showContributorInviteModal(): boolean {
    return AcquisitionPackage.getShowInviteContributorsModal;
  }
  @Watch("showContributorInviteModal")
  public showContributorInviteModalChange(val: boolean): void {
    this.showInviteModal = val;
  }

  public async openSlideoutPanel(e?: Event): Promise<void> {
    const currentSlideoutComponent = SlideoutPanel.slideoutPanelComponent;
    let openerId = "MoreMenuButton"
    if (e && e.currentTarget) {
      e.preventDefault();
      e.cancelBubble = true;
      const opener = e.currentTarget as HTMLElement;
      openerId = opener.id;
    }

    if (currentSlideoutComponent !== ContributorsPanel) {
      const slideoutPanelContent: SlideoutPanelContent = {
        component: ContributorsPanel,
        title: "ACQUISITION DETAILS"
      }
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);
    } 
    SlideoutPanel.openSlideoutPanel(openerId);

  }

}

</script>
