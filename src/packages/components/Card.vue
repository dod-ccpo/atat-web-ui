<template>
  <v-card
    class="_portfolio-summary-card-wrapper"
    :class="{ '_first': index === 0, '_last': isLastCard }"
    :id="'Package'+ index"
    elevation="0"
  >
    <div class="pr-8 flex-grow-1">
      <div class="d-flex">
        <div class="card-header flex-grow-1">
          <a
            id="PortfolioName"
            role="button"
            tabindex="0"
            class="h3 _text-decoration-none d-flex align-center"
          >
            {{ modifiedData.title }}
          </a>
        </div>
          <v-chip
            :id="'StatusChip' + index"
            :class="[
              '_' + modifiedData.packageStatus,
              statusChipBgColor
            ]"
            label
          >
            {{modifiedData.packageStatus}}
          </v-chip>
      </div>
      <div class="text-base -size-14 d-flex align-center">
        <div
          :id="'Percentage'+ index"
          v-if="modifiedData.packageStatus.toLowerCase() === 'draft' ||
           modifiedData.packageStatus.toLowerCase() === 'waiting for signatures'"
          class=" d-flex align-center">
          <ATATSVGIcon
            name="taskAlt"
            width="16"
            height="16"
            color="base"
            class="mr-1"
          />
          <span v-if="modifiedData.packageStatus.toLowerCase() === 'draft'" >
            30% complete
          </span>
          <span v-else>
            100% complete
          </span>
          <ATATSVGIcon
            name="bullet"
            color="base-light"
            :width="9"
            :height="9"
            class="d-inline-block mx-1"
          />
        </div>
        <div
          v-if="modifiedData.packageStatus.toLowerCase() === 'task order awarded'"
          class=" d-flex align-center">
          <a
          :id="'TaskOrder' + index">
            TO# HC1028-22-f-0141
          </a>
          <ATATSVGIcon
            name="bullet"
            color="base-light"
            :width="9"
            :height="9"
            class="d-inline-block mx-1"
          />
        </div>
        <div :id="'CreatedBy'+ index" class=" d-flex align-center">
          {{modifiedData.createdBy}}
          <ATATSVGIcon
            name="bullet"
            color="base-light"
            :width="9"
            :height="9"
            class="d-inline-block mx-1"
          />
        </div>
        <div
          :id="'Modified/Archived'+ index"
          class="base d-flex align-center">
          {{lastModifiedStr}}
        </div>
      </div>
      </div>
    <ATATMeatballMenu
      :id="'CardMenu' + index"
      :left="true"
      :menuIndex="index"
      :menuItems="cardMenuItems"
      @menuItemClick="cardMenuClick"
    />
    <DeletePackageModal
      :showModal.sync="showDeleteModal"
      :packageName="modifiedData.title"
      :hasContributor="hasContributor"
      @okClicked="deletePackage"
    />
    <ArchiveModal
      :showModal.sync="showArchiveModal"
      :hasContributor="hasContributor"
      :packageName="modifiedData.title"
      @okClicked="archivePackage"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { MeatballMenuItem } from "../../../types/Global";
import { createDateStr, getStatusChipBgColor } from "@/helpers";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";
import DeletePackageModal from "@/packages/components/DeletePackageModal.vue";
import ArchiveModal from "@/packages/components/ArchiveModal.vue";
@Component({
  components:{
    ATATSVGIcon,
    ATATMeatballMenu,
    DeletePackageModal,
    ArchiveModal
  }
})
export default class Card extends Vue {
  @Prop() private cardData!: Record<string, string>;
  @Prop() private index!: number;
  @Prop() private isLastCard!: boolean;
  
  public currentUserSysId = "e0c4c728875ed510ec3b777acebb356f"; // pragma: allowlist secret
  public isOwner = this.cardData.mission_owners.indexOf(this.currentUserSysId) > -1;
  public hasContributor = this.cardData.contributors.length > 0;
  public isWaitingForSignatures = false
  public showDeleteModal = false
  public showArchiveModal = false
  public lastModifiedStr = "";
  public modifiedData: {
    contractAward: string;
    missionOwners: string;
    packageStatus: string;
    projectOverview: string;
    secondaryReviewers: string;
    createdBy: string;
    updated: string;
    title: string;
  } = {
    contractAward: "",
    missionOwners: "",
    packageStatus: "",
    projectOverview: "",
    secondaryReviewers: "",
    createdBy: "",
    updated: "",
    title: "",
  }

  public cardMenuItems: MeatballMenuItem[] = [];


