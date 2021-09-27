<template>
  <div>
    <CreatePortfolioForm
      ref="createPortfolioForm"
      :name.sync="model.name"
      :description.sync="model.description"
      :dod_components.sync="model.dod_components"
      :validate-on-load="touched"
    />
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
import { CreatePortfolioFormModel } from "../../../../types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";

@Component({
  components: {
    CreatePortfolioForm,
    CloudServiceProvider,
  },
  // mixins: [ValidatableWizardStep],
})
export default class Step_1 extends ValidatableWizardStep<CreatePortfolioFormModel> {
  $refs!: {
    createPortfolioForm: CreatePortfolioForm;
    cloudServiceProviderForm: CloudServiceProvider;
  };
  private touched = false;
  private valid = true;

  model: CreatePortfolioFormModel = this.$store.getters.getStepModel(1);

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
  }

  protected saveModel: () => Promise<void> = async () => {
    await this.$store.dispatch("saveStepModel", [this.model, 1, this.valid]);
  }

  public stepMounted: () => Promise<void> = async () => {
    this.touched = this.$store.getters.getStepTouched(1);
    if (this.touched) {
      this.validate();
    }
  }
}
</script>
