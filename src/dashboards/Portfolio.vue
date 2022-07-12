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
                      :chart-data="burnChartData"
                      :chart-options="lineChartOptions"
                      :dataset-to-toggle="datasetToToggle"
                      :toggle-dataset="toggleDataset"
                      :tooltipHeaderData="tooltipHeaderData"
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
                          v-model="checked[0]"
                          label="Total of All CLINs"
                          hide-details="true"
                          :ripple="false"
                          class="color_chart_1"
                          @change="doToggleDataset(0)"
                          :color="chartDataColors[0]"
                        ></v-checkbox>

                        <v-checkbox
                          v-for="(idiqClin, index) in idiqClins"
                          :key="index"
                          v-model="checked[index + 1]"
                          :label="idiqClins[index].idiq_clin_label"
                          :class="'color_chart_' + (index + 2)"
                          hide-details="true"
                          :ripple="false"
                          @change="doToggleDataset((index + 1) * 2)"
                          :color="chartDataColors[index + 1]"
                        />

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
                  <v-card class="no-shadow v-sheet--outlined pa-8 pb-2">
                    <h3>Breakdown of Actual and Estimated Spend</h3>
                    <p class="font-size-14">
                      The chart below shows the proportion of funds spent and 
                      funds estimated to be invoiced compared to the total funds 
                      available in this portfolio. The data includes money spent 
                      on all active task orders during this period of performance.
                    </p>
                    <v-row>
                      <v-col class="col-sm-6 ml-n6">
                        <donut-chart
                          chart-id="SpendDonutChart"
                          :chart-data="donutChartData"
                          :chart-options="donutChartOptions"
                          :use-chart-data-labels="true"
                          :center-text1="'$' + totalPortfolioFundsStr.slice(0, -3)"
                          center-text2="Total Portfolio Funds"
                          :amount="totalPortfolioFunds"
                        />
                      </v-col>
                      <v-col class="col-sm-6 d-flex align-center">
                        <div class="width-100">
                          <div
                            v-for="(label, index) in donutChartData.labels"
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
                            <div class="pr-4 py-2">
                              {{ getLegendAmount(index) }}
                            </div>
                            <div style="width: 50px;" class="text-right font-weight-700 py-2">
                              {{ donutChartData.datasets[0].data[index] }}%
                            </div>
                          </div>  

                          <hr style="margin: 8px 0;" />
                          <div class="d-flex justify-space-between font-size-14">
                            <div style="flex: 1" class="pr-4 py-2 d-flex align-center">
                              <strong class="d-inline-block mr-1 mb-2">
                                Total Portfolio Funds
                              </strong>
                              <ATATTooltip 
                                :tooltipText="spendingTooltipText"
                                id="SpendingTooltip"
                              />

                            </div>
                            <div class="pr-4 py-2 font-weight-700">
                              ${{ totalPortfolioFundsStr }}
                            </div>
                            <div style="width: 50px;">
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
import { PortfolioDashBoardService } from "../services/portfolioDashBoard";

import ATATFooter from "../components/ATATFooter.vue";
import ATATPageHead from "../components/ATATPageHead.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"
import DonutChart from "../components/charts/DonutChart.vue";
import LineChart from "../components/charts/LineChart.vue";

import ATATCharts from "@/store/charts";
import AcquisitionPackage from "@/store/acquisitionPackage";
import TaskOrder from "@/store/taskOrder";
import { toCurrencyString } from "@/helpers";
import { CostsDTO, TaskOrderDTO, ClinDTO } from "@/api/models";

