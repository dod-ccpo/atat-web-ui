<template>
  <v-card
    class="_summary-card-wrapper"
    :class="{ '_first': index === 0, '_last': isLastCard }"
    elevation="0"
  >

    <div class="pr-5">
      <div class="_csp-icon-wrap" :data-csp="CSPs[cspKey].title">
        <v-tooltip
          transition="slide-y-reverse-transition"
          color="rgba(0,0,0,1)"
          top
          :open-on-hover="true"
          :open-delay="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
            >
              <ATATSVGIcon 
                :name="CSPs[cspKey].img.name" 
                :width="CSPs[cspKey].img.width" 
                :height="CSPs[cspKey].img.height" 
              />
            </span>
          </template>
          <div class="_tooltip-content-wrap">
            {{ CSPs[cspKey].title }}
          </div>
        </v-tooltip>
      </div>
    </div>
    <div class="pr-8 flex-grow-1">
      <div class="d-flex">
        <div class="card-header flex-grow-1">
          <!-- 
          ----------------------------------------------------------
            -- ATAT TODO -  UNHIDE LINK when Portfolio Mgmt added -- 
          ----------------------------------------------------------
          <a
            :id="'PortfolioName' + index"
            role="button"
            tabindex="0"
            class="h3 _text-decoration-none d-flex align-center _portfolio-name"
            @click="cardMenuClick(portfolioCardMenuItems[0])"
          > -->
          <span class="h3 text-base-darker d-flex align-center _portfolio-name">
            {{ cardData.title }}
            <ATATSVGIcon 
              v-if="cardData.isManager"
              name="manageAccount"
              width="20"
              height="17"
              color="base"
              class="ml-3"
            />
          </span>

          <!-- </a> -->
        </div>
        <div v-if="!isActive || cardData.fundingAlertChipString">
          <v-chip
            :id="'StatusChip' + index" 
            :class="statusChipBgColor" 
            label
          >
            {{ !isActive ? cardData.status : cardData.fundingAlertChipString }}
          </v-chip>

        </div>
      </div>
      <div class="text-base-dark mb-3">
        <!-- ATAT TODO -- REINSTATE WHEN NOT HARD-CODING dod_component
        <span class="_agency">{{ cardData.agency }}</span>
        <ATATSVGIcon 
          name="bullet" 
          color="base-light" 
          :width="9" 
          :height="9" 
          class="d-inline-block mx-1 _last-modified" 
        />
        -->
        {{ cardData.lastModifiedStr }}
      </div>

      <div v-if="isActive && !isHomeView" class="d-flex">

        <div 
          :id="'PoP' + index"
          class="mr-15 _current-pop"  
          :class="[{'_alert' : isPopAlert, '_error' : isPopAlertError}]">
          <div class="_data-header">Current Period of Performance</div>
          <div class="_data-primary d-block">
            {{ cardData.currentPoP }}
          </div>
          <div v-if="isPopAlert" class="_data-secondary d-flex">
            {{ cardData.expiration }}
            <ATATSVGIcon
              class="ml-1"
              v-if="isPopAlertError"
              name="errorFilled"
              width="13"
              height="13"
              color="error"
            />
            <ATATSVGIcon
              v-else
              class="ml-1"
              name="warning"
              width="15"
              height="13"
              color="warning-dark2"
            />
          </div>
        </div>

        <div class="mr-15 _total-obligated" :id="'TotalObligated' + index">
          <div class="_data-header">Total Obligated</div>
          <div class="_data-primary d-block nowrap">
            {{ cardData.totalObligated }}
          </div>
        </div>

        <div 
          :id="'FundsSpent' + index" 
          class="flex-grow-1 _funds-spent" 
          :class="[{'_alert' : isFundingAlert, '_error' : isFundingAlertError}]"
        >
          <div class="_data-header">Funds Spent (%)</div>
          <div class="_data-primary d-block">
            <div 
              class="mr-1 nowrap d-inline-block" 
              :class="{'font-weight-700' : isFundingAlertError}"
            >
              {{ cardData.fundsSpent }}
            </div>
            <div class="text-base  d-inline-block font-size-12 nowrap">
              ({{ cardData.fundsSpentPercent }}%)
            </div>
          </div>
          <div v-if="isFundingAlert" class="_data-secondary d-flex">
            {{ cardData.fundsRemaining }}
            <ATATSVGIcon
              class="ml-1"
              v-if="isFundingAlertError"
              name="errorFilled"
              width="13"
              height="13"
              color="error"
            />
            <ATATSVGIcon
              v-else
              class="ml-1"
              name="warning"
              width="15"
              height="13"
              color="warning-dark2"
            />

          </div>
        </div>

      </div>
    </div>

    <!-- 
      ------------------------------------------------------------
      -- ATAT TODO -  UNHIDE MEATBALL when Portfolio Mgmt added -- 
      ------------------------------------------------------------
      <ATATMeatballMenu 
      :id="'PortfolioCardMenu' + index"
      :left="true"
      :index="index"
      :menuItems="portfolioCardMenuItems"
      @menuItemClick="cardMenuClick"
    /> -->

    <LeavePortfolioModal
      :showModal.sync="showLeavePortfolioModal" 
      :portfolioName="cardData.title"
      @okClicked="leavePortfolio"
    />

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";

