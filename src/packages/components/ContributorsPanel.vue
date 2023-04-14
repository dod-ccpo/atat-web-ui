<template>
  <div id="ContributorPanel" class="_contributor-panel">
    <div class="_panel-padding mb-2 pb-0 font-size-14">
      <div class="d-flex justify-space-between align-center pb-4">
        <span id="StatusLabel">Status</span>
        <v-chip id="StatusChip" :color="statusChipColor" label>
          {{ packageStatus }}
        </v-chip>
      </div>
      <div v-if="selectedAgency" class="d-flex justify-space-between align-center pb-2">
        <span id="AgencyLabel">Service/Agency</span>
        <span id="AgencyName">{{ selectedAgency }}</span>
      </div>
      <div class="d-flex justify-space-between align-center pb-4">
        <span id="CreatedByLabel">Created by</span>
        <v-menu
          :close-on-content-click="false"
          left
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              plain
              text
              v-bind="attrs"
              v-on="on"
              class="font-size-14 _profile-card__name-button"
            >
              {{ packageCreator.fullNameForSort }}
            </v-btn>
          </template>

          <ATATProfileCard :person="packageCreator" />

        </v-menu>

      </div>
    </div>

    <hr class="my-0">

    <div class="_panel-padding _panel-user-list pb-6">
      <div
        id="ContributorsSection"
        class="d-flex flex-columm justify-space-between"
      >
        <h3 class="mb-3">
          Contributors 
          <span class="color-base font-size-20 font-weight-normal mb-4">
            ({{ contributorCount }})
          </span>
        </h3>
        <v-btn
          id="AddContributorButton"
          class="_icon-only"
          @click="openContributorsModal"
          @keydown.enter="openContributorsModal"
          @keydown.space="openContributorsModal"
        >
          <ATATSVGIcon
            name="PersonAddAlt"
            color="base"
            :width="22"
            :height="16"
          />
        </v-btn>

      </div>
      
      <div class="d-flex justify-space-between align-center font-size-14">
        <v-menu
          :close-on-content-click="false"
          left
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              plain
              text
              v-bind="attrs"
              v-on="on"
              class="font-size-14 _profile-card__name-button"
            >
              {{ packageMissionOwner.fullNameForSort }} 
            </v-btn>
          </template>

          <ATATProfileCard :person="packageMissionOwner" />
        </v-menu> 
        <div>
          <v-tooltip left nudge-right="15" v-if="currentUserIsOwner">
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                Owner
              </span>
            </template>
            <div class="_tooltip-content-wrap _left" style="width: 250px">
              As the owner, you will need to transfer ownership in order to leave this package.
            </div>
          </v-tooltip>
          <div v-else>
            Owner
          </div>
        </div>
      </div>

      <div v-for="(user, index) in contributors" :key="index">
        <div class="d-flex justify-space-between align-center font-size-14">
          <v-menu
            :close-on-content-click="false"
            left
            open-on-hover
            offset-x
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                plain
                text
                v-bind="attrs"
                v-on="on"
                class="font-size-14 _profile-card__name-button"
              >
                {{ user.fullNameForSort }}
              </v-btn>
            </template>

            <ATATProfileCard :person="user" />

          </v-menu>    

          <ATATMeatballMenu
            v-if="currentUserIsOwner || user.sys_id === currentUser.sys_id"
            :id="'CardMenu' + index"
            :left="true"
            :index="index"
            :menuItems="menuItems"
            @menuItemClick="contributorMenuClick"
          />

        </div>    
      </div>
    </div>

    <hr class="my-0">

    <div class="_panel-padding _panel-user-list pb-6">
      <v-expansion-panels accordion flat>
        <v-expansion-panel>
          <v-expansion-panel-header class="font-size-14">
            Learn about contributor roles
          </v-expansion-panel-header>
          <v-expansion-panel-content class="font-size-14">
            <p>
              <strong>Owner:</strong> Manages all aspects of a package, to include 
              editing information, generating and submitting the completed package, 
              managing contributor access, archiving, and deleting.
            </p>
            <p class="mb-0">
              <strong>Contributor:</strong> Edits information and invites other 
              people to contribute. However, they cannot submit, archive, or delete 
              the acquisition package. 
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <hr class="my-0">
    <div class="_panel-padding _panel-user-list pb-6 font-size-14">
      Last updated {{ lastUpdated }}
    </div>

    <ATATDialog
      id="ConfirmationModal"
      :showDialog.sync="showConfirmationModal"
      :title="confirmationModalTitle" 
      no-click-animation
      :okText="confirmationModalOKButtonText"
      width="450"
      @ok="okClicked"
    >    
      <template #content>
        <div v-html="confirmationModalBody" class="body"></div>
      </template>
    </ATATDialog>    

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";
import ATATProfileCard from "@/components/ATATProfileCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import CurrentUserStore from "@/store/user";
import Toast from "@/store/toast";

