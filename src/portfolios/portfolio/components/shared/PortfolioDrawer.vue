<template>
  <div class="_portfolio-drawer">
    <div id="AboutPortfolioSection" class="_portfolio-panel _panel-padding pb-8">
      <div>
        <div class="mx-n3 mt-n4">
          <v-textarea
            id="DrawerTextArea"
            v-model="portfolio.description"
            auto-grow
            autocomplete="off"
            class="_drawer-text-area pa-2 mb-2 font-size-14"
            dense
            hide-details
            placeholder="Add a description"
            rows="1"
            @blur="saveDescription"
          />
        </div>

        <div class="d-flex justify-space-between pb-3">
          <span id="StatusLabel">Status</span>
          <v-chip id="StatusChip" :color="getBgColor()" label>
            {{ portfolioStatus }}
          </v-chip>
        </div>

        <div class="d-flex align-center justify-space-between pb-3">
          <span id="CSPLabel">Cloud Service Provider</span>
          <div id="CSP" class="d-flex align-center">
            <ATATSVGIcon
              :name="cspData[cspKey].svgName"
              :width="cspData[cspKey].width"
              :height="cspData[cspKey].height"
              class="d-flex align-center mr-2"
            />
            <div>
              {{ cspData[cspKey].displayName }}
            </div>
          </div>
        </div>

        <div class="d-flex justify-space-between pb-2">
          <span id="AgencyLabel">Agency</span>
          <div id="Agency">
            {{ portfolio.agencyDisplay }}
          </div>
        </div>

        <div class="d-flex justify-space-between align-center">
          <span id="CreatedByLabel">Created by</span>
          <MemberCard id="CreatedBy" :member="portfolioCreator"/>
        </div>
      </div>
    </div>

    <hr class="my-0" />
    
    <div id="PortfolioMembersSection" class="_portfolio-panel _panel-padding pb-8">
      <div
        id="PortfolioMembersHeader"
        class="d-flex flex-columm justify-space-between"
      >
        <div id="PortfolioTitle" class="d-flex">
          <div class="h3 mr-2">Portfolio members</div>
          <div
            id="MemberCount"
            class="color-base font-size-20 _condensed-font"
            v-if="showMemberCount"
          >
            ({{ getPortfolioMembersCount }})
          </div>
        </div>
        <v-tooltip left nudge-right="20">
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
            >
              <v-btn
                id="AddPortfolioMember"
                class="_icon-only"
                @click="openMembersModal"
                @keydown.enter="openMembersModal"
                @keydown.space="openMembersModal"
              >
                <ATATSVGIcon
                  @click="openMembersModal"
                  name="PersonAddAlt"
                  color="base"
                  :width="22"
                  :height="16"
                />
              </v-btn>
            </span>
          </template>
        <div class="_tooltip-content-wrap _left">
          Add members
        </div>
        </v-tooltip>

      </div>
      <div
        id="PortfolioMembersList"
        class="pt-6"
      >
        <div 
          class="d-flex flex-columm justify-space-between"
          v-for="(member, index) in portfolioMembers"
          :key="member.sys_id"
        >
          <MemberCard :id="'MemberName' + index" :member="member" />

          <div v-if="managerCount === 1 && member.role.toLowerCase() === 'manager'">
            <v-tooltip left nudge-right="30">
            <template v-slot:activator="{ on }">
              <div
                v-on="on"
                class="py-1 d-flex"
                style="width: 105px; letter-spacing: normal; cursor: default;"
              >
                <div id="LastManager" class="width-100 text-right pr-4">Manager</div>
                <div style="width: 24px; height: 20px;"></div>
              </div>
            </template>
            <div class="_tooltip-content-wrap _left" style="width: 250px;">
              <div>
                You are the only manager of this portfolio. There must be at least
                one other manager for you to leave this portfolio or change roles.
              </div>
            </div>
            </v-tooltip>

          </div>
          <div v-else>
            <ATATSelect
              :id="'Role' + index"
              class="_small _alt-style-clean _invite-members-modal align-self-end"
              :items="getMemberMenuItems(member)"
              width="105"
              :selectedValue.sync="member.role"
              iconType="chevron"
              @onChange="(value)=>onSelectedMemberRoleChanged(value, index)"
              :menuDisabled="member.menuDisabled"
            />

          </div>
        </div>
      </div>
    </div>
    
    <hr class="my-0" />

    <div id="EnvironmentsSection" class="_portfolio-panel _panel-padding pb-4">
      <div id="EnvironmentsTitle" class="d-flex">
        <div class="h3 mr-2">Environments</div>
        <div
          id="EnvironmentsCount"
          class="color-base font-size-20 _condensed-font"
          v-if="showEnvCount"
        >
          ({{ getEnironmentCount }})
        </div>
      </div>
    </div>
    <div id="EnvironmentsList" class="_hoverable-rows">
      <div 
        class="_hover-row d-flex align-center justify-space-between" 
        v-for="(env, index) of portfolio.environments" 
        :key="index"
        tabindex="0"
        @click="goToCSPAdmin(env.sys_id)"
      >
        <div class="font-weight-500"> 
          {{ getClassificationLevel(env.classification_level) }}
        </div>
        <div class="d-flex align-center">
          <div class="text-right mr-2">
            <span class="font-weight-500 d-block" style="line-height: 1;">
              {{ getEnvStatus(env) }}
            </span>
            <span class="font-size-12 text-base">
              {{ getEnvDateStr(env) }}
            </span>
          </div>
          <div
            class="_icon-circle"
            :class="statusImg[env.environmentStatus].bgColor"
          >
            <ATATSVGIcon
              :name="statusImg[env.environmentStatus].name"
              :width="statusImg[env.environmentStatus].width"
              :height="statusImg[env.environmentStatus].height"
              :color="statusImg[env.environmentStatus].color"
            />
          </div>
        </div>
      </div>
    </div>

    <hr class="my-0" />

    <div id="DatesSection" class="_portfolio-panel _portfolio-panel _panel-padding">
      <div>
        <span id="LastUpdatedLabel">Last updated&nbsp;</span>
        <span id="LastUpdatedDate">{{ updateTime }}</span>
      </div>
    </div>

    <InviteMembersModal
        :showModal.sync="showMembersModal"
        @members-invited="membersInvited"
    />

    <ATATDialog
      id="RemoveMemberModal"
      :showDialog="showDeleteMemberDialog"
      :title="'Remove ' + deleteMemberName + ' from portfolio?'" 
      no-click-animation
      okText="Remove member"
      width="450"
      @ok="deleteMember"
      @cancelClicked="cancelDeleteMember"
    >    
      <template #content>
        <p class="body">
          {{ deleteMemberName }} will be removed from your portfolio members list. 
          This individual will no longer have access to view portfolio details or 
          track funds spent. 
        </p>
        <p class="body">
          NOTE: A portfolio manager can restore their access to this portfolio 
          at any time.
        </p>
      </template>
    </ATATDialog>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PortfolioRolesLearnMore from
  "@/portfolios/portfolio/components/shared/PortfolioRolesLearnMore.vue";
