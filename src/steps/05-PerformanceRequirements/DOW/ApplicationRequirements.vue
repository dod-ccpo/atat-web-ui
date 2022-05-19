<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            What type of {{ requirementName }} do you need?
          </h1>
          <div class="copy-max-width">
            <p id="CheckboxGroupLabel">
              Select all that apply to your contracting effort.
            </p>

            <ATATCheckboxGroup
              id="CheckboxGroup"
              aria-describedby="CheckboxGroupLabel"
              :value.sync="selectedOptions"
              :items="checkboxItems"
              :card="false"
              class="copy-max-width"
              :hasOtherValue="true"
              :otherValue="otherValue"
              :otherValueEntered.sync="otherValueEntered"
              :otherValueRequiredMessage="otherValueRequiredMessage"
              :rules="[
                $validators.required(requiredMessage)
              ]"
            />

          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import { Checkbox } from "../../../../types/Global";

@Component({
  components: {
    ATATCheckboxGroup,
  }
})

export default class ApplicationRequirements extends Vue {
  // requirementName will be pulled from data in future ticket
  public requirementName = "Application Requirements";

  public requiredMessage = `Please select at least one type of offering. If you
    no longer need ${this.requirementName}, select the “I don’t need
    these cloud resources” button below.`;

  public otherValueRequiredMessage = "Please enter a title for this requirement."
  public otherValue = "OTHER";
  public otherValueEntered = "";
  public otherSelected = "";

  @Watch("selectedOptions")
  public selectedOptionsChange(newVal: string[]): void {
    this.otherSelected = newVal.indexOf(this.otherValue) > -1 ? "true" : "false";
  }

  public selectedOptions: string[] = [];

  // checkboxItems will be pulled from data in future ticket
  private checkboxItems: Checkbox[] = [
    {
      id: "Application", // may need to create ids (for Cypress) on the fly
      label: "Application",
      value: "Application",
    },
    {
      id: "WebApp",
      label: "Web App",
      value: "Web App",
    },
    {
      id: "Database",
      label: "Database",
      value: "Database",
    },
    {
      id: "MonitoringTools",
      label: "Monitoring Tools",
      value: "Monitoring Tools",
      description: "Requires a waiver from DISA CIO",
    },
    {
      id: "PaaS",
      label: "Discrete Platform as a Service (PaaS)",
      value: "Discrete Platform as a Service (PaaS)",
    },
    {
      id: "SaaS",
      label: "Discrete Software as a Service (SaaS)",
      value: "Discrete Software as a Service (SaaS)",
    },
    // "Other" will be an option for all requirements and may not come from the store?
    // -- to be addressed in future ticket
    {
      id: "Other",
      label: "Other",
      value: this.otherValue,
    }
  ];

}

</script>
