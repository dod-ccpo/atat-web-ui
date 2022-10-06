<template>
  <v-card
    elevation="0"
  >
    <div
      v-for="(cardData, index) in taskOrders"
      :key="index"
      :class="{ '_first': index === 0, '_last': index === taskOrders.length -1 }"
      class="d-flex flex-column flex-grow-1 _task-order-container">
      <div class="d-flex pb-1 ">
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
          :menuIndex="index"
          :menuItems="menuItems(cardData.status)"
          @menuItemClick="handleClick"
        />
      </div>
      <div class="d-flex">
        <div class="mr-15 pb-4" :id="'PoP'+ index">
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
    </div>

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync } from "vue-property-decorator";
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
  @PropSync("showDetails",{default: false}) private _showDetails!: boolean;


  public menuItems(status:string):MeatballMenuItem[] {
    const dropDownItems: MeatballMenuItem[] = [
      {
        title: "View task order details",
        action: 'showTaskOrderDetails',
      },
      {
        title: "Download task order (PDF)",
        hidden: true
      },
      {
        title: "View acquisition details",
        hidden: true
      },
    ];
    if (status !== "Expired") {
      dropDownItems.splice(1,0, {
        title: "Request to modify task order",
        hidden: false
      });
    }
    return dropDownItems;
  }

  public async handleClick(menuItem: MeatballMenuItem): Promise<void> {
    if(menuItem.action == "showTaskOrderDetails"){
      this._showDetails = true
    }
  }
  public statusChipBgColor(status:string): string {
    return getStatusChipBgColor(status.toLowerCase());
  }

}
</script>