import { add } from "date-fns";
import parseISO from "date-fns/parseISO";
import formatISO from "date-fns/formatISO"
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';
import { lineChartData, lineChartDataSet } from "types/Global";
import { getIdText } from "@/helpers";
import _ from 'lodash';

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    ATATTooltip,
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
  public idiqClins: ClinDTO[] = [];

  public chartDataColors = ATATCharts.chartDataColors;
  public chartDataColorSequence = ATATCharts.chartDataColorSequence;
  public chartDataColorsTranslucent = this.chartDataColorSequence.map((color) => {
    return color + "33";
  });

  public chartAuxColors = ATATCharts.chartAuxColors;
  public monthAbbreviations = ATATCharts.monthAbbreviations;
  
  public burnChartXLabels: string[] = [];
  public burnChartYMax = 0;
  public burnChartYStepSize = 0;
  public burnChartYLabelSuffix = "k";
  public tooltipHeaderData: Record<string, string> = {}

  public currentMonthEstimatedSpend = 0;
  public currentMonthEstimatedSpendStr = "";
  public currentMonthEstimatedSpendPercent = 0;
  public estimatedRemainingPercent = 0;

  public async calculateFundsSpent(): Promise<void> {
    this.costs.forEach((cost) => {
      this.fundsSpent = this.fundsSpent + parseFloat(cost.value);
    });
  }

  public createDateStr(dateStr: string, period: boolean): string {
    const parsedDate = parseISO(dateStr, { additionalDigits: 1 })
    const date = new Date(parsedDate.setHours(0,0,0,0));
    const m = this.monthAbbreviations[date.getMonth()];
    const y = date.getFullYear();
    const d = date.getUTCDate();
    const neverPeriodMonths = ["March", "April", "May", "June", "July"];
    const noPeriodMonth = neverPeriodMonths.indexOf(m) !== -1;
    const p = period && !noPeriodMonth ? "." : "";
    return m + p + " " + d + ", " + y;
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
    this.runOutOfFundsDate = this.createDateStr(runOutISODate, true);
  }

  public donutChartPercentages: number[] = [];

  public calculateBurnDown(): void {
    const uniqueDates = [...new Set(this.costs.map(cost => cost.year_month))].sort();
    const uniqueCostClins = [...new Set(this.costs.map(cost => cost.clin))].sort();
    const uniqueIdiqClins = [...new Set(this.idiqClins.map(clin => clin.idiq_clin))].sort();
    
    let clinCosts: Record<string, Record<string, string>> = {};
    uniqueCostClins.forEach((clinNo) => {
      let clinValues: Record<string, string> = {};
      uniqueDates.forEach((date) => {
        const clin = this.costs.find(cost => cost.clin === clinNo && cost.year_month === date);
        if (clin && clin.is_actual === "true") {
          clinValues[date] = clin.value;
        } else if (clin) {
          this.currentMonthEstimatedSpend += parseFloat(clin.value);
          this.currentMonthEstimatedSpendStr
            = toCurrencyString(this.currentMonthEstimatedSpend);
        }
      });
      clinCosts[clinNo] = clinValues;
    });
    
    this.currentMonthEstimatedSpendPercent 
      = Math.round((Number(
        (this.currentMonthEstimatedSpend / this.totalPortfolioFunds).toFixed(3)) * 100) * 10) / 10;

    this.estimatedRemainingPercent 
      // = 100 - this.currentMonthEstimatedSpendPercent - this.fundsSpentPercent;
      = Math.round((Number(
        (100 - this.currentMonthEstimatedSpendPercent - this.fundsSpentPercent).toFixed(3)))
        * 10) / 10;

    this.donutChartPercentages = [
      this.fundsSpentPercent, 
      this.currentMonthEstimatedSpendPercent,
      this.estimatedRemainingPercent
    ];
    this.donutChartData.datasets[0].data = this.donutChartPercentages;

    const popStartISO = this.taskOrder.pop_start_date;
    const popStartDate = parseISO(popStartISO);
    const periodDatesISO = [popStartISO];
    const periodDates = [popStartDate];

    const popEndISO = this.taskOrder.pop_end_date;
    const popEndDate = parseISO(popEndISO);

    let month = popStartDate;
    let monthsToAdd = differenceInCalendarMonths(popEndDate, popStartDate);

    for (let i = 0; i < monthsToAdd; i++) {
      month = add(popStartDate, { months: i + 1 });
      periodDates.push(month);
      periodDatesISO.push(formatISO(month, { representation: 'date' }));
    }

    const startMonthNo = popStartDate.getMonth();
    const popEndYear = popEndDate.getFullYear();
    let januaryCount = 0;
    for (let i = startMonthNo; i < startMonthNo + monthsToAdd + 2; i++) {
      let monthAbbr = i <= 11 
        ? this.monthAbbreviations[i]
        : this.monthAbbreviations[12 - i];
      if (monthAbbr === "Jan") {
        monthAbbr = januaryCount === 0 
          ? monthAbbr + " " + popEndYear 
          : monthAbbr + " " + (popEndYear + 1);
        januaryCount++;
      }
      this.burnChartXLabels.push(monthAbbr);
    }

    let actualBurn: Record<string, (number | null)[]> = {};
    let projectedBurn: Record<string, (number | null)[]> = {}
    const totalActualBurnData: (number | null)[] = [this.totalPortfolioFunds];
    const totalProjectedBurnData: (number | null)[] = [null];

    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    uniqueIdiqClins.forEach((idiqClinNo) => {
      const thisIdiqClin = this.idiqClins.find(clin => clin.idiq_clin === idiqClinNo);
      if (thisIdiqClin) {
        const costClinNo = thisIdiqClin.clin_number;
        let fundsObligated = thisIdiqClin.funds_obligated;
        let fundsAvailable = !isNaN(parseInt(fundsObligated)) 
          ? parseInt(fundsObligated)
          : 0;

        if (fundsAvailable) {
          const thisclinCosts = clinCosts[costClinNo];
          const actual: (number | null)[] = [parseFloat(thisIdiqClin.funds_obligated)];
          const projected: (number | null)[] = [];

          periodDatesISO.forEach((monthISO, i) => {
            const value = parseFloat(thisclinCosts[monthISO]);
            const thisMonthAmount = !isNaN(value) ? value : null;
            fundsAvailable = thisMonthAmount 
              ? fundsAvailable - thisMonthAmount 
              : fundsAvailable;
            
            const month = (parseISO(monthISO)).getMonth() + 1;
            const isCurrentMonth = month === currentMonth;
            const isActual = month < currentMonth;
            
            const actualVal = isActual ? fundsAvailable : null;
            actual.push(actualVal);

            const projectedVal = isCurrentMonth
              ? fundsAvailable 
              : null;
            projected.push(projectedVal);
            
            const monthTotalActual = totalActualBurnData[i + 1];
            if (!monthTotalActual) {
              totalActualBurnData[i + 1] = actualVal;
            } else if (actualVal) {
              totalActualBurnData[i + 1] = actualVal + monthTotalActual;
            }

            const monthTotalProjected = totalProjectedBurnData[i];
            if (!monthTotalProjected) {
              totalProjectedBurnData[i] = projectedVal;
            } else if (projectedVal) {
              totalProjectedBurnData[i] = projectedVal + monthTotalProjected;
            }
          });

          actualBurn[idiqClinNo] = actual;
          projected.push(0);
          projectedBurn[idiqClinNo] = projected;
        }
      }
    });

    totalProjectedBurnData.push(0);

    this.burnChartData.labels = this.burnChartXLabels;
    this.burnChartData.datasets = [];
    let burnChartDataSets: lineChartDataSet[] = [];

    let clinTotalActualDataSet: lineChartDataSet = this.burnChartActualCommonData;
    const totalActualData = {
      dataSetId: "TotalCLINsActual",
      label: "Total for all CLINs",
      data: totalActualBurnData,
    };
    Object.assign(clinTotalActualDataSet, totalActualData);
    burnChartDataSets.push(clinTotalActualDataSet);
    this.checked.push(true);

    let clinTotalProjectedDataSet: lineChartDataSet = this.burnChartProjectedCommonData;
    const totalProjectedData = {
      dataSetId: "TotalClinsProjected",
      label: "Total for all CLINs Projected",
      data: totalProjectedBurnData,
    };
    Object.assign(clinTotalProjectedDataSet, totalProjectedData);
    burnChartDataSets.push(clinTotalProjectedDataSet);

    uniqueIdiqClins.forEach((idiqClinNo, i) => {
      this.checked.push(true);

      const color = this.chartDataColorSequence[i + 1];
      const clin = this.idiqClins.find(clin => clin.idiq_clin === idiqClinNo);
      if (clin && this.burnChartData.datasets) {
        const clinActualData = {
          label: clin.idiq_clin_label,
          dataSetId: clin.idiq_clin_label 
            ? getIdText(clin.idiq_clin_label + "Actual") 
            : idiqClinNo + "Data",
          data: actualBurn[idiqClinNo],
        };
        let clinActualDataSet = _.clone(this.burnChartActualCommonData);
        clinActualDataSet.borderColor = color;
        clinActualDataSet.pointBackgroundColor = color;
        clinActualDataSet.pointHoverBackgroundColor = color;
        clinActualDataSet.pointHoverBorderColor = this.chartDataColorsTranslucent[i + 1]

        Object.assign(clinActualDataSet, clinActualData);
        burnChartDataSets.push(clinActualDataSet);
        
        const clinProjectedData = {
          label: clin.idiq_clin_label + " Projected",
          dataSetId: clin.idiq_clin_label 
            ? getIdText(clin.idiq_clin_label + "Projected") : idiqClinNo + "DataProjected",
          data: projectedBurn[idiqClinNo],
        };
        let clinProjectedDataSet: lineChartDataSet = _.clone(this.burnChartProjectedCommonData);
        clinProjectedDataSet.borderColor = color;
        clinProjectedDataSet.pointBackgroundColor = color;
        Object.assign(clinProjectedDataSet, clinProjectedData);
        burnChartDataSets.push(clinProjectedDataSet)
      }
    });
    this.burnChartData.datasets = burnChartDataSets;
    return;
  }

  public async calculateTotalFunds(): Promise<void> {
    // total portfolio funds is sum of each IDIQ CLIN's funds obligated
    this.idiqClins.forEach((clin) => {
      this.totalPortfolioFunds = this.totalPortfolioFunds + parseInt(clin.funds_obligated);
    });
    this.totalPortfolioFundsStr = toCurrencyString(this.totalPortfolioFunds);

    this.burnChartYMax = Math.ceil(this.totalPortfolioFunds / 100000) * 100000;
    this.burnChartYStepSize = Math.round(this.burnChartYMax / 6);

    this.lineChartOptions.scales.y.max = this.burnChartYMax;
    this.lineChartOptions.scales.y.ticks.stepSize = this.burnChartYStepSize;
  }

  public async loadOnEnter(): Promise<void> {
    const data = await this.portFolioDashBoardService.getdata('1000000001234');

    this.taskOrder = data.taskOrder
    this.costs = data.costs;
    this.idiqClins = data.clins;
    this.idiqClins.sort((a, b) => (a.idiq_clin > b.idiq_clin) ? 1 : -1);

    await this.calculateTotalFunds();

    this.costs.forEach((cost) => {
      cost.value = (parseInt(cost.value)).toString();
    });

    await this.calculateFundsSpent();
    this.availableFunds = this.totalPortfolioFunds - this.fundsSpent;
    this.availableFundsStr = toCurrencyString(this.availableFunds);

    this.tooltipHeaderData = {
      title: "Total Funds Available",
      amount: this.availableFundsStr,
      legend: "Funds Available",
    };

    this.fundsSpentPercent = Math.round(this.fundsSpent / this.totalPortfolioFunds * 100);
    this.arcGuageChartData.datasets[0].data 
      = [this.fundsSpentPercent, 100 - this.fundsSpentPercent];
    
    this.popStart = this.createDateStr(this.taskOrder.pop_start_date, true);
    this.popEnd = this.createDateStr(this.taskOrder.pop_end_date, true);

    this.calculateTimeToExpiration();

    this.calculateBurnDown();
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
  public checked: boolean[] = [];

  public datasetToToggle: number | null = null;
  public toggleDataset = false;

  private doToggleDataset(datasetIndex: number) {
    this.datasetToToggle = datasetIndex;
    this.toggleDataset = !this.toggleDataset;
  }

  public burnChartActualCommonData = {
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
  };
  public burnChartProjectedCommonData = {
    dataSetId: "",  
    label: "",
    data: [],
    spanGaps: true,
    fill: false,
    borderWidth: 2,
    borderColor: this.chartDataColorSequence[0],
    borderDash: [6, 4],
    pointRadius: 0,
  };

  private burnChartData: lineChartData = {
    labels: [""],
    datasets: [],
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
        max: 0,
        grid: {
          borderColor: "transparent",
          tickWidth: 0,
        },
        ticks: {
          stepSize: 0,
          callback: function (value: number): string {
            return "$" + Math.round(value / 1000) + "k";
          },
        },
      },
    },
  };

  public donutChartColors = [
    this.chartDataColorSequence[0],
    this.chartDataColorSequence[1],
    this.chartDataColors.gray,
  ];

  public donutChartData = {
    labels: [
      "Funds spent", 
      "Estimated funds to be invoiced", 
      "Estimated funds available"
    ],
    datasets: [
      {
        label: "Funding Status",
        data: this.donutChartPercentages,
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

  public getLegendAmount(index: number): string {
    const amount = this.totalPortfolioFunds * this.donutChartData.datasets[0].data[index] / 100;
    let amountStr = "$" + toCurrencyString(amount);
    return amountStr;
  }

  public spendingTooltipText = `This is the total value of all active task 
    orders funding this portfolio`;

}

</script>
