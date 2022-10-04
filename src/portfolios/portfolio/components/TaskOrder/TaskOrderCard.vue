<template>
  <v-card
    elevation="0"
    class="_task-order-container"
  >
    <div
      v-for="(cardData, index) in taskOrders"
      :key="index"
      class="flex-grow-1">
      <div class="d-flex pb-1">
        <div class="card-header flex-grow-1 align-center">
          <a
            role="button"
            tabindex="0"
            :id="'TaskOrderLink'+ index"
            class="h3 _text-decoration-none"
          >
          Task Order  {{ cardData.taskOrderNumber }}
          </a>
          <ATATSVGIcon
          name="chevronRight"
          color="primary"
          :width="8"
          :height="13"
          class="d-inline-block mx-2 " />
        </div>
        <div>
          <v-chip
            :id="'StatusChip' + index"
            :class="[
              '_' + cardData.status.toLowerCase(),
              statusChipBgColor(cardData.status)
            ]"
            label
          >
            {{ cardData.status }}
          </v-chip>
        </div>
        <ATATMeatballMenu
          class="ml-4"
          :left="true"
          :id="'MeatballMenu' + index"
          :menuItems="menuItems(cardData.status)"
        />
      </div>
      <div class="d-flex">
        <div class="mr-15 pb-5" :id="'PoP'+ index">
          <span class="_title">Period of Performance</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.periodOfPerformance }}
          </span>
        </div>

        <div class="mr-15" :id="'ObligatedFunds'+ index">
          <span class="_title">Total Obligated</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.totalObligated }}
          </span>
        </div>
        <div class="mr-15" :id="'TotalValue'+index">
          <span class="_title">Total Value</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.totalValue }}
          </span>
        </div>
        <div class="mr-15" :id="'TotalLifecycle'+index">
          <span class="_title">Total Lifecyle</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.totalLifeCycle }}
          </span>
        </div>
        <div class="flex-grow-1" :id="'FundsSpent'+index">
          <span class="_title">Total Funds Spent</span>
          <span class="_title-value d-block">
           {{ cardData.totalFundsSpent }}
          </span>
        </div>
      </div>
      <hr
        v-if="index != taskOrders.length -1"
        class="my-6"
      />
    </div>

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { MeatballMenuItem, TaskOrderCardData } from "../../../../../types/Global";
import { getStatusChipBgColor } from "@/helpers";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";
@Component({
  components: {
    ATATSVGIcon,
    ATATMeatballMenu
  }
})
export default class TaskOrderCard extends Vue {
  @Prop() private taskOrders!:TaskOrderCardData;

  public TaskOrderCardMenuItems: MeatballMenuItem[] = [];

  public menuItems(status:string):
    ({ title: string } | { title: string } |
      { disabled: boolean; title: string } |
      { disabled: boolean; title: string })[]
  {
    if(status != 'Expired') {
      return [
        {
          title: "View task order details",
        },
        {
          title: "Request to modify task order",
        },
        {
          title: "Download task order (PDF)",
          disabled: true
        },
        {
          title: "View acquisition details",
          disabled: true
        },
      ]
    }
    return [
      {
        title: "View task order details",
      },
      {
        title: "Download task order",
        disabled: true
      },
      {
        title: "View acquisition details",
        disabled: true
      },
    ]
  }
  public statusChipBgColor(status:string): string {
    return getStatusChipBgColor(status);
  }

}
</script>


