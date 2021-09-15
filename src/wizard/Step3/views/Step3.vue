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

  private mapEnvironmentToModel(env: Environment): CreateEnvironmentModel {
    return {
      name: env.name,
      id: env.id,
    };
  }

  public mounted(): void {
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
      this.defaultEnvironmentNames.forEach((name) => {
        this.applicationDetails.environments.push({
          id: generateUid(),
          name: name,
        });
      });
    }
  }
}
</script>

<style scoped></style>
