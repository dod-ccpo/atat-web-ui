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

    <v-menu
      :offset-y="true"
      left
      id="MoreMenu"
      class="_meatball-menu"
      attach
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          id="MoreMenuButton"
          class="_meatball-menu-button"
        >
          <v-icon class="text-base-dark">more_horiz</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in moreMenuItems"
          :key="index"
          :id="getIdText(item.title) + '_MenuItem'"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>         

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { PortfolioCardData } from "types/Global";
import PortfolioData, { PortFolioStatusTypes } from "@/store/portfolio";
import { getIdText, getStatusChipBgColor } from "@/helpers";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class PortfolioCard extends Vue {
  @Prop() private cardData!: PortfolioCardData;
  @Prop() private index!: number;
  @Prop() private isLastCard!: boolean;

  public portfolioStatuses = PortFolioStatusTypes;

  public moreMenuItems = [
    { title: "Item 1" },
    { title: "Item 2" },
  ];

  private getIdText(string: string) {
    return getIdText(string);
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

}

</script>

