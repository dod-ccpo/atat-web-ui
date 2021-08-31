<template>
  <summary-card>
    <funding-table
      v-for="taskOrder in taskOrders.details"
      :key="taskOrder.task_order_number"
      :data="taskOrder.clins"
      :name="taskOrder.task_order_number"
  /></summary-card>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SummaryCard from "./SummaryCard.vue";
import { TaskOrders } from "../../../../types/Wizard";
import { Prop } from "vue-property-decorator";
import FundingTable from "@/wizard/Step5/components/FundingTable.vue";

@Component({
  components: { FundingTable },
})
export default class FundingSummaryCard extends SummaryCard {
  @Prop({ default: null, required: true })
  private taskOrders!: TaskOrders;
  mounted() {
    console.log(this.taskOrders);
  }
}
</script>
