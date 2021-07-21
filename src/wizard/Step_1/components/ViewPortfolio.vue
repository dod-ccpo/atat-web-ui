<template>
  <div class="view-portfolio body-lg">
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
      <v-col offset="1">
        <v-card width="30rem" class="v-card mt-5 flex-nowrap">
          <div class="d-flex flex-nowrap align-center">
            <v-card-title class="portfolio-name h3 font-weight-bold pb-0 col-11"
              >Portfolio ></v-card-title
            >
            <div class="draft d-flex align-center ml-auto">draft</div>
          </div>
          <div>
            <v-card-subtitle class="body pt-0">
              This Portfolio will be used to build,test and manage the native
              applications for the defense logistics agency.
            </v-card-subtitle>
          </div>
          <div class="info-container mb-5">
            <div class="d-flex portfolio-info pa-0 ml-5">
              <v-card-text class="body pa-0 ml-3"
                >Portfolio Managers</v-card-text
              >
              <v-card-text class="body col-1 pa-0 mr-2">2</v-card-text>
            </div>
            <div class="d-flex portfolio-info pa-0 ml-5">
              <v-card-text class="body pa-0 ml-3">Applications</v-card-text>
              <v-card-text class="body col-1 pa-0 mr-2">1</v-card-text>
            </div>
            <div class="d-flex portfolio-info pa-0 ml-5">
              <v-card-text class="body pa-0 ml-3">Environments</v-card-text>
              <v-card-text class="body col-1 pa-0 mr-2">3</v-card-text>
            </div>
            <div class="d-flex portfolio-info pa-0 ml-5">
              <v-card-text class="body pa-0 ml-3">Task Orders</v-card-text>
              <v-card-text class="body col-1 pa-0 mr-2">4</v-card-text>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="">
            <v-card-actions class="d-flex justify-space-between">
              <a class="h6 text-decoration-underline mt-1 mx-1" href="#"
                >Open</a
              >
              <a class="h6 text-decoration-underline mt-1 mx-1" href="#"
                >Delete</a
              >
            </v-card-actions>
          </div>
        </v-card>
        <v-card v-for="portfolio in portfolios" :key="portfolio.id">
          <pre> {{ portfolio }} </pre>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Portfolios } from "../../../../types/Portfolios";

@Component({})
export default class ViewPortfolio extends Vue {
  get portfolios(): Portfolios {
    return this.$store.getters.getAllPortfolios;
  }
}
</script>
