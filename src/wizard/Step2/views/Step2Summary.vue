<template>
  <v-flex>
    <atat-summary-card :cards-data="taskOrderDetails"></atat-summary-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { TaskOrderDetails } from "types/Wizard";
import { Component } from "vue-property-decorator";

@Component({})
export default class Step2Summary extends Vue {
  private taskOrderDetails: TaskOrderDetails = {
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
        clin_number: "0003",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 7500000,
        obligated_funds: 500000,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
    ],
  };
}
</script>
