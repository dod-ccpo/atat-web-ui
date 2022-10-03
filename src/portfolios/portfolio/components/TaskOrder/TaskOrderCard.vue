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
        />
      </div>
      <div class="d-flex">
        <div class="mr-15 pb-5">
          <span class="_title">Period of Performance</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.periodOfPerformance }}
          </span>
        </div>

        <div class="mr-15">
          <span class="_title">Total Obligated</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.totalObligated }}
          </span>
        </div>
        <div class="mr-15">
          <span class="_title">Total Value</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.totalValue }}
          </span>
        </div>
        <div class="mr-15">
          <span class="_title">Total Lifecyle</span>
          <span class="_title-value d-block nowrap">
            {{ cardData.totalLifeCycle }}
          </span>
        </div>
        <div class="flex-grow-1">
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
import { TaskOrderCardData } from "../../../../../types/Global";
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

  public statusChipBgColor(status:string): string {
    return getStatusChipBgColor(status);
  }
}
</script>


