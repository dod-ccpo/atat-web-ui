<template>
  <div class="_portfolio-drawer">
    <div id="AboutPortfolioSection" class="_portfolio-panel _panel-padding">
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
          <v-chip id="StatusChip" :color="getBgColor(portfolio.status)" label>
            {{ portfolio.status }}
          </v-chip>
        </div>
        <div class="d-flex justify-space-between pb-4">
          <span id="CSPLabel">Cloud Service Provider</span>
          <div id="CSP" class="d-flex align-center">
            <ATATSVGIcon
              :name="csp.toLowerCase()"
              color="azure-blue"
              width="20"
              height="16"
              class="mr-1"
            />
            <div>
              {{ portfolio.csp }}
            </div>
          </div>
        </div>
        <div class="d-flex justify-space-between pb-4">
          <span id="ServiceAgencyLabel">Service/Agency</span>
          <div id="ServiceAgency">
            {{ portfolio.serviceAgency }}
          </div>
        </div>
        <div class="d-flex justify-space-between">
          <span id="CreatedByLabel">Created by</span>
          <div id="CreatedBy" class="_text-link">Maria Missionowner</div>
        </div>
      </div>
    </div>

    <hr class="my-0" />

    <div id="PortfolioMembersSection" class="_portfolio-panel _panel-padding">
      <div
        id="PortfolioMembersHeader"
        class="d-flex flex-columm justify-space-between"
      >
        <div id="PortfolioTitle" class="d-flex">
          <div class="h3 mr-2">Portfolio members</div>
          <div
            class="color-base font-size-20"
            v-if="getPortfolioMembersCount() > 0"
          >
            ({{ getPortfolioMembersCount() }})
          </div>
        </div>
        <v-btn
          id="AddPortfolioMember"
          class="_icon-only"
          @click="openMembersModal()"
        >
          <ATATSVGIcon
            @click="openMembersModal"
            name="PersonAddAlt"
            color="base"
            :width="22"
            :height="16"
          />
        </v-btn>
      </div>
      <div
        id="PortfolioMembersList"
        class="pt-6"
      >
        <div class="d-flex flex-columm justify-space-between" 
        v-for="(member, index) in portfolioMembers" :key="member.email">
          <a  class="pt-1" id="MemberName" role="button">
            {{ displayName(member) }}
          </a>
          <div>
            <ATATSelect
              :id="'Role' + index"
              class="_small _alt-style-clean _invite-members-modal align-self-end"
              :items="memberRoles"
              width="105"
              :selectedValue.sync="portfolioMembers[index].role"
              iconType="chevron"
              @onChange="(value)=>onSelectedMemberRoleChanged(value, index)"
            />
          </div>
        </div>
      </div>
    </div>

    <hr class="my-0" />

    <div id="DatesSection" class="_portfolio-panel _portfolio-panel _panel-padding">
      <div>
        <span id="ProvisionedOnLabel">Provisioned on&nbsp;</span>
        <span id="ProvisionedOnDate">{{ provisionedTime }}</span>
      </div>
      <div>
        <span id="LastUpdatedLabel">Last updated&nbsp;</span>
        <span id="LastUpdatedDate">{{ updateTime }}</span>
      </div>
    </div>
    <AddMembersModal 
      :showModal.sync="showMembersModal" 
      @members-invited="membersInvited"
    />

    <ATATDialog
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
import PortfolioData from "@/store/portfolio";
import { format, parseISO } from "date-fns";
import { Portfolio, SelectData, SlideoutPanelContent, User } from "types/Global";
import ATATDialog from "@/components/ATATDialog.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import AddMembersModal from "@/portfolio/components/AddMembersModal.vue";
import PortfolioRolesLearnMore from "@/portfolio/components/PortfolioRolesLearnMore.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

import _ from "lodash";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon,
    ATATSelect,
    AddMembersModal,
    PortfolioRolesLearnMore,
  },
})
export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio = {};
  public provisionedTime = "";
  public updateTime = "";
  public csp = "";

  public showMembersModal = false;
  public showDeleteMemberDialog = false;
  public deleteMemberName = "";
  public deleteMemberIndex = -1;

  public memberRoles: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
    { divider: true },
    { text: "Remove from portfolio", value: "Remove", isSelectable: false },
    { text: "About Roles", value: "AboutRoles", isSelectable: false },
  ];

  public saveDescription(): void {
    PortfolioData.setPortfolioData(this.portfolio);
  }

  public formatDate(date: string): string {
    return format(parseISO(date), "MMM. d, Y, Hm");
  }

  public getBgColor(): string {
    switch (this.portfolio.status?.toLowerCase()) {
    case "active":
      return "bg-success";
    case "processing":
      return "bg-info-dark";
    case "expiring pop":
      return "bg-warning";
    case "expired":
      return "bg-error";
    case "archived":
      return "bg-base-dark";
    default:
      return "";
    }
  }

  public async loadPortfolio(): Promise<void> {
    const storeData = await PortfolioData.getPortfolioData();
    if (storeData) {
      this.portfolio = storeData;
      if (storeData.provisioned && storeData.updated && storeData.csp) {
        this.provisionedTime = this.formatDate(storeData.provisioned);
        this.updateTime = this.formatDate(storeData.updated);
        this.csp = storeData.csp;
      }
      this.portfolioMembers = _.cloneDeep(storeData.members) || [];
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

  public portfolioMembers: User[] = [];

  public getPortfolioMembersCount(): number {
    return this.portfolio?.members?.length
      ? this.portfolio?.members?.length
      : 0;
  }

  public openMembersModal(): void {
    this.showMembersModal = true;
  }

  private async onSelectedMemberRoleChanged(val: string, index: number): Promise<void> {
    if (this.portfolio && this.portfolio.members ) {
      const memberRoles = ["Manager", "Viewer"]
      if (memberRoles.indexOf(val) > -1) {
        this.portfolio.members[index].role = val;
        PortfolioData.setPortfolioData(this.portfolio);
      } else {
        // reset role back to saved value in store
        const storeData = await PortfolioData.getPortfolioData();
        this.portfolioMembers[index].role = storeData.members?.[index].role;
        if (val === "Remove" && this.portfolio.members && this.portfolio.members.length > 1) {
          this.deleteMemberName = this.displayName(this.portfolioMembers[index]);
          this.deleteMemberIndex = index;
          this.showDeleteMemberDialog = true;         
        } else if (val === "AboutRoles") {

          // alert("open slideout in future ticket")
          // Open the slideout panel -- future ticket

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
      PortfolioData.setPortfolioData(this.portfolio);
      await this.loadPortfolio();
    }
  }

  public cancelDeleteMember(): void {
    this.showDeleteMemberDialog = false;
    this.deleteMemberIndex = -1;
  }
}
</script>