<template>
  <v-form ref="form" lazy-validation class="body-lg">
    <div class="content-max-width">
      <h1 v-if="!isStepTouched" tabindex="-1">
        Let’s create your new application
      </h1>
      <p v-if="!isStepTouched">
        In this section, we will set up your cloud workspaces within
        {{ this.$store.getters.getPortfolio.csp }}. If you have more than one
        application, we will walk through them one at a time. Select
        <strong>Next</strong> to view your application summary.
      </p>
      <h1 v-if="isStepTouched" tabindex="-1">
        Let’s update your application details
      </h1>
      <p v-if="isStepTouched">
        The following information will be used to set up your application and
        environments within {{ this.$store.getters.getPortfolio.csp }}.
        <span v-if="!isReturnToReview"
          >Select <strong>Next</strong> when you are done making changes, or to
          skip to your application summary. From there, you can add additional
          applications to your portfolio, if needed.</span
        ><span v-if="isReturnToReview"
          >When you are done, select
          <strong>Return to Review and Submit</strong> to finalize your
          portfolio.</span
        >
      </p>
    </div>

    <section title="Application Details" role="region" class="input-max-width">
      <fieldset>
        <legend>Application Details</legend>
        <atat-text-field
          id="application-name"
          label="Application Name"
          :rules="rules.applicationName"
          :value.sync="_application.name"
          :helpText="applicationNameHelpText"
          :validate-on-load="validateOnLoad"
        />

        <atat-text-area
          optional="true"
          id="application-details"
          label="Application Details"
          class="mt-15"
          :value.sync="_application.description"
          :helpText="applicationDetailsHelpText"
        />
      </fieldset>
    </section>

    <atat-divider />

    <section title="Add Environments" role="region" class="content-max-width">
      <h2>Add Environments</h2>
      <p class="mb-7">
        Your application can have multiple environments for the various stages
        of its life cycle. Production, Staging, Testing, and Development
        environments are included by default. However, you can
        <strong>add</strong>, <strong>edit</strong>, and
        <strong>remove</strong>
        environments based on the needs of your application.
      </p>

      <fieldset class="input-max-width with-buttons-1">
        <legend class="body-lg mb-2">Environment Name</legend>
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
            class="width-100"
            @deleteItem="deleteEnvironment"
            :isDeleteDisabled="
              _application.environments.length === 1 &&
              _application.environments[0].name === ''
            "
            :validate-on-load="validateOnLoad"
          >
          </atat-text-field>
        </div>

        <v-btn
          class="link-button font-weight-bold no-border mt-3 no-focus-shift"
          :ripple="false"
          @click="$emit('addEnvironment')"
        >
          <v-icon color="primary" class="mr-2 ml-n5" aria-hidden="true"
            >control_point</v-icon
          >
          Add another environment
        </v-btn>
      </fieldset>
    </section>
  </v-form>
</template>

<script lang="ts">
import { CreateApplicationModel } from "types/Wizard";
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATDivider from "@/components/ATATDivider.vue";

@Component({
  components: {
    "atat-divider": ATATDivider,
  },
})
export default class CreateApplicationForm extends Vue {
  @PropSync("application") _application!: CreateApplicationModel;
  @Prop({ default: false }) private validateOnLoad!: boolean;

  private applicationNameHelpText = `This name will be displayed within the cloud provider’s console. It should be intuitive and easily recognizable for all of your team members.`;
  private applicationDetailsHelpText = `Add a brief one to two sentence description of your application. Consider using the “Description of Work” from your task order.`;

  private isReturnToReview = this.$store.getters.isReturnToReview;
  private isStepTouched = this.$store.getters.isStepTouched(3);
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
