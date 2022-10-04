<template>
  <div>
    <div class="pt-5">
      <h2 class="pb-3">All task orders</h2>
      <div class="d-flex justify-space-between ">
        <p class="mr-10">View details about the task orders associated with your portfolio below.
          You can request to modify an active task order to exercise an option or to change CLIN
          funding and period of performance details. You can also add a new task order to continue
          funding your cloud resources and support for this portfolio.
        </p>
        <v-btn
         outlined
         class="ml-10 secondary"
        >
          Add a new task order
        </v-btn>
      </div>
      <TaskOrderCard :taskOrders="taskOrderData" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import { TaskOrderCardData } from "../../../../../types/Global";

@Component({
  components: {
    TaskOrderCard
  }
})
export default class TaskOrder extends Vue {
  public taskOrderData:TaskOrderCardData[] = [];
  public orderNames = [
    "#HC1028-22-F-0141",
    "#HC1028-22-F-0131",
    "#HC1028-22-F-0151",
    "#HC1028-22-F-0161"
  ];
  public performancePeriod = [
    "Oct. 1, 2021 - Sept. 30, 2022",
    "Oct. 1, 2021 - Sept. 29, 2022",
    "Oct. 1, 2021 - Sept. 28, 2022",
    "Oct. 1, 2021 - Sept. 27, 2022"
  ];
  public obligatedValue = [
    "$1,000,000.00",
    "$1,000,000.00",
    "$1,000,000.00",
    "$1,000,000.00"
  ];
  public totalValue = [
    "$1,000,000.00",
    "$1,000,000.00",
    "$1,000,000.00",
    "$1,000,000.00"
  ];
  public lifeCycle = [
    "$1,000,000.00",
    "$1,000,000.00",
    "$1,000,000.00",
    "$1,000,000.00"
  ];
  public fundsSpent = [
    "$500,000.00",
    "$500,000.00",
    "$500,000.00",
    "$500,000.00"
  ];
  public status = [
    "On Track",
    "At-Risk",
    "Upcoming",
    "Expired",
  ];

  public createCardData(): void {
    for (let i = 0; i < this.orderNames.length; i++) {
      const taskOrder: TaskOrderCardData = {
        taskOrderNumber: "",
        periodOfPerformance: "",
        totalObligated: "",
        totalValue: "",
        totalLifeCycle: "",
        totalFundsSpent: "",
        status: "",
      };
      let idx = i;
      taskOrder.taskOrderNumber = this.orderNames[idx];
      taskOrder.periodOfPerformance = this.performancePeriod[idx];
      taskOrder.totalObligated = this.obligatedValue[idx];
      taskOrder.totalValue = this.totalValue[idx];
      taskOrder.totalLifeCycle = this.lifeCycle[idx];
      taskOrder.totalFundsSpent = this.fundsSpent[idx];
      taskOrder.status = this.status[idx]
      this.taskOrderData.push(taskOrder);

    }
  }

  public async loadOnEnter(): Promise<void> {
    this.createCardData();
  }
  public  mounted(): void {
    this.loadOnEnter();
  }
}
</script>