  public get statusChipBgColor(): string {
    const status = this.modifiedData.packageStatus

    return getStatusChipBgColor(status ? status : "");
  }


  public reformatData(cardData:Record<string, string>): void {
    this.modifiedData.contractAward = cardData.contract_award
    this.modifiedData.missionOwners = cardData.mission_owners
    this.modifiedData.packageStatus = cardData.package_status.replace(/[^a-zA-Z0-9 ]/g, ' ')
    this.modifiedData.projectOverview = cardData.project_overview
    this.modifiedData.secondaryReviewers = cardData.secondary_reviewers
    this.modifiedData.createdBy = this.isOwner? "Maria Missionowner" : "Jack Ryan"
    this.modifiedData.updated = cardData.sys_updated_on
    this.modifiedData.title = cardData.title

  }

  public deletePackage():void {
    console.log('delete')
  }
  public archivePackage():void {
    console.log('delete')
  }

  public async cardMenuClick(menuItem: MeatballMenuItem): Promise<void> {
    switch (menuItem.action) {
    case "Archive acquisition":
      this.showArchiveModal = true
      break;
    case "Delete acquisition package":
      console.log("hello")
      this.showDeleteModal = true
      break;
    case "Restore package to draft":
      this.modifiedData.packageStatus = "DRAFT"
      // eslint-disable-next-line camelcase
      this.cardData.package_status = "DRAFT"
      break;
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.reformatData(this.cardData)
    if(this.cardData.package_status === 'DRAFT'){
      this.cardMenuItems = [
        {
          title: "Edit draft package",
          action: "Edit draft package"
        },
        {
          title: "Invite contributors",
          action: "Invite contributors"
        },
      ]
      if(this.isOwner) {
        this.cardMenuItems.push(
          {
            title: "Archive acquisition",
            action: "Archive acquisition"
          },
          {
            title: "Delete acquisition package",
            action: "Delete acquisition package"
          },
        )
      }
    }
    if(this.cardData.package_status === 'WAITING_FOR_SIGNATURES'){
      this.isWaitingForSignatures = true
      this.cardMenuItems = [
        {
          title: "View completed package",
          action: "View completed package",
          disabled:true
        },
      ]
      if(this.isOwner){
        this.cardMenuItems.push(
          {
            title: "Resend signature request",
            action: "Resend signature request",
            disabled:true
          },{
            title: "Cancel signature request",
            action: "Cancel signature request",
            disabled:true
          },{
            title: "Archive acquisition",
            action: "Archive acquisition"
          },{
            title: "Delete acquisition package",
            action: "Delete acquisition package"
          },
        )
      }
    }
    if(this.cardData.package_status === 'WAITING_FOR_TASK_ORDER'){
      this.cardMenuItems = [
        {
          title: "Add awarded task order",
          action: "Add awarded task order",
          disabled:true
        },{
          title: "View completed package",
          action: "View completed package",
          disabled:true
        },
      ]
      if(this.isOwner){
        this.cardMenuItems.push(
          {
            title: "Archive acquisition",
            action: "Archive acquisition"
          },{
            title: "Delete acquisition package",
            action: "Delete acquisition package"
          }
        )
      }
    }
    if(this.cardData.package_status === 'TASK_ORDER_AWARDED'){
      this.cardMenuItems = [
        {
          title: "View task order CLIN summary",
          action: "View task order CLIN summary",
          disabled: true
        },{
          title: "Access provisioned portfolio",
          action: "Access provisioned portfolio",
          disabled: true
        },{
          title: "View completed package",
          action: "View completed package",
          disabled: true
        },
      ]
    }
    if(this.cardData.package_status === 'ARCHIVED' && this.isOwner){
      this.cardMenuItems = [
        {
          title: "Restore package to draft",
          action: "Restore package to draft"
        },{
          title: "Delete acquisition package",
          action: "Delete acquisition package"
        }
      ]
    }
    if (this.cardData.package_status === 'TASK_ORDER_AWARDED') {
      const agoString = createDateStr(this.cardData.sys_updated_on, true);
      this.lastModifiedStr = "Awarded on " + agoString;
    } else if(this.cardData.package_status === 'ARCHIVED') {
      const archivedDate = createDateStr(this.cardData.sys_updated_on, true);
      this.lastModifiedStr = "Archived on " + archivedDate;
    }else {
      const updatedDate = createDateStr(this.cardData.sys_updated_on, true);
      this.lastModifiedStr = "Last modified " + updatedDate;
    }
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

