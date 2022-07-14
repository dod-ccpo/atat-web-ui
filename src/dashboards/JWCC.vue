<template>
  <v-main class="_dashboard _jwcc bg-base-lightest">
    <ATATPageHead headline="JWCC Dashboard" />
    <v-container class="max-width-1200 bg-base-lightest">
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
                    <v-row>
                      <v-col>
                        <div
                          class="bg-primary-lighter px-6 py-6 mb-8"
                          style="border-radius: 4px;"
                        >
                          <span id="AvailableFunds" class="h1 mb-1 d-block">
                            {{ getCurrencyString(fundsSpentToDate, false) }}
                          </span>
                          <p class="h3 mb-0 pb-1">JWCC funds spent to date</p>
                          <p class="mb-0 font-size-14">
                            Across all organizations, task orders, and portfolios
                          </p>
                        </div>

                        <div class="d-flex justify-space-between mb-5">
                          <div class="d-flex align-center">
                            Active task orders
                          </div>
                          <div class="font-weight-700">
                            {{ activeTaskOrderCount }}
                          </div>
                        </div>

                        <div class="d-flex justify-space-between mb-5">
                          <div class="d-flex align-flex-start">
                            <span class="d-inline-block">
                              Total obligated funds
                            </span>
                            <ATATTooltip
                              :tooltipText="totalObligatedFundsTooltipText"
                              buttonStyle="margin-top: 2px"
                              buttonClass="ml-1"
                            />
                          </div>
                          <div class="font-weight-700">
                            {{ getCurrencyString(totalObligatedFunds, false) }}
                          </div>
                        </div>

                        <div class="d-flex justify-space-between mb-5">
                          <div class="d-flex align-flex-start">
                            <span class="d-inline-block">
                              Total value of JWCC<br />
                              task orders
                            </span>
                            <ATATTooltip
                              :tooltipText="totalValueJWCCTooltipText"
                              buttonStyle="margin-top: 2px"
                              buttonClass="ml-1"
                            />
                          </div>
                          <div class="font-weight-700">
                            {{ getCurrencyString(totalTaskOrderValue, false) }}
                          </div>
                        </div>

                        <div class="d-flex justify-space-between">
                          <div class="d-flex align-flex-start">
                            <span class="d-inline-block">
                              Average monthly spend
                            </span>
                            <ATATTooltip
                              :tooltipText="avgMonthlySpendTooltipText"
                              buttonStyle="margin-top: 2px"
                              buttonClass="ml-1"
                            />
                          </div>
                          <div class="font-weight-700">
                            {{ getCurrencyString(averageMonthlySpend) }}
                          </div>
                        </div>

                      </v-col>
                    </v-row>                    
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
import ATATTooltip from "../components/ATATTooltip.vue"

import { DashboardService } from "@/services/dashboards";
import { toCurrencyString } from "@/helpers";
import { CostsDTO, CostGroupDTO } from "@/api/models";
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    BarChart,
    ATATTooltip,
  }
})

export default class JWCCDashboard extends Vue {
  dashboardService: DashboardService = new DashboardService();

  public chartDataColors = ATATCharts.chartDataColors;
  public chartDataColorSequence = ATATCharts.chartDataColorSequence;
  public chartDataColorsTranslucent = this.chartDataColorSequence.map((color) => {
    return color + "33";
  });
  public chartAuxColors = ATATCharts.chartAuxColors;
  public monthAbbreviations = ATATCharts.monthAbbreviations;
  public monthsNotAbbreviated = ATATCharts.monthsNotAbbreviated;

  public activeTaskOrderCount = 0;
  
  public costs: CostsDTO[] = [];
  public costGroups: CostGroupDTO[] = [];

  public totalObligatedFunds = 0;
  public totalTaskOrderValue = 0;
  public averageMonthlySpend = 0;
  public fundsSpentToDate = 0;
  public monthsIntoPeriod = 0; // for MVP, period is always Jan 1 to Dec 31
  public currentMonthYearStr = "";
  public prevMonthYearStr = "";

