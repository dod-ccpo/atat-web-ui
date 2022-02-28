<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="col-12">
          <h2>Let’s start with basic info about your new acquisition</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span
            >In this section, we will gather some overarching details about your
            project requirements, organization, and points of contact. This
            information will be used to complete your required acquisition forms
            and will also help us to guide you through the JWCC procurement
            process.</span
          >
          <div class="mt-10">
            <ATATTextField
              label="Project/Requirements Title"
              class="input-max-width"
              helpText="Provide a short, descriptive title of the work to be performed. This will be used to refer to this project within ATAT and across all acquisition forms."
            />
          </div>
          <div class="d-flex align-start flex-column mt-10 content-max-width">
            <span class="font-weight-bold"> What is the scope of your requirement? </span>
            <span
              >Briefly describe the type of resources and services to be
              acquired, and what is necessary to achieve mission specific
              outcomes for this particluar task (e.g., move DITCO’s contract
              writing system to a cloud environment).</span
            >
             <ATATTextArea
              label=""
              width="width-100"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import ATATTextField from "../components/ATATTextField.vue";
import ATATTextArea from "../components/ATATTextArea.vue";

import Vue from "vue";

import { Component } from "vue-property-decorator";

@Component({
  components: {
    ATATTextField,
    ATATTextArea
  },
})
export default class StepOne extends Vue {}
</script>

