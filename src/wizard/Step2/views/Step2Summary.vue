<template>
  <v-flex>
    <v-row>
      <v-col cols="10">
        <h2 class="h2">Your Task Order Summary</h2>
        <p class="my-3 body-lg" v-show="cardsData.cards.length > 0">
          If you have more Task Orders, <strong>add</strong> them below. You can
          also <strong>edit</strong> or <strong>delete</strong> any of the Task
          Orders you already entered. When you are done, click
          <strong>Next</strong> and we will walk you through adding your
          applications and environments
        </p>
      </v-col>
    </v-row>
    <atat-summary-card
      :emptyCard="cardType"
      :data="cardsData"
    ></atat-summary-card>
    <v-row>
      <v-col cols="10">
        <v-btn to="/wizard/addfunding" class="primary" :ripple="false">
          <v-icon>control_point</v-icon>
          <div class="ml-2 font-weight-bold">Add a Task Order</div>
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
          class="pl-0 pt-5 btn-usa-gov-expand h6"
        >
          <span
            class="
              USWDC-official-banner__link_msg
              text-decoration-underline
              body-lg
            "
          >
            Can i add additional funding sources after my Portfolio is
            provisioned?
          </span>
          <v-icon>
            {{ showAdditionalFundingText ? "expand_less" : "expand_more" }}
          </v-icon>
        </v-btn>
        <div v-show="showAdditionalFundingText">
          <v-card-text class="h6 pb-0">
            <v-row>
              <p class="body-lg mt-3">
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
    <v-row style="height: 150px">
      <v-col cols="10">
        <v-btn
          @click="showPopText = !showPopText"
          plain
          text
          x-small
          tabindex="1"
          :ripple="false"
          class="pa-0 btn-usa-gov-expand h6 ml-0"
        >
          <span
            class="
              USWDC-official-banner__link_msg
              text-decoration-underline
              body-lg
            "
          >
            What happens to my Portfolio if the period of performance or
            obligated funds expire?
          </span>
          <v-icon>
            {{ showPopText ? "expand_less" : "expand_more" }}
          </v-icon>
        </v-btn>
        <div v-show="showPopText">
          <v-card-text class="h6 pb-0">
            <v-row align="center" class="mb-10">
              <p class="body-lg mt-3">
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
  private cardType = "Task Orders";
  private cardsData: ATATSummaryCards = {
    cards: [],
  };

  get taskOrders(): TaskOrders {
    return this.$store.getters.getMockTaskOrders;
  }

  public transformData(): void {
    this.taskOrders.details.forEach((c) => {
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
