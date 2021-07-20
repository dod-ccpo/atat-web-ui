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
        <v-card width="30rem" class="mt-5 flex-nowrap">
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
          <div class="d-flex portfolio-info pa-0 ml-5">
            <v-card-text class="body pa-0 ml-3">portfolio managers</v-card-text>
            <v-card-text class="body col-1 pa-0 mr-2">2</v-card-text>
          </div>
          <v-divider></v-divider>
          <v-card-actions class="d-flex">
            <a class="h6 text-decoration-underline mt-1 mx-1" href="#">Open</a>
            <a class="h6 text-decoration-underline mt-1 mx-1 ml-auto" href="#"
              >Delete</a
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
export interface Portfolio {
  id: string;
  name: string;
  description: string;
  csp_provisioning_status: string;
  dod_component: string[];
  portfolio_managers: string[];
  applications: Application[];
}
export interface Application {
  id: string;
  name: string;
  description: string;
  environments: Environments[];
}
export interface Environments {
  id: string;
  name: string;
  funding_source: string;
}

const donePortfolio: Portfolio = {
  id: "12",
  name: "Defense Logistics Agency",
  description:
    "This Portfolio will be used to build,test and manage the native applications for the defense logistics agency",
  csp_provisioning_status: "complete",
  dod_component: ["Air Force"],
  portfolio_managers: ["joe.manager@example.com"],
  applications: [
    {
      id: "74",
      name: "APPLICATION_NAME",
      description: "APPLICATION_DESCRIPTION",
      environments: [
        {
          id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
          name: "ENVIRONMENT_NAME",
          funding_source: "599948c4-35c1-49ee-a7ab-9190ca2c1a81",
        },
      ],
    },
  ],
};
const draftPortfolio: Portfolio = {
  id: "13",
  name: "Defense  Agency",
  description:
    "This Portfolio will be used to build,test and manage the native applications for the defense logistics agency",
  csp_provisioning_status: "draft",
  dod_component: ["Army"],
  portfolio_managers: ["joe.manager@example.com"],
  applications: [
    {
      id: "75",
      name: "APPLICATION_NAME",
      description: "APPLICATION_DESCRIPTION",
      environments: [
        {
          id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
          name: "ENVIRONMENT_NAME",
          funding_source: "599948c4-35c1-49ee-a7ab-9190ca2c1a81",
        },
      ],
    },
  ],
};

@Component({})
export default class ViewPortfolio extends Vue {}
</script>

<style scoped>
.v-card {
  position: relative;
  border-radius: 0;
}
.portfolio-banner {
  background-color: #f0f0f0;
}
.portfolio-name {
  color: #005ea2;
}
.portfolio-info {
  border-left: solid 4px #73b3e7;
}
.draft {
  color: #ffffff;
  background-color: #00a91c;
  border-radius: 2px;
  font-weight: bold;
  text-transform: uppercase;
  height: 23px;
}
</style>
