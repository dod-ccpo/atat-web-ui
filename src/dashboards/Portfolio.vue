<template>
  <v-main class="_dashboard bg-base-lightest">
    <ATATPageHead :headline="projectTitle"  />
    <v-container class="container-max-width bg-base-lightest">
      <v-row>
        <v-col>

          <div id="app-content" class="d-flex flex-column">
            <div class="mb-auto" style="padding-bottom: 200px;">

              <div class="d-flex justify-space-between width-100 mb-6">
                <h2>Overview</h2>
                <span class="text-base-dark">Last Sync: Nov. 15, 0100</span> 
              </div>

              <v-row>
                <v-col class="col-md-6 col-lg-8">
                  <v-card class="no-shadow v-sheet--outlined height-100 pa-8">
                    <h3 class="mb-0 pb-6">Portfolio Details</h3>
                    <div class="d-flex flex-wrap align-stretch">
                      <div
                        class="bg-info-lighter px-6 py-6 mr-5"
                        style="border-radius: 4px; width: 270px"
                      >
                        <span id="AvailableFunds" class="h1 mb-0">${{ availableFundsStr }}</span>
                        <p class="font-weight-bold body-lg mb-0 pb-5">Available Funds</p>
                        <p class="mb-0 pb-2">
                          Your remaining portfolio balance from all of your active task
                          orders
                        </p>
                      </div>
                      <div class="pb-4">
                        <p class="text--base-darkest pt-4 mb-0">Total Portfolio Funds</p>
                        <span id="TotalPortfolioFunds" class="h2 mb-0">
                          ${{ totalPortfolioFundsStr }}
                        </span>
                        <p class="text--base-dark mb-0">
                          Total value of your active task orders
                        </p>
                        <v-divider class="mb-9 mt-8" />
                        <p class="text--base-darkest mb-0">
                          Current Period of Performance
                        </p>
                        <span class="h3 mb-0">Jan. 1, 2021–Dec. 31, 2021</span>
                        <p class="text--base-dark mb-0">8 months to expiration</p>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col class="col-md-6 col-lg-4">
                  <v-card class="no-shadow v-sheet--outlined height-100 pa-8">
                    <h3 class="mb-2">Funding Status</h3>
                    <!-- <donut-chart
                      chart-id="DonutChart1"
                      :chart-data="arcGuageChartData"
                      :chart-options="arcGuageChartOptions"
                      :is-arc-gauge="true"
                      center-text1="74%"
                      center-text2="Funds Spent"
                      aria-label="Chart displaying 74% Funds Spent"
                    /> -->
                    <v-divider class="my-4" />
                    <p>
                      At your current rate of spending, you will run out of funds by
                      <strong>Sept. 23, 2021.</strong>
                    </p>
                    <!-- EJY button below to be included in future milestone -->
                    <!-- <v-btn class="secondary-btn width-100">Set spending alerts</v-btn> -->
                  </v-card>
                </v-col>
              </v-row>

            </div>
            <ATATFooter/>
          </div>

        </v-col>
      </v-row>
    </v-container>
  </v-main>

</template>

<!-- eslint-disable camelcase -->
<script lang="ts">

import Vue from "vue";
import { Component } from "vue-property-decorator";
import {PortfolioDashBoardService} from "@/services/portfolioDashBoard";

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { toCurrencyString, currencyStringToNumber } from "@/helpers";

import { CostsDTO, TaskOrderDTO } from "@/api/models";

@Component({
  components: {
    ATATFooter,
    ATATPageHead
  }
})

export default class PortfolioDashboard extends Vue {

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  public totalPortfolioFunds = 0;
  public totalPortfolioFundsStr = "";
  public fundsSpent = 0;
  public fundsSpentStr = "";
  public availableFunds = 0;
  public availableFundsStr = "";
  public fundsSpentPercent = 0;
 
  public timeToExpiration = "";
  public runOutOfFundsMonth = "";

  public taskOrder: TaskOrderDTO = {
    clins: "",
    incrementally_funded: "",
    funds_obligated: "",
    acquisition_package: "",
    task_order_number: "",
    task_order_status: "",
    portfolio: "",
    funding_plan: "",
    pop_end_date: "",
    pop_start_date: "",
    funds_total: "",
  }

  public costs: CostsDTO[] = [];

  public async calculateFundsSpent(): Promise<void> {
    this.costs.forEach((cost) => {
      this.fundsSpent = this.fundsSpent + parseFloat(cost.value);
    });
  }

  portFolioDashBoardService: PortfolioDashBoardService = new PortfolioDashBoardService();

  public async mounted(): Promise<void>{
    const data = await this.portFolioDashBoardService.getdata('1000000001234');
    
    // delete console.log
    console.log({data});

    this.taskOrder = data.taskOrder
    this.totalPortfolioFunds = parseFloat(this.taskOrder.funds_obligated);
    this.totalPortfolioFundsStr = toCurrencyString(this.totalPortfolioFunds);

    this.costs = data.costs;
    await this.calculateFundsSpent();
    this.availableFunds = this.totalPortfolioFunds - this.fundsSpent;
    this.availableFundsStr = toCurrencyString(this.availableFunds);
  }

}

</script>
