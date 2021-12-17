<template>
  <div>
    <CreatePortfolioForm
      ref="createPortfolioForm"
      :name.sync="model.name"
      :description.sync="model.description"
      :dod_components.sync="model.dod_components"
      :validate-on-load="touched"
      :erroredFields.sync="erroredFields"
    />

    <atat-divider />

    <CloudServiceProvider
      class="pb-10"
      ref="cloudServiceProviderForm"
      :csp.sync="model.csp"
    />
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
// import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";

import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";
import CloudServiceProvider from "../components/CloudServiceProviderForm.vue";
import {
  CreatePortfolioFormModel,
  ErrorPanelMessages,
} from "../../../../../types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";
import ATATDivider from "@/components/ATATDivider.vue";

@Component({
  components: {
    CreatePortfolioForm,
    CloudServiceProvider,
    "atat-divider": ATATDivider,
  },
  // mixins: [ValidatableWizardStep],
})
export default class Step_1 extends ValidatableWizardStep<CreatePortfolioFormModel> {
  private erroredFields: ErrorPanelMessages[] = [];

  $refs!: {
    createPortfolioForm: CreatePortfolioForm;
    cloudServiceProviderForm: CloudServiceProvider;
  };

  model: CreatePortfolioFormModel =
    this.$store.getters["wizard/getStepModel"](1);

  get errorPanelMessages(): ErrorPanelMessages[] {
    return [
      { id: 0, display: false, message: "Portfolio Name" },
      { id: 1, display: false, message: "DoD Component" },
      { id: 2, display: false, message: "Cloud Service Provider" },
    ];
  }
  public async displayedErrorPanelMessages(): Promise<void> {
    this.getPanelErrorMessages();
    this.erroredFields = this.errorPanelMessages.filter((epm) => {
      return epm.display === true;
    });
  }
  public getPanelErrorMessages(): void {
    this.errorPanelMessages[0].display = this.displayErrorInPanel(
      "portfolio-name",
      "atat-text-field"
    );
    this.errorPanelMessages[1].display = this.displayErrorInPanel(
      "dod-component",
      "atat-checkbox-list"
    );
    this.errorPanelMessages[2].display = this.displayErrorInPanel(
      "cloud-service-provider",
      "atat-radio-button-cards"
    );
  }
  public displayErrorInPanel(selectorId: string, type: string): boolean {
    return (
      document.querySelector(
        "[id^='" + selectorId + "']." + type + " .error--text"
      ) !== null
    );
  }
  public validate: () => Promise<boolean> = async () => {
    const createPortofolioValidation =
      this.$refs.createPortfolioForm.validateForm();
    const cloudServiceProviderValidation =
      this.$refs.cloudServiceProviderForm.validateForm();
    this.valid = false;
    await Promise.all([
      createPortofolioValidation,
      cloudServiceProviderValidation,
    ]).then((values) => (this.valid = values.every((value) => value)));

    return this.valid;
  };

  public async mounted(): Promise<void> {
    setTimeout(() => {
      this.displayedErrorPanelMessages();
    }, 1000);
  }
}
</script>
