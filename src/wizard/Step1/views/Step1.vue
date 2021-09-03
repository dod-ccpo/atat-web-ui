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
import { Component, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import CreatePortfolioForm from "../components/CreatePorfolioForm.vue";
import CloudServiceProvider from "../components/CloudServiceProviderForm.vue";
import {
  CreatePortfolioFormModel,
  WizardNavigation,
  WizardStepNames,
} from "../../../../types/Wizard";

// Register the router hooks with their names
Component.registerHooks(["beforeRouteLeave"]);
@Component({
  components: {
    CreatePortfolioForm,
    CloudServiceProvider,
  },
  computed: {
    ...mapState({
      wizardNavigation: "wizardNavigation",
    }),
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

  public mounted(): void {
    //updates the current wizard step in the store
    this.$store.dispatch("updateWizardStep", WizardStepNames.addportolioStep());
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
