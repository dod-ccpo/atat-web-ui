<template>
  <div class="_dashboard bg-base-lightest">
    <v-container class="container-max-width bg-base-lightest">
      <v-row v-if="fundingAlertType().length > 0">
        <v-col>
          <funding-alert
            :fundingAlertType="fundingAlertType()"
            :timeRemaining="daysRemaining()"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div id="app-content" class="d-flex flex-column">
            <div class="mb-auto" style="padding-bottom: 80px">
              <div class="d-flex justify-space-between width-100 mb-6">
                <h2>Overview</h2>
                <span class="text-base-dark">Last Sync: Nov. 15, 0100</span>
              </div>
              <v-row>
                <v-col class="col-sm-6 col-md-8">
                  <v-card
                    id="PortfolioDetailsCard"
                    class="_no-shadow v-sheet--outlined height-100 pa-8"
                  >
                    <h3 class="mb-6">Portfolio Details</h3>
                    <v-row>
                      <v-col>
                        <div
                          class="bg-info-lighter px-6 py-6"
                          style="border-radius: 4px"
                        >
                          <span id="AvailableFunds" class="h1 mb-0">
                            {{ getCurrencyString(availableFunds) }}
                          </span>
                          <p class="font-weight-bold mb-0 pb-5">
                            Available Funds
                          </p>
                          <p class="mb-0 font-size-14">
                            Your remaining portfolio balance from all of your
                            active task orders
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
                          Total value of your active task orders
                        </p>
                        <v-divider class="my-4" />
                        <p class="text-base-darkest mb-0 font-size-14">
                          Current Period of Performance
                        </p>
                        <span id="PoPDates" class="h3 mb-0">
                          {{ popStart }}&ndash;{{ popEnd }}
                        </span>
                        <p
                          class="text-base-dark mb-0 font-size-14"
                          v-if="!hasTimeSensativeAlert()"
                        >
                          {{ timeToExpiration }} to expiration
                        </p>
                        <div
                          class="d-flex justify-start align-top mb-0 font-size-14"
                          v-if="
                            hasTimeSensativeAlert() &&
                            daysRemaining() <= 60 &&
                            daysRemaining() > 0
                          "
                        >
                          <strong
                            >{{ daysRemaining() }} days to expiration</strong
                          >
                          <i
                            aria-hidden="true"
                            class="v-icon ml-2 text-warning-dark2
                             notranslate material-icons theme--light"
                          >
                            warning
                          </i>
                        </div>
                        <div
                          class="d-flex justify-start align-top atat-text-field-error 
                          text-error mb-0 font-size-14"
                          v-if="hasTimeSensativeAlert() && daysRemaining() <= 0"
                        >
                          <strong
                            >{{ daysPastExpiration() }} days past
                            expiration</strong
                          >
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
                      <div
                        v-if="
                          fundsSpentPercent >= 75 && fundsSpentPercent < 100
                        "
                      >
                        <i
                          aria-hidden="true"
                          class="v-icon ml-2 text-warning-dark2 notranslate 
                          material-icons theme--light"
                        >
                          warning
                        </i>
                      </div>
                      <div
                        v-if="
                          hasSpendingThresholdAlert() &&
                          fundingAlertData.spendingViolation >= 100
                        "
                      >
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
                      :center-text1="roundDecimal(fundsSpentPercent, 0) + '%'"
                      center-text2="Funds Spent"
                      :aria-label="
                        'Chart displaying ' +
                        fundsSpentPercent +
                        '% of Funds Spent'
                      "
                      :show-label-on-hover="false"
                      :isError="
                        hasSpendingThresholdAlert() &&
                        fundingAlertData.spendingViolation >= 100
                      "
                    />
                    <v-divider class="my-4" />
                    <p
                      class="mb-0 font-size-14"
                      v-if="
                        hasSpendingThresholdAlert() &&
                        fundingAlertData.spendingViolation >= 100
                      "
                    >
                      You&#8217;ve spent
                      <strong>{{ fundingAlertData.spendingViolation }}%</strong>
                      of your portfolio&#8217;s funds and there are
                      <strong>{{ daysRemaining() }} days remaining</strong>
                      until your next period of performance.
                    </p>
                    <p class="mb-0 font-size-14" v-else>
                      At your current rate of spending, you will run out of
                      funds by
                      <span class="nowrap font-weight-700"
                        >{{ runOutOfFundsDate }}.</span
                      >
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

              <v-row id="BurndownChartWrap">
                <v-col>
                  <v-card class="_no-shadow v-sheet--outlined pa-8">
                    <h3 class="mb-4">Actual and Projected Burn Rate</h3>
                    <p class="text-base-dark font-size-14">
                      Track your rate of spend and available funds throughout
                      the current period of performance. Forecasted future costs
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
                            {{ getCurrencyString(lastMonthSpend) }}
                          </span>
                          <span class="d-flex align-center">
                            <ATATSVGIcon
                              :name="
                                lastMonthSpendTrendPercent > 0
                                  ? 'trendingUp'
                                  : 'trendingDown'
                              "
                              width="20"
                              height="13"
                              class="mr-2"
                              :color="
                                lastMonthSpendTrendPercent > 0
                                  ? 'error'
                                  : 'success'
                              "
                            />
                            <span class="font-size-12 text-base-dark">
                              <span
                                :class="
                                  lastMonthSpendTrendPercent > 0
                                    ? 'text-error'
                                    : 'text-success-dark'
                                "
                              >
                                {{
                                  getSpendPercent(lastMonthSpendTrendPercent)
                                }}%
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
                            {{ getCurrencyString(endOfMonthForecast) }}
                          </span>
                          <span
                            class="d-flex align-center"
                            :class="
                              endOfMonthForecastTrendPercent > 0
                                ? 'text-error'
                                : 'text-success-dark'
                            "
                          >
                            <ATATSVGIcon
                              :name="
                                endOfMonthForecastTrendPercent > 0
                                  ? 'trendingUp'
                                  : 'trendingDown'
                              "
                              width="20"
                              height="13"
                              class="mr-2"
                              :color="
                                endOfMonthForecastTrendPercent > 0
                                  ? 'error'
                                  : 'success-dark'
                              "
                            />
                            <span class="font-size-12 text-base-dark">
                              <span
                                :class="
                                  endOfMonthForecastTrendPercent > 0
                                    ? 'text-error'
                                    : 'text-success-dark'
                                "
                              >
                                {{
                                  getSpendPercent(
                                    endOfMonthForecastTrendPercent
                                  )
                                }}%
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
                          <span class="h1 d-block">
                            {{ getCurrencyString(fundsSpent) }}
                          </span>
                        </v-card>
                      </v-col>
                      <v-col>
                        <v-card class="bg-base-lightest _no-shadow pa-4">
                          End-of-period forecast
                          <span class="h1 d-block mt-2">
                            {{ getCurrencyString(endOfPeriodForecast) }}
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
                      The chart below shows the proportion of funds spent and
                      funds estimated to be invoiced compared to the total funds
                      available in this portfolio. The data includes money spent
                      on all active task orders during this period of
                      performance.
                    </p>
                    <funding-alert
                      :fundingAlertType="popFundsAt100Percent"
                      v-if="
                        hasSpendingThresholdAlert() &&
                        fundingAlertData.spendingViolation >= 100
                      "
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
                            <div
                              style="flex: 1"
                              class="pr-4 py-2 d-flex align-center"
                            >
                              <span
                                class="_legend-square"
                                :style="
                                  'background-color: ' + donutChartColors[index]
                                "
                              >
                              </span>
                              <strong>{{ label }}</strong>
                            </div>
                            <div class="pr-4 py-2">
                              {{
                                getCurrencyString(
                                  portfolioFundsObj[label],
                                  false
                                )
                              }}
                            </div>
                            <div
                              style="width: 50px"
                              class="text-right font-weight-700 py-2"
                            >
                              {{
                                roundDecimal(
                                  donutChartData.datasets[0].data[index],
                                  1
                                )
                              }}%
                            </div>
                          </div>

                          <hr style="margin: 8px 0" />
                          <div
                            class="d-flex justify-space-between font-size-14"
                          >
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
                              {{
                                getCurrencyString(totalPortfolioFunds, false)
                              }}
                            </div>
                            <div style="width: 50px"></div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>

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
                                        {{ item.timeTilExpiration }} to
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
            </div>
            <ATATFooter />
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
import AcquisitionPackage from "@/store/acquisitionPackage";
import TaskOrder from "@/store/taskOrder";
import Portfolio, {
  AlertTypes,
  FundingAlertData,
  FundingAlertTypes,
} from "@/store/portfolio";
import { createDateStr, toCurrencyString, getIdText, roundTo100 } from "@/helpers";
import { CostsDTO, TaskOrderDTO, ClinDTO } from "@/api/models";

