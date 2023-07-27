<template>
  <div class="_dashboard">
    <v-container class="container-max-width">
      <v-row v-if="showFundingAlert">
        <v-col>
          <FundingAlert
            :fundingAlertType="fundingAlertType"
            :timeRemaining="daysRemaining"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div id="app-content" class="d-flex flex-column">
            <div class="mb-auto" style="padding-bottom: 80px">
                <div class="d-flex justify-space-between width-100 mb-10">
                  <ATATAlert
                      id="InaccurateFinancialDetails"
                      type="error"
                      class="container-max-width my-10"
                  >
                    <template v-slot:content>
                      <h3 class="mb-1">Financial details may be inaccurate</h3>
                      <p class="mb-0">
                        We are currently experiencing an issue with retrieving cost data from
                        {{ cspLongName() }}. In the meantime, administrators can login
                        to your CSP console directly to get detailed cost analyses and breakdowns.
                        We apologize for this inconvenience.
                      </p>
                    </template>
                  </ATATAlert>
                </div>
              <div class="d-flex justify-space-between width-100 mb-10">
                <h2>Overview</h2>
                <!-- ATAT TODO - add sync date after have data
                  <span class="text-base-dark">Last Sync: Nov. 15, 0100</span>
                -->
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
                            Your remaining portfolio balance from all exercised contract line item
                            numbers (CLINs) since the start of your current task order
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
                          Total value of all exercised CLINs
                        </p>
                        <v-divider class="my-4" />
                        <p class="text-base-darkest mb-0 font-size-14">
                          Current Period of Performance (PoP)
                        </p>
                        <span id="PoPDates" class="h3 mb-0">
                          {{ currentPoPStartStr }}&ndash;{{ currentPoPEndStr }}
                        </span>
                        <!-- <p
                          class="text-base-dark mb-0 font-size-14"
                          v-if="!hasTimeSensitiveAlert"
                        >
                          {{ timeToExpiration }}
                        </p> -->

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
                      :isError="arePoPFundsDelinquent"
                    />
                    <v-divider class="my-4" />
                    <p v-if="hasExpired && !isLoading" class="mb-0 font-size-14">
                      The PoP has <strong>expired.</strong> You spent 
                      {{ fundsSpentPercentForArcChart }}% of your portfolio’s available funds.
                    </p>
                    <p
                      class="mb-0 font-size-14"
                      v-else-if="arePoPFundsDelinquent && !isLoading"
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
              <!-- ATAT TODO - restore in future ticket 
              <v-row id="BurndownChartWrap">
                <v-col>
                  <v-card class="_no-shadow v-sheet--outlined pa-8">
                    <h3 class="mb-4">Actual and Projected Burn Rate</h3>
                    <p class="text-base-dark font-size-14">
                      Track your rate of spend and available funds throughout
                      the current PoP. Forecasted future costs
                      are based on historical trends and show approximately when
                      you are projected to exceed your portfolio’s budget.
                    </p>
                    <v-row class="mb-0">
                      <v-col class="font-size-14">Funds available</v-col>
                      <v-col id="BurnPoPs" class="text-right font-size-14">
                        Current Period: {{ popStart }}&ndash;{{ popEnd }}
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
              -->

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
                        <v-card class="bg-base-lightest _no-shadow pa-4">
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
                            <span class="font-size-12 text-base-dark font-weight-700">
                              <span :class="lastMonthTrendTextColor">
                                {{ getSpendPercent(lastMonthSpendTrendPercent) }}%
                              </span>
                              vs monthly average
                            </span>
                          </span>
                        </v-card>
                      </v-col>
                      <v-col>
                        <v-card class="bg-base-lightest _no-shadow pa-4">
                          End-of-month forecast
                          <span class="h1 d-block my-2">
                            <span v-if="endOfMonthForecast">
                              {{ getCurrencyString(endOfMonthForecast) }}
                            </span>
                            <span v-else>
                              {{ getCurrencyString(monthlySpendAverage) }}
                            </span>
                          </span>
                          <span v-if="monthsIntoPoP > 1" class="d-flex align-center">
                            <ATATSVGIcon
                              :name="endOfMonthTrendIconName"
                              width="20"
                              height="13"
                              class="mr-2"
                              :color="endOfMonthTrendIconColor"
                            />
                            <span class="font-size-12 text-base-dark">
                              <span :class="endOfMonthTrendTextColor">
                                {{ getSpendPercent(endOfMonthForecastTrendPercent) }}%
                              </span>
                              vs monthly average
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
                    <funding-alert
                      :fundingAlertType="fundingAlertType"
                      v-if="arePoPFundsDelinquent"
                    />
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

              <!-- ATAT TODO
              ============================================
              Add back and update as needed after ATAT MVP
              ============================================
              <v-row>
                <v-col>
                  <div class="_clinTable">
                    <span class="h3 justify-center">Active Task Orders</span>
                    <v-expansion-panels class="pt-6" ripple="false">
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <div class="font-size-20 text-primary _header-text">
                            Task Order #{{ this.taskOrder.task_order_number }}
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-simple-table>
                            <template v-slot:default>
                              <thead class="bg-base-lightest">
                                <tr>
                                  <th id="ClinNumberHeader">
                                    <div
                                      class="font-size-12 text-base-darker"
                                      id="ClinNumber"
                                    >
                                      Clin
                                    </div>
                                  </th>
                                  <th id="StatusHeader">
                                    <div
                                      class="font-size-12 text-base-darker"
                                      id="Status"
                                    >
                                      Status
                                    </div>
                                  </th>
                                  <th id="PoPHeader">
                                    <div
                                      class="font-size-12 text-base-darker"
                                      id="PoP"
                                    >
                                      Period Of Performance
                                    </div>
                                  </th>
                                  <th id="TotalFundsSpentHeader">
                                    <div
                                      class="font-size-12 text-base-darker 
                                      d-flex justify-end align-center"
                                      id="TotalFundsSpent"
                                    >
                                      Total Funds Spent (%)
                                    </div>
                                  </th>
                                  <th id="LastMonthsSpendHeader">
                                    <div
                                      class="font-size-12 text-base-darker 
                                      d-flex justify-end align-center"
                                      id="LastMonthsSpend"
                                    >
                                      Last Month’s Spend
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="(item, index) in tableItems"
                                  :key="index"
                                >
                                  <td id="ClinData">
                                    <div class="d-flex flex-column">
                                      <span
                                        class="font-size-14 text-base-darker"
                                      >
                                        {{ item.costClinNumber }}
                                      </span>
                                      <span class="font-size-12 text-base">
                                        {{ item.clinLabel }} ({{
                                          item.idiqClin
                                        }})
                                      </span>
                                    </div>
                                  </td>
                                  <td id="ClinStatus" class="_v-align-top">
                                    <v-chip color="bg-success" label>
                                      {{ item.clinStatus }}
                                    </v-chip>
                                  </td>
                                  <td id="ClinPoP">
                                    <div class="d-flex flex-column">
                                      <span
                                        class="font-size-14 text-base-darker"
                                      >
                                        {{ item.popStart }}&ndash;{{
                                          item.popEnd
                                        }}
                                      </span>
                                      <span class="font-size-12 text-base">
                                        {{ item.timeUntilExpiration }} to
                                        expiration
                                      </span>
                                    </div>
                                  </td>
                                  <td id="ClinTotalFundsSpent">
                                    <div class="d-flex flex-column">
                                      <span
                                        class="font-size-14 text-base-darker d-flex justify-end"
                                      >
                                        ${{ item.totalFundsSpent }}
                                        <span
                                          class="font-size-12 text-base pl-4 d-flex justify-end"
                                          style="width: 48px"
                                        >
                                          ({{
                                            roundDecimal(
                                              getSpendPercent(
                                                +item.totalFundsSpent.replace(
                                                  /,/g,
                                                  ""
                                                ) /
                                                  +item.totalFundsObligated.replace(
                                                    /,/g,
                                                    ""
                                                  )
                                              ),
                                              2
                                            ) * 100
                                          }}%)
                                        </span>
                                      </span>
                                      <span
                                        class="font-size-12 text-base d-flex justify-end"
                                      >
                                        {{
                                          getCurrencyString(
                                            +item.totalFundsObligated.replace(
                                              /,/g,
                                              ""
                                            ) -
                                              +item.totalFundsSpent.replace(
                                                /,/g,
                                                ""
                                              )
                                          )
                                        }}
                                        remaining
                                      </span>
                                    </div>
                                  </td>
                                  <td id="ClinLastMonthSpent">
                                    <div class="d-flex flex-column">
                                      <span
                                        class="font-size-14 text-base-darker 
                                        d-flex justify-end"
                                      >
                                        ${{ item.lastMonthSpent }}
                                      </span>
                                      <span class="d-flex justify-end">
                                        <span
                                          class="font-size-12 d-flex pr-1 align-center pr-1 
                                          font-weight-700"
                                          :class="
                                            item.spendTrend > 0
                                              ? 'text-error'
                                              : 'text-success-dark'
                                          "
                                        >
                                          <ATATSVGIcon
                                            class="text-primary d-inline-block mr-1"
                                            style="height: 4px"
                                            width="7"
                                            height="4"
                                            :name="
                                              item.spendTrend > 0
                                                ? 'triangleUp'
                                                : 'triangleDown'
                                            "
                                            color="primary"
                                          ></ATATSVGIcon>
                                          {{
                                            roundDecimal(
                                              getSpendPercent(item.spendTrend),
                                              0
                                            )
                                          }}%
                                        </span>
                                        <span class="font-size-12 text-base">
                                          vs monthly avg
                                        </span>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td></td>
                                  <td></td>
                                  <td
                                    id="Total"
                                    class="d-flex justify-end align-start"
                                  >
                                    <span
                                      class="pr-12 font-size-14 text-base-darkest font-weight-700"
                                    >
                                      Total
                                    </span>
                                  </td>
                                  <td id="TotalSpent">
                                    <div class="d-flex flex-column">
                                      <span
                                        class="font-size-14 text-base-darker 
                                        font-weight-700 d-flex justify-end"
                                      >
                                        {{
                                          getCurrencyString(
                                            totalSpendingObj.totalFundsSpent
                                          )
                                        }}
                                        <span
                                          class="font-size-12 text-base font-weight-400 pl-4"
                                        >
                                          ({{
                                            roundDecimal(
                                              getSpendPercent(
                                                totalSpendingObj.totalFundsSpent /
                                                  totalSpendingObj.totalFundsObligated
                                              ),
                                              2
                                            ) * 100
                                          }}%)
                                        </span>
                                      </span>
                                      <span
                                        class="font-size-12 text-base d-flex justify-end"
                                      >
                                        {{
                                          getCurrencyString(
                                            totalSpendingObj.totalFundsObligated -
                                              totalSpendingObj.totalFundsSpent
                                          )
                                        }}
                                        remaining
                                      </span>
                                    </div>
                                  </td>
                                  <td id="TotalLastMonthSpent">
                                    <div class="d-flex flex-column">
                                      <span
                                        class="font-size-14 d-flex justify-end 
                                        text-base-darker font-weight-700"
                                      >
                                        {{
                                          getCurrencyString(
                                            totalSpendingObj.lastMonthSpent
                                          )
                                        }}
                                      </span>
                                      <span class="d-flex justify-end">
                                        <span
                                          class="font-size-12 d-flex pr-1 
                                          align-center font-weight-700"
                                          :class="
                                            totalSpendingObj.spendTrend > 0
                                              ? 'text-error'
                                              : 'text-success-dark'
                                          "
                                        >
                                          <ATATSVGIcon
                                            class="text-primary d-inline-block mr-1"
                                            style="height: 4px"
                                            width="7"
                                            height="4"
                                            :name="
                                              totalSpendingObj.spendTrend > 0
                                                ? 'triangleUp'
                                                : 'triangleDown'
                                            "
                                            color="primary"
                                          ></ATATSVGIcon>
                                          <span>
                                            {{
                                              roundDecimal(
                                                getSpendPercent(
                                                  totalSpendingObj.spendTrend
                                                ),
                                                0
                                              )
                                            }}%
                                          </span>
                                        </span>
                                        <span class="font-size-12 text-base">
                                          vs monthly avg
                                        </span>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </v-col>
              </v-row>
              -->

            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { DashboardService, PortFolioDashBoardDTO } from "../../services/dashboards";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATFooter from "../../components/ATATFooter.vue";
