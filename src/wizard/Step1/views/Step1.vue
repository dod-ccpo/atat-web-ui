<template>
  <div>
    <CreatePortfolioForm
      ref="createPortfolioForm"
      :name.sync="model.name"
      :description.sync="model.description"
      :dod_components.sync="model.dod_components"
    />
    <CloudServiceProvider
      class="pb-10"
      ref="cloudServiceProviderForm"
      :csp.sync="model.csp"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";

import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";
import CloudServiceProvider from "../components/CloudServiceProviderForm.vue";
import { CreatePortfolioFormModel } from "../../../../types/Wizard";

@Component({
  components: {
    CreatePortfolioForm,
    CloudServiceProvider,
  },
  mixins: [ValidatableWizardStep],
})
export default class Step_1 extends Vue {
  $refs!: {
    createPortfolioForm: CreatePortfolioForm;
    cloudServiceProviderForm: CloudServiceProvider;
  };

  private model: CreatePortfolioFormModel = {
    name: "",
    description: "",
    dod_components: [],
    csp: [],
  };
  public async validate(): Promise<boolean> {
    const createPortofolioValidation =
      this.$refs.createPortfolioForm.validateForm();
    const cloudServiceProviderValidation =
      this.$refs.cloudServiceProviderForm.validateForm();
    let valid = false;
    await Promise.all([
      createPortofolioValidation,
      cloudServiceProviderValidation,
    ]).then((values) => (valid = values.every((value) => value)));
    return valid;
  }
}
</script>
