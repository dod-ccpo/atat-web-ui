<template>
  <div id="ContributorPanel" class="_contributor-panel">
    <div class="_panel-padding mb-2 pb-0 font-size-14">
      <div class="d-flex justify-space-between align-center pb-4">
        <span id="StatusLabel">Status</span>
        <v-chip id="StatusChip" :color="getBgColor" label>
          {{ portfolioStatus }}
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
              {{ creatorName }}
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
          id="AddPortfolioMember"
          class="_icon-only"
          @click="openContributorsModal"
          @keydown.enter="openContributorsModal"
          @keydown.space="openContributorsModal"
        >
          <ATATSVGIcon
            @click="openContributorsModal"
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
              {{ packageMissionOwner.firstName }} {{ packageMissionOwner.lastName }} 
            </v-btn>
          </template>

          <ATATProfileCard :person="packageMissionOwner" />
        </v-menu> 
        <div>
          <v-tooltip left nudge-right="15">
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                Owner
              </span>
            </template>
            <div class="_tooltip-content-wrap _left" style="width: 250px">
              As the owner, you will need to transfer ownership in order to leave this package.
            </div>
          </v-tooltip>
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
                {{ user.firstName }} {{ user.lastName }}
              </v-btn>
            </template>

            <ATATProfileCard :person="user" />

          </v-menu>    

          <ATATMeatballMenu
            :id="'CardMenu' + index"
            :left="true"
            :index="index"
            :menuItems="contributorMenuItems"
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

  </div>
</template>

<script lang="ts">
import AcquisitionPackage from "@/store/acquisitionPackage";

import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATProfileCard from "@/components/ATATProfileCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { createDateStr, getStatusChipBgColor } from "@/helpers";
import { User } from "types/Global";
import { getIdText } from "@/helpers";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";
import { MeatballMenuItem } from "types/Global";

@Component({
  components: {
    ATATProfileCard,
    ATATSVGIcon,
    ATATMeatballMenu,
  }
})

export default class ContributorsPanel extends Vue {
  public portfolioStatus = AcquisitionPackage.getPackageStatus;
  public packageCreator = AcquisitionPackage.getPackageCreator;
  public packageMissionOwner = AcquisitionPackage.getPackageMissionOwner;
  public lastUpdated = "";

  public contributorCount = 1;
  public get contributors(): User[] {
    return AcquisitionPackage.getPackageContributors;
  }

  public agency = "";
  public get selectedAgency(): string {
    return AcquisitionPackage.getSelectedAgencyAcronym;
  } 
  @Watch("selectedAgency")
  public agencyChanged(val: string): void {
    this.agency = val;
  }

  public get creatorName(): string {
    return this.packageCreator.firstName && this.packageCreator.lastName
      ? this.packageCreator.firstName + " " + this.packageCreator.lastName
      : this.packageCreator.email as string;
  }

  public get getBgColor(): string {
    return getStatusChipBgColor(this.portfolioStatus);
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  public contributorMenuClick(menuItem: MeatballMenuItem, index: number): void {
    // TODO Ticket AT-8791 (remove contributor)
    // TODO Ticket AT-8792 (transfer ownership)
  }

  public openContributorsModal(): void {
    // TODO Ticket AT-8756
  }
  public contributorMenuItems: MeatballMenuItem[] = [
    {title: "Remove contributor"},
    {title: "Transfer ownership"},
  ]

  public async mounted(): Promise<void> {
    const acqPkg = AcquisitionPackage.acquisitionPackage;
    if (AcquisitionPackage.acquisitionPackage?.sys_updated_on) {
      this.lastUpdated = createDateStr(
        AcquisitionPackage.acquisitionPackage.sys_updated_on, true, true
      );
    }

    if (acqPkg?.contributors) {
      const len = acqPkg.contributors.split(",").length;
      this.contributorCount = len + 1;
    }
  }
}

</script>
