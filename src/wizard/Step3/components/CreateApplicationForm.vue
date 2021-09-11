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
                :rules="rules.environments"
                :showDeleteIcon="true"
                class="width-80"
                @deleteItem="deleteEnvironment"
                :isDeleteDisabled="_application.environments.length === 1"
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

  get rules(): unknown {
    return {
      applicationName: [
        (v: string) => !!v || "Please enter your Application name.",
        (v: string) =>
          (v.trim().length <= 100 && v.trim().length >= 4) ||
          "Please enter between 4 and 100 characters.",
      ],
      environments: [
        (v: string) =>
          (v.trim().length <= 100 && v.trim().length >= 4) ||
          "Please enter between 4 and 100 characters.",
        (v: string) =>
          (this._application.environments.length > 0 && v !== "") ||
          "Please enter at least one environment.",
        (v: string) => {
          const duplicateNames = this._application.environments.filter(
            (en) => en.name.toLowerCase() === v.toLowerCase()
          );
          return (
            duplicateNames.length <= 1 ||
            "Please enter a unique environment name"
          );
        },
      ],
    };
  }

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public deleteEnvironment(id: string): void {
    this.$emit("removeEnvironment", id);
  }

  public async validateForm(): Promise<boolean> {
    let validated = false;

    await this.$nextTick(() => {
      const formValidated = this.Form.validate();
      validated = formValidated;
    });
    return validated;
  }
}
</script>
