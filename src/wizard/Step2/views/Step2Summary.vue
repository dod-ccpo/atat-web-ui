<template>
  <v-flex>
    <v-row>
      <v-col cols="10">
        <h2 class="h2">Your Task Order Summary</h2>
        <p class="my-3">
          If you have more Task Orders, <b>add</b> them below. You can also
          <b>edit</b> or <b>delete</b> any of the Task Orders you already
          entered. When you are done, click <b>Next</b> and we will walk you
          through adding your applications and environments
        </p>
      </v-col>
    </v-row>
    <atat-summary-card :data="cardsData"></atat-summary-card>
    <v-row>
      <v-col cols="10">
        <v-btn class="primary">
          <v-icon>control_point</v-icon>
          <div class="ml-2 font-weight-bold">Add another CLIN</div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-btn
          @click="showAdditionalFundingText = !showAdditionalFundingText"
          plain
          text
          x-small
          tabindex="1"
          :ripple="false"
          class="p-0 btn-usa-gov-expand h6"
        >
          <span
            class="USWDC-official-banner__link_msg text-decoration-underline"
          >
            Can i add additional funding sources after my Portfolio is
            provisioned?
          </span>
          <v-icon>
            {{ showAdditionalFundingText ? "expand_more" : "expand_less" }}
          </v-icon>
        </v-btn>
        <div v-show="showAdditionalFundingText">
          <v-card-text class="h6 pb-0">
            <v-row>
              <p>
                Yes. As the Portfolio Manager, you will be able add CLINs to
                existing Task Orders or add a new Task Order in the future. This
                will allow you to continue funding the Applications in this
                Portfolio after the period of performance has expired or after
                obligated funds have been exhausted.
                <br />
                <br />
                You will have the opportunity to invite other Portfolio Managers
                to help you manage funding for this Portfolio later.
              </p>
            </v-row>
          </v-card-text>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-btn
          @click="showPopText = !showPopText"
          plain
          text
          x-small
          tabindex="1"
          :ripple="false"
          class="p-0 btn-usa-gov-expand h6"
        >
          <span
            class="USWDC-official-banner__link_msg text-decoration-underline"
          >
            What happens to my Portfolio if the period of performance or
            obligated funds expire?
          </span>
          <v-icon>
            {{ showPopText ? "expand_more" : "expand_less" }}
          </v-icon>
        </v-btn>
        <div v-show="showPopText">
          <v-card-text class="h6 pb-0">
            <v-row align="center" class="mb-3">
              <p>
                If your Portfolio’s period of performance expires or if you run
                out of obligated funds, your team members will not be able to
                access your Applications within the CSP console.
                <br />
                <br />
                We will notify you when your funding sources are in danger of
                expiration, so that you have ample time to take action.
              </p>
            </v-row>
          </v-card-text>
        </div>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ATATSummaryCardItem,
  ATATSummaryCards,
  TaskOrders,
} from "types/Wizard";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step2Summary extends Vue {
  private showPopText = false;
  private showAdditionalFundingText = false;
  private mounted(): void {
    this.transformData();
  }
  private cardsData: ATATSummaryCards = {
    cards: [],
  };
  private taskOrderDetails: TaskOrders = {
    details: [
      {
        task_order_number: "TaskOrder_0001",
        clins: [
          {
            clin_number: "0001",
            idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
            total_clin_value: 200000,
            obligated_funds: 10000,
            pop_start_date: "2021-09-01",
            pop_end_date: "2022-09-01",
          },
          {
            clin_number: "0002",
            idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
            total_clin_value: 7500000,
            obligated_funds: 500000,
            pop_start_date: "2021-09-01",
            pop_end_date: "2022-09-01",
          },
        ],
      },
      {
        task_order_number: "TaskOrder_0002",
        clins: [
          {
            clin_number: "0001",
            idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
            total_clin_value: 2000,
            obligated_funds: 1000,
            pop_start_date: "2021-09-01",
            pop_end_date: "2022-09-01",
          },
          {
            clin_number: "0002",
            idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
            total_clin_value: 7000,
            obligated_funds: 6600,
            pop_start_date: "2021-09-01",
            pop_end_date: "2022-09-01",
          },
          {
            clin_number: "0002",
            idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
            total_clin_value: 10000,
            obligated_funds: 2600,
            pop_start_date: "2021-09-01",
            pop_end_date: "2022-09-01",
          },
        ],
      },
    ],
  };

  public transformData(): void {
    this.taskOrderDetails.details.forEach((c) => {
      let totalClinValue = c.clins.reduce((prev, cur) => {
        return prev + cur.total_clin_value;
      }, 0);

      let totalObligatedFunds = c.clins.reduce((prev, cur) => {
        return prev + cur.obligated_funds;
      }, 0);

      let card: ATATSummaryCardItem = {
        type: "TASK ORDER",
        title: c.task_order_number,
        showChevronRight: true,
        items: [
          {
            title: "CLINS",
            prefix: "",
            value: c.clins.length,
          },
          {
            title: "Total Value",
            prefix: "$",
            value: totalClinValue,
          },
          {
            title: "Obligated Funds",
            prefix: "$",
            value: totalObligatedFunds,
          },
        ],
        leftButtonText: "Edit",
        rightButtonText: "Delete",
      };
      this.cardsData.cards.push(card);
    });
  }
}
</script>