import { MeatballMenuItem, PortfolioCardData } from "types/Global";
import PortfolioStore, { cspConsoleURLs } from "@/store/portfolio";
import { getStatusChipBgColor, toTitleCase } from "@/helpers";
import AppSections from "@/store/appSections";
import LeavePortfolioModal from "../portfolio/components/shared/LeavePortfolioModal.vue";
import { Statuses } from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATSVGIcon,
    ATATMeatballMenu,
    LeavePortfolioModal,
  }
})

export default class PortfolioCard extends Vue {
  @Prop() private cardData!: PortfolioCardData;
  @Prop() private index!: number;
  @Prop() private isLastCard!: boolean;
  @Prop() private isHaCCAdmin!: boolean;
  @Prop({ default: false }) public isHomeView?: boolean;

  public showLeavePortfolioModal = false;

  public menuActions = {
    viewFundingTracker: "navToFundingTracker",
    viewTaskOrders: "navToTaskOrders",
    leavePortfolio: "leavePortfolio",
    emailManagers: "emailManagers",
    loginToCSP: "loginToCSP",
  }
 
  // DUMMY HaCC EMAIL UNTIL ACTUAL DATA FROM BACKEND
  public currentUserEmail = "sample-haac-admin@mail.mil";
  public get managerEmails(): string {
    // Return dummy emails until API call wired up to get portfolio managers
    return "foo@mail.mil, bar@mail.mil";
  }

  public get isActive(): boolean {
    return this.cardData.status?.toLowerCase() === Statuses.Active.value.toLowerCase();
  }

  public get hasFundingStatus(): boolean {
    return (this.cardData.fundingStatus !== undefined && this.cardData.fundingStatus.length > 0);
  }

  public popAlertStatuses: string[] = [
    Statuses.ExpiringSoon.value, Statuses.Expired.value 
  ];
  public fundingAlertStatuses: string[] = [
    Statuses.FundingAtRisk.value, Statuses.Delinquent.value
  ];

  public redAlertStatuses: string[] = [
    Statuses.Expired.value, Statuses.Delinquent.value
  ];

  public get isPopAlert(): boolean {
    return this.popAlertStatuses.includes(this.cardData.fundingStatus || "");
  }
  public get isPopAlertError(): boolean {
    return this.cardData.fundingStatus === Statuses.Expired.value;
  }
  public get isFundingAlert(): boolean {
    return this.fundingAlertStatuses.includes(this.cardData.fundingStatus || "");
  }
  public get isFundingAlertError(): boolean {
    return this.cardData.fundingStatus === Statuses.Delinquent.value;
  }

  public get cspKey(): string {
    return this.cardData.csp?.toLowerCase() as string;
  }

  public getCSPConsoleURL(): string {
    return this.cardData.csp ? cspConsoleURLs[this.cardData.csp] : "";
  }

