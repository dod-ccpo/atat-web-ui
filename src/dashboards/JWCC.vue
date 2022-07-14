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
                    <h3 class="mb-2">Funds Spent by Cloud Service Provider</h3>
                    <p class="font-weight-400 font-size-14">
                      Compare the total funds spent across each CSP. 
                      The data includes spend on all JWCC portfolios to date.
                    </p>
                    <DonutChart
                      chart-id="CSPSpendingDonutChart"
                      :chart-data="cspDonutChartData"
                      :chart-options="donutChartOptions"
                      :use-chart-data-labels="true"
                      :centerText1="abbreviateCurrencyFormatter(fundsSpentToDate)"
                      centerText2="Total Funds Spent"
                      :amount="fundsSpentToDate"
                    />
                    <div class="width-100 mt-4">
                      <div
                        v-for="(label, index) in cspDonutChartData.labels"
                        :key="index"
                        class="d-flex justify-space-between font-size-14"
                      >
                        <div style="flex: 1" class="pr-4 py-2 d-flex align-center">
                          <span
                            class="_legend-square"
                            :style="'background-color: ' + donutChartColors[index]"
                          >
                          </span>
                          <strong>{{ label }}</strong>
                        </div>
                        <div class="pr-4 py-2 font-weight-400">
                          {{ getLegendAmount(
                              fundsSpentToDate,
                              cspDonutChartData.datasets[0].data[index]
                             )
                          }}
                        </div>
                        <div style="width: 50px;" class="text-right font-weight-700 py-2">
                          {{ roundDecimal(cspDonutChartData.datasets[0].data[index], 0) }}%
                        </div>
                      </div>
                    </div>
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
                    <p class="font-size-14">
                      Compare the total funds spent across each DoD organization. The data includes
                      spend on all JWCC portfolios to date.
                    </p>
                    <v-row>
                      <v-col class="col-sm-6 ml-n6">
                        <donut-chart
                          chart-id="OrganizationDonutChart"
                          :chart-data="organizationDonutChartData"
                          :use-chart-data-labels="true"
                          :chart-options="organizationDonutChartOptions"
                          :centerText1="abbreviateCurrencyFormatter(fundsSpentToDate)"
                          center-text2="Total Portfolio Funds"
                          :amount="fundsSpentToDate"
                        />
                      </v-col>
                      <v-col class="d-flex align-center">
                        <div class="width-100 mt-4">
                          <div
                            v-for="(label, index) in organizationDonutChartData.labels"
                            :key="index"
                            class="d-flex justify-space-between font-size-14"
                          >
                            <div style="flex: 1" class="pr-4 py-2 d-flex align-center">
                          <span
                            class="_legend-square"
                            :style="'background-color: ' + donutChartColors[index]"
                          >
                          </span>
                              <strong>{{ label }}</strong>
                            </div>
                            <div class="pr-4 py-2 font-weight-400">
                              {{ getLegendAmount(
                              fundsSpentToDate,
                              organizationDonutChartData.datasets[0].data[index]
                            )
                              }}
                            </div>
                            <div style="width: 50px;" class="text-right font-weight-700 py-2">
                              {{
                                roundDecimal(organizationDonutChartData.datasets[0].data[index], 0)
                              }}%
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
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
import { CostsDTO, CostGroupDTO } from "@/api/models";
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import DonutChart from "../components/charts/DonutChart.vue"
import { getCurrencyString, getLegendAmount, roundDecimal } from "@/helpers";

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    BarChart,
    ATATTooltip,
    DonutChart,
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
  public cloudServiceDonutChartPercentages: number[] = [];
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

    const largestVal = Math.max(...chartData);
    const max = Math.ceil((largestVal + 25000) / 25000) * 25000;
    this.barChartMonthlySpendOptions.scales.y.max = max;
  }
  
  public fundsSpentByCSP: Record<string, string | number>[] = [];
  public cspLabels: string[] = []
  public cspAmounts: string[] = []
  public getLegendAmount = getLegendAmount;
  public roundDecimal = roundDecimal;
  public getCurrencyString = getCurrencyString;

  public async loadOnEnter(): Promise<void> {
    const data = await this.dashboardService.getTotals(['1000000001234', '1000000009999']);
    this.activeTaskOrderCount = data.activeTaskOrders;
    this.totalObligatedFunds = data.totalObligatedFunds;
    this.totalTaskOrderValue = data.totalTaskOrderValue;
    this.fundsSpentToDate = data.fundsSpentToDate;
    this.costs = data.costs;
    this.costGroups = data.costGroups;
    this.fundsSpentByAgency = Object.values(data.fundsSpentByServiceAgency)
    this.fundsSpentByAgency.forEach((agency)=>{
      this.agencyNames.push(this.agencyLabelFormatter(agency.name as string))
      this.agencyAmounts.push(agency.total as string)
    })
    this.organizationDonutData = this.organizationDonutChartPercent()
    this.organizationDonutChartData.datasets[0].data = this.organizationDonutData
    await this.setMonthlySpendSummaryBarChartData();


    this.fundsSpentByCSP = Object.values(data.fundsSpentByCSP);
    this.fundsSpentByCSP.forEach((csp) =>
      this.cspLabels.push((csp.name as string).replace("_"," "))
    );
    this.fundsSpentByCSP.forEach((csp) => this.cspAmounts.push(csp.total as string));
    this.cspDonutData = this.cspDonutChartPercentages();
    this.cspDonutChartData.datasets[0].data = this.cspDonutData;
    
    const today = new Date(new Date().setHours(0,0,0,0));
    const thisYear = today.getFullYear();
    // for MVP, period start will always be Jan 1 of current year
    const periodStart = new Date(this.currentYear + "-01-01T00:00:00");
    this.monthsIntoPeriod = differenceInCalendarMonths(this.today, periodStart);
    this.averageMonthlySpend = Math.round(this.fundsSpentToDate / this.monthsIntoPeriod);
  }

  public async mounted(): Promise<void>{
    await this.loadOnEnter();
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
    hover: {
      mode: null,
    },
    plugins: {
      tooltip: { enabled: false },
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
  public fundsSpentByAgency: Record<string, string | number>[] = [];
  public agencyNames: string[] = [];
  public agencyAmounts: string[] = [];
  public organizationDonutData: number[] = [];
  public agencyLabelFormatter(str: string):string {
    switch (str) {
    case "US_NAVY":
      return "Navy";
    case "US_ARMY":
      return "Army";
    default:
      return 'name not in function'
    }
  }
  public organizationDonutChartOptions = {
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
          return value ? parseFloat(value.toFixed(1)) + "%" : "";
        },
      },
    },
  };
  public organizationDonutChartColors = [
    this.chartDataColorSequence[0],
    this.chartDataColorSequence[1],
  ];
  public organizationDonutChartData = {
    labels:this.agencyNames,
    datasets: [
      {
        label: "Funding Status",
        data: this.organizationDonutData,
        backgroundColor: this.organizationDonutChartColors,
        hoverBackgroundColor: this.organizationDonutChartColors,
        hoverBorderColor: this.organizationDonutChartColors,
        hoverBorderRadius: 0,
        hoverOffset: 10,
        hoverBorderWidth: 0,
        cutout: "67%",
      },
    ],
  };

  public organizationDonutChartPercent(): number[] {
    const percentages = this.agencyAmounts.map(
      (amount) => (parseFloat(amount) / this.fundsSpentToDate * 100)
    );
    return percentages;
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

  public cspDonutData: number[] = []
  public cspDonutChartPercentages(): number[] {
    const percentages = this.cspAmounts.map(
      (amount) => (parseFloat(amount) / this.fundsSpentToDate * 100)
    );
    return percentages;
  }
  public donutChartColors = [
    this.chartDataColorSequence[0],
    this.chartDataColorSequence[1],
    this.chartDataColorSequence[2],
    this.chartDataColorSequence[3],
  ];

  public cspDonutChartData = {
    labels: this.cspLabels,
    datasets: [
      {
        label: "Funding Status",
        data: this.cspDonutData,
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
          return value ? parseFloat(value.toFixed(0)) + "%" : "";
        },
      },
    },
  };


  // provides abbreviated currency such as $10.4M or $44.2K
  public abbreviateCurrencyFormatter(value: number): string {
    const amountWithNoDecimals = value.toString().split(".")[0]

    // anything less than $40 will show up as 0.0K
    let amountString;
    if (amountWithNoDecimals.length >= 7) {
      const abbreviatedAmountInMillions = (Number(amountWithNoDecimals) / 100000).toFixed(0)
      amountString = "$"
        + abbreviatedAmountInMillions.slice(0, abbreviatedAmountInMillions.length - 1)
        + "." + abbreviatedAmountInMillions.slice(-1)
        + "M"
    } else {
      const abbreviatedAmountInThousands = (Number(amountWithNoDecimals) / 1000).toFixed(1)
      amountString = "$" + abbreviatedAmountInThousands + "K"
    }
    return  amountString
  }
}

</script>
