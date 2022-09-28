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

    <!-- <v-menu
      :offset-y="true"
      :left="true"
      :id="'PortfolioCardMenu' + index"
      class="_meatball-menu"
      attach
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          :id="'PortfolioCardMenuButton' + index"
          class="_meatball-menu-button"
        >
          <v-icon class="text-base-dark">more_horiz</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, idx) in PortfolioCardMenuItems"
          :key="idx"
          :id="getIdText(item.title) + '_MenuItem' + index"
          :class="[
            { '_separator-before': item.separatorBefore },
            { '_disabled': item.disabled }
          ]"
          @click="cardMenuClick(item.action)"
          :disabled="item.disabled"
        >
          <v-list-item-title>
            {{ item.title }}
            <ATATSVGIcon
              v-if="item.icon"
              :name="item.icon.name"
              :color="item.icon.color"
              :width="item.icon.width"
              :height="item.icon.height"           
            />
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>    -->

    <ATATMeatballMenu 
      id="PortfolioCardMenu"
      :left="true"
      :menuIndex="index"
      :menuItems="portfolioCardMenuItems"
      @menuItemClick="cardMenuClick"
    />

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";


import { MeatballMenuItem, PortfolioCardData } from "types/Global";
import { PortFolioStatusTypes } from "@/store/portfolio";
import { getStatusChipBgColor } from "@/helpers";
import AppSections from "@/store/appSections";
import PortfolioSummary from "@/portfolio/Index.vue";

@Component({
  components: {
    ATATSVGIcon,
    ATATMeatballMenu,
  }
})

export default class PortfolioCard extends Vue {
  @Prop() private cardData!: PortfolioCardData;
  @Prop() private index!: number;
  @Prop() private isLastCard!: boolean;

  public portfolioStatuses = PortFolioStatusTypes;

  public menuActions = {
    viewFundingTracker: "navToFundingTracker",
    viewTaskOrders: "navToTaskOrders",
    leavePortfolio: "leavePortfolio",
    emailManagers: "emailManagers",
    archivePortfolio: "archivePortfolio",
    loginToCSP: "loginToCSP",
  }

  public cspConsoleURLs: Record<string, string> = {
    azure: "https://portal.azure.com/abc123", // EJY need URLs in store somewhere
    aws: "https://signin.amazonaws-us-gov.com",
    google: "https://console.cloud.google.com",
    oracle: "https://console.oraclecloud.com",
  }

  // DUMMY HaCC EMAIL UNTIL ACTUAL DATA FROM BACKEND
  public currentUserEmail = "haac-admin@mail.mil";

  public getCSPConsoleURL(): string {
    return this.cardData.csp ? this.cspConsoleURLs[this.cardData.csp] : "";
  }

  public portfolioCardMenuItems: MeatballMenuItem[] = [];

  public async cardMenuClick(menuItem: MeatballMenuItem): Promise<void> {
    switch(menuItem.action) {
    case this.menuActions.viewFundingTracker:
      await AppSections.setActiveTabIndex(0);
      AppSections.setAppContentComponent(PortfolioSummary);
      debugger;
      break; 
    case this.menuActions.viewTaskOrders: 
      await AppSections.setActiveTabIndex(1);
      AppSections.setAppContentComponent(PortfolioSummary);
      break; 
    case this.menuActions.leavePortfolio: 
      break; 
    case this.menuActions.emailManagers: {
      window.location.href 
        = "mailto:" + this.cardData.managerEmails + "?cc=" + this.currentUserEmail;
      break; 
    }
    case this.menuActions.archivePortfolio:
      break; 
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
      { 
        title: "Leave this portfolio",
        action: this.menuActions.leavePortfolio
      },
      { 
        title: "Email portfolio managers",
        action: this.menuActions.emailManagers,
      },    
      { 
        title: "Archive portfolio",
        action: this.menuActions.archivePortfolio,
        disabled: true,
      },
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
      },
    ];    
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}

</script>