  public portfolioCardMenuItems: MeatballMenuItem[] = [];

  public async cardMenuClick(menuItem: MeatballMenuItem): Promise<void> {
    await PortfolioStore.setCurrentPortfolio(this.cardData);
    switch(menuItem.action) {
    case this.menuActions.viewFundingTracker:
      await AppSections.setActiveTabIndex(0);
      AppSections.changeActiveSection(AppSections.sectionTitles.PortfolioSummary);
      break; 
    case this.menuActions.viewTaskOrders: 
      await AppSections.setActiveTabIndex(1);
      AppSections.changeActiveSection(AppSections.sectionTitles.PortfolioSummary);
      break; 
    case this.menuActions.leavePortfolio: 
      this.showLeavePortfolioModal = true;
      break; 
    case this.menuActions.emailManagers: {
      const managerEmails = await this.managerEmails;
      const mailStr = "mailto:" + managerEmails + "?cc=" + this.currentUserEmail;
      window.open(mailStr, "_blank");
      break; 
    }
    case this.menuActions.loginToCSP: {
      if (menuItem.url) {
        window.open(menuItem.url, "_blank");
      }
      break; 
    }
    default:
      break; 
    }
  }

  public get statusChipBgColor(): string {
    const status = this.cardData.status?.toLowerCase() === Statuses.Processing.value.toLowerCase()
      ? this.cardData.status
      : this.cardData.fundingAlertChipString;
    return getStatusChipBgColor(status ? status : "");
  }

  public leavePortfolio(): void {
    this.$emit("leavePortfolio", this.cardData.sys_id);
  }

  public CSPs = {
    aws: {
      title: "Amazon Web Services",
      img: {
        name:"aws",
        width:"40",
        height:"24"
      }
    },
    azure: {
      title: "Azure",
      img: {
        name:"azure",
        width:"40",
        height:"31",
      }
    },
    gcp: {
      title: "Google Cloud",
      img: {
        name:"gcp",
        width:"40",
        height:"39"
      }
    },
    oracle: {
      title: "Oracle Cloud",
      img: {
        name:"oracle",
        width:"40",
        height:"25"
      }
    },
  }

  public async loadOnEnter(): Promise<void> {
    if (this.cardData.fundingStatus && this.cardData.fundingStatus !== Statuses.OnTrack.value) {
      switch(this.cardData.fundingStatus) {
      case Statuses.AtRisk.value:
      case Statuses.FundingAtRisk.value:
        this.cardData.fundingAlertChipString = Statuses.AtRisk.label;
        break;
      case Statuses.ExpiringSoon.value:
        this.cardData.fundingAlertChipString = Statuses.ExpiringSoon.label;
        break;
      default:
        this.cardData.fundingAlertChipString = toTitleCase(this.cardData.fundingStatus || "")
      }
    }

    this.portfolioCardMenuItems = [
      { 
        title: "View funding tracker",
        action: this.menuActions.viewFundingTracker
      },
      { 
        title: "View task orders",
        action: this.menuActions.viewTaskOrders
      },
    ]; 

    if (this.isHaCCAdmin) {
      this.portfolioCardMenuItems.push(
        { 
          title: "Email portfolio managers",
          action: this.menuActions.emailManagers,
        },    
      );
    }

    // future ticket - when have data from backend, only include the menu
    // option below if user is 1) a viewer, or 2) is manager and at least
    // one other manager exists for this portfolio. 
    // NOTE: Do not show for HaCC admin. Included currently for testing.
    this.portfolioCardMenuItems.push(
      { 
        title: "Leave this portfolio",
        action: this.menuActions.leavePortfolio
      },
    );

    if (this.cardData.status?.toLowerCase() !== Statuses.Processing.value.toLowerCase()) {
      this.portfolioCardMenuItems.push(
        { 
          title: "Login to the CSP console",
          action: this.menuActions.loginToCSP,
          icon: {
            name: "launch",
            width: "15",
            height: "15",
            color: "primary",
          },
          url: this.getCSPConsoleURL(), 
          separatorBefore: true,
        }
      );
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}

</script>

