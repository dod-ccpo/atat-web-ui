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
                <v-col class="col-sm-6 col-md-8">
                  <v-card 
                    id="PortfolioDetailsCard" 
                    class="no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Portfolio Details</h3>
                    <v-row>
                      <v-col>
                        <div
                          class="bg-info-lighter px-6 py-6"
                          style="border-radius: 4px;"
                        >
                          <span id="AvailableFunds" class="h1 mb-0">${{ availableFundsStr }}</span>
                          <p class="font-weight-bold mb-0 pb-5">Available Funds</p>
                          <p class="mb-0 font-size-14">
                            Your remaining portfolio balance from all of your active task
                            orders
                          </p>
                        </div>
                      </v-col>
                      <v-col>
                        <p class="text--base-darkest pt-1 mb-0">Total Portfolio Funds</p>
                        <span id="TotalPortfolioFunds" class="h2 mb-0">
                          ${{ totalPortfolioFundsStr }}
                        </span>
                        <p class="text--base-dark mb-0 font-size-14">
                          Total value of your active task orders
                        </p>
                        <v-divider class="my-4" />
                        <p class="text--base-darkest mb-0 font-size-14">
                          Current Period of Performance
                        </p>
                        <span id="PoPDates" class="h3 mb-0">
                          {{ popStart }}&ndash;{{ popEnd }}
                        </span>
                        <p class="text--base-dark mb-0 font-size-14">
                          {{ timeToExpiration }} to expiration
                        </p>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col class="col-sm-6 col-md-4">
                  <v-card 
                    id="FundingStatusCard" 
                    class="no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Funding Status</h3>
                    <DonutChart
                      chart-id="FundingStatusArcChart"
                      :chart-data="arcGuageChartData"
                      :chart-options="arcGuageChartOptions"
                      :is-arc-gauge="true"
                      :center-text1="fundsSpentPercent + '%'"
                      center-text2="Funds Spent"
                      :aria-label="'Chart displaying '+ fundsSpentPercent +'% of Funds Spent'"
                    />
                    <v-divider class="my-4" />
                    <p class="mb-0 font-size-14">
                      At your current rate of spending, you will run out of funds by
                      <span class="nowrap font-weight-700">{{ runOutOfFundsDate }}.</span>
                    </p>
                  </v-card>
                </v-col>
              </v-row>



              <v-row id="BurndownChartWrap">
                <v-col>
                  <v-card class="no-shadow v-sheet--outlined pa-8">
                    <h3 class="mb-4">Actual and Projected Burn Rate</h3>
                    <p class="text--base-dark font-size-14">
                      Track your rate of spend and available funds throughout the current
                      period of performance. Forecasted future costs are based on
                      historical trends and show approximately when you are projected to
                      exceed your portfolio’s budget.
                    </p>
                    <v-row class="mb-0">
                      <v-col class="font-size-14">Funds available</v-col>
                      <v-col id="BurnPoPs" class="text-right font-size-14">
                        Current Period: {{ popStart }}&ndash;{{ popEnd }}
                      </v-col>
                    </v-row>
                    <line-chart
                      chart-id="LineChart1"
                      ref="lineChart"
                      :chart-data="lineChartData"
                      :chart-options="lineChartOptions"
                      :dataset-to-toggle="datasetToToggle"
                      :toggle-dataset="toggleDataset"
                    />
                    <div class="d-block text-center">
                      <v-radio-group
                        row
                        class="
                          checkbox-group-row
                          center-checkboxes
                          chart-legend-checkboxes
                          label-small
                          no-messages
                          compact
                          mt-4
                        "
                      >
                        <v-checkbox
                          id="TotalForAllClins_checkbox"
                          v-model="totalCLINsChecked"
                          label="Total of All CLINs"
                          hide-details="true"
                          :ripple="false"
                          class="color_chart_1"
                          @change="doToggleDataset(0)"
                          :color="chartDataColors[0]"
                        ></v-checkbox>

                        <!-- EJY stubbed, to add back in future ticket -->
                        <v-checkbox
                          label="Unclassified XaaS"
                          v-model="unclassifiedXaaSChecked"
                          hide-details="true"
                          :ripple="false"
                          class="color_chart_2"
                          @change="doToggleDataset(2)"
                          :color="chartDataColors[2]"
                        ></v-checkbox>

                        <!-- <v-checkbox
                          label="Unclassified Cloud Support Package"
                          v-model="unclassifiedCloudSupportPackageChecked"
                          hide-details="true"
                          :ripple="false"
                          class="color_chart_3"
                          @change="doToggleDataset(4)"
                        ></v-checkbox> -->
                      </v-radio-group>
                    </div>

                    <div class="bg-base-lightest py-1 px-6 text-center mt-4 font-size-12">
                      NOTE: Solid lines denote actual spend from previous months. Dashed
                      lines denote projected burn for upcoming months.
                    </div>
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

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import {PortfolioDashBoardService} from "@/services/portfolioDashBoard";

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";
import DonutChart from "../components/charts/DonutChart.vue";
import LineChart from "../components/charts/LineChart.vue";


