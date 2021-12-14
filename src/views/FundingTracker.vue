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
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import LineChart from "@/components/Charts/ATATLineChart.vue"

@Component({
  components: {
    "line-chart": LineChart,
  }
})

export default class FundingTracker extends Vue {
private chartData = {
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
  public chartOptions = {
    plugins: {
      legend: {
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
}
</script>
