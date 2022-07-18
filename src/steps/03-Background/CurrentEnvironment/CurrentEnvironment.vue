<template>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Do you have an existing environment?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            If you select ‘Yes’ below, we’ll gather details about your current compute resources
            next. This info will be included in your Description of Work to provide CSPs with a
            better understanding of what currently exists. This environment may not align with your
            current needs for this acquisition, but you’ll have an opportunity to tell us about your
            performance requirements later.
          </p>
          <ATATRadioGroup
            id="TrainingOptions"
            :card="true"
            :items="existingEnvOption"
            :rules="[$validators.required('Please select an option')]"
            :value.sync="selectedOption"
            class="copy-max-width mb-10 max-width-740"
            width="180"

          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import { RadioButton } from "../../../../types/Global";

@Component({})
export default class CurrentEnvironment extends Vue {
  private selectedOption = "";
  private existingEnvOption: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No",
      label: "No.",
      value: "NO",
    },
  ];
}
</script>

