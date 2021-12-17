<template>
  <v-container
    fluid
    class="main-content-wrapper body-lg portfolio-summary-wrapper"
  >
    <v-row>
      <v-col cols="6">
        <h2 class="mb-0">Overview</h2>
      </v-col>
      <v-col cols="6" class="text-right text--base-dark">
        Last Sync: Nov. 15, 0100
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-md-6 col-lg-8">
        <v-card class="no-shadow v-sheet--outlined height-100">
          <h3 class="mb-0 pb-6">Portfolio Details</h3>
          <div class="d-flex flex-wrap align-stretch">
            <div
              class="bg-accent-cool-lightest px-6 py-6 mr-5"
              style="border-radius: 4px; width: 270px"
            >
              <span class="h1 mb-0">$147,469.04</span>
              <p class="font-weight-bold body-lg mb-0 pb-5">Available Funds</p>
              <p class="mb-0 pb-2">
                Your remaining portfolio balance from all of your active task
                orders
              </p>
            </div>
            <div class="pb-4">
              <p class="text--base-darkest pt-4 mb-0">Total Portfolio Funds</p>
              <span class="h2 mb-0">$200,000.00</span>
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
        <v-card class="no-shadow v-sheet--outlined height-100">
          <h3 class="mb-2">Funding Status</h3>
          <donut-chart
            chart-id="DonutChart1"
            :chart-data="arcGuageChartData"
            :chart-options="arcGuageChartOptions"
            :is-arc-gauge="true"
            center-text1="74%"
            center-text2="Funds Spent"
            aria-label="Chart displaying 74% Funds Spent"
          />
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
    <v-row>
      <v-col>
        <ATATAlert type="info" :closeButton="true">
          <template v-slot:content>
            <strong>NOTE:</strong> All financial data depicted are estimates to
            assist with tracking cloud spend. Login to your CSP console to get
            detailed cost analyses and breakdowns.
            <a role="button">Learn more</a>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="no-shadow v-sheet--outlined">
          <h3>Actual and Projected Burn Rate</h3>
          <p class="text--base-dark">
            Track your rate of spend and available funds throughout the current
            period of performance. Forecasted future costs are based on
            historical trends and show approximately when you are projected to
            exceed your portfolio’s budget.
          </p>
          <v-row class="mb-0">
            <v-col>Funds available</v-col>
            <v-col class="text-right">
              Current Period: Jan. 1, 2021–Dec. 31, 2021
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
                v-model="totalCLINs_checked"
                label="Total of All CLINs"
                hide-details="true"
                :ripple="false"
                class="color_chart_1"
                @change="doToggleDataset(0)"
              ></v-checkbox>

              <!-- EJY stubbed, to add back in future ticket -->
              <!-- <v-checkbox
                label="Unclassified XaaS"
                v-model="unclassifiedXaaS_checked"
                hide-details="true"
                :ripple="false"
                class="color_chart_2"
                @change="doToggleDataset(2)"
              ></v-checkbox>

              <v-checkbox
                label="Unclassified Cloud Support Package"
                v-model="unclassifiedCloudSupportPackage_checked"
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
    <v-row>
      <v-col>
        <v-card class="no-shadow v-sheet--outlined">
          <h3>Spend Summary for Cloud Resources</h3>
          <p class="text--base-dark">
            View a breakdown of how much you spend on resources tied to your
            Unclassified Anything as a Service (XaaS) contract line item. Use
            forecasts to see how much you are projected to spend to ensure your
            portfolio is funded appropriately.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="no-shadow v-sheet--outlined">
          <h3>Breakdown of Actual and Estimated Spend</h3>
          <p class="text--base-dark">
            The chart below shows the proportion of funds spent and funds
            estimated to be invoiced this month compared to the total funds
            available in this portfolio. The data includes money spent on all
            active task orders during this period of performance.
          </p>
          <v-row>
            <v-col class="col-sm-12 col-md-6 col-lg-5 ml-n6">
              <donut-chart
                chart-id="DonutChart2"
                :chart-data="donutChartData"
                :chart-options="donutChartOptions"
                :use-chart-data-labels="true"
                center-text1="$1,200,000"
                center-text2="Total Portfolio Funds"
              />
            </v-col>
            <v-col class="col-sm-12 col-md-6 col-lg-7">
              <div class="d-flex height-100 align-center">
                <div>
                  <table class="width-100 chart-legend-table">
                    <thead class="hidden-table-headers">
                      <tr>
                        <th>Funds Type</th>
                        <th>Amount</th>
                        <th>Percentage of Total Portfolio Funds</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="d-flex align-center pr-4">
                          <span
                            class="chart-legend-square"
                            :class="'bg-chart_color' + 1"
                          >
                          </span>
                          <strong>Funds spent</strong>
                        </td>
                        <td class="text-right pr-4">$147,469.04</td>
                        <td class="text-right font-weight-bold">73.7%</td>
                      </tr>
                      <tr>
                        <td class="d-flex align-center pr-4 nowrap">
                          <span
                            class="chart-legend-square"
                            :class="'bg-chart_color' + 2"
                          >
                          </span>
                          <strong>Funds awaiting invoice</strong>
                        </td>
                        <td class="text-right pr-4">$8,452.48</td>
                        <td class="text-right font-weight-bold">4.2%</td>
                      </tr>
                      <tr>
                        <td class="d-flex align-center pr-4">
                          <span class="chart-legend-square bg-chart_gray"></span>
                          <strong>Funds remaining</strong>
                        </td>
                        <td class="text-right pr-4">$44,078.48</td>
                        <td class="text-right font-weight-bold">22%</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="py-2"><v-divider /></td>
                      </tr>
                      <tr>
                        <td><strong>Total Portfolio Funds</strong></td>
                        <td class="text-right pr-4">$200,000.00</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import LineChart from "@/components/Charts/LineChart.vue";
