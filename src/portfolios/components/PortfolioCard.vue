<template>
  <v-card
    class="_portfolio-summary-card-wrapper width-100 py-5 px-6 d-flex"
    :class="{ '_first': index === 0, '_last': isLastCard }"
    elevation="0"
  >
    <div class="pr-5">
      <div class="logo">{{ cardData.csp }} logo</div>
    </div>
    <div class="pr-5 flex-grow-1">
      <div
        class="d-flex flex-row-reverse flex-md-row flex-column-reverse"
      >
        <div class="card-header flex-grow-1">
          <a
            role="button"
            tabindex="0"
            class="h3 _text-decoration-none"
          >
            {{ cardData.title }}
          </a>
        </div>
        <div
          v-if="cardData.status !== portfolioStatuses.Active"
          class="
            status-alert-banner-wrapper
            ml-md-5
            text-md-right
            mb-2 mb-md-0
          "
        >
          <v-chip 
            :id="'StatusChip' + index" 
            :class="'_' + cardData.status.toLowerCase()" 
            label
          >
            {{ cardData.status }}
          </v-chip>

        </div>
      </div>
      <div class="text-base-dark">
        <span>{{ cardData.branch }}</span>
        <ATATSVGIcon 
          name="bullet" 
          color="base-light" 
          :width="9" 
          :height="9" 
          class="d-inline-block ml-2 mr-3" 
        />
        <span class="nowrap">{{ cardData.lastModified }}</span>
      </div>

      <v-row v-if="cardData.status === portfolioStatuses.Active">

        <v-col class="col-12 col-md-4 col-lg-6">
          <span class="_data-header">Current Period of Performance</span>
          <span class="_data-primary d-block">
            {{ cardData.currentPoP }}
          </span>
        </v-col>

        <v-col class="col-12 col-md-4 col-lg-3 col-xl-2">
          <span class="_data-header">Total Obligated</span>
          <span class="_data-primary d-block nowrap">
            {{ cardData.totalObligated }}
          </span>
        </v-col>
        <v-col class="col-12 col-md-4 col-lg-3">
          <span class="_data-header">Funds Spent (%)</span>
          <span class="_data-primary d-block">
            <span class="mr-1 nowrap">{{ cardData.fundsSpent }}</span>
            <span class="text-base font-size-12 nowrap">
              ({{ cardData.fundsSpentPercent }}%)
            </span>
          </span>
        </v-col>

      </v-row>
    </div>
    <div>
      <!-- <v-menu
        transition="slide-y-transition"
        offset-y
        nudge-left="192"
        nudge-top="1"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :id="moreButtonId(card.id)"
            v-bind="attrs"
            v-on="on"
            class="meatball-menu-button mt-n1 width-auto pa-0"
          >
            <v-icon class="width-auto">more_horiz</v-icon>
          </v-btn>
        </template>
        <v-list class="meatball-menu pa-0">
          <v-list-item
            v-for="(menuOptionText, index) in menuOptions"
            :key="index"
            @click="handleMenuClick(menuOptionText, $event, card)"
          >
            <v-list-item-title class="body-lg py-2">
              {{ menuOptionText }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { PortfolioCardData } from "types/Global";
import PortfolioData, { PortFolioStatusTypes } from "@/store/portfolio";

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

}

</script>

