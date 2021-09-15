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

  private applicationDetails: CreateApplicationModel = this.$store.getters.getStepModel(3);

  private onAddEnvironment(): void {
    this.applicationDetails.environments.push({
      id: generateUid(),
      name: "",
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
    this.$store.dispatch("saveStepModel", [this.applicationDetails, 3, valid]);
    return valid;
  }

  public created(): void {
    // set up default environments
    if (this.applicationDetails.environments.length === 0) {
      this.defaultEnvironmentNames.forEach((name) => {
        this.applicationDetails.environments.push({
          id: generateUid(),
          name: name,
        });
      });
    }
  }

  public mounted(): void {
    const stepHasBeenTouched: boolean = this.$store.getters.getStepTouched(3);
    if (stepHasBeenTouched) {
      this.validate();
    }
  }


}
</script>

<style scoped></style>
