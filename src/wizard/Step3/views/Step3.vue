<template>
  <create-application-form
    ref="createApplicationForm"
    :application.sync="model"
    :validate-on-load="touched"
    @addEnvironment="onAddEnvironment"
    @removeEnvironment="onRemoveEnvironment"
  ></create-application-form>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import CreateApplicationForm from "../components/CreateApplicationForm.vue";
import { generateUid } from "@/helpers";
import { CreateApplicationModel } from "types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";

@Component({
  components: {
    CreateApplicationForm,
  },
})
export default class Step_3 extends ValidatableWizardStep<CreateApplicationModel> {
  $refs!: {
    createApplicationForm: CreateApplicationForm;
  };

  model: CreateApplicationModel = this.$store.getters["wizard/getStepModel"](3);

  private onAddEnvironment(): void {
    this.model.environments.push({
      id: generateUid(),
      name: "",
      operators: [],
    });
  }

  private onRemoveEnvironment(id: string): void {
    if (this.model.environments.length === 1) {
      this.model.environments[0].name = "";
      return;
    }

    const envInd = this.model.environments.findIndex((env) => env.id === id);

    if (envInd > -1) {
      this.model.environments.splice(envInd, 1);
    }
  }

  public validate: () => Promise<boolean> = async () => {
    this.valid = false;
    this.valid = await this.$refs.createApplicationForm.validateForm();
    return this.valid;
  };

  public async mounted(): Promise<void> {
    this.touched = this.$store.getters["wizard/getStepTouched"](3);
    if (this.touched) {
      this.validate();
    }
  }
}
</script>

<style scoped></style>
