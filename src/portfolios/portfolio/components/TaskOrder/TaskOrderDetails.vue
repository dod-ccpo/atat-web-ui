<template>
  <div class="_task-order-details">
    <div class="d-flex align-center">
      <a>Task Orders</a>
      <ATATSVGIcon
        class="mx-4"
        name="chevronRight"
        width="7"
        height="12"
        color="base"
      />
      <span
       class="text-base"
      >
        {{_selectedTaskOrder.taskOrderNumber}}
      </span>
    </div>
    <div class="pt-3 d-flex justify-space-between pb-5">
      <h1>{{_selectedTaskOrder.taskOrderNumber}}</h1>
      <v-btn
        outlined
        class="secondary"
      >
        Request to modify task order
      </v-btn>
    </div>
    <div class="
    pt-5
    d-flex justify-space-between
    ">
      <v-card
        class="pa-8 border1 border-base-lighter"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total obligated funds</span>
          <ATATTooltip
            :tooltipText="obligatedFundsToolTip"
            id="ObligatedFundsToolTip"
          />
        </div>
        <div class="h1 font-weight-700">{{_selectedTaskOrder.totalObligated}}</div>
      </v-card>
      <v-card
        class="pa-8 border1 border-base-lighter"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total task order value</span>
          <ATATTooltip
            :tooltipText="totalValueToolTip"
            id="TotalValueToolTip"
          />
        </div>
        <div class="h1 font-weight-700">{{_selectedTaskOrder.totalValue}}</div>
      </v-card>
      <v-card
        class="pa-8 border1 border-base-lighter"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total obligated funds</span>
          <ATATTooltip
            :tooltipText="obligatedFundsToolTip"
            id="ObligatedFundsToolTip"
          />
        </div>
        <div class="h1 font-weight-700">{{_selectedTaskOrder.totalObligated}}</div>
      </v-card>
      <v-card
        class="pa-8 border1 border-base-lighter"
        elevation="0"
      >
        <div class="d-flex">
          <span class="pr-2 font-weight-500">Total obligated funds</span>
          <ATATTooltip
            :tooltipText="obligatedFundsToolTip"
            id="ObligatedFundsToolTip"
          />
        </div>
        <div class="h1 font-weight-700">{{_selectedTaskOrder.totalObligated}}</div>
      </v-card>
    </div>
    {{_selectedTaskOrder}}
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, PropSync } from "vue-property-decorator";
import { TaskOrderCardData } from "../../../../../types/Global";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
@Component({
  components: {
    ATATSVGIcon,
    ATATTooltip
  }
})
export default class TaskOrderDetails extends Vue {
  @PropSync("selectedTaskOrder",{default: {}}) private _selectedTaskOrder!: TaskOrderCardData;

  public obligatedFundsToolTip = "Total of all obligations (i.e. funded CLINs) in the base period" +
    " and exercised option periods. This may represent 100% of your total task order value, or a" +
    " portion of it.";
  public totalValueToolTip = "Total of all exercised CLINs in the base period and exercised" +
    " option periods."
}
</script>

