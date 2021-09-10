<template>
  <create-application-form
    ref="createApplicationForm"
    :application.sync="applicationDetails"
    @addEnvironment="onAddEnvironment"
    @removeEnvironment="onRemoveEnvironment"
  ></create-application-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CreateApplicationForm from "../components/CreateApplicationForm.vue";
import { generateUid } from "@/helpers";
import { CreateApplicationModel } from "types/Wizard";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";

@Component({
  components: {
    CreateApplicationForm,
  },
  mixins: [ValidatableWizardStep],
})
export default class Step_3 extends Vue {
  $refs!: {
    createApplicationForm: CreateApplicationForm;
  };

  private defaultEnvironmentNames = [
    "Development",
    "Testing",
    "Staging",
    "Production",
  ];

  private applicationDetails: CreateApplicationModel = {
    id: "",
    name: "",
    description: "",
    // eslint-disable-next-line prettier/prettier
    environments: []
  };

  private onAddEnvironment(): void {
    this.applicationDetails.environments.push({
      id: generateUid(),
      name: "",
      updated: Date.now(),
      error: false,
      errorMessages: [],
      isDirty: false,
    });
  }

  private onRemoveEnvironment(id: string): void {
    if (this.applicationDetails.environments.length === 1) return;

    const envInd = this.applicationDetails.environments.findIndex(
      (env) => env.id === id
    );

    if (envInd > -1) {
      this.applicationDetails.environments.splice(envInd, 1);
    }
  }

  public async validate(): Promise<boolean> {
    let valid = false;
    valid = await this.$refs.createApplicationForm.validateForm();

    return valid;
  }

  public created(): void {
    // set up default environments
    this.defaultEnvironmentNames.forEach((name) => {
      this.applicationDetails.environments.push({
        id: generateUid(),
        name: name,
        updated: Date.now(),
        error: false,
        errorMessages: [],
        isDirty: false,
      });
    });
  }
}
</script>

<style scoped></style>
