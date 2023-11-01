<template>
  <div class="_dashboard">
    <v-container class="container-max-width">
      <FinancialDetailsAlert />
      <v-row v-if="showFundingAlert">
        <v-col>
          <showFundingAlert
            :fundingAlertType="fundingAlertType"
            :timeRemaining="daysRemaining"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div id="app-content" class="d-flex flex-column">
            <div class="mb-auto" style="padding-bottom: 80px">
                <div class="width-100 mb-10">
                  <ATATAlert
                    id="ArchivedCallout"
                    v-if="portfolioIsArchived"
                    type="info"
                    class="mb-10"
                  >
                    <template v-slot:content>
                      This portfolio was archived on {{ lastUpdated }}
                    </template>
                  </ATATAlert>
                </div>
              <div class="d-flex justify-space-between width-100 mb-10">
                <h2>Overview</h2>
                <div class="d-flex align-end" v-if="hasSyncDate">
                  <span class="text-base-dark">
                    {{ portfolioSyncDate }}
                  </span>
                  <ATATTooltip 
                    class="mb-4"
                    :tooltipText="syncTooltipText"
                    buttonClass="mb-1 ml-1"
                    id="SyncTooltip"
                  />
                </div>                  
              </div>
              <v-row>
                <v-col class="col-sm-6 col-md-8">
                  <v-card
                    id="PortfolioDetailsCard"
                    class="_no-shadow v-sheet--outlined height-100 pa-8 d-flex flex-column"
                  >
                    <h3 class="mb-6">Portfolio Details</h3>
                    <v-row>
                      <v-col>
                        <div
                          class="bg-primary-lighter px-6 py-6 height-100"
                          style="border-radius: 4px"
                        >
                          <span id="AvailableFunds" class="h1 mb-0">
                            {{ getCurrencyString(availableFunds) }}
                          </span>
                          <p class="font-weight-bold mb-0 pb-5">
                            Available Funds
                          </p>
                          <p class="mb-0 font-size-14">
                            Your remaining portfolio balance from all exercised 
                            contract line item numbers (CLINs) during this 
                            Period of Performance (PoP)
                          </p>
                        </div>
                      </v-col>
                      <v-col>
                        <p class="text-base-darkest pt-1 mb-0">
                          Total Portfolio Funds
                        </p>
                        <span id="TotalPortfolioFunds" class="h2 mb-0">
                          {{ getCurrencyString(totalPortfolioFunds) }}
                        </span>
                        <p class="text-base-dark mb-0 font-size-14">
                          Value of all exercised CLINs in this PoP
                        </p>
                        <v-divider class="my-4" />
                        <p class="text-base-darkest mb-0 font-size-14">
                          Current Period of Performance
                        </p>
                        <span id="PoPDates" class="h3 mb-0">
                          {{ currentPoPStartStr }}&ndash;{{ currentPoPEndStr }}
                        </span>

                        <div 
                          class="d-flex justify-start align-center mb-0 font-size-14"
                          v-if="!hasExpired"
                        >
                          {{ timeToExpiration }}

                          <ATATSVGIcon 
                            v-if="hasTimeSensitiveAlert && !isLoading"
                            name="warning"
                            width="19"
                            height="16"
                            color="warning-dark2"
                            class="ml-2"
                          />
                        </div>

                        <div
                          class="d-flex justify-start align-top atat-text-field-error 
                          text-error mb-0 font-size-14"
                          v-if="hasExpired && !isLoading"
                        >
                          {{ daysPastExpiration() }} days past expiration
                          <ATATSVGIcon
                            style="margin: 2px 0 0 8px"
                            name="exclamationMark"
                            :width="18"
                            :height="18"
                            color="error"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col class="col-sm-6 col-md-4">
                  <v-card
                    id="FundingStatusCard"
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <div
                      id="FundingStatusHeader"
                      class="d-flex justify-space-between"
                    >
                      <div class="mb-6 h3">Funding Status</div>
                      <div v-if="arePoPFundsLow && !arePoPFundsDelinquent">
                        <ATATSVGIcon 
                          name="warning"
                          width="22"
                          height="19"
                          color="warning-dark2"
                          class="ml-2"
                        />
                      </div>
                      <div v-if="arePoPFundsDelinquent">
                        <ATATSVGIcon
                          style="margin: 2px 0 0 8px"
                          name="exclamationMark"
                          :width="18"
                          :height="18"
                          color="error"
                        />
                      </div>
                    </div>
                    <DonutChart
                      chart-id="FundingStatusArcChart"
                      :chart-data="arcGuageChartData"
                      :chart-options="arcGuageChartOptions"
                      :is-arc-gauge="true"
                      :center-text1="fundsSpentPercentForArcChart + '%'"
                      center-text2="Funds Spent"
                      :aria-label="
                        'Chart displaying ' +
                        fundsSpentPercent +
                        '% of Funds Spent'
                      "
                      :show-label-on-hover="false"
                      :isError="arePoPFundsDelinquent || zeroFundsRemaining"
                    />
                    <v-divider class="my-4" />
                    <p v-if="hasExpired && !isLoading" class="mb-0 font-size-14">
                      The PoP has <strong>expired.</strong> You spent 
                      {{ fundsSpentPercentForArcChart }}% of your portfolio’s available funds.
                    </p>
                    <p
                      class="mb-0 font-size-14"
                      v-else-if="(arePoPFundsDelinquent || zeroFundsRemaining) && !isLoading"
                    >
                      You’ve spent
                      <strong>{{ fundsSpentPercentForArcChart }}%</strong>
                      of your portfolio’s funds and there are
                      <strong>{{ daysRemaining }} days remaining</strong>

                      <span v-if="hasObligatedFundsInUpcomingCLIN">
                        until your next PoP.
                      </span>
                      <span v-else>
                        in this PoP.
                      </span>
                    </p>
                    <p class="mb-0 font-size-14" v-else-if="!isLoading">
                      At your current rate of spending, you will run out of funds by
                      <span class="nowrap font-weight-700">{{ runOutOfFundsDate }}</span>
                      <span v-if="isRunOutOfFundsDateFuture">, after the current PoP ends.</span>
                      <span v-else>.</span>
                    </p>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <ATATAlert
                    id="FinancialDetailsAlert"
                    type="info"
                    class="container-max-width my-10"
                  >
                    <template v-slot:content>
                      <p class="mb-0">
                        NOTE: All financial data depicted are estimates to
                        assist with tracking cloud spend. Login to your CSP
                        console to get detailed cost analysis and breakdowns.
                        <a
                          role="button"
                          id="LearnMoreFinancialInfo"
                          tabindex="0"
                          @click="openSlideoutPanel"
                          @keydown.enter="openSlideoutPanel"
                          @keydown.space="openSlideoutPanel"
                        >
                          Learn more
                        </a>
                      </p>
                    </template>
                  </ATATAlert>
                </v-col>
              </v-row>
              <v-row id="BurndownChartWrap" v-if="!isProdEnv">
                <v-col>
                  <v-card class="_no-shadow v-sheet--outlined pa-8">
                    <h3 class="mb-4">Actual and Projected Burn Rate</h3>
                    <p class="text-base-dark font-size-14">
                      Track your rate of spend and available funds throughout the current 
                      PoP. Forecasted future costs are based on historical trends and show 
                      approximately when you are projected to exceed your portfolio’s budget. 
                    </p>
                    <v-row class="mb-0">
                      <v-col class="font-size-14">Funds available</v-col>
                      <v-col id="BurnPoPs" class="text-right font-size-14">
                        Current Period: {{ currentPoPStartStr }}&ndash;{{ currentPoPEndStr }}
                      </v-col>
                    </v-row>
                    <LineChart
                      chart-id="LineChart1"
                      ref="lineChart"
                      :chart-data="burnChartData"
                      :chart-options="lineChartOptions"
                      :dataset-to-toggle="datasetToToggle"
                      :toggle-dataset="toggleDataset"
                      :tooltipHeaderData="tooltipHeaderData"
                      :hasProjected="true"
                    />
                    <div class="d-block text-center">
                      <v-radio-group
                        row
                        class="checkbox-group-row center-checkboxes 
                        chart-legend-checkboxes label-small no-messages compact mt-4"
                      >
                        <v-checkbox
                          id="TotalForAllClins_checkbox"
                          v-model="checked[0]"
                          label="Total of All CLINs"
                          :hide-details="true"
                          :ripple="false"
                          class="color_chart_1"
                          @change="doToggleDataset(0)"
                        ></v-checkbox>

                        <v-checkbox
                          v-for="(idiqClin, index) in idiqClins"
                          :key="index"
                          v-model="checked[index + 1]"
                          :label="idiqClins[index].idiq_clin"
                          :class="'color_chart_' + (index + 2)"
                          :hide-details="true"
                          :ripple="false"
                          @change="doToggleDataset((index + 1) * 2)"
                        />
                      </v-radio-group>
                    </div>

                    <div
                      class="bg-base-lightest py-1 px-6 text-center mt-4 font-size-12"
                    >
                      NOTE: Solid lines denote actual spend from previous
                      months. Dashed lines denote projected burn for upcoming
                      months.
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-card class="_no-shadow v-sheet--outlined pa-8">
                    <h3>Spend Summary</h3>
                    <p class="font-size-14">
                      View a breakdown of how much you spend on cloud resources,
                      tools, and services compared to the
                      <strong>
                        monthly average of
                        {{ getCurrencyString(monthlySpendAverage) }}.
                      </strong>
                      Use forecasts to project upcoming spend and ensure your
                      portfolio is funded appropriately.
                    </p>
                    <v-row>
                      <v-col>
                        <v-card class="bg-base-lightest _no-shadow pa-4 height-100">
                          Last month
                          <span class="h1 d-block my-2">
                            <span v-if="lastMonthSpend">
                              {{ getCurrencyString(lastMonthSpend) }}
                            </span>
                            <span v-else>
                              &ndash;
                            </span>
                          </span>
                          
                          <span v-if="monthsIntoPoP > 1" class="d-flex align-center">
                            <ATATSVGIcon
                              :name="lastMonthTrendIconName"
                              width="20"
                              height="13"
                              class="mr-2"
                              :color="lastMonthTrendIconColor"
                            />
                            <span class="font-size-12 text-base-dark">
                              <span :class="lastMonthTrendTextColor" class="font-weight-700">
                                {{ getSpendPercent(lastMonthSpendTrendPercent) }}%
                              </span>
                              vs monthly average
                            </span>
                          </span>
                        </v-card>
                      </v-col>
                      <v-col>
                        <v-card class="bg-base-lightest _no-shadow pa-4 height-100">
                          End-of-month XaaS forecast
                          <span class="h1 d-block my-2">
                            <span v-if="endOfMonthXaaSForecast">
                              {{ getCurrencyString(endOfMonthXaaSForecast) }}
                            </span>
                            <span v-else>
                              &ndash;                              
                            </span>
                          </span>
                          <span 
                            v-if="showEndOfMonthXaaSTrend" 
                            class="d-flex align-center"
                          >
                            <ATATSVGIcon
                              :name="endOfMonthTrendIconName"
                              width="20"
                              height="13"
                              class="mr-2"
                              :color="endOfMonthTrendIconColor"
                            />
                            <span class="font-size-12 text-base-dark">
                              <span :class="endOfMonthTrendTextColor" class="font-weight-700">
                                {{ getSpendPercent(endOfMonthXaaSForecastTrendPercent) }}%
                              </span>
                              vs monthly XaaS average
                            </span>
                          </span>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-card class="bg-base-lightest _no-shadow pa-4">
                          <div class="d-flex align-center">
                            <span class="d-block mr-1">Period-to-date</span>
                            <ATATTooltip
                              id="PeriodToDateTooltip"
                              :tooltipText="periodToDateTooltipText"
                              label="PeriodToDate"
                            />
                          </div>
                          <span class="h1 d-block mt-2">
                            <span v-if="fundsSpent">
                              {{ getCurrencyString(fundsSpent) }}
                            </span>
                            <span v-else>
                              $0
                            </span>
                          </span>
                        </v-card>
                      </v-col>
                      <v-col>
                        <v-card class="bg-base-lightest _no-shadow pa-4">
                          End-of-period forecast
                          <span class="h1 d-block mt-2">
                            <span v-if="endOfPeriodForecast">
                              {{ getCurrencyString(endOfPeriodForecast) }}
                            </span>
                            <span v-else>
                              {{ getCurrencyString(availableFunds) }}
                            </span>
                          </span>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-card class="_no-shadow v-sheet--outlined pa-8 pb-2">
                    <h3>Breakdown of Actual and Estimated Spend</h3>
                    <p class="font-size-14">
                      The chart below shows the proportion of funds spent and funds estimated to be
                      invoiced compared to the total funds available in this portfolio. The data
                      includes money spent on all exercised CLINs during this PoP.
                    </p>
                    <show-show-funding-alert
                      :fundingAlertType="fundingAlertType"
                      v-if="arePoPFundsDelinquent"
                    />
                    <ATATAlert
                    id="ZeroRemainingFunds"
                    type="error"
                    class="my-5"
                    v-if="zeroFundsRemaining"
                    >
                      <template v-slot:content>
                      <p class="mb-0">
                        You have <span class="font-weight-bold">0%</span> remaining in your
                        portfolio for this period of performance. Add funds to a new or existing
                        task order as soon as possible to continue working with this portfolio.
                      </p>
                    </template>
                  </ATATAlert>
                    <v-row>
                      <v-col class="col-sm-6 ml-n6">
                        <DonutChart
                          chart-id="SpendDonutChart"
                          :chart-data="donutChartData"
                          :chart-options="donutChartOptions"
                          :use-chart-data-labels="true"
                          :center-text1="
                            getCurrencyString(totalPortfolioFunds, false)
                          "
                          center-text2="Total Portfolio Funds"
                          :amount="totalPortfolioFunds"
                          :individualAmtsArr="portfolioFundsObj"
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
                              {{ getCurrencyString(portfolioFundsObj[label], false) }}
                            </div>
                            <div style="width: 50px" class="text-right font-weight-700 py-2">
                              {{ roundDecimal(donutChartData.datasets[0].data[index], 1) }}%
                            </div>
                          </div>

                          <hr style="margin: 8px 0" />
                          <div class="d-flex justify-space-between font-size-14" >
                            <div
                              style="flex: 1"
                              class="pr-4 py-2 d-flex align-center"
                            >
                              <strong class="d-inline-block mr-1">
                                Total Portfolio Funds
                              </strong>
                              <ATATTooltip
                                :tooltipText="spendingTooltipText"
                                id="SpendingTooltip"
                                label="Spending"
                              />
                            </div>
                            <div class="pr-4 py-2 font-weight-700">
                              {{ getCurrencyString(totalPortfolioFunds, false) }}
                            </div>
                            <div style="width: 50px"></div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>

            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component,  Vue, toNative } from "vue-facing-decorator";
