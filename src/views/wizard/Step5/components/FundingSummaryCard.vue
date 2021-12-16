<template>
  <div>
    <funding-table
      v-for="order in taskOrders"
      :key="order.task_order_number"
      :name="order.task_order_number"
      :data="order.clins"
      :id="order.id"
      :task-order-file="order.task_order_file"
    ></funding-table>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { TaskOrderModel } from "../../../../../types/Wizard";
import { Prop } from "vue-property-decorator";
import FundingTable from "@/views/wizard/Step5/components/FundingTable.vue";

@Component({
  components: { FundingTable },
})
export default class FundingSummaryCard extends Vue {
  @Prop({ default: null, required: true })
  private taskOrders!: TaskOrderModel[];
}
</script>
