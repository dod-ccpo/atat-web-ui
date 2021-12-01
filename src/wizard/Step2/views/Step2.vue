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
      :erroredFields.sync="erroredFields"
    />
  </v-flex>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";
import { ErrorPanelMessages, TaskOrderModel } from "../../../../types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";

@Component({
  components: {
    CreateTaskOrderForm,
  },
})
export default class Step_2 extends ValidatableWizardStep<TaskOrderModel> {
  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };

  model: TaskOrderModel = this.$store.getters.getStepModel(2);
  private erroredFields: ErrorPanelMessages[] = [];

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

  get errorPanelMessages(): ErrorPanelMessages[] {
    return [
      { id: 0, display: false, message: "Task Order Number" },
      { id: 1, display: false, message: "Upload your approved task order" },
      { id: 2, display: false, message: "Verify your signed task order" },
      { id: 3, display: false, message: "CLIN Number" },
      { id: 4, display: false, message: "Corresponding IDIQ CLIN" },
      { id: 5, display: false, message: "Total CLIN Value" },
      { id: 6, display: false, message: "Obligated Funds" },
      { id: 7, display: false, message: "Period of Performance" },
    ];
  }

  public async displayedErrorPanelMessages(): Promise<void> {
    console.log(this.errorPanelMessages);
    this.getclinCardPanelErrorMessages();
    this.erroredFields = this.errorPanelMessages.filter((epm) => {
      return epm.display === true;
    });
  }

  public getclinCardPanelErrorMessages(): void {
    this.errorPanelMessages[0].display = this.displayErrorInPanel(
      "task-order-number_text_field",
      "atat-text-field"
    );
    this.errorPanelMessages[3].display = this.displayErrorInPanel(
      "clin-number_text_field",
      "atat-text-field"
    );
    this.errorPanelMessages[4].display = this.displayErrorInPanel(
      "clin-idiq",
      "atat-select"
    );
    this.errorPanelMessages[5].display = this.displayErrorInPanel(
      "total_clin_value",
      "atat-text-field"
    );
    this.errorPanelMessages[6].display = this.displayErrorInPanel(
      "obligated_funds",
      "atat-text-field"
    );
    this.errorPanelMessages[7].display = this.displayErrorInPanel(
      "clin-datepicker-text-boxes-datepicker",
      "atat-date-picker"
    );
  }

  public displayErrorInPanel(selectorId: string, type: string): boolean {
    return (
      document.querySelector(
        "[id^='" + selectorId + "']." + type + " .error--text"
      ) !== null
    );
  }

  public async mounted(): Promise<void> {
    console.log("hi");
    // if (this.touched) {
      console.log("touched")
      await this.displayedErrorPanelMessages();
      console.log(document.querySelectorAll("input"));
      Array.from(await document.querySelectorAll("input")).forEach((input) => {
        console.log(input);
        input.addEventListener("input", this.displayedErrorPanelMessages);
      });
    // }
  }
}
</script>
