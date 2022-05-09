<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Do you require any specific training courses from your contractors?
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            Contractor employees may be required to take periodic mandatory training courses
            provided through the agency, such as records management training and other training
            required by statute, regulation, DoD, or local (e.g. DISA) policy. If your project
            requires specific training, we’ll gather details about these courses next.
          </p>
          <ATATRadioGroup
            class="copy-max-width mb-10 max-width-740"
            id="TrainingOptions"
            :card="true"
            :items="TrainingOptions"
            :value.sync="TrainingOptions"
            :rules="[$validators.required('Please select an option')]"
            width="180"

          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import vue from 'vue';
import { Component, Mixins } from "vue-property-decorator";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"
import { RadioButton } from "../../../types/Global";


@Component({
  components: {
    ATATRadioGroup,
  },
})

export default class TrainingPage1 extends vue {
  private TrainingOptions: RadioButton[] = [
    {
      id: "Yes",
      label: "Yes",
      value: "true",
    },
    {
      id: "No",
      label: "No.",
      value: "false",
    },
  ];


}
</script>
