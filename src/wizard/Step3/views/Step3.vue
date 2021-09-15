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
import { CreateApplicationModel, CreateEnvironmentModel } from "types/Wizard";
import ValidatableWizardStep from "@/mixins/ValidatableWizardStep";
import { Application, Environment } from "../../../../types/Portfolios";

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

  private applicationDetails: CreateApplicationModel =
    this.$store.getters.getStepModel(3);

  private onAddEnvironment(): void {
    this.applicationDetails.environments.push({
      id: generateUid(),
      name: "",
    });
  }

  private onRemoveEnvironment(id: string): void {
    if (this.applicationDetails.environments.length === 1) {
      this.applicationDetails.environments[0].name = "";
      return;
    }

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
  private mapEnvironmentToModel(env: Environment): CreateEnvironmentModel {
    return {
      name: env.name,
      id: env.id,
    };
  }

  public mounted(): void {
    const stepHasBeenTouched: boolean = this.$store.getters.getStepTouched(3);
    if (stepHasBeenTouched) {
      this.validate();
    }

    if (this.$route.name === "editapplication") {
      const application = this.$store.getters.getApplicationByID(
        this.$route.params.id
      ) as Application;

      if (application) {
        let environments =
          application.environments?.map<CreateEnvironmentModel>((env) =>
            this.mapEnvironmentToModel(env)
          ) || [];

        this.applicationDetails = {
          id: application.id,
          name: application.name,
          description: application.description,
          environments: environments,
        };
      }
    } else {
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
  }
}
</script>

<style scoped></style>