import { add, startOfMonth, subDays } from "date-fns";
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
  private popExpiresSoonNoTOClin = FundingAlertTypes.POPExpiresSoonNoTOClin;
  private popExpiresSoonWithTOClin = FundingAlertTypes.POPExpiresSoonWithTOClin;
  private popExpired = FundingAlertTypes.POPExpired;
  private popFundsDepleted = FundingAlertTypes.POPFundsDepleted;
  private popFundsAt100Percent = FundingAlertTypes.POPFundsAt100Percent;

  dashboardService: DashboardService = new DashboardService();

  public get projectTitle(): string {
    return AcquisitionPackage.projectTitle !== ""
      ? AcquisitionPackage.projectTitle
      : "New Acquisition";
  }

  public totalPortfolioFunds = 0;
  public fundsSpent = 0;
  public availableFunds = 0;
  public fundsSpentPercent = 0;

  public popStart = "";
  public popEnd = "";
  public timeToExpiration = "";
  public runOutOfFundsDate = "";
  public monthlySpendAverage = 0;
  public lastMonthSpend = 0;
  public lastMonthSpendTrendPercent = 0;
  public endOfMonthForecast = 0;
  public endOfMonthForecastTrendPercent = 0; // for spending summary
  public estimatedFundsToBeInvoicedPercent = 0; // for donut chart
  public estimatedRemainingPercent = 0;
  public endOfPeriodForecast = 0;
  public monthsIntoPoP = 0;
  public monthsForEndOfPeriodForecast = 0;

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

  // Alerts
  private fundingAlertData: FundingAlertData = {
    alerts: [],
    daysRemaining: 0,
    spendingViolation: 0,
    fundingAlertType: "",
    hasLowFundingAlert: false,
  };

  private hasTimeSensativeAlert(): boolean {
    return this.fundingAlertData.alerts.some(
      (alert) => alert.alert_type === AlertTypes.TIME_REMAINING
    );
  }
  private hasSpendingThresholdAlert(): boolean {
    return this.fundingAlertData.alerts.some(
      (alert) =>
        alert.alert_type === AlertTypes.SPENDING_ACTUAL &&
        this.fundingAlertData.spendingViolation >= 75
    );
  }
  private daysPastExpiration(): number {
    return Math.abs(this.fundingAlertData.daysRemaining);
  }

  private fundingAlertType(): string {
    return this.fundingAlertData.fundingAlertType;
  }

  private daysRemaining(): number {
    return this.fundingAlertData.daysRemaining;
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
    const popEndDate = parseISO(this.taskOrder.pop_end_date, {
      additionalDigits: 1,
    });

    const end = new Date(popEndDate.setHours(0, 0, 0, 0));
    const todayDate = new Date();
    const today = new Date(todayDate.setHours(0, 0, 0, 0));

    const daysUntilEndDate = differenceInCalendarDays(end, today);
    const monthsUntilEndDate = differenceInCalendarMonths(end, today);

    this.monthsForEndOfPeriodForecast = monthsUntilEndDate - 1;

    const unitsRemaining =
      daysUntilEndDate <= 90 ? daysUntilEndDate : monthsUntilEndDate;
    const useMonths = daysUntilEndDate > 90;
    const singular = unitsRemaining === 1;
    //eslint-disable-next-line prefer-const 
    let timeUnit = useMonths
      ? singular ? "month" : "months"
      : singular ? "day" : "days";
    this.timeToExpiration = unitsRemaining + " " + timeUnit;

    // calculate when will run out of funds based on current rate of spending
    const popStartDate = parseISO(this.taskOrder.pop_start_date, {
      additionalDigits: 1,
    });
    const start = new Date(popStartDate.setHours(0, 0, 0, 0));
    this.monthsIntoPoP = differenceInCalendarMonths(today, start);
    let endOfSpending = startOfMonth(today);
    endOfSpending = subDays(endOfSpending, 1);
    const daysSinceStartDate = differenceInCalendarDays(endOfSpending, start);
    if (daysSinceStartDate > -1) {
      const dailySpend = this.fundsSpent / daysSinceStartDate;
      const daysUntilAllFundsSpent = Math.round(this.availableFunds / dailySpend);
      const runOutOfFundsDate = add(today, { days: daysUntilAllFundsSpent });
      const runOutISODate = formatISO(runOutOfFundsDate, {
        representation: "date",
      });
      this.runOutOfFundsDate = createDateStr(runOutISODate, true);
    }
  }

  public donutChartPercentages: number[] = [];

  public calculateBurnDown(): void {
    const uniqueDates = [
      ...new Set(this.costs.map((cost) => cost.year_month)),
    ].sort();
    const uniqueCostClins = [
      ...new Set(this.costs.map((cost) => cost.clin)),
    ].sort();
    const uniqueIdiqClins = [
      ...new Set(this.idiqClins.map((clin) => clin.idiq_clin)),
    ].sort();
    //eslint-disable-next-line prefer-const 
    let clinCosts: Record<string, Record<string, string>> = {};
    uniqueCostClins.forEach((clinNo) => {
      //eslint-disable-next-line prefer-const 
      let clinValues: Record<string, string> = {};
      uniqueDates.forEach((date) => {
        const clin = this.costs.find(
          (cost) => cost.clin === clinNo && cost.year_month === date
        );
        if (clin && clin.is_actual === "true") {
          clinValues[date] = clin.value;
        } else if (clin) {
          this.endOfMonthForecast += parseFloat(clin.value);
        }
      });
      clinCosts[clinNo] = clinValues;
    });

    this.estimatedFundsToBeInvoicedPercent =
      (this.endOfMonthForecast / this.totalPortfolioFunds) * 100;

    this.estimatedRemainingPercent =
      100 - this.fundsSpentPercent - this.estimatedFundsToBeInvoicedPercent;

    this.donutChartPercentages = [
      this.fundsSpentPercent,
      this.estimatedFundsToBeInvoicedPercent,
      this.estimatedRemainingPercent,
    ];
    this.portfolioFundsObj = {
      "Funds spent": this.fundsSpent,
      "Estimated funds to be invoiced": this.endOfMonthForecast,
      "Estimated funds available":
        (this.totalPortfolioFunds * this.estimatedRemainingPercent) / 100,
    };
    this.donutChartData.datasets[0].data = roundTo100(
      this.donutChartPercentages,
      true
    );

    const popStartISO = this.taskOrder.pop_start_date;
    const popStartDate = parseISO(popStartISO);
    const periodDatesISO = [popStartISO];
    const periodDates = [popStartDate];

    const popEndISO = this.taskOrder.pop_end_date;
    const popEndDate = parseISO(popEndISO);

    let month = popStartDate;
    //eslint-disable-next-line prefer-const 
    let monthsToAdd = differenceInCalendarMonths(popEndDate, popStartDate);

    for (let i = 0; i < monthsToAdd; i++) {
      month = add(popStartDate, { months: i + 1 });
      periodDates.push(month);

      periodDatesISO.push(formatISO(month, { representation: "date" }));
    }

    const startMonthNo = popStartDate.getMonth();
    const popEndYear = popEndDate.getFullYear();
    let januaryCount = 0;
    for (let i = startMonthNo; i < startMonthNo + monthsToAdd + 2; i++) {
      let monthAbbr =
        i <= 11 ? this.monthAbbreviations[i] : this.monthAbbreviations[12 - i];
      if (monthAbbr === "Jan") {
        monthAbbr =
          januaryCount === 0
            ? monthAbbr + " " + popEndYear
            : monthAbbr + " " + (popEndYear + 1);
        januaryCount++;
      }
      this.burnChartXLabels.push(monthAbbr);
    }
    //eslint-disable-next-line prefer-const 
    let actualBurn: Record<string, (number | null)[]> = {};
    //eslint-disable-next-line prefer-const 
    let projectedBurn: Record<string, (number | null)[]> = {};
    const totalActualBurnData: (number | null)[] = [this.totalPortfolioFunds];
    const totalProjectedBurnData: (number | null)[] = [null];

    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    uniqueIdiqClins.forEach((idiqClinNo) => {
      const thisIdiqClin = this.idiqClins.find(
        (clin) => clin.idiq_clin === idiqClinNo
      );
      if (thisIdiqClin) {
        const costClinNo = thisIdiqClin.clin_number;
        //eslint-disable-next-line prefer-const 
        let fundsObligated = thisIdiqClin.funds_obligated;
        let fundsAvailable = !isNaN(parseInt(fundsObligated))
          ? parseInt(fundsObligated)
          : 0;

        if (fundsAvailable) {
          const thisclinCosts = clinCosts;
          const actual: (number | null)[] = [
            parseFloat(thisIdiqClin.funds_obligated),
          ];
          const projected: (number | null)[] = [];

          periodDatesISO.forEach((monthISO, i) => {
            const value = parseFloat(thisclinCosts[monthISO]);
            const thisMonthAmount = !isNaN(value) ? value : null;
            fundsAvailable = thisMonthAmount
              ? fundsAvailable - thisMonthAmount
              : fundsAvailable;

            const month = parseISO(monthISO).getMonth() + 1;
            const isCurrentMonth = month === currentMonth;
            const isActual = month < currentMonth;

            const actualVal = isActual ? fundsAvailable : null;
            actual.push(actualVal);

            const projectedVal = isCurrentMonth ? fundsAvailable : null;
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

    uniqueIdiqClins.forEach((idiqClinNo) => {
      const thisIdiqClin = this.idiqClins.find(
        (obj) => obj.idiq_clin === idiqClinNo
      );
      const costClinNo = thisIdiqClin?.clin_number;
      const costClinsForThisIdiqClin = this.costs.filter((cost) => {
        return (
          cost.clin === costClinNo && cost.value && cost.is_actual === "true"
        );
      });
      const thisIdiqClinSpending: number[] = [];
      costClinsForThisIdiqClin.forEach((obj) =>
        obj.value !== null
          ? thisIdiqClinSpending.push(parseInt(obj.value))
          : null
      );
      const idiqClinTotalSpend = thisIdiqClinSpending.reduce(
        (partialSum, a) => partialSum + a,
        0
      );

      const len = costClinsForThisIdiqClin.length;
      const lastMonthSpend = len > 0 ? parseFloat(
        costClinsForThisIdiqClin[len - 1].value
      ) : 0;
      const avgMonthlySpend =
        Math.round((idiqClinTotalSpend / this.monthsIntoPoP) * 100) / 100;

      const idiqClinSpendData = {
        idiqClinTotalSpend,
        lastMonthSpend,
        avgMonthlySpend,
      };
      this.idiqClinSpendData[idiqClinNo] = idiqClinSpendData;
    }, this);
    const monthsWithSpend = totalActualBurnData.filter((amt) => amt !== null);
    const len = monthsWithSpend.length - 1;
    this.monthlySpendAverage = Math.round((this.fundsSpent / len) * 100) / 100;

    if (len && len >= 2) {
      const twoMoAgoAvl = monthsWithSpend[len - 1];
      const lastMoAvl = monthsWithSpend[len];
      if (twoMoAgoAvl && lastMoAvl) {
        this.lastMonthSpend = twoMoAgoAvl - lastMoAvl;
        this.lastMonthSpendTrendPercent =
          ((this.lastMonthSpend - this.monthlySpendAverage) /
            this.monthlySpendAverage) *
          100;
      }
    }

    this.endOfMonthForecastTrendPercent =
      ((this.endOfMonthForecast - this.monthlySpendAverage) /
        this.monthlySpendAverage) *
      100;

    const m = this.monthsForEndOfPeriodForecast;
    this.endOfPeriodForecast =
      this.fundsSpent + this.endOfMonthForecast + this.monthlySpendAverage * m;

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

    uniqueIdiqClins.forEach((idiqClinNo, i) => {
      this.checked.push(true);

      const color = this.chartDataColorSequence[i + 1];
      const clin = this.idiqClins.find((clin) => clin.idiq_clin === idiqClinNo);
      if (clin && this.burnChartData.datasets) {
        const clinActualData = {
          label: clin.idiq_clin_label,
          dataSetId: clin.idiq_clin_label
            ? getIdText(clin.idiq_clin_label + "Actual")
            : idiqClinNo + "Data",
          data: actualBurn[idiqClinNo],
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
            : idiqClinNo + "DataProjected",
          data: projectedBurn[idiqClinNo],
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
        timeTilExpiration: string;
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
        timeTilExpiration: "",
        spendTrend: 0,
        idiqClin: "",
      };
      const idiqClinNo = idiqClin.idiq_clin;
      obj.clinStatus = idiqClin.clin_status;
      obj.clinLabel = idiqClin.idiq_clin_label || "";
      obj.popStart = createDateStr(idiqClin.pop_start_date, true);
      obj.popEnd = createDateStr(idiqClin.pop_end_date, true);

      obj.totalFundsSpent = toCurrencyString(
        this.idiqClinSpendData[idiqClinNo].idiqClinTotalSpend,
        true
      );
      obj.totalFundsObligated = toCurrencyString(
        parseInt(idiqClin.funds_obligated)
      );
      obj.lastMonthSpent = toCurrencyString(
        this.idiqClinSpendData[idiqClinNo].lastMonthSpend
      );
      obj.idiqClin = idiqClinNo;
      obj.clinAverage = this.idiqClinSpendData[idiqClinNo].avgMonthlySpend;
      obj.timeTilExpiration = this.timeTilExpiration(idiqClin.pop_end_date);
      obj.spendTrend =
        ((this.idiqClinSpendData[idiqClinNo].lastMonthSpend -
          this.idiqClinSpendData[idiqClinNo].avgMonthlySpend) /
          this.idiqClinSpendData[idiqClinNo].avgMonthlySpend) *
        100;
      const thisIdiqClin = this.idiqClins.find(
        (obj) => obj.idiq_clin === idiqClinNo
      );
      if (thisIdiqClin) {
        obj.costClinNumber = thisIdiqClin.clin_number;
      }
      this.tableItems.push(obj);
      /// create object for totals
      this.totalSpendingObj.totalFundsSpent +=
        this.idiqClinSpendData[idiqClinNo].idiqClinTotalSpend;
      this.totalSpendingObj.totalFundsObligated += parseInt(
        idiqClin.funds_obligated
      );
      this.totalSpendingObj.lastMonthSpent +=
        this.idiqClinSpendData[idiqClinNo].lastMonthSpend;
      this.totalSpendingObj.clinAverage +=
        this.idiqClinSpendData[idiqClinNo].avgMonthlySpend;
      this.totalSpendingObj.spendTrend =
        ((this.totalSpendingObj.lastMonthSpent -
          this.totalSpendingObj.clinAverage) /
          this.totalSpendingObj.clinAverage) *
        100;
    });
  }

  public timeTilExpiration(endDate: string): string {
    const popEndDate = parseISO(endDate, { additionalDigits: 1 });
    const end = new Date(popEndDate.setHours(0, 0, 0, 0));
    const todayDate = new Date();
    const today = new Date(todayDate.setHours(0, 0, 0, 0));
    const daysUntilEndDate = differenceInCalendarDays(end, today);
    const monthsUntilEndDate = differenceInCalendarMonths(end, today);

    this.monthsForEndOfPeriodForecast = monthsUntilEndDate - 1;

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
        this.totalPortfolioFunds + parseInt(clin.funds_obligated);
    });

    this.burnChartYMax = Math.ceil(this.totalPortfolioFunds / 100000) * 100000;
    this.burnChartYStepSize = Math.round(this.burnChartYMax / 6);

    this.lineChartOptions.scales.y.max = this.burnChartYMax;
    this.lineChartOptions.scales.y.ticks.stepSize = this.burnChartYStepSize;
  }

  public async getDashboardData():Promise<PortFolioDashBoardDTO>{
    return this.dashboardService.getdata(this.activeTaskOrderNumber);
  }
  public activeTaskOrderNumber = "";
  public async loadOnEnter(): Promise<void> {
    this.activeTaskOrderNumber = PortfolioStore.activeTaskOrderNumber;
    const data = await this.getDashboardData();
    // TODO - account for no cost data in AT-8734
    this.taskOrder = data.taskOrder;
    this.costs = data.costs;
    this.costs.sort((a, b) => (a.clin > b.clin ? 1 : -1));
    this.costs.sort((a, b) => (a.year_month > b.year_month ? 1 : -1));
    this.idiqClins = data.clins;
    this.idiqClins.sort((a, b) => (a.idiq_clin > b.idiq_clin ? 1 : -1));

    await this.calculateTotalFunds();

    this.costs.forEach((cost) => {
      cost.value = parseInt(cost.value).toString();
    });
    await this.calculateFundsSpent();
    this.availableFunds = this.totalPortfolioFunds - this.fundsSpent;

    this.tooltipHeaderData = {
      title: "Total Funds Available",
      amount: this.getCurrencyString(this.availableFunds),
      legend: "Funds Available",
    };

    this.fundsSpentPercent = (this.fundsSpent / this.totalPortfolioFunds) * 100;
    this.arcGuageChartData.datasets[0].data = [
      this.fundsSpentPercent,
      100 - this.fundsSpentPercent,
    ];

    this.popStart = createDateStr(this.taskOrder.pop_start_date, true);
    this.popEnd = createDateStr(this.taskOrder.pop_end_date, true);

    this.calculateTimeToExpiration();

    this.calculateBurnDown();
    this.createTableItems();

    await this.processAlerts();
  }

  public async mounted(): Promise<void> {
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

  public spendingTooltipText = `This is the total value of all active task
    orders funding this portfolio`;

  public periodToDateTooltipText = `This is the total spend from the start of
    the current period of performance through last month. It does not include
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
    return "$" + toCurrencyString(value, decimals);
  }

  public async getAlerts(): Promise<FundingAlertData> {
    return Portfolio.getFundingTrackerAlert(this.activeTaskOrderNumber);
  }

  public async processAlerts(): Promise<void> {
    this.fundingAlertData = await this.getAlerts();
    //some of this functionality is temporary until we get
    //live data that matches the alerts
    if (
      this.fundingAlertData.hasLowFundingAlert &&
      this.fundingAlertData.spendingViolation >= 75
    ) {
      this.fundsSpentPercent = this.fundingAlertData.spendingViolation;
      const arcColor =
        this.fundingAlertData.spendingViolation < 100
          ? this.chartAuxColors.warning
          : this.chartAuxColors.error;
      this.arcGuageChartData.datasets[0].data = [
        this.fundsSpentPercent,
        100 - this.fundsSpentPercent,
      ];
      this.arcGuageChartData.datasets[0].backgroundColor = [
        arcColor,
        this.chartDataColors.gray,
      ];

      if (this.fundingAlertData.spendingViolation >= 100) {
        this.arcGuageChartData.datasets[0].color = "#c60634";
      }
    }
  }
}
</script>
