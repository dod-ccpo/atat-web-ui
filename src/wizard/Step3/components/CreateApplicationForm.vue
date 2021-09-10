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
            :rules="rules.portfolioName"
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
        <application-environments
          :environments="_application.environments"
        ></application-environments>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Application } from "types/Portfolios";
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import ApplicationEnvironments from "./ApplicationEnvironments.vue";

@Component({
  components: {
    ApplicationEnvironments,
  },
})
export default class CreateApplicationForm extends Vue {
  @PropSync("application") _application!: Application;
  private applicationNameHelpText = "example help text";
  private applicationDetailsHelpText = "example help text";
  private rules = {
    applicationName: [],
  };
}
</script>
