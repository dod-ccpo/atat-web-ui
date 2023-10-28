<template>
  <div class="_portfolio-drawer">
    <div id="AboutPortfolioSection" class="_portfolio-panel _panel-padding pb-8">
      <div>
        <div class="mx-n3 mt-n4" v-if="showDescription">
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
            :readonly="isReadOnly || currentUserIsViewer"
            :disabled="isReadOnly || currentUserIsViewer"
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
    
    <div 
      id="PortfolioMembersSection" 
      class="_portfolio-panel _panel-padding pb-8"
    >
      <div
        id="PortfolioMembersHeader"
        class="d-flex justify-space-between"
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
        <v-tooltip left nudge-right="20" v-if="userCanInviteMembers">
          <!-- TODO: check activator -->
          <template v-slot:activator="{ props }">
            <span
              v-bind="props"
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
          class="d-flex justify-space-between"
          v-for="(member, index) in portfolioMembers"
          :key="member.sys_id"
        >
          <MemberCard :id="'MemberName' + index" :member="member" />

          <!-- NOT DROPDOWN - for owner and if current user is Viewer & member is someone else -->
          <div v-if="notMemberDropdown(member)">

            <v-tooltip left nudge-right="30">
              <!-- TODO: check activator -->
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="py-1 d-flex"
                  style="width: 105px; letter-spacing: normal; cursor: default;"
                >
                <div id="LastManagerOrOwner" class="width-100 text-right">
                  {{ member.role }}
                </div>
                  
                <div style="width: 16px; height: 20px;"></div>
                </div>
              </template>
              <div 
                v-if="member.role === 'Owner' && currentUserIsOwner && !portfolioIsArchived" 
                class="_tooltip-content-wrap _left" 
                style="width: 250px;"
              >
                As the owner, you will need to transfer ownership in order to 
                leave this portfolio.
              </div>
            </v-tooltip>
          </div>

          <!-- MEMBER DROPDOWN - for viewers and managers -->
          <div v-else>
            <ATATSelect
              :id="'Role' + index"
              :key="member.sys_id"
              class="_small _alt-style-clean _invite-members-modal align-self-end"
              :items="member.menuItems"
              width="105"
              :selectedValue.sync="member.role"
              iconType="chevron"
              @onChange="(value: string)=>onSelectedMemberRoleChanged(value, index)"
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
          ({{ getEnvironmentCount }})
        </div>
      </div>
    </div>
    <div id="EnvironmentsList" class="_hoverable-rows">
      <div 
        class="d-flex align-center justify-space-between"
        v-for="(env, index) of portfolio.environments"
        :class="hoverClass(env)"
        :key="index"
        tabindex="0"
        @click="handleLinkClick(env)"
      >
          <div class="d-flex align-start flex-column text-left mr-2">
              <span class="font-weight-500 d-block" style="line-height: 1;">
                {{ getClassificationLevel(env.classification_level) }}
              </span>
              <span class="font-size-12 text-base">
                {{ getCspName(env)}}
              </span>
          </div>
          <div class="d-flex align-end align-center">
            <div class="d-flex flex-column text-right mr-2">
                <span class="font-weight-500 d-block" style="line-height: 1;">
                  {{ getEnvStatus(env) }}
                </span>
                <span class="font-size-12 text-base">
                  {{ getEnvDateStr(env) }}
                </span>
            </div>
            <div class="_icon-circle" :class="getValue(env.environment_status, 'bgColor')">
              <ATATSVGIcon
                  :name="getValue(env.environment_status,'name')"
                  :color="getValue(env.environment_status,'color')"
                  :height="parseInt(getValue(env.environment_status,'height'))"
                  :width="parseInt(getValue(env.environment_status,'width'))" />
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
      @membersInvited="membersInvited"
    />

    <ATATDialog
      id="RemoveMemberModal"
      :showDialog="showRemoveMemberDialog"
      :title="'Remove ' + memberToRemove.firstName + ' from portfolio?'" 
      no-click-animation
      okText="Remove from portfolio"
      width="450"
      :OKDisabled="modalOKDisabled"
      :showOKSpinner="showOKSpinner"
      @ok="removeMember"
      @cancelClicked="cancelRemoveMember"
    >    
      <template #content>
        <p class="body">
          {{ memberToRemove.fullName }} will be removed from your portfolio member list. 
          This individual will no longer have access to portfolio details.
        </p>
      </template>
    </ATATDialog>

    <ATATDialog
      id="ManagerDowngradeModal"
      :showDialog="showManagerDowngradeDialog"
      title="Downgrade your user role?" 
      no-click-animation
      okText="Downgrade"
      width="450"
      @ok="downgradeManager"
      :OKDisabled="modalOKDisabled"
      :showOKSpinner="showOKSpinner"
      @cancelClicked="cancelDowngradeManager"
    >    
      <template #content>
        <p class="body">
          You will no longer have access to edit this portfolio. You can still track 
          funds spent and view task order details.
        </p>
      </template>
    </ATATDialog>

    <ATATDialog
      id="TransferOwnerModal"
      :showDialog="showTransferOwnerDialog"
      :title="'Transfer ownership to ' + transferToUser.firstName + '?'" 
      no-click-animation
      okText="Transfer ownership"
      width="450"
      :OKDisabled="modalOKDisabled"
      :showOKSpinner="showOKSpinner"
      @ok="transferOwner"
      @cancelClicked="closeTransferOwnerModal"
    >    
      <template #content>
        <p class="body">
          {{ transferToUser.fullName }} will become the primary contact of this 
          portfolio. Your role will change to <strong>Manager</strong>, and you 
          will lose the ability to archive the portfolio.
        </p>
      </template>
    </ATATDialog>

    <LeavePortfolioModal
      :showModal.sync="showLeavePortfolioModal" 
      :portfolioName="portfolio.title"
      :showOKSpinner="showOKSpinner"
      @okClicked="removeMember"
      @cancelClicked="cancelRemoveMember"
    />
  </div>
