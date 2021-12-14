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
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import LineChart from "@/components/Charts/ATATLineChart.vue";
import DonutChart from "@/components/Charts/DonutChart.vue";

@Component({
  components: {
    "line-chart": LineChart,
    "donut-chart": DonutChart,
  }
})

export default class FundingTracker extends Vue {
  private lineChartData = {
    labels: ["Sept", "Oct", "Nov", "Dec", "Jan 2022", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept"],
    datasets: [
      {
        label: 'Actual Spend',
        data: [230, 190, 188, 170, 160, null, null, null],
        fill: false,
        borderColor: '#00BDE3',
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderWidth: 2,
        lineTension: 0,
      },
      {
        label: 'Projected Burn',
        spanGaps: true,
        data: [null, null, null, null, 160, null, null, null, null, null, null, null, 0],
        fill: false,
        borderColor: '#00BDE3',
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
      }
    },
    aspectRatio: 2,
    scales: {
      x: {
        grid: {
            display: true,
            borderColor: 'rgba(255,255,255,0)',
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
            return '$' + value + 'K';
          }
        }
      }
    }
  };
  public arcGuageChartData = {
    labels: [
      'Funds spent',
      'Funds remaining'
    ],
    datasets: [{
      label: 'Funding Status',
      data: [75, 25],
      backgroundColor: [
        '#005EA2',
        '#C9C9C9',
      ],
      hoverOffset: 0,
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
      datalabels: {
        display: false,
      }
    }
  };

  public donutChartData = {
    labels: [
      'Funds spent',
      'Funds awaiting invoice',
      'Funds remaining',
    ],
    datasets: [{
      label: 'Funding Status',
      data: [73.7, 4.2, 22],
      backgroundColor: [
        '#00BDE3',
        '#5942D2',
        '#DFE1E2',
      ],
      hoverOffset: 0,
      cutout: "67%",
    }],
  }
  public donutChartOptions = {
    layout: {
      padding: 50
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#000",
        align: "end",
        anchor: "end",
        formatter: function(value, context) {
          return value ? value + "%" : "";
        }
      }
    }

  };
}
</script>
