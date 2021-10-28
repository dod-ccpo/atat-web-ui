<template>
  <div>
    <CreatePortfolioForm
      ref="createPortfolioForm"
      :name.sync="model.name"
      :description.sync="model.description"
      :dod_components.sync="model.dod_components"
      :validate-on-load="touched"
    />
    <div class="py-10">
      <v-row>
        <v-col col col-sm-8 col-md-6 cols="4">
          <v-divider></v-divider>
        </v-col>
      </v-row>
    </div>
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
  };
}
</script>
