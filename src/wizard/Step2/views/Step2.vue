<template>
  <v-flex>
    <CreateTaskOrderForm
      ref="createTaskOrderForm"
      :task_order_number.sync="model.task_order_number"
      :task_order_file.sync="model.task_order_file"
      :clins.sync="model.clins"
      @add="addClin"
      @delete="deleteClin"
      :validate-on-load="touched"
    />
  </v-flex>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";
import { TaskOrderDetails } from "../../../../types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";

@Component({
  components: {
    CreateTaskOrderForm,
  },
})
export default class Step_2 extends ValidatableWizardStep<TaskOrderDetails> {
  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };

  model: TaskOrderDetails = this.$store.getters.getStepModel(2);
  private touched = false;
  private valid = true;

  public validate: () => Promise<boolean> = async () => {
    let valid = false;
    valid = await this.$refs.createTaskOrderForm.validateForm();
    this.$store.dispatch("saveStepModel", [this.model, 2, valid]);
    return valid;
  };

  public addClin(): void {
    this.model.clins.push({
      clin_number: `000${this.model.clins.length + 1}`,
      idiq_clin: "",
      total_clin_value: 0,
      obligated_funds: 0,
      pop_start_date: "",
      pop_end_date: "",
    });
  }

  public deleteClin(itemNumber: number): void {
    const index = itemNumber - 1;
    const clinLength = this.model.clins.length;
    if (clinLength && clinLength >= itemNumber) {
      this.model.clins.splice(index, 1);
    }
  }

  public stepMounted: () => Promise<void> = async () => {
    if (this.$route.name === "editfunding") {
      this.model = this.$store.getters.getTaskOrderByName(
        this.$route.params.id
      );
    }
    this.touched = this.$store.getters.getStepTouched(2);
    if (this.touched) {
      this.validate();
    }
  };
}
</script>