import ATATCharts from "@/store/charts";
import AcquisitionPackage from "@/store/acquisitionPackage";
import TaskOrder from "@/store/taskOrder";
import { toCurrencyString } from "@/helpers";
import { CostsDTO, TaskOrderDTO } from "@/api/models";

import { add } from "date-fns";
import parseISO from "date-fns/parseISO";
import formatISO from "date-fns/formatISO"
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    DonutChart,
    LineChart,
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

  public taskOrder: TaskOrderDTO = TaskOrder.value;
  public costs: CostsDTO[] = [];

  public chartDataColors = ATATCharts.chartDataColors;
  public chartDataColorSequence = ATATCharts.chartDataColorSequence;
  public chartAuxColors = ATATCharts.chartAuxColors;
  public monthAbbreviations = ATATCharts.monthAbbreviations;

  public async calculateFundsSpent(): Promise<void> {
    this.costs.forEach((cost) => {
      this.fundsSpent = this.fundsSpent + parseFloat(cost.value);
    });
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

    this.costs.forEach((cost) => {
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      // NOTE!!! do not use "* 7.5" for actual data - sample data values are very small
      // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      cost.value = (parseInt(cost.value) * 7.5).toString();
    })

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


  public totalCLINsChecked = true;
  public unclassifiedXaaSChecked = true;
  public unclassifiedCloudSupportPackageChecked = false;

  public datasetToToggle: number | null = null;
  public toggleDataset = false;

  private doToggleDataset(datasetIndex: number) {
    this.datasetToToggle = datasetIndex;
    this.toggleDataset = !this.toggleDataset;
  }

  private lineChartData = {
    labels: [
      "Sept",
      "Oct",
      "Nov",
      "Dec",
      "Jan 2022",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
    ],
    datasets: [
      {
        dataSetId: "TotalCLINs",
        label: "Total for all CLINs",
        data: [230, 190, 188, 170, 160, null, null, null],
        fill: false,
        borderColor: this.chartDataColorSequence[0],
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: this.chartDataColorSequence[0],
        pointHoverBackgroundColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        lineTension: 0,
      },
      {
        dataSetId: "TotalCLINs",
        label: "Total for all CLINs Projected Burn",
        spanGaps: true,
        data: [
          null,
          null,
          null,
          null,
          160,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          0,
        ],
        fill: false,
        borderWidth: 2,
        borderColor: this.chartDataColorSequence[0],
        borderDash: [6, 4],
        pointRadius: 0,
      },
      {
        label: "Unclassified XaaS",
        data: [190, 180, 175, 120, 100, null, null, null],
        fill: false,
        borderColor: this.chartDataColorSequence[1],
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: this.chartDataColorSequence[1],
        pointHoverBackgroundColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        lineTension: 0,
      },
      {
        label: "Unclassified XaaS Projected Burn",
        spanGaps: true,
        data: [
          null,
          null,
          null,
          null,
          100,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          0,
        ],
        fill: false,
        borderWidth: 2,
        borderColor: this.chartDataColorSequence[1],
        borderDash: [6, 4],
        pointRadius: 0,
      },
    ],
  };

  public lineChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    animation: {
      duration: 0,
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    aspectRatio: 2.75,
    scales: {
      x: {
        grid: {
          display: true,
          borderDash: [3, 3],
          borderWidth: 2,
          borderColor: this.chartAuxColors["lineChart-axis"],
          lineWidth: function(context: any) {
            return context.tick.label === "Jan 2022" ? 1 : 3;
          },
          tickWidth: 0,
          color: function (context: any) {
            return context.tick.label === "Jan 2022"
              ? "#A9AEB1"
              : "transparent";
          },
        },
        ticks: {
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        stepSize: 50, // needs to be dynamic based on data
        min: 0,
        max: 250, // needs to be dynamic based on data
        grid: {
          borderColor: "transparent",
          tickWidth: 0,
        },
        ticks: {
          callback: function (value: number): string {
            return "$" + value + "k";
          },
        },
      },
    },
  };




}

</script>
