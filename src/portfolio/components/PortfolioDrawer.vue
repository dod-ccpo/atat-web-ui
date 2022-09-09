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
          <v-chip
            id="StatusChip"
            :color="getBgColor(portfolio.status)"
            label
          >
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
          <div id="CreatedBy" class="_text-link">
            Maria Missionowner
          </div>
        </div>
      </div>
    </div>
    <hr class="my-8" />
    <div id="PortfolioMembersSection" class="px-6">
      <h3 id="PortfolioMembersHeader">Portfolio Members</h3>
    </div>
    <hr class="mb-4 " />
    <div id="DatesSection" class="_portfolio-panel pt-0">
      <div>
        <span id="ProvisionedOnLabel">Provisioned on&nbsp;</span>
        <span id="ProvisionedOnDate">{{provisionedTime}}</span>
      </div>
      <div>
        <span id="LastUpdatedLabel">Last updated&nbsp;</span>
        <span id="LastUpdatedDate">{{updateTime}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PortfolioData from "@/store/portfolio";
import { format, parseISO } from "date-fns"
import { Portfolio } from "types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class PortfolioDrawer extends Vue {
  public portfolio: Portfolio= {}
  public provisionedTime = ""
  public updateTime = ""
  public csp = ""
  public saveDescription(): void {
    PortfolioData.setPortfolioData(this.portfolio)
  }

  public formatDate(date:string):string {
    return format(parseISO(date), 'MMM. d, Y, Hm')
  }

  public getBgColor(): string {
    switch (this.portfolio.status?.toLowerCase()) {
    case 'active':
      return "bg-success";
    case 'processing':
      return "bg-info-dark";
    case 'expiring pop':
      return "bg-warning";
    case 'expired':
      return "bg-error";
    case 'archived':
      return "bg-base-dark";
    default:
      return "";
    }
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await PortfolioData.getPortfolioData()
    if (storeData) {
      this.portfolio = storeData
      if(storeData.provisioned && storeData.updated && storeData.csp){
        this.provisionedTime = this.formatDate(storeData.provisioned)
        this.updateTime = this.formatDate(storeData.updated)
        this.csp = storeData.csp
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