</template>

<script lang="ts">
import {Component, Watch,  Vue } from "vue-facing-decorator";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import LeavePortfolioModal from "../../../portfolio/components/shared/LeavePortfolioModal.vue";

// eslint-disable-next-line max-len
import PortfolioRolesLearnMore from "@/portfolios/portfolio/components/shared/PortfolioRolesLearnMore.vue";
import PortfolioStore from "@/store/portfolio";
import SlideoutPanel from "@/store/slideoutPanel";
import Toast from "@/store/toast";

// eslint-disable-next-line max-len
import {Environment, Portfolio, SelectData, SlideoutPanelContent, ToastObj, User} from "types/Global";
import {differenceInDays, differenceInHours, differenceInMinutes, format, parseISO} from "date-fns";
import _ from "lodash";
import MemberCard from "@/portfolios/portfolio/components/shared/MemberCard.vue";
import {createDateStr, getStatusChipBgColor, hasChanges} from "@/helpers";
import {Statuses} from "@/store/acquisitionPackage";
import CurrentUserStore from "@/store/user";
import InviteMembersModal from "@/portfolios/portfolio/components/shared/InviteMembersModal.vue";
import {UserDTO} from "@/api/models";
import AppSections from "@/store/appSections";
import Home from "@/home/Index.vue";

interface Member extends User {
  menuItems?: SelectData[];
}

@Component({
  components: {
    ATATDialog,
    ATATSelect,
    ATATSVGIcon,
    InviteMembersModal,
    PortfolioRolesLearnMore,
    LeavePortfolioModal,
    MemberCard,
  },
})

class PortfolioDrawer extends Vue {
  public portfolio: Portfolio = {};
  public updateTime = "";
  public csp = "";
  
