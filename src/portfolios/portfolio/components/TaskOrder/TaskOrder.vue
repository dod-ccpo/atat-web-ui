<template>
  <div>
    <div v-if="!showDetails">
      <h2 class="pb-3">All task orders</h2>
      <div class="d-flex justify-space-between">
        <p class="mr-10">
          View details about the task orders associated with your portfolio
          below. You can request to modify an active task order to exercise an
          option or to change CLIN funding and period of performance details.
          <!--
          You can also add a new task order to continue funding your cloud
          resources and support for this portfolio.
          -->
        </p>
        <!-- 
        <v-btn outlined class="ml-10 secondary"> Add a new task order </v-btn>
        -->
      </div>
      <TaskOrderCard
        :isHistory="false"
        :taskOrders="taskOrders"
        :showDetails.sync="showDetails"
        :selectedTaskOrder.sync="selectedTaskOrder"
      />
    </div>
    <div v-if="showDetails">
      <TaskOrderDetails
        :selectedTaskOrder="selectedTaskOrder"
        :showDetails.sync="showDetails"
      />
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component } from "vue-property-decorator";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import {TaskOrderCardData} from "../../../../../types/Global";
import TaskOrderDetails from "@/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.vue";
import PortfolioSummary from "@/store/portfolioSummary";
import { PortfolioSummaryDTO } from "@/api/models";
import { createDateStr, getStatusLabelFromValue, toCurrencyString } from "@/helpers";
import PortfolioStore from "@/store/portfolio";

@Component({
  components: {
    TaskOrderCard,
    TaskOrderDetails
  }
})
export default class TaskOrder extends Vue {
  public activeTaskOrderNumber = "";
  public showDetails = false
  public taskOrders: TaskOrderCardData[] = [];
  public selectedTaskOrder:TaskOrderCardData ={};

  /**
   * loadOnEnter retrieves necessary data from the store
   */

  public async loadOnEnter(): Promise<void> {
    this.activeTaskOrderNumber = PortfolioStore.activeTaskOrderNumber;
    const portfolioSummaryList = 
      await PortfolioSummary.getAllPortfolioSummaryList() as unknown as PortfolioSummaryDTO[];
    if (portfolioSummaryList !== null){
      this.taskOrders = portfolioSummaryList.flatMap(
        portfolio=>portfolio.task_orders.filter((
          (taskOrder)=>taskOrder.task_order_number===this.activeTaskOrderNumber
        )))
      
        .map((to)=>{
          return{
            sys_id: to.sys_id,
            taskOrderNumber: to.task_order_number,
            periodOfPerformance: createDateStr(to.pop_start_date, true) + " - " +
              createDateStr(to.pop_end_date, true),
            status: to.task_order_status,
            statusLabel: getStatusLabelFromValue(to.task_order_status),
            totalObligated: '$' + toCurrencyString(parseInt(to.funds_obligated)),
            totalValue: '$' + toCurrencyString(to.total_task_order_value || 0),
            totalLifeCycle: '$' + toCurrencyString(to.total_lifecycle_amount || 0),
            totalFundsSpent: '$' + toCurrencyString(to.funds_spent_task_order || 0),
            clins: to.clin_records
          }}
        )
    }
  }

  public async mounted(): Promise<void> {
    this.loadOnEnter();
  }

}
</script>

