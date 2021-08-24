<template>
  <v-flex>
    <atat-summary-card :data="cardsData"></atat-summary-card>
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
