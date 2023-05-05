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
                            {{ getCurrencyString(averageMonthlySpend, false) }}
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
                    <p class="font-size-14">
                      Select one of more agencies to compare spend rates across
                      DoD services and agencies. The data includes funds spent
                      on all JWCC portfolios to date.
                    </p>
                    <LineChart
                      chartId="AgencySpendLineChart"
                      ref="agencySpendLineChart"
                      :chartData="agencySpendLineChartData"
                      :chartOptions="lineChartOptions"
                      :dataset-to-toggle="datasetToToggle"
                      :toggle-dataset="toggleDataset"
                      :tooltipHeaderData="agencySpendChartTooltipHeaderData"
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
                          ml-10
                        "
                      >
                        <span
                          v-for="(idiqClin, index) in agencySpendLineChartData.datasets"
                          :key="index"
                        >
                          <v-checkbox
                            v-if="index < agencySpendLineChartData.datasets.length - 1"
                            v-model="agencyChecked[index + 1]"
                            :label="agencyLabels[index]"
                            :class="'color_chart_' + (index + 1)"
                            hide-details="true"
                            :ripple="false"
                            @change="doToggleDataset(index + 1)"
                            :color="chartDataColors[index]"
                          />
                        </span>

                      </v-radio-group>
                    </div>
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
                      :individualAmtsArr="cspObj"
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
                            :style="'background-color: ' + chartDataColorSequence[index]"
                          >
                          </span>
                          <strong>{{ label }}</strong>
                        </div>
                        <div class="pr-4 py-2 font-weight-400">
                          {{ getCurrencyString(
                          cspAmounts[index], false
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
                    <v-row class="px-15">
                      <v-col class="col-sm-6 ml-n1 pl-2 pr-10">
                        <DonutChart
                          chart-id="OrganizationDonutChart"
                          :chart-data="organizationDonutChartData"
                          :use-chart-data-labels="true"
                          :chart-options="organizationDonutChartOptions"
                          :centerText1="abbreviateCurrencyFormatter(fundsSpentToDate)"
                          center-text2="Total Funds Spent"
                          :amount="fundsSpentToDate"
                          :individualAmtsArr="agencyObj"
                        />
                      </v-col>
                      <v-col class="d-flex align-center mr-13 pr-15">
                        <div class="width-100 mt-4">
                          <div
                            v-for="(label, index) in organizationDonutChartData.labels"
                            :key="index"
                            class="d-flex justify-space-between font-size-14"
                          >
                            <div style="flex: 1" class="pr-4 py-2 d-flex align-center">
                          <span
                            class="_legend-square"
                            :style="'background-color: ' + organizationDonutChartColors[index]"
                          >
                          </span>
                              <strong>{{ label }}</strong>
                            </div>
                            <div class=" py-2 font-weight-400">
                              {{getCurrencyString(agencyAmounts[index],false)}}
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
/*eslint prefer-const: 1 */
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";
import BarChart from "../components/charts/BarChart.vue";
import ATATCharts from "@/store/charts";
import LineChart from "../components/charts/LineChart.vue";
import ATATTooltip from "../components/ATATTooltip.vue"

import { DashboardService } from "@/services/dashboards";
import { CostsDTO, CostGroupDTO } from "@/api/models";
import { lineChartData, lineChartDataSet } from "types/Global";

import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import _ from 'lodash';
import { getIdText } from "@/helpers";
import DonutChart from "../components/charts/DonutChart.vue"
import { getCurrencyString, getLegendAmount, roundDecimal, roundTo100 } from "@/helpers";

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    ATATTooltip,
    BarChart,
    LineChart,
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

  public fundsSpentByAgency: { name: string;  total: number; }[] = [];
  public agencySpendData: Record<string, number[]> = {}
  private agencySpendLineChartData: lineChartData = {
    labels: [],
    datasets: [],
  };

  public disaKey = "DEFENSE INFORMATION SYSTEMS AGENCY (DISA)";
  public agencyLabelKeys: Record<string, string> = {
    "U.S. AIR FORCE": "Air Force",
    "U.S. ARMY": "Army",
    "U.S. MARINE CORPS": "Marine Corps",
    "U.S. NAVY": "Navy",
    "UNITED STATES SPACE FORCE": "Space Force",
    [this.disaKey]: "Other",
  };
  public agencyLabels: string[] = [];
  public agencyChecked: boolean[] = [];

  public datasetToToggle: number | null = null;
  public toggleDataset = false;

  private doToggleDataset(datasetIndex: number) {
    this.datasetToToggle = datasetIndex;
    this.toggleDataset = !this.toggleDataset;
  }

  public agencySpendChartTooltipHeaderData: Record<string, string> = {}

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

  public fundsSpentByCSP: { name: string;  total: number; }[] = [];
  public cspLabels: string[] = []
  public cspAmounts: number[] = []
  public getLegendAmount = getLegendAmount;
  public roundDecimal = roundDecimal;
  public getCurrencyString = getCurrencyString;

  public async calculateSpendRateLineChartData(): Promise<void> {
    const agencies = this.fundsSpentByAgency.map(a => a.name);

    // loop thru costGroups and sum up each month's costs by agency
    // add them to previous month value for current month total
    agencies.forEach((agency: string, i: number) => {
      this.agencyChecked.push(true);
      const agencyLabel = this.agencyLabelKeys[agency];
      this.agencyLabels.push(agencyLabel);

      const agencyMonthlySpendTotals: number[] = [0];

      this.costGroups.forEach((costGroup, index) => {
        // last costGroup is projected costs. do not use for line chart data
        if (index !== this.costGroups.length - 1) {
          const thisAgencyCosts = costGroup.costs.filter((obj: CostsDTO) => {
            return obj["agency.title"] === agency;
          });
          const monthTotal = thisAgencyCosts.reduce((a, obj: CostsDTO) => {
            const amt = obj.value ? parseInt(obj.value) : 0;
            return a + amt;
          }, 0);
          const total = monthTotal + agencyMonthlySpendTotals[index];
          agencyMonthlySpendTotals.push(total);
        }
      });

      this.agencySpendData[agency] = agencyMonthlySpendTotals;
      //eslint-disable-next-line prefer-const 
      let lineChartDataSet = _.clone(this.lineChartCommonDataSet);
      const color = this.chartDataColorSequence[i];
      const dataSetProps = {
        dataSetId: agency,
        label: agencyLabel,
        data: agencyMonthlySpendTotals,
        borderColor: color,
        pointBackgroundColor: color,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: this.chartDataColorsTranslucent[i]
      }
      Object.assign(lineChartDataSet, dataSetProps);
      this.agencySpendLineChartData.datasets?.push(lineChartDataSet);
    }, this);

    this.agencyChecked.unshift(false); // never show total line on chart
    const spendLineChartTotals: number[] = [0];
    this.costGroups.forEach((costGroup, i) => {
      if (i !== this.costGroups.length - 1) {
        const currMonthAmt = costGroup.totalActual;
        const prevMonthAmt = spendLineChartTotals[i];
        const monthTotal = currMonthAmt + prevMonthAmt;
        spendLineChartTotals.push(monthTotal);
      }
    });
    //eslint-disable-next-line prefer-const 
    let totalLineChartDataSet = _.clone(this.lineChartCommonDataSet);
    const dataSetProps = {
      dataSetId: "Total",
      label: "Total JWCC funds spent",
      data: spendLineChartTotals,
      borderColor: "transparent",
      pointBackgroundColor: "transparent",
      pointHoverBackgroundColor: "transparent",
      pointHoverBorderColor: "transparent"
    }
    Object.assign(totalLineChartDataSet, dataSetProps)
    this.agencySpendLineChartData.datasets?.unshift(totalLineChartDataSet)

    const lineChartXLabels = []; // x labels are months. Jan gets year.
    // for MVP, PoP will always be Jan to Dec of current year.
    // labels will be Jan of current year to Jan of next year.
    const periodStart = new Date(this.currentYear + "-01-01T00:00:00");
    const monthNo = periodStart.getMonth();
    let januaryCount = 0;
    for (let i = monthNo; i < monthNo + 13; i++) {
      let monthAbbr = i <= 11
        ? this.monthAbbreviations[i]
        : this.monthAbbreviations[12 - i];
      if (monthAbbr === "Jan") {
        monthAbbr = januaryCount === 0
          ? monthAbbr + " " + this.currentYear
          : monthAbbr + " " + (this.currentYear + 1);
        januaryCount++;
      }
      lineChartXLabels.push(monthAbbr);
    }
    this.agencySpendLineChartData.labels = lineChartXLabels;

    this.agencySpendChartTooltipHeaderData = {
      title: "Total JWCC funds spent",
      amount: this.getCurrencyString(this.fundsSpentToDate),
      legend: "Funds spent by DoD organization",
    };

    return;
  }

  public async loadOnEnter(): Promise<void> {

    const data = await this.dashboardService.getTotals([
      '9999999999999',
      '1234567891234',
      '1000000001234',
      '1000000004321',
      '1000000009999',
      '1000000009876',
      '1000000008888',
      '1000000008765',
    ]);

    console.log ({data});

    this.activeTaskOrderCount = data.activeTaskOrders;
    this.totalObligatedFunds = data.totalObligatedFunds;
    this.totalTaskOrderValue = data.totalTaskOrderValue;
    this.fundsSpentToDate = data.fundsSpentToDate;
    this.costs = data.costs;
    this.costGroups = data.costGroups;

    this.fundsSpentByAgency = data.fundsSpentByAgency;
    const spendByAgency = Object.values(this.fundsSpentByAgency);

    // DISA/Fourth Estate should always be last in array
    const disaIndex = spendByAgency.findIndex(o => o.name.toString() === this.disaKey);
    const disaObj = spendByAgency.find(o => o.name.toString() === this.disaKey);
    spendByAgency.splice(disaIndex, 1);
    spendByAgency.sort((a, b) => a.name > b.name ? 1 : -1);
    if (disaObj) {
      spendByAgency.push(disaObj);
    }
    this.fundsSpentByAgency = spendByAgency;
    this.fundsSpentByAgency.forEach((agency)=>{
      this.agencyNames.push(this.agencyLabelKeys[agency.name as string])
      this.agencyAmounts.push(agency.total)
      this.agencyObj[this.agencyLabelKeys[agency.name as string]] = agency.total;
    })
    this.organizationDonutData = this.organizationDonutChartPercent()
    this.organizationDonutChartData.datasets[0].data = this.organizationDonutData
    await this.setMonthlySpendSummaryBarChartData();

    this.fundsSpentByCSP = Object.values(data.fundsSpentByCSP);
    this.fundsSpentByCSP.forEach((csp) => {
      this.cspLabels.push((csp.name as string).replace("_"," "))
      this.cspAmounts.push(csp.total)
      this.cspObj[(csp.name as string).replace("_", " ")] = csp.total;
    }
    );

    this.cspDonutData = this.cspDonutChartPercentages();

    this.cspDonutChartData.datasets[0].data = this.cspDonutData;

    // for MVP, period start will always be Jan 1 of current year
    const periodStart = new Date(this.currentYear + "-01-01T00:00:00");
    this.monthsIntoPeriod = differenceInCalendarMonths(this.today, periodStart);
    this.averageMonthlySpend = Math.round(this.fundsSpentToDate / this.monthsIntoPeriod);

    await this.calculateSpendRateLineChartData();
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
        data: [0, 0],
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
    aspectRatio: 1.2,
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
          stepSize: 100000,
          callback: function (value: number): string {
            return "$" + Math.round(value / 1000) + "k";
          },
        },
      },
    }
  }

  public lineChartCommonDataSet: lineChartDataSet = {
    dataSetId: "",
    label: "",
    data: [],
    spanGaps: true,
    fill: false,
    borderColor: this.chartDataColorSequence[0],
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: this.chartDataColorSequence[0],
    pointHoverBackgroundColor: this.chartDataColorSequence[0],
    pointHoverRadius: 4,
    pointBorderWidth: 0,
    pointHoverBorderWidth: 12,
    pointHoverBorderColor: this.chartDataColorsTranslucent[0],
    lineTension: 0,
  }

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
          lineWidth: 3,
          tickWidth: 0,
          color: "transparent",
        },
        ticks: {
          maxTicksLimit: 7,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
        max: 500000,
        grid: {
          borderColor: "transparent",
          tickWidth: 0,
        },
        ticks: {
          stepSize: 100000,
          callback: function (value: number): string {
            return "$" + Math.round(value / 1000) + "k";
          },
        },
      },
    }
  }

  public agencyObj: {[key:string]:number} = {}
  public agencyNames: string[] = [];
  public agencyAmounts: number[] = [];
  public organizationDonutData: number[] = [];
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
    this.chartDataColorSequence[2],
    this.chartDataColorSequence[3],
    this.chartDataColorSequence[4],
    this.chartDataColorSequence[5],
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
      (amount) => amount / this.fundsSpentToDate * 100
    );
    const roundedPercentages = roundTo100(percentages)
    return roundedPercentages
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

  public cspObj: {[key:string]:number} = {}
  public cspDonutData: number[] = []
  public cspDonutChartPercentages(): number[] {
    const percentages = this.cspAmounts.map(
      (amount) => amount / this.fundsSpentToDate * 100
    );
    const roundedPercentages = roundTo100(percentages)
    return roundedPercentages
  }

  public cspDonutChartData = {
    labels: this.cspLabels,
    datasets: [
      {
        label: "Funding Status",
        data: this.cspDonutData,
        backgroundColor: this.chartDataColorSequence,
        hoverBackgroundColor: this.chartDataColorSequence,
        hoverBorderColor: this.chartDataColorSequence,
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
