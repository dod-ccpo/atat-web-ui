<template>
  <div>
    hi there
    <!-- <v-card
      width="40rem"
      class="v-card ma-9 ml-0 body"
      v-for="portfolio in portfolios"
      :key="portfolio.id"
    >
      <div class="d-flex flex-nowrap align-center">
        <v-card-title class="portfolio-name h3 font-weight-bold pb-0 col-10"
          >{{ portfolio.name }} >
        </v-card-title>
        <div>
          <v-chip
            v-if="
              portfolio.csp_provisioning_status.toLowerCase() === 'in_progress'
            "
            class="body font-weight-bold pa-2 ml-5 mt-4 rounded-0"
            label
            color="success"
          >
            DRAFT
          </v-chip>
        </div>
      </div>
      <div>
        <v-card-subtitle class="body pt-0">
          {{ portfolio.description }}
        </v-card-subtitle>
      </div>
      <div class="info-container mb-5">
        <div class="d-flex portfolio-info pa-0 ml-5">
          <v-card-text class="body pa-0 ml-3">Portfolio Managers</v-card-text>
          <v-card-text class="body col-1 pa-0 mr-2">{{
            portfolio.portfolio_managers.length
          }}</v-card-text>
        </div>
        <div class="d-flex portfolio-info pa-0 ml-5">
          <v-card-text class="body pa-0 ml-3">Applications</v-card-text>
          <v-card-text class="body col-1 pa-0 mr-2">{{
            portfolio.applications.length
          }}</v-card-text>
        </div>
        <div class="d-flex portfolio-info pa-0 ml-5">
          <v-card-text class="body pa-0 ml-3">Environments</v-card-text>
          <v-card-text class="body col-1 pa-0 mr-2">{{
            portfolio.applications[0].environments.length
          }}</v-card-text>
        </div>
        <div class="d-flex portfolio-info pa-0 ml-5">
          <v-card-text class="body pa-0 ml-3">Task Orders</v-card-text>
          <v-card-text class="body col-1 pa-0 mr-2">{{
            portfolio.applications[0].environments[0].funding_source.length
          }}</v-card-text>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="mb-2">
        <v-card-actions class="d-flex justify-space-between">
          <v-btn x-small class="v-btn link-button mt-1 mx-1 h6">OPEN </v-btn>
          <v-btn
            v-if="portfolio.csp_provisioning_status === 'in_progress'"
            x-small
            class="v-btn link-button mt-1 mx-1 h6"
            href="#"
            >DELETE
          </v-btn>
        </v-card-actions>
      </div>
    </v-card> -->
  </div>
</template>

<script lang="ts">
import {
  ATATSummaryCardItem,
  ATATSummaryCards,
  TaskOrders,
} from "types/Wizard";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { VCard } from "vuetify/lib";

@Component({})
export default class ATATSummaryCard extends VCard {
  @Prop({ default: {}, required: false })
  private cardsData!: TaskOrders["details"];

  private data: ATATSummaryCards = {
    cards: [],
  };

  public transformData(): void {
    this.cardsData.forEach((c) => {
      let totalClinValue = c.clins.reduce((prev, cur) => {
        return prev + cur.total_clin_value;
      }, 0);

      let totalObligatedFunds = c.clins.reduce((prev, cur) => {
        return prev + cur.obligated_funds;
      }, 0);

      let card: ATATSummaryCardItem = {
        title: c.task_order_number,
        items: [
          {
            title: "CLINS",
            prefix: "",
            value: c.clins.length,
          },
          {
            title: "Total Value",
            prefix: "$",
            value: totalClinValue,
          },
          {
            title: "Obligated Funds",
            prefix: "$",
            value: totalObligatedFunds,
          },
        ],
      };
      this.data.cards.push(card);
    });
  }
}
</script>