import PortfolioStore from "@/store/portfolio";
import SlideoutPanel from "@/store/slideoutPanel";
import Toast from "@/store/toast";

import {
  Environment,
  Portfolio,
  SelectData,
  SlideoutPanelContent,
  ToastObj,
  User
} from "types/Global";
import { 
  differenceInDays, 
  differenceInHours,
  differenceInMinutes, 
  format,
  parseISO 
} from "date-fns";
import _ from "lodash";
import MemberCard from "@/portfolios/portfolio/components/shared/MemberCard.vue";
import {createDateStr, getStatusChipBgColor, hasChanges} from "@/helpers";
import { Statuses } from "@/store/acquisitionPackage";
import CurrentUserStore from "@/store/user";
import InviteMembersModal from "@/portfolios/portfolio/components/shared/InviteMembersModal.vue";
import { EnvironmentDTO, UserDTO } from "@/api/models";
import AppSections from "@/store/appSections";

@Component({
  components: {
    InviteMembersModal,
    ATATDialog,
    ATATSVGIcon,
    ATATSelect,
    PortfolioRolesLearnMore,
    MemberCard,
  },
})

export default class PortfolioDrawer extends Vue {

  public portfolio: Portfolio = {};
  public portfolioStatus = "";
  public updateTime = "";
  public csp = "";
  
