<template>
  <v-container class="view-portfolio body-lg">
    <v-row>
      <v-col cols="12" offset="1">
        <h1 class="mt-5 mb-3 h1 font-weight-bold">My Porfolios WIP</h1>
      </v-col>
    </v-row>
    <div class="portfolio-banner">
      <v-row class="d-flex">
        <v-col class="h3 font-weight-bold align-self-center" offset="1"
          >My Portfolios</v-col
        >
        <v-col class="d-flex justify-space-around">
          <v-btn class="banner-btn" color="primary" to="#">
            Create New Portfolio</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col class="d-flex flex-row" offset="1">
        <v-card
          width="35rem"
          class="v-card ma-5"
          v-for="portfolio in portfolios"
          :key="portfolio.id"
        >
          <div class="d-flex flex-nowrap align-center">
            <v-card-title class="portfolio-name h3 font-weight-bold pb-0 col-11"
              >{{ portfolio.name }} ></v-card-title
            >
            <div
              v-if="portfolio.csp_provisioning_status === 'in_progress'"
              class="draft d-flex align-center ml-auto"
            >
              draft
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
                >Open</a
              >
              <a
                v-if="portfolio.csp_provisioning_status === 'in_progress'"
                class="h6 text-decoration-underline mt-1 mx-1"
                href="#"
                >Delete</a
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
import {
  Portfolios,
  Portfolio,
  Application,
} from "../../../../types/Portfolios";

@Component({})
export default class ViewPortfolio extends Vue {
  get portfolios(): Portfolios {
    return this.$store.getters.getAllPortfolios;
  }
}
</script>