import DonutChart from "@/components/Charts/DonutChart.vue";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert,
    "donut-chart": DonutChart,
    "line-chart": LineChart,
  },
})
export default class FundingTracker extends Vue {
  public chartDataColors = this.$store.getters.getChartDataColors;
  public chartDataColorSequence = this.$store.getters.getChartDataColorSequence;
  public chartAuxColors = this.$store.getters.getChartAuxColors;

  public totalCLINs_checked = true;
  public unclassifiedXaaS_checked = true;
  public unclassifiedCloudSupportPackage_checked = false;

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
      // { // stubbed second dataset to be added in future ticket
      //   label: "Unclassified XaaS",
      //   data: [190, 180, 175, 120, 100, null, null, null],
      //   fill: false,
      //   borderColor: this.chartDataColorSequence[1],
      //   borderWidth: 2,
      //   pointRadius: 3,
      //   pointBackgroundColor: this.chartDataColorSequence[1],
      //   pointHoverBackgroundColor: "#FFFFFF",
      //   pointBorderWidth: 2,
      //   pointHoverBorderWidth: 2,
      //   lineTension: 0,
      // },
      // {
      //   label: "Unclassified XaaS Projected Burn",
      //   spanGaps: true,
      //   data: [
      //     null,
      //     null,
      //     null,
      //     null,
      //     100,
      //     null,
      //     null,
      //     null,
      //     null,
      //     null,
      //     null,
      //     null,
      //     0,
      //   ],
      //   fill: false,
      //   borderWidth: 2,
      //   borderColor: this.chartDataColorSequence[1],
      //   borderDash: [6, 4],
      //   pointRadius: 0,
      // },
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

  public arcGuageChartData = {
    labels: ["Funds spent", "Funds remaining"],
    datasets: [
      {
        label: "Funding Status",
        data: [74, 26],
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

  public donutChartColors = [
    this.chartDataColorSequence[0],
    this.chartDataColorSequence[1],
    this.chartDataColors.gray,
  ];

  public donutChartData = {
    labels: ["Funds spent", "Funds awaiting invoice", "Funds remaining"],
    datasets: [
      {
        label: "Funding Status",
        data: [73.7, 4.2, 22],
        backgroundColor: this.donutChartColors,
        hoverBackgroundColor: this.donutChartColors,
        hoverBorderColor: this.donutChartColors,
        hoverBorderRadius: 0,
        hoverOffset: 10,
        hoverBorderWidth: 0,
        cutout: "67%",
      },
    ],
  };

  public donutChartOptions = {
    layout: {
      padding: 20,
    },
    aspectRatio: 1.25,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#000",
        align: "end",
        anchor: "end",
        offset: 10,
        formatter: function (value: number): string {
          return value ? value + "%" : "";
        },
      },
    },
  };
}
</script>
