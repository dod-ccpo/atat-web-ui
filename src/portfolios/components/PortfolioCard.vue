<template>
  <v-card
    class="_portfolio-summary-card-wrapper"
    :class="{ '_first': index === 0, '_last': isLastCard }"
    elevation="0"
  >

    <div class="pr-5">
      <div class="_csp-icon-wrap" :data-csp="CSPs[cardData.csp].title">
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
                :name="CSPs[cardData.csp].img.name" 
                :width="CSPs[cardData.csp].img.width" 
                :height="CSPs[cardData.csp].img.height" 
              />
            </span>
          </template>
          <div class="_tooltip-content-wrap">
            {{ CSPs[cardData.csp].title }}
          </div>
        </v-tooltip>
      </div>
    </div>
    <div class="pr-8 flex-grow-1">
      <div class="d-flex">
        <div class="card-header flex-grow-1">
          <a
            id="PortfolioName"
            role="button"
            tabindex="0"
            class="h3 _text-decoration-none d-flex align-center"
            @click="cardMenuClick(portfolioCardMenuItems[0])"
          >
            {{ cardData.title }}
            <ATATSVGIcon 
              v-if="cardData.isManager"
              name="manageAccount"
              width="20"
              height="17"
              color="base"
              class="ml-3"
            />

          </a>
        </div>
        <div v-if="!isActive || cardData.fundingAlertChipString">
          <v-chip
            :id="'StatusChip' + index" 
            :class="[
              '_' + (cardData.status ? cardData.status.toLowerCase() : ''),
              statusChipBgColor
            ]" 
            label
          >
            {{ !isActive ? cardData.status : cardData.fundingAlertChipString }}
          </v-chip>

        </div>
      </div>
      <div class="text-base-dark">
        {{ cardData.agency }}
        <ATATSVGIcon 
          name="bullet" 
          color="base-light" 
          :width="9" 
          :height="9" 
          class="d-inline-block mx-1" 
        />
        {{ cardData.lastModifiedStr }}
      </div>

      <div v-if="isActive && !isHomeView" class="d-flex">

        <div 
          :id="'PoP' + index"
          class="mr-15"  
          :class="[{'_alert' : isPopAlert}, errorClass()]">
          <span class="_data-header">Current Period of Performance</span>
          <span class="_data-primary d-block">
            {{ cardData.currentPoP }}
          </span>
          <span v-if="isPopAlert">
            {{ cardData.expiration }}
          </span>
        </div>

        <div class="mr-15" :id="'TotalObligated' + index">
          <span class="_data-header">Total Obligated</span>
          <span class="_data-primary d-block nowrap">
            {{ cardData.totalObligated }}
          </span>
        </div>

        <div 
          :id="'FundsSpent' + index" 
          class="flex-grow-1" 
          :class="[{'_alert' : isFundingAlert}, errorClass()]"
        >
          <span class="_data-header">Funds Spent (%)</span>
          <span class="_data-primary d-block">
            <span class="mr-1 nowrap">{{ cardData.fundsSpent }}</span>
            <span class="text-base font-size-12 nowrap">
              ({{ cardData.fundsSpentPercent }}%)
            </span>
          </span>
          <div v-if="isFundingAlert">
            {{ cardData.fundsRemaining }}
          </div>
        </div>

      </div>
    </div>

    <ATATMeatballMenu 
      :id="'PortfolioCardMenu' + index"
      :left="true"
      :menuIndex="index"
      :menuItems="portfolioCardMenuItems"
      @menuItemClick="cardMenuClick"
    />

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
import PortfolioData, { cspConsoleURLs } from "@/store/portfolio";
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
    if (this.cardData.fundingStatus) {
      return this.popAlertStatuses.includes(this.cardData.fundingStatus)
    }
    return false;
  }

  public get isFundingAlert(): boolean {
    if (this.cardData.fundingStatus) {
      return this.fundingAlertStatuses.includes(this.cardData.fundingStatus)
    }
    return false;
  }

  public errorClass(): string {
    let alertClass = "";
    const status = this.cardData.fundingStatus;
    if (status && this.redAlertStatuses.includes(status)) {
      alertClass = "_error";
    } 
    return alertClass;
  }

  public getCSPConsoleURL(): string {
    return this.cardData.csp ? cspConsoleURLs[this.cardData.csp] : "";
  }

  public portfolioCardMenuItems: MeatballMenuItem[] = [];

  public async cardMenuClick(menuItem: MeatballMenuItem): Promise<void> {
    await PortfolioData.setCurrentPortfolio(this.cardData);
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
    google: {
      title: "Google Cloud Platform",
      img: {
        name:"gcp",
        width:"40",
        height:"39"
      }
    },
    oracle: {
      title: "Oracle",
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
        this.cardData.fundingAlertChipString = Statuses.AtRisk.label;
        break;
      case Statuses.FundingAtRisk.value:
        this.cardData.fundingAlertChipString = Statuses.FundingAtRisk.label;
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

