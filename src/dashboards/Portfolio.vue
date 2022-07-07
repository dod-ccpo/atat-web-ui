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

              <!-- EJY add IDs to everything for testing -->

              <v-row>
                <v-col class="col-md-6 col-lg-8">
                  <v-card class="no-shadow v-sheet--outlined height-100 pa-8">
                    <h3 class="mb-6">Portfolio Details</h3>
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
                        <span class="h3 mb-0">
                          {{ popStart }}&ndash;{{ popEnd }}</span>
                        <p class="text--base-dark mb-0">{{ timeToExpiration }} to expiration</p>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col class="col-md-6 col-lg-4">
                  <v-card class="no-shadow v-sheet--outlined height-100 pa-8">
                    <h3 class="mb-6">Funding Status</h3>
                    <DonutChart
                      chart-id="DonutChart1"
                      :chart-data="arcGuageChartData"
                      :chart-options="arcGuageChartOptions"
                      :is-arc-gauge="true"
                      :center-text1="fundsSpentPercent + '%'"
                      center-text2="Funds Spent"
                      :aria-label="'Chart displaying '+ fundsSpentPercent +'% of Funds Spent'"
                    />
                    <v-divider class="my-4" />
                    <p>
                      At your current rate of spending, you will run out of funds by
                      <span class="nowrap font-weight-700">{{ runOutOfFundsDate }}.</span>
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

import DonutChart from "../components/charts/DonutChart.vue";

import ATATCharts from "@/store/charts";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { toCurrencyString } from "@/helpers";

import { CostsDTO, TaskOrderDTO } from "@/api/models";
import { add } from "date-fns";
import parseISO from "date-fns/parseISO";
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import formatISO from "date-fns/formatISO"

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    DonutChart,
  }
})

export default class PortfolioDashboard extends Vue {

  portFolioDashBoardService: PortfolioDashBoardService = new PortfolioDashBoardService();

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
 
  public popStart = "";
  public popEnd = "";
  public timeToExpiration = "";
  public runOutOfFundsDate = "";

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

  public chartDataColors = ATATCharts.chartDataColors;
  public chartDataColorSequence = ATATCharts.chartDataColorSequence;
  public chartAuxColors = ATATCharts.chartAuxColors;
  public monthAbbreviations = ATATCharts.monthAbbreviations;

  public async calculateFundsSpent(): Promise<void> {
    this.costs.forEach((cost) => {
      this.fundsSpent = this.fundsSpent + parseFloat(cost.value);
    });
    // below for testing only - change value to see run out of funds date and arc chart change
    this.fundsSpent = this.fundsSpent + 100000;
  }

  public createDateStr(dateStr: string): string {
    const parsedDate = parseISO(dateStr, { additionalDigits: 1 })
    const date = new Date(parsedDate.setHours(0,0,0,0));
    const m = this.monthAbbreviations[date.getMonth()];
    const y = date.getFullYear();
    const d = date.getUTCDate()
    return m + " " + d + ", " + y;
  }

  public calculateTimeToExpiration(): void {
    const popEndDate = parseISO(this.taskOrder.pop_end_date, { additionalDigits: 1 })
    const end = new Date(popEndDate.setHours(0,0,0,0));
    const todayDate = new Date();
    const today = new Date(todayDate.setHours(0,0,0,0));

    const daysUntilEndDate = differenceInCalendarDays(end, today);
    const monthsUntilEndDate = differenceInCalendarMonths(end, today);

    const unitsRemaining = daysUntilEndDate <= 90 ? daysUntilEndDate : monthsUntilEndDate;
    const useMonths = daysUntilEndDate > 90;
    const singular = unitsRemaining === 1;

    let timeUnit = useMonths 
      ? singular ? "month" : "months"
      : singular ? "day" : "days";
    this.timeToExpiration = unitsRemaining + " " + timeUnit;

    // calculate when will run out of funds based on current rate of spending
    const popStartDate = parseISO(this.taskOrder.pop_start_date, { additionalDigits: 1 })
    const start = new Date(popStartDate.setHours(0,0,0,0));
    const daysSinceStartDate = differenceInCalendarDays(today, start);
    const dailySpend = this.fundsSpent / daysSinceStartDate;
    const daysUntilAllFundsSpent = Math.round(this.availableFunds / dailySpend); 
    const runOutOfFundsDate = add(today, { days: daysUntilAllFundsSpent});
    const runOutISODate = formatISO(runOutOfFundsDate, { representation: 'date' })
    this.runOutOfFundsDate = this.createDateStr(runOutISODate);
  }


  public async loadOnEnter(): Promise<void> {
    const data = await this.portFolioDashBoardService.getdata('1000000001234');
    
    this.taskOrder = data.taskOrder
    this.totalPortfolioFunds = parseFloat(this.taskOrder.funds_obligated);
    this.totalPortfolioFundsStr = toCurrencyString(this.totalPortfolioFunds);

    this.costs = data.costs;
    await this.calculateFundsSpent();
    this.availableFunds = this.totalPortfolioFunds - this.fundsSpent;
    this.availableFundsStr = toCurrencyString(this.availableFunds);

    this.fundsSpentPercent = Math.round(this.fundsSpent / this.totalPortfolioFunds * 100);
    this.arcGuageChartData.datasets[0].data 
      = [this.fundsSpentPercent, 100 - this.fundsSpentPercent];
    
    this.popStart = this.createDateStr(this.taskOrder.pop_start_date);
    this.popEnd = this.createDateStr(this.taskOrder.pop_end_date);

    this.calculateTimeToExpiration();

  }

  public async mounted(): Promise<void>{
    await this.loadOnEnter();
  }

  public arcGuageChartData = {
    labels: ["Funds spent", "Funds remaining"],
    datasets: [
      {
        label: "Funding Status",
        data: [0, 0],
        backgroundColor: [this.chartDataColors.blue, this.chartDataColors.gray],
        hoverOffset: 0,
        hoverBorderWidth: 0,
        circumference: 180,
        rotation: -90,
        cutout: "80%",
      },
    ],
  };

  public arcGuageChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
    aspectRatio: 2,
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
    hover: {
      mode: null,
    },
  };


}

</script>