  public today = new Date(new Date().setHours(0,0,0,0));
  public currentYear = this.today.getFullYear();

  public getMonthYearString(monthIndex: number, year: number): string {
    let monthAbbr = this.monthAbbreviations[monthIndex];
    monthAbbr = this.monthsNotAbbreviated.indexOf(monthAbbr) > -1 
      ? monthAbbr : monthAbbr + "."; 
    return monthAbbr + " " + year;

  }

  public async setMonthlySpendSummaryBarChartData(): Promise<void> {
    const thisMonthIndex = this.today.getMonth();
    this.currentMonthYearStr = this.getMonthYearString(thisMonthIndex, this.currentYear);
    let prevMonthIndex = thisMonthIndex - 1;
    let prevMonthsYear = this.currentYear;
    if (prevMonthIndex < 0) {
      prevMonthIndex = 11;
      prevMonthsYear = prevMonthsYear - 1;
    };
    this.prevMonthYearStr = this.getMonthYearString(prevMonthIndex, prevMonthsYear);

    this.barChartMonthlySpendData.labels = [
      ["Last Month", "(" + this.prevMonthYearStr + ")"],
      ["End-of-month Forecast", "(" + this.currentMonthYearStr + ")"],
    ];
    const len = this.costGroups.length;
    const prevMonthSpend = this.costGroups[len - 2].totalActual;
    const projectedSpend = this.costGroups[len - 1].totalProjected;
    const chartData = [prevMonthSpend, projectedSpend];
    this.barChartMonthlySpendData.datasets[0].data = chartData;

    // future ticket will make more dynamic based on data
    const largestVal = Math.max(...chartData);
    const max = Math.ceil((largestVal + 25000) / 25000) * 25000;
    this.barChartMonthlySpendOptions.scales.y.max = max;

  }

  public async loadOnEnter(): Promise<void> {
    const data = await this.dashboardService.getTotals(['1000000001234', '1000000009999']);
    console.log({data});
    this.activeTaskOrderCount = data.activeTaskOrders;
    this.totalObligatedFunds = data.totalObligatedFunds;
    this.totalTaskOrderValue = data.totalTaskOrderValue;
    this.fundsSpentToDate = data.fundsSpentToDate;
    this.costs = data.costs;
    this.costGroups = data.costGroups;
   
    await this.setMonthlySpendSummaryBarChartData();

    // for MVP, period start will always be Jan 1 of current year
    const periodStart = new Date(this.currentYear + "-01-01T00:00:00");
    this.monthsIntoPeriod = differenceInCalendarMonths(this.today, periodStart);
    this.averageMonthlySpend = Math.round(this.fundsSpentToDate / this.monthsIntoPeriod);

  }

  public async mounted(): Promise<void>{
    await this.loadOnEnter();
  }

  public getCurrencyString(value: number, decimals?: boolean): string {
    return "$" + toCurrencyString(value, decimals);
  }


  public barChartMonthlySpendData = {
    labels: [["Last Month","(April 2022)"], ["End-of-month Forecast", "(May 2022)"]],
    datasets: [
      {
        barPercentage: 0.5,
        barThickness: 150,
        maxBarThickness: 150,
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
        max: 0,
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

  public totalObligatedFundsTooltipText = `This is the legal amount allocated by the 
    government to fund all task orders awarded under JWCC. This is a portion of the 
    total value of JWCC task orders.`;
  public totalValueJWCCTooltipText = `This is the total amount of money requested for 
    all task orders awarded under JWCC to date. It includes obligated funds that 
    have been allocated to portfolios, as well as non-obligated funds that could 
    potentially be exercised in option periods.`;
  public avgMonthlySpendTooltipText = `Average amount that is spent and invoiced 
    each month on all JWCC task orders`;

}

</script>
