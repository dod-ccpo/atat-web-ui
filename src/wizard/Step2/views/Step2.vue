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

  public async validate(): Promise<boolean> {
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
  }

  // this store change will only be triggered by the wizard buttons next/previous
  @Watch("wizardNavigation")
  async onNextStepChanged(navigation: WizardNavigation): Promise<void> {
    switch (navigation.action) {
      case "next":
        if (await this.validate()) {
          this.$router.push({ name: navigation.step });
        }
        break;
      case "previous":
        this.$router.push({ name: navigation.step });
        break;
    }
  }
}
</script>
