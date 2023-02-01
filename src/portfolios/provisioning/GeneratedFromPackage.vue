<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Was this task order generated from one of your existing packages?
        </h1>
        <p class="page-intro">
          Select one of your packages below, and we will update the status to 
          close this acquisition. If you obtained your task order outside of the 
          DISA Acquisition Package Preparation System (DAPPS), click the “I didn’t 
          use DAPPS for this task order” button to proceed.
        </p>

        <v-card
          v-for="(pkg, index) in packageData"
          :key="pkg.sys_id"
          class="_summary-card-wrapper _selectable"
          :class="{ 
            '_first': index === 0, 
            '_last': index === packageData.length - 1,
            '_card-selected' : pkg.isSelected
          }"
          :id="'Package'+ index"
          elevation="0"
        >
          <div class="flex-grow-1">
            <div class="d-flex">
              <div class="card-header flex-grow-1">
                <a
                  :id="'Portfolio' + index"
                  role="button"
                  tabindex="0"
                  class="h3 _text-decoration-none d-flex align-center _package-title"
                  @click="packageSelected(index)"
                  @keydown.enter="packageSelected(index)"
                  @keydown.space="packageSelected(index)"
                >
                  {{ pkg.title || 'Untitled package'}}
                </a>
              </div>
              <v-chip
                :id="'StatusChip' + index"
                class="bg-warning"
                label
              >
                {{pkg.packageStatus}}
              </v-chip>
            </div>

            <div class="text-base -size-14 d-flex align-center">
              <div :id="'CreatedBy'+ index" class="d-flex align-center _created-by">
                {{pkg.createdBy}}
                <ATATSVGIcon
                  name="bullet"
                  color="base-light"
                  :width="9"
                  :height="9"
                  class="d-inline-block mx-1"
                />
              </div>
              <div
                :id="'ModifiedOrArchived'+ index"
                class="base d-flex align-center _last-modified">
                {{ pkg.updated }}
              </div>
            </div>
          </div>

        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import Card from "@/packages/components/Card.vue";
import { AcquisitionPackageSummarySearchDTO, UserDTO } from "@/api/models";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import CurrentUserStore from "@/store/user";
import { createDateStr } from "@/helpers";

export interface packageCardData {
  isSelected?: boolean;
  packageStatus: string;
  createdBy: string;
  updated: string;
  title: string;
  sysId: string;
}

@Component({
  components: {
    ATATSVGIcon,
    "PackageCards": Card,
  }
})

export default class GeneratedFromPackage extends Vue {
  public packageData: packageCardData[] = [];
  public selectedPackageSysId = "";

  public searchDTO:AcquisitionPackageSummarySearchDTO = {
    acquisitionPackageStatus: "WAITING_FOR_TASK_ORDER",
    searchString: "",
    sort: "DESCsys_updated_on",
    offset: 0
  };

  private currentUser: UserDTO = {};

  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public currentUserChange(newVal: UserDTO): void {
    this.currentUser = newVal;
  }  

  public packageSelected(index: number): void {
    this.packageData.forEach(pkg => pkg.isSelected = false);
    this.packageData[index].isSelected = true;
    this.selectedPackageSysId = this.packageData[index].sysId as string;
  }

  public async loadOnEnter(): Promise<void> {
    const packageData = await AcquisitionPackageSummary
      .searchAcquisitionPackageSummaryList(this.searchDTO);
    packageData.acquisitionPackageSummaryList.forEach(pkg => {
      let isOwner = false;
      if(pkg.mission_owners && this.currentUser.sys_id) {
        isOwner = pkg.mission_owners?.value.indexOf(this.currentUser.sys_id) > -1
      }
      const updatedDate = createDateStr(pkg.sys_updated_on as string, true);

      const cardData: packageCardData = {
        isSelected: false,
        packageStatus: pkg.package_status?.display_value as string,
        createdBy: isOwner && this.currentUser.name ? this.currentUser.name : "Maria Missionowner",
        updated: "Last modified " + updatedDate,
        title: pkg.project_overview?.display_value as string,
        sysId: pkg.sys_id as string,
      }
      this.packageData.push(cardData);
    });

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