  public currentUserIsManager = false; 
  public showDeleteMemberDialog = false;
  public deleteMemberName = "";
  public deleteMemberIndex = -1;
  public portfolioCreator = PortfolioStore.portfolioCreator;

  public get currentUser(): UserDTO {
    return CurrentUserStore.getCurrentUserData;
  }
  @Watch("currentUser")
  public currentUserChange(newVal: UserDTO): void {
    const currentUserSysId = newVal.sys_id;
    const currentUserMember = this.portfolioMembers.find(obj => obj.sys_id === currentUserSysId);
    if (currentUserMember && currentUserMember.role === "Manager") {
      this.currentUserIsManager = true;
    }
  }  

  public get cspKey(): string {
    return this.csp ? this.csp.toLowerCase() : "aws";
  }

  public cspData = {
    aws: { displayName: "AWS", svgName: "aws", height: "18", width: "30" },
    azure: { displayName: "Azure", svgName: "azure", height: "23", width: "30" },
    gcp: { displayName: "Google Cloud", svgName: "gcp", height: "27", width: "30" },
    oracle: { displayName: "Oracle Cloud", svgName: "oracle", height: "19", width: "30" },
  }

  public accessRemovedToast: ToastObj = {
    type: "success",
    message: "Access removed",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  public memberMenuItems: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
    { divider: true },
    { text: "Remove from portfolio", value: "Remove", isSelectable: false },
    { text: "About Roles", value: "AboutRoles", isSelectable: false },
  ];

  public statusImg = {
    [Statuses.ProvisioningIssue.value]: {
      name: "warningAmber",
      width: "15",
      height: "13",
      color: "warning-dark2",
      bgColor:"bg-warning-lighter"
    },
    [Statuses.Provisioned.value]: {
      name: "provisioned",
      width: "20",
      height: "13",
      color: "success-dark",
      bgColor:"bg-success-lighter"
    },
    [Statuses.Processing.value]: {
      name: "processing",
      width: "20",
      height: "13",
      color: "info-dark",
      bgColor:"bg-info-lighter"
    }
  };

  public get showMembersModal(): boolean {
    return PortfolioStore.getShowAddMembersModal;
  }

  public set showMembersModal(value: boolean) {
    PortfolioStore.setShowAddMembersModal(value);
  }

  public getMemberMenuItems(member: User): SelectData[] {
    const menuItems = _.cloneDeep(this.memberMenuItems);
    if (member.email === this.currentUser.email) {
      const removeIndex = menuItems.findIndex((obj) => obj.value === "Remove");
      menuItems[removeIndex].text = "Leave this portfolio";
    }
    return menuItems;
  }

  public saveDescription(): void {
    if(hasChanges(PortfolioStore.currentPortfolio.description, this.portfolio.description)) {
      PortfolioStore.updatePortfolioDescription(this.portfolio.description);
    }
  }

  public formatDate(date: string): string {
    return format(parseISO(date), "MMM. d, Y, Hm");
  }

  public getBgColor(): string {
    return getStatusChipBgColor(this.portfolioStatus);
  }

  public getStatusKey(str: string): string {
    return _.startCase(str.toLowerCase().replaceAll("_", " ")).replaceAll(" ", "");
  }

