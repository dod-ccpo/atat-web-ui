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
// import { Application } from "types/Portfolios";
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

  private applicationDetails: CreateApplicationModel = {
    id: "",
    name: "",
    description: "",
    environments: [
      {
        id: generateUid(),
        name: "Development",
        updated: Date.now(),
        error: false,
        errorMessages: [],
        isDirty: false,
      },
      {
        id: generateUid(),
        name: "Testing",
        updated: Date.now(),
        error: false,
        errorMessages: [],
        isDirty: false,
      },
      {
        id: generateUid(),
        name: "Staging",
        updated: Date.now(),
        error: false,
        errorMessages: [],
        isDirty: false,
      },
      {
        id: generateUid(),
        name: "Production",
        updated: Date.now(),
        error: false,
        errorMessages: [],
        isDirty: false,
      },
    ],
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
}
</script>

<style scoped></style>
