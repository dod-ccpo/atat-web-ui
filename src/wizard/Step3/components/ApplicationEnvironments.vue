<template>
  <v-container fluid class="my-6">
    <v-row>
      <v-col cols="10">
        <h2 class="h2">Add Environments</h2>
        <p class="my-3">
          Each Application can have multiple environments for the various stages
          of its life cycle. Production, Staging, Testing, and Development
          environments are included by default. However, you can add, edit, and
          delete environments based on the needs of your Application.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <fieldset class="border-0">
          <legend class="body-lg">Environment Name</legend>
          <atat-text-field
            v-for="(env, indx) in _environments"
            :key="indx"
            :value.sync="env.name"
            label=""
            class="mb-5"
          ></atat-text-field>
          <v-btn
            role="button"
            class="link-button font-weight-bold no-border mt-3 no-focus-shift"
            :ripple="false"
            @click="addNewEnvironment()"
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
</template>

<script lang="ts">
import { Environment } from "types/Portfolios";
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";

@Component({})
export default class ApplicationEnvironments extends Vue {
  @PropSync("environments") _environments!: Environment[];

  private addNewEnvironment(): void {
    this._environments.push({
      id: "",
      name: "",
      funding_source: [],
    });
  }
}
</script>
