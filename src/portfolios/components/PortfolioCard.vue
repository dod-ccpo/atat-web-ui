<template>
  <v-card
    class="_portfolio-summary-card-wrapper"
    :class="{ '_first': index === 0, '_last': isLastCard }"
    elevation="0"
  >

    <div class="pr-5">
      <div class="_csp-icon-wrap">
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
            role="button"
            tabindex="0"
            class="h3 _text-decoration-none"
          >
            {{ cardData.title }}
          </a>
        </div>
        <div v-if="cardData.status !== portfolioStatuses.Active">
          <v-chip 
            :id="'StatusChip' + index" 
            :class="[
              '_' + cardData.status.toLowerCase(),
              statusChipBgColor
            ]" 
            label
          >
            {{ cardData.status }}
          </v-chip>

        </div>
      </div>
      <div class="text-base-dark">
        {{ cardData.branch }}
        <ATATSVGIcon 
          name="bullet" 
          color="base-light" 
          :width="9" 
          :height="9" 
          class="d-inline-block mx-1" 
        />
        {{ cardData.lastModified }}
      </div>

      <div v-if="cardData.status === portfolioStatuses.Active" class="d-flex">
        <div class="mr-15">
          <span class="_data-header">Current Period of Performance</span>
          <span class="_data-primary d-block">
            {{ cardData.currentPoP }}
          </span>
        </div>

        <div class="mr-15">
          <span class="_data-header">Total Obligated</span>
          <span class="_data-primary d-block nowrap">
            {{ cardData.totalObligated }}
          </span>
        </div>
        <div class="flex-grow-1">
          <span class="_data-header">Funds Spent (%)</span>
          <span class="_data-primary d-block">
            <span class="mr-1 nowrap">{{ cardData.fundsSpent }}</span>
            <span class="text-base font-size-12 nowrap">
              ({{ cardData.fundsSpentPercent }}%)
            </span>
          </span>
        </div>

      </div>
    </div>

    <ATATMeatballMenu 
      id="PortfolioCardMenu"
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
import { cspConsoleURLs, PortFolioStatusTypes } from "@/store/portfolio";
import { getStatusChipBgColor } from "@/helpers";
import AppSections from "@/store/appSections";
import LeavePortfolioModal from "../portfolio/components/shared/LeavePortfolioModal.vue";

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

  public portfolioStatuses = PortFolioStatusTypes;
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

  public getCSPConsoleURL(): string {
    return this.cardData.csp ? cspConsoleURLs[this.cardData.csp] : "";
  }

  public portfolioCardMenuItems: MeatballMenuItem[] = [];

  public async cardMenuClick(menuItem: MeatballMenuItem): Promise<void> {
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
    return getStatusChipBgColor(this.cardData.status ? this.cardData.status : "");
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

    if (this.cardData.status !== this.portfolioStatuses.Processing) {
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