import { DashboardService } from "../../services/dashboards";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATFooter from "../../components/ATATFooter.vue";
import ATATPageHead from "../../components/ATATPageHead.vue";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "../../components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import DonutChart from "../../components/charts/DonutChart.vue";
import LineChart from "../../components/charts/LineChart.vue";
import FinancialDetailsAlert from "./FinancialDetailsAlert.vue";
import ATATCharts from "@/store/charts";
import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import PortfolioStore, { FundingAlertTypes } from "@/store/portfolio";
import { createDateStr, getCurrencyString, getIdText, roundTo100 } 
  from "@/helpers";
import { CostsDTO, ClinDTO } from "@/api/models";
import { add, addDays, isAfter, isThisMonth, startOfMonth, 
  subDays, format, differenceInMonths } from "date-fns";
import parseISO from "date-fns/parseISO";
import formatISO from "date-fns/formatISO";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInCalendarMonths from "date-fns/differenceInCalendarMonths";
import {
  lineChartData,
  lineChartDataSet,
  Portfolio,
  PortfolioFundsData,
  SlideoutPanelContent,
} from "types/Global";
import _ from "lodash";
import SlideoutPanel from "@/store/slideoutPanel";
import FinancialDataLearnMore from "@/components/slideOuts/FinancialDataLearnMore.vue";
import FundingAlert from "@/portfolios/portfolio/FundingAlert.vue";