  public modalOKDisabled = false;
  public showOKSpinner = false;
  
  public currentUserIsManager = false; 
  public currentUserIsOwner = false;
  public currentUserDowngradedToViewer = false;
  
  public showRemoveMemberDialog = false;
  public showLeavePortfolioModal = false;
  public memberToRemove: User = {};
  public removeMemberIndex = -1;

  public showTransferOwnerDialog = false;
  public transferOwnershipIndex = -1;
  public transferToUser: User = {};

  public portfolioCreator = PortfolioStore.portfolioCreator;

  public showManagerDowngradeDialog = false;
  public downgradeMemberIndex = -1;

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

  public notMemberDropdown(member: User): boolean {
    return (this.currentUserIsViewer && member.sys_id !== this.currentUser.sys_id) 
      || member.role === 'Owner' || this.portfolioIsArchived
  }

  public get isReadOnly(): boolean {
    return this.portfolioIsArchived;
  }

  public get currentUserIsViewer(): boolean {
    return PortfolioStore.currentUserIsViewer || this.currentUserDowngradedToViewer;
  }

  public get portfolioStatus(): string {
    return PortfolioStore.currentPortfolio.status as string;
  }

  public handleLinkClick(env: Environment): void{
    if(env.classification_level === 'U' && env.dashboard_link) {
      window.open(env.dashboard_link, "_blank")
    }
  }

  public get portfolioIsArchived(): boolean {
    return this.portfolioStatus === "ARCHIVED" ;
  }

  public get showDescription(): boolean {
    const descr = this.portfolio.description;
    return !this.portfolioIsArchived || 
      this.portfolioIsArchived && descr !== undefined && descr.length > 0;
  }

  public get cspKey(): string {
    return this.csp ? this.csp.toLowerCase() : "aws";
  }

  public cspData: {[key: string]: {[key: string]: string}} = {
    aws: { displayName: "AWS", svgName: "aws", height: "18", width: "30" },
    azure: { displayName: "Azure", svgName: "azure", height: "23", width: "30" },
    gcp: { displayName: "Google Cloud", svgName: "gcp", height: "27", width: "30" },
    oracle: { displayName: "Oracle Cloud", svgName: "oracle", height: "19", width: "30" },
  }

