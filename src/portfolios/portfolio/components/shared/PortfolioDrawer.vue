<template>
  <div class="_portfolio-drawer">
    <div id="AboutPortfolioSection" class="_portfolio-panel _panel-padding pb-8">
      <h3 id="AboutSectionHeader" class="mb-4">About Portfolio</h3>
      <div>
        <v-textarea
          id="DrawerTextArea"
          v-model="portfolio.description"
          auto-grow
          autocomplete="off"
          class="_drawer-text-area pt-0 mb-4 ml-n1"
          dense
          hide-details
          placeholder="Add a description"
          rows="1"
          @blur="saveDescription"
        >
        </v-textarea>
        <div class="d-flex justify-space-between pb-4">
          <span id="StatusLabel">Status</span>
          <v-chip id="StatusChip" :color="getBgColor()" label>
            {{ portfolioStatus }}
          </v-chip>
        </div>
        <div class="d-flex align-center justify-space-between pb-4">
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
            {{ portfolio.agency }}
          </div>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span id="CreatedByLabel">Created by</span>
          <!-- TODO: AT-8747 - get actual created_by user -->
          <!-- code below simply puts first member in portfolio members array as creator -->
          <MemberCard id="CreatedBy" :index="0" />
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
            class="color-base font-size-20"
            v-if="getPortfolioMembersCount() > 0"
          >
            ({{ getPortfolioMembersCount() }})
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
                disabled
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
        <div class="_tooltip-content-wrap _left" style="width: 255px">
          <span class="font-weight-bold d-block mb-1">
            Coming Soon!
          </span>
          You will be able to invite others to access this portfolio witin ATAT.
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
          :key="member.email"
        >
          <MemberCard :id="'MemberName' + index" :index="index" />
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
              :selectedValue.sync="portfolioMembers[index].role"
              iconType="chevron"
              @onChange="(value)=>onSelectedMemberRoleChanged(value, index)"
              :menuDisabled="member.menuDisabled"
            />

          </div>
        </div>
      </div>
    </div>

    <hr class="my-0" />

    <div id="DatesSection" class="_portfolio-panel _portfolio-panel _panel-padding">
      <!-- 
        
        TODO: refactor with environments after AT-8744 complete
      
      <div>
        <span id="ProvisionedOnLabel">Provisioned on&nbsp;</span>
        <span id="ProvisionedOnDate">{{ provisionedTime }}</span>
      </div>
      <div>
        <span id="LastUpdatedLabel">Last updated&nbsp;</span>
        <span id="LastUpdatedDate">{{ updateTime }}</span>
      </div>
      -->
    </div>

    <AddMembersModal 
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
import { Component } from "vue-property-decorator";

import AddMembersModal from "@/portfolios/portfolio/components/shared/AddMembersModal.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PortfolioRolesLearnMore from
  "@/portfolios/portfolio/components/shared/PortfolioRolesLearnMore.vue";

import PortfolioStore from "@/store/portfolio";
import SlideoutPanel from "@/store/slideoutPanel";
import Toast from "@/store/toast";

import {
  Portfolio,
  SelectData,
  SlideoutPanelContent,
  ToastObj,
  User
} from "types/Global";
import { format, parseISO } from "date-fns";
import _ from "lodash";
import MemberCard from "@/portfolios/portfolio/components/shared/MemberCard.vue";
import {getStatusChipBgColor, hasChanges} from "@/helpers";
import { Statuses } from "@/store/acquisitionPackage";
import CurrentUserStore from "@/store/user";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon,
    ATATSelect,
    AddMembersModal,
    PortfolioRolesLearnMore,
    MemberCard,
  },
})

export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio = {};
  public portfolioStatus: string = Statuses.Active.label;
  public provisionedTime = "";
  public updateTime = "";
  public csp = "";
  public currentUser: User = {};

  public showDeleteMemberDialog = false;
  public deleteMemberName = "";
  public deleteMemberIndex = -1;

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

  public async loadPortfolio(): Promise<void> {
    const storeData = _.cloneDeep(await PortfolioStore.getPortfolioData());
    if (storeData) {
      this.portfolio = _.cloneDeep(storeData);
      this.csp = storeData.csp?.toLowerCase() as string;      
      if (storeData.provisioned) {
        this.provisionedTime = this.formatDate(storeData.provisioned);
      }
      if (storeData.updated) {
        this.updateTime = this.formatDate(storeData.updated);
      }
      this.portfolioMembers = _.cloneDeep(storeData.members) || [];
      this.portfolioStatus = PortfolioStore.getStatus;
    }
    this.currentUser = await CurrentUserStore.getCurrentUser();
    // TODO AT-8747 - check if current user is Manager or Viewer
    // TEMP HARDCODE ROLE
    this.currentUser.role = "Manager";
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

  public portfolioMembers: User[] = [];

  public getPortfolioMembersCount(): number {
    return this.portfolio?.members?.length
      ? this.portfolio?.members?.length
      : 0;
  }

  public get managerCount(): number {
    const managers = this.portfolioMembers.filter(obj => obj.role?.toLowerCase() === "manager")
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
