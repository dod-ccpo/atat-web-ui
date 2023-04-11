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

    <div class="_panel-padding">
      <h3>Contributors ()</h3>
    </div>
  </div>
</template>

<script lang="ts">
import AcquisitionPackage from "@/store/acquisitionPackage";

import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATProfileCard from "@/components/ATATProfileCard.vue";
import { getStatusChipBgColor } from "@/helpers";

@Component({
  components: {
    ATATProfileCard
  }
})

export default class ContributorsPanel extends Vue {
  public portfolioStatus = AcquisitionPackage.getPackageStatus;
  public packageCreator = AcquisitionPackage.getPackageCreator;

  
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

}

</script>
