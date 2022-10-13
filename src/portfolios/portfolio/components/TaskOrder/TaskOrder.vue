<template>
    <div >
      <div v-if="!showDetails">
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
        <TaskOrderCard
          :isHistory="false"
          :taskOrders="taskOrderData"
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
import Vue from "vue";

import {Component} from "vue-property-decorator";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import {TaskOrderCardData} from "../../../../../types/Global";
import TaskOrderDetails from "@/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.vue";
import Portfolio from "@/store/portfolio";
import PortfolioSummary from "@/store/portfolioSummary";
import {TaskOrderDTO} from "@/api/models";
import {createDateStr, toCurrencyString} from "@/helpers";

@Component({
  components: {
    TaskOrderCard,
    TaskOrderDetails
  }
})
export default class TaskOrder extends Vue {
  public taskOrderData:TaskOrderCardData[] = [];
  public showDetails = false;
  public isLoading = false;
  public selectedTaskOrder:TaskOrderCardData = {
    taskOrderNumber: "",
    periodOfPerformance: "",
    totalObligated: "",
    totalValue: "",
    totalLifeCycle: "",
    totalFundsSpent: "",
    status: "",
  }

  /**
   * Uses 2 stores to get the portfolio summary list. Then filters the list to
   * get the portfolio and maps the task order data from the store to how the
   * data is expected by this component.
   */
  public async loadPortfolioDetailData(): Promise<void> {
    this.isLoading = true;
    const portfolioSysId = await Portfolio.currentPortfolio.sysId;
    const portfolioSummaryList = await PortfolioSummary.getAllPortfolioSummaryList();
    let toDTOList: TaskOrderDTO[] = [];
    const portfolioSummaryDTO = portfolioSummaryList?.find(portfolioSummary =>
      portfolioSummary.sys_id === portfolioSysId);
    if(portfolioSummaryDTO) {
      toDTOList = portfolioSummaryDTO.task_orders;
    }
    this.taskOrderData = toDTOList.map(toDTO => {
      const popStart = createDateStr(toDTO.pop_start_date, true);
      const popEnd = createDateStr(toDTO.pop_end_date, true);
      return {
        taskOrderNumber: toDTO.task_order_number,
        periodOfPerformance: popStart + " - " + popEnd,
        totalObligated: "$" + toCurrencyString(Number(toDTO.funds_obligated)),
        totalValue: "$" + toCurrencyString(Number(toDTO.total_task_order_value)),
        totalLifeCycle: "$" + toCurrencyString(Number(toDTO.total_lifecycle_amount)),
        totalFundsSpent: "$" + toCurrencyString(Number(toDTO.funds_spent_task_order)),
        status: toDTO.task_order_status
      }
    });
  }

  public  mounted(): void {
    this.loadPortfolioDetailData();
  }
}
</script>