  public async loadPortfolio(): Promise<void> {
    const storeData = await PortfolioStore.currentPortfolio;
 
    if (storeData) {
      this.portfolio = _.cloneDeep(storeData);
      this.csp = storeData.csp?.toLowerCase() as string;      
      if (storeData.lastUpdated) {
        this.updateTime = createDateStr(storeData.lastUpdated, true, true);
      }
      this.portfolioMembers = storeData.members || [];
      
      if (storeData.status) {
        const statusKey = this.getStatusKey(storeData.status);
        this.portfolioStatus = storeData.status 
          ? Statuses[statusKey].label
          : "";
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadPortfolio();
  }

  public async membersInvited(): Promise<void> {
    // update "Portfolio members" in side panel when invited from modal
    await this.loadPortfolio();
  }

  public displayName(member: User): string {
    return member.firstName && member.lastName 
      ? member.firstName + " " + member.lastName
      : member.email || "";
  }

  public get showEnvCount(): boolean {
    return this.getEnironmentCount > 0; 
  }
  public get getEnironmentCount(): number {
    return this.portfolio.environments?.length || 0;
  }

  public classificationLevels: Record<string, string> = {
    U: "Unclassified",
    S: "Secret",
    TS: "Top Secret",
  }
  public getClassificationLevel(abbr: string): string {
    return this.classificationLevels[abbr];
  }

  public async goToCSPAdmin(envSysId: string): Promise<void> {
    // go to CSP Admin page showing correct environment tab    
    await PortfolioStore.setCurrentEnvSysId(envSysId);
    await AppSections.setActiveTabIndex(2);
  }
  public getEnvStatus(env: Environment): string {
    if (env.environmentStatus) {
      const statusKey = this.getStatusKey(env.environmentStatus);
      return Statuses[statusKey].label;
    } 
    return "";
  }

  public getEnvDateStr(env: Environment): string {
    if (env.environmentStatus === Statuses.Processing.value && env.sys_created_on) {
      // return "Started x ago"
      const now = new Date();
      const created = new Date(env.sys_created_on);
      const diffInMinutes = differenceInMinutes(now, created);
      const diffInHours = differenceInHours(now, created);
      if (diffInMinutes < 60) {
        return "Started " +  differenceInMinutes(now, created) + " minutes ago";
      } else if (diffInHours <= 72) {
        const plural = diffInHours > 1 ? "s" : "";
        return "Started " + diffInHours + ` hour${plural} ago`;
      } 
      const diffInDays = differenceInDays(now, created);
      return "Started " + diffInDays + " days ago";
    }

    return createDateStr(env.provisioned_date, true, true);
  }


  public portfolioMembers: User[] = [];

  public get showMemberCount(): boolean {
    return this.getPortfolioMembersCount > 0;
  }
  public get getPortfolioMembersCount(): number {
    return this.portfolio?.members?.length
      ? this.portfolio?.members?.length
      : 0;
  }

  public get managerCount(): number {
    const managers = this.portfolioMembers.filter(obj => obj?.role?.toLowerCase() === "manager");
    return managers.length;
  }

  public openMembersModal(): void {
    PortfolioStore.setShowAddMembersModal(true);
  }

  private async onSelectedMemberRoleChanged(val: string, index: number): Promise<void> {
    if (this.portfolio && this.portfolio.members ) {
      const memberMenuItems = ["Manager", "Viewer"]
      if (memberMenuItems.indexOf(val) > -1) {
        this.portfolio.members[index].role = val;
        PortfolioStore.setPortfolioData(this.portfolio);
      } else {
        // reset role back to saved value in store
        const storeData = await PortfolioStore.getPortfolioData();
        this.portfolioMembers[index].role = storeData.members?.[index].role;
        if (val === "Remove" && this.portfolio.members && this.portfolio.members.length > 1) {
          this.deleteMemberName = this.displayName(this.portfolioMembers[index]);
          this.deleteMemberIndex = index;
          this.showDeleteMemberDialog = true;
        } else if (val === "AboutRoles") {
          const panelContent: SlideoutPanelContent = {
            component: PortfolioRolesLearnMore,
            title: "Learn More",
          }
          SlideoutPanel.setSlideoutPanelComponent(panelContent);
        }
      }
    }
  }

  public async deleteMember(): Promise<void> {
    this.showDeleteMemberDialog = false;
    if (this.portfolio.members) {
      this.portfolio.members.splice(this.deleteMemberIndex, 1);
      PortfolioStore.setPortfolioData(this.portfolio);
      await this.loadPortfolio();
      Toast.setToast(this.accessRemovedToast);
    }
  }

  public cancelDeleteMember(): void {
    this.showDeleteMemberDialog = false;
    this.deleteMemberIndex = -1;
  }
}
</script>
