<template>
  <v-flex>
    <CreateTaskOrderForm
      ref="createTaskOrderForm"
      :task_order_number.sync="taskOrderDetails.task_order_number"
      :task_order_file.sync="taskOrderDetails.task_order_file"
      :clins.sync="taskOrderDetails.clins"
      @add="addClin"
      @delete="deleteClin"
    />
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";
import { TaskOrderDetails, WizardNavigation } from "../../../../types/Wizard";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";

@Component({
  components: {
    CreateTaskOrderForm,
  },
  mixins: [ValidatableWizardStep],
})
export default class Step_2 extends Vue {
  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };

  private taskOrderDetails: TaskOrderDetails = this.$store.getters.getStepModel(2);

  public async validate(): Promise<boolean> {
    let valid = false;
    valid = await this.$refs.createTaskOrderForm.validateForm();
    this.$store.dispatch("saveStepModel", [this.taskOrderDetails, 2, valid]);
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
    const index = itemNumber - 1;
    if (this.taskOrderDetails.clins.length >= itemNumber) {
      this.taskOrderDetails.clins.splice(index, 1);
    }
  }

  public mounted(): void {
    if (this.$route.name === "editfunding") {
      this.taskOrderDetails = this.$store.getters.getTaskOrderByName(
        this.$route.params.id
      );
    }
    const stepHasBeenTouched: boolean = this.$store.getters.getStepTouched(2);
    if (stepHasBeenTouched) {
      this.validate();
    }
  }

  // this store change will only be triggered by the wizard buttons next/previous
  // @Watch("wizardNavigation")
  // async onNextStepChanged(navigation: WizardNavigation): Promise<void> {
  //   switch (navigation.action) {
  //     case "next":
  //       if (await this.validate()) {
  //         this.$router.push({ name: navigation.step });
  //       }
  //       break;
  //     case "previous":
  //       this.$router.push({ name: navigation.step });
  //       break;
  //   }
  // }
}
</script>
