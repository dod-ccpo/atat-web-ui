<template>
  <v-container class="main-content-wrapper body-lg">
    <v-row>
      <v-col>
        <h1>Funding tracker stub</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-8">
        <line-chart
          chart-id="LineChart1"
          :chart-data="lineChartData"
          :chart-options="lineChartOptions"
        />
      </v-col>
      <v-col class="col-sm-4">
        <donut-chart
          chart-id="DonutChart1"
          :chart-data="arcGuageChartData"
          :chart-options="arcGuageChartOptions"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-sm-7">
        <donut-chart
          chart-id="DonutChart2"
          :chart-data="donutChartData"
          :chart-options="donutChartOptions"
          :use-chart-data-labels="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import LineChart from "@/components/Charts/LineChart.vue";
import DonutChart from "@/components/Charts/DonutChart.vue";

@Component({
  components: {
    "line-chart": LineChart,
    "donut-chart": DonutChart,
  }
})

export default class FundingTracker extends Vue {
  // public mounted() {
  // }

  private lineChartData = {
    labels: ["Sept", "Oct", "Nov", "Dec", "Jan 2022", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept"],
    datasets: [
      {
        label: "Total for all CLINs Actual Spend",
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
        data: [null, null, null, null, 160, null, null, null, null, null, null, null, 0],
        fill: false,
        borderWidth: 2,
        borderColor: "#00BDE3",
        borderDash: [5,5],
        pointRadius: 0,
      },
      {
        label: "Unclassified XaaS Actual Spend",
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
        data: [null, null, null, null, 100, null, null, null, null, null, null, null, 0],
        fill: false,
        borderWidth: 2,
        borderColor: "#5942D2",
        borderDash: [5,5],
        pointRadius: 0,
      }
    ]
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
            borderColor: "rgba(255,255,255,0)",
            lineWidth: 3,
            tickWidth: 0,
            color: "rgba(255,255,255,0)",
        },
        ticks: {
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0,
        }
      },
      y: {
        suggestedMax: 250,
        grid: {
          borderColor: "rgba(255,255,255,0)",
          tickWidth: 0,
        },
        ticks: {
          callback: function(value: number) {
            return "$" + value + "k";
          }
        }
      }
    }
  };
  public arcGuageChartData = {
    labels: [
      "Funds spent",
      "Funds remaining"
    ],
    datasets: [{
      label: "Funding Status",
      data: [75, 25],
      backgroundColor: [
        "#005EA2",
        "#C9C9C9",
      ],
      // hoverBorderColor: [
      //   "black",
      //   "rgba(0,0,0,0)",
      // ],
      hoverOffset: 0,
      hoverBorderWidth: 0,
      circumference: 180,
      rotation: -90,
      cutout: "80%",
    }],
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
    elements: {
      arc: {
        borderWidth: 2,
      }
    },
    hover: {
      mode: null,
    }


  };

  public donutChartData = {
    labels: [
      "Funds spent",
      "Funds awaiting invoice",
      "Funds remaining",
    ],
    datasets: [{
      label: "Funding Status",
      data: [73.7, 4.2, 22],
      backgroundColor: [
        "#00BDE3",
        "#5942D2",
        "#DFE1E2",
      ],
      hoverBackgroundColor: [
        "#00BDE3",
        "#5942D2",
        "#DFE1E2",
      ],
      hoverBorderColor: [
        "#00BDE3",
        "#5942D2",
        "#DFE1E2",
      ],
      hoverBorderRadius: 0,
      hoverOffset: 10,
      hoverBorderWidth: 0,
      cutout: "67%",
    }],
  }
  public donutChartOptions = {
    layout: {
      padding: 20
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
        formatter: function(value, context) {
          return value ? value + "%" : "";
        }
      }
    }

  };
}
</script>