import { createDateStr, getStatusChipBgColor, getIdText } from "@/helpers";
import { MeatballMenuItem, ToastObj, User } from "types/Global";
import { AcquisitionPackageDTO, UserDTO } from "@/api/models";
import AppSections from "@/store/appSections";

@Component({
  components: {
    ATATDialog,
    ATATMeatballMenu,
    ATATProfileCard,
    ATATSVGIcon,
  }
})

export default class ContributorsPanel extends Vue {
  public lastUpdated = "";
  public currentUserIsOwner = false;
  public contributorCount = 1;
  public agency = "";
  public statusChipColor = "";
  public packageStatus = "";


  public showConfirmationModal = false;
  public confirmationModalTitle = "";
  public confirmationModalBody = "";
  public confirmationModalOKButtonText = "";
  public confirmationModalTargetUserSysId = "";
  public confirmationModalToast: ToastObj = {
    type: "success",
    message: "",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  public get getPackageStatus(): string {
    return AcquisitionPackage.getPackageStatus || "DRAFT";
  };
  @Watch("getPackageStatus")
  public getPackageStatusChanged(newVal: string): void {
    this.packageStatus = newVal;
    this.getBgColor();
  }

  public get packageCreator(): User {
    return AcquisitionPackage.getPackageCreator || {};
  } 
  public get packageMissionOwner(): User {
    return AcquisitionPackage.getPackageMissionOwner || {};
  } 
  @Watch("packageMissionOwner")
  public packageMissionOwnerChanged(newUser: UserDTO): void {
    if (newUser.sys_id) this.checkIfCurrentUserIsOwner();   
  }

  public get currentUser(): UserDTO {
    return CurrentUserStore.getCurrentUserData || {};
  } 
  @Watch("currentUser")
  public currentUserChanged(newUser: UserDTO): void {
    if (newUser.sys_id) this.checkIfCurrentUserIsOwner();   
  }

  public get contributors(): User[] {
    const users = AcquisitionPackage.getPackageContributors || [];
    return users.sort((a,b) => {
      return a.fullNameForSort && b.fullNameForSort 
        ? a.fullNameForSort > b.fullNameForSort ? 1: -1
        : -1;
    });
  }
  
  public get selectedAgency(): string {
    return AcquisitionPackage.getSelectedAgencyAcronym;
  } 
  @Watch("selectedAgency")
  public agencyChanged(val: string): void {
    this.agency = val;
  }

  public getBgColor(): void {
    this.statusChipColor = this.packageStatus ? getStatusChipBgColor(this.packageStatus) : "";
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public contributorMenuClick(menuItem: MeatballMenuItem, index: number): void {
    switch(menuItem.title) {
    case "Remove contributor":
      this.removeContributor(index);
      break;
    case "Leave package":
      this.leavePackage(index);
      break;
    case "Transfer ownership":
      this.transferOwnership(index);
      break;
    }
  }
  
  public removeContributor(index: number): void {
    const user = this.contributors[index];
    this.confirmationModalTargetUserSysId = user.sys_id as string;
    this.confirmationModalTitle = `Remove ${user.firstName} from acquisition?`;
    this.confirmationModalBody = `<p>${user.fullName} will be removed from the
      conbtributors list. This individual will no longer have access to edit the 
      acquisition package details.</p><p class="mb-0">NOTE: Any contributor can 
      restore their access to this package at any time.</p>`;
    this.confirmationModalOKButtonText = "Remove contributor";
    this.showConfirmationModal = true;
  }

  public leavePackage(index: number): void {
    const user = this.contributors[index];
    this.confirmationModalTargetUserSysId = user.sys_id as string;
    this.confirmationModalTitle = `Leave acquisition package?`;
    this.confirmationModalBody = `<p class="mb-0">You will <strong>no longer have 
      access</strong> to edit acquisition package details. A contributor can restore
      your access at any time.`;
    this.confirmationModalOKButtonText = "Leave package";
    this.showConfirmationModal = true;
  }

  public transferOwnership(index: number): void {
    const user = this.contributors[index];
    this.confirmationModalTargetUserSysId = user.sys_id as string;
    this.confirmationModalTitle = `Transfer ownership to ${user.firstName}?`;
    this.confirmationModalBody = `<p class="mb-0">${user.fullName} will be responsible 
      for submitting the completed package. You can still edit package details, but 
      will no longer be able to submit, archive, or delete the package.`;
    this.confirmationModalOKButtonText = "Transfer ownership";
    this.showConfirmationModal = true;
  }

  public async okClicked(): Promise<void> {
    switch(this.confirmationModalOKButtonText) {
    case "Remove contributor":
      await AcquisitionPackage.removeContributor(this.confirmationModalTargetUserSysId);
      this.confirmationModalToast.message = "Contributor removed";
      break;
    case "Leave package": 
      await AcquisitionPackage.removeContributor(this.confirmationModalTargetUserSysId);
      this.confirmationModalToast.message = "Access removed"
      AppSections.changeActiveSection(AppSections.sectionTitles.Home);
      break;
    case "Transfer ownership":
      await AcquisitionPackage.transferOwnership(this.confirmationModalTargetUserSysId);
      this.confirmationModalToast.message = "Ownership transfered"
      break;
    }

    this.confirmationModalTargetUserSysId = "";
    Toast.setToast(this.confirmationModalToast);
  }

  public openContributorsModal(): void {
    AcquisitionPackage.setShowInviteContributorsModal(true);
  }

  public get menuItems(): MeatballMenuItem[] {
    return this.currentUserIsOwner ? this.ownerMenuItems : this.contributorMenuItems;
  }

  public ownerMenuItems: MeatballMenuItem[] = [
    {title: "Remove contributor"},
    {title: "Transfer ownership"},
  ];

  public contributorMenuItems: MeatballMenuItem[] = [
    {title: "Leave package"},
  ]

  public get acqPkg(): AcquisitionPackageDTO | null {
    return AcquisitionPackage.getAcquisitionPackageData;
  }
  @Watch("acqPkg")
  public acqPkgChanged(newPkg: AcquisitionPackageDTO | null): void {
    this.setPackageData();
  }

  public setPackageData(): void {
    if (this.acqPkg?.sys_updated_on) {
      this.lastUpdated = createDateStr(this.acqPkg.sys_updated_on, true, true);
    } 
    if (this.acqPkg?.contributors) {
      const len = this.acqPkg.contributors.split(",").length;
      this.contributorCount = len + 1;
    }    
    if (this.acqPkg?.package_status) {
      this.packageStatus = this.acqPkg.package_status.replaceAll("_", " ");
      this.getBgColor();
    }
  }

  public checkIfCurrentUserIsOwner(): void {
    if (this.currentUser?.sys_id && this.packageMissionOwner?.sys_id) {
      this.currentUserIsOwner = this.currentUser.sys_id === this.packageMissionOwner.sys_id;
    }
  }

  public async mounted(): Promise<void> {
    if (AcquisitionPackage.acquisitionPackage?.sys_updated_on) {
      this.setPackageData();
    }
    this.checkIfCurrentUserIsOwner();
  }
}

</script>
