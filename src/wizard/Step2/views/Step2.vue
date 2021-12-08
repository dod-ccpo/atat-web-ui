<template>
  <v-flex>
    <CreateTaskOrderForm
      ref="createTaskOrderForm"
      :task_order_number.sync="model.task_order_number"
      :task_order_file.sync="model.task_order_file"
      :clins.sync="model.clins"
      :signed="model.signed"
      @add="addClin"
      @delete="deleteClin"
      :validate-on-load="touched"
    />
  </v-flex>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";
import { TaskOrderModel } from "../../../../types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";
import { Clin } from "types/TaskOrder";

Component.registerHooks(["beforeRouteLeave"]);
@Component({
  components: {
    CreateTaskOrderForm,
  },
})
export default class Step_2 extends ValidatableWizardStep<TaskOrderModel> {
  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };

  model: TaskOrderModel = this.$store.getters["wizard/getStepModel"](2);

  public validate: () => Promise<boolean> = async () => {
    this.valid = false;
    this.valid = await this.$refs.createTaskOrderForm.validateForm();
    return this.valid;
  };
  private isDisabled =
    this.model.clins.length == 1 && this.model.clins[0].clin_number == "";

  public addClin(): void {
    this.model.clins.push({
      clin_number: "",
      idiq_clin: "",
      total_clin_value: 0,
      obligated_funds: 0,
      pop_start_date: "",
      pop_end_date: "",
    });
    this.$refs.createTaskOrderForm.ExpandAddedClin(false);
  }

  public deleteClin(itemNumber: number): void {
    this.model.clins.splice(itemNumber - 1, 1);
  }
   private isClinCardNew(clin: Clin): boolean {
    return Object.values(clin).every((attrib) => attrib === "" || attrib === 0);
  }
  private removeEmptyClins(): void {
    const dirtyClins = this.model.clins.filter((c: any, idx: number) => {
      if (this.isClinCardNew(c) === false && idx < this.model.clins.length) {
        return c;
      }
    });
    this.model.clins = dirtyClins;
  }

   public async beforeRouteLeave(
    to: unknown,
    from: unknown,
    next: (n: void) => void
  ): Promise<void> {
    this.removeEmptyClins();
    next();
  }
}
</script>
