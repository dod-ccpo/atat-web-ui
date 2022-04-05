<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Tell us about your FOIA Coordinator
          </h1>

          <ATATTextField
            id="FullName"
            class="_input-max-width mb-10"
            label="Full name"
            helpText="Include rank, if applicable"
          />

          <ATATTextField
            id="Email"
            class="_input-max-width"
            label="Email address"
            helpText="Enter a .mil or .gov email address."
          />



        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATRadioGroup,
    ATATTextField,
  },
})

export default class FOIACoordinator extends Vue {


}
</script>
