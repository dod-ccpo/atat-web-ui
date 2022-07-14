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
import ATATTooltip from "../components/ATATTooltip.vue"

import { DashboardService } from "@/services/dashboards";
import { toCurrencyString } from "@/helpers";
import { CostsDTO } from "@/api/models";
import differenceInCalendarMonths from 'date-fns/differenceInCalendarMonths';

@Component({
  components: {
    ATATFooter,
    ATATPageHead,
    ATATTooltip,
  }
})

export default class JWCCDashboard extends Vue {
  dashboardService: DashboardService = new DashboardService();

  public activeTaskOrderCount = 0;
  public costs: CostsDTO[] = [];
  public totalObligatedFunds = 0;
  public totalTaskOrderValue = 0;
  public averageMonthlySpend = 0;
  public fundsSpentToDate = 0;
  public monthsIntoPeriod = 0; // for MVP, period is always Jan 1 to Dec 31

  public async loadOnEnter(): Promise<void> {
    const data = await this.dashboardService.getTotals([ '1000000001234', 
      '1000000004321', 
      '1000000009999', 
      '1000000009876', 
      '1000000008888',
      '1000000008765']);
    console.log({data});
    this.activeTaskOrderCount = data.activeTaskOrders;
    this.totalObligatedFunds = data.totalObligatedFunds;
    this.totalTaskOrderValue = data.totalTaskOrderValue;
    this.fundsSpentToDate = data.fundsSpentToDate;
    this.costs = data.costs;
    
    const today = new Date(new Date().setHours(0,0,0,0));
    const thisYear = today.getFullYear();
    // for MVP, period start will always be Jan 1 of current year
    const periodStart = new Date(thisYear + "-01-01T00:00:00");
    this.monthsIntoPeriod = differenceInCalendarMonths(today, periodStart);
    this.averageMonthlySpend = Math.round(this.fundsSpentToDate / this.monthsIntoPeriod);
  }

  public async mounted(): Promise<void>{
    await this.loadOnEnter();
  }

  public getCurrencyString(value: number, decimals?: boolean): string {
    return "$" + toCurrencyString(value, decimals);
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
