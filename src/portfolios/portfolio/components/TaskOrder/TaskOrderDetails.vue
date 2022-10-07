<template>
  <div class="_task-order-details">
    <div class="d-flex align-center">
      <a
        id="LinkToTaskOrders"
        role="button"
        tabindex="0"
        @keydown.space="handleClick"
        @keydown.enter="handleClick"
        @click="handleClick"
      >
        Task Orders
      </a>
      <ATATSVGIcon
        class="mx-4"
        name="chevronRight"
        width="7"
        height="12"
        color="base"
      />
      <span
       class="text-base"
       id="TaskOrderNumber"
      >
        {{_selectedTaskOrder.taskOrderNumber}}
      </span>
    </div>
    <div class="pt-3 d-flex justify-space-between pb-5">
      <h1>{{_selectedTaskOrder.taskOrderNumber}}</h1>
      <v-btn
        id="ModifyTaskOrderButton"
        outlined
        class="secondary"
      >
        Request to modify task order
      </v-btn>
    </div>
    <div class="
    pt-5
    d-flex
    ">
      <v-card
        class="_task-order-card"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total obligated funds</span>
          <ATATTooltip
            :tooltipText="obligatedFundsToolTip"
            id="ObligatedFundsToolTip"
          />
        </div>
        <div class="h1">{{_selectedTaskOrder.totalObligated}}</div>
      </v-card>
      <v-card
        class="_task-order-card"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total task order value</span>
          <ATATTooltip
            :tooltipText="totalValueToolTip"
            id="TotalValueToolTip"
          />
        </div>
        <div class="h1">{{_selectedTaskOrder.totalValue}}</div>
      </v-card>
      <v-card
        class="_task-order-card"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total Lifecycle amount</span>
          <ATATTooltip
            :tooltipText="lifecycleTooltip"
            id="LifecycleToolTip"
          />
        </div>
        <div class="h1">{{_selectedTaskOrder.totalLifeCycle}}</div>
      </v-card>
      <v-card
        class="_task-order-card _last"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total funds spent</span>
          <ATATTooltip
            :tooltipText="totalFundsToolTip"
            id="TotalFundsToolTip"
          />
        </div>
        <div class="h1">{{_selectedTaskOrder.totalFundsSpent}}</div>
      </v-card>
    </div>
    <div>
      <v-data-table
        :headers="tableHeaders"
        :items="tableData"
        hide-default-footer
        class="_csp-admin-log border1 border-base-lighter"
      >
        <!-- eslint-disable vue/valid-v-slot -->
        <template v-slot:body="props">
          <tbody name="expand" :is="transitionGroup">
          <template >
            <tr
              class="row-item"
              :class="{'bg-info-lighter': item.status === 'Processing'}"
              v-for="item in props.items" :key="item.email"
            >
              <td>{{item.email}}</td>
              <td>
                <div class="d-flex align-center">
                  <div
                    class="_icon-circle"
                    :class="statusImg[item.status].bgColor"
                  >
                    <ATATSVGIcon
                      :name="statusImg[item.status].name"
                      :width="statusImg[item.status].width"
                      :height="statusImg[item.status].height"
                      :color="statusImg[item.status].color"
                    />
                  </div>
                  <div class="d-flex flex-column font-weight-500">
                    {{item.status}}
                    <span
                      v-if="item.status === 'Failed'"
                      class="font-size-12 text-base"
                    >
                        CSP account already exist
                      </span>
                  </div>
                </div>

              </td>
              <td>{{item.createdBy}}</td>
              <td>{{item.created}}</td>
            </tr>
          </template>
          </tbody>
        </template>
        <!-- eslint-disable vue/valid-v-slot -->
        <template v-slot:footer>
          <div class="_table-pagination">
              <span class="mr-11 font-weight-400 font-size-14">
              Showing
            </span>
          </div>
        </template>
      </v-data-table>
    </div>

    <div v-if="!isAlertClosed" class="mt-10">
      <ATATAlert
        id="TaskOrderDetailsAlert"
        type="info"
        closeButton="true"
      >
        <template v-slot:content>
          <p class="mb-0">
            NOTE: Spend data is provided by your CSP to assist with tracking expended funds across
            each CLIN. Values and percentages are based on your latest monthly invoice and may not
            reflect real-time cloud and support charges. Before requesting a task order
            modification, we recommend logging in to your CSP console to get detailed cost
            analyses and breakdowns.
          </p>
        </template>
      </ATATAlert>
    </div>
    <div>
      <v-expansion-panels class="pt-6" ripple="false" elevation="0">
        <v-expansion-panel>
          <v-expansion-panel-header class="d-flex">
            <h2>
              Task Order
            </h2>
            <span
              class="text-base font-size-20 pl-2"
              id="TaskOrderHistoryNumber"
            >1</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <TaskOrderCard
              :isHistory="true"
              :taskOrders="[_selectedTaskOrder]"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, PropSync } from "vue-property-decorator";
import { TaskOrderCardData } from "../../../../../types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import TaskOrderCard from "@/portfolios/portfolio/components/TaskOrder/TaskOrderCard.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
@Component({
  components: {
    TaskOrderCard,
    ATATSVGIcon,
    ATATTooltip,
    ATATAlert
  }
})
export default class TaskOrderDetails extends Vue {
  @PropSync("selectedTaskOrder",{default: {}}) private _selectedTaskOrder!: TaskOrderCardData;
  @PropSync("showDetails",{default: false}) private _showDetails!: boolean;

  public transitionGroup = ""


  public obligatedFundsToolTip = "Total of all obligations (i.e. funded CLINs) in the base period" +
    " and exercised option periods. This may represent 100% of your total task order value, or a" +
    " portion of it.";
  public totalValueToolTip = "Total of all exercised CLINs in the base period and exercised" +
    " option periods.";
  public lifecycleTooltip = " Total value of all CLINs in all periods, both exercised and" +
    " options. This is the full amount of money requested in the task order, but " +
    "it does not have to be spent.";
  public totalFundsToolTip = "Total amount of the task order that has been spent and invoiced;" +
    " your expended obligations. Spend data is provided by your CSP, as of the last" +
    " monthly invoice.";
  get isAlertClosed(): boolean {
    return AcquisitionPackage.taskOrderDetailsAlertClosed
  }
  public handleClick(): void {
    this._showDetails = false
  }

  public tableHeaders: Record<string, string>[] = [
    { text: "CLIN", value: "clin" },
    { text: "Status", value: "status" },
    { text: "Period of performance", value: "PoP" },
    { text: "Total CLIN value", value: "totalCLINValue" },
    { text: "Obligated funds", value: "obligatedFunds" },
    { text: "Total funds spent", value: "totalFundsSpent" },
  ];

  public async loadOnEnter(): Promise<void> {
    this.transitionGroup = "transition-group";
  }
  public  mounted(): void {
    this.loadOnEnter();
  }
}
</script>

