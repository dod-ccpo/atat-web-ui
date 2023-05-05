<template>
  <v-card
    class="_summary-card-wrapper"
    :class="{ '_first': index === 0, '_last': isLastCard }"
    :id="'Package'+ index"
    elevation="0"
  >
    <div class="pr-8 flex-grow-1">
      <div class="d-flex align-start justify-space-between">
        <div class="card-header mr-2">
          <a
            :id="'Portfolio' + index"
            role="button"
            tabindex="0"
            class="h3 _text-decoration-none d-flex align-center _package-title"
            @click="packageTitleClick(modifiedData.packageStatus)"
            @keydown.enter="packageTitleClick(modifiedData.packageStatus)"
            @keydown.space="packageTitleClick(modifiedData.packageStatus)"
          >
            {{ modifiedData.projectOverview || 'Untitled package'}}
          </a>
        </div>
        <v-chip
          :id="'StatusChip' + index"
          :class="statusChipBgColor"
          label
        >
          {{modifiedData.packageStatus}}
        </v-chip>
      </div>
      <div class="text-base -size-14 d-flex align-center">
        <!-- 
        TODO: Add back in when saving progress to snow  
        <div
          :id="'Percentage'+ index"
          v-if="modifiedData.packageStatus.toLowerCase() === 'draft' ||
           modifiedData.packageStatus.toLowerCase() === 'waiting for signatures'"
          class=" d-flex align-center _percent-complete"
        >
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
        -->

        <!-- ATAT TODO - REPLACE HARDCODED TO# when working ATAT tickets 
        <div
          v-if="modifiedData.packageStatus.toLowerCase() === 'task order awarded'"
          class=" d-flex align-center">
          <a
            :id="'TaskOrder' + index"
            class="_taskorder-link"
          >
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
        -->


        <div :id="'MissonOwner'+ index" class="d-flex align-center _created-by">
          {{modifiedData.missionOwner}}
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
          {{lastModifiedStr}}
        </div>
      </div>
    </div>
    <ATATMeatballMenu
      :id="'CardMenu' + index"
      :left="true"
      :index="index"
      :menuItems="cardMenuItems"
      @menuItemClick="cardMenuClick"
    />
    <DeletePackageModal
      :showModal.sync="showDeleteModal"
      :packageName="modifiedData.projectOverview || 'Untitled package'"
      :hasContributor="hasContributor"
      :waitingForSignature="modifiedData.packageStatus.toLowerCase() === 'waiting for signatures'"
      @okClicked="updateStatus('DELETED')"
      :id="'DeletePackageModal_' + index"
    />
    <ArchiveModal
      :showModal.sync="showArchiveModal"
      :hasContributor="hasContributor"
      :packageName="modifiedData.projectOverview || 'Untitled package'"
      :waitingForSignature="modifiedData.packageStatus.toLowerCase() === 'waiting for signatures'"
      @okClicked="updateStatus('ARCHIVED')"
      :id="'ArchivePackageModal_' + index"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import { MeatballMenuItem, ToastObj } from "../../../types/Global";
import { createDateStr, getStatusChipBgColor } from "@/helpers";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";
import DeletePackageModal from "@/packages/components/DeletePackageModal.vue";
import ArchiveModal from "@/packages/components/ArchiveModal.vue";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";

import UserStore from "@/store/user";
import {
  AcquisitionPackageSummaryDTO, UserDTO,
} from "@/api/models";
import { routeNames } from "@/router/stepper";
import AppSections from "@/store/appSections";
import CurrentUserStore from "@/store/user";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import Toast from "@/store/toast";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
@Component({
  components:{
    ATATSVGIcon,
    ATATMeatballMenu,
    DeletePackageModal,
    ArchiveModal,
    TaskOrderSearchModal,
  }
})
export default class Card extends Vue {
  @Prop() private cardData!: AcquisitionPackageSummaryDTO;
  @Prop() private index!: number;
  @Prop() private isLastCard!: boolean;
  
  public isOwner = false;
  public hasContributor = false;
  public isWaitingForSignatures = false
  public showDeleteModal = false
  public showArchiveModal = false
  public isDitco = false
  public lastModifiedStr = "";
  public modifiedData: Record<string, string> = {
    contractAward: "",
    missionOwner: "",
    packageStatus: "",
    projectOverview: "",
    secondaryReviewers: "",
    updated: "",
    title: "",
    contributors:"",
  }

  private currentUser: UserDTO = {};

  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public currentUserChange(newVal: UserDTO): void {
    this.currentUser = newVal;
  }  

  public cardMenuItems: MeatballMenuItem[] = [];

  public get statusChipBgColor(): string {
    const status = this.modifiedData.packageStatus

    return getStatusChipBgColor(status ? status : "");
  }

  public reformatData(cardData:AcquisitionPackageSummaryDTO): void {
    if(cardData && cardData.contributors){
      this.hasContributor = cardData.contributors?.value.length > 0
    }
    if(cardData && cardData.mission_owners && this.currentUser.sys_id) {
      this.isOwner = cardData.mission_owners?.value.indexOf(this.currentUser.sys_id) > -1
    }
    this.modifiedData.contractAward = cardData.contract_award?.value || ""
    this.modifiedData.missionOwner = cardData.mission_owners?.display_value || ""
    this.modifiedData.packageStatus = cardData.package_status?.display_value || ""
    this.modifiedData.projectOverview = cardData.project_overview?.display_value || ""
    this.modifiedData.secondaryReviewers = cardData.secondary_reviewers?.value || ""
    this.modifiedData.updated = cardData.sys_updated_on || ""
    this.modifiedData.contributors = cardData.contributors?.value || ""
  }

