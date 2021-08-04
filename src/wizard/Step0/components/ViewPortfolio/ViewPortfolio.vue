<template>
  <v-container fluid class="view-portfolio">
    <v-row>
      <v-col cols="12">
        <h1 class="mb-3 h1 font-weight-bold">My Porfolios</h1>
      </v-col>
    </v-row>
    <v-row class="portfolio-banner">
      <v-col class="d-flex justify-space-between align-center">
        <div class="h3">My Portfolios</div>
        <div>
          <v-btn
            id="btn-create-new-portfolio"
            class="primary"
            :ripple="false"
            to="/wizard"
          >
            Create a New Portfolio
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex flex-row">
        <v-card
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
                  portfolio.csp_provisioning_status.toLowerCase() ===
                  'in_progress'
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
              <v-card-text class="body pa-0 ml-3"
                >Portfolio Managers</v-card-text
              >
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
              <a class="h6 text-decoration-underline mt-1 mx-1" href="#"
                >OPEN</a
              >
              <a
                v-if="portfolio.csp_provisioning_status === 'in_progress'"
                class="h6 text-decoration-underline mt-1 mx-1"
                href="#"
                >DELETE</a
              >
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Portfolios } from "types/Portfolios";
@Component({})
export default class ViewPortfolio extends Vue {
  get portfolios(): Portfolios {
    return this.$store.getters.getAllPortfolios;
  }
}
</script>