import ATATPageHead from "../../components/ATATPageHead.vue";
import ATATSlideoutPanel from "@/components/ATATSlideoutPanel.vue";
import ATATSVGIcon from "../../components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import DonutChart from "../../components/charts/DonutChart.vue";
import LineChart from "../../components/charts/LineChart.vue";

import ATATCharts from "@/store/charts";
import AcquisitionPackage, { Statuses } from "@/store/acquisitionPackage";
import TaskOrder from "@/store/taskOrder";
import { FundingAlertTypes } from "@/store/portfolio";
import { createDateStr, toCurrencyString, getCurrencyString, getIdText, roundTo100 } 
  from "@/helpers";
import { CostsDTO, TaskOrderDTO, ClinDTO } from "@/api/models";

import { add, addDays, isAfter, isBefore, isThisMonth, startOfMonth, subDays } from "date-fns";
import parseISO from "date-fns/parseISO";
import formatISO from "date-fns/formatISO";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInCalendarMonths from "date-fns/differenceInCalendarMonths";
import {
  lineChartData,
  lineChartDataSet,
  SlideoutPanelContent,
} from "types/Global";
import _ from "lodash";
import SlideoutPanel from "@/store/slideoutPanel";
import FinancialDataLearnMore from "@/components/slideOuts/FinancialDataLearnMore.vue";
import FundingAlert from "@/portfolios/portfolio/FundingAlert.vue";
import PortfolioStore from "@/store/portfolio";
import Portfolio from "@/store/portfolio";

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
  },
})
export default class PortfolioDashboard extends Vue {
  dashboardService: DashboardService = new DashboardService();

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }
  public isLoading = true;
  public totalPortfolioFunds = 0;
  public fundsSpent = 0;
  public availableFunds = 0;
  public fundsSpentPercent = 0;
  public fundsSpentPercentForArcChart = 0;

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
  public endOfMonthForecast = 0;
  public endOfMonthForecastTrendPercent = 0; // for spending summary
  public estimatedFundsToBeInvoicedPercent = 0; // for donut chart
  public estimatedRemainingPercent = 0;
  public endOfPeriodForecast = 0;
  public monthsIntoPoP = 0;
  public numberOfMonthsRemainingToBeBilled = 0;

  public taskOrder: TaskOrderDTO = TaskOrder.value;
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
  public burnChartYLabelSuffix = "k";
  public tooltipHeaderData: Record<string, string> = {};

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
    return this.endOfMonthForecastTrendPercent > 0 ? 'trendingUp' : 'trendingDown';
  }
  public get endOfMonthTrendIconColor(): string {
    return this.endOfMonthForecastTrendPercent > 0 ? 'error' : 'success-dark';  
  }
  public get endOfMonthTrendTextColor(): string {
    return this.endOfMonthForecastTrendPercent > 0 ? 'text-error' : 'text-success-dark';
  }

  private get hasTimeSensitiveAlert(): boolean {
    return this.daysUntilEndDate <= 60 && !this.hasObligatedFundsInUpcomingCLIN;
  }
  private get arePoPFundsLow(): boolean {
    return this.fundsSpentPercent >= 75 && this.fundsSpentPercent < 100;
  }
  private get arePoPFundsDelinquent(): boolean {
    // niche case - if ALMOST 100%, due to rounding, don't flag as delinquent
    // if at 99.5 to 99.99999 percent
    if (this.fundsSpentPercent >= 99.5 && this.fundsSpentPercent < 100) {
      return false;
    }
    return this.fundsSpentPercent >= 100;
  }
  private get isExpiringSoon(): boolean {
    return this.daysRemaining <= 60 && this.daysRemaining > 0;
  }
  private get hasExpired(): boolean { 
    return this.daysRemaining <= 0;  
  }

  private daysPastExpiration(): number {
    return Math.abs(this.daysUntilEndDate);
  }

  public get showFundingAlert(): boolean {
    return this.fundingAlertType.length > 0;
  }

  private cspLongName(): string {
    const cspName = PortfolioStore.currentPortfolio.csp ?? "";
    let longName = "";
    switch(cspName.toLowerCase()) {
    case 'aws':
      longName = 'Amazon Web Services';
      break;
    case 'azure':
      longName = "Microsoft Azure";
      break;
    case 'gcp':
      longName = "Google Cloud";
      break;
    case 'oracle':
      longName = "Oracle Cloud";
      break;
    default:
      break;
    }
    return longName;
  }

  private get fundingAlertType(): string {
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

    }
    return "";
  }

  private get daysRemaining(): number {
    return this.daysUntilEndDate;
  }

  public async calculateFundsSpent(): Promise<void> {
    this.costs.forEach((cost) => {
      if (cost.is_actual === "true") {
        this.fundsSpent = this.fundsSpent + parseFloat(cost.value);
      }
    });
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
      // endOfSpending = subDays(endOfSpending, 1);
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
    
    //eslint-disable-next-line prefer-const 
    let clinCosts: Record<string, Record<string, string>> = {};
    uniqueClinNumbersInCostsData.forEach((clinNo) => {
      //eslint-disable-next-line prefer-const 
      let clinValues: Record<string, string> = {};
      uniqueDates.forEach((date) => {
        const clin = this.costs.find(
          (cost) => cost.clin_number === clinNo && cost.year_month === date
        );
        if (clin && clin.is_actual === "true") {
          clinValues[date] = clin.value;
        } else if (clin) {
          this.endOfMonthForecast += parseFloat(clin.value);
        }
      });
      clinCosts[clinNo] = clinValues;
    });

    if (uniqueClinNumbersInCostsData.length && this.endOfMonthForecast) {
      this.estimatedFundsToBeInvoicedPercent =
        (this.endOfMonthForecast / this.totalPortfolioFunds) * 100;

      this.estimatedRemainingPercent = this.fundsSpentPercent < 100
        ? 100 - this.fundsSpentPercent - this.estimatedFundsToBeInvoicedPercent
        : 0;
    } else if (uniqueClinNumbersInCostsData.length && this.monthsInPoP) {
      this.estimatedFundsToBeInvoicedPercent = 1 / this.monthsInPoP * 100;
      this.estimatedRemainingPercent = 100 - this.estimatedFundsToBeInvoicedPercent;
    } else {
      this.estimatedFundsToBeInvoicedPercent = 0;
      this.estimatedRemainingPercent = 0;
    }

    let estimatedFundsToBeInvoiced = this.endOfMonthForecast
      ? this.endOfMonthForecast
      : this.totalPortfolioFunds / this.monthsInPoP;

    let estimatedAvailable = (this.totalPortfolioFunds * this.estimatedRemainingPercent) / 100;
    if (this.costs.length === 0) {
      estimatedAvailable = this.totalPortfolioFunds;
      this.estimatedRemainingPercent = 100;
      estimatedFundsToBeInvoiced = 0;
    }

    this.donutChartPercentages = [
      this.fundsSpentPercent,
      this.estimatedFundsToBeInvoicedPercent,
      this.estimatedRemainingPercent,
    ];

    this.portfolioFundsObj = {
      "Funds spent": this.fundsSpent,
      "Estimated funds to be invoiced": estimatedFundsToBeInvoiced,
      "Estimated funds available": estimatedAvailable
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
    //eslint-disable-next-line prefer-const 
    let monthsToAdd = differenceInCalendarMonths(popEndDate, popStartDate);

    for (let i = 0; i < monthsToAdd; i++) {
      month = add(popStartDate, { months: i + 1 });
      periodDates.push(month);

      periodDatesISO.push(formatISO(month, { representation: "date" }));
    }

    const startMonthNo = popStartDate.getMonth();
    const popStartYear = popStartDate.getFullYear();
    const popEndYear = popEndDate.getFullYear();
    const burnChartEndYear = periodDatesISO.length > 11 && popStartYear === popEndYear
      ? (popEndYear + 1) : popEndYear;

    let januaryCount = 0;
    for (let i = startMonthNo; i < startMonthNo + monthsToAdd + 2; i++) {
      const monthIndex = i > 11 ? i - 12 : i;
      let monthAbbr = this.monthAbbreviations[monthIndex];
      if (i === startMonthNo || i === startMonthNo + monthsToAdd + 1 || monthAbbr === "Jan") {
        monthAbbr = januaryCount === 0
          ? monthAbbr + " " + popStartYear
          : monthAbbr + " " + burnChartEndYear;
        if (monthAbbr === "Jan") {
          januaryCount++;
        }   
      }
   
      this.burnChartXLabels.push(monthAbbr);
    }
    const actualBurn: Record<string, (number | null)[]> = {};
    const projectedBurn: Record<string, (number | null)[]> = {};
    const totalActualBurnData: (number | null)[] = [];
    const totalProjectedBurnData: (number | null)[] = [];
    
    const now = new Date();

    uniqueClinNumbers.forEach((clinNo) => {
      const thisIdiqClin = this.idiqClins.find(
        (clin) => clin.clin_number === clinNo
      );
      if (thisIdiqClin) {
        const costClinNo = thisIdiqClin.clin_number;
        //eslint-disable-next-line prefer-const 
        let fundsObligatedForCLIN = thisIdiqClin.funds_obligated;
        let fundsAvailableForCLIN = !isNaN(parseFloat(fundsObligatedForCLIN.toString()))
          ? parseFloat(fundsObligatedForCLIN.toString())
          : 0;

        if (fundsAvailableForCLIN) {
          const thisClinCosts = _.cloneDeep(clinCosts);
          const actual: (number | null)[] = [];
          const projected: (number | null)[] = [];
          if (Object.keys(thisClinCosts).length > 0) {
            periodDatesISO.forEach((monthISO, i) => {
              const thisCost = this.costs.find(
                cost => cost.clin_number === costClinNo && cost.year_month === monthISO
              );
              const isActual = thisCost ? thisCost.is_actual === "true" : false;
              const value = thisClinCosts[costClinNo] !== undefined
                && thisClinCosts[costClinNo][monthISO] !== undefined
                ? parseFloat(thisClinCosts[costClinNo][monthISO]) 
                : NaN;
              const thisMonthAmount = !isNaN(value) ? value : null;
              fundsAvailableForCLIN = thisMonthAmount
                ? fundsAvailableForCLIN - thisMonthAmount
                : fundsAvailableForCLIN;
              const month = addDays((new Date(monthISO).setHours(0,0,0,0)), 1);
              const isCurrentMonth = isThisMonth(new Date(month)) 

              const actualAvailable = isActual ? fundsAvailableForCLIN : null;
              actual.push(actualAvailable);

              const projectedVal = isCurrentMonth ? fundsAvailableForCLIN : null;
              projected.push(projectedVal);
              const monthTotalActual = totalActualBurnData[i];
              if (!monthTotalActual) {
                totalActualBurnData[i] = actualAvailable;
              } else if (actualAvailable) {
                totalActualBurnData[i] = actualAvailable + monthTotalActual;
              }

              const monthTotalProjected = totalProjectedBurnData[i];
              if (!monthTotalProjected) {
                totalProjectedBurnData[i] = projectedVal;
              } else if (projectedVal) {
                totalProjectedBurnData[i] = projectedVal + monthTotalProjected;
              }
            });

            actualBurn[clinNo] = actual;
            projected.push(0);
            projectedBurn[clinNo] = projected;
          }
        }
      }
    }, this);

    totalProjectedBurnData.push(0);
    
    // MAYBE DON'T NEED 
    const firstMonthSpend = 0;

    uniqueClinNumbers.forEach((clinNo) => {
      const thisIdiqClin = this.idiqClins.find(
        (obj) => obj.clin_number === clinNo
      );
      const costClinNo = thisIdiqClin?.clin_number;
      const costClinsForThisIdiqClin = this.costs.filter((cost) => {
        return (
          cost.clin_number === costClinNo && cost.value && cost.is_actual === "true"
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

      const len = costClinsForThisIdiqClin.length;     
      const lastMonthSpend = len > 0 ? parseFloat(
        costClinsForThisIdiqClin[len - 1].value
      ) : 0;
      // if ()
      const avgMonthlySpend =
        Math.round((idiqClinTotalSpend / (this.monthsIntoPoP)) * 100) / 100;
        // Math.round((idiqClinTotalSpend / (this.monthsIntoPoP + 1)) * 100) / 100;

      const idiqClinSpendData = {
        idiqClinTotalSpend,
        lastMonthSpend, 
        avgMonthlySpend,
      };
      this.idiqClinSpendData[clinNo] = idiqClinSpendData;
    }, this);
    const monthsWithSpend = totalActualBurnData.filter((amt) => amt !== null);

    const len = monthsWithSpend.length ? monthsWithSpend.length : 1; // - 1; 

    this.monthlySpendAverage = Math.round((this.fundsSpent / len) * 100) / 100;
    if (len >= 2) {
      const twoMoAgoAvl = monthsWithSpend[len - 2];
      const lastMoAvl = monthsWithSpend[len - 1];
      if (twoMoAgoAvl && lastMoAvl) {
        this.lastMonthSpend = twoMoAgoAvl - lastMoAvl;
        this.lastMonthSpendTrendPercent =
          ((this.lastMonthSpend - this.monthlySpendAverage) / this.monthlySpendAverage) * 100;
      }
      this.endOfMonthForecastTrendPercent =
        ((this.endOfMonthForecast - this.monthlySpendAverage) / this.monthlySpendAverage) * 100;

      // - 1 bc inlcuding the endOfMonthForecast
      const months = this.numberOfMonthsRemainingToBeBilled - 1; 
      this.endOfPeriodForecast =
        this.fundsSpent + this.endOfMonthForecast + this.monthlySpendAverage * months;
    } else if (len === 1) {
      this.monthlySpendAverage = this.fundsSpent;
      this.lastMonthSpend = this.fundsSpent;
      const months = this.numberOfMonthsRemainingToBeBilled;
      this.endOfPeriodForecast = this.endOfMonthForecast
        ? this.endOfMonthForecast + this.monthlySpendAverage * (months - 1)
        : this.monthlySpendAverage * months; 
    } else if (monthsWithSpend.length === 0) {
      this.monthlySpendAverage = Math.round((this.availableFunds / this.monthsInPoP) * 100) / 100;
    }

    this.burnChartData.labels = this.burnChartXLabels;
    this.burnChartData.datasets = [];
    //eslint-disable-next-line prefer-const
    let burnChartDataSets: lineChartDataSet[] = [];
    //eslint-disable-next-line prefer-const
    let clinTotalActualDataSet: lineChartDataSet =
      this.burnChartActualCommonDataSet;
    const totalActualData = {
      dataSetId: "TotalCLINsActual",
      label: "Total for all CLINs",
      data: totalActualBurnData,
    };
    Object.assign(clinTotalActualDataSet, totalActualData);
    burnChartDataSets.push(clinTotalActualDataSet);
    this.checked.push(true);
    //eslint-disable-next-line prefer-const
    let clinTotalProjectedDataSet: lineChartDataSet =
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
        // ATAT TODO - reinstate idiq_clin_labels - currently blank in data from SNOW
        const clinActualData = {
          label: clin.idiq_clin_label,
          dataSetId: clin.idiq_clin_label
            ? getIdText(clin.idiq_clin_label + "Actual")
            : clinNo + "Data",
          data: actualBurn[clinNo],
        };
        //eslint-disable-next-line prefer-const
        let clinActualDataSet = _.clone(this.burnChartActualCommonDataSet);
        clinActualDataSet.borderColor = color;
        clinActualDataSet.pointBackgroundColor = color;
        clinActualDataSet.pointHoverBackgroundColor = color;
        clinActualDataSet.pointHoverBorderColor =
          this.chartDataColorsTranslucent[i + 1];

        Object.assign(clinActualDataSet, clinActualData);
        burnChartDataSets.push(clinActualDataSet);

        const clinProjectedData = {
          label: clin.idiq_clin_label + " Projected",
          dataSetId: clin.idiq_clin_label
            ? getIdText(clin.idiq_clin_label + "Projected")
            : clinNo + "DataProjected",
          data: projectedBurn[clinNo],
        };
        //eslint-disable-next-line prefer-const
        let clinProjectedDataSet: lineChartDataSet = _.clone(
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
    if (e && e.currentTarget) {
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

  public createTableItems(): void {
    this.idiqClins.forEach((idiqClin) => {
      //eslint-disable-next-line prefer-const
      let obj: {
        costClinNumber: string;
        clinStatus: string;
        clinLabel: string;
        popStart: string;
        popEnd: string;
        totalFundsSpent: string;
        totalFundsObligated: string;
        lastMonthSpent: string;
        clinAverage: number;
        timeUntilExpiration: string;
        spendTrend: number;
        idiqClin: string;
      } = {
        costClinNumber: "",
        clinStatus: "",
        clinLabel: "",
        popStart: "",
        popEnd: "",
        totalFundsSpent: "",
        totalFundsObligated: "",
        lastMonthSpent: "",
        clinAverage: 0,
        timeUntilExpiration: "",
        spendTrend: 0,
        idiqClin: "",
      };
      const clinNo = idiqClin.clin_number;
      obj.clinStatus = idiqClin.clin_status;
      obj.clinLabel = idiqClin.idiq_clin_label || "";
      obj.popStart = createDateStr(idiqClin.pop_start_date, true);
      obj.popEnd = createDateStr(idiqClin.pop_end_date, true);

      obj.totalFundsSpent = toCurrencyString(
        this.idiqClinSpendData[clinNo].idiqClinTotalSpend,
        true
      );
      obj.totalFundsObligated = toCurrencyString(
        parseFloat(idiqClin.funds_obligated.toString())
      );
      obj.lastMonthSpent = toCurrencyString(
        this.idiqClinSpendData[clinNo].lastMonthSpend
      );
      obj.idiqClin = clinNo;
      obj.clinAverage = this.idiqClinSpendData[clinNo].avgMonthlySpend;
      obj.timeUntilExpiration = this.timeUntilExpiration(idiqClin.pop_end_date);
      obj.spendTrend =
        ((this.idiqClinSpendData[clinNo].lastMonthSpend -
          this.idiqClinSpendData[clinNo].avgMonthlySpend) /
          this.idiqClinSpendData[clinNo].avgMonthlySpend) *
        100;
      const thisIdiqClin = this.idiqClins.find(
        (obj) => obj.clin_number === clinNo
      );
      if (thisIdiqClin) {
        obj.costClinNumber = thisIdiqClin.clin_number;
      }
      this.tableItems.push(obj);
      /// create object for totals
      this.totalSpendingObj.totalFundsSpent +=
        this.idiqClinSpendData[clinNo].idiqClinTotalSpend;
      this.totalSpendingObj.totalFundsObligated += parseFloat(
        idiqClin.funds_obligated.toString()
      );
      this.totalSpendingObj.lastMonthSpent +=
        this.idiqClinSpendData[clinNo].lastMonthSpend;
      this.totalSpendingObj.clinAverage +=
        this.idiqClinSpendData[clinNo].avgMonthlySpend;
      this.totalSpendingObj.spendTrend =
        ((this.totalSpendingObj.lastMonthSpent -
          this.totalSpendingObj.clinAverage) /
          this.totalSpendingObj.clinAverage) *
        100;
    });
  }

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
    //eslint-disable-next-line prefer-const
    let timeUnit = useMonths
      ? singular
        ? "month"
        : "months"
      : singular
        ? "day"
        : "days";
    return unitsRemaining + " " + timeUnit;
  }

  public async calculateTotalFunds(): Promise<void> {
    // total portfolio funds is sum of each IDIQ CLIN's funds obligated
    this.idiqClins.forEach((clin) => {
      this.totalPortfolioFunds =
        this.totalPortfolioFunds + parseFloat(clin.funds_obligated.toString());
    });
    
    // ATAT TODO -  adjust step size and Y Max based on total funds amount
    this.burnChartYMax = Math.ceil(this.totalPortfolioFunds / 100000) * 100000;
    this.burnChartYStepSize = Math.round(this.burnChartYMax / 6);

    this.lineChartOptions.scales.y.max = this.burnChartYMax;
    this.lineChartOptions.scales.y.ticks.stepSize = this.burnChartYStepSize;
  }

  public async getDashboardData():Promise<PortFolioDashBoardDTO>{
    return this.dashboardService.getdata(this.activeTaskOrderNumber, this.activeTaskOrderSysId);
  }
  public activeTaskOrderNumber = "";
  public activeTaskOrderSysId = "";
  public lastSyncDate = "";
  public hasObligatedFundsInUpcomingCLIN = false;

  public async checkForUpcomingObligatedFunds(data: PortFolioDashBoardDTO): Promise<void> {
    const currentPeriodPrefix = data.currentCLINs[0].clin_number.slice(0,2);
    const nextPeriodNumber = parseInt(currentPeriodPrefix) + 1;
    const nextPeriodPrefix = "0" + nextPeriodNumber;
    const nextPeriodCLINsWithOblFunds = data.allCLINs.filter(clin => {
      return clin.clin_number.indexOf(nextPeriodPrefix) === 0 
        && clin.funds_obligated.toString() !== "0";
    })
    this.hasObligatedFundsInUpcomingCLIN = nextPeriodCLINsWithOblFunds.length > 0;
  }

  public async loadOnEnter(): Promise<void> {
    this.activeTaskOrderNumber = PortfolioStore.activeTaskOrderNumber;
    this.activeTaskOrderSysId = PortfolioStore.activeTaskOrderSysId;

    const data = await this.getDashboardData();
    await this.checkForUpcomingObligatedFunds(data);
    
    this.taskOrder = data.taskOrder;
    this.costs = data.costs;
    this.costs.sort((a, b) => (a.clin_number > b.clin_number ? 1 : -1));
    this.costs.sort((a, b) => (a.year_month > b.year_month ? 1 : -1));
    this.idiqClins = data.currentCLINs;
    this.idiqClins.sort((a, b) => a.clin_number > b.clin_number ? 1 : -1);

    await this.calculateTotalFunds();

    this.costs.forEach((cost) => {
      cost.value = parseFloat(cost.value).toString();
    });
    await this.calculateFundsSpent();
    this.availableFunds = this.totalPortfolioFunds - this.fundsSpent;

    this.tooltipHeaderData = {
      title: "Total Funds Available",
      amount: this.getCurrencyString(this.availableFunds),
      legend: "Funds Available",
    };

    this.fundsSpentPercent = (this.fundsSpent / this.totalPortfolioFunds) * 100;
    
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
    if (this.fundsSpentPercent >= 75) {
      const arcColor = this.fundsSpentPercent < 100
        ? this.chartAuxColors.warning
        : this.chartAuxColors.error;
      this.arcGuageChartData.datasets[0].backgroundColor = [arcColor, this.chartDataColors.gray];
    }

    // all CLINs should run the entire duration of the current period, so use
    // the first one to set PoP start and end dates
    if (this.idiqClins.length > 0) {
      this.currentPoPStartISO = this.idiqClins[0].pop_start_date;
      this.currentPoPEndISO = this.idiqClins[0].pop_end_date;
    } else {
      this.currentPoPStartISO = this.taskOrder.pop_start_date;
      this.currentPoPEndISO = this.taskOrder.pop_end_date;
    }

    this.currentPoPStartStr = createDateStr(this.currentPoPStartISO, true);
    this.currentPoPEndStr = createDateStr(this.currentPoPEndISO, true);
    this.calculateTimeToExpiration();

    this.calculateBurnDown();
    this.createTableItems();
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
    return parseFloat(value.toFixed(decimals));
  }

  public getSpendPercent(value: number): number {
    const roundedVal = this.roundDecimal(value, 2);
    return Math.abs(roundedVal);
  }

  public getCurrencyString(value: number, decimals?: boolean): string {
    return getCurrencyString(value, decimals);
  }

}
</script>
