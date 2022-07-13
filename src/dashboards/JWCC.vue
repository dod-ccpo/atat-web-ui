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
                            $10,200,000
                          </span>
                          <p class="h3 mb-0 pb-1">JWCC funds spent to date</p>
                          <p class="mb-0 font-size-14">
                            Across all organizations, task orders, and portfolios
                          </p>
                        </div>
                        Active task orders


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

@Component({
  components: {
    ATATFooter,
    ATATPageHead
  }
})

export default class JWCCDashboard extends Vue {}

</script>
