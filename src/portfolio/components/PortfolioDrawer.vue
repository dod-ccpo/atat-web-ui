<template>
  <div class="_portfolio-drawer">
    <div id="AboutPortfolioSection" class="_portfolio-panel">
      <h3 id="AboutSectionHeader" class="mb-4 mt-6">About Portfolio</h3>
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
    <hr class="my-8" />
    <div id="PortfolioMembersSection" class="px-6">
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
          class="_icon-only position-relative"
          @click="openMembersModal()"
        >
          <ATATSVGIcon
            @click="openMembersModal"
            class="pt-1"
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
        v-for="(member, index) in getPortfolioMembers()" :key="member.email">
          <a  class="pt-1" id="MemberName" role="button"> Maria Missionowner </a>
          <div>
            <ATATSelect
              @onChange="(value)=>onSelectedMemberRoleChanged(value, index)"
              id="Role"
              class="_small _alt-style-clean _invite-members-modal align-self-end"
              :items="memberRoles"
              width="105"
              :selectedValue="member.role"
              iconType="chevron"
            />
          </div>
        </div>
      </div>
    </div>
    <hr class="mb-4" />
    <div id="DatesSection" class="_portfolio-panel pt-0">
      <div>
        <span id="ProvisionedOnLabel">Provisioned on&nbsp;</span>
        <span id="ProvisionedOnDate">{{ provisionedTime }}</span>
      </div>
      <div>
        <span id="LastUpdatedLabel">Last updated&nbsp;</span>
        <span id="LastUpdatedDate">{{ updateTime }}</span>
      </div>
    </div>
    <AddMembersModal :showModal.sync="showMembersModal" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioData from "@/store/portfolio";
import { format, parseISO } from "date-fns";
import { Portfolio, SelectData } from "types/Global";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import AddMembersModal from "@/portfolio/components/AddMembersModal.vue";
import { User } from "../../../types/Global";

@Component({
  components: {
    ATATSVGIcon,
    ATATSelect,
    AddMembersModal,
  },
})
export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio = {};
  public provisionedTime = "";
  public updateTime = "";
  public csp = "";

  public showMembersModal = false;

  public memberRoles: SelectData[] = [
    { header: "Roles" },
    { text: "Manager", value: "Manager" },
    { text: "Viewer", value: "Viewer" },
    { divider: true },
    { text: "Remove from portfolio", value: "Remove" },
    { text: "About Roles", value: "Roles" },
  ];;

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

  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioData.getPortfolioData();
    if (storeData) {
      this.portfolio = storeData;
      if (storeData.provisioned && storeData.updated && storeData.csp) {
        this.provisionedTime = this.formatDate(storeData.provisioned);
        this.updateTime = this.formatDate(storeData.updated);
        this.csp = storeData.csp;
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public getPortfolioMembersCount(): number {
    return this.portfolio?.members?.length
      ? this.portfolio?.members?.length
      : 0;
  }

  public getPortfolioMembers(): User[] {
    return this.portfolio?.members?.length ? this.portfolio?.members : [];
  }

  public openMembersModal(): void {
    this.showMembersModal = true;
  }

  private onSelectedMemberRoleChanged(role: string, index: number): void {
    debugger;

    if(this.portfolio && this.portfolio.members ){

      if( role === "Manager" || role == "Viewer"){
        var member = this.portfolio.members[index];
        member.role = role;
      }
    }

  }
}
</script>