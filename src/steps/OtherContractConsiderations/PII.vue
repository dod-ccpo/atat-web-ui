<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s find out if your effort provides for Personally Identifiable Information
          </h1>

          <ATATAlert 
            id="FairOpportunityAlert"
            type="info" 
            :showIcon="false" 
            class="copy-max-width my-10"
          >
            <template v-slot:content>
              <h2>Personally Identifiable Information (PII)</h2>
              <p class="mt-2 mb-0">
                PII is information about an individual which identifies, links, relates, or is 
                unique to an individual. Examples include social security number, age, military 
                rank, civilian grade, etc. that can be used to distinguish or track an individual’s 
                identity.
              </p>
            </template>
          </ATATAlert>

          <ATATRadioGroup
            class="copy-max-width mb-10"
            id="ExceptionRadioOptions"
            legend="Does this effort provide for the design, development, or operation of a system
              of records on individuals by the contractor (in whole or in part)?"
            :items="pIIOptions"
            :value.sync="selectedPIIOption"
          />

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue"

import { RadioButton } from "../../../types/Global";

@Component({
  components: {
    ATATAlert,
    ATATRadioGroup,
  },
})

export default class PII extends Vue {
  private selectedPIIOption = "";
  private pIIOptions: RadioButton[] = [
    {
      id: "YesPII",
      label: "Yes. This contract action will include a system of records with PII.",
      value: "Yes",
    },
    {
      id: "NoPII",
      label: "No.",
      value: "No",
    },
  ];
}
</script>
