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
import { CreateApplicationModel, CreateEnvironmentModel } from "types/Wizard";
import ValidatableWizardStep from "../../ValidatableWizardStep.vue";
import { Application, Environment } from "../../../../types/Portfolios";

@Component({
  components: {
    CreateApplicationForm,
  },
})
export default class Step_3 extends ValidatableWizardStep<CreateApplicationModel> {
  $refs!: {
    createApplicationForm: CreateApplicationForm;
  };

  private defaultEnvironmentNames = [
    "Development",
    "Testing",
    "Staging",
    "Production",
  ];

  model: CreateApplicationModel = this.$store.getters.getStepModel(3);

  private onAddEnvironment(): void {
    this.model.environments.push({
      id: generateUid(),
      name: "",
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
  }

  private mapEnvironmentToModel(env: Environment): CreateEnvironmentModel {
    return {
      name: env.name,
      id: env.id,
    };
  }

  public async mounted(): Promise<void> {
    this.touched = this.$store.getters.getStepTouched(3);
    if (this.touched) {
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

        this.model = {
          id: application.id,
          name: application.name,
          description: application.description,
          environments: environments,
        };
      }
    } else {
      // set up default environments
      if (this.model.environments.length === 0) {
        this.defaultEnvironmentNames.forEach((name) => {
          this.model.environments.push({
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