  public accessRemovedToast: ToastObj = {
    type: "success",
    message: "Portfolio access removed",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  public membersInvitedToast: ToastObj = {
    type: "success",
    message: "Members invited",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  public downgradedToast: ToastObj = {
    type: "success",
    message: "Role updated to Viewer",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

  public ownershipTransferredToast: ToastObj = {
    type: "success",
    message: "Ownership transferred",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  }

  public memberMenuItems: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
    { divider: true },
    { text: "Remove from portfolio", value: "Remove", isSelectable: false },
    { text: "About roles", value: "AboutRoles", isSelectable: false },
  ];
  
  public ownerMenuItems: SelectData[] = [
    { text: "Transfer ownership", value: "TransferOwner", isSelectable: false },
  ]
  
  public statusImg: {[key: string]: {[key: string]: string}} = {
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

  public getMemberMenuItems(member: Member): SelectData[] {
    const menuItems = _.cloneDeep(this.memberMenuItems);
    if (member.email === this.currentUser.email) {
      const removeIndex = menuItems.findIndex((obj) => obj.value === "Remove");
      menuItems[removeIndex].text = "Leave this portfolio";
    }
    if (member.role === "Viewer" && member.sys_id === this.currentUser.sys_id) {
      const managerIndex = menuItems.findIndex(obj => obj.text === "Manager");
      if (managerIndex > -1) {
        menuItems.splice(managerIndex, 1);
      }
    }

    if (this.currentUserIsOwner) {
      menuItems.push(...this.ownerMenuItems);
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

  public get userCanInviteMembers(): boolean {
    return (this.currentUserIsManager || this.currentUserIsOwner) && !this.isReadOnly;
  }

  public async loadPortfolio(): Promise<void> {
    const storeData = _.cloneDeep(PortfolioStore.currentPortfolio);
    if (storeData) {
      this.portfolio = storeData;
      this.csp = storeData.vendor?.toLowerCase() as string;      
      if (storeData.lastUpdated) {
        this.updateTime = createDateStr(storeData.lastUpdated, true, true);
      }

      this.portfolioMembers = _.cloneDeep(storeData.members) ?? [];

      const managers = this.portfolioMembers?.filter(m => m.role === "Manager");
      if (managers) {
        this.currentUserIsManager = managers.some(m => m.sys_id === this.currentUser.sys_id);
      }
      this.currentUserIsOwner = storeData.portfolio_owner === this.currentUser.sys_id;
      this.portfolioMembers.forEach((member) => {
        member.menuItems = this.getMemberMenuItems(member);
      });

    }
  }

  public async mounted(): Promise<void> {
    await this.loadPortfolio();
  }

  public async membersInvited(): Promise<void> {
    // update "Portfolio members" in side panel when invited from modal
    await this.loadPortfolio();
    Toast.setToast(this.membersInvitedToast);
  }

  public get showEnvCount(): boolean {
    return this.getEnvironmentCount > 0; 
  }
  public get getEnvironmentCount(): number {
    return this.portfolio.environments?.length ?? 0;
  }

  public classificationLevels: Record<string, string> = {
    U: "Unclassified",
    S: "Secret",
    TS: "Top Secret",
  }
  
  public getClassificationLevel(abbr: string): string {
    return this.classificationLevels[abbr];
  }

  public getValue(status: string | undefined, key: string) {
    return status?  this.statusImg[status][key] : ""
  }

  public getEnvStatus(env: Environment): string {
    if (env.environment_status) {
      const statusKey = this.getStatusKey(env.environment_status);
      return Statuses[statusKey].label;
    } 
    return "";
  }

  public getEnvDateStr(env: Environment): string {
    if (env.environment_status === Statuses.Processing.value && env.sys_created_on) {
      const now = new Date();
      const localCreatedOn = this.convertUtcToLocal(env.sys_created_on);

      const diffInMinutes = differenceInMinutes(now, localCreatedOn);
      const diffInHours = differenceInHours(now, localCreatedOn);
      if (diffInMinutes < 60) {
        return "Started " +  differenceInMinutes(now, localCreatedOn) + " minutes ago";
      } else if (diffInHours <= 72) {
        const plural = diffInHours > 1 ? "s" : "";
        return "Started " + diffInHours + ` hour${plural} ago`;
      } 
      const diffInDays = differenceInDays(now, localCreatedOn);
      return "Started " + diffInDays + " days ago";
    }

    // eslint-disable-next-line max-len
    return (env.provisioned_date) ? createDateStr(env.provisioned_date, true, true) : "";
  }

  public convertUtcToLocal(dateString: string): Date {
    const utcDate = new Date(dateString);
    const offsetMinutes = utcDate.getTimezoneOffset();
    return new Date(utcDate.getTime() - (offsetMinutes * 60 * 1000));
  }

  public portfolioMembers: Member[] = [];

  public get showMemberCount(): boolean {
    return this.getPortfolioMembersCount > 0;
  }
  public get getPortfolioMembersCount(): number {
    return this.portfolio?.members?.length
      ? this.portfolio?.members?.length
      : 0;
  }

  public openMembersModal(): void {
    PortfolioStore.setShowAddMembersModal(true);
  }

  public async transferOwner(): Promise<void> {
    this.modalOKDisabled = true;
    this.showOKSpinner = true;
    /* eslint-disable camelcase */
    const newOwner = this.portfolioMembers[this.transferOwnershipIndex];
    this.portfolio.portfolio_owner = newOwner.sys_id;
    const newOwnerPrevRole = newOwner.role;
    newOwner.role = "Owner";

    if (newOwner.sys_id) {
      if (newOwnerPrevRole === "Manager" && this.portfolio.portfolio_managers) {
        this.portfolio.portfolio_managers = this.removeItemFromArray(
          this.portfolio.portfolio_managers, newOwner.sys_id
        );
      } else if (newOwnerPrevRole === "Viewer" && this.portfolio.portfolio_viewers) {
        this.portfolio.portfolio_viewers = this.removeItemFromArray(
          this.portfolio.portfolio_viewers, newOwner.sys_id
        );
      }
    }
    /* eslint-enable camelcase */

    const prevOwnerIndex = this.portfolioMembers.findIndex(usr => usr.role === "Owner") ?? 0;
    this.portfolioMembers[prevOwnerIndex].role = "Manager";
    if (this.portfolio.members) {
      this.portfolio.members[this.transferOwnershipIndex].role = "Owner"
      this.portfolio.members[prevOwnerIndex].role = "Manager"
    }

    this.currentUserIsOwner = false;
    await this.updateMemberRole("Manager", prevOwnerIndex);
    await this.closeTransferOwnerModal();
    Toast.setToast(this.ownershipTransferredToast);
    this.modalOKDisabled = false;
    this.showOKSpinner = false;
  }

  public removeItemFromArray(users: string, sysId: string): string {
    const array = users.split(",");
    const i = array.indexOf(sysId);
    array.splice(i, 1);
    return array.join(",");    
  }

  public hoverClass(env: Environment): string {
    return env.classification_level === "U" && env.dashboard_link
      ? "_hover-row" : "py-3 pl-6 pr-4";
  }

  public async closeTransferOwnerModal(): Promise<void> {
    this.showTransferOwnerDialog = false;
    this.transferOwnershipIndex = -1;
  }

  public async downgradeManager(): Promise<void> {
    this.modalOKDisabled = true;
    this.showOKSpinner = true;
    if (this.portfolio.members) {
      this.currentUserDowngradedToViewer = true;      
      await this.updateMemberRole("Viewer", this.downgradeMemberIndex);
      Toast.setToast(this.downgradedToast);
      this.showManagerDowngradeDialog = false;
    }
    this.modalOKDisabled = false;
    this.showOKSpinner = false;
  }

  public cancelDowngradeManager(): void {
    this.showManagerDowngradeDialog = false;
    const i = this.downgradeMemberIndex;
    this.portfolioMembers[i].role = "Manager";
    if (this.portfolio.members) this.portfolio.members[i].role = "Manager";
    this.downgradeMemberIndex = -1;
  }
  
  public async updateMemberRole(val: string, index: number): Promise<void> {
    if (this.portfolio.members) {
      this.portfolio.members[index].role = val;

      const managers: string[] = [];
      const viewers: string[] = [];
      this.portfolio.members.forEach(member => {
        if (member.role === "Viewer" && member.sys_id) viewers.push(member.sys_id);
        if (member.role === "Manager" && member.sys_id) managers.push(member.sys_id);
      });

      /* eslint-disable camelcase */
      this.portfolio.portfolio_viewers = viewers.join(",");
      this.portfolio.portfolio_managers = managers.join(",");
      /* eslint-enable camelcase */

      await PortfolioStore.setCurrentPortfolioMembers(this.portfolio);
      this.downgradeMemberIndex = -1;

      this.$nextTick(async () => {
        await this.loadPortfolio();
      })
    }
  }

  private async onSelectedMemberRoleChanged(val: string, index: number): Promise<void> {
    const storeData = await PortfolioStore.getPortfolioData();
    if (this.portfolio?.members && storeData.members) {
      const memberMenuItems = ["Manager", "Viewer"]
      if (memberMenuItems.indexOf(val) > -1) {
        // if current user is downgrading from Manager to Viewer, show confirm modal
        const member = storeData.members[index];
        if (val === "Viewer" && member.role === "Manager" 
          && this.currentUser.sys_id === member.sys_id
        ) {
          // OPEN THE MODAL - wait for confirmation yes or no to call this.updateMemberRole
          this.downgradeMemberIndex = index;
          this.showManagerDowngradeDialog = true;
        } else {
          await this.updateMemberRole(val, index);
        }

      } else {
        // reset role back to saved value in store
        const member = this.portfolioMembers[index];
        member.role = storeData.members?.[index].role;
        if (val === "Remove" && this.portfolio.members && this.portfolio.members.length > 1) {
          this.memberToRemove = member;
          this.removeMemberIndex = index;
          if (this.currentUser.sys_id !== member.sys_id) {
            this.showRemoveMemberDialog = true;
          } else {
            this.showLeavePortfolioModal = true;
          }

        } else if (val === "AboutRoles") {
          this.$nextTick(() => {
            const panelContent: SlideoutPanelContent = {
              component: PortfolioRolesLearnMore,
              title: "Learn More",
            }
            SlideoutPanel.setSlideoutPanelComponent(panelContent);
          })
        } else if (val === "TransferOwner") {
          this.transferToUser = this.portfolioMembers[index];
          this.transferOwnershipIndex = index;
          this.showTransferOwnerDialog = true;
        }
      }
    }
  }

  public async removeMember(): Promise<void> {
    this.modalOKDisabled = true;
    this.showOKSpinner = true;
    if (this.portfolio.members) {
      const role = this.portfolio.members[this.removeMemberIndex].role;
      const sysId = this.portfolio.members[this.removeMemberIndex].sys_id as string;
      /* eslint-disable camelcase */
      if (role === "Manager" && this.portfolio.portfolio_managers) {
        this.portfolio.portfolio_managers = 
          this.removeItemFromArray(this.portfolio.portfolio_managers, sysId);
      }
      if (role === "Viewer" && this.portfolio.portfolio_viewers) {
        this.portfolio.portfolio_viewers = 
          this.removeItemFromArray(this.portfolio.portfolio_viewers, sysId);
      } 
      /* eslint-enable camelcase */
      this.portfolio.members.splice(this.removeMemberIndex, 1);
      await PortfolioStore.setCurrentPortfolioMembers(this.portfolio);
      await PortfolioStore.removeMemberFromCurrentPortfolio(sysId);
      
      if (sysId === this.currentUser.sys_id) {
        // current user left the portfolio - send to home page
        await PortfolioStore.setUserLeftPortfolio(true);
        await AppSections.setAppContentComponent(Home);

      } else {
        await this.loadPortfolio();
        Toast.setToast(this.accessRemovedToast);
      }
    }
    this.showRemoveMemberDialog = false;
    this.showLeavePortfolioModal = false;
    this.modalOKDisabled = false;
    this.showOKSpinner = false;        
  }

  public cancelRemoveMember(): void {
    this.showRemoveMemberDialog = false;
    this.showLeavePortfolioModal = false;
    this.removeMemberIndex = -1;
  }

  public getCspName(env: Environment): string {
    if(!env.cloud_distinguisher) {
      return "";
    } 

    // JSON.parse can throw
    try {
      const cloudDistinguisher = JSON.parse(env.cloud_distinguisher);
      const impactLevel = cloudDistinguisher.name;
      switch(this.portfolio.vendor) {

      // eslint-disable-next-line max-len
      case "AZURE": return (impactLevel === "IL2") ? `Azure Commercial (${impactLevel})` : `Azure Government (${impactLevel})`;
      case "GCP": return `Google ${impactLevel} Commercial`;
      case "AWS":
      case "ORACLE":
      default: return "";
      }
    } catch (e) {
      return `Failure parsing cloud_distinguisher: err ${JSON.stringify(e, null, 2)}`;
    }
  }
}
export default PortfolioDrawer
</script>