@Component({
  components: {
    ATATAlert,
    ATATFooter,
    ATATPageHead,
    ATATSlideoutPanel,
    ATATSVGIcon,
    ATATTooltip,
    DonutChart,
    LineChart,
    FundingAlert,
    FinancialDetailsAlert
  },
})
class PortfolioDashboard extends Vue {
  dashboardService: DashboardService = new DashboardService();

  public get isProdEnv(): boolean {
    return AcquisitionPackage.isProdEnv ?? AcquisitionPackage.emulateProdNav;
  }

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }
  public isLoading = true;
  public totalPortfolioFunds = 0;
  public fundsSpent = 0;
  public fullMonthsFundsSpent = 0;
  public availableFunds = 0;
  public fundsSpentPercent = 0;
  public fundsSpentPercentForArcChart = 0;
  public zeroFundsRemaining = false;

  public currentPoPStartStr = "";
  public currentPoPStartISO = "";
  public currentPoPEndStr = "";
  public currentPoPEndISO = "";
  public monthsInPoP = 0;

  public timeToExpiration = "";
  public daysUntilEndDate = 0;
  public runOutOfFundsDate = "";
  public isRunOutOfFundsDateFuture = false;
  public monthlySpendAverage = 0;
  public lastMonthSpend = 0;
  public lastMonthSpendTrendPercent = 0;
  public endOfMonthXaaSForecast = 0;
  public endOfMonthXaaSForecastTrendPercent = 0; // for spending summary
  public estimatedFundsToBeInvoiced = 0;
  public estimatedFundsToBeInvoicedPercent = 0; // for donut chart
  public estimatedRemainingPercent = 0;
  public endOfPeriodForecast = 0;
  public monthsIntoPoP = 0;
  public numberOfMonthsRemainingToBeBilled = 0;
  public estimatedFundsAvailable = 0;


  public costs: CostsDTO[] = [];
  public idiqClins: ClinDTO[] = [];
  public idiqClinSpendData: Record<string, Record<string, number>> = {};

  public chartDataColors = ATATCharts.chartDataColors;
  public chartDataColorSequence = ATATCharts.chartDataColorSequence;
  public chartDataColorsTranslucent = this.chartDataColorSequence.map(
    (color) => {
      return color + "33";
    }
  );

  public chartAuxColors = ATATCharts.chartAuxColors;
  public monthAbbreviations = ATATCharts.monthAbbreviations;
  public burnChartXLabels: string[] = [];
  public burnChartYMax = 0;
  public burnChartYStepSize = 0;
  public tooltipHeaderData: Record<string, string> = {};

  public get portfolioStatus(): string {
    return PortfolioStore.currentPortfolio.status as string;
  } 
  public get portfolioIsArchived(): boolean {
    return this.portfolioStatus === "ARCHIVED" ;
  }
  public get hasSyncDate(): boolean {
    return PortfolioStore.currentPortfolio.lastCostDataSync as string !== "";
  }
  public get portfolioSyncDate(): string{
    const syncDate = PortfolioStore.currentPortfolio.lastCostDataSync as string;

    if(syncDate && syncDate !== ""){
      return `Last sync: ${createDateStr(syncDate, true, true, false)}`;
    }

    return "";
  }
  public get lastUpdated(): string {
    if (PortfolioStore.currentPortfolio.lastUpdated) {
      return createDateStr(PortfolioStore.currentPortfolio.lastUpdated, true);
    }
    return "";
  }
  public syncTooltipText = "Cost data is provided by your CSP on a monthly basis."

  public get lastMonthTrendIconName(): string {
    return this.lastMonthSpendTrendPercent > 0 ? 'trendingUp' : 'trendingDown';
  }
  public get lastMonthTrendIconColor(): string {
    return this.lastMonthSpendTrendPercent > 0 ? 'error' : 'success-dark';
  }
  public get lastMonthTrendTextColor(): string {  
    return this.lastMonthSpendTrendPercent > 0 ? 'text-error' : 'text-success-dark';   
  }

  public get endOfMonthTrendIconName(): string {
    return this.endOfMonthXaaSForecastTrendPercent > 0 ? 'trendingUp' : 'trendingDown';
  }
  public get endOfMonthTrendIconColor(): string {
    return this.endOfMonthXaaSForecastTrendPercent > 0 ? 'error' : 'success-dark';  
  }
  public get endOfMonthTrendTextColor(): string {
    return this.endOfMonthXaaSForecastTrendPercent > 0 ? 'text-error' : 'text-success-dark';
  }

  private get hasTimeSensitiveAlert(): boolean {
    return !this.hasObligatedFundsInUpcomingCLIN;
  }
  private get arePoPFundsLow(): boolean {
    return this.fundsSpentPercent >= 75 && this.fundsSpentPercent < 100;
  }
  private get arePoPFundsDelinquent(): boolean {
    return PortfolioStore.currentPortfolio.fundingStatus === Statuses.Delinquent.value;
  }
  private get isExpiringSoon(): boolean {
    return PortfolioStore.currentPortfolio.fundingStatus === Statuses.ExpiringSoon.value; 
  }
  private get hasExpired(): boolean { 
    return PortfolioStore.currentPortfolio.fundingStatus === Statuses.Expired.value;  
  }

  private daysPastExpiration(): number {
    return Math.abs(this.daysUntilEndDate);
  }

  public get showFundingAlert(): boolean {
    return this.fundingAlertType.length > 0;
  }

  public get fundingAlertType(): string {
    if (!this.isLoading) {
      if (this.hasExpired) {
        return FundingAlertTypes.POPExpired;
      } 
      if (this.arePoPFundsDelinquent) {
        return FundingAlertTypes.POPFundsDelinquent;
      }      
      if (this.isExpiringSoon && this.arePoPFundsLow) {
        return FundingAlertTypes.POPExpiresSoonWithLowFunds;
      }
      if (this.isExpiringSoon && this.hasObligatedFundsInUpcomingCLIN) {
        return FundingAlertTypes.POPExpiresSoonWithTOClin;
      }
      if (this.isExpiringSoon && !this.hasObligatedFundsInUpcomingCLIN) {
        return FundingAlertTypes.POPExpiresSoonNoTOClin;
      }
      if (this.arePoPFundsLow) {
        return FundingAlertTypes.POPLowFunds;
      }
      if(this.zeroFundsRemaining){
        return FundingAlertTypes.POPZeroFundsRemaining
      }

    }
    return "";
  }

  public isDateLastMonth(date: Date): boolean {
    return differenceInMonths(new Date(), date) === 1; 
  }

  private get daysRemaining(): number {
    return this.daysUntilEndDate;
  }

  public tableItems: {
    costClinNumber: string;
    clinStatus: string;
    clinLabel: string;
    popStart: string;
    popEnd: string;
    totalFundsSpent: string;
    totalFundsObligated: string;
    lastMonthSpent: string;
    clinAverage: number;
    spendTrend: number;
    idiqClin: string;
  }[] = [];

  public calculateTimeToExpiration(): void {
    const popEndDate = parseISO(this.currentPoPEndISO, {
      additionalDigits: 1,
    });

    const end = new Date(popEndDate.setHours(0, 0, 0, 0));
    const todayDate = new Date();
    const today = new Date(todayDate.setHours(0, 0, 0, 0));

    this.daysUntilEndDate = differenceInCalendarDays(end, today);
    // ATAT TODO AT-9658 - for expired, this should be 0. End-of-month & End-of-period forecast?
    // number of whole months + the current month 
    this.numberOfMonthsRemainingToBeBilled = differenceInCalendarMonths(end, today) + 1;

    const unitsRemaining =
      this.daysUntilEndDate <= 60 ? this.daysUntilEndDate : this.numberOfMonthsRemainingToBeBilled;
    const useMonths = this.daysUntilEndDate > 60;
    const singular = unitsRemaining === 1;
    const timeUnit = useMonths
      ? singular ? "month" : "months"
      : singular ? "day" : "days";
    const untilText = this.hasObligatedFundsInUpcomingCLIN ? "until next period" : "to expiration";
    this.timeToExpiration = unitsRemaining + " " + timeUnit + " " + untilText;

    // calculate when will run out of funds based on current rate of spending
    const popStartDate = parseISO(this.currentPoPStartISO, {
      additionalDigits: 1,
    });
    const start = new Date(popStartDate.setHours(0, 0, 0, 0));
    this.monthsIntoPoP = differenceInCalendarMonths(today, start);
    this.monthsInPoP = differenceInCalendarMonths(end, start)

    let runOutISODate = "";

    if (this.monthsIntoPoP > 0) {
      // get last day of month before this month
      const endOfSpending = subDays(startOfMonth(today), 1);
      const daysInMonthsWithSpend = differenceInCalendarDays(endOfSpending, start);

      if (daysInMonthsWithSpend > 0 && this.fundsSpent) {
        const dailySpend = this.fundsSpent / daysInMonthsWithSpend;

        const daysUntilAllFundsSpent = Math.round(this.availableFunds / dailySpend);
        const runOutOfFundsDate = add(endOfSpending, { days: daysUntilAllFundsSpent });

        this.isRunOutOfFundsDateFuture = isAfter(runOutOfFundsDate, end);
        runOutISODate = formatISO(runOutOfFundsDate, {
          representation: "date",
        });
      } else {
        runOutISODate = formatISO(popEndDate, {
          representation: "date",
        });
      }
    } else {
      runOutISODate = formatISO(popEndDate, {
        representation: "date",
      });
    }
    this.runOutOfFundsDate = createDateStr(runOutISODate, true);

  }

  public donutChartPercentages: number[] = [];

  public calculateBurnDown(): void {
    const uniqueDates = [
      ...new Set(this.costs.map((cost) => cost.year_month)),
    ].sort();
    const uniqueClinNumbersInCostsData = [
      ...new Set(this.costs.map((cost) => cost.clin_number)),
    ].sort();
    const uniqueClinNumbers = [
      ...new Set(this.idiqClins.map((clin) => clin.clin_number)),
    ].sort();
     
    const clinCosts: Record<string, Record<string, string>> = {};
    uniqueClinNumbersInCostsData.forEach((clinNo) => {
      const clinValues: Record<string, string> = {};
      uniqueDates.forEach((date) => {
        const clin = this.costs.find(
          (cost) => cost.clin_number === clinNo && cost.year_month === date
        );
        if (clin?.is_actual) {
          clinValues[date] = clin.value;
        }
      });
      clinCosts[clinNo] = clinValues;
    });

    if (this.fundsSpentPercent === 100) {
      this.estimatedFundsToBeInvoicedPercent = 0;
      this.estimatedRemainingPercent = 0;
      this.zeroFundsRemaining = true;
    } else if (uniqueClinNumbersInCostsData.length && this.endOfMonthXaaSForecast) {
      this.estimatedFundsToBeInvoicedPercent =
        (this.endOfMonthXaaSForecast / this.totalPortfolioFunds) * 100;
      this.estimatedRemainingPercent = this.fundsSpentPercent < 100
        ? 100 - this.fundsSpentPercent - this.estimatedFundsToBeInvoicedPercent
        : 0;
    } else if (uniqueClinNumbersInCostsData.length && this.monthsInPoP) {
      this.estimatedFundsToBeInvoicedPercent = 1 / this.monthsInPoP * 100;
      this.estimatedRemainingPercent = 100 - (
        this.estimatedFundsToBeInvoicedPercent + this.fundsSpentPercent
      );
    }

    if (this.costs.length === 0) {
      this.estimatedRemainingPercent = 100;
      this.estimatedFundsToBeInvoiced = 0;
    }

    this.donutChartPercentages = [
      this.fundsSpentPercent,
      this.estimatedFundsToBeInvoicedPercent,
      this.estimatedRemainingPercent,
    ];

    this.portfolioFundsObj = {
      "Funds spent": this.fundsSpent,
      "Estimated funds to be invoiced": this.estimatedFundsToBeInvoiced,
      "Estimated funds available": this.estimatedFundsAvailable,
    };
    this.donutChartData.datasets[0].data = roundTo100(
      this.donutChartPercentages,
      true
    );

    const popStartDate = parseISO(this.currentPoPStartISO);
    const periodDatesISO = [this.currentPoPStartISO];
    const periodDates = [popStartDate];

    const popEndDate = parseISO(this.currentPoPEndISO);

    let month = popStartDate;
    const monthsToAdd = differenceInCalendarMonths(popEndDate, popStartDate);

    for (let i = 0; i < monthsToAdd; i++) {
      month = add(popStartDate, { months: i + 1 });
      periodDates.push(month);

      periodDatesISO.push(formatISO(month, { representation: "date" }));
    }

    const startMonthNo = popStartDate.getMonth();
    const popStartYear = popStartDate.getFullYear();
    const endMonthNo = popEndDate.getMonth();
    const popEndYear = popEndDate.getFullYear();
    const burnChartEndYear = (periodDatesISO.length > 11 && popStartYear === popEndYear)
      || endMonthNo === 11 ? (popEndYear + 1) : popEndYear;

    let januaryCount = 0;
    let idx = 0;
    for (let i = startMonthNo; i < startMonthNo + monthsToAdd + 2; i++) {
      const monthIndex = i > 11 ? i - 12 : i;
      let monthAbbr = this.monthAbbreviations[monthIndex];
      if (i === startMonthNo || i === startMonthNo + monthsToAdd + 1 || monthAbbr === "Jan") {
        monthAbbr = januaryCount === 0 && idx === 0
          ? monthAbbr + " " + popStartYear
          : monthAbbr + " " + burnChartEndYear;
        if (monthAbbr === "Jan") {
          januaryCount++;
        }   
      }
      idx++;
      this.burnChartXLabels.push(monthAbbr);
    }
    this.lineChartOptions.scales.x.ticks.maxTicksLimit 
      = this.burnChartXLabels.length >= 10 ? 7 : 13;

    const actualBurn: Record<string, (number | null)[]> = {};
    const projectedBurn: Record<string, (number | null)[]> = {};
    const totalActualBurnData: (number | null)[] = [];
    const totalProjectedBurnData: (number | null)[] = [];
    uniqueClinNumbers.forEach((clinNo) => {
      const thisIdiqClin = this.idiqClins.find(
        (clin) => clin.clin_number === clinNo
      );
      if (thisIdiqClin) {
        const costClinNo = thisIdiqClin.clin_number;
        const fundsObligatedForCLIN = thisIdiqClin.funds_obligated;

        let fundsAvailableForCLIN = !isNaN(parseFloat(fundsObligatedForCLIN.toString()))
          ? Math.round(parseFloat((fundsObligatedForCLIN.toString())) + Number.EPSILON)
          : 0;
        totalActualBurnData[0] = 
          totalActualBurnData.length && typeof totalActualBurnData[0] === "number"
            ? totalActualBurnData[0] + fundsAvailableForCLIN
            : fundsAvailableForCLIN
  
        if (fundsAvailableForCLIN) {
          const thisClinCosts = _.cloneDeep(clinCosts);
          const actual: (number | null)[] = [];
          const projected: (number | null)[] = [];
          actual[0] = fundsAvailableForCLIN;

          if (Object.keys(thisClinCosts).length > 0) {
            periodDatesISO.forEach((monthISO, i) => {
              const yearMonth = format(startOfMonth(new Date(parseISO(monthISO))), "yyyy-MM-dd")
              const thisCost = this.costs.find(
                cost => cost.clin_number === costClinNo && cost.year_month === yearMonth
              );
              const isActual = thisCost 
                ? thisCost.is_actual === true && !isThisMonth(parseISO(thisCost.year_month))
                : false;
              const costValue = thisClinCosts[costClinNo] !== undefined
                && thisClinCosts[costClinNo][yearMonth] !== undefined
                ? parseFloat(thisClinCosts[costClinNo][yearMonth]) 
                : NaN;

              const monthAmount = !isNaN(costValue) ? costValue : null;
              fundsAvailableForCLIN = monthAmount
                ? Math.round(fundsAvailableForCLIN - monthAmount)
                : fundsAvailableForCLIN;
              const month = addDays((new Date(yearMonth).setHours(0,0,0,0)), 1);
              const isCurrentMonth = isThisMonth(new Date(month)) 
              

              const actualAvailable = isActual ? fundsAvailableForCLIN : null;
              actual.push(actualAvailable);

              const projectedVal = isCurrentMonth ? fundsAvailableForCLIN : null;
              projected.push(projectedVal);
              const monthTotalActual = totalActualBurnData[i + 1];
              if (!monthTotalActual) {
                totalActualBurnData[i + 1] = actualAvailable;
              } else if (actualAvailable) {
                totalActualBurnData[i + 1] = Math.round(actualAvailable + monthTotalActual);
              }

              const monthTotalProjected = totalProjectedBurnData[i];
              if (!monthTotalProjected) {
                totalProjectedBurnData[i] = projectedVal;
              } else if (projectedVal) {
                totalProjectedBurnData[i] = Math.round(projectedVal + monthTotalProjected);
              }
            });

            actualBurn[clinNo] = actual;
            const costs = actual.filter(Number) // remove null values
            const len = costs.length;
            let finalProjectedDataPoint = 0;
            if (costs && costs[0] && costs[len - 1]) {
              const spentToDate = costs[0] - (costs[len - 1] ?? 0)
              const monthlyAvg = spentToDate / (len - 1);
              const monthsWithoutCosts = actual.filter(c => c === null);
              const projectedCostsTotal = monthlyAvg * monthsWithoutCosts.length;
              finalProjectedDataPoint = costs[0] - spentToDate - projectedCostsTotal;
            }
            projected.push(finalProjectedDataPoint);
            projectedBurn[clinNo] = projected;
          }
        }
      }
    }, this);
    const totalCosts = totalActualBurnData.filter(Number); // remove null values
    const tLen = totalCosts.length;
    let finalTotalProjectedDataPoint =  0;
    if (totalCosts && totalCosts[0] && totalCosts[tLen - 1]) {
      const totalSpentToDate = totalCosts[0] - (totalCosts[tLen - 1] ?? 0);
      const totalMonthlyAvg = totalSpentToDate / (tLen - 1);
      const totalMonthsWithoutCosts = totalActualBurnData.filter(c => c === null);
      const totalProjectedCostsTotal = totalMonthlyAvg * totalMonthsWithoutCosts.length;
      finalTotalProjectedDataPoint = totalCosts[0] - totalSpentToDate - totalProjectedCostsTotal;
    }

    totalProjectedBurnData.push(finalTotalProjectedDataPoint);
    
    uniqueClinNumbers.forEach((clinNo) => {
      const thisIdiqClin = this.idiqClins.find(
        (obj) => obj.clin_number === clinNo
      );
      const costClinNo = thisIdiqClin?.clin_number;
      const costClinsForThisIdiqClin = this.costs.filter((cost) => {
        return (
          cost.clin_number === costClinNo && cost.value && cost.is_actual === true
          && !isThisMonth(parseISO(cost.year_month))
        );
      });
      const thisIdiqClinSpending: number[] = [];
      costClinsForThisIdiqClin.forEach((obj) =>
        obj.value !== null
          ? thisIdiqClinSpending.push(parseFloat(obj.value))
          : null
      );
      const idiqClinTotalSpend = 
        thisIdiqClinSpending.reduce((partialSum, a) => partialSum + a, 0);
      const lastMonthSpend = this.lastMonthSpend;
      const avgMonthlySpend =
        Math.round((idiqClinTotalSpend / (this.monthsIntoPoP)) * 100) / 100;

      const idiqClinSpendData = {
        idiqClinTotalSpend,
        lastMonthSpend, 
        avgMonthlySpend,
      };
      this.idiqClinSpendData[clinNo] = idiqClinSpendData;
    }, this);


    this.burnChartData.labels = this.burnChartXLabels;
    this.burnChartData.datasets = [];
    const burnChartDataSets: lineChartDataSet[] = [];
    const clinTotalActualDataSet: lineChartDataSet =
      this.burnChartActualCommonDataSet;
    const totalActualData = {
      dataSetId: "TotalCLINsActual",
      label: "Total for all CLINs",
      data: totalActualBurnData,
    };
    Object.assign(clinTotalActualDataSet, totalActualData);
    burnChartDataSets.push(clinTotalActualDataSet);
    this.checked.push(true);
    const clinTotalProjectedDataSet: lineChartDataSet =
      this.burnChartProjectedCommonDataSet;
    const totalProjectedData = {
      dataSetId: "TotalClinsProjected",
      label: "Total for all CLINs Projected",
      data: totalProjectedBurnData,
    };
    Object.assign(clinTotalProjectedDataSet, totalProjectedData);
    burnChartDataSets.push(clinTotalProjectedDataSet);

    uniqueClinNumbers.forEach((clinNo, i) => {
      this.checked.push(true);

      const color = this.chartDataColorSequence[i + 1];
      const clin = this.idiqClins.find((clin) => clin.clin_number === clinNo);
      if (clin && this.burnChartData.datasets) {
        const clinActualData = {
          label: clin.idiq_clin,
          dataSetId: clin.idiq_clin
            ? getIdText(clin.idiq_clin + "Actual")
            : clinNo + "Data",
          data: actualBurn[clinNo],
        };
        const clinActualDataSet = _.clone(this.burnChartActualCommonDataSet);
        clinActualDataSet.borderColor = color;
        clinActualDataSet.pointBackgroundColor = color;
        clinActualDataSet.pointHoverBackgroundColor = color;
        clinActualDataSet.pointHoverBorderColor =
          this.chartDataColorsTranslucent[i + 1];

        Object.assign(clinActualDataSet, clinActualData);
        burnChartDataSets.push(clinActualDataSet);

        const clinProjectedData = {
          label: clin.idiq_clin + " Projected",
          dataSetId: clin.idiq_clin
            ? getIdText(clin.idiq_clin + "Projected")
            : clinNo + "DataProjected",
          data: projectedBurn[clinNo],
        };
        const clinProjectedDataSet: lineChartDataSet = _.clone(
          this.burnChartProjectedCommonDataSet
        );
        clinProjectedDataSet.borderColor = color;
        clinProjectedDataSet.pointBackgroundColor = color;
        Object.assign(clinProjectedDataSet, clinProjectedData);
        burnChartDataSets.push(clinProjectedDataSet);
      }
    });
    this.burnChartData.datasets = burnChartDataSets;
    return;
  }
  public async openSlideoutPanel(e: Event): Promise<void> {
    if (e?.currentTarget) {
      const opener = e.currentTarget as HTMLElement;
      const slideoutPanelContent: SlideoutPanelContent = {
        component: FinancialDataLearnMore,
        title: "Learn More",
      };
      await SlideoutPanel.setSlideoutPanelComponent(slideoutPanelContent);

      SlideoutPanel.openSlideoutPanel(opener.id);
    }
  }
  /* eslint-disable indent */
  public totalSpendingObj: {
    totalFundsSpent: number;
    totalFundsObligated: number;
    lastMonthSpent: number;
    clinAverage: number;
    spendTrend: number;
  } = {
    totalFundsSpent: 0,
    totalFundsObligated: 0,
    lastMonthSpent: 0,
    clinAverage: 0,
    spendTrend: 0,
  };
  /* eslint-enable indent */

  public timeUntilExpiration(endDate: string): string {
    const popEndDate = parseISO(endDate, { additionalDigits: 1 });
    const end = new Date(popEndDate.setHours(0, 0, 0, 0));
    const todayDate = new Date();
    const today = new Date(todayDate.setHours(0, 0, 0, 0));
    const daysUntilEndDate = differenceInCalendarDays(end, today);
    const monthsUntilEndDate = differenceInCalendarMonths(end, today);

    const unitsRemaining =
      daysUntilEndDate <= 90 ? daysUntilEndDate : monthsUntilEndDate;
    const useMonths = daysUntilEndDate > 90;
    const singular = unitsRemaining === 1;
    const timeUnit = useMonths
      ? singular
        ? "month"
        : "months"
      : singular
        ? "day"
        : "days";
    return unitsRemaining + " " + timeUnit;
  }

  public async setBurnChartYAxis(): Promise<void> {
    // total portfolio funds is sum of each IDIQ CLIN's funds obligated
    let multiplier = 1;
    const tpf = this.totalPortfolioFunds;
    if (tpf >= 1000 && tpf < 10000) {
      multiplier = 1000;
    } else if (tpf >= 10000 && tpf < 100000) {
      multiplier = 10000;
    } else if (tpf >= 100000 && tpf < 1000000) {
      multiplier = 100000;
    } else if (tpf >= 1000000) {
      multiplier = 1000000;
    }
    this.burnChartYMax = Math.ceil(this.totalPortfolioFunds / multiplier) * multiplier;

    // ticks array is number of y-axis divisions based on getting round numbers
    // out of total value's first digit 
    const yAxisTicksArr = [8,8,6,8,10,6,8,8,6]; // doubled to have line btw labeled lines
    const firstDigit = parseInt(this.burnChartYMax.toString().charAt(0));
    const yAxisTicks = yAxisTicksArr[firstDigit - 1];
    this.burnChartYStepSize = Math.round(this.burnChartYMax / yAxisTicks);

    this.lineChartOptions.scales.y.max = this.burnChartYMax;
    this.lineChartOptions.scales.y.ticks.stepSize = this.burnChartYStepSize;
  }

  public lastSyncDate = "";
  public hasObligatedFundsInUpcomingCLIN = false;

  public async checkForUpcomingObligatedFunds(data: Portfolio): Promise<void> {
    // if currentClins is empty i.e. Expired status, this errors. 
    if((data?.currentCLINs as ClinDTO[]).length > 0){
      const currentPeriodPrefix = (data?.currentCLINs as ClinDTO[])[0].clin_number.slice(0,2);
      const nextPeriodNumber = parseInt(currentPeriodPrefix) + 1;
      const nextPeriodPrefix = nextPeriodNumber < 10 
        ? "0" + nextPeriodNumber : String(nextPeriodNumber);
      const nextPeriodCLINsWithOblFunds = data.clins?.filter(clin => {
        return clin.clin_number.indexOf(nextPeriodPrefix) === 0 
          && clin.funds_obligated.toString() !== "0";
      }) as ClinDTO[]
      this.hasObligatedFundsInUpcomingCLIN = nextPeriodCLINsWithOblFunds.length > 0;
    }
  }

  public get showEndOfMonthXaaSTrend(): boolean {
    return this.endOfMonthXaaSForecast > 0 && this.monthsIntoPoP > 1; 
  }

  public async loadOnEnter(): Promise<void> {
    const currentPortfolioData = PortfolioStore.currentPortfolio;
    await this.checkForUpcomingObligatedFunds(currentPortfolioData);
    this.costs = (currentPortfolioData.fundsData as PortfolioFundsData).costs as CostsDTO[];
    const {fundsData} = currentPortfolioData
    this.costs.forEach(cost => {
      // eslint-disable-next-line camelcase
      cost.year_month = format(startOfMonth(parseISO(cost.year_month)), "yyyy-MM-dd");
    });

    this.costs.sort((a, b) => (a.clin_number > b.clin_number ? 1 : -1));
    this.costs.sort((a, b) => (a.year_month > b.year_month ? 1 : -1));
    this.costs.forEach((cost) => {
      cost.value = parseFloat(cost.value).toString();
    });
    this.idiqClins = currentPortfolioData.currentCLINs as ClinDTO[];
    this.availableFunds = parseFloat(fundsData?.fundsAvailable as string);
    this.totalPortfolioFunds = parseFloat(fundsData?.totalPortfolioFunds as string)
    this.fundsSpent = parseFloat(fundsData?.periodFundsSpent as string);
    this.fundsSpentPercent = (this.fundsSpent / this.totalPortfolioFunds) * 100;
    this.monthlySpendAverage = parseFloat(fundsData?.spendMonthAverage as string);
    this.lastMonthSpend = parseFloat(fundsData?.lastMonthSpent as string);
    this.lastMonthSpendTrendPercent = parseFloat(fundsData?.lastMonthTrend as string);
    this.endOfMonthXaaSForecast = parseFloat(fundsData?.endOfMonthXaasForecast as string);
    this.endOfMonthXaaSForecastTrendPercent = parseFloat(fundsData?.endOfMonthXaasTrend as string);
    this.endOfPeriodForecast = parseFloat(fundsData?.endOfPeriodForecast as string);
    this.estimatedFundsToBeInvoiced = parseFloat(fundsData?.fundsToBeInvoiced as string);
    this.estimatedFundsAvailable = parseFloat(fundsData?.estimatedFundsAvailable as string);
    await this.setBurnChartYAxis();
  
    this.tooltipHeaderData = {
      title: "Total Funds Available",
      amount: this.getCurrencyString(this.availableFunds),
      legend: "Funds Available",
    };
    

    if (!isNaN(this.fundsSpentPercent)) {
      if (this.fundsSpentPercent >= 99.9 && this.fundsSpentPercent < 100) {
        // if ALMOST 100%, due to rounding, don't set at 100% spent
        // if at 99.9 to 99.99999 percent    
        this.fundsSpentPercentForArcChart = 99.9;
      } else if (this.fundsSpentPercent < 75 || this.fundsSpentPercent >= 100) {
        // use whole numbers below 75 and 100 and over
        this.fundsSpentPercentForArcChart =  Math.round(this.fundsSpentPercent);    
      } else {
        // include 1 decimal place between 75 and 100
        this.fundsSpentPercentForArcChart = Math.round(this.fundsSpentPercent * 10) / 10;
      }
      const remaining = this.fundsSpentPercentForArcChart > 100
        ? 0 : 100 - this.fundsSpentPercentForArcChart;
      this.arcGuageChartData.datasets[0].data = [this.fundsSpentPercentForArcChart, remaining];
    } else {
      this.arcGuageChartData.datasets[0].data = [0, 100];      
    }

    if (this.fundsSpentPercent >= 75) {
      const arcColor = this.fundsSpentPercent < 100
        ? this.chartAuxColors.warning
        : this.chartAuxColors.error;
      this.arcGuageChartData.datasets[0].backgroundColor = [arcColor, this.chartDataColors.gray];
    }

    this.currentPoPStartISO = currentPortfolioData.popStartDate as string;
    this.currentPoPEndISO = currentPortfolioData.popEndDate as string;

    this.currentPoPStartStr = createDateStr(this.currentPoPStartISO, true);
    this.currentPoPEndStr = createDateStr(this.currentPoPEndISO, true);
    this.calculateTimeToExpiration();

    this.calculateBurnDown();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.isLoading = false;
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
        color: "#fff",
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

  public checked: boolean[] = [];

  public datasetToToggle: number | null = null;
  public toggleDataset = false;

  private doToggleDataset(datasetIndex: number) {
    this.datasetToToggle = datasetIndex;
    this.toggleDataset = !this.toggleDataset;
  }

  public burnChartActualCommonDataSet = {
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
  public burnChartProjectedCommonDataSet = {
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
          callback: function (value: number, i: number): string {
            let suffix = "";
            let val = value;
            if (value >= 1000000) {
              suffix = "M";
              val = Math.round((value / 1000000) * 100) / 100;
            } else if (value >= 1000) {
              val = Math.round(value / 1000)
            } 
            suffix = value >= 1000 && value < 1000000 ? "K" : value >= 1000000 ? "M" : "";
            const isOdd = i % 2 !== 0;
            return value === 0 || isOdd ? "" : "$" + val + suffix;
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
  public portfolioFundsObj: { [key: string]: number } = {};
  public donutChartData = {
    labels: [
      "Funds spent",
      "Estimated funds to be invoiced",
      "Estimated funds available",
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
          return value ? parseFloat(value.toFixed(1)) + "%" : "";
        },
      },
    },
  };

  public getLegendAmount(index: number): string {
    const amount =
      (this.totalPortfolioFunds * this.donutChartData.datasets[0].data[index]) /
      100;
    return this.getCurrencyString(amount, false);
  }

  private get panelContent() {
    return SlideoutPanel.slideoutPanelComponent;
  }

  public spendingTooltipText = `This is the total value of all exercised CLINs funding this
    portfolio.`;

  public periodToDateTooltipText = `This is the total spend from the start of
    the current PoP through last month. It does not include
    funds that will be invoiced this month.`;

  public roundDecimal(value: number, decimals: number): number {
    decimals = decimals || 0;
    value = value || 0;
    return parseFloat(Math.abs(value).toFixed(decimals));
  }

  public getSpendPercent(value: number): number {
    const roundedVal = this.roundDecimal(value, 2);
    return roundedVal;
  }

  public getCurrencyString(value: number, decimals?: boolean): string {
    return getCurrencyString(value, decimals);
  }

}
export default toNative(PortfolioDashboard)
</script>
