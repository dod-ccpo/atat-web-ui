<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="my-6">
      <v-row>
        <v-col cols="10">
          <h2 class="h2">Let’s create your new application</h2>
          <p class="my-3">
            In this section, we’ll set up your cloud workspaces within
            <strong>&#60;CSP selected in Step 1&#62;</strong>. If you have more
            than one application, we will walk through them one at a time.
            Select <strong>Next</strong> to view your applications summary.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <atat-text-field
            id="application-name"
            label="Application Name"
            :rules="rules.applicationName"
            :value.sync="_application.name"
            :helpText="applicationNameHelpText"
          />

          <atat-text-area
            optional="true"
            id="application-details"
            label="Application Details"
            class="mt-16"
            :value.sync="_application.details"
            :helpText="applicationDetailsHelpText"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-divider class="mt-7"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <h2 class="h2">Add Environments</h2>
          <p class="my-3">
            Each Application can have multiple environments for the various
            stages of its life cycle. Production, Staging, Testing, and
            Development environments are included by default. However, you can
            add, edit, and delete environments based on the needs of your
            Application.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="9">
          <fieldset class="border-0">
            <legend class="body-lg">Environment Name</legend>
            <div
              v-for="env in _application.environments"
              :key="env.id"
              class="mb-4 border-0 w-100 d-flex align-end"
            >
              <atat-text-field
                :value.sync="env.name"
                :key="`env_${env.id}`"
                label=""
                :id="env.id"
                :error="env.error"
                :rules="env.errorMessages"
                :success="env.isDirty && !env.error"
                @change="onEnvironmentChanged(env.id)"
                manualValidation="true"
                :showDeleteIcon="true"
                class="width-80"
                @deleteTextBox="deleteEnvironment"
              >
              </atat-text-field>
            </div>

            <v-btn
              role="button"
              class="link-button font-weight-bold no-border mt-3 no-focus-shift"
              :ripple="false"
              @click="$emit('addEnvironment')"
            >
              <v-icon color="primary" class="mr-2 ml-n5" role="presentation"
                >control_point</v-icon
              >
              Add another environment
            </v-btn>
          </fieldset>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { CreateApplicationModel, CreateEnvironmentModel } from "types/Wizard";
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

@Component({})
export default class CreateApplicationForm extends Vue {
  @PropSync("application") _application!: CreateApplicationModel;
  private applicationNameHelpText = "example help text";
  private applicationDetailsHelpText = "example help text";
  private rules = {};

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public deleteEnvironment(id: string): void {
    this.$emit("removeEnvironment", id);
  }

  public validateEnvironment(env: CreateEnvironmentModel): void {
    let isValid = false;
    let errorMessages = [];

    // if (this._application.environments.length == 1 && env.name === "") {
    //   error = true;
    //   errorMessages.push(
    //     () =>
    //       (this._application.environments.length == 1 && env.name === "") ||
    //       "Please enter at least one environment."
    //   );
    // }

    // isValid = this._application.environments.length == 1 && env.name === "";


    isValid = env.name.length >= 4 && env.name.length <= 100;
    errorMessages.push(
      () => isValid || "Please enter between 4 and 100 characters"
    );

    // const duplicateNames = this._application.environments
    //   .filter((en) => en.name.toLowerCase() === env.name.toLowerCase())
    //   .sort((a, b) => (a.updated > b.updated ? 1 : -1));

    // if (duplicateNames.length > 1 && duplicateNames[0].updated != env.updated) {
    //   error = true;
    //   errorMessages.push("Please enter a unique environment name.");
    // }

    env.error = !isValid;
    env.errorMessages = isValid ? [] : errorMessages;
  }

  public async onEnvironmentChanged(id: string): Promise<void> {
    if (id) {
      const env = this._application.environments.find((en) => en.id === id);

      if (env) {
        env.updated = Date.now();
        env.isDirty = true;
        this.validateEnvironment(env);
      }
    }
  }

  private validateEnvironments() {
    this._application.environments.forEach((env) =>
      this.validateEnvironment(env)
    );
    return this._application.environments.every((env) => env.error === false);
  }

  public validationRules(): unknown[] {
    const validationRules: unknown[] = [];
    validationRules.push(
      (v: string) => !!v || "Please enter your Application name."
    );

    validationRules.push(
      (v: string) =>
        (v.length < 100 && v.length >= 4) ||
        "Please enter between 4 and 100 characters."
    );

    return validationRules;
  }

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.rules = {
      applicationName: this.validationRules(),
    };
    await this.$nextTick(() => {
      const formValidated = this.Form.validate();
      const environmentsValidated = this.validateEnvironments();
      validated = formValidated && environmentsValidated;
    });
    return validated;
  }
}
</script>
