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
import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";
import CloudServiceProvider from "../components/CloudServiceProviderForm.vue";
import { CreatePortfolioFormModel, VoidCallback } from "types/Wizard";
import { Route } from "vue-router/types/router";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({
  components: {
    CreatePortfolioForm,
    CloudServiceProvider,
  },
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
  public async beforeRouteLeave(
    to: Route,
    from: Route,
    next: VoidCallback
  ): Promise<void> {
    if (to.name === "addapplication") {
      next();
      return;
    } else if (to.name === "applicationsummary") {
      next();
      return;
    } else if (to.name === "addteammembers") {
      next();
      return;
    } else if (to.name === "reviewandsubmit") {
      next();
      return;
    } else if (to.name === "portfolios") {
      next();
      return;
    } else if (to.name === "createportfolio") {
      next();
      return;
    }
    if (await this.validate()) {
      next();
    }
  }
}
</script>
