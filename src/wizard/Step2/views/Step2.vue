<template>
  <v-flex>
    <CreateTaskOrderForm
      v-if="currentPhase === Step2Phases.AddingTasks"
      ref="createTaskOrderForm"
      :task_order_number.sync="taskOrderDetails.task_order_number"
      :task_order_file.sync="taskOrderDetails.task_order_file"
      :clins.sync="taskOrderDetails.clins"
      @add="addClin"
      @delete="deleteClin"
    />

    <task-order-summary
      v-if="currentPhase === Step2Phases.TaskSummary"
      @addNewTaskOrder="onTaskOrderSummaryAddNew"
    ></task-order-summary>
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";
import TaskOrderSummary from "@/wizard/Step2/components/TaskOrderSummary.vue";
import { TaskOrderDetails } from "types/Wizard";

@Component({
  components: {
    CreateTaskOrderForm,
    TaskOrderSummary,
  },
})
export default class Step_2 extends Vue {
  private Step2Phases = Object.freeze({ AddingTasks: 1, TaskSummary: 2 });

  private currentPhase = this.Step2Phases.TaskSummary;

  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };
  private taskOrderDetails: TaskOrderDetails = {
    task_order_number: "",
    task_order_file: {
      description: "",
      id: "",
      created_at: "",
      updated_at: "",
      size: 0,
      name: "",
      status: "",
    },
    clins: [
      {
        clin_number: "0001",
        idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
        total_clin_value: 200000,
        obligated_funds: 10000,
        pop_start_date: "2021-09-01",
        pop_end_date: "2022-09-01",
      },
    ],
  };

  private onTaskOrderSummaryAddNew(): void {
    this.currentPhase = this.Step2Phases.AddingTasks;
  }
  public async validateTaskCreation(): Promise<boolean> {
    let valid = false;
    valid = await this.$refs.createTaskOrderForm.validateForm();

    return valid;
  }

  public addClin(): void {
    this.taskOrderDetails.clins.push({
      clin_number: `000${this.taskOrderDetails.clins.length + 1}`,
      idiq_clin: "",
      total_clin_value: 0,
      obligated_funds: 0,
      pop_start_date: "",
      pop_end_date: "",
    });
  }

  public deleteClin(itemNumber: number): void {
    console.log(`delete ${itemNumber}`);
    const index = itemNumber - 1;
    if (this.taskOrderDetails.clins.length >= itemNumber) {
      this.taskOrderDetails.clins.splice(index, 1);
    }
  }

  public async canGoNext(): Promise<boolean> {
    debugger;

    switch (this.currentPhase) {
      case this.Step2Phases.AddingTasks:
        if (await this.validateTaskCreation()) {
          this.currentPhase = this.Step2Phases.TaskSummary;
          return false;
        }
        return false;

      case this.Step2Phases.TaskSummary:
        return true;
    }

    return false;
  }
}
</script>
