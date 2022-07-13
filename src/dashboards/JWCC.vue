<template>
  <v-main class="_dashboard bg-base-lightest">
    <ATATPageHead headline="JWCC Dashboard" />
    <v-container class="container-max-width bg-base-lightest">
      <v-row>
        <v-col>
          <div id="app-content">
            <div class="mb-auto" style="padding-bottom: 80px;">

              <v-row>
                <v-col cols="4">
                  <v-card
                    id="SpendingOverviewCard" 
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    Spending overview card
                  </v-card>
                </v-col>
                <v-col cols="8">
                  <v-card
                    id="SpendingOverviewCard" 
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Spend Rate by DoD Organizations</h3>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="7">
                  <v-card
                    id="MonthlySpendSummaryCard" 
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Monthly Spend Summary</h3>
                    <p>
                      Compare total funds spent last month on all JWCC portfolios 
                      against the end-of-month forecast for this month.
                    </p>
                    <BarChart 
                      chartId="MonthlySpendBarChart"
                      :chartData="barChartMonthlySpendData"
                      :chartOptions="barChartMonthlySpendOptions"
                      :useChartDataLabels="true"
                    />

                  </v-card>
                </v-col>
                <v-col cols="5">
                  <v-card
                    id="FundsSpentByCSPCard" 
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Funds Spent by Cloud Service Provider</h3>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-card
                    id="FundsSpentByOrgCard" 
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Funds Spent by Organization</h3>
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

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";
import BarChart from "../components/charts/BarChart.vue";

import ATATCharts from "@/store/charts";

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    BarChart,
  }
})

export default class JWCCDashboard extends Vue {
  public chartDataColors = ATATCharts.chartDataColors;
  public chartDataColorSequence = ATATCharts.chartDataColorSequence;
  public chartDataColorsTranslucent = this.chartDataColorSequence.map((color) => {
    return color + "33";
  });
  public chartAuxColors = ATATCharts.chartAuxColors;

  public barChartMonthlySpendData = {
    labels: [["Last Month","(April 2022)"], ["End-of-month Forecast", "(May 2022)"]],
    datasets: [
      {
        barPercentage: 0.5,
        barThickness: 100,
        maxBarThickness: 100,
        minBarLength: 2,
        data: [83123, 95987],
        backgroundColor: [this.chartDataColorSequence[0], this.chartDataColorSequence[0]],
        datalabels: {
          color: "#161b1e",
          anchor: "end",
          align: "top",
          offset: "6",
          font: {
            family: "Roboto",
            weight: "500",
            size: "14"
          }
        }
      }
    ]
  };

  public barChartMonthlySpendOptions = {
    plugins: {
      legend: { display: false },
      datalabels: {
        formatter: function(value: number): string {
          if (!isNaN(value)) {
            return "$" + value.toLocaleString(
              undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }
            );
          }
          return "";
        }
      }
    },
    animation: { duration: 0 },
    title: {
      display: true,
      text: 'Foo and Bar'
    },
    scales: {
      x: {
        grid: {
          borderWidth: 2,
          borderColor: this.chartAuxColors["lineChart-axis"],
          tickWidth: 0,
          color: "transparent",

        }
      },
      y: {
        min: 0,
        max: 125000,
        grid: {
          borderColor: "transparent",
          tickWidth: 0,
        },
        ticks: {
          stepSize: 25000,
          callback: function (value: number): string {
            return "$" + Math.round(value / 1000) + "k";
          },
        },
      },
    }
  }

}

</script>