  public async updateStatus(newStatus: string): Promise<void> {
    let message = "";
    switch(newStatus){
    case 'DELETED':
      message = "Acquisition package deleted"
      break;
    case 'ARCHIVED':
      message = "Acquisition package archived"
      break;
    case 'DRAFT':
      message = "Acquisition package restored to draft"
      break;
    }
    await AcquisitionPackageSummary
      .updateAcquisitionPackageStatus({
        acquisitionPackageSysId: this.cardData.sys_id as string,
        newStatus
      });

    const toastObj: ToastObj = {
      type: "success",
      message,
      isOpen: true,
      hasUndo: false,
      hasIcon: true,
    };

    Toast.setToast(toastObj);
    this.$emit("updateStatus", this.cardData.sys_id, newStatus);
  }

  public async packageTitleClick(status: string): Promise<void> {
    const isEditable = ['draft', 'waiting for signatures'].some(
      s => s === status.toLowerCase()
    )
    if (isEditable){
      this.cardMenuClick({action: 'Edit draft package', title: ""}) 
    }
    if (status.toLowerCase() === "waiting for task order") {
      await AcquisitionPackage.setHideNavigation(true);
      this.$router.replace({
        name: routeNames.UnderReview,
        replace: true,
        params: {
          direction: "next"
        }   
      }).catch(() => console.log("avoiding redundant navigation"));
      await AcquisitionPackage.setPackageId(this.cardData.sys_id as string);
      AcquisitionPackage.setProjectTitle(this.modifiedData.projectOverview);
      AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
    }
  }

  public async cardMenuClick(menuItem: MeatballMenuItem): Promise<void> {
    switch (menuItem.action) {
    case "Edit draft package":
      await Steps.setAltBackDestination(AppSections.activeAppSection);
      if(this.isDitco && this.isWaitingForSignatures){
        this.$router.replace({
          name: routeNames.UploadSignedDocuments,
          replace: true,
          params: {
            direction: "next"
          },
          query: {
            packageId: this.cardData.sys_id
          }
        }).catch(() => console.log("avoiding redundant navigation"));
        await AcquisitionPackage.setPackageId(this.cardData.sys_id as string);
        AcquisitionPackage.setProjectTitle(this.modifiedData.projectOverview);
      }else{
        this.$router.replace({
          name: routeNames.ContractingShop,
          replace: true,
          params: {
            direction: "next"
          },
          query: {
            packageId: this.cardData.sys_id
          }
        }).catch(() => console.log("avoiding redundant navigation"));
      }
      AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
      await acquisitionPackage.setFirstTimeVisit(false)
      break;
    case "View completed package":
      this.packageTitleClick("Waiting for Task Order");
      break;
    case "Archive acquisition":
      this.showArchiveModal = true
      break;
    case "Delete acquisition package":
      this.showDeleteModal = true
      break;
    case "Restore package to draft":
      this.updateStatus('DRAFT')
      break;
    case "Add awarded task order":
      this.$emit("openTOSearchModal", this.cardData.sys_id);
      break;
    }

  }

  public async loadOnEnter(): Promise<void> {
    this.currentUser = await UserStore.getCurrentUser();
    this.isDitco = this.cardData.contracting_shop?.value === "DITCO"
    this.reformatData(this.cardData)
    if(this.cardData.package_status?.value === 'DRAFT'){
      this.cardMenuItems = [
        {
          title: "Edit draft package",
          action: "Edit draft package"
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
    if(this.cardData.package_status?.value === 'WAITING_FOR_SIGNATURES'){
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
            title: this.isDitco && this.isWaitingForSignatures?
              "Upload signed documents":"Edit draft package",
            action: "Edit draft package"
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
    if(this.cardData.package_status?.value === 'WAITING_FOR_TASK_ORDER'){
      this.cardMenuItems = [
        {
          title: "Add awarded task order",
          action: "Add awarded task order",
        },
        {
          title: "View completed package",
          action: "View completed package",
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
    if(this.cardData.package_status?.value  === 'TASK_ORDER_AWARDED'){
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
    if(this.cardData.package_status?.value  === 'ARCHIVED' && this.isOwner){
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
    if(this.cardData.sys_updated_on){
      if (this.cardData.package_status?.value  === 'TASK_ORDER_AWARDED') {
        const agoString = createDateStr(this.cardData.sys_updated_on, true);
        this.lastModifiedStr = "Awarded on " + agoString;
      } else if(this.cardData.package_status?.value  === 'ARCHIVED') {
        const archivedDate = createDateStr(this.cardData.sys_updated_on, true);
        this.lastModifiedStr = "Archived on " + archivedDate;
      }else {
        const updatedDate = createDateStr(this.cardData.sys_updated_on, true);
        this.lastModifiedStr = "Last modified " + updatedDate;
      }
    }
  }
  public async mounted(): Promise<void> {
    await AcquisitionPackage.setHideNavigation(false);
    await this.loadOnEnter();
  }
}
</script>

