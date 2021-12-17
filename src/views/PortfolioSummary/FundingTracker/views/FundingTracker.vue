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
      <v-col class="col-sm-8">
        <v-card class="no-shadow v-sheet--outlined height-100">
          <h3>Portfolio Details</h3>
          <v-row>
            <v-col class="col-sm-5">{ Avl funds area }</v-col>
            <v-col class="col-sm-7">{ Total Portfolio Funds }</v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col class="col-sm-4 height-100">
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
          <line-chart
            chart-id="LineChart1"
            :chart-data="lineChartData"
            :chart-options="lineChartOptions"
          />
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
            <v-col class="col-sm-5 ml-n6">
              <donut-chart
                chart-id="DonutChart2"
                :chart-data="donutChartData"
                :chart-options="donutChartOptions"
                :use-chart-data-labels="true"
                center-text1="$1,200,000"
                center-text2="Total Portfolio Funds"
              />
            </v-col>
            <v-col class="col-sm-7"> { legend } </v-col>
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
        label: "Total for all CLINs",
        data: [230, 190, 188, 170, 160, null, null, null],
        fill: false,
        borderColor: "#00BDE3",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#00BDE3",
        pointHoverBackgroundColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        lineTension: 0,
      },
      {
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
        borderColor: "#00BDE3",
        borderDash: [5, 5],
        pointRadius: 0,
      },
      {
        label: "Unclassified XaaS",
        data: [230, 180, 175, 120, 100, null, null, null],
        fill: false,
        borderColor: "#5942D2",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#5942D2",
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
        borderColor: "#5942D2",
        borderDash: [5, 5],
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
    interaction: {
      mode: "index",
      intersect: false,
    },
    aspectRatio: 2,
    scales: {
      x: {
        grid: {
          display: true,
          borderDash: [4, 4],
          borderRadius: 10,
          borderColor: "transparent",
          lineWidth: function(context: any) {
            return context.tick.label === "Jan 2022" ? 2 : 3;
          },
          tickWidth: 0,
          color: function(context: any) {
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
        suggestedMax: 250,
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
        backgroundColor: ["#005EA2", "#C9C9C9"],
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

  public donutChartData = {
    labels: ["Funds spent", "Funds awaiting invoice", "Funds remaining"],
    datasets: [
      {
        label: "Funding Status",
        data: [73.7, 4.2, 22],
        backgroundColor: ["#00BDE3", "#5942D2", "#DFE1E2"],
        hoverBackgroundColor: ["#00BDE3", "#5942D2", "#DFE1E2"],
        hoverBorderColor: ["#00BDE3", "#5942D2", "#DFE1E2"],
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
