<template>
  <div>
    <funding-table
      v-for="orders in taskOrders"
      :key="orders.task_order_number"
      :name="orders.task_order_number"
      :data="orders.clins"
    ></funding-table>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { TaskOrders } from "../../../../../types/Wizard";
import { Prop } from "vue-property-decorator";
import FundingTable from "@/views/wizard/Step5/components/FundingTable.vue";

@Component({
  components: { FundingTable },
})
export default class FundingSummaryCard extends Vue {
  @Prop({ default: null, required: true })
  private taskOrders!: TaskOrders;
}
</script>
