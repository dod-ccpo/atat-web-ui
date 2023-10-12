<template>
  <div>
    <div class="mb-10">
        <FinancialDetailsAlert />
    </div>
    <ATATToast />
    <div v-if="!showDetails">
      <h2 class="pb-3">All task orders</h2>
      <div class="d-flex justify-space-between">
        <p class="mr-10">
          View details about the task orders associated with your portfolio below.
          You can request to modify an active task order to exercise an option or to change CLIN
          funding and period of performance details. You can also add a new task order to continue
          funding your cloud resources and support for this portfolio.
          <!--
          You can also add a new task order to continue funding your cloud
          resources and support for this portfolio.
          -->
        </p>
        <v-btn
        v-if="portfolioIsActive"
        outlined 
        class="ml-10 secondary" 
        @click="openSearchTOModal"
        > 
        Add follow-on task order 
      </v-btn>
      </div>
      <TaskOrderCard
        :isHistory="false"
        :taskOrders="taskOrders"
        :showDetails.sync="showDetails"
        :selectedTaskOrder.sync="selectedTaskOrder"
      />
    </div>
    <div v-show="showDetails">
      <TaskOrderDetails
        :selectedTaskOrder="selectedTaskOrder"
        :showDetails.sync="showDetails"
      />
    </div>
    <TaskOrderSearchModal
      :showTOSearchModal.sync="showTOSearchModal"
      :TONumber.sync="TONumber"
      :resetValidationNow.sync="resetValidationNow"
      @TOSearchCancelled="TOSearchCancelled"
      @startProvisionWorkflow="startProvisionWorkflow"
    /> 
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop} from "vue-property-decorator";
import FinancialDetailsAlert from "../../FinancialDetailsAlert.vue";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";
import {PortfolioTaskOrder, TaskOrderCardData, ToastObj} from "../../../../../types/Global";
import TaskOrderDetails from "@/portfolios/portfolio/components/TaskOrder/TaskOrderDetails.vue";
import PortfolioSummary from "@/store/portfolioSummary";
import { PortfolioSummaryObj } from "@/api/models";
import PortfolioStore from "@/store/portfolio";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";
import ATATToast from "@/components/ATATToast.vue";
import Toast from "@/store/toast";
import { Statuses } from "@/store/acquisitionPackage";
import { createDateStr, getStatusLabelFromValue, toCurrencyString } from "@/helpers";

@Component({
  components: {
    TaskOrderCard,
    TaskOrderDetails,
    FinancialDetailsAlert,
    TaskOrderSearchModal,
    ATATToast
  }
})
export default class TaskOrder extends Vue {
  @Prop() private portfolioSysId!: string;
  @Prop() public taskOrder!: PortfolioTaskOrder;;
  public activeTaskOrderNumber = "";
  public showDetails = false
  public taskOrders: TaskOrderCardData[] = [];
  public selectedTaskOrder:TaskOrderCardData = {} as TaskOrderCardData;
  public portfolioIsActive = true;
  public showTOSearchModal = false;
  public TONumber = "";
  public resetValidationNow = false;

  public provWorkflowRouteNames = {
    AwardedTaskOrder: "Awarded_Task_Order"
  };

  public async TOSearchCancelled(): Promise<void> {
    this.TONumber = "";
    this.resetValidationNow = true;
    this.showTOSearchModal = false;
    await PortfolioStore.setProvisioningTOFollowOn(false)
  }

  public async openSearchTOModal(): Promise<void> {
    await PortfolioStore.setProvisioningTOFollowOn(true)
    this.showTOSearchModal = true;
  }

  public async startProvisionWorkflow(): Promise<void>{
    await Steps.setAltBackDestination(AppSections.sectionTitles.PortfolioSummary);
    if (this.selectedTaskOrder.sys_id) {
      await PortfolioStore.setShowTOPackageSelection(false);
    }
    await PortfolioStore.setSelectedAcquisitionPackageSysId(
      this.selectedTaskOrder.sys_id as string
    );

    this.$router.push({
      name: this.provWorkflowRouteNames.AwardedTaskOrder,
      params: {
        direction: "next"
      },
      replace: true
    })
    AppSections.changeActiveSection(AppSections.sectionTitles.ProvisionWorkflow);
  }


  /**
   * loadOnEnter retrieves necessary data from the store
   */

  public async loadOnEnter(): Promise<void> {
    this.activeTaskOrderNumber = PortfolioStore.activeTaskOrderNumber;
    this.portfolioIsActive = PortfolioStore.currentPortfolio.status  === Statuses.Active.label;
    if(PortfolioStore.portfolioIsUpdating){
      const taskOrderUpdatedToast: ToastObj = {
        type: "success",
        message: "Task Order Number Updated",
        isOpen: true,
        hasUndo: false,
        hasIcon: true,
      };
      Toast.setToast(taskOrderUpdatedToast)
      PortfolioStore.setPortfolioIsUpdating(false)
    }
    const portfolioSummaryList = 
      await PortfolioSummary.getAllPortfolioSummaryList(false) as PortfolioSummaryObj[];
    if (portfolioSummaryList !== null){
      // refactor to build via array later
      console.log(this.taskOrder, 'task order')
      if(this.taskOrder.sys_id){
        this.taskOrders = [{
          sys_id: this.taskOrder.sys_id,
          taskOrderNumber: this.taskOrder.task_order_number,
          periodOfPerformance: createDateStr(this.taskOrder.pop_start_date, true) + " - " +
              createDateStr(this.taskOrder.pop_end_date, true),
          totalObligated: '$' + toCurrencyString(parseFloat(this.taskOrder.total_obligated_funds)),
          totalValue: '$' + toCurrencyString(parseFloat(this.taskOrder.total_task_order_value)),
          totalLifeCycle: '$' + toCurrencyString(parseFloat(this.taskOrder.total_lifecycle_amount)),
          totalFundsSpent: '$' + toCurrencyString(parseFloat(this.taskOrder.total_funds_spent)),
          clins: this.taskOrder.clins,
          status: this.taskOrder.task_order_status,
          statusLabel: getStatusLabelFromValue(this.taskOrder.task_order_status)
        }]
      }
    }
  }

  public async mounted(): Promise<void> {
    this.loadOnEnter();
  }

}
</script>

