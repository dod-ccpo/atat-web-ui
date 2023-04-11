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
              class="font-size-14 _person-card__name-button"
            >
              {{ creatorName }}
            </v-btn>
          </template>

          <ATATProfileCard :person="packageCreator" />

        </v-menu>

      </div>
    </div>

    <hr class="my-0">

    <div class="_panel-padding _panel-user-list">
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
            class="font-size-14 _person-card__name-button"
          >
            {{ packageMissionOwner.firstName }} {{ packageMissionOwner.lastName }} 
          </v-btn>
        </template>

        <ATATProfileCard :person="packageMissionOwner" />

      </v-menu>        


      <div v-for="(user, index) in contributors" :key="index">
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
              class="font-size-14 _person-card__name-button"
            >
              {{ user.firstName }} {{ user.lastName }}
            </v-btn>
          </template>

          <ATATProfileCard :person="user" />

        </v-menu>        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AcquisitionPackage from "@/store/acquisitionPackage";

import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATProfileCard from "@/components/ATATProfileCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { getStatusChipBgColor } from "@/helpers";
import { User } from "types/Global";

@Component({
  components: {
    ATATProfileCard,
    ATATSVGIcon,
  }
})

export default class ContributorsPanel extends Vue {
  public portfolioStatus = AcquisitionPackage.getPackageStatus;
  public packageCreator = AcquisitionPackage.getPackageCreator;
  public packageMissionOwner = AcquisitionPackage.getPackageMissionOwner;

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

  public openContributorsModal(): void {
    // 
  }

  public async mounted(): Promise<void> {
    const acqPkg = AcquisitionPackage.acquisitionPackage;
    debugger;
    if (acqPkg?.contributors) {
      const len = acqPkg.contributors.split(",").length;
      this.contributorCount = len + 1;
    }
  }
}

</script>
